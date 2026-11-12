// Hand-drawn strokes jitter like stop-motion: the wobble filter gets a new noise seed about 8 times a second.
const noise = document.getElementById("wobble-noise");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");

let timer = 0;
let seed = 1;

function start() {
  if (!noise || timer || reduce.matches || document.hidden) return;
  timer = window.setInterval(() => {
    seed = (seed % 5) + 1;
    noise.setAttribute("seed", String(seed));
  }, 125);
}

function stop() {
  clearInterval(timer);
  timer = 0;
}

document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
reduce.addEventListener("change", () => (reduce.matches ? stop() : start()));
start();
