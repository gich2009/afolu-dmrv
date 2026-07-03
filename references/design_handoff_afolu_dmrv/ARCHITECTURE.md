# Architecture & Engineering Spec — AFOLU dMRV Platform

This document translates the prototype + concept note into a buildable system. Pair it with `README.md` (UI spec) and `design/data.js` (data shapes).

---

## 1. System overview — the three-engine pipeline

```
            ┌─────────── INGESTION (Google Earth Engine) ───────────┐
 Satellite ─┤ Sentinel-2/1, Landsat, GEDI, Planet, Hansen, iSDAsoil,│
 + field   │ CHIRPS, ERA5, MODIS … → cloud-mask, reproject,         │
 sources   │ normalise → analysis-ready COG raster stacks → GCS     │
            └───────────────────────┬───────────────────────────────┘
                                     │  (Pub/Sub on new export)
                          ┌──────────▼───────────┐
                          │  Cloud Run: AGBD       │  router (env var):
                          │  inference router      │  ① Space Intelligence API
                          └──────────┬─────────────┘  ② Lang CHM+Chloris+allometric (fallback)
                                     │                ③ internal ML (Phase 2–3)
   ┌─────────────────┐   ┌───────────▼───────────┐   ┌──────────────────┐
   │ 1. MEASUREMENT  │──▶│ 2. CARBON ACCOUNTING   │──▶│ 3. COMPLIANCE     │
   │ AGBD @10m + UQ, │   │ VM0048+ logic: baseline│   │ additionality,    │
   │ hybrid field    │   │ leakage, additionality,│   │ permanence, FPIC, │
   │ calibration,    │   │ credit forecast (lower │   │ risk, dossier,    │
   │ change detection│   │ CI for issuance)       │   │ AI PDD generator  │
   └─────────────────┘   └────────────────────────┘   └──────────────────┘
        │ PostGIS (carbon pools, audit log)   │ InfluxDB (time series)   │
        └──────────────── React web app (this prototype) ───────────────┘
                          + offline-first mobile field app
```

The engines run **sequentially** per monitoring cycle. The GEE export is the only manual step in Phase 1; everything downstream is event-driven (Pub/Sub → Cloud Run).

---

## 2. Recommended tech stack (from the concept note)
| Layer | Technology |
|---|---|
| Web frontend | **React** (Vite or Next.js). Port the prototype's screens. |
| Mobile field app | **React Native** or **Flutter** — offline-first (KoboCollect / Survey123 / ArcGIS Field Maps integration) |
| Backend API | **Python FastAPI** (primary); Node.js for event-driven pipeline glue |
| EO / geospatial | **Google Earth Engine** (primary), GDAL/Rasterio, Sentinel Hub API, Planet API |
| ML / AI | TensorFlow / PyTorch (biomass), scikit-learn (calibration/baseline regression) |
| Spatial DB | **PostgreSQL + PostGIS** |
| Time-series DB | **InfluxDB** (carbon-stock & monitoring series) |
| Object store / data lake | **Google Cloud Storage** (GeoTIFF/COG rasters, documents) |
| Cloud / infra | **Google Cloud Platform** — Cloud Run, GKE, Docker/Kubernetes |
| Biomass data APIs | Space Intelligence (HabitatMapper™, CarbonMapper™); Chloris Geospatial (fallback) |
| PDD authoring | Verst Carbon **AI PDD Generator** (existing LLM service) |

> GCP is preferred specifically because GEE exports to GCS natively — keep the whole stack on GCP to avoid cross-cloud egress. Apply to **Google for Startups** (up to $100k credits) before provisioning.

---

## 3. Recommended repo scaffold
```
afolu-dmrv/
├── frontend/                 # React web app — recreate the prototype here
│   ├── src/
│   │   ├── views/            # Portfolio, Project, Measurement, Accounting, Compliance, Pipeline, Field
│   │   ├── components/       # charts (Donut, Gauge, BaselineChart…), Badge, Stat, PanelHead, MapHero
│   │   ├── map/              # Leaflet/Mapbox/deck.gl wrapper (replaces canvas prototype)
│   │   ├── api/              # typed client for the FastAPI endpoints below
│   │   ├── state/            # routing + selected-project + preferences
│   │   └── theme/            # design tokens from README (CSS vars / theme object)
├── api/                      # FastAPI services
│   ├── projects/             # CRUD, portfolio rollups, stages
│   ├── measurement/          # AGBD maps, uncertainty, change events, calibration
│   ├── accounting/           # methodology engine (see §5), baseline, leakage, forecast
│   ├── compliance/           # risk scoring, FPIC, sign-off queue, dossier, PDD handoff
│   └── field/                # field submissions ingest + sync
├── pipeline/                 # EO ingestion + inference router
│   ├── gee/                  # per-AOI export scripts (raster stacks → GCS COGs)
│   ├── router/               # Cloud Run service: SI API ↔ fallback ↔ internal ML
│   └── ml/                   # biomass model training + inference (Phase 2–3)
├── mobile/                   # React Native / Flutter offline field app
├── infra/                    # Terraform / GCP config, Docker, K8s manifests, Pub/Sub
└── docs/                     # this handoff
```

---

## 4. Core data model (derive schemas from `design/data.js`)

**Project** (PostGIS — boundary as `geometry(Polygon,4326)`):
`id, code (VC-KE-001…), name, region, country, type (REDD+|ARR|Agroforestry|Blue Carbon), methodology, stage (Onboarding|Baseline|Implementation|Monitoring|Verification), boundary geom, area_ha, registry, crediting_period, lat, lng`.

**Carbon (per project per cycle):**
`agbd {mean, lo, hi} Mg/ha, carbon_stock tCO2e, credit_forecast tCO2e/yr, uncertainty_pct, baseline_rate %/yr, leakage_pct, additionality, pools {agb,bgb,soc,dead}, series[], baseline_series[]`.

**Time series (InfluxDB):** annual carbon stock, baseline trajectory, AGBD per pixel summarised.

**Change events:** `id, kind (Loss|Gain), area, ha, sigma, date, source, action`.

**Compliance:** modules[{key,label,status}], sign-off queue[{id,project,type,clause,severity,age,source,text}], risk{permanence,reversal,leakage,fire}, dossier %, pdd sections.

**Pipeline:** stages[{key,label,status,detail}], sources[{name,provider,res,cadence,cost,status,latency}], router{active,fallback,internal}.

**Field submission:** `id, plot, form_type, enumerator, tree_count, gps, timestamp, sync_status`.

---

## 5. The methodology engine (Carbon Accounting)
Codify each methodology as a **versioned, auditable module** (concept note §6). Phase-1 anchor is **VM0048**; the engine exposes a methodology selector. Each module computes the same contract:

```
baseline_scenario → project_carbon_stock → leakage → net_additionality → credit_forecast
```

Conservative issuance = **lower bound of the 90% CI** (VM0048 §5.3). Log every parameter, emission factor, allometric equation and methodology choice with a full **audit trail** for VVB review. The prototype's `METHODS` catalog + `methodSteps()` in `design/views2.jsx` enumerate the standards to support: VM0048, VM0047, VM0042, VM0007, VM0033, VM0032, ART TREES, GS4GG — build the abstraction layer so new methodologies are config + a module, not a rewrite.

---

## 6. API surface (FastAPI — indicative)
```
GET  /portfolio                       → rollups + project list
GET  /projects/{id}                   → project + carbon summary
GET  /projects/{id}/measurement       → AGBD layers, uncertainty, change events, calibration
GET  /projects/{id}/accounting?method=VM0048   → baseline, leakage, forecast rows, codified steps
GET  /projects/{id}/compliance        → modules, risk, dossier, PDD status
GET  /projects/{id}/tiles/{layer}/{z}/{x}/{y}  → AGBD/forest/change raster tiles
GET  /pipeline                        → stage status, source register, router config
POST /field/submissions               → ingest offline field records (idempotent on id)
POST /accounting/{id}/forecast        → recompute credit forecast
POST /compliance/{id}/signoff/{qid}   → clear a sign-off queue item
POST /compliance/{id}/pdd             → hand structured data to the AI PDD Generator
```
External integrations: **Google Earth Engine** (`earthengine.googleapis.com`), **Cloud Run**, **Cloud SQL Admin** (PostGIS), **Cloud Storage**, **Pub/Sub**, **Cloud Build**, **Artifact Registry**; **Space Intelligence API**, **Chloris API**, **AI PDD Generator**.

---

## 7. Build sequence (maps to the concept note's phased roadmap)
**Phase 1 · MVP (Mo 1–9):** GCP+GEE provisioned; EO ingestion → GCS; AGBD via SI API with fallback router; VM0048 codified; portfolio + project + measurement + accounting web views on real data; credit-forecast & PDD-draft export; one Kenya/Uganda pilot end-to-end. *Success criterion: a VVB-ready PDD output.*
**Phase 2 · Hybrid MRV & smallholders (Mo 9–18):** field-plot calibration regression; offline mobile app; FPIC & benefit-sharing modules; second methodology (VM0047); multi-methodology abstraction layer.
**Phase 3 · Compliance intelligence (Mo 18–30):** AI additionality/permanence + sign-off; automated leakage-belt monitoring; auto-generated PDD sections; verification-dossier builder; VVB trust layer; optional internal embeddings (Prithvi/SatMAE++) to remove vendor API dependence.

## 7b. Biodiversity & co-benefits integration (non-GEE)
Carbon is necessary but not sufficient — co-benefit evidence drives **CCB / SD VISta** labels and premium pricing. Two **non-GEE API** integrations feed the Biodiversity view:

**EarthRanger** (Allen Institute / Ai2 — free, open-source, Django/Python, REST API):
- Data model mirrors EarthRanger's own: **subjects** (tracked animals/assets), **observations** (time-sequential GPS tracks from collars), **events** (singular human/sensor records — sightings, snares, human-wildlife conflict, camera-trap detections, carcasses, gunshots). The API returns **GeoJSON** — render directly as map layers.
- Integration pattern: pull via the EarthRanger REST API (or **Gundi**, their integration gateway; **Ecoscope** for analytics). Poll events/observations on a schedule (near-real-time, ~5 min) into a `biodiversity` service; store events in PostGIS, tracks summarised in InfluxDB. Per-project rollups: intactness, species count, IUCN-threatened count, observation volume, patrol coverage.
- Each protected area/landscape runs its own EarthRanger site → store a per-project EarthRanger base URL + API token (secret-managed).

**Earth Map** (FAO-Google) + **WDPA/KBA**:
- Earth Map is GEE-backed for most layers, but bundles **value-added & non-GEE national datasets**. Ingest the relevant thematic layers: **Land Productivity Dynamics**, **land degradation (SDG 15.3.1 / Trends.Earth)**, **Biodiversity Intactness Index**. These reinforce baseline/additionality context and habitat co-benefits.
- **WDPA / KBA** (Protected Planet, UNEP-WCMC) — protected-area & Key Biodiversity Area vector overlap, pulled as GeoJSON/shapefile, intersected with project boundary in PostGIS.
- Where a layer IS in GEE, prefer computing it in the existing pipeline; only stand up a separate API pull for genuinely non-GEE products.

**New endpoints:** `GET /projects/{id}/biodiversity` (rollups, indicator species, habitat layers, SDG tags) · `GET /projects/{id}/biodiversity/events?since=` (EarthRanger event feed) · `GET /projects/{id}/biodiversity/tracks` (collar GeoJSON). Pipeline register gains 3 non-GEE sources (see `design/data.js` → `pipeline.sources` with `nonGee: true`).

## 8. What this package does NOT include
Trained biomass ML models · registry/VVB credentials & contracts · Space Intelligence / Chloris API keys · live EO compute · production auth/RBAC · the AI PDD Generator service. These are the engineering build, not design artifacts.
