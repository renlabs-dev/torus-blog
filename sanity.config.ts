import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

// Read environment variables directly for Sanity Studio
// The Studio runs client-side and needs direct access to PUBLIC_ env vars
const projectId = import.meta.env.PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_TORUS_BLOG_SANITY_DATASET;

export default defineConfig({
  name: "torus-blog",
  title: "Torus Blog",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
