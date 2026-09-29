/**
 * Seasons on scroll: the page's ground colour drifts through a year as you read, from spring at the top to
 * summer, autumn and winter at the contact. Colour only, no motion, and every shade stays close to the site's
 * stone so text contrast never changes.
 */
(() => {
  const { clamp, lerp } = MO;
  const root = document.documentElement;
  const GROUND = [[230, 224, 214], [221, 225, 211], [228, 218, 203], [223, 225, 226]];
  const at = (p) => { const f = clamp(p, 0, 1) * 3, i = Math.min(2, Math.floor(f)), k = f - i; return { f, rgb: GROUND[i].map((v, j) => Math.round(lerp(v, GROUND[i + 1][j], k))) }; };

  let lastRGB = "", span = 1;
  const measure = () => (span = Math.max(1, document.documentElement.scrollHeight - innerHeight));
  addEventListener("resize", measure); addEventListener("load", measure); new ResizeObserver(measure).observe(document.body); measure();
  function tint() {
    const s = at(scrollY / span), rgb = `rgb(${s.rgb.join(",")})`;
    if (rgb !== lastRGB) { lastRGB = rgb; root.style.setProperty("--season", rgb); }
  }
  addEventListener("scroll", tint, { passive: true }); tint();
})();
