/* views1.jsx — Portfolio, Project dashboard, Measurement Engine */
const D = window.DMRV;
const fmt = D.fmt;
const M = (n) => (n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'k' : '' + n);

function poolSegs(p) {
  return [
    { label: 'Above-ground (AGB)', v: p.pools.agb, c: 'var(--brand)' },
    { label: 'Below-ground (BGB)', v: p.pools.bgb, c: 'var(--brand-2)' },
    { label: 'Soil organic (SOC)', v: p.pools.soc, c: 'var(--gold)' },
    { label: 'Dead wood & litter', v: p.pools.dead, c: 'var(--teal)' },
  ];
}

/* ===================== PORTFOLIO ===================== */
function PortfolioView({ project, openProject, t }) {
  const [focus, setFocus] = React.useState(project.id);
  const fp = D.projects.find(p => p.id === focus) || project;
  const pf = D.portfolio;
  const byType = {};
  D.projects.forEach(p => { byType[p.type] = (byType[p.type] || 0) + p.area; });
  const typeColors = { 'REDD+': 'var(--brand)', 'ARR': 'var(--brand-2)', 'Agroforestry': 'var(--gold)', 'Blue Carbon': 'var(--teal)' };
  const typeSegs = Object.entries(byType).map(([k, v]) => ({ label: k, v, c: typeColors[k] || 'var(--text-3)' }));

  return <div className="vc-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', height: '100%', minHeight: 0 }}>
    {/* KPI strip */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 'var(--gap)' }}>
      <Stat label="Active projects" value={pf.activeProjects} sub={`${pf.countries} countries · Kenya, Uganda`} />
      <Stat label="Area under MRV" value={M(pf.totalArea)} unit="ha" sub="Across 6 AOIs" />
      <Stat label="Carbon stock" value={M(pf.totalStock)} unit="tCO₂e" spark={[18,19,20.5,22,24.3]} sub="Verified + modelled" />
      <Stat label="Annual forecast" value={M(pf.annualForecast)} unit="tCO₂e/yr" delta={8} tone="brand" />
      <Stat label="Issued to date" value={M(pf.issuedToDate)} unit="credits" sub={`Buffer pool ${M(pf.bufferPool)}`} />
      <Stat label="Avg uncertainty" value={pf.avgUncertainty} unit="%" tone="teal" sub="95% credible interval" />
    </div>

    {/* main */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', flex: 1, minHeight: 0 }}>
      {/* projects table */}
      <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1.5 }}>
        <PanelHead icon="grid" title="Project portfolio" sub="Enrolled AFOLU projects across the pipeline"
          right={<><button className="vc-btn-ghost"><Icon name="filter" size={13} /> Filter</button><button className="vc-btn"><Icon name="plus" size={13} /> Enrol project</button></>} />
        <div style={{ overflow: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, background: 'var(--bg-1)', zIndex: 1 }}>
                {['Project', 'Stage', 'Area', 'Carbon stock', 'Forecast/yr', 'Uncert.', 'Risk', 'Trend'].map((h, i) =>
                  <th key={i} style={{ textAlign: i > 1 ? 'right' : 'left', padding: '9px 11px', borderBottom: '1px solid var(--line)', color: 'var(--text-3)', fontWeight: 600, fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {D.projects.map(p => <tr key={p.id} onClick={() => openProject(p.id)} onMouseEnter={() => setFocus(p.id)}
                className="vc-row" style={{ cursor: 'pointer', background: focus === p.id ? 'var(--hover)' : 'transparent' }}>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Dot s={p.stage === 'Verification' ? 'queued' : p.stage === 'Onboarding' || p.stage === 'Baseline' ? 'pending' : 'ok'} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', display: 'flex', gap: 6, alignItems: 'center' }}>{p.flag} {p.name}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{p.code} · {p.type} · {p.methodology}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)' }}><StageChip stage={p.stage} /></td>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)', textAlign: 'right', whiteSpace: 'nowrap' }} className="mono">{fmt(p.area)}<span style={{ color: 'var(--text-3)' }}> ha</span></td>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)', textAlign: 'right' }} className="mono">{M(p.carbonStock)}</td>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)', textAlign: 'right' }} className="mono" >{p.creditForecast ? M(p.creditForecast) : <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)', textAlign: 'right' }}>
                  <span style={{ color: p.uncertaintyPct > 25 ? 'var(--warn)' : 'var(--text-2)' }} className="mono">±{p.uncertaintyPct}%</span>
                </td>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)', textAlign: 'right' }}><RiskBadge risk={p.risk} /></td>
                <td style={{ padding: '9px 11px', borderBottom: '1px solid var(--line)', width: 64 }}><Spark data={p.series.length > 1 ? p.series : [p.series[0], p.series[0]]} /></td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* map + composition band */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(320px,1fr)', gap: 'var(--gap)', height: 286, flexShrink: 0 }}>
        <div className="panel" style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <PanelHead icon="map" title="Regional view" sub={fp.name} right={<button className="vc-btn-ghost" onClick={() => openProject(fp.id)}>Open <Icon name="chevR" size={12} /></button>} />
          <div style={{ flex: 1, minHeight: 0 }}><MapHero project={fp} mapStyle={t.mapStyle} theme={t.dark ? 'dark' : 'light'} compact /></div>
        </div>
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <PanelHead icon="ring" title="Composition" sub="Area by type" />
          <div style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'center', flex: 1 }}>
            <Donut segs={typeSegs} size={120} center={<><span className="kpi-num" style={{ fontSize: 17 }}>{M(pf.totalArea)}</span><span style={{ fontSize: 9, color: 'var(--text-3)' }}>ha</span></>} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {typeSegs.map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: s.c }} />
                <span style={{ color: 'var(--text-2)', flex: 1 }}>{s.label}</span>
                <span className="mono" style={{ color: 'var(--text-3)' }}>{M(s.v)} ha</span>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

/* ===================== PROJECT DASHBOARD ===================== */
function ProjectView({ project, t }) {
  const p = project;
  return <div className="vc-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 'var(--gap)', height: '100%', minHeight: 0 }}>
    {/* left: map + bottom strip */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', minHeight: 0 }}>
      <div className="panel" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <PanelHead icon="map" title="Project boundary & carbon stock" sub={`${fmt(p.area)} ha · ${p.methodology} · ${p.registry}`}
          right={<><Badge tone="teal">10 km leakage belt</Badge><Badge tone="neutral">14 control plots</Badge></>} />
        <div style={{ flex: 1, minHeight: 0 }}><MapHero project={p} mapStyle={t.mapStyle} theme={t.dark ? 'dark' : 'light'} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <Stat label="Carbon stock" value={M(p.carbonStock)} unit="tCO₂e" />
        <Stat label="Credit forecast" value={p.creditForecast ? M(p.creditForecast) : '—'} unit="tCO₂e/yr" tone="brand" />
        <Stat label="AGBD mean" value={p.agbd.mean} unit="Mg/ha" tone="gold" sub={`CI ${p.agbd.lo}–${p.agbd.hi}`} />
        <Stat label="Baseline rate" value={p.baselineRate ? p.baselineRate + '%' : 'n/a'} unit={p.baselineRate ? '/yr loss' : ''} tone="warn" />
      </div>
    </div>

    {/* right rail */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', minHeight: 0, overflow: 'auto' }}>
      <div className="panel" style={{ padding: 15 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, display: 'flex', gap: 7, alignItems: 'center' }}>{p.flag} {p.name}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.code} · {p.cycle}</div>
          </div>
          <StageChip stage={p.stage} />
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'space-around', padding: '6px 0' }}>
          <Gauge pct={100 - p.uncertaintyPct} value={'±' + p.uncertaintyPct + '%'} sub="95% CI" label="Uncertainty" tone="teal" />
          <Gauge pct={p.riskScore || 6} value={p.risk === 'Pending' ? '—' : p.riskScore} sub={p.risk} label="Risk score" tone={p.risk === 'Low' ? 'brand' : p.risk === 'Medium' ? 'warn' : 'danger'} />
          <Gauge pct={p.dossier} value={p.dossier + '%'} sub="dossier" label="VVB ready" tone="info" />
        </div>
      </div>

      <div className="panel">
        <PanelHead icon="calc" title="Carbon pools" sub="Across 4 IPCC pools" />
        <div style={{ display: 'flex', gap: 16, padding: 15, alignItems: 'center' }}>
          <Donut segs={poolSegs(p)} size={118} center={<><span className="kpi-num" style={{ fontSize: 16 }}>{M(p.carbonStock)}</span><span style={{ fontSize: 9, color: 'var(--text-3)' }}>tCO₂e</span></>} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {poolSegs(p).map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.c }} />
              <span style={{ color: 'var(--text-2)', flex: 1 }}>{s.label}</span>
              <span className="mono" style={{ color: 'var(--text-3)' }}>{M(s.v)}</span>
            </div>)}
          </div>
        </div>
      </div>

      <div className="panel">
        <PanelHead icon="pulse" title="Baseline vs. project" sub="Dynamic baseline · control plots" />
        <div style={{ padding: '12px 14px 6px' }}><BaselineChart project={p} h={150} /></div>
        <div style={{ display: 'flex', gap: 16, padding: '0 14px 14px', fontSize: 11 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)' }}><span style={{ width: 14, height: 2, background: 'var(--brand)' }} /> Project</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-2)' }}><span style={{ width: 14, height: 0, borderTop: '2px dashed var(--text-3)' }} /> Baseline</span>
        </div>
      </div>

      <div className="panel">
        <PanelHead icon="sat" title="Data sources" sub={`${p.sources.length} active feeds`} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: 14 }}>
          {p.sources.map((s, i) => <span key={i} style={{ fontSize: 11, padding: '4px 9px', borderRadius: 6, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--text-2)' }} className="mono">{s}</span>)}
        </div>
      </div>
    </div>
  </div>;
}

/* ===================== MEASUREMENT ENGINE ===================== */
function MeasurementView({ project, t }) {
  const p = project;
  const [layer, setLayer] = React.useState('biomass');
  const layers = [['biomass', 'AGBD'], ['change', 'Δ Change'], ['forest', 'Forest cover'], ['terrain', 'Terrain']];
  // synthetic AGBD histogram
  const hist = React.useMemo(() => {
    const arr = []; for (let i = 0; i < 22; i++) { const x = i / 21; arr.push(Math.exp(-Math.pow((x - .5) * 2.4, 2)) * (0.7 + 0.3 * Math.sin(i + p.code.length))); } return arr;
  }, [p.code]);
  const hmax = Math.max(...hist);
  // EO vs field calibration scatter
  const scatter = React.useMemo(() => {
    const pts = []; for (let i = 0; i < 28; i++) { const x = hash2(i, 3, p.area % 900); const y = x * 0.86 + (hash2(i, 9, 7) - 0.5) * 0.22; pts.push([x, Math.max(0, Math.min(1, y))]); } return pts;
  }, [p.area]);

  return <div className="vc-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 'var(--gap)', height: '100%', minHeight: 0 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', minHeight: 0 }}>
      <div className="panel" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <PanelHead icon="cpu" title="Measurement Engine · AGBD @ 10 m" sub="Site-specific Bayesian biomass model"
          right={<div style={{ display: 'flex', gap: 3, background: 'var(--bg-2)', padding: 3, borderRadius: 7, border: '1px solid var(--line)' }}>
            {layers.map(([k, lbl]) => <button key={k} onClick={() => setLayer(k)} style={{ border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 5, background: layer === k ? 'var(--brand)' : 'transparent', color: layer === k ? '#08130d' : 'var(--text-2)' }}>{lbl}</button>)}
          </div>} />
        <div style={{ flex: 1, minHeight: 0 }}><MapHero project={p} mapStyle={layer} theme={t.dark ? 'dark' : 'light'} overlays={{ changes: layer === 'change' || layer === 'biomass' }} /></div>
      </div>
      <div className="panel">
        <PanelHead icon="alert" title="Change detection" sub="Events > 2σ from expected growth trajectory" right={<Badge tone="warn">{D.changeEvents.filter(c => c.kind === 'Loss').length} loss flagged</Badge>} />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <tbody>
            {D.changeEvents.map(c => <tr key={c.id} className="vc-row">
              <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)' }}><Badge tone={c.kind === 'Loss' ? 'danger' : 'brand'}>{c.kind}</Badge></td>
              <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-1)' }}>{c.area}</td>
              <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', textAlign: 'right' }} className="mono">{c.ha} ha</td>
              <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', textAlign: 'right' }} className="mono"><span style={{ color: c.sigma > 3 ? 'var(--danger)' : 'var(--warn)' }}>{c.sigma}σ</span></td>
              <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-3)' }} className="mono">{c.source}</td>
              <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-3)' }} className="mono">{c.date}</td>
              <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', textAlign: 'right' }}><button className="vc-btn-ghost">{c.action}</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>

    {/* right rail */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', minHeight: 0, overflow: 'auto' }}>
      <div className="panel" style={{ padding: 15 }}>
        <span className="lbl">AGBD distribution</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80, margin: '12px 0 6px' }}>
          {hist.map((h, i) => <div key={i} style={{ flex: 1, height: (h / hmax * 100) + '%', background: `rgb(${ramp(RAMPS.biomass, i / 21).map(v => v | 0).join(',')})`, borderRadius: 1 }} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mono"><span style={{ fontSize: 9, color: 'var(--text-3)' }}>0</span><span style={{ fontSize: 9, color: 'var(--text-3)' }}>{Math.round(p.agbd.hi)} Mg/ha</span></div>
        <hr className="hair" style={{ margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}><div className="kpi-num" style={{ fontSize: 19, color: 'var(--gold)' }}>{p.agbd.mean}</div><span className="lbl">mean</span></div>
          <div style={{ textAlign: 'center' }}><div className="kpi-num" style={{ fontSize: 19, color: 'var(--text-2)' }}>{p.agbd.lo}</div><span className="lbl">lower CI</span></div>
          <div style={{ textAlign: 'center' }}><div className="kpi-num" style={{ fontSize: 19, color: 'var(--text-2)' }}>{p.agbd.hi}</div><span className="lbl">upper CI</span></div>
        </div>
      </div>

      <div className="panel" style={{ padding: 15 }}>
        <span className="lbl">Hybrid MRV calibration</span>
        <div style={{ fontSize: 11, color: 'var(--text-3)', margin: '3px 0 10px' }}>EO-derived vs. field plot tCO₂e · R² = 0.86</div>
        <svg viewBox="0 0 200 130" width="100%" height="130" style={{ display: 'block' }}>
          <line x1="20" y1="110" x2="190" y2="110" stroke="var(--line)" /><line x1="20" y1="10" x2="20" y2="110" stroke="var(--line)" />
          <line x1="20" y1="110" x2="190" y2="14" stroke="var(--text-3)" strokeDasharray="3 3" strokeWidth="1" />
          {scatter.map((pt, i) => <circle key={i} cx={20 + pt[0] * 168} cy={110 - pt[1] * 96} r="2.6" fill="var(--teal)" opacity=".8" />)}
          <text x="105" y="126" fontSize="8" fill="var(--text-3)" textAnchor="middle" className="mono">Field plot AGB (tCO₂e)</text>
        </svg>
      </div>

      <div className="panel">
        <PanelHead icon="spark" title="Model card" sub="HabitatMapper™ · Bayesian UQ" />
        <div style={{ padding: '4px 0' }}>
          {[['Approach', 'Deep Bayesian (GP + VI)'], ['Reference', 'Field · LiDAR · GEDI L4A'], ['Predictors', 'S2 · S1 SAR · DEM'], ['UQ', '95% credible interval'], ['Validation', 'CRPS · PICP'], ['Resolution', '10 m · annual'], ['Accuracy', '> 90% forest cover']].map(([k, v], i) =>
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', borderBottom: i < 6 ? '1px solid var(--line)' : 'none', fontSize: 12 }}>
              <span style={{ color: 'var(--text-3)' }}>{k}</span><span className="mono" style={{ color: 'var(--text-2)' }}>{v}</span>
            </div>)}
        </div>
      </div>
    </div>
  </div>;
}

Object.assign(window, { PortfolioView, ProjectView, MeasurementView, poolSegs, M });
