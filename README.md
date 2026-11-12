# grishmagajurel.com

My portfolio: one page that is my desk seen from above. Built with Astro, plain CSS, vanilla
JavaScript and GSAP, and published to GitHub Pages at
[www.grishmagajurel.com](https://www.grishmagajurel.com/).

## Run it locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # the finished site goes to dist/
```

Every push to `main` builds and publishes the site through `.github/workflows/deploy.yml`.

## Add photos

Drop images (JPEG, PNG, WebP or AVIF) into `src/assets/photos/` and push. They show up in
"through my lens" in file-name order, so start names with `01-`, `02-` to set the order.
About 2000 px on the long side is plenty; the site makes the smaller sizes itself.

Captions and alt text are optional. Either add a `.txt` file with the same name (first line is
the caption, second line the alt text), or an entry in `src/assets/photos/photos.json`:

```json
"gateway-arch.jpg": { "alt": "The Gateway Arch seen from below", "caption": "Gateway Arch, St. Louis" }
```

## Add or reorder projects

Each card in "Things I've built" is one file in `src/content/projects/`:

```md
---
title: Filings Q&A
line: One sentence about it.
order: 1
repo: https://github.com/grizz6/filings-qa
live: https://filings.streamlit.app
note: try it
recording: /projects/filings-qa.mp4
poster: ../../assets/projects/filings-qa.png
---
```

- `order` sets the position (lowest first). `live` and `note` are optional.
- `recording` is a muted, looping screen recording placed in `public/projects/`.
- `poster` is a still image in `src/assets/projects/`. It shows before the video plays, or on its own
  if there is no recording.
- With neither, the card shows a small animated stand-in.

To add a project, copy a file and change it. To remove one, delete its file.

## Swap a desk object for a real photo

Each object on the desk is `src/assets/desk/<name>.webp` (laptop, book, glasses, phone,
airpods, note, pizza, watch, card, marker, tea, bottle).

1. Photograph the item from directly above and remove the background, so you have a PNG with
   transparency.
2. Save it as `src/assets/desk-src/<name>.png`, for example `laptop.png`.
3. Run `npm run cutouts -- laptop`. It adds the torn white paper edge and writes
   `src/assets/desk/laptop.webp`. (The first time, run `npx playwright install chromium`.)
4. Commit both files and push.

Sizes, positions, labels and which objects hide on phones live in `src/data/desk.ts`. If you
replace the watch, adjust `watchFace` there so the live time sits on its screen.

## Use your own doodles

Put `crew.png` (the footer) or `scroll.png` (the scroll hint on the desk) in
`src/assets/doodles/` and they replace the built-in drawings. Transparent backgrounds work best.

## Links and contact details

Email, GitHub, LinkedIn and Instagram are set in `src/data/site.ts`.
