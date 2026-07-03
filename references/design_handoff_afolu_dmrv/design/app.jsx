/* app.jsx — shell: sidebar, topbar, routing, tweaks, theme application */
const { useState: uS, useEffect: uE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "accent": "#1fa94f",
  "font": "IBM Plex Sans",
  "density": "comfortable",
  "mapStyle": "biomass"
}/*EDITMODE-END*/;

const NAV = [
  { group: 'Overview', items: [
    { key: 'portfolio', label: 'Portfolio', icon: 'grid' },
    { key: 'project', label: 'Project dashboard', icon: 'map' },
  ]},
  { group: 'Engines', items: [
    { key: 'measurement', label: 'Measurement', icon: 'cpu' },
    { key: 'accounting', label: 'Carbon accounting', icon: 'calc' },
    { key: 'compliance', label: 'Compliance', icon: 'shield' },
    { key: 'biodiversity', label: 'Biodiversity', icon: 'globe' },
  ]},
  { group: 'Operations', items: [
    { key: 'pipeline', label: 'Data pipeline', icon: 'merge' },
    { key: 'field', label: 'Field data', icon: 'phone' },
  ]},
];
const TITLES = {
  portfolio: ['Portfolio', 'All enrolled AFOLU projects'],
  project: ['Project dashboard', 'Boundary, carbon stock & status'],
  measurement: ['Measurement Engine', 'What is the carbon?'],
  accounting: ['Carbon Accounting Engine', 'What can be claimed?'],
  compliance: ['Compliance Engine', 'Will it pass VVB review?'],
  biodiversity: ['Biodiversity & Co-benefits', 'EarthRanger · Earth Map · beyond carbon'],
  pipeline: ['Data pipeline', 'GEE ingestion → engines'],
  field: ['Field data collection', 'Offline-first MRV inputs'],
};

/* Guided annual-monitoring-cycle walkthrough (Use Case 2) */
const TOUR = [
  { view: 'pipeline', proj: 'tsavo-east', step: 'Ingest', title: 'New imagery lands', body: 'The latest Sentinel-2 & Sentinel-1 acquisitions for the project boundary are pulled through Google Earth Engine, cloud-masked and time-series normalised.' },
  { view: 'measurement', step: 'Measure', title: 'AGBD is re-estimated', body: 'The site-specific Bayesian model produces an updated above-ground biomass map at 10 m, with a formal 95% credible interval per pixel.' },
  { view: 'measurement', step: 'Detect change', title: 'Disturbance is flagged', body: 'Year-on-year differencing detects change >2σ from the expected growth trajectory and routes flagged patches to a field-verification queue.' },
  { view: 'measurement', step: 'Calibrate', title: 'Hybrid MRV tightens uncertainty', body: 'Field-plot DBH & height measurements calibrate the EO estimate, producing the validated tCO₂e dataset — Verst’s core differentiator.' },
  { view: 'accounting', step: 'Account', title: 'Credits are computed', body: 'VM0048 logic refreshes the dynamic baseline, computes leakage and net additionality, and issues a credit forecast at the conservative lower CI.' },
  { view: 'compliance', step: 'Comply', title: 'Gaps & risk are scanned', body: 'AI checks methodology compliance, scores permanence & reversal risk, verifies FPIC, and populates the human sign-off queue.' },
  { view: 'compliance', step: 'Report', title: 'Dossier is assembled', body: 'The verification dossier is compiled and the AI PDD Generator drafts the monitoring report — a VVB-ready package in days, not weeks.' },
];

function WalkthroughCard({ i, data, onPrev, onNext, onClose }) {
  const last = i === TOUR.length - 1;
  return <>
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, pointerEvents: 'none', background: 'radial-gradient(120% 80% at 50% 120%, color-mix(in srgb,var(--brand) 12%,transparent), transparent 60%)' }} />
    <div className="panel vc-in" style={{ position: 'fixed', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 61, width: 560, maxWidth: 'calc(100vw - 40px)', padding: 0, boxShadow: '0 24px 60px -16px rgba(0,0,0,.7)', border: '1px solid var(--line-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
        <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--brand)', color: '#08130d', display: 'grid', placeItems: 'center' }}><Icon name="pulse" size={15} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.1em', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase' }}>Annual monitoring cycle</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{data.step}</div>
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{i + 1} / {TOUR.length}</span>
        <button className="iconbtn" style={{ width: 28, height: 28 }} onClick={onClose}><Icon name="plus" size={14} style={{ transform: 'rotate(45deg)' }} /></button>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{data.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{data.body}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', gap: 5, flex: 1 }}>
          {TOUR.map((_, k) => <span key={k} style={{ height: 4, flex: 1, borderRadius: 4, background: k <= i ? 'var(--brand)' : 'var(--line-2)', transition: 'background .3s' }} />)}
        </div>
        <button className="vc-btn-ghost" onClick={onPrev} disabled={i === 0} style={{ opacity: i === 0 ? .4 : 1 }}>Back</button>
        <button className="vc-btn" onClick={last ? onClose : onNext}>{last ? 'Finish' : 'Next'} {!last && <Icon name="chevR" size={13} />}</button>
      </div>
    </div>
  </>;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [nav, setNav] = uS('portfolio');
  const [pid, setPid] = uS(window.DMRV.activeProjectId);
  const [pmenu, setPmenu] = uS(false);
  const [tour, setTour] = uS(-1);
  const project = window.DMRV.projects.find(p => p.id === pid);

  // apply tweaks to CSS
  uE(() => {
    const r = document.documentElement;
    r.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    r.style.setProperty('--brand', t.accent);
    r.style.setProperty('--brand-2', `color-mix(in srgb, ${t.accent} 68%, #08301d)`);
    r.style.setProperty('--brand-deep', `color-mix(in srgb, ${t.accent} 22%, ${t.dark ? '#0a110d' : '#dfeee5'})`);
    r.style.setProperty('--font-ui', `'${t.font}', system-ui, sans-serif`);
    const compact = t.density === 'compact';
    r.style.setProperty('--pad', compact ? '11px' : '16px');
    r.style.setProperty('--gap', compact ? '10px' : '14px');
    r.style.setProperty('--fs', compact ? '13px' : '14px');
  }, [t.dark, t.accent, t.font, t.density]);

  uE(() => { if (tour >= 0) { const s = TOUR[tour]; setNav(s.view); if (s.proj) setPid(s.proj); } }, [tour]);

  const openProject = (id) => { setPid(id); setNav('project'); };
  const View = { portfolio: PortfolioView, project: ProjectView, measurement: MeasurementView, accounting: AccountingView, compliance: ComplianceView, biodiversity: BiodiversityView, pipeline: PipelineView, field: FieldView }[nav];
  const logo = t.dark ? (window.LOGO_DARK || 'assets/verst-logo-dark.png') : (window.LOGO_LIGHT || 'assets/verst-logo-light.png');

  return <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-0)' }}>
    {/* sidebar */}
    <aside style={{ width: 234, flexShrink: 0, background: 'var(--bg-1)', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid var(--line)' }}>
        <img src={logo} alt="Verst Carbon" style={{ height: 30, objectFit: 'contain', objectPosition: 'left' }} onError={(e) => { e.target.style.display = 'none'; }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <span style={{ fontSize: 10.5, letterSpacing: '.14em', color: 'var(--text-3)', fontWeight: 600 }}>AFOLU dMRV PLATFORM</span>
        </div>
      </div>
      <nav style={{ padding: '12px 14px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {NAV.map(sec => <div key={sec.group}>
          <div className="lbl" style={{ padding: '0 4px 7px' }}>{sec.group}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sec.items.map(it => <div key={it.key} className={'nav-item' + (nav === it.key ? ' active' : '')} onClick={() => setNav(it.key)}>
              <Icon name={it.icon} size={16} c={nav === it.key ? 'var(--brand)' : 'currentColor'} />
              <span>{it.label}</span>
            </div>)}
          </div>
        </div>)}
      </nav>
      <div style={{ padding: 14, borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
          <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--brand-deep)', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>KK</span>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600 }}>Kevin Kiptoo</div><div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Carbon Project Lead</div></div>
          <Icon name="gear" size={14} c="var(--text-3)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '0 2px' }}>
          <Dot s="ok" pulse /><span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Phase 1 · MVP · all systems live</span>
        </div>
      </div>
    </aside>

    {/* main */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {/* topbar */}
      <header style={{ height: 60, flexShrink: 0, borderBottom: '1px solid var(--line)', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 var(--pad)' }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{TITLES[nav][0]}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{TITLES[nav][1]}</div>
        </div>

        {/* project switcher */}
        {nav !== 'portfolio' && nav !== 'pipeline' && <div style={{ position: 'relative' }}>
          <button className="vc-btn-ghost" style={{ padding: '7px 11px' }} onClick={() => setPmenu(v => !v)}>
            <span style={{ fontSize: 13 }}>{project.flag}</span>
            <span style={{ fontWeight: 600 }}>{project.name}</span>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{project.code}</span>
            <Icon name="chevD" size={13} />
          </button>
          {pmenu && <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setPmenu(false)} />
            <div className="panel" style={{ position: 'absolute', top: '110%', left: 0, width: 280, zIndex: 41, padding: 6, maxHeight: 360, overflow: 'auto' }}>
              {window.DMRV.projects.map(p => <div key={p.id} className="nav-item" style={{ borderRadius: 7 }} onClick={() => { setPid(p.id); setPmenu(false); }}>
                <span>{p.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600 }}>{p.name}</div><div className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>{p.code} · {p.stage}</div></div>
                {p.id === pid && <Icon name="check" size={14} c="var(--brand)" />}
              </div>)}
            </div>
          </>}
        </div>}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="vc-btn-ghost" onClick={() => setTour(0)} style={{ padding: '7px 11px' }}><Icon name="pulse" size={14} c="var(--brand)" /> Monitoring cycle</button>
          <div style={{ position: 'relative', width: 220 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}><Icon name="search" size={14} /></span>
            <input className="topsearch" placeholder="Search projects, plots, datasets…" />
          </div>
          <button className="iconbtn" onClick={() => setTweak('dark', !t.dark)} title="Toggle theme">
            <Icon name={t.dark ? 'spark' : 'globe'} size={15} />
          </button>
          <button className="iconbtn" style={{ position: 'relative' }} title="Alerts">
            <Icon name="bell" size={15} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 99, background: 'var(--warn)', border: '1.5px solid var(--bg-2)' }} />
          </button>
        </div>
      </header>

      {/* content */}
      <main style={{ flex: 1, minHeight: 0, padding: 'var(--pad)', overflow: 'auto' }}>
        <View project={project} openProject={openProject} t={t} />
      </main>
    </div>

    {tour >= 0 && <WalkthroughCard i={tour} data={TOUR[tour]} onPrev={() => setTour(x => Math.max(0, x - 1))} onNext={() => setTour(x => Math.min(TOUR.length - 1, x + 1))} onClose={() => setTour(-1)} />}

    {/* Tweaks */}
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakToggle label="Dark mode" value={t.dark} onChange={v => setTweak('dark', v)} />
      <TweakColor label="Accent" value={t.accent} options={['#1fa94f', '#16a34a', '#2d7a4f', '#15b8a6', '#5a9732']} onChange={v => setTweak('accent', v)} />
      <TweakSection label="Typography" />
      <TweakSelect label="UI font" value={t.font} options={['IBM Plex Sans', 'Space Grotesk', 'Archivo']} onChange={v => setTweak('font', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density} options={['compact', 'comfortable']} onChange={v => setTweak('density', v)} />
      <TweakSection label="Map" />
      <TweakRadio label="Base style" value={t.mapStyle} options={['biomass', 'satellite', 'terrain']} onChange={v => setTweak('mapStyle', v)} />
    </TweaksPanel>
  </div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
