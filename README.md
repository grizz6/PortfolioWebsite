# Grishma Gajurel — Portfolio

## About

My personal portfolio site, live at **[www.grishmagajurel.com](https://www.grishmagajurel.com/)**. It collects my ecology research, data analytics, and machine learning projects in one place, with downloadable reports and posters for each.

It's a hand-built static site: plain HTML, CSS, and vanilla JavaScript, with no framework, build step, backend, or npm dependencies. All content lives in one JavaScript file, so adding a project means adding one object.

**Pages:** Home · About · Projects (with tag filters and search) · Project detail · Contact · 404

---

## Projects featured

| Project | Deliverable |
|---|---|
| Maximizing Pollination Services in Urban Orchards (report for SEED St. Louis) | `files/insect-distribution-usda.pdf` |
| Python Data Analysis Project (911 calls) | links to the notebook on GitHub |
| Mortgage Payback Analysis | `files/mortgage-payback.pdf` |
| ESA 2025 · Pollination & Urban Bee Foraging Study | `files/Slide1.jpg` |
| Research Across Disciplines (RAD) Conference | `files/rad.pdf` |
| Weather Regression | `files/weather-regression.pdf` |
| Python ML Project (brain tumor survival) | links to the notebook on GitHub |
| Software Mailing Analysis | `files/software-mailing.pdf` |
| Used Smartphone Price Analysis | `files/used-smartphone.pdf` |
| Portfolio Website | links to this site |

Code for most of these is in my other repos: [ESA](https://github.com/grizz6/ESA), [R-Projects](https://github.com/grizz6/R-Projects), [Academic-Project---Webster-University](https://github.com/grizz6/Academic-Project---Webster-University), and [Python-mini-projects](https://github.com/grizz6/Python-mini-projects).

---

## How it works

```
index.html, about/, projects/, project/, contact/   ← thin HTML shells with empty slots
        │
        ├── js/project-files.js   PROJECT_FILES: project id → PDF/image in files/
        └── js/site.js            SITE_CONFIG (name, bio, links, nav) + PROJECTS array
                                  → renders header, footer, and page content on load
```

1. **Content as data.** `js/site.js` defines `SITE_CONFIG` (name, tagline, bio, social links, nav items) and `PROJECTS` (id, title, description, tags, year, featured flag).
2. **Shared layout.** Each HTML page has `#site-header` and `#site-footer` placeholders and a `data-page` attribute. `site.js` fills in the header, nav (highlighting the current page), and footer, so navigation is defined once.
3. **Per-page rendering,** based on `data-page`:
   - **Home** shows the first three projects in `PROJECTS`.
   - **Projects** builds a card for every project, generates tag filter buttons from all tags, and filters live as you type in the search box.
   - **Project detail** reads `?id=` from the URL with `URLSearchParams`, finds the matching project, and renders it, with a not-found state if there's no match.
   - **About** and **Contact** pull the tagline, bio, email, and social links from `SITE_CONFIG`. Contact includes a copy-email button.
4. **Deliverable links.** A project's `href` (external link) wins; otherwise `js/project-files.js` maps its id to a file in `files/`, with the path built relative to the site root.
5. **Works on any host.** `getBasePath()` detects whether the site is on a custom domain, a `username.github.io/repo/` subpath, or opened locally as a file, and prefixes every link and asset path to match.
6. **Pretty URLs.** Every page exists twice, as `about.html` and `about/index.html`, so `/about/` works without server rewrites.
7. **Theme.** Dark by default, with a light/dark toggle saved in `localStorage`. An inline script in `<head>` applies the saved theme before first paint to avoid a flash.
8. **Motion and polish.** Scroll-reveal animations via `IntersectionObserver`, a header that changes on scroll, a responsive mobile nav under 720px, an auto-updating footer year, and a few hidden interactions on the home page.

## Deployment

GitHub Pages serves the `main` branch at the custom domain. `.github/workflows/static.yml` uploads the repository as-is on every push, since there's nothing to build.

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Built with

HTML5, CSS (custom properties for light/dark themes, about 1,800 lines), vanilla JavaScript, Google Fonts (Inter and Newsreader), GitHub Pages and GitHub Actions.

## License

MIT. See [`LICENSE`](LICENSE).
