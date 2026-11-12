import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One file per featured project in src/content/projects. Lower `order` comes first.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      line: z.string(),
      order: z.number(),
      repo: z.url(),
      live: z.url().optional(),
      // A screen recording (an .mp4 in public/projects/, written as "/projects/name.mp4") and a still image
      // (in src/assets/projects/). The recording plays if there is one; otherwise the still shows;
      // with neither, the card shows a small animated stand-in.
      recording: z.string().optional(),
      poster: image().optional(),
      note: z.string().default("try it"),
      placeholder: z.enum(["cite", "chart", "scatter"]).default("chart"),
    }),
});

export const collections = { projects };
