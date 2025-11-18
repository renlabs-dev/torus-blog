import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import { SITE } from "./src/config";
import { SANITY_CONFIG } from "./src/lib/sanity.config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "hybrid",
  integrations: [
    sanity({
      projectId: SANITY_CONFIG.projectId,
      dataset: SANITY_CONFIG.dataset,
      useCdn: SANITY_CONFIG.useCdn,
      studioBasePath: SANITY_CONFIG.studioBasePath,
    }),
    react(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "github-dark-high-contrast" },
      wrap: true,
    },
  },
  vite: {
    // @ts-ignore - Tailwind CSS Vite plugin type compatibility
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    experimentalLayout: "responsive",
  },
  experimental: {
    svg: true,
    responsiveImages: true,
    preserveScriptOrder: true,
  },
});
