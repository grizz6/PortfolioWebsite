# Grishma Gajurel: Portfolio

## The goal

One place for my ecology research, data analytics, and machine learning work, with the
reports and code behind each project a click away. I wanted it hand-built, fast, and easy to
keep current without a framework or a build step.

## What I achieved

- **A live site** at [www.grishmagajurel.com](https://www.grishmagajurel.com/), featuring
  eight projects from Python libraries and AI tools to urban bee research and analytics
  coursework, each linking to its repository or downloadable report.
- **No framework, build step, or backend.** It's plain HTML, CSS, and JavaScript, served
  as-is by GitHub Pages; the one library, Three.js, loads from a CDN.
- **Content kept as data.** Every piece of text, project, and link lives in `js/content.js`,
  so adding a project means adding one object.
- **Photography in 3D.** The intro flies through my photographs in a WebGL scene; they
  ripple under the cursor and bend with scroll speed, and each opens full screen.
- **Old links still work.** Earlier page URLs redirect to the matching section, and the 404
  page does the same for any other old path.
- **Respects reduced motion.** Visitors who set `prefers-reduced-motion`, or whose browser
  lacks WebGL, get still photos instead of the 3D scene.

## How it works

```
index.html        layout, styles, the page script, and the 3D photo scene (Three.js)
js/content.js     all text, projects, photos, and links
files/            reports, posters, and slides linked from projects
photos/           photographs for the 3D intro (see photos/README.md)
```

To preview locally, run `python3 -m http.server` in the repository and visit
http://localhost:8000.

## License

MIT. See [`LICENSE`](LICENSE).
