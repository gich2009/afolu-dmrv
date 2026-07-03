# AFOLU dMRV Platform — Developer Handoff Package

Everything an engineering team needs to build **Verst Carbon's AFOLU dMRV platform** from the approved design. The design is a **high-fidelity prototype** (in `design/`); these docs specify how to build the real, production system.

## Start here — reading order
1. **README.md** — what the product is + the full UI/design spec (tokens, all 9 screens, interactions, state).
2. **ARCHITECTURE.md** — the system: three-engine pipeline, recommended stack, repo scaffold, data contracts, methodology engine, **biodiversity/EarthRanger/Earth Map integration**, API surface, build sequence.
3. **GETTING_STARTED.md** — stand up the repo + environment; the critical-path build order.
4. **API_SPEC.md** — REST endpoint + payload contracts (mirror `design/data.js`).
5. **DATA_MODEL.md** — PostGIS + InfluxDB + GCS schemas (DDL).
6. **INFRASTRUCTURE.md** — GCP provisioning, security, indicative cost, **go-live checklist**.
7. **PROJECT_PLAN.md** — phased sprint plan, team, milestones, risks.

## design/
- `AFOLU dMRV Platform.html` + `*.jsx` / `*.js` — the **interactive prototype** (visual + interaction source of truth). Open the HTML in a browser to explore all 9 views.
- `data.js` — **mock data; model your API responses on these shapes.**
- `AFOLU dMRV — Overview Deck.html` — the stakeholder deck.
- `assets/` — logo + reference screenshots.
- `concept_note.md` — the original Verst Carbon concept note (data sources, methodologies, roadmap, budget).

## How to use with Claude Code or another AI coding agent
Point the agent at this folder and ask it to implement, in order: the data model → API skeleton (returning the `data.js` shapes) → frontend views → the GEE/inference pipeline. The two markdown specs plus `data.js` are written to be self-sufficient for an engineer who wasn't in the original design conversation.

## Scope boundary
This package is **design + specification**, not a running backend. It does **not** include trained biomass ML models, registry/VVB credentials, commercial API keys (Space Intelligence, Chloris, Planet), EarthRanger tokens, live EO compute, or production auth. Those are the engineering build, framed by `PROJECT_PLAN.md`.
