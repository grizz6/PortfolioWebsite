// Site-wide motion: smooth scrolling, gentle reveals as sections arrive, and a header that
// tucks away while reading and comes back when you scroll up. All of it is skipped when the
// visitor asks for reduced motion.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce) {
  // Smooth scrolling for mouse and trackpad, driven by GSAP's clock so the pinned desk and every
  // scroll animation stay in step. Phones keep their own scrolling and never download this part.
  if (matchMedia("(pointer: fine)").matches) {
    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.1, anchors: true }); // anchors honour each section's scroll-margin
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    });
  }

  // Headings marked data-write appear letter by letter, as if written, when they arrive.
  // Screen readers still get the plain heading through aria-label.
  gsap.utils.toArray<HTMLElement>("[data-write]").forEach((el) => {
    const text = el.textContent ?? "";
    el.setAttribute("aria-label", text.trim());
    el.textContent = "";
    const letters: HTMLElement[] = [];
    text.split(/(\s+)/).forEach((part) => {
      if (/^\s+$/.test(part)) return el.append(" ");
      const word = document.createElement("span");
      word.style.display = "inline-block";
      word.style.whiteSpace = "nowrap";
      word.setAttribute("aria-hidden", "true");
      for (const ch of part) {
        const l = document.createElement("span");
        l.textContent = ch;
        l.style.display = "inline-block";
        word.append(l);
        letters.push(l);
      }
      el.append(word);
    });
    gsap.from(letters, {
      opacity: 0,
      y: "0.25em",
      rotate: () => gsap.utils.random(-8, 8),
      duration: 0.5,
      ease: "back.out(2)",
      stagger: 0.035,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // Reveals: anything marked data-reveal rises in once; data-reveal-group reveals its children in turn.
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
  gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
    gsap.from(group.children, {
      y: 22,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: "top 88%", once: true },
    });
  });

  // The header slides up out of the way while you read down the page, and back as soon as you scroll up.
  const header = document.querySelector<HTMLElement>("[data-header]");
  const after = document.getElementById("statement");
  if (header && after) {
    const hide = gsap.to(header, { yPercent: -110, duration: 0.45, ease: "power2.out", paused: true });
    // a jump from the menu scrolls down too, but the menu should stay put for the next click
    let hold = 0;
    header.addEventListener("click", () => {
      hold = performance.now() + 1800;
      hide.reverse();
    });
    ScrollTrigger.create({
      trigger: after,
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (performance.now() < hold) return;
        if (self.direction === 1) hide.play();
        else hide.reverse();
      },
      onLeaveBack: () => hide.reverse(),
    });
    // keyboard users always see where focus is
    header.addEventListener("focusin", () => hide.reverse());
  }
}
