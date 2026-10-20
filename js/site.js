/**
 * Renders js/content.js and runs the camera: a viewfinder intro (focus box, live exposure readouts, shutter on
 * click), a frame counter for the sections, scroll reveals, and a film strip whose photographs develop as they
 * reach the middle. Everything settles to a still page for reduced motion.
 */
(() => {
  "use strict";
  const P = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const external = (a, href) => { a.href = href; if (/^https?:|\.(pdf|jpe?g|png|webp)$/i.test(href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } return a; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wide = () => innerWidth > 760;

  // ---------- Content ----------
  const text = { name: P.name, title: P.title, headline: P.headline, year: new Date().getFullYear(), count: `${pad(P.projects.length)} frames` };
  Object.entries(text).forEach(([k, v]) => $$(`[data-${k}]`).forEach((n) => (n.textContent = v)));
  { const [first, ...rest] = P.name.split(" "); const h = $("[data-name-display]"); h.append(first + " "); h.appendChild(el("em", null, rest.join(" "))); }
  $$("[data-github]").forEach((a) => (a.href = P.github));
  $$("[data-email]").forEach((a) => { a.href = "mailto:" + P.email; a.textContent = P.email; });
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    const idle = b.textContent;
    try { await navigator.clipboard.writeText(P.email); b.textContent = "Copied"; } catch { b.textContent = P.email; }
    setTimeout(() => (b.textContent = idle), 1600);
  }));
  $$("[data-social]").forEach((c) => P.social.forEach((s) => { c.appendChild(external(el("a", null, s.label + " ↗"), s.href)); c.append(" "); }));
  P.status.forEach((s) => { const span = el("span", null, s.label + " "); if (s.href) span.appendChild(external(el("a", null, s.text), s.href)); else span.append(s.text); $("[data-status]").appendChild(span); });

  // Reveal on scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  const watch = (n) => { n.classList.add("reveal"); if (reduce) n.classList.add("in"); else io.observe(n); };

  // Contact sheet rows, numbered like frames on a roll: 01A, 02A, ...
  let frame = 0;
  function sheetRow(list, { title, summary, tags, href, when }) {
    frame++;
    const li = el("li"), a = external(el("a", "row"), href);
    li.style.setProperty("--i", frame % 6);
    const fr = el("span", "fr mono", pad(frame) + "A"); fr.appendChild(el("small", null, when));
    const tg = el("div", "tags mono"); tags.filter(Boolean).forEach((t) => tg.appendChild(el("span", null, t)));
    a.append(fr, el("h3", null, title), el("span", "go mono", "↗"));
    if (summary) a.appendChild(el("p", null, summary));
    if (tg.children.length) a.appendChild(tg);
    li.appendChild(a); list.appendChild(li); watch(li);
  }
  P.projects.forEach((p) => sheetRow($("[data-projects]"), { title: p.title, summary: p.summary, tags: p.tags, href: p.href, when: p.year }));

  // Latest on GitHub, from data/github.json (written daily by .github/workflows/sync-github.yml)
  const date = (d, o) => new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { ...o, timeZone: "UTC" });
  fetch("data/github.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).then((g) => {
    if (!g || !g.repos || !g.repos.length) return;
    const shown = new Set(P.projects.map((p) => p.href.toLowerCase().replace(/\/$/, "")));
    const latest = g.repos.filter((r) => !shown.has(r.url.toLowerCase())).slice(0, 5);
    if (!latest.length) return;
    $("[data-latest]").hidden = false;
    latest.forEach((r) => sheetRow($("[data-repos]"), { title: r.name, summary: r.description, tags: [r.language, ...r.topics.slice(0, 3)], href: r.url, when: date(r.pushed, { month: "short", year: "2-digit" }) }));
    $("[data-synced]").textContent = "Synced " + date(g.synced, { month: "short", day: "numeric", year: "numeric" });
  }).catch(() => {});

  // Experience and education as exposure-data cards
  [...P.experience.map((x) => ({ ...x, kind: "Work" })), ...P.education.map((x) => ({ ...x, kind: "Study" }))].forEach((x, i) => {
    const c = el("article"); c.style.setProperty("--i", i);
    const top = el("div", "top mono"); top.append(el("span", null, x.dates), el("span", null, x.kind));
    c.append(top, el("h3", null, x.role), el("span", "org mono", x.org));
    if (x.line) c.appendChild(el("p", null, x.line));
    $("[data-experience]").appendChild(c); watch(c);
  });
  P.skills.forEach((s) => $("[data-skills]").appendChild(el("li", null, s)));
  $$("section:not(.vf) .head").forEach(watch);

  // ---------- Viewfinder ----------
  const vf = $(".vf"), focus = $(".focus", vf), shutter = $(".shutter", vf), needle = $(".meter-needle", vf);
  const AP = ["1.4", "2", "2.8", "4", "5.6", "8", "11", "16"], SH = ["1/4000", "1/2000", "1/1000", "1/500", "1/250", "1/125", "1/60", "1/30"], ISO = [100, 200, 400, 800, 1600, 3200];
  const out = { ap: $("[data-ap]"), sh: $("[data-sh]"), iso: $("[data-iso]"), shots: $("[data-shots]") };
  let fx = innerWidth / 2, fy = innerHeight / 2, tx = fx, ty = fy, still = 0, raf = 0, shots = 36;
  const set = (n, v) => { if (n.textContent !== v) n.textContent = v; };
  function aim() {
    fx += (tx - fx) * 0.22; fy += (ty - fy) * 0.22;
    focus.style.transform = `translate3d(${fx.toFixed(1)}px, ${fy.toFixed(1)}px, 0)`;
    raf = Math.abs(tx - fx) + Math.abs(ty - fy) < 0.5 ? 0 : requestAnimationFrame(aim);
  }
  if (!reduce) {
    vf.addEventListener("pointermove", (e) => {
      const r = vf.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
      const u = clamp(tx / r.width, 0, 1), v = clamp(ty / r.height, 0, 1);
      set(out.ap, "ƒ/" + AP[Math.round(u * (AP.length - 1))]); set(out.sh, SH[Math.round(v * (SH.length - 1))]); set(out.iso, String(ISO[Math.round(((u + v) / 2) * (ISO.length - 1))]));
      needle.style.left = (u * 100).toFixed(1) + "%";
      focus.classList.remove("lock"); clearTimeout(still); still = setTimeout(() => focus.classList.add("lock"), 380);
      if (!raf) raf = requestAnimationFrame(aim);
    }, { passive: true });
    vf.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      shutter.classList.remove("fire"); void shutter.offsetWidth; shutter.classList.add("fire");
      shots = shots > 1 ? shots - 1 : 36; set(out.shots, pad(shots, 3));
    });
  }

  // ---------- Film strip ----------
  const photos = P.photos || [];
  const film = $("#photos"), strip = $("[data-strip]"), pin = $(".strip-pin"), lb = $("dialog.lightbox");
  if (photos.length) {
    film.hidden = false; $("[data-photos-link]").hidden = false;
    $("[data-photo-count]").textContent = `${pad(photos.length)} exposures`;
    photos.forEach((p, i) => {
      const f = el("figure", "shot"), b = el("button"), img = el("img");
      b.type = "button"; b.setAttribute("aria-label", "Open " + p.title);
      img.src = p.src; img.alt = p.title; img.loading = "lazy"; img.decoding = "async";
      img.addEventListener("load", layoutStrip);
      b.appendChild(img);
      const cap = el("figcaption", "mono"); cap.append(el("span", "t", p.title), el("span", null, [p.settings, p.year].filter(Boolean).join(" · ") || pad(i + 1) + "A"));
      f.append(b, cap); strip.appendChild(f);
      b.addEventListener("click", () => {
        const im = $("img", lb); im.src = p.src; im.alt = p.title;
        $("[data-lb-title]", lb).textContent = p.title; $("[data-lb-meta]", lb).textContent = [p.settings, p.year].filter(Boolean).join(" · ");
        lb.showModal();
      });
    });
    $("[data-close]", lb).addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  }
  let travel = 0;
  const pinned = () => photos.length > 0 && wide() && !reduce;
  function layoutStrip() {
    if (!photos.length) return;
    if (!pinned()) { pin.style.height = ""; strip.style.transform = ""; return; }
    travel = Math.max(0, strip.scrollWidth - innerWidth);
    pin.style.height = innerHeight + travel + "px";
  }
  addEventListener("resize", layoutStrip); addEventListener("load", layoutStrip); layoutStrip();

  // ---------- Frame counter, nav and progress ----------
  const frames = () => $$("[data-frame]").filter((s) => !s.hidden);
  const counter = $(".frame-count"), bar = $(".progress"), links = $$("header nav a");
  const fio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const all = frames(), i = all.indexOf(e.target); counter.textContent = `FR ${pad(i + 1)}/${pad(all.length)}`;
    links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  frames().forEach((s) => fio.observe(s));

  // One scroll handler: progress bar, strip travel, developing frames
  let ticking = false;
  function onScroll() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? (scrollY / max).toFixed(4) : 0})`;
    if (!photos.length) return;
    if (pinned()) {
      const r = pin.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
      strip.style.transform = `translate3d(${(-p * travel).toFixed(1)}px, 0, 0)`;
    }
    $$(".shot:not(.dev)", strip).forEach((s) => {
      const b = s.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      if (reduce || (cy > 0 && cy < innerHeight && Math.abs(cx - innerWidth / 2) < innerWidth * (wide() ? 0.32 : 0.45))) s.classList.add("dev");
    });
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener("scroll", queue, { passive: true });
  $(".strip-stage").addEventListener("scroll", queue, { passive: true });
  onScroll();
})();
