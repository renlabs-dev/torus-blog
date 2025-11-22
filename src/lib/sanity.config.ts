/**
 * Centralized Sanity CMS configuration
 * All Sanity-related environment variables are managed here
 *
 * Environment variables (set in .env):
 * - PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID: Your Sanity project ID (required)
 * - PUBLIC_TORUS_BLOG_SANITY_DATASET: The dataset to use (required)
 * - TORUS_BLOG_SANITY_API_TOKEN: API token for authenticated requests (required)
 *
 * Note: Fallback values are required for build-time when env vars may not be available.
 */

export const SANITY_CONFIG = {
  projectId:
    import.meta.env.PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID || "build-placeholder",
  dataset: import.meta.env.PUBLIC_TORUS_BLOG_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: import.meta.env.TORUS_BLOG_SANITY_API_TOKEN || "build-placeholder",
  studioBasePath: "/admin",
} as const;
