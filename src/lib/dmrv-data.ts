export type ProjectStage =
  | "Onboarding"
  | "Baseline"
  | "Implementation"
  | "Monitoring"
  | "Verification";

export type ProjectType = "REDD+" | "ARR" | "Agroforestry" | "Blue Carbon";

export type Project = {
  id: string;
  code: string;
  countryCode: string;
  name: string;
  region: string;
  country: string;
  type: ProjectType;
  methodology: string;
  stage: ProjectStage;
  lat: number;
  lng: number;
  area: number;
  registry: string;
  creditPeriod: string;
  cycle: string;
  updated: string;
  agbd: { mean: number; lo: number; hi: number };
  carbonStock: number;
  creditForecast: number;
  uncertaintyPct: number;
  baselineRate: number;
  leakagePct: number;
  additionality: string;
  pools: { agb: number; bgb: number; soc: number; dead: number };
  risk: "Low" | "Medium" | "High" | "Pending";
  riskScore: number;
  permanence: string;
  fpic: string;
  dossier: number;
  signoff: number;
  sources: string[];
  series: number[];
  baselineSeries: number[];
  changes: number;
};

export const projects: Project[] = [
  {
    id: "tsavo-east",
    code: "VC-KE-001",
    countryCode: "KE",
    name: "Tsavo East REDD+",
    region: "Tsavo Conservation Area",
    country: "Kenya",
    type: "REDD+",
    methodology: "VM0048",
    stage: "Monitoring",
    lat: -2.75,
    lng: 38.78,
    area: 184320,
    registry: "Verra VCS",
    creditPeriod: "2023-2053",
    cycle: "Y3 - 2026",
    updated: "2026-06-04",
    agbd: { mean: 74.2, lo: 61.8, hi: 88.0 },
    carbonStock: 9420000,
    creditForecast: 412000,
    uncertaintyPct: 14.2,
    baselineRate: 1.84,
    leakagePct: 6.1,
    additionality: "Confirmed",
    pools: { agb: 6180000, bgb: 2410000, soc: 690000, dead: 140000 },
    risk: "Low",
    riskScore: 22,
    permanence: "Buffer 15%",
    fpic: "Complete",
    dossier: 86,
    signoff: 3,
    sources: ["Sentinel-2", "Sentinel-1", "GEDI L4A", "HabitatMapper", "Field plots"],
    series: [8.1, 8.4, 8.7, 9.0, 9.42],
    baselineSeries: [8.1, 7.95, 7.78, 7.6, 7.41],
    changes: 2,
  },
  {
    id: "tsavo-west",
    code: "VC-KE-002",
    countryCode: "KE",
    name: "Tsavo West REDD+",
    region: "Tsavo Conservation Area",
    country: "Kenya",
    type: "REDD+",
    methodology: "VM0048",
    stage: "Verification",
    lat: -3.0,
    lng: 38.0,
    area: 92140,
    registry: "Verra VCS",
    creditPeriod: "2023-2053",
    cycle: "Y3 - 2026",
    updated: "2026-06-02",
    agbd: { mean: 68.5, lo: 55.1, hi: 82.4 },
    carbonStock: 5120000,
    creditForecast: 238000,
    uncertaintyPct: 16.8,
    baselineRate: 2.12,
    leakagePct: 7.4,
    additionality: "Confirmed",
    pools: { agb: 3290000, bgb: 1280000, soc: 460000, dead: 90000 },
    risk: "Medium",
    riskScore: 41,
    permanence: "Buffer 18%",
    fpic: "Complete",
    dossier: 94,
    signoff: 1,
    sources: ["Sentinel-2", "Sentinel-1", "GEDI L4A", "HabitatMapper", "Field plots"],
    series: [4.6, 4.74, 4.88, 5.0, 5.12],
    baselineSeries: [4.6, 4.5, 4.39, 4.27, 4.15],
    changes: 5,
  },
  {
    id: "meru",
    code: "VC-KE-003",
    countryCode: "KE",
    name: "Meru Reforestation",
    region: "Meru National Park",
    country: "Kenya",
    type: "ARR",
    methodology: "VM0047",
    stage: "Implementation",
    lat: 0.16,
    lng: 38.25,
    area: 38600,
    registry: "Verra VCS",
    creditPeriod: "2024-2054",
    cycle: "Y2 - 2026",
    updated: "2026-06-05",
    agbd: { mean: 31.4, lo: 22.0, hi: 41.9 },
    carbonStock: 1180000,
    creditForecast: 96000,
    uncertaintyPct: 24.6,
    baselineRate: 0,
    leakagePct: 3.2,
    additionality: "Confirmed",
    pools: { agb: 720000, bgb: 280000, soc: 150000, dead: 30000 },
    risk: "Medium",
    riskScore: 38,
    permanence: "Buffer 20%",
    fpic: "In review",
    dossier: 52,
    signoff: 7,
    sources: ["Sentinel-2", "Sentinel-1", "Planet", "CarbonMapper", "Drone LiDAR", "Field plots"],
    series: [0.0, 0.41, 0.78, 1.18],
    baselineSeries: [0.0, 0.0, 0.0, 0.0],
    changes: 1,
  },
  {
    id: "kora",
    code: "VC-KE-004",
    countryCode: "KE",
    name: "Kora Corridor REDD+",
    region: "Kora National Park",
    country: "Kenya",
    type: "REDD+",
    methodology: "VM0048",
    stage: "Baseline",
    lat: -0.33,
    lng: 38.7,
    area: 178780,
    registry: "Verra VCS",
    creditPeriod: "2026-2056",
    cycle: "Baseline",
    updated: "2026-06-06",
    agbd: { mean: 58.9, lo: 44.2, hi: 73.6 },
    carbonStock: 7240000,
    creditForecast: 0,
    uncertaintyPct: 28.1,
    baselineRate: 1.62,
    leakagePct: 0,
    additionality: "Under assessment",
    pools: { agb: 4720000, bgb: 1840000, soc: 580000, dead: 100000 },
    risk: "Pending",
    riskScore: 0,
    permanence: "-",
    fpic: "In review",
    dossier: 18,
    signoff: 0,
    sources: ["Sentinel-2", "Sentinel-1", "Landsat 8/9", "CarbonMapper"],
    series: [7.24],
    baselineSeries: [7.24],
    changes: 0,
  },
  {
    id: "kisite",
    code: "VC-KE-005",
    countryCode: "KE",
    name: "Kisite-Mpunguti Mangrove",
    region: "Shimoni, Kwale",
    country: "Kenya",
    type: "Blue Carbon",
    methodology: "VM0007 / VM0033",
    stage: "Onboarding",
    lat: -4.73,
    lng: 39.38,
    area: 4280,
    registry: "Verra VCS",
    creditPeriod: "TBD",
    cycle: "Scoping",
    updated: "2026-06-01",
    agbd: { mean: 112.0, lo: 78.0, hi: 146.0 },
    carbonStock: 980000,
    creditForecast: 0,
    uncertaintyPct: 32.0,
    baselineRate: 0.94,
    leakagePct: 0,
    additionality: "Screening",
    pools: { agb: 410000, bgb: 220000, soc: 330000, dead: 20000 },
    risk: "Pending",
    riskScore: 0,
    permanence: "-",
    fpic: "Not started",
    dossier: 6,
    signoff: 0,
    sources: ["Sentinel-2", "Planet", "Portfolio Screening"],
    series: [0.98],
    baselineSeries: [0.98],
    changes: 0,
  },
  {
    id: "elgon",
    code: "VC-UG-006",
    countryCode: "UG",
    name: "Mt. Elgon Agroforestry",
    region: "Mbale",
    country: "Uganda",
    type: "Agroforestry",
    methodology: "VM0042",
    stage: "Implementation",
    lat: 1.13,
    lng: 34.55,
    area: 21450,
    registry: "Verra VCS",
    creditPeriod: "2025-2045",
    cycle: "Y1 - 2026",
    updated: "2026-06-03",
    agbd: { mean: 19.8, lo: 12.4, hi: 28.1 },
    carbonStock: 410000,
    creditForecast: 34000,
    uncertaintyPct: 29.4,
    baselineRate: 0,
    leakagePct: 4.0,
    additionality: "Confirmed",
    pools: { agb: 210000, bgb: 82000, soc: 104000, dead: 14000 },
    risk: "Medium",
    riskScore: 44,
    permanence: "Buffer 22%",
    fpic: "Complete",
    dossier: 41,
    signoff: 4,
    sources: ["Sentinel-2", "Sentinel-1", "KoboCollect", "Field plots"],
    series: [0.0, 0.41],
    baselineSeries: [0.0, 0.0],
    changes: 0,
  },
];

export const portfolio = {
  totalArea: projects.reduce((sum, project) => sum + project.area, 0),
  totalStock: projects.reduce((sum, project) => sum + project.carbonStock, 0),
  annualForecast: projects.reduce((sum, project) => sum + project.creditForecast, 0),
  activeProjects: projects.length,
  countries: 2,
  avgUncertainty: 22.8,
  issuedToDate: 1340000,
  bufferPool: 248000,
};

export const pipeline = {
  lastRun: "2026-06-09 04:12 UTC",
  nextRun: "2026-07-01 04:00 UTC",
  stages: [
    { key: "ingest", label: "Ingest", status: "ok", detail: "GEE export - 6 AOIs", metric: "tiles 1.2M", icon: "satellite" },
    { key: "preprocess", label: "Preprocess", status: "ok", detail: "Cloud mask - reproject - normalise", metric: "4 bands", icon: "layers" },
    { key: "eo", label: "EO Engine", status: "ok", detail: "AGBD inference @ 10 m", metric: "router -> SI API", icon: "cpu" },
    { key: "hybrid", label: "MRV Hybrid", status: "running", detail: "Field calibration regression", metric: "Meru Y2", icon: "merge" },
    { key: "accounting", label: "Accounting", status: "queued", detail: "VM0048 logic", metric: "awaiting hybrid", icon: "calculator" },
    { key: "compliance", label: "Compliance", status: "idle", detail: "Gap scan - risk score", metric: "-", icon: "shield" },
  ],
  sources: [
    { name: "Sentinel-2 MSI", provider: "ESA Copernicus - GEE", res: "10 m", cadence: "5-day", cost: "Free", status: "live", latency: "36h" },
    { name: "Sentinel-1 SAR", provider: "ESA Copernicus - GEE", res: "10 m", cadence: "6-12 day", cost: "Free", status: "live", latency: "41h" },
    { name: "Landsat 8 / 9 OLI", provider: "NASA/USGS - GEE", res: "30 m", cadence: "8-day", cost: "Free", status: "live", latency: "2d" },
    { name: "GEDI L4A AGBD", provider: "NASA Earthdata", res: "25 m", cadence: "Annual", cost: "Free", status: "live", latency: "-" },
    { name: "HabitatMapper", provider: "Space Intelligence API", res: "10 m", cadence: "Annual", cost: "Commercial", status: "live", latency: "-" },
    { name: "CarbonMapper", provider: "Space Intelligence API", res: "10 m", cadence: "Annual", cost: "Commercial", status: "live", latency: "-" },
    { name: "Chloris AGBD", provider: "Chloris Geospatial API", res: "10-30 m", cadence: "Annual", cost: "Fallback", status: "standby", latency: "-" },
    { name: "Planet PlanetScope", provider: "Planet Labs API", res: "3 m", cadence: "Daily", cost: "Commercial", status: "live", latency: "12h" },
    { name: "iSDAsoil", provider: "iSDA / OpenGeoHub", res: "30 m", cadence: "Static", cost: "Free", status: "live", latency: "-" },
    { name: "CHIRPS Rainfall", provider: "UCSB - GEE", res: "5 km", cadence: "Daily", cost: "Free", status: "live", latency: "1d" },
    { name: "Hansen GFC", provider: "UMD - GEE", res: "30 m", cadence: "Annual", cost: "Free", status: "live", latency: "-" },
    { name: "GLAD / RADD Alerts", provider: "GFW API", res: "30 m", cadence: "Weekly", cost: "Free", status: "live", latency: "6h" },
    { name: "EarthRanger API", provider: "Ai2 - conservation platform", res: "Point/event", cadence: "Real-time", cost: "Free API", status: "live", latency: "5m", nonGee: true },
    { name: "Earth Map - FAO/JRC", provider: "FAO-Google value-added", res: "100 m-1 km", cadence: "Annual", cost: "Free", status: "live", latency: "-", nonGee: true },
    { name: "WDPA / KBA", provider: "Protected Planet - UNEP-WCMC", res: "Vector", cadence: "Monthly", cost: "Free", status: "live", latency: "-", nonGee: true },
  ],
  router: {
    active: "Space Intelligence API",
    fallback: "Lang CHM + Chloris + allometric",
    internal: "Phase 2-3",
  },
};

export const changeEvents = [
  { id: "CD-19", kind: "Loss", area: "E boundary", ha: 14.2, sigma: 3.1, date: "2026-05-28", source: "Sentinel-2 + RADD", action: "Field verify" },
  { id: "CD-18", kind: "Loss", area: "NE belt", ha: 6.8, sigma: 2.4, date: "2026-05-19", source: "RADD alert", action: "Review" },
  { id: "CD-17", kind: "Gain", area: "Block 7", ha: 22.0, sigma: 2.9, date: "2026-04-30", source: "Sentinel-2", action: "Logged" },
];

export const complianceModules = [
  { key: "add", label: "Additionality evidence", status: "pass", note: "Performance benchmark + investment analysis assembled" },
  { key: "perm", label: "Permanence & reversal", status: "warn", note: "Fire signal flagged - pool deduction pending" },
  { key: "leak", label: "Leakage belt monitoring", status: "pass", note: "10 km belt - HabitatMapper annual" },
  { key: "fpic", label: "FPIC documentation", status: "pass", note: "9/9 community blocks - version-controlled" },
  { key: "benefit", label: "Benefit sharing & grievance", status: "pass", note: "Audit trail current - 0 open grievances" },
  { key: "method", label: "Methodology compliance", status: "warn", note: "3 clauses flagged for sign-off" },
  { key: "dossier", label: "Verification dossier", status: "progress", note: "86% assembled - VVB-ready export" },
  { key: "pdd", label: "PDD draft (AI Generator)", status: "progress", note: "12/18 sections auto-populated" },
];

export const signoffQueue = [
  { id: "Q-241", project: "Meru Reforestation", type: "Additionality", clause: "VM0047 6.2", sev: "high", age: "2d", who: "AI - gap scan", text: "Investment analysis missing IRR sensitivity table for barrier test." },
  { id: "Q-238", project: "Meru Reforestation", type: "FPIC", clause: "AFOLU req. 3.4", sev: "high", age: "3d", who: "AI - completeness", text: "Consent records for 2 of 9 community blocks not yet uploaded." },
  { id: "Q-235", project: "Mt. Elgon Agroforestry", type: "Leakage", clause: "VM0042 5.3", sev: "med", age: "4d", who: "AI - gap scan", text: "Activity-shifting belt definition needs reviewer confirmation." },
  { id: "Q-230", project: "Tsavo East REDD+", type: "Permanence", clause: "VCS buffer", sev: "med", age: "5d", who: "EO - disturbance", text: "Fire signal on eastern boundary - verify pool deduction." },
  { id: "Q-228", project: "Tsavo West REDD+", type: "Baseline", clause: "VM0048 5.1", sev: "low", age: "6d", who: "Analyst", text: "Reference region deforestation rate refreshed - confirm acceptance." },
];

export const fieldSubs = [
  { id: "F-8841", plot: "TSE-P14", type: "DBH + height", enum: "J. Mwangi", trees: 42, when: "2h ago", sync: "synced", gps: "-2.741, 38.793" },
  { id: "F-8840", plot: "TSE-P13", type: "Tree survival", enum: "J. Mwangi", trees: 0, when: "3h ago", sync: "synced", gps: "-2.738, 38.781" },
  { id: "F-8839", plot: "MER-P07", type: "Planting log", enum: "A. Kiptoo", trees: 1200, when: "5h ago", sync: "synced", gps: "0.162, 38.249" },
  { id: "F-8838", plot: "MER-P06", type: "SOC core", enum: "A. Kiptoo", trees: 0, when: "6h ago", sync: "pending", gps: "0.159, 38.244" },
  { id: "F-8837", plot: "ELG-P03", type: "DBH + height", enum: "S. Nakato", trees: 38, when: "1d ago", sync: "synced", gps: "1.131, 34.552" },
  { id: "F-8836", plot: "TSE-P12", type: "Bioacoustics", enum: "Auto - AudioMoth", trees: 0, when: "1d ago", sync: "synced", gps: "-2.752, 38.770" },
];

export const biodiversity = {
  updated: "2026-06-09 06:30 EAT",
  earthRanger: { site: "Tsavo Conservation Area", subjects: 38, activeCollars: 31, events30d: 214, patrolsActive: 7 },
  byProject: {
    "tsavo-east": { intactness: 78, intactDelta: 1.4, species: 142, iucnFlagged: 9, observations: 18400, events30d: 214, snares30d: 11, hwc30d: 6, patrolCoverage: 72, sdgs: [13, 15, 1] },
    "tsavo-west": { intactness: 74, intactDelta: 0.8, species: 128, iucnFlagged: 8, observations: 9200, events30d: 96, snares30d: 7, hwc30d: 4, patrolCoverage: 64, sdgs: [13, 15] },
    meru: { intactness: 69, intactDelta: 3.1, species: 96, iucnFlagged: 5, observations: 4100, events30d: 58, snares30d: 3, hwc30d: 2, patrolCoverage: 58, sdgs: [13, 15, 1, 5] },
    kora: { intactness: 71, intactDelta: 0.4, species: 88, iucnFlagged: 6, observations: 2600, events30d: 31, snares30d: 4, hwc30d: 1, patrolCoverage: 41, sdgs: [13, 15] },
    kisite: { intactness: 83, intactDelta: 2.2, species: 64, iucnFlagged: 4, observations: 980, events30d: 12, snares30d: 0, hwc30d: 0, patrolCoverage: 38, sdgs: [13, 14, 15] },
    elgon: { intactness: 66, intactDelta: 2.7, species: 74, iucnFlagged: 3, observations: 1500, events30d: 22, snares30d: 1, hwc30d: 3, patrolCoverage: 49, sdgs: [13, 15, 2] },
  },
  species: [
    { name: "African elephant", sci: "Loxodonta africana", iucn: "EN", count: 1842, trend: 6.2, collared: 14 },
    { name: "African lion", sci: "Panthera leo", iucn: "VU", count: 96, trend: 3.1, collared: 8 },
    { name: "Reticulated giraffe", sci: "Giraffa reticulata", iucn: "EN", count: 410, trend: 1.8, collared: 5 },
    { name: "Grevy's zebra", sci: "Equus grevyi", iucn: "EN", count: 138, trend: -2.4, collared: 4 },
    { name: "African wild dog", sci: "Lycaon pictus", iucn: "EN", count: 52, trend: 4.6, collared: 0 },
    { name: "Black rhino", sci: "Diceros bicornis", iucn: "CR", count: 28, trend: 0, collared: 0 },
  ],
  events: [
    { id: "ER-5521", type: "Wildlife sighting", cat: "sighting", detail: "Elephant herd - 23 individuals", who: "Ranger - Mwakoma", when: "38m ago", gps: "-2.744, 38.801", sev: "info" },
    { id: "ER-5519", type: "Snare removed", cat: "snare", detail: "Wire snare line - 4 removed", who: "Patrol team 3", when: "2h ago", gps: "-2.781, 38.760", sev: "med" },
    { id: "ER-5517", type: "Human-wildlife conflict", cat: "hwc", detail: "Crop raiding - 2 elephants near Sala", who: "Community report", when: "4h ago", gps: "-2.690, 38.870", sev: "high" },
    { id: "ER-5514", type: "Camera trap", cat: "camera", detail: "Lion pride - 6 individuals", who: "TrapTagger - AI", when: "6h ago", gps: "-2.812, 38.742", sev: "info" },
    { id: "ER-5510", type: "Carcass", cat: "mortality", detail: "Giraffe - natural", who: "Aerial patrol", when: "11h ago", gps: "-2.733, 38.690", sev: "med" },
    { id: "ER-5508", type: "Gunshot detected", cat: "security", detail: "Acoustic sensor - NE sector", who: "Sensor - acoustic", when: "1d ago", gps: "-2.640, 38.820", sev: "high" },
  ],
  landLayers: [
    { key: "lpd", label: "Land Productivity Dynamics", val: "Stable / improving", tone: "brand", pct: 71, src: "Earth Map - JRC LPD (2016-2024)" },
    { key: "degrade", label: "Land degradation (SDG 15.3.1)", val: "8.4% degraded", tone: "warn", pct: 8, src: "Earth Map - Trends.Earth" },
    { key: "bii", label: "Biodiversity Intactness Index", val: "0.78", tone: "teal", pct: 78, src: "Earth Map - PREDICTS BII" },
    { key: "kba", label: "Key Biodiversity Area overlap", val: "64% of AOI", tone: "info", pct: 64, src: "WDPA / KBA - non-GEE" },
  ],
};

export const methodologies = [
  { id: "VM0048", short: "VM0048", name: "Reducing Emissions from Deforestation (REDD+)", registry: "Verra VCS", tone: "brand", status: "Active - Phase 1" },
  { id: "VM0047", short: "VM0047", name: "Afforestation, Reforestation & Revegetation (ARR)", registry: "Verra VCS", tone: "teal", status: "Codified - Phase 1" },
  { id: "VM0042", short: "VM0042", name: "Improved Agricultural Land Management", registry: "Verra VCS", tone: "gold", status: "Phase 2" },
  { id: "VM0007", short: "VM0007", name: "REDD+ Methodology Framework", registry: "Verra VCS", tone: "info", status: "Phase 2" },
  { id: "VM0033", short: "VM0033", name: "Tidal Wetland & Seagrass Restoration", registry: "Verra VCS", tone: "teal", status: "Phase 2" },
  { id: "VM0032", short: "VM0032", name: "Sustainable Grasslands", registry: "Verra VCS", tone: "gold", status: "Backlog" },
  { id: "ART-TREES", short: "ART TREES", name: "Jurisdictional & Nested REDD+", registry: "ART Registry", tone: "info", status: "Phase 3" },
  { id: "GS4GG", short: "Gold Standard", name: "GS4GG - Land Use & Forests A/R", registry: "Gold Standard", tone: "ai", status: "Phase 3" },
];
