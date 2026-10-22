# Grishma Gajurel: Portfolio

## The goal

One place for my ecology research, data analytics, and machine learning work, with the
reports and code behind each project a click away. I wanted it hand-built, fast, and easy to
keep current without a framework or a build step.

## What I achieved

- **A live site** at [www.grishmagajurel.com](https://www.grishmagajurel.com/), featuring
  eight projects from Python libraries and AI tools to urban bee research and analytics
  coursework, each linking to its repository or downloadable report.
- **No framework, build step, backend, or npm dependencies.** It's plain HTML, CSS, and
  JavaScript, served as-is by GitHub Pages.
- **Content kept as data.** Every piece of text, project, and link lives in `js/content.js`,
  so adding a project means adding one object.
- **Keeps itself current.** A GitHub Actions job runs daily, reads my public repositories,
  and lists the five most recently updated ones under "Latest on GitHub". Add the topic
  `hide` to keep a repository off the site.
- **Old links still work.** Earlier page URLs redirect to the matching section, and the 404
  page does the same for any other old path.
- **Respects reduced motion.** The animations stop for visitors who set
  `prefers-reduced-motion`.

## How it works

```
index.html        layout and styles
js/content.js     all text, projects, photos, and links
js/site.js        renders the content and runs the effects
files/            reports, posters, and slides linked from projects
photos/           photographs for the film strip (see photos/README.md)
```

To preview locally, run `python3 -m http.server` in the repository and visit
http://localhost:8000.

## License

MIT. See [`LICENSE`](LICENSE).
