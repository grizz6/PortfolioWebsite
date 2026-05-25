# Grishma Gajurel — Portfolio

Personal portfolio site for Grishma Gajurel: data science, ecology research, and software projects.

## How it was built

This is a **static website** with no build step, no framework, and no package manager.

- **HTML** — one file per page (`index.html`, `about.html`, `projects.html`, `project.html`, `contact.html`, plus `404.html` for missing pages and clean URL routing)
- **CSS** — `css/styles.css` (layout, typography, light/dark theme via `data-theme` on the document root)
- **JavaScript** — `js/site.js` (single script: site config, project data, shared header/footer, page behavior, theme toggle)
- **Fonts** — Inter and Newsreader loaded from Google Fonts
- **Icons** — `favicon.svg`

There is no server-side code. Open any `.html` file in a browser to preview locally; paths are relative.

GitHub Pages serves the repo as plain static files. `.nojekyll` turns off Jekyll processing. The `404.html` page maps short paths (`/projects`, `/about`, `/contact`) to the matching `.html` files because GitHub Pages does not use `.htaccess`.

## What the site contains

### Pages

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, tagline, up to three featured projects |
| About | `about.html` | Bio and background |
| Projects | `projects.html` | Full project list with tags and years |
| Project detail | `project.html` | Single project view (`?id=<slug>`) |
| Contact | `contact.html` | Email and social links |

### Projects (in `js/site.js`)

- Pollination & Urban Bee Foraging Study
- Python Data Analysis Project (911 call data)
- Maximizing Pollination Services in Urban Orchards
- Python ML Project (brain tumor)
- Software Mailing Analysis
- Mortgage Payback Analysis
- Used Smartphone Price Analysis
- Weather Regression
- Portfolio Website

Featured projects on the home page are marked with `featured: true` in the project list (maximum three).

### Other files

- `robots.txt`, `sitemap.xml` — basic SEO
- `.github/workflows/deploy-pages.yml` — deploy to GitHub Pages on push to `main`
