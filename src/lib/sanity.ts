import { createClient } from "@sanity/client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";
import { SANITY_CONFIG } from "./sanity.config";

export interface SanityBlogPost {
  _id: string;
  _type: "blogPost";
  title: string;
  slug: Slug;
  author?: string;
  pubDatetime: string;
  modDatetime?: string;
  featured?: boolean;
  draft?: boolean;
  unlisted?: boolean;
  tags?: string[];
  description: string;
  content: PortableTextBlock[];
  ogImage?: ImageAsset;
  canonicalURL?: string;
}

/**
 * Check if Sanity configuration is valid
 * Validates that all required fields are non-empty strings and not placeholder values
 */
function isSanityConfigured(): boolean {
  const { projectId, dataset, token } = SANITY_CONFIG;

  return !!(
    projectId &&
    typeof projectId === "string" &&
    projectId.trim() &&
    projectId !== "build-placeholder" &&
    dataset &&
    typeof dataset === "string" &&
    dataset.trim() &&
    token &&
    typeof token === "string" &&
    token.trim() &&
    token !== "build-placeholder"
  );
}

/**
 * Get or create Sanity client (lazy initialization)
 */
let client: ReturnType<typeof createClient> | null = null;

function getClient(): ReturnType<typeof createClient> {
  if (!isSanityConfigured()) {
    throw new Error(
      "Sanity CMS is not configured. Please set the required environment variables: " +
        "PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID, PUBLIC_TORUS_BLOG_SANITY_DATASET, TORUS_BLOG_SANITY_API_TOKEN"
    );
  }

  if (!client) {
    client = createClient({
      projectId: SANITY_CONFIG.projectId,
      dataset: SANITY_CONFIG.dataset,
      apiVersion: SANITY_CONFIG.apiVersion,
      useCdn: SANITY_CONFIG.useCdn,
      token: SANITY_CONFIG.token,
    });
  }

  return client;
}

export async function getSanityPosts(): Promise<SanityBlogPost[]> {
  // Return empty array if Sanity is not configured
  if (!isSanityConfigured()) {
    return [];
  }

  const query = groq`*[_type == "blogPost"] | order(pubDatetime desc) {
    _id,
    _type,
    title,
    slug,
    author,
    pubDatetime,
    modDatetime,
    featured,
    draft,
    unlisted,
    tags,
    description,
    content,
    ogImage,
    canonicalURL
  }`;

  try {
    return await getClient().fetch(query);
  } catch (error) {
    throw new Error(
      `Failed to fetch Sanity blog posts: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getSanityPostBySlug(
  slug: string
): Promise<SanityBlogPost | null> {
  // Return null if Sanity is not configured
  if (!isSanityConfigured()) {
    return null;
  }

  const query = groq`*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    author,
    pubDatetime,
    modDatetime,
    featured,
    draft,
    unlisted,
    tags,
    description,
    content,
    ogImage,
    canonicalURL
  }`;

  try {
    return await getClient().fetch(query, { slug });
  } catch (error) {
    throw new Error(
      `Failed to fetch Sanity blog post with slug "${slug}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
