import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector<HTMLElement>("[data-desk]");
const stage = document.querySelector<HTMLElement>("[data-stage]");

if (section && stage) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = matchMedia("(max-width: 640px)");

  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const ease = (t: number) => t * t * (3 - 2 * t);
  const nums = (s = "") => s.split(",").map(Number) as [number, number, number];

  // ---------- objects ----------
  type Obj = {
    el: HTMLElement;
    i: number;
    sc: [number, number, number];
    pi: [number, number, number];
    spots: { sc: [number, number, number]; pi: [number, number, number]; psc: [number, number, number]; ppi: [number, number, number] };
    w: number;
    h: number;
    hidden: boolean;
    bx: number; // base position from the scroll progress
    by: number;
    tx: number; // offset added by dragging and throwing
    ty: number;
    tr: number;
    vx: number;
    vy: number;
    vr: number;
  };

  const objs: Obj[] = [...stage.querySelectorAll<HTMLElement>("[data-obj]")].map((el, i) => ({
    el,
    i,
    sc: nums(el.dataset.scatter),
    pi: nums(el.dataset.pile),
    spots: {
      sc: nums(el.dataset.scatter),
      pi: nums(el.dataset.pile),
      psc: nums(el.dataset.phoneScatter),
      ppi: nums(el.dataset.phonePile),
    },
    w: 0,
    h: 0,
    hidden: false,
    bx: 0,
    by: 0,
    tx: 0,
    ty: 0,
    tr: 0,
    vx: 0,
    vy: 0,
    vr: 0,
  }));

  const headline = stage.querySelector<HTMLElement>("[data-headline]")!;
  const slot = stage.querySelector<HTMLElement>("[data-slot]")!;
  const words = [...stage.querySelectorAll<HTMLElement>("[data-word]")];
  const hints = [...stage.querySelectorAll<HTMLElement>("[data-hint]")];
  const tag = stage.querySelector<HTMLElement>("[data-tag]")!;

  let W = 0;
  let H = 0;
  let wordWidths: number[] = [];
  const state = { p: reduce ? 1 : 0 };
  let lastP = state.p;

  function measure() {
    W = stage!.clientWidth;
    H = stage!.clientHeight;
    for (const o of objs) {
      o.sc = phone.matches ? o.spots.psc : o.spots.sc;
      o.pi = phone.matches ? o.spots.ppi : o.spots.pi;
      o.hidden = getComputedStyle(o.el).display === "none";
      o.w = o.el.offsetWidth;
      o.h = o.el.offsetHeight;
    }
    wordWidths = words.map((w) => w.offsetWidth);
  }

  // Which headline word shows: a float from 0 (question) to 3 (chart), changing at three points in the scroll
  const swaps = [0.2, 0.45, 0.7];
  const wordAt = (p: number) => swaps.reduce((f, c) => f + ease(clamp((p - c + 0.08) / 0.16)), 0);

  let hovered: Obj | null = null;

  function render() {
    const p = state.p;
    for (const o of objs) {
      if (o.hidden) continue;
      const q = ease(clamp((p - o.i * 0.012) / 0.85));
      // keep each object mostly on the stage, whatever the screen shape
      o.bx = clamp((lerp(o.sc[0], o.pi[0], q) / 100) * W, o.w * 0.35, W - o.w * 0.35);
      o.by = clamp((lerp(o.sc[1], o.pi[1], q) / 100) * H, o.h * 0.35, H - o.h * 0.35);
      const r = lerp(o.sc[2], o.pi[2], q) + o.tr;
      o.el.style.transform = `translate3d(${(o.bx + o.tx - o.w / 2).toFixed(1)}px, ${(o.by + o.ty - o.h / 2).toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg)`;
    }

    const hp = ease(p);
    headline.style.transform = `translate3d(-50%, ${(lerp(0.42, 0.24, hp) * H).toFixed(1)}px, 0) translateY(-50%) scale(${(1 + 0.12 * hp).toFixed(4)})`;

    const f = reduce ? 0 : wordAt(p);
    words.forEach((w, i) => {
      const d = i - f;
      w.style.transform = `translateY(${(d * 0.75).toFixed(3)}em)`;
      w.style.opacity = String(clamp(1 - Math.abs(d) * 1.5));
    });
    const k = Math.floor(f);
    slot.style.width = `${lerp(wordWidths[k], wordWidths[Math.min(k + 1, words.length - 1)], f - k).toFixed(1)}px`;

    const hintOpacity = clamp(1 - p / 0.05);
    hints.forEach((h) => (h.style.opacity = String(hintOpacity)));

    if (hovered) placeTag(hovered);
  }

  // ---------- labels ----------
  function placeTag(o: Obj) {
    const s = stage!.getBoundingClientRect();
    const r = o.el.getBoundingClientRect();
    const tw = tag.offsetWidth;
    const x = clamp(r.left + r.width / 2 - s.left - tw / 2, 8, W - tw - 8);
    const y = Math.min(r.bottom - s.top + 6, H - tag.offsetHeight - 8);
    tag.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(-2deg)`;
  }
  let tagTimer = 0;
  function showTag(o: Obj) {
    hovered = o;
    tag.textContent = o.el.dataset.label ?? "";
    placeTag(o);
    tag.classList.add("on");
  }
  function hideTag(o: Obj) {
    if (hovered !== o) return;
    hovered = null;
    tag.classList.remove("on");
  }

  // ---------- drag and toss (mouse only, so touch keeps scrolling the page) ----------
  let z = 10;
  let held: Obj | null = null;
  let grabX = 0;
  let grabY = 0;
  let samples: { x: number; y: number; t: number }[] = [];
  let moving = false;
  let lastT = 0;

  const local = (e: PointerEvent) => {
    const s = stage!.getBoundingClientRect();
    return { x: e.clientX - s.left, y: e.clientY - s.top };
  };

  for (const o of objs) {
    o.el.addEventListener("pointerenter", () => showTag(o));
    o.el.addEventListener("pointerleave", (e) => {
      if (held === o) return;
      if (e.pointerType === "mouse") hideTag(o);
      else {
        clearTimeout(tagTimer);
        tagTimer = window.setTimeout(() => hideTag(o), 1600);
      }
    });

    if (reduce) continue;
    o.el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      e.preventDefault();
      o.el.setPointerCapture(e.pointerId);
      held = o;
      o.vx = o.vy = o.vr = 0;
      const pt = local(e);
      grabX = pt.x - (o.bx + o.tx);
      grabY = pt.y - (o.by + o.ty);
      samples = [{ ...pt, t: e.timeStamp }];
      o.el.style.zIndex = String(++z);
      o.el.classList.add("held");
      showTag(o);
    });
    o.el.addEventListener("pointermove", (e) => {
      if (held !== o) return;
      const pt = local(e);
      o.tx = pt.x - grabX - o.bx;
      o.ty = pt.y - grabY - o.by;
      samples.push({ ...pt, t: e.timeStamp });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 90) samples.shift();
      render();
    });
    const release = (e: PointerEvent) => {
      if (held !== o) return;
      held = null;
      o.el.classList.remove("held");
      const a = samples[0];
      const b = samples[samples.length - 1];
      const dt = Math.max(16, b.t - a.t);
      if (e.timeStamp - b.t < 80) {
        const max = 3.2; // px per ms
        o.vx = clamp((b.x - a.x) / dt, -max, max);
        o.vy = clamp((b.y - a.y) / dt, -max, max);
        o.vr = o.vx * 0.09;
        startPhysics();
      }
      if (!o.el.matches(":hover")) hideTag(o);
    };
    o.el.addEventListener("pointerup", release);
    o.el.addEventListener("pointercancel", release);
  }

  function startPhysics() {
    if (moving) return;
    moving = true;
    lastT = performance.now();
    requestAnimationFrame(step);
  }

  function step(now: number) {
    const dt = Math.min(40, now - lastT);
    lastT = now;
    const friction = Math.pow(0.9955, dt);
    let any = false;
    for (const o of objs) {
      if (o === held || (!o.vx && !o.vy && !o.vr)) continue;
      o.tx += o.vx * dt;
      o.ty += o.vy * dt;
      o.tr += o.vr * dt;
      // bounce off the edges of the stage
      const x = o.bx + o.tx;
      const y = o.by + o.ty;
      const hw = o.w / 2;
      const hh = o.h / 2;
      if (x < hw) (o.tx = hw - o.bx), (o.vx = Math.abs(o.vx) * 0.6), (o.vr *= -0.8);
      if (x > W - hw) (o.tx = W - hw - o.bx), (o.vx = -Math.abs(o.vx) * 0.6), (o.vr *= -0.8);
      if (y < hh) (o.ty = hh - o.by), (o.vy = Math.abs(o.vy) * 0.6);
      if (y > H - hh) (o.ty = H - hh - o.by), (o.vy = -Math.abs(o.vy) * 0.6);
      o.vx *= friction;
      o.vy *= friction;
      o.vr *= friction;
      if (Math.hypot(o.vx, o.vy) < 0.01 && Math.abs(o.vr) < 0.002) o.vx = o.vy = o.vr = 0;
      else any = true;
    }
    render();
    if (any) requestAnimationFrame(step);
    else moving = false;
  }

  // ---------- the watch, on Eastern time ----------
  const timeEl = stage.querySelector<HTMLElement>("[data-time]");
  const tzEl = stage.querySelector<HTMLElement>("[data-tz]");
  const clock = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
  function tick() {
    const parts = clock.formatToParts(new Date());
    const get = (t: string) => parts.find((x) => x.type === t)?.value ?? "";
    if (timeEl) timeEl.textContent = `${get("hour")}:${get("minute")}`;
    if (tzEl) tzEl.textContent = get("timeZoneName"); // EST in winter, EDT in summer
  }
  tick();
  setTimeout(() => {
    tick();
    setInterval(tick, 60_000);
  }, 60_000 - (Date.now() % 60_000) + 50);

  // ---------- start ----------
  measure();
  headline.classList.add("driven");
  render();

  const pops = objs.map((o) => o.el.firstElementChild as HTMLElement);
  if (reduce) {
    gsap.set(pops, { opacity: 1 });
    hints.forEach((h) => h.remove()); // nothing to scroll through or throw
  } else {
    // objects land on the desk one after another
    gsap.fromTo(
      pops.filter((_, i) => !objs[i].hidden),
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2.2)", stagger: 0.07, delay: 0.1 },
    );
    gsap.set(pops.filter((_, i) => objs[i].hidden), { opacity: 1 });

    // the pinned scroll: about one screen of scrolling drives the whole desk
    gsap.to(state, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: stage,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
      onUpdate() {
        // thrown objects ease back with the pile, and are home once it finishes
        if (state.p > lastP && lastP < 1) {
          const k = (1 - state.p) / (1 - lastP);
          for (const o of objs) {
            o.tx *= k;
            o.ty *= k;
            o.tr *= k;
            o.vx = o.vy = o.vr = 0;
          }
        }
        lastP = state.p;
        render();
      },
    });
  }

  let rz = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => {
      measure();
      render();
    });
  });
  phone.addEventListener("change", () => {
    measure();
    render();
  });
  // web fonts change the headline word widths once they arrive
  document.fonts?.ready.then(() => {
    measure();
    render();
  });
}
