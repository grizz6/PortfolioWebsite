/**
 * Renders js/content.js into the page, plus one quiet motion: a dot field behind the intro that brightens
 * around the cursor. It only runs while the intro is on screen and stays still for reduced motion.
 */
(() => {
  "use strict";
  const P = window.PORTFOLIO;
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const external = (a, href) => { a.href = href; if (/^https?:|\.(pdf|jpe?g|png)$/i.test(href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } return a; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Text hooks
  const text = { name: P.name, title: P.title, headline: P.headline, year: new Date().getFullYear(), count: `${String(P.projects.length).padStart(2, "0")} projects` };
  Object.entries(text).forEach(([k, v]) => $$(`[data-${k}]`).forEach((n) => (n.textContent = v)));
  $$("[data-github]").forEach((a) => (a.href = P.github));
  $$("[data-email]").forEach((a) => { a.href = "mailto:" + P.email; a.textContent = P.email; });
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    const idle = b.textContent;
    try { await navigator.clipboard.writeText(P.email); b.textContent = "Copied"; } catch { b.textContent = P.email; }
    setTimeout(() => (b.textContent = idle), 1600);
  }));
  $$("[data-social]").forEach((c) => P.social.forEach((s) => { const a = external(el("a", null, s.label + " ↗"), s.href); c.appendChild(a); c.append(" "); }));

  // Status line
  P.status.forEach((s) => { const span = el("span", null, s.label + " "); if (s.href) span.appendChild(external(el("a", null, s.text), s.href)); else span.append(s.text); $("[data-status]").appendChild(span); });

  // Projects: each row is the link
  P.projects.forEach((p) => {
    const li = el("li"), a = external(el("a", "row"), p.href);
    const tags = el("div", "tags mono"); p.tags.forEach((t) => tags.appendChild(el("span", null, t)));
    a.append(el("span", "mono", p.year), el("h3", null, p.title), el("span", "go mono", "↗"), el("p", null, p.summary), tags);
    li.appendChild(a); $("[data-projects]").appendChild(li);
  });

  // Experience and education
  const rows = (list, sel) => list.forEach((x) => {
    const li = el("li", "row"); li.append(el("span", "mono", x.dates), el("h3", null, x.role), el("span", "mono", x.org));
    if (x.line) li.appendChild(el("p", null, x.line));
    $(sel).appendChild(li);
  });
  rows(P.experience, "[data-experience]"); rows(P.education, "[data-education]");
  P.skills.forEach((s) => $("[data-skills]").appendChild(el("li", null, s)));

  // Dot field
  const intro = $(".intro"), cv = $(".intro canvas"), x = cv.getContext("2d");
  let W = 0, H = 0, D = 1, dots = [], on = true, mx = -9999, my = -9999, raf = 0;
  const GAP = 26;
  function size() {
    D = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * D; cv.height = H * D; x.setTransform(D, 0, 0, D, 0, 0);
    dots = []; for (let y = GAP / 2; y < H; y += GAP) for (let xx = GAP / 2; xx < W; xx += GAP) dots.push([xx, y, 0]);
    draw();
  }
  function draw() {
    x.clearRect(0, 0, W, H);
    let busy = false;
    for (const d of dots) {
      const t = Math.max(0, 1 - Math.hypot(d[0] - mx, d[1] - my) / 160);
      d[2] += (t - d[2]) * 0.12; if (Math.abs(t - d[2]) > 0.01) busy = true;
      const fade = 1 - d[1] / H; // dots thin out towards the text
      x.fillStyle = d[2] > 0.02 ? `rgba(183,199,154,${(0.15 + d[2] * 0.75) * (0.4 + fade * 0.6)})` : `rgba(140,146,134,${0.16 * (0.3 + fade * 0.7)})`;
      const r = 0.8 + d[2] * 1.6; x.fillRect(d[0] - r, d[1] - r, r * 2, r * 2);
    }
    raf = busy && on ? requestAnimationFrame(draw) : 0;
  }
  const kick = () => { if (!raf && !reduce && on) raf = requestAnimationFrame(draw); };
  new ResizeObserver(size).observe(cv);
  new IntersectionObserver(([e]) => { on = e.isIntersecting; kick(); }).observe(intro);
  if (!reduce) {
    addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; kick(); }, { passive: true });
    document.addEventListener("pointerleave", () => { mx = my = -9999; kick(); });
  }
})();
