# Grishma Gajurel — Portfolio

A static personal portfolio site presenting research, data-analytics projects, and reports (deployed via GitHub Pages).

## Purpose

- Present research and analytics work in one place (projects, reports, and posters)
- Provide a clean, recruiter-friendly overview (About + contact links)
- Keep project details consistent and easy to update from a single source of truth

## How it's done

The whole site is a **single-page-app-flavored static site** — no build step, no backend, no fetch calls. Every page is a plain HTML file that shares one script.

1. `js/site.js` holds one JS object, `SITE_CONFIG` (name, bio, social links, nav), and one array, `PROJECTS` (each project's id, title, description, tags, year, `featured` flag).
2. On page load, `site.js` renders the shared header/nav/footer into `#site-header` / `#site-footer` slots that exist on every HTML page, so there's one place to edit navigation instead of duplicating markup across pages.
3. The **Projects** page renders the full `PROJECTS` list; the **Home** page filters to `featured: true` only.
4. The **Project detail** page reads an `id` query parameter (`project/?id=<slug>`), looks it up in `PROJECTS`, and renders a single project view — this is the "routing" layer, done entirely client-side with `URLSearchParams`, no server or router library.
5. `js/project-files.js` maps each project `id` to its downloadable file(s) (PDFs/posters in `files/`) so links stay relative and don't need hardcoding per page.
6. Theme (light/dark) is stored in `localStorage` and applied via a `data-theme` attribute on `<html>`, read on load before paint.
7. `.github/workflows/static.yml` deploys the repo straight to GitHub Pages on push — no build/bundle step, since the site is already static.

## Code used

Plain **HTML**, **CSS** (custom, with light/dark theme tokens), and **vanilla JavaScript** (no framework, no npm dependencies). Fonts via Google Fonts (Inter + Newsreader). Icons via a single `favicon.svg`.

## The "algorithm"

There's no numerical algorithm here — the interesting logic is the **data-driven rendering pattern**:

- Content lives as data (`PROJECTS` array), not as hand-written HTML per project.
- Every page is a small template function that maps that data array to DOM nodes at load time (`array.map()` → template strings → injected via `innerHTML`).
- The "router" is a one-line lookup: `PROJECTS.find(p => p.id === new URLSearchParams(location.search).get('id'))`.

This means adding a new project is a single object appended to `PROJECTS` — every page (home, list, detail) picks it up automatically with no HTML duplication.
