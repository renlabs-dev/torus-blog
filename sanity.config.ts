import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { SANITY_CONFIG } from "./src/lib/sanity.config";

export default defineConfig({
  name: "torus-blog",
  title: "Torus Blog",
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
