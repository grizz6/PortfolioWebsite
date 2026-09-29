/**
 * Selected reports, CSS 3D variant: the same dealt pages, built from real HTML links on a curved wall.
 * No WebGL and no three.js download. Text stays crisp and selectable, and each page is a real, focusable link.
 * Only transforms and one custom property change per frame, so the compositor does the work.
 */
(() => {
  const { $, clamp, lerp, sstep, damp, reduce, M, scene, DOCS, coverArt, idle, deal } = MO;
  const sec = $("#reports"), s = $("#reports .rp-s"), N = DOCS.length;
  const old = $("canvas", s); if (old) old.remove();
  const wall = document.createElement("div"); wall.className = "rp-wall";
  const ring = document.createElement("div"); ring.className = "rp-ring"; wall.appendChild(ring); s.prepend(wall);
  const pages = DOCS.map((d, i) => {
    const a = document.createElement("a"); a.className = "rp-page"; a.href = d.href; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.innerHTML = `<canvas width="390" height="320" aria-hidden="true"></canvas><span class="k"></span><h3></h3><p class="s"></p><span class="f"><span>Grishma Gajurel</span><span>${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}</span></span>`;
    $(".k", a).textContent = d.kind; $("h3", a).textContent = d.title; $(".s", a).textContent = d.sub;
    a.addEventListener("focus", () => go(i));
    ring.appendChild(a); return { a, i, lift: 0, lean: 0, last: "" };
  });
  // Paint covers in idle time, at half size: the page is small, so nobody can tell
  let ci = 0; const paint = () => { if (ci >= N) return; const c = $("canvas", pages[ci].a); c.getContext("2d").drawImage(coverArt(DOCS[ci], 780, 640), 0, 0, 390, 320); ci++; idle(paint); }; idle(paint);
  let hover = -1; pages.forEach((q) => { q.a.addEventListener("pointerenter", () => (hover = q.i)); q.a.addEventListener("pointerleave", () => hover === q.i && (hover = -1)); });


  // Drag to deal
  let U = 140;
  const { st, go, drag, caption } = deal(sec, wall, () => U * 2.2);
  wall.addEventListener("click", (e) => { if (drag.moved > 6) e.preventDefault(); }, true);
  const measure = () => (U = pages[0].a.offsetWidth / 2.1); new ResizeObserver(measure).observe(pages[0].a); measure();

  let rx = 0, ry = 0;
  scene(sec, (t, dt) => {
    const p = st.update(dt), vel = clamp(st.v * 2.2, -1.2, 1.2);
    const fan = reduce ? 1 : sstep(0.02, 0.24, p), act = sstep(0.24, 0.96, p) * (N - 1);
    rx = damp(rx, M.ny, 0.08, dt); ry = damp(ry, M.nx, 0.08, dt);
    ring.style.transform = `rotateX(${(-0.08 + rx * 0.05).toFixed(4)}rad) rotateY(${(ry * 0.08).toFixed(4)}rad)`;
    pages.forEach((q) => {
      const i = q.i, o = i - act, ao = Math.abs(o), so = Math.sign(o);
      const fx = o * 1.05 + so * Math.min(1, ao) * 0.85, fz = -ao * 0.85 + (ao < 0.5 ? 0.9 * (1 - ao * 2) : 0), fry = -clamp(o, -1, 1) * 0.95;
      q.lift = damp(q.lift, hover === i ? 1 : 0, 0.14, dt);
      q.lean = reduce ? 0 : damp(q.lean, -vel * (1 - clamp(ao / 2.5, 0, 0.7)), 0.1, dt);
      const X = lerp(0.03 * i, fx, fan) * U, Y = -(lerp(-0.02 * i, 0, fan) + (reduce ? 0 : Math.sin(t * 0.9 + i) * 0.04) + q.lift * 0.15) * U, Z = (lerp(-i * 0.035, fz, fan) + q.lift * 0.35) * U;
      const ry2 = lerp(-0.2, fry, fan) + q.lean * 0.18, rz = -lerp((i - 2.5) * 0.05, 0, fan);
      const tf = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, ${Z.toFixed(1)}px) rotateY(${ry2.toFixed(4)}rad) rotateZ(${rz.toFixed(4)}rad) skewY(${(q.lean * 2).toFixed(2)}deg)`;
      if (tf !== q.last) { q.last = tf; q.a.style.transform = tf; q.a.style.setProperty("--shade", (Math.min(1, ao) * 0.12 + Math.abs(q.lean) * 0.08).toFixed(3)); }
    });
    const ai = clamp(Math.round(act), 0, N - 1);
    if (fan > 0.5) caption(ai);
  });
})();
