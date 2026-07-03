/* ui.jsx — shared primitives, icons, charts for the dMRV platform */
const { useState, useRef, useEffect, useMemo } = React;

/* ---------------- Icons (minimal line set) ---------------- */
const PATHS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
  layers: 'M12 3 3 8l9 5 9-5zM3 14l9 5 9-5M3 11l9 5 9-5',
  cpu: 'M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M6 6h12v12H6zM9 9h6v6H9z',
  calc: 'M5 3h14v18H5zM8 7h8M8 11h3M13 11h3M8 15h3M13 15h3',
  shield: 'M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6z',
  sat: 'M5 13 9 9M11 7l4-4M7 11l-4 4 5 5 4-4M13 9l2 2M3 21l3-3M18 6a3 3 0 0 0-3-3',
  doc: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h6M10 16h6',
  folder: 'M3 6h6l2 2h10v11H3z',
  spark: 'M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3',
  ring: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 14c2 0 4 2 4 5',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  check: 'M4 12l5 5L20 6',
  merge: 'M6 3v6a6 6 0 0 0 6 6h6M18 3v6a6 6 0 0 1-6 6M18 21l3-3-3-3',
  pulse: 'M3 12h4l2 6 4-14 2 8h6',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 21h4',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
  chevR: 'M9 6l6 6-6 6',
  chevD: 'M6 9l6 6 6-6',
  ext: 'M14 5h5v5M19 5l-8 8M11 5H5v14h14v-6',
  dl: 'M12 3v12M7 11l5 5 5-5M5 21h14',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  alert: 'M12 3 2 20h20zM12 9v5M12 17h.01',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  filter: 'M3 5h18l-7 8v6l-4-2v-4z',
  plus: 'M12 5v14M5 12h14',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.3 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.5L4.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.5-2-1.5a7 7 0 0 0 .1-1z',
  tree: 'M12 22v-6M8 16a4 4 0 0 1-1-8 5 5 0 0 1 10 0 4 4 0 0 1-1 8z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  flame: 'M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3 1 2 2 2 2 2 1-3 2-5 2-8z',
  crosshair: 'M12 3v4M12 17v4M3 12h4M17 12h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  phone: 'M7 2h10v20H7zM10 5h4M11 19h2',
  upload: 'M12 21V9M7 13l5-5 5 5M5 3h14',
  link: 'M9 15l6-6M8 12l-2 2a3 3 0 0 0 4 4l2-2M16 12l2-2a3 3 0 0 0-4-4l-2 2',
  db: 'M12 3c5 0 8 1.5 8 3s-3 3-8 3-8-1.5-8-3 3-3 8-3zM4 6v12c0 1.5 3 3 8 3s8-1.5 8-3V6M4 12c0 1.5 3 3 8 3s8-1.5 8-3',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
};
function Icon({ name, size = 16, c = 'currentColor', sw = 1.6, style, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || 'none'} stroke={c}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d={PATHS[name] || ''} />
    </svg>
  );
}

/* ---------------- Badges / status ---------------- */
const STATUS = {
  ok: { c: 'var(--brand)', t: 'Healthy' }, live: { c: 'var(--brand)', t: 'Live' },
  running: { c: 'var(--teal)', t: 'Running' }, queued: { c: 'var(--gold)', t: 'Queued' },
  idle: { c: 'var(--text-3)', t: 'Idle' }, standby: { c: 'var(--text-3)', t: 'Standby' },
  pending: { c: 'var(--text-3)', t: 'Pending' }, warn: { c: 'var(--warn)', t: 'Attention' },
  progress: { c: 'var(--info)', t: 'In progress' }, pass: { c: 'var(--brand)', t: 'Pass' },
};
function Dot({ s, pulse }) {
  const c = (STATUS[s] || STATUS.idle).c;
  return <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-block' }}>
    <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: c }} />
    {pulse && <span style={{ position: 'absolute', inset: -3, borderRadius: 99, border: `1.5px solid ${c}`, opacity: .5, animation: 'vc-ping 1.6s ease-out infinite' }} />}
  </span>;
}
function Badge({ children, tone = 'neutral', solid }) {
  const map = {
    neutral: 'var(--text-2)', brand: 'var(--brand)', teal: 'var(--teal)',
    gold: 'var(--gold)', warn: 'var(--warn)', danger: 'var(--danger)',
    info: 'var(--info)', ai: 'var(--ai)',
  };
  const c = map[tone] || map.neutral;
  return <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600,
    padding: '2px 8px', borderRadius: 99, lineHeight: 1.5,
    color: solid ? '#08130d' : c,
    background: solid ? c : `color-mix(in srgb, ${c} 14%, transparent)`,
    border: `1px solid color-mix(in srgb, ${c} ${solid ? 0 : 28}%, transparent)`,
  }}>{children}</span>;
}
function StageChip({ stage }) {
  const tone = { Onboarding: 'neutral', Baseline: 'info', Implementation: 'teal', Monitoring: 'brand', Verification: 'gold' }[stage] || 'neutral';
  return <Badge tone={tone}>{stage}</Badge>;
}
function RiskBadge({ risk }) {
  const tone = { Low: 'brand', Medium: 'warn', High: 'danger', Pending: 'neutral' }[risk] || 'neutral';
  return <Badge tone={tone}>{risk} risk</Badge>;
}

/* ---------------- Section header ---------------- */
function PanelHead({ icon, title, right, sub }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: '1px solid var(--line)' }}>
    {icon && <span style={{ color: 'var(--brand)' }}><Icon name={icon} size={15} /></span>}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.01em' }}>{title}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</span>}
    </div>
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>
  </div>;
}

/* ---------------- KPI stat ---------------- */
function Stat({ label, value, unit, delta, tone = 'brand', spark, sub }) {
  return <div className="panel" style={{ padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
    <span className="lbl">{label}</span>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
      <span className="kpi-num" style={{ fontSize: 24, color: 'var(--text-1)' }}>{value}</span>
      {unit && <span className="mono" style={{ fontSize: 12, color: 'var(--text-3)' }}>{unit}</span>}
      {delta != null && <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11.5, fontWeight: 600, color: delta >= 0 ? 'var(--brand)' : 'var(--danger)' }}>
        <Icon name="arrowUp" size={12} style={{ transform: delta >= 0 ? 'none' : 'rotate(180deg)' }} />{Math.abs(delta)}%
      </span>}
    </div>
    {spark && <Spark data={spark} tone={tone} />}
    {sub && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</span>}
  </div>;
}

/* ---------------- Sparkline ---------------- */
function Spark({ data, tone = 'brand', h = 26 }) {
  const w = 100, max = Math.max(...data), min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / rng) * (h - 4) - 2]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const col = `var(--${tone})`;
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block' }}>
    <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={col} opacity=".10" />
    <path d={d} fill="none" stroke={col} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={col} />
  </svg>;
}

/* ---------------- Area chart: baseline vs project ---------------- */
function BaselineChart({ project, h = 190 }) {
  const yrs = project.series;
  const startYr = parseInt(project.creditPeriod) || 2023;
  const all = [...project.series, ...project.baselineSeries];
  const max = Math.max(...all) * 1.08, min = Math.min(...all, 0);
  const w = 520, padL = 6, padB = 22, padT = 8;
  const X = (i) => padL + (i / Math.max(1, yrs.length - 1)) * (w - padL - 8);
  const Y = (v) => padT + (1 - (v - min) / (max - min || 1)) * (h - padT - padB);
  const line = (arr) => arr.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
  const proj = line(yrs), base = line(project.baselineSeries);
  const single = yrs.length < 2;
  return <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
    {[0, .25, .5, .75, 1].map((g, i) => {
      const yy = padT + g * (h - padT - padB);
      return <line key={i} x1={padL} x2={w - 8} y1={yy} y2={yy} stroke="var(--line)" strokeWidth="1" />;
    })}
    {!single && <>
      <path d={`${proj} L${X(yrs.length - 1)} ${Y(min)} L${X(0)} ${Y(min)} Z`} fill="var(--brand)" opacity=".12" />
      <path d={base} fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
      <path d={proj} fill="none" stroke="var(--brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </>}
    {yrs.map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r="2.6" fill="var(--brand)" />)}
    {yrs.map((v, i) => <text key={'t' + i} x={X(i)} y={h - 6} fontSize="9" className="mono" fill="var(--text-3)" textAnchor="middle">{startYr + i}</text>)}
  </svg>;
}

/* ---------------- Donut: carbon pools ---------------- */
function Donut({ segs, size = 132, thick = 18, center }) {
  const total = segs.reduce((s, x) => s + x.v, 0) || 1;
  const r = (size - thick) / 2, c = 2 * Math.PI * r;
  let acc = 0;
  return <div style={{ position: 'relative', width: size, height: size }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={thick} />
      {segs.map((s, i) => {
        const len = (s.v / total) * c;
        const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.c}
          strokeWidth={thick} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc}
          strokeLinecap="butt" />;
        acc += len; return el;
      })}
    </svg>
    {center && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>{center}</div>}
  </div>;
}

/* ---------------- Ring gauge (uncertainty / risk / progress) ---------------- */
function Gauge({ pct, label, value, tone = 'teal', size = 92, sub }) {
  const thick = 9, r = (size - thick) / 2, c = 2 * Math.PI * r;
  const len = (Math.min(100, Math.max(0, pct)) / 100) * c;
  const col = `var(--${tone})`;
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={thick} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={thick}
          strokeDasharray={`${len} ${c}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s cubic-bezier(.2,.7,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="kpi-num" style={{ fontSize: 18 }}>{value}</span>
        {sub && <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{sub}</span>}
      </div>
    </div>
    {label && <span className="lbl" style={{ textAlign: 'center' }}>{label}</span>}
  </div>;
}

/* ---------------- Progress bar ---------------- */
function Bar({ pct, tone = 'brand', h = 6 }) {
  return <div style={{ height: h, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: pct + '%', background: `var(--${tone})`, borderRadius: 99, transition: 'width .6s cubic-bezier(.2,.7,.2,1)' }} />
  </div>;
}

/* ---------------- Mini horizontal bars ---------------- */
function HBars({ items, fmtv }) {
  const max = Math.max(...items.map(i => i.v)) || 1;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    {items.map((it, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 10, alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
      <div style={{ height: 7, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: (it.v / max * 100) + '%', background: it.c || 'var(--brand)', borderRadius: 99 }} />
      </div>
      <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{fmtv ? fmtv(it.v) : it.v}</span>
    </div>)}
  </div>;
}

/* keyframes for ping */
(function () {
  const s = document.createElement('style');
  s.textContent = '@keyframes vc-ping{0%{transform:scale(.8);opacity:.6}100%{transform:scale(1.8);opacity:0}}';
  document.head.appendChild(s);
})();

Object.assign(window, {
  Icon, Dot, Badge, StageChip, RiskBadge, PanelHead, Stat, Spark,
  BaselineChart, Donut, Gauge, Bar, HBars, STATUS,
});
