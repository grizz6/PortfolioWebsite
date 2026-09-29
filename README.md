# Grishma Gajurel — Portfolio

## About

My personal portfolio site, live at **[www.grishmagajurel.com](https://www.grishmagajurel.com/)**. It collects my ecology research, data analytics, and machine learning projects in one place, with downloadable reports and posters for each.

It's a hand-built, single-page static site: plain HTML, CSS, and vanilla JavaScript, with no framework, build step, backend, or npm dependencies. All content lives in one JavaScript file, so adding a project means adding one object.

**Sections:** Hero (a generative orchard) · Experience · Projects · Reports and posters · Skills · Contact. Each fact appears once.

---

## Projects featured

| Project | Deliverable |
|---|---|
| synthkit (open-source Python library for realistic test data) | [grizz6/synthkit](https://github.com/grizz6/synthkit) |
| AI Data Analyst Agent | [grizz6/AI-Data-Analyst-Agent](https://github.com/grizz6/AI-Data-Analyst-Agent) |
| Urban bee foraging (co-authored poster, ESA 2025) | `files/Slide1.jpg`, [grizz6/ESA](https://github.com/grizz6/ESA) |
| Pollination report for SEED St. Louis | `files/insect-distribution-usda.pdf` |
| Orchard weather regression (presented at RAD 2025) | `files/weather-regression.pdf`, `files/rad.pdf` |
| Mortgage default and payoff | `files/mortgage-payback.pdf` |
| Mailing campaign targeting | `files/software-mailing.pdf` |
| Used smartphone pricing | `files/used-smartphone.pdf` |
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
js/seasons.js       seasons on scroll: the page colour shifts from spring to winter
js/forage.js        foraging paths: a live bee-flight drawing at the top of the projects
files/              reports, posters, and slides linked from projects
```

1. **Content as data.** `js/content.js` holds the headline, experience, education, skills, projects and the documents shelf. Change the words there and the page updates.
2. **Rendering.** `js/kit.js` fills `data-*` hooks (email, name, headline) and builds the expandable project list, where the first three are full case studies and the rest appear behind "Show more".
3. **Motion.** A generative orchard in the hero: trees grow branch by branch and blossom, the mouse makes wind, and a click grows a new orchard. The reports and posters are shown as 3D paper pages with generative covers; scroll or drag through them and click one to open it. Browsers without WebGL get the same pages on a CSS 3D wall.

   The page colour shifts through a year as you scroll, from spring at the top to winter at the contact. The projects open with foraging paths, a live drawing of bees flying between 10 blossoms (one per orchard in the bee study); the cursor lures them and a click plants a flower.

   One `requestAnimationFrame` loop runs only the sections on screen, three.js loads only when the reports are near, and layout is measured once instead of every frame. There are also headline letters that change weight near the cursor, ink-bleed chapter headings, and a git-style experience graph that draws as you scroll. All motion respects `prefers-reduced-motion`.
4. **Old links still work.** `about/`, `projects/`, `project/`, and `contact/` (and their `.html` versions) now redirect to the matching section of the single page, and `404.html` does the same for any other old path.
5. **Palette.** Stone and moss neutrals set as CSS custom properties at the top of `index.html`, with warm orchard colours (blossom, terracotta, mustard) in the art.

## Deployment

GitHub Pages serves the `main` branch at the custom domain. `.github/workflows/static.yml` uploads the repository as-is on every push, since there's nothing to build.

Then visit http://localhost:8000.

## Built with

HTML5, CSS (custom properties), vanilla JavaScript, canvas, Three.js, Google Fonts (Fraunces and Inter Tight), GitHub Pages and GitHub Actions.

## License

MIT. See [`LICENSE`](LICENSE).
