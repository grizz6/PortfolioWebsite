/**
 * Shared renderers. The page styles these classes and adds its own motion.
 *
 * currently → .cur > .cur-item(.cur-label + .cur-text)
 * work      → li.w-item(.is-extra) > button.w-row(.w-num .w-title .w-kind .w-year .w-icon) + .w-panel > div > .w-body
 *             .w-body holds .w-sum, then .cs (.cs-col > .cs-h + .cs-p) for case studies, then .w-links (.w-tag, a.w-link)
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
      if (p.docs && p.docs.length) {
        const docs = el("div", "w-docs");
        p.docs.forEach((d) => { const a = link("", d.href, "w-doc"); const c = el("canvas"); c.width = 390; c.height = 260; c.setAttribute("aria-hidden", "true"); c._doc = d; a.append(c, el("span", "w-doc-k", d.kind), el("span", "w-doc-t", d.title + " ↗")); docs.appendChild(a); });
        body.appendChild(docs);
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
    const text = { year: new Date().getFullYear(), headline: P.headline, first: P.first, last: P.last, name: P.name, title: P.title };
    Object.entries(text).forEach(([k, v]) => $$(`[data-${k}]`, root).forEach((e) => (e.textContent = v)));
    currently($("[data-currently]", root));
  }

  /** .is-in on [data-reveal] when visible. */
  function reveal(selector = "[data-reveal]", threshold = 0.15) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    }), { threshold });
    $$(selector).forEach((n) => io.observe(n));
  }

  /** Buttons/links with .magnetic drift toward the cursor. */
  function magnetic(sel = ".magnetic", strength = 0.35) {
    $$(sel).forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * strength}px ${(e.clientY - r.top - r.height / 2) * strength}px`; });
      b.addEventListener("pointerleave", () => (b.style.translate = ""));
    });
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  return { P, reduce, $, $$, el, link, work, fill, reveal, magnetic, clamp, lerp };
})();
