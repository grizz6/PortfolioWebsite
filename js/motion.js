/**
 * Motion core for the orchard hero, the foraging drawing and the project document covers.
 *
 * One requestAnimationFrame loop drives every scene, and a scene only runs while its section is on screen.
 */
window.MO = (function () {
  "use strict";
  const { $, $$, clamp, lerp, reduce } = KIT;
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  // Frame-rate independent easing: move `k` of the way per 60 fps frame, whatever the real frame time
  const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.pow(1 - k, dt * 60));
  const RNG = (s) => { s = Math.floor(s) % 2147483646 + 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
  function Noise(seed) {
    const r = RNG(seed), perm = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    const p = new Uint8Array(512); for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10), g = (h, x, y) => { switch (h & 3) { case 0: return x + y; case 1: return -x + y; case 2: return x - y; default: return -x - y; } };
    return (x, y) => { const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y); const u = fade(x), v = fade(y), a = p[X] + Y, b = p[X + 1] + Y; return lerp(lerp(g(p[a], x, y), g(p[b], x - 1, y), u), lerp(g(p[a + 1], x, y - 1), g(p[b + 1], x - 1, y - 1), u), v); };
  }

  // Pointer, shared by every scene. `moved` lets a scene skip work when nothing changed.
  const M = { x: -9999, y: -9999, vx: 0, vy: 0, nx: 0, ny: 0, moved: false, t: 0 };
  let lx = null, ly = null;
  addEventListener("pointermove", (e) => {
    if (lx !== null) { M.vx = e.clientX - lx; M.vy = e.clientY - ly; }
    lx = M.x = e.clientX; ly = M.y = e.clientY; M.nx = (M.x / innerWidth) * 2 - 1; M.ny = -((M.y / innerHeight) * 2 - 1); M.moved = true; M.t = performance.now();
  }, { passive: true });

  // Scenes: { el, fn(t, dt), on } — `on` follows an IntersectionObserver, so off-screen scenes cost nothing
  const scenes = [];
  const io = new IntersectionObserver((es) => es.forEach((e) => scenes.forEach((s) => { if (s.el === e.target) s.on = e.isIntersecting; })), { rootMargin: "10% 0px" });
  function scene(el, fn) { const s = { el, fn, on: false }; scenes.push(s); io.observe(el); return s; }
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    for (const s of scenes) if (s.on) s.fn(t, dt);
    M.vx *= 0.9; M.vy *= 0.9; M.moved = false;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const load = (src) => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.body.appendChild(s); });

  // Generative cover art for project documents (reports, posters, slides listed in js/content.js)
  const INK = "#1B1C19", PAL = ["#5E6B45", "#C8643B", "#E0A33A", "#2F6F73", "#5B2A45", "#E8B4A0", "#87A96B"];
  const COVERS = {
    rings(x, L, T0, W, H, r, n) { const cx = L + W * 0.5, cy = T0 + H * 0.52; for (let k = 0; k < 30; k++) { const R0 = 10 + k * 8.2; x.beginPath(); for (let a = 0; a <= 6.3; a += 0.03) { const rr = R0 + n(Math.cos(a) * 1.3 + k * 0.08, Math.sin(a) * 1.3) * R0 * 0.2; const X = cx + Math.cos(a) * rr * 1.25, Y = cy + Math.sin(a) * rr; a ? x.lineTo(X, Y) : x.moveTo(X, Y); } x.closePath(); x.strokeStyle = k % 5 === 4 ? PAL[(k / 5) % PAL.length | 0] : INK; x.lineWidth = k % 5 === 4 ? 4 : 1.3; x.stroke(); } },
    flow(x, L, T0, W, H, r, n) { x.lineCap = "round"; for (let i = 0; i < 520; i++) { let px = L + r() * W, py = T0 + r() * H; x.beginPath(); x.moveTo(px, py); const len = 30 + r() * 90; for (let s = 0; s < len; s++) { const a = n(px * 0.004, py * 0.004) * 6.28 * 1.4; px += Math.cos(a) * 2.2; py += Math.sin(a) * 2.2; x.lineTo(px, py); } x.strokeStyle = r() < 0.25 ? INK : PAL[Math.floor(r() * PAL.length)]; x.lineWidth = r() < 0.12 ? 5 + r() * 5 : 0.8 + r() * 2; x.stroke(); } },
    truchet(x, L, T0, W, H, r) { const c = 38; x.lineWidth = 3.2; x.lineCap = "round"; for (let yy = T0; yy < T0 + H; yy += c) for (let xx = L; xx < L + W; xx += c) { if (r() < 0.16) { x.fillStyle = PAL[Math.floor(r() * PAL.length)]; x.globalAlpha = 0.55; x.fillRect(xx, yy, c, c); x.globalAlpha = 1; } x.strokeStyle = r() < 0.25 ? "#5E6B45" : INK; x.beginPath(); if (r() < 0.5) { x.arc(xx, yy, c / 2, 0, Math.PI / 2); x.moveTo(xx + c, yy + c / 2); x.arc(xx + c, yy + c, c / 2, -Math.PI / 2, Math.PI, true); } else { x.arc(xx + c, yy, c / 2, Math.PI / 2, Math.PI); x.moveTo(xx + c / 2, yy + c); x.arc(xx, yy + c, c / 2, -Math.PI / 2, 0); } x.stroke(); } },
    stipple(x, L, T0, W, H, r, n) { const by = PAL.slice(0, 4).map(() => new Path2D()), ink = new Path2D(); let k = 0, tries = 0; while (k < 9000 && tries < 90000) { tries++; const px = L + r() * W, py = T0 + r() * H, d = Math.pow((n(px * 0.006, py * 0.006) + 1) / 2, 2.2); if (r() < d * 1.6) { k++; (r() < 0.12 ? by[Math.floor(r() * 4)] : ink).rect(px, py, 2, 2); } } x.fillStyle = INK; x.fill(ink); by.forEach((p, i) => { x.fillStyle = PAL[i]; x.fill(p); }); },
    hatch(x, L, T0, W, H, r, n) { x.lineWidth = 1.6; for (let i = 0; i < 64; i++) { const y0 = T0 + (i / 63) * H; x.beginPath(); for (let px = L; px <= L + W; px += 6) { const u = (px - L) / W, cyv = T0 + H * 0.5, yy = lerp(y0, cyv + (y0 - cyv) * 0.12, u * u) + n(px * 0.006, i * 0.12) * 26 * (1 - u); px === L ? x.moveTo(px, yy) : x.lineTo(px, yy); } x.strokeStyle = i % 8 === 3 ? PAL[(i / 8) % PAL.length | 0] : INK; x.stroke(); } },
    ribbons(x, L, T0, W, H, r, n) { x.lineCap = "round"; for (let i = 0; i < 140; i++) { let px = L + r() * W, py = T0 + r() * H; const w = [3, 6, 10, 16][Math.floor(r() * 4)]; x.strokeStyle = PAL[Math.floor(r() * PAL.length)]; x.lineWidth = w; x.beginPath(); x.moveTo(px, py); for (let s = 0; s < 40; s++) { const a = n(px * 0.003, py * 0.003) * 7; px += Math.cos(a) * 4; py += Math.sin(a) * 4; x.lineTo(px, py); } x.stroke(); } },
  };
  // One document cover as a canvas; `seed` fixes the artwork so it is the same on every visit
  function coverArt(d, w = 780, h = 640) { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.fillStyle = "#EFE9DC"; x.fillRect(0, 0, w, h); COVERS[d.art](x, 0, 0, w, h, RNG(d.seed * 7 + 3), Noise(d.seed)); return c; }

  const api = { $, $$, clamp, lerp, sstep, damp, reduce, RNG, Noise, M, scene, load, COVERS, coverArt };

  // Boot: the orchard first, then the seasons and the foraging drawing
  const v = "?v=18";
  const boot = async () => {
    await load("js/orchard-paper.js" + v);
    load("js/seasons.js" + v); load("js/forage.js" + v);
  };
  boot();
  return api;
})();
