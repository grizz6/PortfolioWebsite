/**
 * Foraging paths: a live drawing at the top of the projects. Bees fly between 10 blossoms (one per orchard
 * in the bee foraging study) and every flight leaves a faint line, so the plate slowly draws a map of foraging. The cursor
 * becomes a flower they visit, and a click plants a new one. Old lines fade, so the map keeps changing.
 */
(() => {
  const { $, clamp, reduce, RNG, M, scene } = MO;
  const box = $("#forage"); if (!box) return;
  const cv = $("canvas", box), x = cv.getContext("2d");
  const trail = document.createElement("canvas"), tx = trail.getContext("2d");
  const C = { paper: "#F7F5EF", ink: "#1B1C19", honey: "#E0A33A", petal: ["#E8B4A0", "#F7E4DA", "#D98A7A"], line: ["#5E6B45", "#D98A7A", "#2F6F73", "#E0A33A"] };
  let W = 0, H = 0, D = 1, flowers = [], bees = [], inside = false;
  box.addEventListener("pointerenter", () => (inside = true)); box.addEventListener("pointerleave", () => (inside = false));

  function build() {
    D = Math.min(devicePixelRatio || 1, 1.75); W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
    cv.width = trail.width = Math.round(W * D); cv.height = trail.height = Math.round(H * D);
    x.setTransform(D, 0, 0, D, 0, 0); tx.setTransform(D, 0, 0, D, 0, 0);
    const r = RNG(15);
    flowers = Array.from({ length: 10 }, () => ({ x: W * (0.06 + r() * 0.88), y: H * (0.14 + r() * 0.72), r: 5 + r() * 3, c: C.petal[Math.floor(r() * 3)] }));
    bees = Array.from({ length: W < 600 ? 6 : 10 }, (_, i) => ({ x: flowers[i % 10].x, y: flowers[i % 10].y, vx: 0, vy: 0, tgt: (i * 7) % 10, wait: 0, c: C.line[i % 4] }));
    if (reduce) { for (let k = 0; k < 900; k++) step(k / 60, false, 0, 0); paint(0); }
  }
  let pending = false;
  new ResizeObserver(() => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; if (cv.clientWidth !== W || cv.clientHeight !== H) build(); }); }).observe(cv);
  cv.addEventListener("click", (e) => { const b = cv.getBoundingClientRect(); flowers.push({ x: e.clientX - b.left, y: e.clientY - b.top, r: 7, c: C.petal[2], born: performance.now() }); if (flowers.length > 19) flowers.splice(10, 1); });

  function step(t, near, cx, cy) {
    bees.forEach((b, i) => {
      const lure = near && Math.hypot(b.x - cx, b.y - cy) < 190;
      const f = lure ? { x: cx + Math.cos(t * 3 + i) * 16, y: cy + Math.sin(t * 3.3 + i) * 11 } : flowers[b.tgt % flowers.length];
      const dx = f.x - b.x, dy = f.y - b.y, d = Math.hypot(dx, dy);
      if (!lure && d < 8 && b.wait <= 0) b.wait = 30 + Math.random() * 50;
      if (b.wait > 0 && --b.wait <= 0) b.tgt = Math.floor(Math.random() * flowers.length);
      b.vx += (dx / (d + 1)) * 0.22 + (Math.random() - 0.5) * 0.4; b.vy += (dy / (d + 1)) * 0.22 + (Math.random() - 0.5) * 0.4;
      const sp = Math.hypot(b.vx, b.vy); if (sp > 1.9) { b.vx *= 1.9 / sp; b.vy *= 1.9 / sp; } b.vx *= 0.96; b.vy *= 0.96;
      const px = b.x, py = b.y; b.x += b.vx; b.y += b.vy;
      tx.strokeStyle = b.c; tx.globalAlpha = 0.22; tx.lineWidth = 1; tx.beginPath(); tx.moveTo(px, py); tx.lineTo(b.x, b.y); tx.stroke(); tx.globalAlpha = 1;
    });
  }
  const flower = (fx, fy, r, col) => { x.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k * 1.2566; x.beginPath(); x.ellipse(fx + Math.cos(a) * r, fy + Math.sin(a) * r, r * 0.9, r * 0.6, a, 0, 6.283); x.fill(); } x.fillStyle = C.honey; x.beginPath(); x.arc(fx, fy, r * 0.55, 0, 6.283); x.fill(); };
  function paint(t) {
    x.fillStyle = C.paper; x.fillRect(0, 0, W, H);
    x.drawImage(trail, 0, 0, W, H);
    const now = performance.now();
    flowers.forEach((f) => flower(f.x, f.y, f.r * (f.born ? clamp((now - f.born) / 500, 0, 1) : 1), f.c));
    if (reduce) return;
    bees.forEach((b, i) => {
      const a = Math.atan2(b.vy, b.vx), c = Math.cos(a) * D, s = Math.sin(a) * D; x.setTransform(c, s, -s, c, b.x * D, b.y * D);
      x.fillStyle = "rgba(255,255,255,.85)"; x.beginPath(); x.ellipse(-1, -3 - Math.abs(Math.sin(t * 40 + i)) * 1.5, 2.8, 1.7, -0.4, 0, 6.283); x.fill();
      x.fillStyle = C.honey; x.beginPath(); x.ellipse(0, 0, 4.4, 2.9, 0, 0, 6.283); x.fill(); x.fillStyle = C.ink; x.fillRect(-1.2, -2.7, 1.4, 5.4); x.fillRect(1.6, -2.3, 1.1, 4.6);
    });
    x.setTransform(D, 0, 0, D, 0, 0);
  }

  build();
  if (reduce) return;
  scene(box, (t) => {
    if (!W) return;
    // Old flights fade slowly so the map keeps evolving
    tx.globalCompositeOperation = "destination-out"; tx.fillStyle = "rgba(0,0,0,.006)"; tx.fillRect(0, 0, W, H); tx.globalCompositeOperation = "source-over";
    const b = cv.getBoundingClientRect();
    step(t, inside, M.x - b.left, M.y - b.top);
    paint(t);
  });
})();
