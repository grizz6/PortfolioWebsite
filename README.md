# Grishma Gajurel — Portfolio

## About

My personal portfolio site, live at **[www.grishmagajurel.com](https://www.grishmagajurel.com/)**. It collects my ecology research, data analytics, and machine learning projects in one place, with downloadable reports and posters for each.

It's a hand-built, single-page static site: plain HTML, CSS, and vanilla JavaScript, with no framework, build step, backend, or npm dependencies. All content lives in one JavaScript file, so adding a project means adding one object.

**Sections:** Intro · Selected work · Experience · Education · Tools · Contact.

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
index.html      layout and styles
js/content.js   window.PORTFOLIO: every piece of text, project and link
js/site.js      renders the content and draws the intro's dot field
files/          reports, posters and slides linked from projects
```

1. **Content as data.** `js/content.js` holds the headline, status, six selected projects, experience, education and tools. Change the words there and the page updates.
2. **Design.** A dark single column on a faint grid, set in Geist and Geist Mono, with colours as CSS custom properties at the top of `index.html`.
3. **Motion.** One quiet effect: a dot field behind the intro that brightens near the cursor. It only draws while the intro is on screen and the cursor is moving, and stays still for `prefers-reduced-motion`.
4. **Old links still work.** `about/`, `projects/`, `project/` and `contact/` (and their `.html` versions) redirect to the matching section, and `404.html` does the same for any other old path.

## GitHub sync

`.github/workflows/sync-github.yml` runs every day at 06:17 UTC (or by hand from the Actions tab). `scripts/sync-github.mjs` reads my public repositories and writes `data/github.json`, and the Work section lists the five most recently updated ones under "Latest on GitHub", skipping any already in the selected projects. The file is only committed when the list changes, so its git history is a record of how the projects changed. After each sync the Pages workflow redeploys the site.

- Listed: public repositories that aren't forks or archived, except this one.
- Add the topic `portfolio` to any repositories to list only those.
- Add the topic `hide` to keep a repository off the site.

## Deployment

GitHub Pages serves the `main` branch at the custom domain. `.github/workflows/static.yml` uploads the repository as-is on every push, since there's nothing to build.

To preview locally, run `python3 -m http.server` in the repository and visit http://localhost:8000.

## Built with

HTML, CSS (custom properties), vanilla JavaScript, canvas, Google Fonts (Geist and Geist Mono), GitHub Pages and GitHub Actions.

## License

MIT. See [`LICENSE`](LICENSE).
