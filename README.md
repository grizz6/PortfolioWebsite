# Grishma Gajurel — Portfolio

## About

My personal portfolio site, live at **[www.grishmagajurel.com](https://www.grishmagajurel.com/)**. It collects my ecology research, data analytics, and machine learning projects in one place, with downloadable reports and posters for each.

It's a hand-built, single-page static site: plain HTML, CSS, and vanilla JavaScript, with no framework, build step, backend, or npm dependencies. All content lives in one JavaScript file, so adding a project means adding one object.

**Sections:** Hero (a generative orchard) · The receipts · Real-world impact · By the numbers · How I can help · Built like software · Selected reports · Case studies and projects · Where I've been · Toolkit · Contact

---

## Projects featured

| Project | Deliverable |
|---|---|
| synthkit (open-source Python library for realistic test data) | [grizz6/synthkit](https://github.com/grizz6/synthkit) |
| AI Data Analyst Agent | [grizz6/AI-Data-Analyst-Agent](https://github.com/grizz6/AI-Data-Analyst-Agent) |
| Urban bee foraging (ESA 2025) | `files/Slide1.jpg`, [grizz6/ESA](https://github.com/grizz6/ESA) |
| Pollination in urban orchards (report for SEED St. Louis) | `files/insect-distribution-usda.pdf` |
| Orchard microclimate modeling | `files/weather-regression.pdf` |
| Mortgage default and payoff | `files/mortgage-payback.pdf` |
| Mailing campaign targeting | `files/software-mailing.pdf` |
| Used smartphone pricing | `files/used-smartphone.pdf` |
| Research Across Disciplines (RAD) talk | `files/rad.pdf` |
| 911 call patterns | notebook on GitHub |
| Brain tumor survival model | notebook on GitHub |

Code for most of these is in my other repos: [ESA](https://github.com/grizz6/ESA), [R-Projects](https://github.com/grizz6/R-Projects), [Academic-Project---Webster-University](https://github.com/grizz6/Academic-Project---Webster-University), and [Python-mini-projects](https://github.com/grizz6/Python-mini-projects).

---

## How it works

```
index.html          the whole site: layout, styles, and the motion code
js/content.js       window.PORTFOLIO: every piece of text, project, and link
js/kit.js           shared helpers that render content into the page
js/motion.js        one animation loop, script loader, shared report covers and dealing
js/orchard-paper.js the generative orchard hero (canvas 2D)
js/reports-gl.js    selected reports as WebGL paper pages (three.js)
js/reports-css.js   the same pages on a CSS 3D wall, for browsers without WebGL
js/seasons.js       seasons on scroll: page colour and falling petals, seeds, leaves, snow
js/forage.js        foraging paths: a live bee-flight drawing at the top of the work section
files/              reports, posters, and slides linked from projects
```

1. **Content as data.** `js/content.js` holds the headline, receipts, impact, stats, services, experience, education, talks, tools, and projects. Change the words there and the page updates.
2. **Rendering.** `js/kit.js` fills `data-*` hooks (email, name, stats, services, experience, and more) and builds the expandable project list, where the first three are full case studies and the rest appear behind "Show more".
3. **Motion.** A generative orchard in the hero: trees grow branch by branch and blossom, the mouse makes wind, and a click grows a new orchard. A selected reports section deals my real reports past as 3D paper pages with generative cover art, and clicking a page opens it. The sky and sun are CSS, the hills are drawn once, and blossoms are stamped from a sprite atlas. The report pages bend as they move, ease with the scroll, can be dragged, and have clickable dots; browsers without WebGL get them as real HTML links on a CSS 3D wall.

   The page also moves through a year as you scroll: spring at the top, then summer, autumn and winter at the contact, with the ground colour and a few falling petals, leaves or snowflakes following the season. The work section opens with foraging paths, a live drawing of bees flying between 15 blossoms (one per orchard) that maps every flight; the cursor lures them and a click plants a flower.

   One `requestAnimationFrame` loop runs only the sections on screen, three.js loads only when the reports are near, and layout is measured once instead of every frame. Each effect appears once: petals only fall from the seasons layer, bees only live in the foraging plate, and the headline is the only text that changes weight. There are also ink-bleed chapter headings, a circle reveal into the numbers, stacking service cards that draw themselves, a live terminal that types out synthkit's test run, and a git-style career graph that draws as you scroll. All motion respects `prefers-reduced-motion`.
4. **Old links still work.** `about/`, `projects/`, `project/`, and `contact/` (and their `.html` versions) now redirect to the matching section of the single page, and `404.html` does the same for any other old path.
5. **Palette.** Stone and moss neutrals set as CSS custom properties at the top of `index.html`, with warm orchard colours (blossom, terracotta, mustard) in the art.

## Deployment

GitHub Pages serves the `main` branch at the custom domain. `.github/workflows/static.yml` uploads the repository as-is on every push, since there's nothing to build.

Then visit http://localhost:8000.

## Built with

HTML5, CSS (custom properties), vanilla JavaScript, canvas, Three.js, Google Fonts (Fraunces and Inter Tight), GitHub Pages and GitHub Actions.

## License

MIT. See [`LICENSE`](LICENSE).
