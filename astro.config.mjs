// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.grishmagajurel.com",
  output: "static",
  trailingSlash: "ignore",
  integrations: [sitemap({ filter: (page) => !page.includes("404") })],
  // the stylesheet is small, so it ships inside the page instead of blocking on a second request
  build: { inlineStylesheets: "always" },
  // Addresses from earlier versions of the site keep working. The .html forms live in public/.
  redirects: {
    "/about": "/#about",
    "/contact": "/#contact",
    "/project": "/#work",
    "/projects": "/#work",
  },
});
