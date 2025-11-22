/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID: string;
  readonly PUBLIC_TORUS_BLOG_SANITY_DATASET: "production" | "dev" | "stage";
  readonly TORUS_BLOG_SANITY_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
