# Photos

Put photographs here (JPEG or WebP; about 2000 px on the long side keeps the page fast), then add one entry per
photo to `photos` in `js/content.js`:

```js
{ src: "photos/forest-park.jpg", title: "Forest Park", place: "St. Louis", date: "Oct 2026", settings: "24mm · ƒ/1.8 · 1/500 · ISO 100", w: 1536, h: 2048 }
```

`place` drives the filter chips, `w` and `h` are the file's pixel size, and the first five photos also appear as
prints beside the intro. `settings`, `place` and `date` are optional.
