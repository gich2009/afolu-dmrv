# Project Plan — AFOLU dMRV Platform

Phased delivery aligned to the concept note's roadmap (~30 months). Sprints are 2 weeks. Adjust to team velocity.

---

## Team (lean core for Phase 1)
| Role | Focus |
|---|---|
| Geospatial / EO engineer | GEE pipeline, AGBD inference router, change detection |
| ML engineer | biomass model, hybrid field-calibration regression (Phase 2) |
| Backend engineer (Python) | FastAPI, methodology engine, data model, integrations |
| Frontend engineer (React) | the 9 views, map, charts |
| Carbon / MRV scientist | VM0048 codification, baseline/leakage logic, VVB liaison |
| Field coordinator + enumerators | pilot plots, QA (ramps up Phase 2) |
| Compliance reviewer | sign-off, FPIC, dossier (Phase 3 heavy) |
| Product / PM (fractional) | scope, partners, go/no-go |

---

## Phase 1 · MVP — validate the loop (Months 1–9)
**Goal:** one Kenya/Uganda pilot runs end-to-end and outputs a **VVB-ready PDD draft**.

- **S1–2 Foundations:** GCP + GEE provisioned; repo scaffold; CI/CD; design tokens; API skeleton returning mock shapes (`design/data.js`).
- **S3–4 Data model + ingestion:** PostGIS schema; GEE export → GCS for the pilot AOI; Pub/Sub wiring.
- **S5–6 Inference router (fallback) + Measurement view:** first real AGBD map + uncertainty; change detection; frontend Measurement on live data.
- **S7–9 Accounting engine:** codify **VM0048** (baseline, leakage, additionality, conservative issuance); credit-forecast view; full audit trail.
- **S10–12 Compliance + PDD:** module assembly, risk scoring, sign-off queue; hand structured data to the AI PDD Generator; dossier export. Portfolio + Project dashboards polished.
- **Milestone M1 (≈Mo 9):** VVB-ready PDD + monitoring report for the pilot. **Go/no-go to Phase 2.**

## Phase 2 · Hybrid MRV & smallholders (Months 9–18)
**Goal:** field-calibrated accuracy + the co-benefit & smallholder layers.

- EO × field-plot **calibration regression** (the core differentiator); tighten uncertainty.
- **Offline-first mobile field app** + sync to `field/submissions`.
- **Biodiversity & co-benefits**: EarthRanger ingestion (events/observations/subjects), Earth Map/FAO + WDPA/KBA layers, indicator-species tracking, CCB/SD VISta evidence.
- **FPIC & benefit-sharing** modules with version-controlled records.
- Second methodology (**VM0047 ARR**) + the **multi-methodology abstraction layer**.
- Swap inference router to **Space Intelligence** once contracted.
- **Milestone M2 (≈Mo 18):** multi-project portfolio on hybrid MRV with co-benefit reporting.

## Phase 3 · Compliance intelligence (Months 18–30)
**Goal:** automation & a trusted VVB layer; reduce vendor dependence.

- **AI additionality & permanence** assessment + automated sign-off routing.
- Automated **leakage-belt monitoring**.
- Auto-generated **PDD sections**; full **verification-dossier builder**.
- **VVB trust layer** + registry export formats (Verra / Gold Standard / ART).
- Optional **internal ML embeddings** (Prithvi / SatMAE++) to remove commercial-API dependence.
- **Milestone M3 (≈Mo 30):** end-to-end automated monitoring cycle at portfolio scale.

---

## Risks & mitigations
| Risk | Mitigation |
|---|---|
| Commercial EO API contracts slip | **Fallback inference router** built day one; engineering never blocked |
| VVB acceptance of digital MRV | Engage a VVB in Phase 1; design outputs to registry formats; conservative (lower-CI) issuance |
| Field-data quality / access | QA protocol + enumerator training; offline-first app; start with one well-characterised pilot |
| Uncertainty too high for issuance | Hybrid field calibration (Phase 2); report formal CIs; issue on lower bound |
| Cloud cost overrun | Google for Startups credits; GEE free tier in R&D; commercial sources only for high-value sites |
| EarthRanger / partner data terms | Honour data-sharing agreements; store only permitted data; per-project tokens |

## Definition of done (per phase)
Each phase ends with a working pilot/portfolio demo, a green **go-live checklist** (see `INFRASTRUCTURE.md §7`), updated docs, and a documented go/no-go decision.

---

## Document index (this package)
1. **README.md** — UI / design spec (tokens, 9 screens, interactions).
2. **ARCHITECTURE.md** — system architecture, data contracts, methodology engine, biodiversity integration, API surface, build sequence.
3. **GETTING_STARTED.md** — dev environment, repo scaffold, build order.
4. **API_SPEC.md** — endpoint + payload contracts.
5. **DATA_MODEL.md** — PostGIS / InfluxDB / GCS schemas.
6. **INFRASTRUCTURE.md** — GCP provisioning, security, cost, go-live checklist.
7. **PROJECT_PLAN.md** — this file: phased sprints, team, risks.
8. **design/** — the interactive prototype (visual source of truth) + `data.js` (response shapes) + the stakeholder deck + concept note.
