# Photos

Any JPEG, PNG, WebP or AVIF you put in this folder appears in "through my lens" on the next build.
No code changes needed. They appear in alphabetical order of file name, so
prefix names with a number (01-, 02-) if you want a set order.

Captions and alt text are optional. Add them either way:

- a text file with the same name: `gateway-arch.txt` next to `gateway-arch.jpg`. The first line is
  the caption; a second line, if present, is the alt text.
- or an entry in `photos.json`: `"gateway-arch.jpg": { "alt": "...", "caption": "..." }`

Without either, the alt text is made from the file name and there is no caption.
Photos about 2000 px on the long side look sharp and stay fast; the site makes smaller copies itself.
