// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.grishmagajurel.com",
  output: "static",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  // Addresses from earlier versions of the site keep working. The .html forms live in public/.
  redirects: {
    "/about": "/#about",
    "/contact": "/#contact",
    "/project": "/#work",
    "/projects": "/#work",
  },
});
