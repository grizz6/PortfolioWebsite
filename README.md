# Grishma Gajurel — Portfolio

## About

My personal portfolio site, live at **[www.grishmagajurel.com](https://www.grishmagajurel.com/)**. It collects my ecology research, data analytics, and machine learning projects in one place, with downloadable reports and posters for each.

It's a hand-built, single-page static site: plain HTML, CSS, and vanilla JavaScript, with no framework, build step, backend, or npm dependencies. All content lives in one JavaScript file, so adding a project means adding one object.

**Sections:** Hero · The receipts (achievements in Google's XYZ format) · Real-world impact · By the numbers · How I can help · Built like software · Case studies and projects · Where I've been · What I'm looking for · Contact

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
files/              reports, posters, and slides linked from projects
```

1. **Content as data.** `js/content.js` holds the headline, receipts, impact, stats, services, experience, education, talks, goals, tools, and projects. Change the words there and the page updates.
2. **Rendering.** `js/kit.js` fills `data-*` hooks (email, name, stats, services, experience, and more) and builds the expandable project list, where the first three are full case studies and the rest appear behind "Show more".
3. **Motion.** A gooey blob in the hero that follows the cursor (canvas with a blur and contrast filter), headline letters that change weight near the cursor (Fraunces variable font), ink-bleed chapter headings, odometer chapter numbers, a circle reveal into the numbers, stacking service cards that draw themselves, project previews with an RGB split, a live terminal that types out synthkit's test run, and a git-style career graph that draws as you scroll. All motion respects `prefers-reduced-motion`.
4. **Old links still work.** `about/`, `projects/`, `project/`, and `contact/` (and their `.html` versions) now redirect to the matching section of the single page, and `404.html` does the same for any other old path.
5. **Palette.** Stone and moss neutrals with a burgundy blob, set as CSS custom properties at the top of `index.html`.

## Deployment

GitHub Pages serves the `main` branch at the custom domain. `.github/workflows/static.yml` uploads the repository as-is on every push, since there's nothing to build.

Then visit http://localhost:8000.

## Built with

HTML5, CSS (custom properties), vanilla JavaScript, canvas, Google Fonts (Fraunces and Inter Tight), GitHub Pages and GitHub Actions.

## License

MIT. See [`LICENSE`](LICENSE).
