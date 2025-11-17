/**
 * Centralized Sanity CMS configuration
 * All Sanity-related environment variables are managed here
 *
 * Environment variables (set in .env):
 * - PUBLIC_SANITY_PROJECT_ID: Your Sanity project ID
 * - PUBLIC_SANITY_DATASET: The dataset to use (e.g., 'production')
 * - SANITY_API_TOKEN: API token for authenticated requests
 *
 * Fallback values are provided for development convenience.
 */
export const SANITY_CONFIG = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "38vxhhct",
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: import.meta.env.SANITY_API_TOKEN,
  studioBasePath: "/admin",
} as const;
