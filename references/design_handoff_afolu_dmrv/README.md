# Handoff: Verst Carbon — AFOLU dMRV Platform

## Overview
This package documents the design of the **AFOLU dMRV platform** — Verst Carbon's satellite-first, AI-assisted digital Measurement, Reporting & Verification system for African Agriculture, Forestry & Other Land-Use (AFOLU) carbon projects. It is an internal web platform for carbon project managers and geospatial/MRV analysts, organised around three engines (Measurement, Carbon Accounting, Compliance) plus data-pipeline and field-data operations views.

The product concept, data sources and methodology come from the *Verst Carbon dMRV Concept Note* (June 2026). A text extraction is included at `design/concept_note.md`.

## About the design files
The files in `design/` are **design references created in HTML/React (via in-browser Babel)** — a high-fidelity, fully-interactive *prototype* that demonstrates the intended look, layout and behaviour. **They are not production code to ship.** All data is mocked (`design/data.js`); there is no backend, auth, real Earth-observation processing or persistence.

The task is to **recreate these designs in a real production codebase** using the stack recommended in `ARCHITECTURE.md` (or the team's established patterns if they differ). Treat the prototype as the visual/interaction source of truth and `ARCHITECTURE.md` as the system/data-contract spec.

## Fidelity
**High-fidelity.** Final colours, typography, spacing, components, charts, map rendering, and interactions are all resolved. Recreate the UI faithfully using the target framework's component library; match the design tokens below exactly.

---

## Design tokens

### Typography
- **UI font:** `IBM Plex Sans` (weights 300/400/500/600/700). Google Fonts.
- **Monospace** (all numerics, codes, coordinates, labels): `IBM Plex Mono` (400/500/600). Apply `font-feature-settings: "tnum" 1` for tabular figures.
- Base size 14px (comfortable) / 13px (compact). Section labels (`.lbl`): 10.5px, uppercase, letter-spacing .09em, weight 600. KPI numbers: 24px mono. Panel titles: 12.5px weight 600.
- The Tweaks panel lets the user swap the UI font between `IBM Plex Sans`, `Space Grotesk`, `Archivo` — production can treat IBM Plex Sans as canonical.

### Color — dark theme (default)
| Token | Hex / value | Use |
|---|---|---|
| `--bg-0` | `#0a110d` | app background (deepest) |
| `--bg-1` | `#0e1713` | panels / surfaces |
| `--bg-2` | `#131f19` | raised cards, inputs |
| `--bg-3` | `#1a271f` | hover-raised |
| `--hover` | `rgba(255,255,255,.04)` | row/nav hover |
| `--line` | `rgba(255,255,255,.075)` | hairline borders |
| `--line-2` | `rgba(255,255,255,.14)` | stronger borders |
| `--text-1` | `#e8f0ea` | primary text |
| `--text-2` | `#9bb0a4` | secondary text |
| `--text-3` | `#66796d` | muted / labels |
| `--map-void` | `#07100b` | map canvas background (kept dark in both themes) |

### Color — light theme
`--bg-0` `#eef1ec` · `--bg-1` `#ffffff` · `--bg-2` `#f7f9f5` · `--bg-3` `#eef2ea` · `--line` `rgba(20,40,28,.10)` · `--line-2` `rgba(20,40,28,.18)` · `--text-1` `#16221b` · `--text-2` `#4f6357` · `--text-3` `#82938a`. The map canvas stays dark in both themes.

### Brand & semantic accents (theme-independent)
| Token | Hex | Use |
|---|---|---|
| `--brand` | `#1fa94f` | primary green (from logo "CARBON"); buttons, active nav, healthy status |
| `--brand-2` | `#2d7a4f` | secondary green (BGB pool, etc.) |
| `--brand-deep` | `#143d29` | deep green fills (avatar, step badges) |
| `--teal` | `#2fd0bb` | EO / uncertainty / "validated" accent |
| `--gold` | `#e0a93b` | AGBD mid-ramp, SOC pool, warnings-soft |
| `--warn` | `#f0a92c` | attention |
| `--danger` | `#ef5b5b` | loss / high risk |
| `--info` | `#5aa2f0` | baseline/info |
| `--ai` | `#9b7cf0` | AI-generated (PDD generator) |

Accent is user-tweakable (options: `#1fa94f`, `#16a34a`, `#2d7a4f`, `#15b8a6`, `#5a9732`); `--brand` is canonical.

### Spacing, radius, shape
- Panel radius `9px`; pill/badge radius `999px`; cards in deck `14–18px`.
- Density tokens — comfortable: `--pad 16px / --gap 14px`; compact: `--pad 11px / --gap 10px`.
- Panel shadow (dark): `0 1px 0 rgba(255,255,255,.03) inset, 0 10px 30px -12px rgba(0,0,0,.7)`.
- Status dot: 8px circle; "live/healthy" pulses with an expanding ring.

### Iconography
Minimal single-path line icons, 24×24 viewBox, `stroke-width 1.6`, round caps/joins, drawn from a small in-house set (`design/ui.jsx` → `PATHS`). Replace with the codebase's icon library (e.g. Lucide/Phosphor) — names map closely (grid, map, cpu, calculator, shield, satellite, layers, merge, list, check, bell, search, etc.).

---

## Global layout / app shell
Three regions (see `design/app.jsx`):
- **Left sidebar** — fixed 234px, `--bg-1`, right border. Logo (top), grouped nav (`Overview`: Portfolio, Project dashboard · `Engines`: Measurement, Carbon accounting, Compliance, Biodiversity · `Operations`: Data pipeline, Field data), user card + system-status footer. Active nav item: `color-mix(--brand 15%)` background + 3px left brand bar.
- **Top bar** — 60px. Page title + subtitle (left), project switcher dropdown (hidden on Portfolio/Pipeline), "Monitoring cycle" walkthrough trigger, global search (220px), theme toggle, notifications.
- **Main** — padded (`--pad`), scrollable, holds the active view. Views are full-height flex/grid compositions.

A **Tweaks panel** (design-time only) controls theme (dark/light), accent, UI font, density, and map base style. In production this maps to user/workspace preferences — not all of it needs to ship.

---

## Screens / views

> All seven views receive `{ project, openProject, t }` where `t` is the resolved preferences object. Charts and the map are custom SVG/Canvas components (`design/ui.jsx`, `design/map.jsx`).

### 1. Portfolio
- **Purpose:** org-wide overview of every enrolled AFOLU project.
- **Layout:** KPI strip (6 cards: Active projects, Area under MRV, Carbon stock, Annual forecast, Issued to date, Avg uncertainty) → full-width **projects table** (flex 1.5) → bottom band (286px) = Regional map (1.6fr) + Composition donut (1fr).
- **Projects table columns:** status dot · Project (flag + name, mono `code · type · methodology` subtitle) · Stage badge · Area · Carbon stock · Forecast/yr · Uncertainty (±%) · Risk badge · Trend sparkline. Row hover = `--hover`; click → opens Project dashboard for that project.
- **Composition donut:** area by project type (REDD+, ARR, Agroforestry, Blue Carbon).

### 2. Project dashboard
- **Purpose:** single-project deep view; **map is the hero**.
- **Layout:** left column = large map panel (boundary + carbon stock) over a 4-up stat strip (Carbon stock, Credit forecast, AGBD mean, Baseline rate); right rail (380px) = project header + 3 ring gauges (Uncertainty, Risk score, VVB ready), Carbon pools donut (4 IPCC pools), Baseline-vs-project area chart, Data sources chips.

### 3. Measurement Engine — "What is the carbon?"
- **Layout:** left = map with a layer switcher (`AGBD` / `Δ Change` / `Forest cover` / `Terrain`) + change-detection table below; right rail = AGBD distribution histogram (mean/lower-CI/upper-CI), Hybrid-MRV calibration scatter (EO vs field, R²=0.86), Model card (HabitatMapper™ Bayesian UQ specs).
- **Change-detection table:** Loss/Gain badge · area · ha · σ (red if >3) · source · date · action button.

### 4. Carbon Accounting Engine — "What can be claimed?"
- **Layout:** 4-up KPI strip (Gross removals, Leakage deduction, Net additionality, Issuance @ lower CI) → baseline-vs-project chart → credit-forecast table (Vintage, Gross, Leakage, Net, Issuance−CI, bar); right rail = **methodology computation** panel with a **methodology dropdown** (default `VM0048`; options `VM0047, VM0042, VM0007, VM0033, VM0032, ART TREES, GS4GG`), rendering that standard's codified 5-step logic. A note appears when the previewed methodology ≠ the project's live one.

### 6. Biodiversity & Co-benefits — "What else does this protect?"
- **Purpose:** ingest **biodiversity / conservation** data and surface co-benefits that support premium-priced, label-bearing credits (CCB, SD VISta).
- **Sources (both non-GEE API integrations):**
  - **EarthRanger** (Allen Institute / Ai2) — the conservation platform. Models data as **subjects** (collared animals), **observations** (time-series tracks) and **events** (singular human/sensor records: sightings, snares, human-wildlife conflict, camera-trap auto-ID, carcasses, gunshot/acoustic).
  - **Earth Map** (FAO-Google) — value-added thematic layers: **Land Productivity Dynamics**, **land degradation (SDG 15.3.1 / Trends.Earth)**, **Biodiversity Intactness Index**; plus **WDPA/KBA** protected-area overlap. Earth Map is GEE-backed for most layers but also bundles non-GEE national datasets; treat it as a complementary API source.
- **Layout:** 4-up KPI strip (Biodiversity intactness, Species recorded, EarthRanger observations, Patrol coverage) → **map with wildlife overlay** (collar tracks as poly-lines + colour-coded sighting/snare/HWC points, rendered on the forest-cover base) → EarthRanger event feed table. Right rail: indicator-species panel (name, IUCN status badge CR/EN/VU, count, trend, collar count), Earth Map habitat & degradation bars (each with its source label), and SDG co-benefit chips.
- **Map overlay:** the prototype `MapHero` accepts `overlays={{ wildlife: true }}` — collar tracks + event points. In production, render EarthRanger observations/events as real GeoJSON layers (their API returns GeoJSON) over the basemap.

### 7. Compliance Engine — "Will it pass VVB review?"
- **Layout:** left = compliance-modules grid (8 modules with pass/warn/progress status) + human sign-off queue (severity bar, id, type, clause, text, project/source/age, Review/Sign-off actions); right rail = Risk dashboard (4 gauges: Permanence, Reversal, Leakage, Fire), AI PDD Generator progress, Verification dossier checklist with export.

### 8. Data pipeline
- **Layout:** top = 7-stage end-to-end flow (Ingest → Preprocess → EO Engine → MRV Hybrid → Accounting → Compliance → Output) with per-stage status; below = Dataset register table (15 sources — incl. EarthRanger, Earth Map/FAO and WDPA/KBA tagged **non-GEE API**)ces: name, provider, resolution, cadence, cost, latency, live/standby) + right rail (AGBD inference router: Active=Space Intelligence API, Fallback=Lang/Chloris/allometric, Internal ML; GEE & compute meters).

### 9. Field data collection
- **Layout:** left = phone mockup of the offline-first field app (KoboCollect-style DBH/height survey, GNSS, "Save & next tree"); right = 4 stat cards + recent field submissions table (id, plot, form, enumerator, GPS, when, sync status).

---

## Interactions & behavior
- **Navigation:** sidebar sets the active view; project switcher sets the active project (both React state in `App`). `openProject(id)` sets project + navigates to Project dashboard.
- **Map (`design/map.jsx`):** custom `<canvas>` renderer — procedural value-noise AGBD raster clipped to a deterministic boundary polygon, leakage belt (dashed), control plots, change markers, graticule, legend, scale bar. Supports **pan (drag)** and **zoom (wheel + buttons)**. Style switchable (biomass/change/forest/terrain/satellite). *In production, replace with a real map (Leaflet/Mapbox/deck.gl) rendering actual GeoJSON boundaries + a tiled AGBD raster from the Measurement Engine; keep the dark canvas, leakage belt, plots, change markers, legend and scale bar.*
- **Methodology dropdown:** swaps the codified-logic step list; defaults to VM0048.
- **Monitoring-cycle walkthrough:** a 7-step guided overlay (Ingest→Measure→Detect→Calibrate→Account→Comply→Report) that drives navigation across views with Back/Next + progress.
- **Entrance animation:** subtle transform-only rise on view mount (no opacity fade — keep content visible if animation is paused). Respect `prefers-reduced-motion`.
- **Charts:** all custom SVG (sparkline, area/baseline chart, donut, ring gauge, bars, histogram, scatter). Reproduce with the codebase's charting lib (Recharts/visx/ECharts) or port the SVG.

## State management
Prototype uses local React state in `App`: `nav` (active view), `pid` (active project id), `pmenu` (switcher open), `tour` (walkthrough step index, −1=off), and `useTweaks()` for preferences. **Production** needs: server state for projects/portfolio/pools/forecasts/pipeline/compliance/field data (fetch per `ARCHITECTURE.md` endpoints), URL-based routing for views + selected project, and persisted user preferences. See `design/data.js` for the exact mock data shapes to model your API responses on.

## Assets
- **Logo:** `design/assets/verst-logo-dark.png` (white wordmark for dark UI), `verst-logo-light.png` (original). Derived from the user-supplied Verst Carbon logo. Use the official brand asset in production.
- **Screenshots:** `design/assets/shots/*.png` — reference renders of each view.
- Fonts via Google Fonts (IBM Plex Sans/Mono).
- No other raster imagery — the map and all charts are generated.

## Files (in `design/`)
- `AFOLU dMRV Platform.html` — app entry (design tokens in `<style>`, script load order).
- `app.jsx` — shell, routing, tweaks, walkthrough.
- `ui.jsx` — icons, badges, stats, all chart primitives.
- `map.jsx` — geospatial canvas hero.
- `views1.jsx` — Portfolio, Project dashboard, Measurement.
- `views2.jsx` — Accounting (+ methodology catalog), Compliance, Pipeline, Field.
- `views3.jsx` — Biodiversity & Co-benefits (EarthRanger + Earth Map).
- `data.js` — **mock data — model your API response shapes on this.**
- `tweaks-panel.jsx`, `logos.js` — support.
- `AFOLU dMRV — Overview Deck.html` — stakeholder deck.
- `concept_note.md` — source concept note (data sources, methodologies, roadmap, budget).

➡ **See `ARCHITECTURE.md` for the system architecture, data contracts, API surface, recommended repo scaffold, and build sequence.**
