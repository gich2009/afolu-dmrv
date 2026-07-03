# Data Model — AFOLU dMRV Platform

Primary store **PostgreSQL + PostGIS** (spatial + relational); **InfluxDB** for time-series; **GCS** for rasters & documents. Schemas below are indicative DDL — adapt naming to house style. Mirror the shapes in `design/data.js`.

---

## PostGIS — core tables

```sql
-- Projects (one row per enrolled AFOLU project)
CREATE TABLE projects (
  id              text PRIMARY KEY,              -- 'tsavo-east'
  code            text UNIQUE NOT NULL,          -- 'VC-KE-001'
  name            text NOT NULL,
  region          text, country text, flag text,
  type            text,        -- REDD+ | ARR | Agroforestry | Blue Carbon
  methodology     text,        -- VM0048 ...
  stage           text,        -- Onboarding|Baseline|Implementation|Monitoring|Verification
  registry        text,
  crediting_period text,
  boundary        geometry(MultiPolygon,4326) NOT NULL,
  leakage_belt    geometry(MultiPolygon,4326),  -- 10 km belt
  area_ha         numeric,
  centroid        geometry(Point,4326),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz
);
CREATE INDEX ON projects USING gist (boundary);

-- Carbon summary (latest per project per cycle)
CREATE TABLE carbon_state (
  project_id      text REFERENCES projects(id),
  cycle           text,        -- 'Y3 · 2026'
  agbd_mean numeric, agbd_lo numeric, agbd_hi numeric,   -- Mg/ha
  carbon_stock    numeric,     -- tCO2e
  credit_forecast numeric,     -- tCO2e/yr
  uncertainty_pct numeric,
  baseline_rate   numeric,     -- %/yr loss
  leakage_pct     numeric,
  additionality   text,
  pool_agb numeric, pool_bgb numeric, pool_soc numeric, pool_dead numeric,
  computed_at     timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, cycle)
);

-- Control / measurement plots
CREATE TABLE plots (
  id text PRIMARY KEY, project_id text REFERENCES projects(id),
  kind text, geom geometry(Point,4326), established date
);

-- Change-detection events (Measurement Engine)
CREATE TABLE change_events (
  id text PRIMARY KEY, project_id text REFERENCES projects(id),
  kind text,           -- Loss | Gain
  geom geometry(Polygon,4326), ha numeric, sigma numeric,
  source text, detected_on date, action text, status text
);

-- Methodology runs (audit-grade accounting)
CREATE TABLE accounting_runs (
  id bigserial PRIMARY KEY, project_id text REFERENCES projects(id),
  methodology text, methodology_version text,
  gross numeric, leakage numeric, net numeric, issuance_lower_ci numeric,
  params jsonb,        -- every emission factor, allometric eq, baseline param
  run_by text, run_at timestamptz DEFAULT now()
);
CREATE TABLE forecast_rows (
  run_id bigint REFERENCES accounting_runs(id),
  vintage int, gross numeric, leakage numeric, net numeric, issuance_lower_ci numeric
);

-- Compliance
CREATE TABLE compliance_modules (
  project_id text REFERENCES projects(id), key text, label text,
  status text,         -- pass|warn|progress|fail
  note text, updated_at timestamptz, PRIMARY KEY(project_id, key)
);
CREATE TABLE signoff_queue (
  id text PRIMARY KEY, project_id text REFERENCES projects(id),
  type text, clause text, severity text, source text, body text,
  created_at timestamptz, resolved_by text, resolved_at timestamptz, decision text
);
CREATE TABLE risk_scores (
  project_id text REFERENCES projects(id),
  permanence int, reversal int, leakage int, fire int, scored_at timestamptz
);

-- Field submissions (offline-first sync target)
CREATE TABLE field_submissions (
  id text PRIMARY KEY, project_id text REFERENCES projects(id),
  plot text, form_type text, enumerator text, tree_count int,
  geom geometry(Point,4326), payload jsonb,
  recorded_at timestamptz, synced_at timestamptz, sync_status text
);
```

## PostGIS — biodiversity (EarthRanger + Earth Map)

```sql
-- Per-project EarthRanger connection (secret token stored in Secret Manager, ref only here)
CREATE TABLE er_sites (
  project_id text REFERENCES projects(id),
  base_url text, site_name text, token_secret_ref text,
  subjects int, active_collars int, patrols_active int, last_sync timestamptz,
  PRIMARY KEY(project_id)
);

-- EarthRanger events (singular records) — cached from REST API as GeoJSON
CREATE TABLE er_events (
  id text PRIMARY KEY, project_id text REFERENCES projects(id),
  event_type text, cat text,   -- sighting|snare|hwc|camera|mortality|security|collar
  detail text, reported_by text, severity text,
  geom geometry(Point,4326), occurred_at timestamptz, ingested_at timestamptz
);
CREATE INDEX ON er_events USING gist (geom);
CREATE INDEX ON er_events (project_id, occurred_at DESC);

-- Collar observations (time-series tracks) — summarised; full series in InfluxDB
CREATE TABLE er_subjects (
  id text PRIMARY KEY, project_id text REFERENCES projects(id),
  species text, name text, collar_id text, last_fix geometry(Point,4326), last_seen timestamptz
);

-- Indicator-species counts (EarthRanger subjects + aerial census)
CREATE TABLE species_counts (
  project_id text REFERENCES projects(id), name text, sci text,
  iucn text, count int, trend numeric, collared int, as_of date,
  PRIMARY KEY(project_id, name, as_of)
);

-- Earth Map / FAO / WDPA value-added layers (per project rollup)
CREATE TABLE habitat_layers (
  project_id text REFERENCES projects(id), key text, label text,
  value text, pct numeric, source text, as_of date,
  PRIMARY KEY(project_id, key, as_of)
);

-- Co-benefit / SDG tags
CREATE TABLE project_sdgs ( project_id text REFERENCES projects(id), sdg int );
```

## InfluxDB — measurements (time-series)
```
carbon_stock      tags: project_id              fields: value (tCO2e)            ts: yearly
baseline          tags: project_id              fields: value                    ts: yearly
agbd_summary      tags: project_id              fields: mean,lo,hi               ts: per cycle
collar_track      tags: project_id, subject_id  fields: lat,lng,speed            ts: per fix
patrol_coverage   tags: project_id              fields: pct                      ts: daily
pipeline_compute  tags: stage                   fields: tiles,eecu,gcs_gb,reqs   ts: per run
```

## GCS — object layout
```
gs://<bucket>/
  aoi/{project_id}/raw/{date}/...            # GEE export stacks (COG)
  aoi/{project_id}/agbd/{cycle}.tif          # AGBD raster + uncertainty band
  aoi/{project_id}/tiles/{layer}/{z}/{x}/{y}.png
  biodiversity/{project_id}/tracks/{date}.geojson
  dossiers/{project_id}/{cycle}/...          # VVB package, PDD draft, monitoring report
```

## Notes
- All accounting/compliance writes are **append-only with audit columns** — never update in place; insert a new run/version. VVBs require a defensible trail.
- Tokens & API keys live in **Google Secret Manager**; tables store only a `*_secret_ref`.
- Spatial joins (KBA/WDPA overlap, leakage-belt intersection, event-in-boundary) run in PostGIS.
