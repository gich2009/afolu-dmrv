# Infrastructure & Go-Live — AFOLU dMRV Platform

Target cloud: **Google Cloud Platform** (chosen because Google Earth Engine exports natively to GCS — keep everything on GCP to avoid cross-cloud egress). Apply to the **Google for Startups Cloud Program** before provisioning (up to $100k/yr credits can absorb most Phase 1–2 infra).

---

## 1. GCP services
| Concern | Service |
|---|---|
| EO processing | **Google Earth Engine** (service account, commercial Cloud project) |
| Containers / services | **Cloud Run** (API, inference router, ingestion workers) |
| Orchestration (Phase 2+) | **GKE Autopilot** or Cloud Run Jobs + Cloud Scheduler |
| Event bus | **Pub/Sub** (GEE export complete → trigger downstream) |
| Spatial DB | **Cloud SQL for PostgreSQL + PostGIS** |
| Time-series | **InfluxDB** (self-hosted on GKE, or Influx Cloud) |
| Object store / data lake | **Cloud Storage** (COG rasters, tiles, dossiers) |
| Secrets | **Secret Manager** (all API keys & EarthRanger tokens) |
| CI/CD | **Cloud Build** + **Artifact Registry** |
| Auth | **Identity-Aware Proxy** or **Firebase Auth** + project RBAC |
| Monitoring | **Cloud Logging / Monitoring**, error reporting, uptime checks |
| CDN / hosting | Frontend on Cloud Run or Firebase Hosting + Cloud CDN |

## 2. Environments
`dev` → `staging` → `prod`, each its own GCP project (or folder). Infra as code via **Terraform** in `infra/`. Promote container images by digest. Separate Cloud SQL instances; never share secrets across envs.

## 3. Provisioning sequence
1. Create GCP projects + enable APIs (Earth Engine, Cloud Run, Cloud SQL Admin, Pub/Sub, Secret Manager, Cloud Build, Artifact Registry, Storage).
2. Register an **Earth Engine service account**; grant the GCS bucket write access for exports.
3. Stand up **Cloud SQL (PostGIS)**; run migrations from `DATA_MODEL.md`.
4. Create the **GCS bucket** with the layout in `DATA_MODEL.md §GCS`; set lifecycle rules on `raw/`.
5. Deploy the **API** (Cloud Run) returning mock shapes → unblocks frontend.
6. Deploy the **inference router** (Cloud Run) on the `fallback` backend.
7. Wire **Pub/Sub**: GEE export → topic → ingestion worker → router → engines.
8. Add **Secret Manager** entries; reference (never inline) keys/tokens.
9. Deploy **frontend**; put it behind IAP/Firebase Auth.
10. Configure **monitoring/alerting** + budget alerts on the billing account.

## 4. Data-source onboarding (non-blocking)
- **GEE-native** (free): Sentinel-2/1, Landsat, GEDI L4A, Hansen GFC, iSDAsoil, CHIRPS, GLAD/RADD — available immediately.
- **Commercial APIs**: Space Intelligence (HabitatMapper™/CarbonMapper™, VT0007), Chloris (fallback), Planet. The router runs on **fallback** until contracts land, so engineering is never blocked.
- **Biodiversity (non-GEE)**: per-project **EarthRanger** base URL + token; **Earth Map / FAO** layers; **WDPA/KBA** vectors. See `ARCHITECTURE.md §7b`.

## 5. Security & compliance posture
- All secrets in Secret Manager; least-privilege IAM service accounts per workload.
- **Append-only audit trail** on accounting & compliance (VVB requirement) — enforced at the DB + API layer.
- Encryption at rest (default) + TLS in transit; VPC-SC around prod data if required.
- Data ownership: EarthRanger data stays the conservation partner's — honour their data-sharing terms; store only what your agreements permit.
- Regular dependency + container scanning in Cloud Build.

## 6. Indicative cost (from concept note; excludes staff)
| | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| GCP infrastructure | ~$3.8k | ~$11k | ~$35k |
| Google Earth Engine | $0 (free tier in R&D) | ~$24k | ~$60k |
| Space Intelligence API | $7–25k | TBC | portfolio |
| Chloris (fallback) + VHR | $5k | $8–25k | $25–70k |
| **Indicative total** | **~$28k** | **~$81k** | **~$195k** |

Google for Startups credits can offset much of Phase 1–2 infra + GEE.

## 7. Go-live checklist (Phase 1 production)
- [ ] Prod GCP project hardened; IAM least-privilege; budget alerts on.
- [ ] Cloud SQL (PostGIS) prod instance, automated backups + PITR.
- [ ] GCS buckets with lifecycle + retention on dossiers.
- [ ] GEE service account scoped to prod; export pipeline scheduled.
- [ ] Inference router on chosen backend (SI API contracted, or fallback) with health checks.
- [ ] API behind auth; RBAC roles (manager / analyst / compliance / read-only).
- [ ] Audit trail verified end-to-end on one accounting + one sign-off action.
- [ ] EarthRanger token(s) provisioned per pilot; ingestion polling live.
- [ ] Monitoring dashboards + on-call alerts (pipeline failure, export latency, error rate).
- [ ] One pilot project produces a VVB-ready dossier + PDD draft.
- [ ] VVB engaged & briefed on the digital-MRV evidence package.
- [ ] DR plan: backups tested, restore runbook written.
