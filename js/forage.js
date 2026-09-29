/**
 * Foraging paths: the live drawing that heads the projects. Every blossom is one project, and bees fly between them
 * leaving a faint line per flight, so the plate slowly draws a map of foraging.
 * Hovering a project row sends the bees to its blossom; hovering a blossom lights up its row, and clicking it opens it.
 * Clicking empty paper plants a new flower. Old lines fade, so the map keeps changing.
 * Talks to the project list through document events: "proj:focus" in, "forage:hover" and "forage:open" out.
 */
(() => {
  const { $, clamp, reduce, RNG, M, scene } = MO;
  const box = $("#forage"); if (!box) return;
  const cv = $("canvas", box), x = cv.getContext("2d");
  const trail = document.createElement("canvas"), tx = trail.getContext("2d");
  const P = window.PORTFOLIO, N = P.projects.length;
  const C = { paper: "#F7F5EF", ink: "#1B1C19", honey: "#E0A33A", petal: ["#E8B4A0", "#F7E4DA", "#D98A7A"], line: ["#5E6B45", "#D98A7A", "#2F6F73", "#E0A33A"] };
  const PROJ = window.PROJ_COLORS || ["#D98A7A"];
  let W = 0, H = 0, D = 1, flowers = [], bees = [], inside = false, focus = -1, hover = -1;
  box.addEventListener("pointerenter", () => (inside = true));
  box.addEventListener("pointerleave", () => { inside = false; setHover(-1); });
  document.addEventListener("proj:focus", (e) => (focus = e.detail));
  if (matchMedia("(hover: none)").matches) { const h = $(".f-hint", box); if (h) h.textContent = "Tap a blossom to open"; }

  function setHover(i) {
    if (i === hover) return; hover = i; cv.style.cursor = i >= 0 ? "pointer" : "crosshair";
    document.dispatchEvent(new CustomEvent("forage:hover", { detail: i }));
  }

  function build() {
    D = Math.min(devicePixelRatio || 1, 1.75); W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
    cv.width = trail.width = Math.round(W * D); cv.height = trail.height = Math.round(H * D);
    x.setTransform(D, 0, 0, D, 0, 0); tx.setTransform(D, 0, 0, D, 0, 0);
    // One blossom per project, spread out so none overlap and none sit under the hint
    const r = RNG(15), min = Math.min(W, H) * 0.2; flowers = [];
    for (let i = 0, tries = 0; i < N && tries < 4000; tries++) {
      const f = { x: W * (0.07 + r() * 0.86), y: H * (0.16 + r() * 0.7), r: 6 + r() * 2.5, c: PROJ[i % PROJ.length], p: i, s: 1 };
      if (f.x > W - 300 && f.y < H * 0.2) continue;
      if (flowers.some((g) => Math.hypot(g.x - f.x, g.y - f.y) < min * (tries > 2500 ? 0.6 : 1))) continue;
      flowers.push(f); i++;
    }
    bees = Array.from({ length: W < 600 ? 6 : 10 }, (_, i) => ({ x: flowers[i % flowers.length].x, y: flowers[i % flowers.length].y, vx: 0, vy: 0, tgt: (i * 7) % flowers.length, wait: 0, c: C.line[i % 4] }));
    if (reduce) { for (let k = 0; k < 900; k++) step(k / 60, false, 0, 0); paint(0); }
  }
  let pending = false;
  new ResizeObserver(() => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; if (cv.clientWidth !== W || cv.clientHeight !== H) build(); }); }).observe(cv);

  const hit = (px, py) => { let best = -1, bd = 22; flowers.forEach((f, i) => { if (f.p === undefined) return; const d = Math.hypot(f.x - px, f.y - py); if (d < bd) { bd = d; best = i; } }); return best >= 0 ? flowers[best].p : -1; };
  cv.addEventListener("pointermove", (e) => { const b = cv.getBoundingClientRect(); setHover(hit(e.clientX - b.left, e.clientY - b.top)); });
  cv.addEventListener("click", (e) => {
    const b = cv.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top, p = hit(px, py);
    if (p >= 0) { document.dispatchEvent(new CustomEvent("forage:open", { detail: p })); return; }
    flowers.push({ x: px, y: py, r: 7, c: C.petal[2], born: performance.now(), s: 1 }); if (flowers.length > N + 9) flowers.splice(N, 1);
  });

  function step(t, near, cx, cy) {
    const lit = hover >= 0 ? hover : focus;
    bees.forEach((b, i) => {
      const lure = lit < 0 && near && Math.hypot(b.x - cx, b.y - cy) < 190;
      let f;
      if (lit >= 0) { const g = flowers[lit]; f = { x: g.x + Math.cos(t * 2.6 + i * 0.7) * 22, y: g.y + Math.sin(t * 3 + i) * 15 }; }
      else f = lure ? { x: cx + Math.cos(t * 3 + i) * 16, y: cy + Math.sin(t * 3.3 + i) * 11 } : flowers[b.tgt % flowers.length];
      const dx = f.x - b.x, dy = f.y - b.y, d = Math.hypot(dx, dy);
      if (lit < 0 && !lure && d < 8 && b.wait <= 0) b.wait = 30 + Math.random() * 50;
      if (b.wait > 0 && --b.wait <= 0) b.tgt = Math.floor(Math.random() * flowers.length);
      const pull = lit >= 0 ? 0.34 : 0.22, max = lit >= 0 ? 3 : 1.9;
      b.vx += (dx / (d + 1)) * pull + (Math.random() - 0.5) * 0.4; b.vy += (dy / (d + 1)) * pull + (Math.random() - 0.5) * 0.4;
      const sp = Math.hypot(b.vx, b.vy); if (sp > max) { b.vx *= max / sp; b.vy *= max / sp; } b.vx *= 0.96; b.vy *= 0.96;
      const px = b.x, py = b.y; b.x += b.vx; b.y += b.vy;
      tx.strokeStyle = b.c; tx.globalAlpha = 0.22; tx.lineWidth = 1; tx.beginPath(); tx.moveTo(px, py); tx.lineTo(b.x, b.y); tx.stroke(); tx.globalAlpha = 1;
    });
  }
  const flower = (fx, fy, r, col) => { x.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k * 1.2566; x.beginPath(); x.ellipse(fx + Math.cos(a) * r, fy + Math.sin(a) * r, r * 0.9, r * 0.6, a, 0, 6.283); x.fill(); } x.fillStyle = C.honey; x.beginPath(); x.arc(fx, fy, r * 0.55, 0, 6.283); x.fill(); };
  function label(f) {
    const p = P.projects[f.p], txt = `${String(f.p + 1).padStart(2, "0")}  ${p.title}`;
    x.font = "500 13px 'Inter Tight', system-ui, sans-serif"; const w = x.measureText(txt).width + 22;
    let lx = f.x + 18, ly = f.y - 34; if (lx + w > W - 8) lx = f.x - 18 - w; if (ly < 8) ly = f.y + 18;
    x.fillStyle = "rgba(27,28,25,.9)"; x.beginPath(); x.roundRect ? x.roundRect(lx, ly, w, 26, 13) : x.rect(lx, ly, w, 26); x.fill();
    x.fillStyle = "#F7F5EF"; x.fillText(txt, lx + 11, ly + 17.5);
  }
  function paint(t) {
    x.fillStyle = C.paper; x.fillRect(0, 0, W, H);
    x.drawImage(trail, 0, 0, W, H);
    const now = performance.now(), lit = hover >= 0 ? hover : focus;
    flowers.forEach((f, i) => { f.s += ((i === lit ? 1.9 : 1) - f.s) * 0.15; flower(f.x, f.y, f.r * f.s * (f.born ? clamp((now - f.born) / 500, 0, 1) : 1), f.c); });
    if (!reduce) bees.forEach((b, i) => {
      const a = Math.atan2(b.vy, b.vx), c = Math.cos(a) * D, s = Math.sin(a) * D; x.setTransform(c, s, -s, c, b.x * D, b.y * D);
      x.fillStyle = "rgba(255,255,255,.85)"; x.beginPath(); x.ellipse(-1, -3 - Math.abs(Math.sin(t * 40 + i)) * 1.5, 2.8, 1.7, -0.4, 0, 6.283); x.fill();
      x.fillStyle = C.honey; x.beginPath(); x.ellipse(0, 0, 4.4, 2.9, 0, 0, 6.283); x.fill(); x.fillStyle = C.ink; x.fillRect(-1.2, -2.7, 1.4, 5.4); x.fillRect(1.6, -2.3, 1.1, 4.6);
    });
    x.setTransform(D, 0, 0, D, 0, 0);
    if (lit >= 0 && flowers[lit]) label(flowers[lit]);
  }

  build();
  if (reduce) { document.addEventListener("proj:focus", () => paint(0)); document.addEventListener("forage:hover", () => paint(0)); return; }
  scene(box, (t) => {
    if (!W) return;
    // Old flights fade slowly so the map keeps evolving
    tx.globalCompositeOperation = "destination-out"; tx.fillStyle = "rgba(0,0,0,.006)"; tx.fillRect(0, 0, W, H); tx.globalCompositeOperation = "source-over";
    const b = cv.getBoundingClientRect();
    step(t, inside, M.x - b.left, M.y - b.top);
    paint(t);
  });
})();
