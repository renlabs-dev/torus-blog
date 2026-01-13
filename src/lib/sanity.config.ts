/**
 * Centralized Sanity CMS configuration
 * All Sanity-related environment variables are managed here
 *
 * Environment variables (set in .env):
 * - PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID: Your Sanity project ID (required)
 * - PUBLIC_TORUS_BLOG_SANITY_DATASET: The dataset to use (required)
 * - TORUS_BLOG_SANITY_API_TOKEN: API token for authenticated requests (required)
 *
 * Note: Missing environment variables will be handled by isSanityConfigured() validation
 */

export const SANITY_CONFIG = {
  projectId: import.meta.env.PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_TORUS_BLOG_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
  token: import.meta.env.TORUS_BLOG_SANITY_API_TOKEN,
  studioBasePath: "/studio",
} as const;
