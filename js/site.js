/**
 * Renders js/content.js and runs the page: scroll reveals, a small live figure for each project (four show, the
 * rest behind Load more, each with details that open in place), the daily GitHub list, and the photographs (prints
 * by the intro, a reel before contact, and a viewer). Only what is on screen animates; reduced motion gets stills.
 */
(() => {
  "use strict";
  const P = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const external = (a, href) => { a.href = href; if (/^https?:|\.(pdf|jpe?g|png|webp)$/i.test(href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } return a; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  const RNG = (s) => { s = (s >>> 0) % 2147483646 + 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
  const gauss = (r) => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = () => innerWidth > 820;
  // Figure palette: ink on white with vermilion marks, a light vermilion second and a dark grey third (see index.html)
  const C = { bg: "#FFFFFF", fg: "#141216", muted: "#65606A", faint: "#D8D2CB", line: "#ECE6DF", signal: "#FF4A1C", warm: "#FF9A73", cite: "#E23C12", jade: "#3A3640" };
  const TEAL = (a) => `rgba(255,74,28,${a})`, INK = (a) => `rgba(20,18,22,${a})`;
  const MONO = '"Geist Mono", ui-monospace, Menlo, monospace';

  // ---------- Content ----------
  const text = { name: P.name, title: P.title, headline: P.headline, year: new Date().getFullYear(), count: `${pad(P.projects.length)} projects` };
  Object.entries(text).forEach(([k, v]) => $$(`[data-${k}]`).forEach((n) => (n.textContent = v)));
  $$("[data-github]").forEach((a) => (a.href = P.github));
  $$("[data-email]").forEach((a) => { a.href = "mailto:" + P.email; a.textContent = P.email; });
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    const idle = b.textContent;
    try { await navigator.clipboard.writeText(P.email); b.textContent = "Copied"; } catch { b.textContent = P.email; }
    setTimeout(() => (b.textContent = idle), 1600);
  }));
  $$("[data-social]").forEach((c) => P.social.forEach((s) => { c.appendChild(external(el("a", null, s.label + " ↗"), s.href)); c.append(" "); }));

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  const watch = (n) => { n.classList.add("reveal"); if (reduce) n.classList.add("in"); else io.observe(n); };

  // ---------- Hero rings: tree-ring contours that drift slowly ----------
  const rc = $(".rings"), rx = rc && rc.getContext("2d"); let RW = 0, ringsOn = false;
  const ringNoise = (a, k, t) => Math.sin(a * 3 + k * 0.7 + t * 0.25) * 0.05 + Math.sin(a * 5 - k * 0.4 - t * 0.18) * 0.03 + Math.sin(a * 2 + t * 0.12 + k) * 0.04;
  function sizeRings() { const d = Math.min(devicePixelRatio || 1, 2); RW = rc.clientWidth; rc.width = rc.height = Math.round(RW * d); rx.setTransform(d, 0, 0, d, 0, 0); drawRings(reduce ? 0 : performance.now() / 1000); }
  function drawRings(t) {
    if (!RW) return; const c = RW / 2; rx.clearRect(0, 0, RW, RW);
    for (let k = 0; k < 22; k++) {
      const R = c * (0.06 + k * 0.043); rx.beginPath();
      for (let a = 0; a <= 6.3; a += 0.05) { const r = R * (1 + ringNoise(a, k, t) * (0.4 + k * 0.05)); a ? rx.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r) : rx.moveTo(c + Math.cos(a) * r, c + Math.sin(a) * r); }
      rx.closePath(); rx.strokeStyle = k % 6 === 5 ? TEAL(0.55) : k % 3 === 2 ? "rgba(94,123,114,.35)" : INK(0.12); rx.lineWidth = k % 6 === 5 ? 1.6 : 1; rx.stroke();
    }
  }
  if (rc) { new ResizeObserver(sizeRings).observe(rc); new IntersectionObserver(([e]) => (ringsOn = e.isIntersecting)).observe(rc); }

  // ---------- Project figures ----------
  // Each returns draw(x, w, h, t, hover). Text in the figures is either a label or a number from the repo's README.
  const label = (g, s, px, py, col = C.muted, align = "left") => { g.font = `500 10px ${MONO}`; g.fillStyle = col; g.textAlign = align; g.fillText(s.toUpperCase(), px, py); g.textAlign = "left"; };
  const VIZ = {
    // Filings Q&A: a question cites the passages it used; some questions get "Not found"
    cite() {
      return (g, w, h, t) => {
        const cycle = Math.floor(t / 4), k = (t % 4) / 4, r = RNG(cycle * 7 + 3), none = cycle % 4 === 3;
        const qx = w * 0.14, qy = h * 0.5, bx = w * 0.56, bw = w * 0.34, n = 8, bh = (h * 0.7) / n;
        const cited = none ? [] : [...new Set([0, 1, 2].map(() => Math.floor(r() * n)))];
        g.strokeStyle = C.faint; g.lineWidth = 1; g.strokeRect(qx - 18, qy - 14, 36, 28); label(g, "Q", qx, qy + 4, C.fg, "center");
        for (let i = 0; i < n; i++) {
          const y = h * 0.15 + i * bh, on = cited.includes(i) && k > 0.25;
          g.fillStyle = on ? TEAL(0.16) : INK(0.07); g.fillRect(bx, y + 3, bw * (0.55 + ((i * 37) % 40) / 100), bh - 6);
          label(g, `[${i + 1}]`, bx - 8, y + bh / 2 + 3, on ? C.cite : C.faint, "right");
        }
        cited.forEach((i, j) => {
          const y = h * 0.15 + i * bh + bh / 2, p = clamp(k * 1.6 - j * 0.12, 0, 1);
          g.strokeStyle = C.cite; g.lineWidth = 1.2; g.beginPath(); g.moveTo(qx + 18, qy);
          const steps = 30; for (let s = 1; s <= steps * p; s++) { const u = s / steps, cx = lerp(qx + 18, bx - 28, u); g.lineTo(cx, lerp(qy, y, u * u * (3 - 2 * u))); } g.stroke();
        });
        label(g, none ? "Not found in the filings." : "10-K · Item 1A", w * 0.05, h - 12, none ? C.warm : C.muted);
      };
    },
    // synthkit: corr(hours, income) from the README: real 0.230, Faker-style 0.000, synthkit 0.183
    copula() {
      const sets = [["Real", 0.23], ["Faker-style", 0.0], ["synthkit", 0.183]].map(([name, rho], i) => {
        const r = RNG(91 + i); return { name, rho, pts: Array.from({ length: 150 }, () => { const a = gauss(r), b = gauss(r); return [a, rho * a + Math.sqrt(1 - rho * rho) * b, r()]; }) };
      });
      return (g, w, h, t, hover) => {
        const pw = w / 3, narrow = pw * 0.76 < 150;
        sets.forEach((s, i) => {
          const ox = i * pw + pw * 0.12, oy = h * 0.12, sw = pw * 0.76, sh = h * (narrow ? 0.5 : 0.62);
          g.strokeStyle = C.line; g.lineWidth = 1; g.strokeRect(ox, oy, sw, sh);
          const col = i === 1 ? C.faint : i === 2 ? C.signal : C.fg;
          g.fillStyle = col;
          s.pts.forEach(([a, b, ph]) => { const wob = hover ? 0 : Math.sin(t * 1.4 + ph * 6.28) * 1.2; g.fillRect(ox + sw / 2 + clamp(a / 3, -1, 1) * sw * 0.45 + wob, oy + sh / 2 - clamp(b / 3, -1, 1) * sh * 0.45, 1.8, 1.8); });
          if (s.rho) { g.strokeStyle = col; g.globalAlpha = 0.6; g.beginPath(); g.moveTo(ox + 4, oy + sh / 2 + s.rho * sh * 0.42); g.lineTo(ox + sw - 4, oy + sh / 2 - s.rho * sh * 0.42); g.stroke(); g.globalAlpha = 1; }
          label(g, s.name, ox, oy + sh + 16, col); // on narrow cards the r value drops to its own line so the labels never collide
          if (narrow) label(g, "r " + s.rho.toFixed(3), ox, oy + sh + 29, col); else label(g, "r " + s.rho.toFixed(3), ox + sw, oy + sh + 16, col, "right");
        });
        label(g, "corr(hours, income) · Adult Census", w * 0.04, h - 8);
      };
    },
    // AI Data Analyst: a histogram with IQR fences; a scan flags points outside them
    outliers() {
      const r = RNG(7), vals = Array.from({ length: 420 }, () => 50 + gauss(r) * 9).concat([92, 95, 99, 6, 4]);
      const sorted = [...vals].sort((a, b) => a - b), q = (p) => sorted[Math.floor(p * (sorted.length - 1))], q1 = q(0.25), q3 = q(0.75), iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
      const bins = new Array(26).fill(0); vals.forEach((v) => bins[clamp(Math.floor(v / 4), 0, 25)]++); const top = Math.max(...bins);
      return (g, w, h, t) => {
        const ox = w * 0.06, sw = w * 0.88, base = h * 0.78, bwid = sw / 26, scan = ((t * 0.22) % 1.2) * sw;
        bins.forEach((b, i) => { const bx = ox + i * bwid, v = i * 4; g.fillStyle = v < lo || v > hi ? TEAL(0.8) : INK(0.16); g.fillRect(bx + 1, base - (b / top) * h * 0.58, bwid - 2, (b / top) * h * 0.58); });
        g.setLineDash([3, 4]); g.strokeStyle = C.muted; [lo, hi].forEach((f) => { const fx = ox + (f / 104) * sw; g.beginPath(); g.moveTo(fx, h * 0.12); g.lineTo(fx, base); g.stroke(); }); g.setLineDash([]);
        vals.filter((v) => v < lo || v > hi).forEach((v, i) => { const px = ox + (v / 104) * sw, on = px < ox + scan; g.fillStyle = on ? C.warm : C.faint; g.beginPath(); g.arc(px, base + 12, on ? 3.2 + Math.sin(t * 5 + i) * 0.6 : 2.2, 0, 6.283); g.fill(); });
        g.fillStyle = TEAL(0.5); g.fillRect(ox + Math.min(scan, sw), h * 0.1, 1, base - h * 0.1);
        label(g, "1.5 × IQR", ox + (lo / 104) * sw + 6, h * 0.16); label(g, "flagged", w * 0.94, h - 10, C.warm, "right");
      };
    },
    // Computer-use automation: first a model feels its way through an old app, then the saved run replays alone
    replay() {
      const path = [[0.2, 0.22], [0.42, 0.22], [0.42, 0.22], [0.3, 0.52], [0.3, 0.52], [0.72, 0.52], [0.72, 0.52]];
      return (g, w, h, t) => {
        const phase = Math.floor(t / 5) % 2, k = (t % 5) / 5, discover = phase === 0;
        g.strokeStyle = C.line; g.lineWidth = 1; g.strokeRect(w * 0.08, h * 0.12, w * 0.84, h * 0.72);
        g.fillStyle = INK(0.07); g.fillRect(w * 0.12, h * 0.17, w * 0.36, h * 0.1);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { g.strokeStyle = C.line; g.strokeRect(w * 0.12 + j * w * 0.26, h * 0.36 + i * h * 0.1, w * 0.26, h * 0.1); }
        const seg = (path.length - 1) * clamp(k * 1.15, 0, 1), i = Math.min(path.length - 2, Math.floor(seg)), u = seg - i;
        let [cx, cy] = [lerp(path[i][0], path[i + 1][0], u), lerp(path[i][1], path[i + 1][1], u)];
        if (discover) { cx += Math.sin(t * 7) * 0.012; cy += Math.cos(t * 5) * 0.012; }
        if (seg > 4.6) { g.fillStyle = TEAL(0.14); g.fillRect(w * 0.64, h * 0.46, w * 0.26 - 4, h * 0.1); label(g, "balance read", w * 0.66, h * 0.525, C.signal); }
        if (seg > 1.2) label(g, "100001", w * 0.14, h * 0.235, C.fg);
        const px = cx * w, py = cy * h; g.fillStyle = discover ? C.jade : C.signal;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + 9, py + 10); g.lineTo(px + 4, py + 10); g.lineTo(px + 1, py + 15); g.closePath(); g.fill();
        if (discover) { for (let d = 0; d < 3; d++) { g.globalAlpha = 0.3 + 0.7 * ((Math.floor(t * 3) + d) % 3 === 0); g.beginPath(); g.arc(px + 18 + d * 6, py - 6, 1.6, 0, 6.283); g.fill(); } g.globalAlpha = 1; }
        label(g, discover ? "discover · model" : "replay · no model", w * 0.08, h - 8, discover ? C.jade : C.signal);
        label(g, "member lookup", w * 0.92, h - 8, C.muted, "right");
      };
    },
    // Urban bee behaviour: bees between blossoms, every flight leaves a fading line
    bees() {
      const trail = document.createElement("canvas"), tx = trail.getContext("2d"); let tw = 0, th = 0, fl = [], bs = [];
      return (g, w, h) => {
        if (tw !== g.canvas.width) { tw = trail.width = g.canvas.width; th = trail.height = g.canvas.height; const s = tw / w, r = RNG(15); tx.setTransform(s, 0, 0, s, 0, 0); fl = Array.from({ length: 8 }, () => [w * (0.1 + r() * 0.8), h * (0.15 + r() * 0.65)]); bs = Array.from({ length: 6 }, (_, i) => ({ x: fl[i][0], y: fl[i][1], vx: 0, vy: 0, to: (i + 3) % 8, wait: 0 })); }
        tx.globalCompositeOperation = "destination-out"; tx.fillStyle = "rgba(0,0,0,.012)"; tx.fillRect(0, 0, w, h); tx.globalCompositeOperation = "source-over";
        bs.forEach((b, i) => {
          const [fx, fy] = fl[b.to], dx = fx - b.x, dy = fy - b.y, d = Math.hypot(dx, dy);
          if (d < 6 && b.wait <= 0) b.wait = 30; if (b.wait > 0 && --b.wait <= 0) b.to = Math.floor(Math.random() * fl.length);
          b.vx = (b.vx + (dx / (d + 1)) * 0.18 + (Math.random() - 0.5) * 0.35) * 0.95; b.vy = (b.vy + (dy / (d + 1)) * 0.18 + (Math.random() - 0.5) * 0.35) * 0.95;
          const px = b.x, py = b.y; b.x += b.vx; b.y += b.vy;
          tx.strokeStyle = [C.signal, C.jade, C.fg][i % 3]; tx.globalAlpha = 0.35; tx.beginPath(); tx.moveTo(px, py); tx.lineTo(b.x, b.y); tx.stroke(); tx.globalAlpha = 1;
        });
        g.drawImage(trail, 0, 0, w, h);
        fl.forEach(([fx, fy]) => { g.fillStyle = "#FFC9B6"; for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(fx + Math.cos(a) * 4, fy + Math.sin(a) * 4, 3.2, 0, 6.283); g.fill(); } g.fillStyle = C.signal; g.beginPath(); g.arc(fx, fy, 2.4, 0, 6.283); g.fill(); });
        bs.forEach((b) => { g.fillStyle = C.fg; g.beginPath(); g.ellipse(b.x, b.y, 3.6, 2.4, Math.atan2(b.vy, b.vx), 0, 6.283); g.fill(); });
        label(g, "camcorder ethograms · 2022–2024", w * 0.04, h - 8);
      };
    },
    // Phenology: a year as a ring, flowering windows as arcs, a hand sweeping the days
    bloom() {
      const arcs = [[60, 110, C.fg], [75, 125, C.jade], [90, 140, "#BDB6C2"], [100, 165, C.signal], [120, 200, C.warm], [70, 230, C.muted]];
      return (g, w, h, t) => {
        const cx = w * 0.5, cy = h * 0.52, R = Math.min(w, h) * 0.4, day = reduce ? 120 : (t * 18) % 365, ang = (d) => (d / 365) * 6.2832 - Math.PI / 2;
        g.strokeStyle = C.line; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
        for (let m = 0; m < 12; m++) { const a = (m / 12) * 6.2832 - Math.PI / 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.lineTo(cx + Math.cos(a) * (R + 5), cy + Math.sin(a) * (R + 5)); g.stroke(); }
        arcs.forEach(([a0, a1, col], i) => { const rr = R * (0.36 + i * 0.1), on = day >= a0 && day <= a1; g.strokeStyle = col; g.globalAlpha = on ? 1 : 0.28; g.lineWidth = on ? 4 : 2.5; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, rr, ang(a0), ang(a1)); g.stroke(); });
        g.globalAlpha = 1; g.lineWidth = 1; g.strokeStyle = C.signal; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ang(day)) * R, cy + Math.sin(ang(day)) * R); g.stroke();
        label(g, "Jan", cx, cy - R - 10, C.muted, "center"); label(g, "flowering · insect activity · illustrative", w * 0.04, h - 8);
      };
    },
    // Practicum: an ROC curve drawing itself, with the threshold sliding along it
    roc() {
      const curve = (u) => 1 - Math.pow(1 - u, 3.2);
      return (g, w, h, t) => {
        const ox = w * 0.3, oy = h * 0.86, s = Math.min(w * 0.42, h * 0.72), k = reduce ? 1 : clamp((t % 6) / 3, 0, 1), th = reduce ? 0.3 : (Math.sin(t * 0.9) * 0.5 + 0.5) * 0.85 + 0.05;
        g.strokeStyle = C.line; g.strokeRect(ox, oy - s, s, s);
        g.setLineDash([3, 4]); g.strokeStyle = C.faint; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox + s, oy - s); g.stroke(); g.setLineDash([]);
        g.beginPath(); g.moveTo(ox, oy); for (let u = 0; u <= k; u += 0.01) g.lineTo(ox + u * s, oy - curve(u) * s);
        g.strokeStyle = C.signal; g.lineWidth = 1.6; g.stroke(); g.lineTo(ox + k * s, oy); g.closePath(); g.fillStyle = TEAL(0.08); g.fill(); g.lineWidth = 1;
        if (k >= 1) { const px = ox + th * s, py = oy - curve(th) * s; g.fillStyle = C.warm; g.beginPath(); g.arc(px, py, 4, 0, 6.283); g.fill(); label(g, "threshold", px + 8, py + 3, C.warm); }
        label(g, "false positive rate", ox + s, oy + 14, C.muted, "right"); label(g, "illustrative", w * 0.96, h - 8, C.faint, "right"); label(g, "true positive rate", ox, oy - s - 8);
      };
    },
    // Python notebooks: 911 calls as an hour-by-weekday heatmap, a sweep running through the hours
    heat() {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const val = (d, hr) => clamp(0.15 + 0.7 * Math.exp(-Math.pow((hr - 16) / 5, 2)) * (d < 5 ? 1 : 0.7) + 0.08 * Math.sin(d * 3 + hr), 0, 1);
      return (g, w, h, t) => {
        const ox = w * 0.12, oy = h * 0.14, cw = (w * 0.82) / 24, ch = (h * 0.66) / 7, sweep = (t * 4) % 24;
        for (let d = 0; d < 7; d++) { label(g, days[d], ox - 6, oy + d * ch + ch / 2 + 3, C.muted, "right"); for (let hr = 0; hr < 24; hr++) { const v = val(d, hr), boost = Math.max(0, 1 - Math.abs(hr - sweep) / 2) * 0.35; g.fillStyle = TEAL((0.06 + v * 0.7 + boost).toFixed(3)); g.fillRect(ox + hr * cw + 1, oy + d * ch + 1, cw - 2, ch - 2); } }
        label(g, "0h", ox, oy + 7 * ch + 14); label(g, "23h", ox + 24 * cw, oy + 7 * ch + 14, C.muted, "right"); label(g, "calls by hour · illustrative", w * 0.96, h - 8, C.faint, "right");
      };
    },
  };

  const figs = [];
  P.projects.forEach((p, i) => {
    const card = el("article", "exp card" + (i >= 4 ? " extra" : "")); card.style.setProperty("--i", i % 2); if (i >= 4) card.hidden = true;
    const cnv = el("canvas"); cnv.setAttribute("aria-hidden", "true");
    const body = el("div", "body"), meta = el("div", "meta mono"); meta.append(el("span", null, pad(i + 1)), el("span", null, p.year));
    const facts = el("div", "facts"); p.facts.forEach((f) => facts.appendChild(el("span", null, f)));
    // The detail behind the one-line summary opens in place; the whole card (outside its links) toggles it
    const tags = el("div", "tags mono"); p.tags.forEach((t) => tags.appendChild(el("span", null, t)));
    const more = el("div", "more"), inner = el("div"); more.id = "more-" + i; inner.append(el("p", null, p.more || ""), tags); more.appendChild(inner);
    const toggle = el("button", "toggle"); toggle.type = "button"; toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-controls", more.id);
    toggle.append(el("i", null, "+"), el("span", null, "Details"));
    const setOpen = (on) => { card.classList.toggle("open", on); toggle.setAttribute("aria-expanded", String(on)); $("span", toggle).textContent = on ? "Less" : "Details"; inner.inert = !on; };
    setOpen(false);
    toggle.addEventListener("click", () => setOpen(!card.classList.contains("open")));
    card.addEventListener("click", (e) => { if (!e.target.closest("a, button") && !getSelection().toString()) setOpen(!card.classList.contains("open")); });
    const links = el("div", "links mono"); p.links.forEach((l) => links.appendChild(external(el("a", null, l.label + " ↗"), l.href)));
    const foot = el("div", "foot"); foot.append(links, toggle);
    body.append(meta, el("h3", null, p.title), el("p", null, p.line), facts, more, foot);
    card.append(cnv, body); $("[data-projects]").appendChild(card); watch(card);
    const f = { cnv, g: cnv.getContext("2d"), draw: VIZ[p.viz](), on: false, hover: false, w: 0, h: 0 };
    card.addEventListener("pointerenter", () => (f.hover = true)); card.addEventListener("pointerleave", () => (f.hover = false));
    figs.push(f);
  });
  const more = $("[data-loadmore]"), extras = $$(".exp.extra");
  if (!extras.length) more.parentElement.remove();
  else { more.textContent = `Load more (${extras.length})`; more.addEventListener("click", () => { extras.forEach((c) => { c.hidden = false; }); more.parentElement.remove(); }); }
  const fio = new IntersectionObserver((es) => es.forEach((e) => { const f = figs.find((q) => q.cnv === e.target); if (f) f.on = e.isIntersecting; }), { rootMargin: "60px" });
  const ro = new ResizeObserver((es) => es.forEach((e) => { const f = figs.find((q) => q.cnv === e.target); if (!f) return; const d = Math.min(devicePixelRatio || 1, 2); f.w = f.cnv.clientWidth; f.h = f.cnv.clientHeight; f.cnv.width = Math.round(f.w * d); f.cnv.height = Math.round(f.h * d); f.g.setTransform(d, 0, 0, d, 0, 0); if (reduce) paint(f, 3); }));
  figs.forEach((f) => { fio.observe(f.cnv); ro.observe(f.cnv); });
  function paint(f, t) { const g = f.g, d = f.cnv.width / (f.w || 1); g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, f.w, f.h); f.draw(g, f.w, f.h, t, f.hover); }

  // ---------- Experience and education ----------
  P.experience.forEach((x, i) => {
    const li = el("li", "card"); li.style.setProperty("--i", i);
    const top = el("div", "top mono"); top.append(el("span", null, x.dates), el("span", "org", x.org));
    li.append(top, el("h3", null, x.role), el("p", null, x.line));
    $("[data-cv]").appendChild(li); watch(li);
  });
  (P.education || []).forEach((x) => {
    const li = el("li"), name = el("div"); name.append(el("strong", null, x.degree), el("div", "mono", x.school));
    li.append(name, el("span", "mono", x.date)); $("[data-edu]").appendChild(li);
  });
  P.skills.forEach((s) => $("[data-skills]").appendChild(el("li", null, s)));
  $$("section .head").forEach(watch);

  // ---------- Photographs: prints beside the intro, a reel between the work and contact, and a viewer ----------
  const photos = P.photos || [];
  const lb = $("dialog.lightbox"), lbImg = $(".lb-stage img", lb);
  let at = 0, swapT = 0;
  const where = (p) => [p.place, p.date].filter(Boolean).join(" · ");
  const alt = (p) => p.title + (p.place ? ", " + p.place : "");
  function show(k, dir = 0) {
    at = (k + photos.length) % photos.length; const p = photos[at];
    clearTimeout(swapT);
    const set = () => { lbImg.src = p.src; lbImg.alt = alt(p); lbImg.classList.remove("swap"); };
    if (dir && !reduce) { lbImg.classList.add("swap"); swapT = setTimeout(set, 140); } else set();
    $("[data-lb-title]", lb).textContent = p.title; $("[data-lb-where]", lb).textContent = where(p);
    $("[data-lb-count]", lb).textContent = `${pad(at + 1)} / ${pad(photos.length)}`;
    $("[data-lb-hud]", lb).replaceChildren(...[P.camera, ...(p.settings || "").split(" · ")].filter(Boolean).map((t) => el("span", null, t)));
    [1, -1].forEach((d) => { new Image().src = photos[(at + d + photos.length) % photos.length].src; }); // warm the neighbours
  }
  const open = (i) => { show(i); if (!lb.open) lb.showModal(); };
  if (photos.length) {

    // Prints: the first five, scattered; each drifts a little with the pointer at its own depth
    const tray = $("[data-prints]"), spots = [["2%", "8%", "-7deg", 0.5], ["48%", "1%", "5deg", 0.9], ["22%", "24%", "-2deg", 0.7], ["50%", "40%", "7deg", 1.1], ["0%", "43%", "4deg", 0.8]];
    const prints = photos.slice(0, 5).map((p, i) => {
      const b = el("button", "print"); b.type = "button"; b.setAttribute("aria-label", "Open photograph: " + alt(p));
      const [x, y, r, d] = spots[i]; b.style.cssText = `--x:${x};--y:${y};--r:${r}`; b.dataset.depth = d;
      const img = el("img"); img.src = p.src; img.alt = ""; img.decoding = "async";
      b.append(img, el("span", null, alt(p))); b.addEventListener("click", () => open(i)); tray.appendChild(b); return b;
    });
    tray.hidden = false;
    if (!reduce && matchMedia("(pointer: fine)").matches) $(".hero").addEventListener("pointermove", (e) => {
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      prints.forEach((b) => { const d = +b.dataset.depth; b.style.setProperty("--px", (dx * 24 * d).toFixed(1) + "px"); b.style.setProperty("--py", (dy * 18 * d).toFixed(1) + "px"); });
    });

    // Reel: every photograph twice in a row, so sliding by half loops without a seam. The copy is hidden from
    // screen readers and the keyboard. Hovering or focusing pauses it.
    const reel = $("[data-reel]"), track = $("[data-track]");
    $("[data-reel-label]").textContent = ["Off the clock", P.camera].filter(Boolean).join(" · ");
    [0, 1].forEach((copy) => photos.forEach((p, i) => {
      const b = el("button", "frame"); b.type = "button";
      const img = el("img"); img.src = p.src; img.alt = alt(p); img.loading = "lazy"; img.decoding = "async"; if (p.w) { img.width = p.w; img.height = p.h; }
      const cap = el("span", "cap"); cap.append(el("strong", null, p.title), el("small", null, where(p)));
      b.append(img, cap); b.addEventListener("click", () => open(i));
      if (copy) { b.tabIndex = -1; b.setAttribute("aria-hidden", "true"); } else b.setAttribute("aria-label", "Open photograph: " + alt(p));
      track.appendChild(b);
    }));
    reel.hidden = false;
    const pace = () => track.style.setProperty("--dur", Math.max(40, track.scrollWidth / 2 / 40).toFixed(0) + "s"); // about 40 px a second
    pace(); addEventListener("load", pace); addEventListener("resize", pace);

    // Viewer: arrows, keys and swipe; the modal dialog keeps focus inside, Escape closes it
    $("[data-close]", lb).addEventListener("click", () => lb.close());
    $("[data-prev]", lb).addEventListener("click", () => show(at - 1, -1));
    $("[data-next]", lb).addEventListener("click", () => show(at + 1, 1));
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { e.preventDefault(); show(at + 1, 1); } if (e.key === "ArrowLeft") { e.preventDefault(); show(at - 1, -1); } });
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-stage")) lb.close(); });
    let sx = null;
    const stage = $(".lb-stage", lb);
    stage.addEventListener("pointerdown", (e) => (sx = e.clientX));
    stage.addEventListener("pointercancel", () => (sx = null));
    stage.addEventListener("pointerup", (e) => { if (sx == null) return; const d = e.clientX - sx; sx = null; if (Math.abs(d) > 50) show(at + (d < 0 ? 1 : -1), d < 0 ? 1 : -1); });
  }

  // ---------- The name: each letter rises in, a word at a time so lines never break mid-word ----------
  let k = 0;
  const split = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return; if (/^\s+$/.test(part)) { frag.append(part); return; }
        const w = el("span", "w"); w.setAttribute("aria-hidden", "true");
        [...part].forEach((c) => { const ch = el("span", "ch", c); ch.style.setProperty("--k", k++); w.appendChild(ch); });
        frag.appendChild(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== "svg") split(n);
  });
  split($(".hero h1"));

  // ---------- Ribbons: the same words repeated twice over, so sliding by half loops without a seam ----------
  const RIB = { a: ["Data analyst", "Software engineer", "Pipelines", "APIs", "ML services", "SQL", "Python"], b: ["Messy data", "Sound decisions", "Retrieval with citations", "Synthetic data", "Bees and orchards", "Photographs"] };
  $$("[data-run]").forEach((run) => { const words = RIB[run.dataset.run]; for (let r = 0; r < 4; r++) words.forEach((t) => run.appendChild(el("span", null, t))); });

  // ---------- Titles: a giant outlined word behind each, and the title wipes up into view ----------
  const ghosts = [];
  $$("section h2").forEach((h) => {
    const n = $(".n", h), txt = [...h.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join("").trim();
    [...h.childNodes].forEach((c) => { if (c.nodeType === 3) c.remove(); });
    const t = el("span", "t"), inner = el("span", null, txt); t.appendChild(inner); h.append(t);
    const sec = h.closest("section"); if (!sec.classList.contains("contact")) { const g = el("div", "ghost", txt); g.setAttribute("aria-hidden", "true"); sec.prepend(g); ghosts.push(g); }
    if (n) h.prepend(n);
    if (!h.closest(".head")) watch(h); // titles outside a .head (contact) reveal on their own
  });

  // ---------- Numbers count up the first time they come into view (years are left alone) ----------
  const NUM = /\d[\d,]*(?:\.\d+)?/g;
  const fmt = (v, src) => { const dec = (src.split(".")[1] || "").length; const s2 = v.toFixed(dec); return src.includes(",") ? Number(s2).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s2; };
  const counters = $$(".facts span, .cv p").filter((n) => [...n.textContent.matchAll(NUM)].some((m) => !/^(19|20)\d\d$/.test(m[0])));
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const node = e.target, final = node.textContent, t0 = performance.now();
    (function step(now) {
      const q = Math.min(1, (now - t0) / 1400), ease = 1 - Math.pow(1 - q, 3);
      node.textContent = q < 1 ? final.replace(NUM, (m) => (/^(19|20)\d\d$/.test(m) ? m : fmt(parseFloat(m.replace(/,/g, "")) * ease, m))) : final;
      if (q < 1) requestAnimationFrame(step);
    })(t0);
  }), { threshold: 0.6 });
  if (!reduce) counters.forEach((n) => { n.classList.add("num"); cio.observe(n); });

  // ---------- The line above the name decodes itself on load ----------
  const eb = $(".eyebrow");
  if (!reduce && eb) {
    const final = eb.textContent, glyphs = "!<>-_/[]{}=+*^?#01✺", t0 = performance.now();
    eb.setAttribute("aria-label", final);
    (function step(now) {
      const q = Math.min(1, (now - t0) / 1300);
      eb.textContent = [...final].map((c, i) => (c === " " || i / final.length < q ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join("");
      if (q < 1) requestAnimationFrame(step); else eb.textContent = final;
    })(t0);
  }

  // ---------- Scrolling: the outlined words slide, and the bands lean with scroll speed ----------
  if (!reduce) {
    const leaners = $$(".ribbons, .reel .viewport"); let lastY = scrollY, lean = 0;
    (function tick() {
      const v = scrollY - lastY; lastY = scrollY; lean += (clamp(v * 0.12, -5, 5) - lean) * 0.12;
      leaners.forEach((n) => n.style.setProperty("--lean", lean.toFixed(2) + "deg"));
      ghosts.forEach((g) => { const r = g.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) g.style.transform = `translate3d(${(r.top * -0.25).toFixed(1)}px, 0, 0)`; });
      requestAnimationFrame(tick);
    })();
  }

  // ---------- Pointer extras, for a mouse only and never with reduced motion ----------
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    // A vermilion spotlight that follows the pointer across cards
    $$(".exp, .cv li").forEach((c) => {
      c.classList.add("spot");
      c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); });
    });
    // Buttons lean a little toward the pointer
    $$(".btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 10}px ${((e.clientY - r.top) / r.height - 0.5) * 8}px`; });
      b.addEventListener("pointerleave", () => (b.style.translate = ""));
    });
    // The ring trails the pointer and changes over links and photographs
    const ring = $(".cursor"); let tx = -100, ty = -100, cx = -100, cy = -100;
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY; ring.classList.add("on");
      const t = e.target.closest ? e.target : null;
      const photo = t && t.closest(".print, .frame"), link = t && t.closest("a, button, .exp");
      ring.classList.toggle("view", !!photo); ring.classList.toggle("link", !photo && !!link); ring.textContent = photo ? "View" : "";
    }, { passive: true });
    document.addEventListener("pointerleave", () => ring.classList.remove("on"));
    lb.addEventListener("close", () => ring.classList.remove("view"));
    (function follow() { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; ring.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`; requestAnimationFrame(follow); })();
  }

  // ---------- Scroll: progress, nav, header ----------
  const bar = $(".progress"), navs = $$("header nav a"), hdr = $("header");
  const sio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) navs.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => sio.observe(s));
  let ticking = false;
  function onScroll() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? (scrollY / max).toFixed(4) : 0})`;
    hdr.classList.toggle("scrolled", scrollY > 8);
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener("scroll", queue, { passive: true });
  onScroll();

  // ---------- One loop for everything that moves ----------
  if (!reduce) {
    let last = 0;
    (function loop(now) {
      const t = now / 1000;
      if (ringsOn && RW && now - last > 32) drawRings(t);
      if (now - last > 32) { last = now; figs.forEach((f) => { if (f.on && f.w) paint(f, t); }); } // figures at ~30 fps
      requestAnimationFrame(loop);
    })(performance.now());
  }
})();
