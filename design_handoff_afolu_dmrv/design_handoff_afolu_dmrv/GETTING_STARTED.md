# Getting Started — AFOLU dMRV Platform (Engineering)

> Read **README.md** (UI spec) and **ARCHITECTURE.md** (system spec) first. This document tells a new engineer how to stand up the repo and what to build, in order.

## 0. Prerequisites
- **GCP account** with billing (apply for **Google for Startups Cloud Program** credits before provisioning — up to $100k/yr).
- **Google Earth Engine** access (a service account registered for EE; commercial/Cloud project for production).
- Tooling: Node ≥ 20, Python ≥ 3.11, `gcloud` CLI, Docker, Terraform (optional), `uv`/`poetry` for Python deps, `pnpm`/`npm` for JS.
- Accounts/keys to request early (non-blocking — fallbacks exist): **Space Intelligence** API, **Chloris** API, **EarthRanger** site URL + token, **Planet** API. Store all secrets in **Google Secret Manager**.

## 1. Repo layout
Initialise a monorepo per the scaffold in `ARCHITECTURE.md §3`:
```
afolu-dmrv/  →  frontend/  api/  pipeline/  mobile/  infra/  docs/
```
Copy `docs/` from this handoff folder. Put the prototype in `docs/prototype/` as the visual reference (do not ship it).

## 2. Frontend (recreate the prototype)
1. `npm create vite@latest frontend -- --template react-ts` (or Next.js if SSR is wanted).
2. Add the **design tokens** from `README.md` as CSS variables (dark + light) and a small theme provider. Honour density + accent + font.
3. Bring in a component lib for primitives, or port: `Badge, Dot, Stat, PanelHead, Donut, Gauge, Bar, Spark, BaselineChart, HBars` (see `design/ui.jsx`). Charts → Recharts/visx or port the SVG.
4. Replace the canvas `MapHero` with **MapLibre/Mapbox GL** or **deck.gl**: dark basemap, project boundary (GeoJSON), 10 km leakage belt, control plots, change markers, AGBD raster tiles, and the **wildlife overlay** (EarthRanger tracks + events). Keep the HUD (legend, scale bar, coordinate readout, zoom controls).
5. Build the 9 views (Portfolio, Project, Measurement, Accounting, Compliance, **Biodiversity**, Pipeline, Field) against the typed API client. Add URL routing for view + selected project. Wire the methodology dropdown and the monitoring-cycle walkthrough.

## 3. API (FastAPI)
1. Scaffold FastAPI with routers per `ARCHITECTURE.md §3/§6`: `projects, measurement, accounting, compliance, biodiversity, pipeline, field`.
2. Implement against **DATA_MODEL.md** (PostGIS + InfluxDB) and **API_SPEC.md** (payloads). Use the mock shapes in `design/data.js` as the response contract while the pipeline is still being built — this lets frontend + backend proceed in parallel.
3. Auth: start with GCP IAP or Firebase Auth; add workspace/project RBAC.

## 4. Pipeline (EO + inference router)
1. `pipeline/gee/` — per-AOI Earth Engine export scripts → analysis-ready **COG** stacks in GCS. Trigger Pub/Sub on completion.
2. `pipeline/router/` — Cloud Run service exposing one **AGBD inference** interface with a single env-var switch: `INFERENCE_BACKEND = space_intelligence | fallback | internal`. `fallback` = Lang CHM + Chloris + allometric. This makes the build independent of commercial API contracts.
3. `pipeline/ml/` — (Phase 2–3) biomass model training + hybrid field-calibration regression.
4. `biodiversity` ingestion worker — poll **EarthRanger** REST API (events/observations as GeoJSON) + pull **Earth Map/FAO** and **WDPA/KBA** layers; intersect with project boundary; write rollups.

## 5. Build order (critical path)
1. **Data model + API skeleton returning mock shapes** → unblocks frontend immediately.
2. **GEE export → GCS** for one pilot AOI.
3. **Inference router on fallback backend** → first real AGBD map.
4. **Measurement view on real data** (AGBD + uncertainty + change detection).
5. **VM0048 accounting engine** (see `ARCHITECTURE.md §5`) → credit forecast.
6. **Compliance assembly + PDD export.**
7. **EarthRanger + Earth Map ingestion → Biodiversity view.**
8. **Field mobile app + sync.**
9. Swap inference router to **Space Intelligence** once contracted.

## 6. Definition of done for Phase 1 (MVP)
A single Kenya/Uganda pilot runs the full loop end-to-end and produces a **VVB-ready PDD draft + monitoring report**, with every parameter logged to the audit trail. See **PROJECT_PLAN.md** for the sprint breakdown and go-live checklist.

## 7. Environment variables (indicative)
```
GEE_SERVICE_ACCOUNT, GEE_PROJECT, GCS_BUCKET, GCP_PROJECT
DATABASE_URL (PostGIS), INFLUX_URL, INFLUX_TOKEN
INFERENCE_BACKEND, SI_API_KEY, CHLORIS_API_KEY, PLANET_API_KEY
EARTHRANGER_BASE_URL, EARTHRANGER_TOKEN     # per project
PDD_GENERATOR_URL                            # existing Verst LLM service
```
All secrets via **Google Secret Manager**, never committed.
