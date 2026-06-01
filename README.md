# Grishma Gajurel — Portfolio

Portfolio website for Grishma Gajurel.

## Purpose

- Present research and analytics work in one place (projects, reports, and posters)
- Provide a clean, recruiter-friendly overview (About + contact links)
- Keep project details consistent and easy to update from a single source of truth

## Tools, tech, and code used

### Frontend stack
- **HTML**: page markup and structure
- **CSS**: layout, typography, responsive styling, theme tokens (light/dark)
- **Vanilla JavaScript**: site behavior and rendering
- **Fonts**: Inter + Newsreader (Google Fonts)
- **Icon**: `favicon.svg`

### How the pages are wired
- **Shared header/footer + navigation**: generated once in `js/site.js` and injected into every page via the `#site-header` / `#site-footer` slots.
- **Clean routes**: `/about/`, `/projects/`, `/contact/`, `/project/` are folder routes (each has an `index.html`).
- **Project detail**: `project/?id=<slug>` reads from the in-code `PROJECTS` list and renders a single project view.
- **Project files (PDFs/posters)**: mapped by project id in `js/project-files.js` so links are always relative (e.g. `files/weather-regression.pdf`).
- **Theme**: stored in `localStorage` and applied using `data-theme` on the document root.

### Project data model
Projects live in `js/site.js` as objects with fields like:
- `id`, `title`, `description`, `tags`, `year`
- `featured` (controls which projects appear on the home page)
- Optional `href` for external links (e.g. GitHub)

## What the site contains

### Pages
- **Home**: intro + selected projects
- **About**: background and focus areas
- **Projects**: complete project list with filtering
- **Project**: single project detail view (`?id=<slug>`)
- **Contact**: email + social links

### Content files
- `files/`: PDFs and posters linked from projects
- `robots.txt`, `sitemap.xml`: discovery/SEO helpers

### Deployment tooling
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment workflow
