/**
 * Orchard hero. Trees grow and blossom, the cursor makes wind, and a click regrows the orchard.
 * Falling petals come from the seasons layer and bees live in the foraging plate, so neither repeats here.
 *
 * Fast path: the sky and sun are CSS layers, the hills are drawn once per resize, and each frame draws
 * branches in a few batched paths and stamps the blossoms from a sprite atlas.
 */
(() => {
  const { $, clamp, damp, reduce, RNG, M, scene } = MO;
  const hero = $("#hero"), cv = $("#orchard"), x = cv.getContext("2d"), sun = $("#hero .o-sun");
  hero.classList.add("is-paper");
  const C = { bark: "#3B2A22", barkBack: "#7a6a5c", hill1: "#C5D0A8", hill2: "#9DB27E", ground: "#5E6B45", leaf: ["#5E6B45", "#87A96B", "#3D5A40"], bloom: ["#E8B4A0", "#F7E4DA", "#D98A7A", "#F2CC8F", "#FFFFFF"], page: "#E1DFD8" };
  const COLORS = [...C.leaf, ...C.bloom], CHUNK = 4;
  let W = 0, H = 0, D = 1, trees = [], split = 0, t0 = null, wind = 0, seed = 11, hills = null, ground = null, fade = null;

  function makeTree(x0, y0, s, r, depthMax) {
    const br = [];
    (function grow(parent, ang, len, depth) {
      const b = { p: parent ? parent.idx : -1, ang, len, depth, lvl: depthMax - depth, idx: br.length }; br.push(b);
      if (depth > 0) { const k = r() < 0.2 ? 3 : 2; for (let j = 0; j < k; j++) grow(b, (j - (k - 1) / 2) * (0.38 + r() * 0.34) + (r() - 0.5) * 0.25, len * (0.7 + r() * 0.12), depth - 1); }
      else b.fl = Array.from({ length: 3 + Math.floor(r() * 4) }, () => ({ dx: (r() - 0.5) * 16 * s, dy: (r() - 0.5) * 14 * s, rr: (2 + r() * 3.4) * s, c: r() < 0.3 ? Math.floor(r() * 3) : 3 + Math.floor(r() * C.bloom.length) }));
    })(null, 0, 64 * s, depthMax);
    // One width per depth level, so each level strokes as one path
    const widths = Array.from({ length: depthMax + 1 }, (_, d) => Math.max(0.8, (d + 0.5) * 1.5 * s));
    return { x0, y0, s, br, depthMax, widths, ph: r() * 6, P: new Float32Array(br.length * 3) };
  }
  const layer = (w, h) => { const c = document.createElement("canvas"); c.width = Math.ceil(w * D); c.height = Math.ceil(h * D); const g = c.getContext("2d"); g.setTransform(D, 0, 0, D, 0, 0); return [c, g]; };
  function build() {
    D = Math.min(devicePixelRatio || 1, 1.5); W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
    cv.width = Math.round(W * D); cv.height = Math.round(H * D);
    const r = RNG(seed), gy = H * 0.88, k = clamp(H / 900, 0.7, 1.2) * (W < 700 ? 0.8 : 1); trees = [];
    const nBack = Math.max(3, Math.round(W / 250)), nFront = Math.max(2, Math.round(W / 360));
    for (let i = 0; i < nBack; i++) trees.push(makeTree(W * ((i + 0.5) / nBack) + (r() - 0.5) * 60, gy - H * 0.07, (0.62 + r() * 0.18) * k, r, 6));
    for (let i = 0; i < nFront; i++) trees.push(makeTree(W * ((i + 0.5) / nFront) + (r() - 0.5) * 80, gy + 6, (1 + r() * 0.25) * k, r, 7));
    split = nBack;
    // Tell the page where the front trees stand, so the hero tag can hang from a branch
    window.ORCHARD_TREES = trees.slice(split).map((t) => ({ x: t.x0, y: t.y0, s: t.s })).sort((a, b) => a.x - b.x); dispatchEvent(new CustomEvent("orchard:trees"));
    buildAtlas();
    // Static layers, drawn once
    const hill = (g, col, base, amp, fq, ph, top) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, H - top); for (let xx = 0; xx <= W + 20; xx += 10) g.lineTo(xx, base - top + Math.sin(xx * fq + ph) * amp + Math.sin(xx * fq * 2.3 + ph * 2) * amp * 0.4); g.lineTo(W, H - top); g.fill(); };
    const hTop = Math.floor(gy - H * 0.15 - 40), gTop = Math.floor(gy - 20), fTop = Math.floor(H * 0.9);
    { const [c, g] = layer(W, H - hTop); hill(g, C.hill1, gy - H * 0.15, 16, 0.004, 1, hTop); hill(g, C.hill2, gy - H * 0.06, 13, 0.006, 3, hTop); hills = { c, y: hTop }; }
    { const [c, g] = layer(W, H - gTop); hill(g, C.ground, gy + 2, 7, 0.008, 5, gTop); ground = { c, y: gTop }; }
    { const [c, g] = layer(W, H - fTop); const f = g.createLinearGradient(0, 0, 0, H - fTop); f.addColorStop(0, "rgba(225,223,216,0)"); f.addColorStop(1, C.page); g.fillStyle = f; g.fillRect(0, 0, W, H - fTop); fade = { c, y: fTop }; }
    const sR = Math.min(W, H) * 0.075; sun.style.setProperty("--r", sR + "px"); sun.style.left = W * (W < 700 ? 0.78 : 0.8) + "px"; sun.style.top = H * 0.24 + "px";
  }
  // Every blossom cluster is painted once into a sprite atlas; each frame just stamps the clusters
  let atlas = null;
  function buildAtlas() {
    const cells = []; trees.forEach((tr) => tr.br.forEach((b) => { if (!b.fl) return; let e = 0; b.fl.forEach((f) => (e = Math.max(e, Math.abs(f.dx) + f.rr, Math.abs(f.dy) + f.rr))); b.e = Math.ceil(e + 1); cells.push(b); }));
    const AW = 2048 / D; let cx = 0, cy = 0, rowH = 0;
    cells.forEach((b) => { const w = b.e * 2; if (cx + w > AW) { cx = 0; cy += rowH; rowH = 0; } b.ax = cx; b.ay = cy; cx += w; rowH = Math.max(rowH, w); });
    const [c, g] = layer(AW, cy + rowH);
    cells.forEach((b) => b.fl.forEach((f) => { g.fillStyle = COLORS[f.c]; g.beginPath(); g.arc(b.ax + b.e + f.dx, b.ay + b.e + f.dy, f.rr, 0, 6.283); g.fill(); }));
    atlas = c;
  }
  const blit = (l) => x.drawImage(l.c, 0, l.y, W, l.c.height / D);
  let pending = false;
  new ResizeObserver(() => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; if (cv.clientWidth !== W || cv.clientHeight !== H) build(); }); }).observe(cv);
  cv.addEventListener("click", () => { seed = Math.floor(Math.random() * 9999); build(); t0 = performance.now() / 1000; });
  build();

  // Draw in small subtree chunks (branches, then that chunk's blossoms), which keeps the original look of
  // branches cutting through earlier blossoms while still batching most of the work
  function drawTrees(from, to, g, t, back) {
    const bk = clamp((g - 0.72) / 0.28, 0, 1);
    x.globalAlpha = back ? 0.75 : 1;
    for (let ti = from; ti < to; ti++) {
      const tr = trees[ti], P = tr.P; let levels = tr.widths.map(() => new Path2D()), stamps = [];
      const flush = () => {
        x.globalAlpha = 1; x.strokeStyle = back ? C.barkBack : C.bark;
        for (let d = 0; d < levels.length; d++) { x.lineWidth = tr.widths[d]; x.stroke(levels[d]); }
        x.globalAlpha = back ? 0.75 : 1;
        for (let i = 0; i < stamps.length; i += 3) { const b = stamps[i], e = b.e, w = e * 2 * bk; x.drawImage(atlas, b.ax * D, b.ay * D, e * 2 * D, e * 2 * D, stamps[i + 1] - e * bk, stamps[i + 2] - e * bk, w, w); }
        levels = tr.widths.map(() => new Path2D()); stamps = [];
      };
      for (let k = 0; k < tr.br.length; k++) {
        const b = tr.br[k], pi = b.p * 3;
        if (k > 0 && b.lvl <= CHUNK && stamps.length) flush();
        const px = b.p < 0 ? tr.x0 : P[pi], py = b.p < 0 ? tr.y0 : P[pi + 1], pa = b.p < 0 ? -Math.PI / 2 : P[pi + 2];
        const grow = clamp(g * (tr.depthMax + 2) - b.lvl, 0, 1);
        const sway = reduce ? 0 : (b.lvl / tr.depthMax) * wind * 0.12 + Math.sin(t * 1.4 + tr.ph + b.lvl) * 0.012 * b.lvl;
        const a = pa + b.ang + sway, ex = px + Math.cos(a) * b.len * grow, ey = py + Math.sin(a) * b.len * grow;
        P[k * 3] = ex; P[k * 3 + 1] = ey; P[k * 3 + 2] = a;
        if (grow > 0) { const l = levels[b.depth]; l.moveTo(px, py); l.lineTo(ex, ey); }
        if (b.fl && bk > 0) stamps.push(b, ex, ey);
      }
      flush();
    }
    x.globalAlpha = 1;
  }

  let lastSun = -1;
  scene(hero, (t, dt) => {
    if (!W) return;
    if (t0 === null && (hero.classList.contains("is-in") || reduce)) t0 = t;
    const g = reduce ? 1 : t0 === null ? 0 : clamp((t - t0) / 5.5, 0, 1);
    const sc = clamp(scrollY / H, 0, 1);
    if (Math.abs(sc - lastSun) > 0.001) { lastSun = sc; sun.style.transform = `translate3d(-50%, calc(-50% + ${(sc * H * 0.25).toFixed(1)}px), 0)`; }
    wind = damp(wind, M.vx * 0.04 + Math.sin(t * 0.6) * 0.3, 0.05, dt);
    x.setTransform(D, 0, 0, D, 0, 0); x.clearRect(0, 0, W, H); x.lineCap = "round";
    blit(hills);
    drawTrees(0, split, g, t, true);
    blit(ground);
    drawTrees(split, trees.length, g, t, false);
    blit(fade);
  });
})();
