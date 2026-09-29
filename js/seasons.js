/**
 * Seasons on scroll: the page moves through a year as you read. The ground colour drifts from spring at the
 * top to summer, autumn and winter at the contact, and a light layer of falling things follows the season:
 * a few petals, a quiet summer, a few leaves, then light snow. The hero keeps its own petals, so this layer fades in
 * below it.
 * With reduced motion, the colour still follows the scroll but nothing falls.
 */
(() => {
  const { $, clamp, lerp, reduce, scene } = MO;
  const root = document.documentElement;
  // Four grounds, all close to the site's stone so text contrast never changes
  const GROUND = [[230, 224, 214], [221, 225, 211], [228, 218, 203], [223, 225, 226]];
  const at = (p) => { const f = clamp(p, 0, 1) * 3, i = Math.min(2, Math.floor(f)), k = f - i; return { f, rgb: GROUND[i].map((v, j) => Math.round(lerp(v, GROUND[i + 1][j], k))) }; };
  const weights = (f) => [0, 1, 2, 3].map((i) => clamp(1 - Math.abs(f - i), 0, 1));

  let lastRGB = "", span = 1;
  const measure = () => (span = Math.max(1, document.documentElement.scrollHeight - innerHeight));
  addEventListener("resize", measure); addEventListener("load", measure); new ResizeObserver(measure).observe(document.body); measure();
  function tint() {
    const s = at(scrollY / span), rgb = `rgb(${s.rgb.join(",")})`;
    if (rgb !== lastRGB) { lastRGB = rgb; root.style.setProperty("--season", rgb); }
    return s.f;
  }
  addEventListener("scroll", tint, { passive: true }); tint();
  if (reduce) return;

  // Falling layer
  const cv = document.createElement("canvas"); cv.className = "season-fx"; cv.setAttribute("aria-hidden", "true"); document.body.appendChild(cv);
  const x = cv.getContext("2d");
  let W = 0, H = 0, D = 1;
  const size = () => { D = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; cv.width = Math.round(W * D); cv.height = Math.round(H * D); };
  addEventListener("resize", size); size();
  const small = () => W < 700;
  const P = [];
  const spawn = (kind, top) => ({ kind, x: Math.random() * W, y: top ? -12 - Math.random() * 40 : Math.random() * H, v: kind === "snow" ? 0.35 + Math.random() * 0.4 : 0.4 + Math.random() * 0.5, a: Math.random() * 6.28, s: kind === "leaf" ? 4 + Math.random() * 3 : kind === "petal" ? 2.5 + Math.random() * 2 : 1 + Math.random() * 1.6, c: Math.random(), sway: 0.5 + Math.random() });
  const COL = { petal: ["#E8B4A0", "#F7E4DA", "#D98A7A"], leaf: ["#C8643B", "#E0A33A", "#B5652F", "#8C3B2A"], snow: ["#FFFFFF"] };
  let wind = 0;

  scene(document.body, (t, dt) => {
    const f = tint(), w = weights(f), hero = clamp(scrollY / (innerHeight * 0.8), 0, 1), k = dt * 60;
    // How many of each should be falling right now
    const n = small() ? 0.5 : 1;
    const want = { petal: Math.round(10 * w[0] * hero * n), leaf: Math.round(9 * w[2] * n), snow: Math.round(22 * w[3] * n) };
    for (const kind in want) { let have = 0; for (const p of P) if (p.kind === kind && !p.gone) have++; for (; have < want[kind]; have++) P.push(spawn(kind, false)); if (have > want[kind]) { let drop = have - want[kind]; for (const p of P) if (drop && p.kind === kind && !p.gone) { p.gone = true; drop--; } } }
    wind = lerp(wind, Math.sin(t * 0.3) * 0.6 + Math.sin(t * 0.07) * 0.4, 0.02);
    x.setTransform(D, 0, 0, D, 0, 0); x.clearRect(0, 0, W, H);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.y += p.v * k; p.x += (wind * 0.4 + Math.sin(t * p.sway + p.a) * 0.4) * k; p.a += (p.kind === "leaf" ? 0.04 : 0.02) * k;
      if (p.y > H + 12 || p.x > W + 20 || p.x < -20) { if (p.gone) { P.splice(i, 1); continue; } Object.assign(p, spawn(p.kind, true)); }
      const cols = COL[p.kind], col = cols[Math.floor(p.c * cols.length)];
      x.globalAlpha = p.gone ? 0.35 : 0.6;
      x.fillStyle = col; x.beginPath();
      if (p.kind === "leaf") { x.ellipse(p.x, p.y, p.s, p.s * 0.45 * Math.abs(Math.cos(p.a)) + 0.6, p.a * 0.6, 0, 6.283); }
      else if (p.kind === "petal") x.ellipse(p.x, p.y, p.s, p.s * 0.55, p.a, 0, 6.283);
      else x.arc(p.x, p.y, p.s, 0, 6.283);
      x.fill();
    }
    x.globalAlpha = 1;
  });
})();
