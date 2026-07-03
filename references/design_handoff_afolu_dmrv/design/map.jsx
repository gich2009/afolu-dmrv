/* map.jsx — geospatial hero canvas: procedural AGBD raster, boundary, leakage belt,
   change-detection markers, graticule, pan/zoom. Style-switchable. */

/* ---- value noise ---- */
function hash2(x, y, s) {
  let h = x * 374761393 + y * 668265263 + s * 2147483647;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 100000) / 100000;
}
function smooth(t) { return t * t * (3 - 2 * t); }
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  const u = smooth(xf), v = smooth(yf);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}
function fbm(x, y, s) {
  let v = 0, amp = .5, f = 1;
  for (let i = 0; i < 5; i++) { v += amp * vnoise(x * f, y * f, s + i * 7); f *= 2; amp *= .5; }
  return v;
}

/* ---- boundary polygon (deterministic per project) ---- */
function makePolygon(seed, n = 26) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 0.30 + 0.085 * fbm(Math.cos(a) * 1.5 + 4, Math.sin(a) * 1.5 + 4, seed) +
      0.04 * Math.sin(a * 3 + seed);
    pts.push([0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a) * 0.82]);
  }
  return pts;
}
function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function lerp(a, b, t) { return a + (b - a) * t; }
function mix(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]; }
function ramp(stops, t) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    if (t <= stops[i + 1][0]) {
      const lt = (t - stops[i][0]) / (stops[i + 1][0] - stops[i][0] || 1);
      return mix(stops[i][1], stops[i + 1][1], lt);
    }
  }
  return stops[stops.length - 1][1];
}
const RAMPS = {
  biomass: [[0, [36, 50, 22]], [.4, [94, 126, 30]], [.6, [155, 190, 46]], [.8, [79, 179, 90]], [1, [25, 211, 107]]],
  satellite: [[0, [40, 46, 34]], [.35, [54, 64, 40]], [.6, [60, 82, 48]], [.8, [47, 82, 48]], [1, [38, 64, 40]]],
  terrain: [[0, [28, 40, 33]], [.4, [52, 74, 58]], [.7, [110, 134, 110]], [1, [200, 210, 196]]],
  change: [[0, [206, 64, 64]], [.45, [120, 70, 40]], [.5, [60, 70, 60]], [.55, [50, 110, 60]], [1, [40, 200, 110]]],
  forest: [[0, [24, 32, 26]], [.49, [30, 40, 30]], [.5, [30, 120, 60]], [1, [22, 150, 74]]],
};

function MapHero({ project, mapStyle = 'biomass', theme = 'dark', compact, fill, overlays = {}, onPixel }) {
  const cvs = React.useRef(null);
  const wrap = React.useRef(null);
  const view = React.useRef({ scale: 1, ox: 0, oy: 0, drag: null });
  const [, force] = React.useState(0);
  const poly = React.useMemo(() => {
    let s = 0; for (const ch of project.id) s += ch.charCodeAt(0); return makePolygon(s % 997 + 11);
  }, [project.id]);
  const seed = React.useMemo(() => { let s = 0; for (const ch of project.id) s = (s * 31 + ch.charCodeAt(0)) % 9973; return s; }, [project.id]);

  const draw = React.useCallback(() => {
    const c = cvs.current; if (!c) return;
    const W = c.clientWidth, H = c.clientHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const void0 = '#07100b';
    ctx.fillStyle = void0; ctx.fillRect(0, 0, W, H);

    const { scale, ox, oy } = view.current;
    const size = Math.min(W, H);
    const px0 = (W - size) / 2 + ox, py0 = (H - size) / 2 + oy;
    const SX = (nx) => px0 + nx * size * scale - (scale - 1) * size / 2;
    const SY = (ny) => py0 + ny * size * scale - (scale - 1) * size / 2;
    const NX = (sx) => ((sx - px0 + (scale - 1) * size / 2) / (size * scale));
    const NY = (sy) => ((sy - py0 + (scale - 1) * size / 2) / (size * scale));

    // raster
    const stops = RAMPS[mapStyle] || RAMPS.biomass;
    const cell = compact ? 5 : 5;
    for (let sy = 0; sy < H; sy += cell) {
      for (let sx = 0; sx < W; sx += cell) {
        const nx = NX(sx + cell / 2), ny = NY(sy + cell / 2);
        if (nx < 0 || nx > 1 || ny < 0 || ny > 1) continue;
        if (!pointInPoly(nx, ny, poly)) continue;
        let v = fbm(nx * 6.5 + 1, ny * 6.5 + 1, seed);
        v = Math.pow(v, 1.15);
        // edge falloff -> sparser biomass near boundary
        const edge = Math.min(1, (0.5 - Math.max(Math.abs(nx - .5), Math.abs(ny - .5))) * 3 + .35);
        v *= 0.55 + 0.6 * edge;
        let t = v;
        if (mapStyle === 'change') { t = fbm(nx * 9 + 5, ny * 9, seed + 3); t = 0.5 + (t - 0.5) * 1.7; }
        if (mapStyle === 'forest') { t = v > .42 ? .8 + v * .2 : v * .9; }
        const col = ramp(stops, t);
        ctx.fillStyle = `rgb(${col[0] | 0},${col[1] | 0},${col[2] | 0})`;
        ctx.fillRect(sx, sy, cell, cell);
      }
    }

    // graticule
    ctx.strokeStyle = 'rgba(255,255,255,.05)';
    ctx.lineWidth = 1;
    for (let g = 0; g <= 8; g++) {
      const gx = (g / 8) * W; ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      const gy = (g / 8) * H; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1fa94f';
    // leakage belt (offset polygon ~ scaled out)
    if (overlays.leakage !== false) {
      ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = 'rgba(47,208,187,.55)'; ctx.lineWidth = 1.4;
      ctx.beginPath();
      poly.forEach((p, i) => {
        const ex = 0.5 + (p[0] - 0.5) * 1.16, ey = 0.5 + (p[1] - 0.5) * 1.16;
        const x = SX(ex), y = SY(ey); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.closePath(); ctx.stroke(); ctx.restore();
    }
    // project boundary
    ctx.beginPath();
    poly.forEach((p, i) => { const x = SX(p[0]), y = SY(p[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.closePath();
    ctx.lineWidth = 2; ctx.strokeStyle = brand; ctx.shadowColor = brand; ctx.shadowBlur = 10; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(31,169,79,.05)'; ctx.fill();

    // permanent control plots (small squares)
    if (overlays.plots !== false) {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      const plotSeed = seed + 50;
      for (let i = 0; i < 14; i++) {
        const a = hash2(i, 1, plotSeed) * Math.PI * 2, rr = .08 + hash2(i, 2, plotSeed) * .34;
        const nx = 0.5 + rr * Math.cos(a), ny = 0.5 + rr * Math.sin(a) * .82;
        if (!pointInPoly(nx, ny, poly)) continue;
        const x = SX(nx), y = SY(ny);
        ctx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
      }
    }
    // change-detection markers
    if (overlays.changes !== false && project.changes) {
      for (let i = 0; i < project.changes; i++) {
        const a = hash2(i, 9, seed) * Math.PI * 2, rr = .2 + hash2(i, 8, seed) * .25;
        const nx = 0.5 + rr * Math.cos(a), ny = 0.5 + rr * Math.sin(a) * .82;
        const x = SX(nx), y = SY(ny);
        const loss = i % 3 !== 2;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.strokeStyle = loss ? '#ef5b5b' : '#19d36b';
        ctx.lineWidth = 1.6; ctx.globalAlpha = .9; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fillStyle = loss ? '#ef5b5b' : '#19d36b'; ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    // wildlife / ranger overlay (EarthRanger): collar tracks + sighting points
    if (overlays.wildlife) {
      const wSeed = seed + 120;
      // ranger / collar movement tracks (poly-lines)
      ctx.lineWidth = 1.4;
      for (let tk = 0; tk < 3; tk++) {
        ctx.beginPath();
        ctx.strokeStyle = tk === 0 ? 'rgba(155,124,240,.8)' : 'rgba(47,208,187,.7)';
        let nx = 0.4 + hash2(tk, 1, wSeed) * 0.2, ny = 0.4 + hash2(tk, 2, wSeed) * 0.2;
        ctx.moveTo(SX(nx), SY(ny));
        for (let s = 1; s < 12; s++) {
          nx += (hash2(tk, s + 10, wSeed) - 0.5) * 0.12;
          ny += (hash2(tk, s + 40, wSeed) - 0.5) * 0.10;
          nx = Math.max(.12, Math.min(.88, nx)); ny = Math.max(.12, Math.min(.88, ny));
          ctx.lineTo(SX(nx), SY(ny));
        }
        ctx.globalAlpha = .85; ctx.stroke(); ctx.globalAlpha = 1;
      }
      // sighting / event points
      const cats = [['#9b7cf0', 'collar'], ['#2fd0bb', 'sighting'], ['#f0a92c', 'snare'], ['#ef5b5b', 'hwc']];
      for (let i = 0; i < 22; i++) {
        const a = hash2(i, 5, wSeed) * Math.PI * 2, rr = .1 + hash2(i, 6, wSeed) * .36;
        const nx = 0.5 + rr * Math.cos(a), ny = 0.5 + rr * Math.sin(a) * .82;
        if (!pointInPoly(nx, ny, poly)) continue;
        const x = SX(nx), y = SY(ny);
        const cat = cats[i % cats.length];
        ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fillStyle = cat[0];
        ctx.globalAlpha = .92; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 5.2, 0, 7); ctx.strokeStyle = cat[0]; ctx.lineWidth = 1; ctx.globalAlpha = .4; ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }, [poly, seed, mapStyle, theme, compact, overlays.leakage, overlays.plots, overlays.changes, overlays.wildlife, project.changes]);

  React.useEffect(() => {
    draw();
    const ro = new ResizeObserver(() => draw());
    if (cvs.current) ro.observe(cvs.current);
    return () => ro.disconnect();
  }, [draw]);

  // interactions
  React.useEffect(() => {
    const c = cvs.current; if (!c) return;
    const onWheel = (e) => {
      e.preventDefault();
      const v = view.current; const f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      v.scale = Math.max(1, Math.min(6, v.scale * f));
      if (v.scale === 1) { v.ox = 0; v.oy = 0; }
      draw();
    };
    const onDown = (e) => { view.current.drag = { x: e.clientX, y: e.clientY, ox: view.current.ox, oy: view.current.oy }; };
    const onMove = (e) => {
      const d = view.current.drag; if (!d) return;
      view.current.ox = d.ox + (e.clientX - d.x); view.current.oy = d.oy + (e.clientY - d.y); draw();
    };
    const onUp = () => { view.current.drag = null; };
    c.addEventListener('wheel', onWheel, { passive: false });
    c.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => { c.removeEventListener('wheel', onWheel); c.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
  }, [draw]);

  const zoom = (f) => { const v = view.current; v.scale = Math.max(1, Math.min(6, v.scale * f)); if (v.scale === 1) { v.ox = 0; v.oy = 0; } draw(); force(x => x + 1); };
  const reset = () => { view.current = { scale: 1, ox: 0, oy: 0, drag: null }; draw(); force(x => x + 1); };

  const legendStops = mapStyle === 'change'
    ? [['Loss', '#ef5b5b'], ['Stable', '#566'], ['Gain', '#19d36b']]
    : mapStyle === 'forest'
      ? [['Non-forest', '#2a3a2e'], ['Forest', '#19964a']]
      : [['Low', 'rgb(36,50,22)'], ['', 'rgb(155,190,46)'], ['High', 'rgb(25,211,107)']];

  return <div ref={wrap} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: fill ? 0 : 'inherit', background: '#07100b' }}>
    <canvas ref={cvs} style={{ width: '100%', height: '100%', display: 'block', cursor: view.current.drag ? 'grabbing' : 'grab' }} />

    {/* HUD: top-left */}
    <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'rgba(8,16,11,.74)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7 }}>
        <Dot s="ok" pulse />
        <span className="mono" style={{ fontSize: 11, color: '#e8f0ea' }}>{project.code}</span>
        <span style={{ fontSize: 11, color: '#66796d' }}>{project.name}</span>
      </div>
      <span className="mono" style={{ fontSize: 10, color: '#66796d', paddingLeft: 2 }}>
        {project.lat.toFixed(3)}°, {project.lng.toFixed(3)}° · EPSG:4326
      </span>
    </div>

    {/* HUD: top-right legend */}
    <div style={{ position: 'absolute', top: 12, right: 12, padding: '8px 10px', background: 'rgba(8,16,11,.74)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 7, pointerEvents: 'none' }}>
      <div className="lbl" style={{ marginBottom: 6 }}>
        {mapStyle === 'biomass' ? 'AGBD · Mg ha⁻¹' : mapStyle === 'change' ? 'Δ Biomass' : mapStyle === 'forest' ? 'Forest cover' : mapStyle === 'terrain' ? 'Elevation' : 'Surface'}
      </div>
      {mapStyle === 'biomass' || mapStyle === 'satellite' || mapStyle === 'terrain'
        ? <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="mono" style={{ fontSize: 9, color: '#66796d' }}>0</span>
          <div style={{ width: 92, height: 8, borderRadius: 3, background: mapStyle === 'biomass' ? 'linear-gradient(90deg,rgb(36,50,22),rgb(155,190,46),rgb(25,211,107))' : mapStyle === 'terrain' ? 'linear-gradient(90deg,rgb(28,40,33),rgb(110,134,110),rgb(200,210,196))' : 'linear-gradient(90deg,rgb(40,46,34),rgb(60,82,48),rgb(38,64,40))' }} />
          <span className="mono" style={{ fontSize: 9, color: '#66796d' }}>{mapStyle === 'biomass' ? Math.round(project.agbd.hi) : '∎'}</span>
        </div>
        : <div style={{ display: 'flex', gap: 12 }}>{legendStops.map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: s[1] }} /><span style={{ fontSize: 10, color: '#9bb0a4' }}>{s[0]}</span></div>)}</div>}
    </div>

    {/* zoom controls */}
    <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 7, overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)' }}>
      {[['plus', () => zoom(1.3)], ['chevD', () => zoom(1 / 1.3)], ['crosshair', reset]].map(([ic, fn], i) =>
        <button key={i} onClick={fn} style={{ width: 30, height: 30, border: 'none', background: 'rgba(8,16,11,.82)', backdropFilter: 'blur(8px)', color: '#e8f0ea', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
          <Icon name={ic} size={ic === 'chevD' ? 14 : 13} />
        </button>)}
    </div>

    {/* scale bar + attribution */}
    <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ width: 64, height: 4, borderLeft: '1.5px solid #9bb0a4', borderRight: '1.5px solid #9bb0a4', borderBottom: '1.5px solid #9bb0a4' }} />
        <span className="mono" style={{ fontSize: 9, color: '#66796d' }}>5 km</span>
      </div>
      <span className="mono" style={{ fontSize: 9, color: '#66796d' }}>Sentinel-2 · 10 m · GEE</span>
    </div>
  </div>;
}

Object.assign(window, { MapHero, ramp, RAMPS, hash2, fbm });
