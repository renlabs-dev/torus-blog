import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "static",
  integrations: [
    sanity({
      projectId:
        import.meta.env.PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID ||
        "build-placeholder",
      dataset: import.meta.env.PUBLIC_TORUS_BLOG_SANITY_DATASET || "production",
      useCdn: false,
      // Studio available at /admin in dev mode only
      studioBasePath: "/admin",
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
    // @ts-expect-error - Tailwind CSS Vite plugin type compatibility issue
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split Sanity Studio into separate chunk to reduce main bundle
            "sanity-studio": ["sanity"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  },
  image: {
    // Used for all Markdown images; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with a prop
    layout: "constrained",
  },
});
