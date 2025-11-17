import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./schemaTypes";
import { SANITY_CONFIG } from "./src/lib/sanity.config";

export default defineConfig({
  name: "torus-blog",
  title: "Torus Blog",
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
