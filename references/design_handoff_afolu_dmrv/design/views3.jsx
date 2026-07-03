/* views3.jsx — Biodiversity & Co-benefits (EarthRanger + Earth Map / FAO) */
const D3 = window.DMRV;
const fmt3 = D3.fmt;
const MM3 = window.M;

function evtTone(sev) { return { high: 'danger', med: 'warn', info: 'teal', low: 'neutral' }[sev] || 'neutral'; }
function evtIcon(cat) {
  return { sighting: 'pulse', snare: 'alert', hwc: 'people', camera: 'crosshair', mortality: 'flag', security: 'shield', collar: 'globe' }[cat] || 'pulse';
}
const IUCN = { CR: 'danger', EN: 'warn', VU: 'gold', NT: 'info', LC: 'brand' };

function BiodiversityView({ project, t }) {
  const p = project;
  const bio = D3.biodiversity;
  const bp = bio.byProject[p.id] || bio.byProject['tsavo-east'];
  const er = bio.earthRanger;

  return <div className="vc-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 'var(--gap)', height: '100%', minHeight: 0 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', minHeight: 0 }}>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <Stat label="Biodiversity intactness" value={bp.intactness} unit="BII" delta={bp.intactDelta} tone="teal" sub="Earth Map · PREDICTS" />
        <Stat label="Species recorded" value={bp.species} unit="taxa" tone="brand" sub={`${bp.iucnFlagged} IUCN threatened`} />
        <Stat label="EarthRanger obs." value={MM3(bp.observations)} unit="30d" sub={`${er.activeCollars} active collars`} />
        <Stat label="Patrol coverage" value={bp.patrolCoverage} unit="%" tone="gold" sub={`${er.patrolsActive} patrols active`} />
      </div>

      {/* map with wildlife overlay */}
      <div className="panel" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <PanelHead icon="globe" title="Wildlife & ranger activity" sub={`EarthRanger · ${er.site}`}
          right={<><Badge tone="ai">collar tracks</Badge><Badge tone="teal">sightings</Badge><Badge tone="warn">snares</Badge><Badge tone="danger">HWC</Badge></>} />
        <div style={{ flex: 1, minHeight: 0 }}><MapHero project={p} mapStyle="forest" theme={t.dark ? 'dark' : 'light'} overlays={{ wildlife: true, changes: false, plots: false, leakage: false }} /></div>
      </div>

      {/* EarthRanger event feed */}
      <div className="panel" style={{ flexShrink: 0 }}>
        <PanelHead icon="pulse" title="EarthRanger event feed" sub="Singular ranger & sensor records" right={<Badge tone="neutral">{bio.events.length} recent · {bp.events30d}/30d</Badge>} />
        <div style={{ maxHeight: 192, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <tbody>
              {bio.events.map(e => <tr key={e.id} className="vc-row">
                <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', width: 16 }}><Icon name={evtIcon(e.cat)} size={14} c={`var(--${evtTone(e.sev)})`} /></td>
                <td className="mono" style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-3)', fontSize: 11 }}>{e.id}</td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-1)', fontWeight: 500, whiteSpace: 'nowrap' }}>{e.type}</td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-2)' }}>{e.detail}</td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{e.who}</td>
                <td className="mono" style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-3)', fontSize: 11, whiteSpace: 'nowrap' }}>{e.gps}</td>
                <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line)', color: 'var(--text-3)', textAlign: 'right', whiteSpace: 'nowrap' }}>{e.when}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* right rail */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)', minHeight: 0, overflow: 'auto' }}>
      {/* flagship species */}
      <div className="panel">
        <PanelHead icon="tree" title="Indicator species" sub="EarthRanger subjects + aerial census" />
        <div>
          {bio.species.map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderBottom: i < bio.species.length - 1 ? '1px solid var(--line)' : 'none' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon name={s.icon} size={15} c="var(--brand)" /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                <Badge tone={IUCN[s.iucn]}>{s.iucn}</Badge>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontStyle: 'italic' }}>{s.sci}{s.collared ? ` · ${s.collared} collared` : ''}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{fmt3(s.count)}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: s.trend > 0 ? 'var(--brand)' : s.trend < 0 ? 'var(--danger)' : 'var(--text-3)' }}>{s.trend > 0 ? '▲' : s.trend < 0 ? '▼' : '—'} {Math.abs(s.trend)}%</div>
            </div>
          </div>)}
        </div>
      </div>

      {/* Earth Map / FAO habitat layers */}
      <div className="panel">
        <PanelHead icon="layers" title="Habitat & degradation" sub="Earth Map · FAO/JRC value-added" />
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 13 }}>
          {bio.landLayers.map((l, i) => <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontSize: 12.5, color: 'var(--text-1)', fontWeight: 500 }}>{l.label}</span>
              <span className="mono" style={{ fontSize: 12, color: `var(--${l.tone})`, fontWeight: 600 }}>{l.val}</span>
            </div>
            <Bar pct={l.pct} tone={l.tone} h={5} />
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }} className="mono">{l.src}</div>
          </div>)}
        </div>
      </div>

      {/* SDG co-benefits */}
      <div className="panel">
        <PanelHead icon="check" title="Co-benefit claims" sub="Beyond carbon · CCB / SD VISta" />
        <div style={{ padding: 14 }}>
          <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 12 }}>
            Biodiversity evidence strengthens <b style={{ color: 'var(--text-1)' }}>CCB</b> / <b style={{ color: 'var(--text-1)' }}>SD VISta</b> labels and supports premium-priced credits.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {bp.sdgs.map(n => <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, padding: '5px 10px', borderRadius: 7, background: 'var(--bg-2)', border: '1px solid var(--line)', color: 'var(--text-2)' }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--brand-deep)', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontSize: 10 }} className="mono">{n}</span>
              SDG {n}
            </span>)}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

window.BiodiversityView = BiodiversityView;
