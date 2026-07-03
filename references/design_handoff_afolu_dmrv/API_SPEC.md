# API Specification — AFOLU dMRV Platform

REST API served by **FastAPI**. JSON over HTTPS. All list endpoints paginate (`?limit&offset`). Auth via bearer token (GCP IAP / Firebase). Response shapes mirror `design/data.js` — use that file as the canonical fixture while building.

Base path: `/api/v1`

---

## Conventions
- IDs are slugs (`tsavo-east`) or codes (`VC-KE-001`).
- Money/credits in **tCO₂e**; areas in **ha**; AGBD in **Mg/ha**.
- Timestamps ISO-8601 UTC. Geometries **GeoJSON** (EPSG:4326).
- Every accounting/compliance mutation writes an **audit record** (`who, when, what, methodology_version, params`).

---

## Projects & portfolio
```
GET /portfolio
→ { totals:{area_ha, carbon_stock, annual_forecast, issued, buffer_pool,
            active_projects, countries, avg_uncertainty},
    composition:[{type, area_ha}],
    projects:[ProjectSummary] }

GET /projects/{id}
→ Project (boundary GeoJSON, stage, methodology, registry, crediting_period,
           carbon:{stock, forecast, agbd:{mean,lo,hi}, uncertainty_pct,
                   baseline_rate, leakage_pct, additionality,
                   pools:{agb,bgb,soc,dead}, series[], baseline_series[]},
           sources:[string], risk, dossier_pct)

POST /projects                 # enrol
PATCH /projects/{id}           # update stage/metadata
```

## Measurement Engine
```
GET /projects/{id}/measurement
→ { agbd:{mean,lo,hi}, histogram:[float],
    calibration:{r2, points:[[eo,field]]},
    change_events:[{id, kind:Loss|Gain, area, ha, sigma, date, source, action}],
    model_card:{approach, predictors[], uq, resolution, accuracy} }

GET /projects/{id}/tiles/{layer}/{z}/{x}/{y}.png   # layer: agbd|change|forest|terrain
GET /projects/{id}/boundary.geojson
```

## Carbon Accounting Engine
```
GET  /methodologies
→ [{id:VM0048, short, name, registry, status}]   # VM0048,VM0047,VM0042,VM0007,VM0033,VM0032,ART-TREES,GS4GG

GET  /projects/{id}/accounting?method=VM0048
→ { method, summary:{gross, leakage, net, issuance_lower_ci},
    forecast:[{vintage, gross, leakage, net, issuance_lower_ci}],
    steps:[{n, title, detail, value}],          # codified methodology logic
    audit:[{param, value, source, ts}] }

POST /projects/{id}/accounting/forecast         # recompute (body: assumptions)
```

## Compliance Engine
```
GET  /projects/{id}/compliance
→ { modules:[{key,label,status:pass|warn|progress,note}],
    risk:{permanence,reversal,leakage,fire},      # 0–100
    dossier:{pct, sections:[{name, pct}]},
    pdd:{sections_done, sections_total} }

GET  /projects/{id}/compliance/signoff
→ [{id, project, type, clause, severity:high|med|low, age, source, text}]
POST /projects/{id}/compliance/signoff/{qid}      # body: {decision, note}
POST /projects/{id}/compliance/pdd                # → AI PDD Generator; returns draft ref
GET  /projects/{id}/compliance/dossier.zip        # VVB-ready export
```

## Biodiversity & co-benefits (non-GEE)
```
GET /projects/{id}/biodiversity
→ { intactness, intactness_delta, species_count, iucn_flagged,
    observations_30d, events_30d, snares_30d, hwc_30d, patrol_coverage,
    earthranger:{site, subjects, active_collars, patrols_active},
    species:[{name, sci, iucn:CR|EN|VU|NT|LC, count, trend, collared}],
    land_layers:[{key,label,value,pct,source}],   # Earth Map / FAO / WDPA
    sdgs:[int] }

GET /projects/{id}/biodiversity/events?since=&cat=   # EarthRanger events
→ [{id, type, cat:sighting|snare|hwc|camera|mortality|security|collar,
    detail, who, when, geometry:GeoJSON, severity}]

GET /projects/{id}/biodiversity/tracks.geojson       # collar observations (FeatureCollection of LineStrings)
GET /projects/{id}/biodiversity/habitat/{layer}/{z}/{x}/{y}.png   # lpd|degrade|bii
```
> EarthRanger returns GeoJSON natively; the `biodiversity` service polls its REST API (or via **Gundi**) and caches into PostGIS. One EarthRanger base URL + token **per project**.

## Data pipeline
```
GET /pipeline
→ { last_run, next_run,
    stages:[{key,label,status:ok|running|queued|idle,detail}],
    sources:[{name,provider,res,cadence,cost,status,latency,non_gee:bool}],
    router:{active, fallback, internal},
    compute:{tiles, eecu_hours, gcs_gb, cloud_run_reqs, est_monthly_usd} }

POST /pipeline/run            # manual trigger (Phase 1)
PATCH /pipeline/router        # body: {backend: space_intelligence|fallback|internal}
```

## Field data
```
GET  /projects/{id}/field/submissions
→ [{id, plot, form_type, enumerator, tree_count, gps, ts, sync_status}]
POST /field/submissions        # idempotent on id; offline devices sync here
```

## Webhooks / events (optional, Phase 2+)
- `POST {your_url}` on: new GEE export, AGBD recompute complete, change-event >Nσ, EarthRanger high-severity event, sign-off item created.
