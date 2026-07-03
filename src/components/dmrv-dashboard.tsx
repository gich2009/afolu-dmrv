"use client";

import Image from "next/image";
import {
  Activity,
  AlertTriangle,
  Bell,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Cpu,
  Crosshair,
  Download,
  ExternalLink,
  Filter,
  Folder,
  GitMerge,
  Globe2,
  Grid2X2,
  Layers,
  List,
  Map as MapIcon,
  Phone,
  Plus,
  Search,
  Satellite,
  Settings,
  Shield,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Sprout,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  biodiversity,
  changeEvents,
  complianceModules,
  fieldSubs,
  methodologies,
  pipeline,
  portfolio,
  projects,
  signoffQueue,
  type Project,
} from "@/lib/dmrv-data";

type ViewKey =
  | "portfolio"
  | "project"
  | "measurement"
  | "accounting"
  | "compliance"
  | "biodiversity"
  | "pipeline"
  | "field";

type Tone = "neutral" | "brand" | "teal" | "gold" | "warn" | "danger" | "info" | "ai";

const ICONS = {
  activity: Activity,
  alert: AlertTriangle,
  bell: Bell,
  calculator: Calculator,
  check: Check,
  chevD: ChevronDown,
  chevR: ChevronRight,
  circle: CircleDot,
  cpu: Cpu,
  crosshair: Crosshair,
  download: Download,
  external: ExternalLink,
  filter: Filter,
  folder: Folder,
  globe: Globe2,
  grid: Grid2X2,
  layers: Layers,
  list: List,
  map: MapIcon,
  merge: GitMerge,
  phone: Phone,
  plus: Plus,
  search: Search,
  satellite: Satellite,
  settings: Settings,
  shield: Shield,
  sliders: SlidersHorizontal,
  smartphone: Smartphone,
  spark: Sparkles,
  sprout: Sprout,
  upload: Upload,
} satisfies Record<string, LucideIcon>;

type IconKey = keyof typeof ICONS;

const nav: { group: string; items: { key: ViewKey; label: string; icon: IconKey }[] }[] = [
  {
    group: "Overview",
    items: [
      { key: "portfolio", label: "Portfolio", icon: "grid" },
      { key: "project", label: "Project dashboard", icon: "map" },
    ],
  },
  {
    group: "Engines",
    items: [
      { key: "measurement", label: "Measurement", icon: "cpu" },
      { key: "accounting", label: "Carbon accounting", icon: "calculator" },
      { key: "compliance", label: "Compliance", icon: "shield" },
      { key: "biodiversity", label: "Biodiversity", icon: "globe" },
    ],
  },
  {
    group: "Operations",
    items: [
      { key: "pipeline", label: "Data pipeline", icon: "merge" },
      { key: "field", label: "Field data", icon: "smartphone" },
    ],
  },
];

const titles: Record<ViewKey, [string, string]> = {
  portfolio: ["Portfolio", "All enrolled AFOLU projects"],
  project: ["Project dashboard", "Boundary, carbon stock & status"],
  measurement: ["Measurement Engine", "What is the carbon?"],
  accounting: ["Carbon Accounting Engine", "What can be claimed?"],
  compliance: ["Compliance Engine", "Will it pass VVB review?"],
  biodiversity: ["Biodiversity & Co-benefits", "EarthRanger - Earth Map - beyond carbon"],
  pipeline: ["Data pipeline", "GEE ingestion -> engines"],
  field: ["Field data collection", "Offline-first MRV inputs"],
};

const tour = [
  { view: "pipeline" as ViewKey, project: "tsavo-east", step: "Ingest", title: "New imagery lands", body: "Sentinel-2 and Sentinel-1 acquisitions are pulled through Google Earth Engine, cloud-masked, and normalised." },
  { view: "measurement" as ViewKey, step: "Measure", title: "AGBD is re-estimated", body: "The site-specific Bayesian model produces an updated above-ground biomass map at 10 m with uncertainty." },
  { view: "measurement" as ViewKey, step: "Detect", title: "Disturbance is flagged", body: "Year-on-year differencing detects patches beyond the expected growth trajectory and routes them to review." },
  { view: "measurement" as ViewKey, step: "Calibrate", title: "Hybrid MRV tightens uncertainty", body: "Field-plot DBH and height measurements calibrate the EO estimate into a validated carbon dataset." },
  { view: "accounting" as ViewKey, step: "Account", title: "Credits are computed", body: "VM0048 logic refreshes the dynamic baseline, computes leakage, and forecasts issuance at the lower confidence bound." },
  { view: "compliance" as ViewKey, step: "Comply", title: "Gaps and risk are scanned", body: "AI checks methodology completeness, scores risk, verifies FPIC, and populates the sign-off queue." },
  { view: "compliance" as ViewKey, step: "Report", title: "Dossier is assembled", body: "The verification dossier is compiled and the AI PDD Generator receives structured project data." },
];

function AppIcon({ name, size = 16, className }: { name: IconKey; size?: number; className?: string }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden className={className} size={size} strokeWidth={1.6} />;
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function short(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.00$/, "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

function pctTone(value: number): Tone {
  if (value >= 28) return "warn";
  if (value >= 20) return "gold";
  return "teal";
}

function toneVar(tone: Tone) {
  return `var(--${tone === "neutral" ? "text-2" : tone})`;
}

function Dot({ state, pulse }: { state: string; pulse?: boolean }) {
  const color =
    state === "ok" || state === "live" || state === "pass"
      ? "var(--brand)"
      : state === "running"
        ? "var(--teal)"
        : state === "warn" || state === "queued"
          ? "var(--gold)"
          : state === "danger" || state === "fail"
            ? "var(--danger)"
            : "var(--text-3)";
  return (
    <span className="dot" style={{ "--dot": color } as React.CSSProperties}>
      {pulse && <span />}
    </span>
  );
}

function Badge({ children, tone = "neutral", solid = false }: { children: React.ReactNode; tone?: Tone; solid?: boolean }) {
  const color = toneVar(tone);
  return (
    <span className={`badge ${solid ? "badge-solid" : ""}`} style={{ "--badge": color } as React.CSSProperties}>
      {children}
    </span>
  );
}

function StageChip({ stage }: { stage: Project["stage"] }) {
  const tone: Tone =
    stage === "Monitoring"
      ? "brand"
      : stage === "Verification"
        ? "gold"
        : stage === "Implementation"
          ? "teal"
          : stage === "Baseline"
            ? "info"
            : "neutral";
  return <Badge tone={tone}>{stage}</Badge>;
}

function RiskBadge({ risk }: { risk: Project["risk"] }) {
  const tone: Tone = risk === "Low" ? "brand" : risk === "Medium" ? "warn" : risk === "High" ? "danger" : "neutral";
  return <Badge tone={tone}>{risk} risk</Badge>;
}

function PanelHead({ icon, title, sub, right }: { icon?: IconKey; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="panel-head">
      {icon && <AppIcon name={icon} className="accent" />}
      <div className="panel-title">
        <span>{title}</span>
        {sub && <small>{sub}</small>}
      </div>
      {right && <div className="panel-actions">{right}</div>}
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  sub,
  delta,
  tone = "brand",
  spark,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: string;
  delta?: number;
  tone?: Tone;
  spark?: number[];
}) {
  return (
    <div className="panel stat">
      <span className="lbl">{label}</span>
      <div className="stat-line">
        <span className="kpi-num">{value}</span>
        {unit && <span className="unit mono">{unit}</span>}
        {delta != null && <span className={`delta ${delta < 0 ? "down" : ""}`}>{delta > 0 ? "+" : ""}{delta}%</span>}
      </div>
      {spark && <Spark data={spark} tone={tone} />}
      {sub && <small>{sub}</small>}
    </div>
  );
}

function Spark({ data, tone = "brand", height = 26 }: { data: number[]; tone?: Tone; height?: number }) {
  const width = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / Math.max(1, data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const d = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden>
      <path d={`${d} L${width} ${height} L0 ${height} Z`} fill={`var(--${tone})`} opacity="0.1" />
      <path d={d} fill="none" stroke={`var(--${tone})`} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2" fill={`var(--${tone})`} />
    </svg>
  );
}

function Bar({ pct, tone = "brand", height = 6 }: { pct: number; tone?: Tone; height?: number }) {
  return (
    <span className="bar" style={{ height }}>
      <span style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: `var(--${tone})` }} />
    </span>
  );
}

function HBars({ items }: { items: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...items.map((item) => item.value)) || 1;
  return (
    <div className="hbars">
      {items.map((item) => (
        <div key={item.label}>
          <span>{item.label}</span>
          <Bar pct={(item.value / max) * 100} />
          <b className="mono">{item.value >= 1_000_000 ? `${(item.value / 1_000_000).toFixed(1)}M` : fmt(item.value)}</b>
        </div>
      ))}
    </div>
  );
}

function Donut({
  segments,
  size = 124,
  thick = 18,
  center,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thick?: number;
  center?: React.ReactNode;
}) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = (size - thick) / 2;
  const circ = 2 * Math.PI * radius;
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={thick} />
        {segments.map((segment, index) => {
          const len = (segment.value / total) * circ;
          const prior = segments.slice(0, index).reduce((sum, item) => sum + (item.value / total) * circ, 0);
          const dash = `${len} ${circ - len}`;
          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={thick}
              strokeDasharray={dash}
              strokeDashoffset={-prior}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      {center && <div>{center}</div>}
    </div>
  );
}

function Gauge({
  pct,
  value,
  label,
  tone = "teal",
  size = 92,
}: {
  pct: number;
  value: React.ReactNode;
  label?: string;
  tone?: Tone;
  size?: number;
}) {
  const thick = 9;
  const radius = (size - thick) / 2;
  const circ = 2 * Math.PI * radius;
  const len = (Math.max(0, Math.min(100, pct)) / 100) * circ;
  return (
    <div className="gauge" style={{ width: size }}>
      <div style={{ width: size, height: size }}>
        <svg width={size} height={size} aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={thick} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`var(--${tone})`}
            strokeWidth={thick}
            strokeDasharray={`${len} ${circ}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span className="kpi-num">{value}</span>
      </div>
      {label && <small className="lbl">{label}</small>}
    </div>
  );
}

function BaselineChart({ project, height = 190 }: { project: Project; height?: number }) {
  const width = 520;
  const startYear = Number.parseInt(project.creditPeriod, 10) || 2023;
  const all = [...project.series, ...project.baselineSeries];
  const max = Math.max(...all) * 1.08;
  const min = Math.min(...all, 0);
  const padTop = 12;
  const padBottom = 24;
  const x = (index: number) => 10 + (index / Math.max(1, project.series.length - 1)) * (width - 28);
  const y = (value: number) => padTop + (1 - (value - min) / (max - min || 1)) * (height - padTop - padBottom);
  const line = (values: number[]) => values.map((value, index) => `${index ? "L" : "M"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join(" ");
  const projectLine = line(project.series);
  const baselineLine = line(project.baselineSeries);

  return (
    <svg className="baseline-chart" viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {[0, 0.25, 0.5, 0.75, 1].map((g) => {
        const yy = padTop + g * (height - padTop - padBottom);
        return <line key={g} x1="10" x2={width - 18} y1={yy} y2={yy} stroke="var(--line)" />;
      })}
      {project.series.length > 1 && (
        <>
          <path d={`${projectLine} L${x(project.series.length - 1)} ${y(min)} L${x(0)} ${y(min)} Z`} fill="var(--brand)" opacity="0.12" />
          <path d={baselineLine} fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d={projectLine} fill="none" stroke="var(--brand)" strokeWidth="2" />
        </>
      )}
      {project.series.map((value, index) => (
        <g key={`${value}-${index}`}>
          <circle cx={x(index)} cy={y(value)} r="2.8" fill="var(--brand)" />
          <text x={x(index)} y={height - 6} textAnchor="middle" className="mono">
            {startYear + index}
          </text>
        </g>
      ))}
    </svg>
  );
}

function hash2(x: number, y: number, seed: number) {
  let h = x * 374761393 + y * 668265263 + seed * 2147483647;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 100000) / 100000;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  const u = smooth(xf);
  const v = smooth(yf);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

function fbm(x: number, y: number, seed: number) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 5; i += 1) {
    value += amp * noise(x * freq, y * freq, seed + i * 7);
    freq *= 2;
    amp *= 0.5;
  }
  return value;
}

function makePolygon(seed: number, n = 26) {
  const points: [number, number][] = [];
  for (let i = 0; i < n; i += 1) {
    const angle = (i / n) * Math.PI * 2;
    const radius = 0.3 + 0.085 * fbm(Math.cos(angle) * 1.5 + 4, Math.sin(angle) * 1.5 + 4, seed) + 0.04 * Math.sin(angle * 3 + seed);
    points.push([0.5 + radius * Math.cos(angle), 0.5 + radius * Math.sin(angle) * 0.82]);
  }
  return points;
}

function pointInPoly(px: number, py: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function mix(a: readonly number[], b: readonly number[], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

const ramps = {
  biomass: [
    [0, [36, 50, 22]],
    [0.4, [94, 126, 30]],
    [0.6, [155, 190, 46]],
    [0.8, [79, 179, 90]],
    [1, [25, 211, 107]],
  ],
  change: [
    [0, [206, 64, 64]],
    [0.5, [60, 70, 60]],
    [1, [40, 200, 110]],
  ],
  forest: [
    [0, [24, 32, 26]],
    [0.5, [30, 120, 60]],
    [1, [22, 150, 74]],
  ],
  terrain: [
    [0, [28, 40, 33]],
    [0.6, [110, 134, 110]],
    [1, [200, 210, 196]],
  ],
  satellite: [
    [0, [40, 46, 34]],
    [0.6, [60, 82, 48]],
    [1, [38, 64, 40]],
  ],
} as const;

function ramp(style: keyof typeof ramps, t: number) {
  const stops = ramps[style] || ramps.biomass;
  const v = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (v <= stops[i + 1][0]) {
      const lt = (v - stops[i][0]) / (stops[i + 1][0] - stops[i][0] || 1);
      return mix(stops[i][1], stops[i + 1][1], lt);
    }
  }
  return stops[stops.length - 1][1];
}

function MapHero({
  project,
  mapStyle = "biomass",
  compact = false,
  overlays = {},
}: {
  project: Project;
  mapStyle?: keyof typeof ramps;
  compact?: boolean;
  overlays?: { wildlife?: boolean; changes?: boolean; plots?: boolean; leakage?: boolean };
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const view = useRef({ scale: 1, ox: 0, oy: 0, drag: null as null | { x: number; y: number; ox: number; oy: number } });
  const [, force] = useState(0);
  const seed = useMemo(() => project.id.split("").reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 9973, 0), [project.id]);
  const poly = useMemo(() => makePolygon((seed % 997) + 11), [seed]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#07100b";
    ctx.fillRect(0, 0, width, height);
    const { scale, ox, oy } = view.current;
    const size = Math.min(width, height);
    const px0 = (width - size) / 2 + ox;
    const py0 = (height - size) / 2 + oy;
    const sx = (nx: number) => px0 + nx * size * scale - ((scale - 1) * size) / 2;
    const sy = (ny: number) => py0 + ny * size * scale - ((scale - 1) * size) / 2;
    const nx = (x: number) => (x - px0 + ((scale - 1) * size) / 2) / (size * scale);
    const ny = (y: number) => (y - py0 + ((scale - 1) * size) / 2) / (size * scale);
    const cell = compact ? 5 : 5;

    for (let y = 0; y < height; y += cell) {
      for (let x = 0; x < width; x += cell) {
        const px = nx(x + cell / 2);
        const py = ny(y + cell / 2);
        if (px < 0 || px > 1 || py < 0 || py > 1 || !pointInPoly(px, py, poly)) continue;
        let value = Math.pow(fbm(px * 6.5 + 1, py * 6.5 + 1, seed), 1.15);
        const edge = Math.min(1, (0.5 - Math.max(Math.abs(px - 0.5), Math.abs(py - 0.5))) * 3 + 0.35);
        value *= 0.55 + 0.6 * edge;
        if (mapStyle === "change") value = 0.5 + (fbm(px * 9 + 5, py * 9, seed + 3) - 0.5) * 1.7;
        if (mapStyle === "forest") value = value > 0.42 ? 0.8 + value * 0.2 : value * 0.9;
        const color = ramp(mapStyle, value);
        ctx.fillStyle = `rgb(${color.map((part) => part | 0).join(",")})`;
        ctx.fillRect(x, y, cell, cell);
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i += 1) {
      const gx = (i / 8) * width;
      const gy = (i / 8) * height;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    if (overlays.leakage !== false) {
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = "rgba(47,208,187,.55)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      poly.forEach(([x, y], index) => {
        const px = sx(0.5 + (x - 0.5) * 1.16);
        const py = sy(0.5 + (y - 0.5) * 1.16);
        if (index) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    ctx.beginPath();
    poly.forEach(([x, y], index) => {
      if (index) ctx.lineTo(sx(x), sy(y));
      else ctx.moveTo(sx(x), sy(y));
    });
    ctx.closePath();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#1fa94f";
    ctx.lineWidth = 2;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(31,169,79,.05)";
    ctx.fill();

    if (overlays.plots !== false) {
      ctx.fillStyle = "rgba(255,255,255,.85)";
      for (let i = 0; i < 14; i += 1) {
        const angle = hash2(i, 1, seed + 50) * Math.PI * 2;
        const rr = 0.08 + hash2(i, 2, seed + 50) * 0.34;
        const px = 0.5 + rr * Math.cos(angle);
        const py = 0.5 + rr * Math.sin(angle) * 0.82;
        if (!pointInPoly(px, py, poly)) continue;
        ctx.fillRect(sx(px) - 1.6, sy(py) - 1.6, 3.2, 3.2);
      }
    }

    if (overlays.changes !== false && project.changes) {
      for (let i = 0; i < project.changes; i += 1) {
        const angle = hash2(i, 9, seed) * Math.PI * 2;
        const rr = 0.2 + hash2(i, 8, seed) * 0.25;
        const px = 0.5 + rr * Math.cos(angle);
        const py = 0.5 + rr * Math.sin(angle) * 0.82;
        const loss = i % 3 !== 2;
        ctx.beginPath();
        ctx.arc(sx(px), sy(py), 6, 0, 7);
        ctx.strokeStyle = loss ? "#ef5b5b" : "#19d36b";
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx(px), sy(py), 2, 0, 7);
        ctx.fillStyle = loss ? "#ef5b5b" : "#19d36b";
        ctx.fill();
      }
    }

    if (overlays.wildlife) {
      ctx.lineWidth = 1.4;
      for (let track = 0; track < 3; track += 1) {
        ctx.beginPath();
        ctx.strokeStyle = track === 0 ? "rgba(155,124,240,.8)" : "rgba(47,208,187,.7)";
        let px = 0.4 + hash2(track, 1, seed + 120) * 0.2;
        let py = 0.4 + hash2(track, 2, seed + 120) * 0.2;
        ctx.moveTo(sx(px), sy(py));
        for (let step = 1; step < 12; step += 1) {
          px = Math.max(0.12, Math.min(0.88, px + (hash2(track, step + 10, seed + 120) - 0.5) * 0.12));
          py = Math.max(0.12, Math.min(0.88, py + (hash2(track, step + 40, seed + 120) - 0.5) * 0.1));
          ctx.lineTo(sx(px), sy(py));
        }
        ctx.stroke();
      }
      const cats = ["#9b7cf0", "#2fd0bb", "#f0a92c", "#ef5b5b"];
      for (let i = 0; i < 22; i += 1) {
        const angle = hash2(i, 5, seed + 120) * Math.PI * 2;
        const rr = 0.1 + hash2(i, 6, seed + 120) * 0.36;
        const px = 0.5 + rr * Math.cos(angle);
        const py = 0.5 + rr * Math.sin(angle) * 0.82;
        if (!pointInPoly(px, py, poly)) continue;
        const color = cats[i % cats.length];
        ctx.beginPath();
        ctx.arc(sx(px), sy(py), 3.2, 0, 7);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx(px), sy(py), 5.2, 0, 7);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  };

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      view.current.scale = Math.max(1, Math.min(6, view.current.scale * factor));
      if (view.current.scale === 1) {
        view.current.ox = 0;
        view.current.oy = 0;
      }
      draw();
    };
    const onDown = (event: PointerEvent) => {
      view.current.drag = { x: event.clientX, y: event.clientY, ox: view.current.ox, oy: view.current.oy };
    };
    const onMove = (event: PointerEvent) => {
      const drag = view.current.drag;
      if (!drag) return;
      view.current.ox = drag.ox + event.clientX - drag.x;
      view.current.oy = drag.oy + event.clientY - drag.y;
      draw();
    };
    const onUp = () => {
      view.current.drag = null;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  });

  const zoom = (factor: number) => {
    view.current.scale = Math.max(1, Math.min(6, view.current.scale * factor));
    if (view.current.scale === 1) {
      view.current.ox = 0;
      view.current.oy = 0;
    }
    draw();
    force((n) => n + 1);
  };
  const reset = () => {
    view.current = { scale: 1, ox: 0, oy: 0, drag: null };
    draw();
    force((n) => n + 1);
  };

  return (
    <div className="map-hero">
      <canvas ref={canvasRef} />
      <div className="map-chip map-chip-left">
        <Badge tone="brand" solid>{project.code}</Badge>
        <span>{project.name}</span>
      </div>
      <div className="map-meta mono">{project.lat.toFixed(3)}, {project.lng.toFixed(3)} - EPSG:4326</div>
      <div className="map-legend">
        <span className="lbl">{mapStyle === "change" ? "Delta biomass" : mapStyle === "forest" ? "Forest cover" : mapStyle === "terrain" ? "Elevation" : "AGBD - Mg ha-1"}</span>
        <span className="legend-ramp" />
      </div>
      <div className="map-zoom">
        <button type="button" onClick={() => zoom(1.3)} aria-label="Zoom in"><AppIcon name="plus" /></button>
        <button type="button" onClick={() => zoom(1 / 1.3)} aria-label="Zoom out"><AppIcon name="chevD" /></button>
        <button type="button" onClick={reset} aria-label="Reset map"><AppIcon name="crosshair" /></button>
      </div>
      <div className="scale mono"><span />5 km - Sentinel-2 - 10 m - GEE</div>
    </div>
  );
}

function poolSegments(project: Project) {
  return [
    { label: "Above-ground (AGB)", value: project.pools.agb, color: "var(--brand)" },
    { label: "Below-ground (BGB)", value: project.pools.bgb, color: "var(--brand-2)" },
    { label: "Soil organic (SOC)", value: project.pools.soc, color: "var(--gold)" },
    { label: "Dead wood & litter", value: project.pools.dead, color: "var(--teal)" },
  ];
}

function PortfolioView({ openProject, activeProject }: { openProject: (id: string) => void; activeProject: Project }) {
  const [focus, setFocus] = useState(activeProject.id);
  const focused = projects.find((project) => project.id === focus) || activeProject;
  const byType = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.type] = (acc[project.type] || 0) + project.area;
    return acc;
  }, {});
  const colors: Record<string, string> = { "REDD+": "var(--brand)", ARR: "var(--brand-2)", Agroforestry: "var(--gold)", "Blue Carbon": "var(--teal)" };
  const typeSegments = Object.entries(byType).map(([label, value]) => ({ label, value, color: colors[label] || "var(--text-3)" }));

  return (
    <div className="view-stack vc-in">
      <div className="kpi-grid six">
        <Stat label="Active projects" value={portfolio.activeProjects} sub={`${portfolio.countries} countries - Kenya, Uganda`} />
        <Stat label="Area under MRV" value={short(portfolio.totalArea)} unit="ha" sub="Across 6 AOIs" />
        <Stat label="Carbon stock" value={short(portfolio.totalStock)} unit="tCO2e" spark={[18, 19, 20.5, 22, 24.3]} sub="Verified + modelled" />
        <Stat label="Annual forecast" value={short(portfolio.annualForecast)} unit="tCO2e/yr" delta={8} />
        <Stat label="Issued to date" value={short(portfolio.issuedToDate)} unit="credits" sub={`Buffer pool ${short(portfolio.bufferPool)}`} />
        <Stat label="Avg uncertainty" value={portfolio.avgUncertainty} unit="%" tone="teal" sub="95% credible interval" />
      </div>
      <div className="panel table-panel">
        <PanelHead icon="grid" title="Project portfolio" sub="Enrolled AFOLU projects across the pipeline" right={<><button className="btn ghost"><AppIcon name="filter" />Filter</button><button className="btn"><AppIcon name="plus" />Enrol project</button></>} />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {["Project", "Stage", "Area", "Carbon stock", "Forecast/yr", "Uncert.", "Risk", "Trend"].map((head) => <th key={head}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} onClick={() => openProject(project.id)} onMouseEnter={() => setFocus(project.id)}>
                  <td>
                    <div className="project-cell">
                      <Dot state={project.stage === "Verification" ? "queued" : project.stage === "Onboarding" || project.stage === "Baseline" ? "pending" : "ok"} />
                      <div>
                        <b>{project.countryCode} {project.name}</b>
                        <small className="mono">{project.code} - {project.type} - {project.methodology}</small>
                      </div>
                    </div>
                  </td>
                  <td><StageChip stage={project.stage} /></td>
                  <td className="mono align-r">{fmt(project.area)} <small>ha</small></td>
                  <td className="mono align-r">{short(project.carbonStock)}</td>
                  <td className="mono align-r">{project.creditForecast ? short(project.creditForecast) : <small>-</small>}</td>
                  <td className={`mono align-r ${pctTone(project.uncertaintyPct)}`}>+/-{project.uncertaintyPct}%</td>
                  <td className="align-r"><RiskBadge risk={project.risk} /></td>
                  <td><Spark data={project.series.length > 1 ? project.series : [project.series[0], project.series[0]]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bottom-grid">
        <div className="panel map-panel">
          <PanelHead icon="map" title="Regional view" sub={focused.name} right={<button className="btn ghost" onClick={() => openProject(focused.id)}>Open <AppIcon name="chevR" /></button>} />
          <MapHero project={focused} compact />
        </div>
        <div className="panel composition-panel">
          <PanelHead icon="circle" title="Composition" sub="Area by type" />
          <div className="donut-row">
            <Donut segments={typeSegments} center={<><b className="kpi-num">{short(portfolio.totalArea)}</b><small>ha</small></>} />
            <div className="legend-list">
              {typeSegments.map((segment) => <LegendItem key={segment.label} color={segment.color} label={segment.label} value={`${short(segment.value)} ha`} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="legend-item">
      <span style={{ background: color }} />
      <small>{label}</small>
      <b className="mono">{value}</b>
    </div>
  );
}

function ProjectView({ project }: { project: Project }) {
  return (
    <div className="split-view vc-in">
      <div className="main-column">
        <div className="panel hero-panel">
          <PanelHead icon="map" title="Project boundary & carbon stock" sub={`${fmt(project.area)} ha - ${project.methodology} - ${project.registry}`} right={<><Badge tone="teal">10 km leakage belt</Badge><Badge>14 control plots</Badge></>} />
          <MapHero project={project} />
        </div>
        <div className="kpi-grid four">
          <Stat label="Carbon stock" value={short(project.carbonStock)} unit="tCO2e" />
          <Stat label="Credit forecast" value={project.creditForecast ? short(project.creditForecast) : "-"} unit="tCO2e/yr" />
          <Stat label="AGBD mean" value={project.agbd.mean} unit="Mg/ha" tone="gold" sub={`CI ${project.agbd.lo}-${project.agbd.hi}`} />
          <Stat label="Baseline rate" value={project.baselineRate ? `${project.baselineRate}%` : "n/a"} unit={project.baselineRate ? "/yr loss" : ""} tone="warn" />
        </div>
      </div>
      <ProjectRail project={project} />
    </div>
  );
}

function ProjectRail({ project }: { project: Project }) {
  const pools = poolSegments(project);
  return (
    <aside className="right-rail">
      <div className="panel project-summary">
        <div className="rail-title">
          <div><b>{project.countryCode} {project.name}</b><small className="mono">{project.code} - {project.cycle}</small></div>
          <StageChip stage={project.stage} />
        </div>
        <div className="gauge-row">
          <Gauge pct={100 - project.uncertaintyPct} value={`+/-${project.uncertaintyPct}%`} label="Uncertainty" />
          <Gauge pct={project.riskScore || 6} value={project.risk === "Pending" ? "-" : project.riskScore} label="Risk score" tone={project.risk === "Low" ? "brand" : "warn"} />
          <Gauge pct={project.dossier} value={`${project.dossier}%`} label="VVB ready" tone="info" />
        </div>
      </div>
      <div className="panel">
        <PanelHead icon="calculator" title="Carbon pools" sub="Across 4 IPCC pools" />
        <div className="donut-row">
          <Donut segments={pools} center={<><b className="kpi-num">{short(project.carbonStock)}</b><small>tCO2e</small></>} />
          <div className="legend-list">{pools.map((pool) => <LegendItem key={pool.label} color={pool.color} label={pool.label} value={short(pool.value)} />)}</div>
        </div>
      </div>
      <div className="panel">
        <PanelHead icon="activity" title="Baseline vs. project" sub="Dynamic baseline - control plots" />
        <div className="chart-pad"><BaselineChart project={project} height={150} /></div>
      </div>
      <div className="panel">
        <PanelHead icon="sprout" title="Data sources" sub={`${project.sources.length} active feeds`} />
        <div className="chip-cloud">{project.sources.map((source) => <span key={source} className="mono">{source}</span>)}</div>
      </div>
    </aside>
  );
}

function MeasurementView({ project }: { project: Project }) {
  const [layer, setLayer] = useState<keyof typeof ramps>("biomass");
  const hist = Array.from({ length: 22 }, (_, index) => {
    const x = index / 21;
    return Math.exp(-Math.pow((x - 0.5) * 2.4, 2)) * (0.7 + 0.3 * Math.sin(index + project.code.length));
  });
  const hmax = Math.max(...hist);
  const scatter = Array.from({ length: 28 }, (_, index) => {
    const x = hash2(index, 3, project.area % 900);
    const y = Math.max(0, Math.min(1, x * 0.86 + (hash2(index, 9, 7) - 0.5) * 0.22));
    return [x, y];
  });

  return (
    <div className="split-view vc-in">
      <div className="main-column">
        <div className="panel hero-panel">
          <PanelHead icon="cpu" title="Measurement Engine - AGBD @ 10 m" sub="Site-specific Bayesian biomass model" right={<div className="segmented">{(["biomass", "change", "forest", "terrain"] as const).map((item) => <button key={item} type="button" className={layer === item ? "active" : ""} onClick={() => setLayer(item)}>{item === "biomass" ? "AGBD" : item === "change" ? "Change" : item}</button>)}</div>} />
          <MapHero project={project} mapStyle={layer} overlays={{ changes: true }} />
        </div>
        <div className="panel">
          <PanelHead icon="alert" title="Change detection" sub="Events > 2 sigma from expected growth trajectory" right={<Badge tone="warn">{changeEvents.filter((event) => event.kind === "Loss").length} loss flagged</Badge>} />
          <div className="table-scroll small">
            <table>
              <tbody>{changeEvents.map((event) => <tr key={event.id}>
                <td><Badge tone={event.kind === "Loss" ? "danger" : "brand"}>{event.kind}</Badge></td>
                <td>{event.area}</td>
                <td className="mono align-r">{event.ha} ha</td>
                <td className={`mono align-r ${event.sigma > 3 ? "danger" : "warn"}`}>{event.sigma} sigma</td>
                <td className="mono muted">{event.source}</td>
                <td className="mono muted">{event.date}</td>
                <td className="align-r"><button className="btn ghost">{event.action}</button></td>
              </tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
      <aside className="right-rail">
        <div className="panel metric-card">
          <span className="lbl">AGBD distribution</span>
          <div className="histogram">{hist.map((value, index) => <span key={index} style={{ height: `${(value / hmax) * 100}%`, background: `rgb(${ramp("biomass", index / 21).map((part) => part | 0).join(",")})` }} />)}</div>
          <div className="triad">
            <b className="kpi-num gold">{project.agbd.mean}<small>mean</small></b>
            <b className="kpi-num">{project.agbd.lo}<small>lower CI</small></b>
            <b className="kpi-num">{project.agbd.hi}<small>upper CI</small></b>
          </div>
        </div>
        <div className="panel metric-card">
          <span className="lbl">Hybrid MRV calibration</span>
          <small>EO-derived vs. field plot tCO2e - R2 = 0.86</small>
          <svg viewBox="0 0 200 130" className="scatter">
            <line x1="20" y1="110" x2="190" y2="110" />
            <line x1="20" y1="10" x2="20" y2="110" />
            <line x1="20" y1="110" x2="190" y2="14" className="dash" />
            {scatter.map(([x, y], index) => <circle key={index} cx={20 + x * 168} cy={110 - y * 96} r="2.6" />)}
          </svg>
        </div>
        <div className="panel">
          <PanelHead icon="spark" title="Model card" sub="HabitatMapper - Bayesian UQ" />
          <KeyValue rows={[["Approach", "Deep Bayesian (GP + VI)"], ["Reference", "Field - LiDAR - GEDI L4A"], ["Predictors", "S2 - S1 SAR - DEM"], ["UQ", "95% credible interval"], ["Resolution", "10 m - annual"], ["Accuracy", "> 90% forest cover"]]} />
        </div>
      </aside>
    </div>
  );
}

function KeyValue({ rows }: { rows: [string, string][] }) {
  return <div className="kv">{rows.map(([key, value]) => <div key={key}><span>{key}</span><b className="mono">{value}</b></div>)}</div>;
}

function methodSteps(id: string, project: Project) {
  const stock = `${short(project.carbonStock)} tCO2e`;
  const table: Record<string, [string, string, string][]> = {
    VM0048: [
      ["Baseline scenario", "Historical deforestation rate from SI Forest Cover Benchmark Map. Refreshed dynamically each cycle.", project.baselineRate ? `${project.baselineRate}%/yr loss` : "jurisdictional rate"],
      ["Project carbon stock", "Annual stocks across 4 pools from validated Measurement Engine outputs.", stock],
      ["Leakage", "Activity-shifting via HabitatMapper leakage-belt land-cover time series.", `${project.leakagePct || 0}%`],
      ["Net additionality", "Dynamic baseline - project - leakage, anchored on live control plots.", project.additionality],
      ["Credit forecast", "Lower bound of 90% CI used for issuance.", project.creditForecast ? `${short(project.creditForecast)}/yr` : "pending"],
    ],
    VM0047: [
      ["Baseline", "Pre-project carbon held constant on degraded land.", "static baseline"],
      ["Project removals", "AGB + BGB + SOC accumulation from planting.", stock],
      ["Leakage", "Activity-shifting and ecological leakage deduction.", `${project.leakagePct || 4}%`],
      ["Additionality", "Performance benchmark plus investment or barrier analysis.", "benchmark + barrier"],
      ["Net removals", "GHG removals minus buffer pool; conservative lower CI applied.", "buffer 15-20%"],
    ],
  };
  return (table[id] || table.VM0048).map((step, index) => ({ n: index + 1, title: step[0], detail: step[1], value: step[2] }));
}

function AccountingView({ project }: { project: Project }) {
  const [method, setMethod] = useState("VM0048");
  const curMethod = methodologies.find((item) => item.id === method) || methodologies[0];
  const startYear = Number.parseInt(project.creditPeriod, 10) || 2024;
  const rows = Array.from({ length: 6 }, (_, index) => {
    const gross = (project.creditForecast || project.carbonStock * 0.045) * (1 + index * 0.03);
    const leakage = (gross * (project.leakagePct || 5)) / 100;
    const net = gross - leakage;
    const lower = net * (1 - project.uncertaintyPct / 100);
    return { year: startYear + index, gross, leakage, net, lower };
  });
  const steps = methodSteps(method, project);

  return (
    <div className="split-view vc-in">
      <div className="main-column">
        <div className="kpi-grid four">
          <Stat label="Gross removals" value={short(rows[0].gross)} unit="tCO2e/yr" />
          <Stat label="Leakage deduction" value={`-${short(rows[0].leakage)}`} unit="tCO2e" tone="warn" />
          <Stat label="Net additionality" value={short(rows[0].net)} unit="tCO2e/yr" />
          <Stat label="Issuance (lower CI)" value={short(rows[0].lower)} unit="tCO2e" tone="teal" sub={`conservative -${project.uncertaintyPct}%`} />
        </div>
        <div className="panel chart-panel">
          <PanelHead icon="activity" title="Baseline vs. project trajectory" sub="Dynamic baseline - Bayesian CI band" right={<Badge tone={curMethod.tone as Tone}>{curMethod.short}</Badge>} />
          <div className="chart-pad"><BaselineChart project={project} height={240} /></div>
        </div>
        <div className="panel">
          <PanelHead icon="calculator" title="Credit forecast" sub="Forward projection with confidence bounds" right={<button className="btn ghost"><AppIcon name="download" />Export CSV</button>} />
          <div className="table-scroll small">
            <table>
              <thead><tr>{["Vintage", "Gross", "Leakage", "Net", "Issuance (-CI)", ""].map((head) => <th key={head}>{head}</th>)}</tr></thead>
              <tbody>{rows.map((row) => <tr key={row.year}>
                <td className="mono"><b>{row.year}</b></td>
                <td className="mono align-r">{fmt(Math.round(row.gross))}</td>
                <td className="mono align-r warn">-{fmt(Math.round(row.leakage))}</td>
                <td className="mono align-r">{fmt(Math.round(row.net))}</td>
                <td className="mono align-r teal">{fmt(Math.round(row.lower))}</td>
                <td><Bar pct={(row.lower / rows[5].gross) * 100} tone="teal" /></td>
              </tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
      <aside className="panel method-rail">
        <PanelHead icon="list" title={`${curMethod.short} computation`} sub={curMethod.name} right={<select className="method-select" value={method} onChange={(event) => setMethod(event.target.value)}>{methodologies.map((item) => <option key={item.id} value={item.id}>{item.short}</option>)}</select>} />
        {project.methodology !== method && !project.methodology.includes(method) && <div className="notice"><AppIcon name="alert" /> Previewing {curMethod.short} logic. This project runs {project.methodology}.</div>}
        <div className="step-list">{steps.map((step) => <div key={step.n}>
          <span className="step-num mono">{step.n}</span>
          <div><b>{step.title}</b><p>{step.detail}</p><strong className="mono">{step.value}</strong></div>
        </div>)}</div>
        <div className="audit-note"><AppIcon name="check" />All parameters logged with audit trail for VVB review.</div>
      </aside>
    </div>
  );
}

function ComplianceView({ project }: { project: Project }) {
  const statusTone = (status: string): Tone => status === "pass" ? "brand" : status === "warn" ? "warn" : status === "progress" ? "info" : "danger";
  return (
    <div className="split-view vc-in">
      <div className="main-column">
        <div className="panel">
          <PanelHead icon="shield" title="Compliance modules" sub="Evidence assembly across VM0048 requirements" right={<Badge tone="info">{project.dossier}% dossier ready</Badge>} />
          <div className="module-grid">{complianceModules.map((module) => <div key={module.key}>
            <div><AppIcon name={module.status === "pass" ? "check" : module.status === "warn" ? "alert" : "folder"} className={statusTone(module.status)} /><Dot state={module.status} /></div>
            <b>{module.label}</b>
            <p>{module.note}</p>
          </div>)}</div>
        </div>
        <div className="panel queue-panel">
          <PanelHead icon="bell" title="Human sign-off queue" sub="AI-flagged gaps awaiting reviewer clearance" right={<Badge tone="warn">{signoffQueue.length} open</Badge>} />
          <div className="queue-list">{signoffQueue.map((item) => <div key={item.id}>
            <span className={`sev ${item.sev}`} />
            <div><small className="mono">{item.id}</small><Badge tone={item.sev === "high" ? "warn" : "info"}>{item.type}</Badge><small className="mono">{item.clause}</small><b>{item.text}</b><p>{item.project} - flagged by {item.who} - {item.age} ago</p></div>
            <button className="btn ghost">Review</button><button className="btn">Sign off</button>
          </div>)}</div>
        </div>
      </div>
      <aside className="right-rail">
        <div className="panel metric-card">
          <span className="lbl">Risk dashboard</span>
          <div className="risk-grid">
            <Gauge pct={84} value="Low" label="Permanence" tone="brand" size={86} />
            <Gauge pct={38} value="Med" label="Reversal" tone="warn" size={86} />
            <Gauge pct={90} value="Low" label="Leakage" tone="brand" size={86} />
            <Gauge pct={52} value="Watch" label="Fire" tone="warn" size={86} />
          </div>
        </div>
        <div className="panel">
          <PanelHead icon="spark" title="AI PDD Generator" sub="LLM auto-population" />
          <div className="padded">
            <div className="row-between"><span>Sections populated</span><b className="mono ai">12 / 18</b></div>
            <Bar pct={66} tone="ai" />
            <p className="muted-copy">Platform-computed baseline, additionality and leakage are piped to the AI PDD Generator.</p>
            <button className="btn wide"><AppIcon name="external" />Open PDD draft</button>
          </div>
        </div>
        <div className="panel">
          <PanelHead icon="folder" title="Verification dossier" sub="VVB-ready submission package" />
          <div className="padded">{[["Monitoring report", 100], ["Satellite analysis", 100], ["Field survey records", 92], ["FPIC documentation", 100], ["Additionality evidence", 74], ["Methodology compliance", 62]].map(([label, pct]) => <div className="progress-row" key={label as string}><div className="row-between"><span>{label}</span><b className="mono">{pct}%</b></div><Bar pct={pct as number} tone={(pct as number) === 100 ? "brand" : "info"} height={5} /></div>)}<button className="btn wide"><AppIcon name="download" />Export dossier</button></div>
        </div>
      </aside>
    </div>
  );
}

function PipelineView() {
  return (
    <div className="view-stack vc-in">
      <div className="panel">
        <PanelHead icon="merge" title="End-to-end data flow" sub={`Last run ${pipeline.lastRun} - next ${pipeline.nextRun}`} right={<button className="btn ghost"><AppIcon name="settings" />Configure</button>} />
        <div className="flow-row">{pipeline.stages.map((stage, index) => <div className="flow-wrap" key={stage.key}>
          <div className="flow-card">
            <div><AppIcon name={stage.icon as IconKey} className={stage.status === "running" ? "teal" : stage.status === "queued" ? "gold" : stage.status === "idle" ? "muted-icon" : "brand"} /><Dot state={stage.status} pulse={stage.status === "running"} /></div>
            <b>{stage.label}</b><p>{stage.detail}</p><small className="mono">{stage.metric}</small>
          </div>
          {index < pipeline.stages.length - 1 && <AppIcon name="chevR" className="flow-arrow" />}
        </div>)}</div>
      </div>
      <div className="pipeline-grid">
        <div className="panel table-panel">
          <PanelHead icon="sprout" title="Dataset register" sub={`${pipeline.sources.length} sources - GEE + non-GEE APIs`} right={<><Badge tone="brand">{pipeline.sources.filter((source) => source.status === "live").length} live</Badge><Badge tone="ai">{pipeline.sources.filter((source) => source.nonGee).length} non-GEE</Badge></>} />
          <div className="table-scroll">
            <table>
              <thead><tr>{["", "Dataset", "Provider", "Res.", "Cadence", "Cost", "Latency"].map((head) => <th key={head}>{head}</th>)}</tr></thead>
              <tbody>{pipeline.sources.map((source) => <tr key={source.name}><td><Dot state={source.status} pulse={source.status === "live"} /></td><td><b>{source.name}</b>{source.nonGee && <Badge tone="ai">API</Badge>}</td><td className="muted">{source.provider}</td><td className="mono">{source.res}</td><td className="mono">{source.cadence}</td><td><Badge tone={source.cost === "Free" || source.cost === "Free API" ? "brand" : source.cost === "Fallback" ? "neutral" : "gold"}>{source.cost}</Badge></td><td className="mono align-r">{source.latency}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <aside className="right-rail">
          <div className="panel">
            <PanelHead icon="merge" title="AGBD inference router" sub="Single env-var switch" />
            <div className="router-list">{[["Active", pipeline.router.active, true], ["Fallback", pipeline.router.fallback, false], ["Internal ML", pipeline.router.internal, false]].map(([label, value, active]) => <div key={label as string} className={active ? "active" : ""}><Dot state={active ? "ok" : "idle"} pulse={Boolean(active)} /><div><span className="lbl">{label}</span><b className="mono">{value}</b></div>{active && <Badge tone="brand" solid>routing</Badge>}</div>)}</div>
          </div>
          <div className="panel">
            <PanelHead icon="cpu" title="GEE & compute" sub="Phase 1 - manual trigger" />
            <div className="padded"><HBars items={[{ label: "Tiles processed", value: 1240000, color: "var(--brand)" }, { label: "EECU-hours", value: 86, color: "var(--teal)" }, { label: "GCS storage GB", value: 412, color: "var(--gold)" }, { label: "Cloud Run reqs", value: 318, color: "var(--info)" }]} /><hr /><div className="row-between"><span>Est. monthly infra</span><b className="kpi-num">$320<small>/mo</small></b></div><small className="muted">GEE free tier - Google for Startups credits applied</small></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FieldView({ project }: { project: Project }) {
  const synced = fieldSubs.filter((sub) => sub.sync === "synced").length;
  return (
    <div className="field-grid vc-in">
      <div className="panel phone-panel"><PanelHead icon="smartphone" title="Field app" sub="Offline-first - KoboCollect" /><div className="phone-wrap"><PhoneMock project={project} /></div></div>
      <div className="main-column">
        <div className="kpi-grid four">
          <Stat label="Submissions today" value="18" />
          <Stat label="Sync queue" value={fieldSubs.length - synced} unit="pending" tone="warn" />
          <Stat label="Active enumerators" value="6" sub="3 sites" />
          <Stat label="Trees measured" value="2,140" unit="DBH+H" tone="teal" />
        </div>
        <div className="panel table-panel">
          <PanelHead icon="upload" title="Recent field submissions" sub="Synced from offline devices" right={<Badge tone={fieldSubs.length - synced ? "warn" : "brand"}>{synced}/{fieldSubs.length} synced</Badge>} />
          <div className="table-scroll">
            <table><thead><tr>{["", "ID", "Plot", "Form", "Enumerator", "GPS", "When", "Sync"].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{fieldSubs.map((sub) => <tr key={sub.id}><td><AppIcon name={sub.type.includes("DBH") ? "sprout" : sub.type.includes("SOC") ? "layers" : "activity"} /></td><td className="mono">{sub.id}</td><td className="mono"><b>{sub.plot}</b></td><td>{sub.type}{sub.trees ? <small className="mono"> - {sub.trees}</small> : null}</td><td>{sub.enum}</td><td className="mono muted">{sub.gps}</td><td className="muted">{sub.when}</td><td><Badge tone={sub.sync === "synced" ? "brand" : "warn"}>{sub.sync}</Badge></td></tr>)}</tbody></table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMock({ project }: { project: Project }) {
  return (
    <div className="phone-mock">
      <div className="phone-status mono"><span>08:42</span><span>offline - 12 queued</span></div>
      <div className="phone-head"><AppIcon name="sprout" /><div><b>Verst Field</b><small className="mono">{project.code} - Plot TSE-P14</small></div></div>
      <div className="phone-body">
        <b>DBH & HEIGHT SURVEY</b>
        {[["Tree #", "42 of 50"], ["Species", "Acacia tortilis"], ["DBH (cm)", "24.6"], ["Height (m)", "8.2"]].map(([label, value]) => <label key={label}><span>{label}</span><strong>{value}</strong></label>)}
        <div className="gps-chip"><AppIcon name="crosshair" /><span className="mono">-2.741, 38.793</span><Badge tone="teal">GNSS</Badge></div>
        <button className="btn wide">Save & next tree</button>
      </div>
    </div>
  );
}

function BiodiversityView({ project }: { project: Project }) {
  const bp = biodiversity.byProject[project.id as keyof typeof biodiversity.byProject] || biodiversity.byProject["tsavo-east"];
  const er = biodiversity.earthRanger;
  const eventTone = (sev: string): Tone => sev === "high" ? "danger" : sev === "med" ? "warn" : sev === "info" ? "teal" : "neutral";
  const iucnTone = (value: string): Tone => value === "CR" ? "danger" : value === "EN" ? "warn" : value === "VU" ? "gold" : "brand";
  return (
    <div className="split-view vc-in">
      <div className="main-column">
        <div className="kpi-grid four">
          <Stat label="Biodiversity intactness" value={bp.intactness} unit="BII" delta={bp.intactDelta} tone="teal" sub="Earth Map - PREDICTS" />
          <Stat label="Species recorded" value={bp.species} unit="taxa" sub={`${bp.iucnFlagged} IUCN threatened`} />
          <Stat label="EarthRanger obs." value={short(bp.observations)} unit="30d" sub={`${er.activeCollars} active collars`} />
          <Stat label="Patrol coverage" value={bp.patrolCoverage} unit="%" tone="gold" sub={`${er.patrolsActive} patrols active`} />
        </div>
        <div className="panel hero-panel">
          <PanelHead icon="globe" title="Wildlife & ranger activity" sub={`EarthRanger - ${er.site}`} right={<><Badge tone="ai">collar tracks</Badge><Badge tone="teal">sightings</Badge><Badge tone="warn">snares</Badge><Badge tone="danger">HWC</Badge></>} />
          <MapHero project={project} mapStyle="forest" overlays={{ wildlife: true, changes: false, plots: false, leakage: false }} />
        </div>
        <div className="panel">
          <PanelHead icon="activity" title="EarthRanger event feed" sub="Singular ranger & sensor records" right={<Badge>{biodiversity.events.length} recent - {bp.events30d}/30d</Badge>} />
          <div className="table-scroll small"><table><tbody>{biodiversity.events.map((event) => <tr key={event.id}><td><Badge tone={eventTone(event.sev)}>{event.cat}</Badge></td><td className="mono muted">{event.id}</td><td><b>{event.type}</b></td><td>{event.detail}</td><td className="muted">{event.who}</td><td className="mono muted">{event.gps}</td><td className="align-r muted">{event.when}</td></tr>)}</tbody></table></div>
        </div>
      </div>
      <aside className="right-rail">
        <div className="panel">
          <PanelHead icon="sprout" title="Indicator species" sub="EarthRanger subjects + aerial census" />
          <div className="species-list">{biodiversity.species.map((item) => <div key={item.name}><span><AppIcon name="sprout" /></span><div><b>{item.name}</b><small><em>{item.sci}</em>{item.collared ? ` - ${item.collared} collared` : ""}</small></div><Badge tone={iucnTone(item.iucn)}>{item.iucn}</Badge><strong className="mono">{fmt(item.count)}<small className={item.trend < 0 ? "danger" : "brand"}>{item.trend > 0 ? "+" : ""}{item.trend}%</small></strong></div>)}</div>
        </div>
        <div className="panel">
          <PanelHead icon="layers" title="Habitat & degradation" sub="Earth Map - FAO/JRC value-added" />
          <div className="padded">{biodiversity.landLayers.map((layer) => <div className="progress-row" key={layer.key}><div className="row-between"><span>{layer.label}</span><b className={`mono ${layer.tone}`}>{layer.val}</b></div><Bar pct={layer.pct} tone={layer.tone as Tone} height={5} /><small className="mono muted">{layer.src}</small></div>)}</div>
        </div>
        <div className="panel">
          <PanelHead icon="check" title="Co-benefit claims" sub="Beyond carbon - CCB / SD VISta" />
          <div className="padded"><p className="muted-copy">Biodiversity evidence strengthens CCB / SD VISta labels and supports premium-priced credits.</p><div className="sdg-list">{bp.sdgs.map((sdg) => <Badge key={sdg} tone="brand">SDG {sdg}</Badge>)}</div></div>
        </div>
      </aside>
    </div>
  );
}

function Walkthrough({ index, onPrev, onNext, onClose }: { index: number; onPrev: () => void; onNext: () => void; onClose: () => void }) {
  const data = tour[index];
  const last = index === tour.length - 1;
  return (
    <>
      <div className="tour-wash" />
      <div className="panel tour-card">
        <div className="tour-head"><span><AppIcon name="activity" /></span><div><small className="lbl">Annual monitoring cycle</small><b>{data.step}</b></div><small className="mono">{index + 1} / {tour.length}</small><button className="icon-btn" onClick={onClose} aria-label="Close"><AppIcon name="plus" /></button></div>
        <div className="tour-body"><b>{data.title}</b><p>{data.body}</p></div>
        <div className="tour-actions"><div>{tour.map((_, step) => <span key={step} className={step <= index ? "active" : ""} />)}</div><button className="btn ghost" disabled={index === 0} onClick={onPrev}>Back</button><button className="btn" onClick={last ? onClose : onNext}>{last ? "Finish" : "Next"} {!last && <AppIcon name="chevR" />}</button></div>
      </div>
    </>
  );
}

export default function DmrvDashboard() {
  const [activeView, setActiveView] = useState<ViewKey>("portfolio");
  const [projectId, setProjectId] = useState("tsavo-east");
  const [projectMenu, setProjectMenu] = useState(false);
  const [dark, setDark] = useState(true);
  const [tourIndex, setTourIndex] = useState(-1);
  const project = projects.find((item) => item.id === projectId) || projects[0];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const openProject = (id: string) => {
    setProjectId(id);
    setActiveView("project");
  };

  const activateTour = (index: number) => {
    const bounded = Math.max(0, Math.min(tour.length - 1, index));
    const next = tour[bounded];
    setTourIndex(bounded);
    setActiveView(next.view);
    if (next.project) setProjectId(next.project);
  };

  const currentTitle = titles[activeView];
  const View = {
    portfolio: <PortfolioView openProject={openProject} activeProject={project} />,
    project: <ProjectView project={project} />,
    measurement: <MeasurementView project={project} />,
    accounting: <AccountingView project={project} />,
    compliance: <ComplianceView project={project} />,
    biodiversity: <BiodiversityView project={project} />,
    pipeline: <PipelineView />,
    field: <FieldView project={project} />,
  }[activeView];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <Image src={dark ? "/assets/verst-logo-dark.png" : "/assets/verst-logo-light.png"} alt="Verst Carbon" width={115} height={48} priority />
          <span>AFOLU dMRV PLATFORM</span>
        </div>
        <nav className="nav">
          {nav.map((section) => (
            <div key={section.group}>
              <div className="lbl">{section.group}</div>
              {section.items.map((item) => (
                <button key={item.key} type="button" className={activeView === item.key ? "active" : ""} onClick={() => setActiveView(item.key)}>
                  <AppIcon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="user-card">
          <div><span>KK</span><div><b>Kevin Kiptoo</b><small>Carbon Project Lead</small></div><AppIcon name="settings" /></div>
          <p><Dot state="ok" pulse />Phase 1 - MVP - all systems live</p>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div className="page-title"><b>{currentTitle[0]}</b><small>{currentTitle[1]}</small></div>
          {activeView !== "portfolio" && activeView !== "pipeline" && (
            <div className="project-switcher">
              <button className="btn ghost" onClick={() => setProjectMenu((open) => !open)}>{project.countryCode} {project.name}<span className="mono">{project.code}</span><AppIcon name="chevD" /></button>
              {projectMenu && <><button className="scrim" aria-label="Close project menu" onClick={() => setProjectMenu(false)} /><div className="project-menu panel">{projects.map((item) => <button key={item.id} onClick={() => { setProjectId(item.id); setProjectMenu(false); }}><span>{item.countryCode}</span><div><b>{item.name}</b><small className="mono">{item.code} - {item.stage}</small></div>{item.id === projectId && <AppIcon name="check" />}</button>)}</div></>}
            </div>
          )}
          <div className="top-actions">
            <button className="btn ghost" onClick={() => activateTour(0)}><AppIcon name="activity" />Monitoring cycle</button>
            <label className="search-box"><AppIcon name="search" /><input placeholder="Search projects, plots, datasets" /></label>
            <button className="icon-btn" onClick={() => setDark((value) => !value)} aria-label="Toggle theme"><AppIcon name={dark ? "spark" : "globe"} /></button>
            <button className="icon-btn alert-dot" aria-label="Alerts"><AppIcon name="bell" /></button>
          </div>
        </header>
        <main>{View}</main>
      </section>
      {tourIndex >= 0 && <Walkthrough index={tourIndex} onPrev={() => activateTour(tourIndex - 1)} onNext={() => activateTour(tourIndex + 1)} onClose={() => setTourIndex(-1)} />}
    </div>
  );
}
