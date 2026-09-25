/**
 * Shared renderers for the round-3 sites. Each site styles the classes below and adds its own motion.
 *
 * currently  → .cur > .cur-item(.cur-label + .cur-text)
 * services   → .svc (.svc-n, .svc-title, .svc-desc, .svc-tags > li)
 * work       → li.w-item(.is-extra) > button.w-row(.w-num .w-title .w-kind .w-year .w-icon) + .w-panel > div > .w-body
 *              .w-body holds .w-sum, then .cs (.cs-col > .cs-h + .cs-p) for case studies, then .w-links (.w-tag, a.w-link)
 * experience → li.tl-item > .tl-date + .tl-main(.tl-role, .tl-org, ul.tl-points)
 * education  → li.ed-item > .ed-year + .ed-degree + .ed-school
 * talks      → li.tk-item > .tk-date + .tk-name + .tk-detail (+ a.tk-link)
 * goals      → li.gl-item > .gl-n + .gl-title + .gl-desc
 * tools      → .t-group > .t-name + ul.t-list > li
 * stats      → .st > b.st-v[data-count] + .st-l
 */
window.KIT = (function () {
  "use strict";
  const P = window.PORTFOLIO;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function link(label, href, cls) {
    const a = el("a", cls, label); a.href = href;
    if (/^https?:/.test(href) || /\.(pdf|jpe?g|png)$/i.test(href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    return a;
  }
  const pad = (n) => String(n).padStart(2, "0");

  function currently(c) {
    if (!c) return;
    P.currently.forEach((x) => {
      const it = el(x.href ? "a" : "span", "cur-item");
      if (x.href) { it.href = x.href; it.target = "_blank"; it.rel = "noopener noreferrer"; }
      it.append(el("span", "cur-label", x.label), el("span", "cur-text", x.text));
      c.appendChild(it);
    });
  }

  function services(c) {
    if (!c) return;
    P.services.forEach((s, i) => {
      const d = el("div", "svc"); d.style.setProperty("--i", i);
      const ul = el("ul", "svc-tags"); s.tags.forEach((t) => ul.appendChild(el("li", null, t)));
      d.append(el("span", "svc-n", pad(i + 1)), el("h3", "svc-title", s.title), el("p", "svc-desc", s.desc)); if (s.example) d.appendChild(el("p", "svc-ex", s.example)); d.appendChild(ul);
      c.appendChild(d);
    });
  }

  function work(list, moreBtn, opts = {}) {
    if (!list) return;
    const top = opts.top ?? 3;
    P.projects.forEach((p, i) => {
      const li = el("li", "w-item" + (i >= top ? " is-extra" : "") + (p.case ? " is-case" : ""));
      li.style.setProperty("--k", Math.max(0, i - top)); li.style.setProperty("--i", i);
      const row = el("button", "w-row"); row.type = "button"; row.setAttribute("aria-expanded", "false");
      row.append(el("span", "w-num", pad(i + 1)), el("span", "w-title", p.title), el("span", "w-kind", p.kind), el("span", "w-year", p.year));
      const icon = el("span", "w-icon"); icon.setAttribute("aria-hidden", "true"); row.appendChild(icon);
      const panel = el("div", "w-panel"); panel.setAttribute("role", "region"); panel.setAttribute("aria-label", p.title);
      const inner = el("div"), body = el("div", "w-body");
      body.appendChild(el("p", "w-sum", p.summary));
      if (p.case) {
        const cs = el("div", "cs");
        [["Problem", p.case.problem], ["Approach", p.case.approach], ["Result", p.case.result]].forEach(([h, t]) => {
          const col = el("div", "cs-col"); col.append(el("h4", "cs-h", h), el("p", "cs-p", t)); cs.appendChild(col);
        });
        body.appendChild(cs);
      }
      const links = el("div", "w-links");
      p.tags.forEach((t) => links.appendChild(el("span", "w-tag", t)));
      p.links.forEach((l) => links.appendChild(link(l.label + " ↗", l.href, "w-link")));
      body.appendChild(links);
      inner.appendChild(body); panel.appendChild(inner); li.append(row, panel);
      row.addEventListener("click", () => {
        const open = li.classList.toggle("is-open");
        row.setAttribute("aria-expanded", String(open));
        opts.onToggle && opts.onToggle(li, open, p);
      });
      opts.decorate && opts.decorate(li, p, i);
      list.appendChild(li);
    });
    if (opts.openFirst) list.firstChild.querySelector(".w-row").click();
    if (moreBtn) {
      const label = $("[data-more-label]", moreBtn) || moreBtn;
      const rest = P.projects.length - top;
      const set = (open) => (label.textContent = open ? "Show fewer" : `Show ${rest} more projects`);
      set(false); moreBtn.setAttribute("aria-expanded", "false");
      moreBtn.addEventListener("click", () => {
        const open = list.classList.toggle("show-all");
        moreBtn.setAttribute("aria-expanded", String(open)); set(open);
        if (!open) list.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        opts.onMore && opts.onMore(open);
      });
    }
  }

  function experience(c) {
    if (!c) return;
    P.experience.forEach((x, i) => {
      const li = el("li", "tl-item"); li.style.setProperty("--i", i);
      const main = el("div", "tl-main"), ul = el("ul", "tl-points");
      x.points.forEach((p) => ul.appendChild(el("li", null, p)));
      main.append(el("h3", "tl-role", x.role), el("p", "tl-org", x.org), ul);
      li.append(el("span", "tl-date", x.dates), main); c.appendChild(li);
    });
  }
  function education(c) {
    if (!c) return;
    P.education.forEach((x, i) => { const li = el("li", "ed-item"); li.style.setProperty("--i", i); li.append(el("span", "ed-year", x.year), el("h3", "ed-degree", x.degree), el("p", "ed-school", x.school)); c.appendChild(li); });
  }
  function talks(c) {
    if (!c) return;
    P.talks.forEach((x, i) => {
      const li = el("li", "tk-item"); li.style.setProperty("--i", i);
      li.append(el("span", "tk-date", x.date), el("h3", "tk-name", x.name), el("p", "tk-detail", x.detail));
      if (x.href) li.appendChild(link("View ↗", x.href, "tk-link"));
      c.appendChild(li);
    });
  }
  function goals(c) {
    if (!c) return;
    P.goals.forEach((g, i) => { const li = el("li", "gl-item"); li.style.setProperty("--i", i); li.append(el("span", "gl-n", pad(i + 1)), el("h3", "gl-title", g.title), el("p", "gl-desc", g.desc)); c.appendChild(li); });
  }
  function tools(c) {
    if (!c) return;
    P.tools.forEach((g, i) => {
      const d = el("div", "t-group"); d.style.setProperty("--i", i);
      const ul = el("ul", "t-list"); g.items.forEach((t) => ul.appendChild(el("li", null, t)));
      d.append(el("h3", "t-name", g.group), ul); c.appendChild(d);
    });
  }
  function stats(c) {
    if (!c) return;
    P.stats.forEach((s, i) => {
      const d = el("div", "st"); d.style.setProperty("--i", i);
      const b = el("b", "st-v", "0"); b.dataset.count = s.value; b.dataset.suffix = s.suffix || "";
      d.append(b, el("span", "st-l", s.label)); c.appendChild(d);
    });
  }
  function countUp(b, dur = 1600) {
    const n = +b.dataset.count, suf = b.dataset.suffix || "";
    const fmt = (v) => v.toLocaleString("en-US") + suf;
    if (reduce) { b.textContent = fmt(n); return; }
    const t0 = performance.now();
    (function tick(now) { const k = Math.min(1, (now - t0) / dur); b.textContent = fmt(Math.round(n * (1 - Math.pow(1 - k, 4)))); if (k < 1) requestAnimationFrame(tick); })(t0);
  }

  /** Fill all data-* hooks and render any standard containers present on the page. */
  function fill(root = document) {
    $$("[data-email]", root).forEach((a) => { a.href = "mailto:" + P.email; if (!a.textContent.trim()) a.textContent = P.email; });
    $$("[data-copy]", root).forEach((b) => {
      const idle = b.textContent;
      b.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(P.email); b.textContent = "Copied ✓"; } catch { b.textContent = "Copy failed"; }
        b.classList.add("is-copied"); setTimeout(() => { b.textContent = idle; b.classList.remove("is-copied"); }, 1800);
      });
    });
    $$("[data-social]", root).forEach((c) => P.social.forEach((s) => c.appendChild(link(s.label + (c.dataset.social === "plain" ? "" : " ↗"), s.href))));
    const text = { year: new Date().getFullYear(), summary: P.summary, headline: P.headline, first: P.first, last: P.last, name: P.name, title: P.title };
    Object.entries(text).forEach(([k, v]) => $$(`[data-${k}]`, root).forEach((e) => (e.textContent = v)));
    currently($("[data-currently]", root)); services($("[data-services]", root)); experience($("[data-experience]", root));
    education($("[data-education]", root)); talks($("[data-talks]", root)); goals($("[data-goals]", root));
    tools($("[data-tools]", root)); stats($("[data-stats]", root));
  }

  /** .is-in on [data-reveal] when visible; counts up any [data-count] inside. */
  function reveal(selector = "[data-reveal]", threshold = 0.15) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      $$("[data-count]", e.target).forEach((b) => countUp(b));
      if (e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    }), { threshold });
    $$(selector).forEach((n) => io.observe(n));
  }

  function split(node, mode = "chars") {
    if (!node) return node;
    const text = node.textContent; node.setAttribute("aria-label", text); node.textContent = "";
    const parts = mode === "words" ? text.split(/(\s+)/) : [...text];
    let i = 0;
    parts.forEach((part) => {
      if (/^\s+$/.test(part)) { node.appendChild(document.createTextNode(part)); return; }
      const s = el("span", mode === "words" ? "wd" : "ch", part);
      s.setAttribute("aria-hidden", "true"); s.style.setProperty("--i", i++); node.appendChild(s);
    });
    return node;
  }

  /** Buttons/links with .magnetic drift toward the cursor. */
  function magnetic(sel = ".magnetic", strength = 0.35) {
    $$(sel).forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * strength}px ${(e.clientY - r.top - r.height / 2) * strength}px`; });
      b.addEventListener("pointerleave", () => (b.style.translate = ""));
    });
  }

  /** Scramble text into place (used on hover or reveal). */
  function scramble(node, glyphs = "!<>-_\\/[]{}=+*^?#") {
    if (reduce) return;
    const final = node.dataset.final || (node.dataset.final = node.textContent);
    let f = 0; clearInterval(node._sc);
    node._sc = setInterval(() => {
      f++;
      node.textContent = [...final].map((c, i) => (c === " " || i < f / 1.5) ? c : glyphs[(Math.random() * glyphs.length) | 0]).join("");
      if (f / 1.5 >= final.length) { node.textContent = final; clearInterval(node._sc); }
    }, 24);
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  return { P, reduce, $, $$, el, link, work, fill, reveal, split, magnetic, scramble, countUp, clamp, lerp };
})();
