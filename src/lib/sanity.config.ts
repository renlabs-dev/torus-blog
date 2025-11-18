/**
 * Centralized Sanity CMS configuration
 * All Sanity-related environment variables are managed here
 *
 * Environment variables (set in .env):
 * - PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID: Your Sanity project ID (required)
 * - PUBLIC_TORUS_BLOG_SANITY_DATASET: The dataset to use (required)
 * - TORUS_BLOG_SANITY_API_TOKEN: API token for authenticated requests (required)
 *
 * Note: The "placeholder-id" fallback is required for Astro/Sanity integration
 * to load during build time when env vars may not be available (e.g., CI).
 * The actual validation happens at runtime in src/lib/sanity.ts.
 */
export const SANITY_CONFIG = {
  projectId:
    import.meta.env.PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID || "placeholder-id",
  dataset: import.meta.env.PUBLIC_TORUS_BLOG_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: import.meta.env.TORUS_BLOG_SANITY_API_TOKEN || "placeholder-token",
  studioBasePath: "/admin",
} as const;
