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
  hideEditPost?: boolean;
}

// Validate required environment variables at runtime
function validateSanityConfig() {
  const errors: string[] = [];

  if (!SANITY_CONFIG.projectId) {
    errors.push("PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID");
  }
  if (!SANITY_CONFIG.dataset) {
    errors.push("PUBLIC_TORUS_BLOG_SANITY_DATASET");
  }
  if (!SANITY_CONFIG.token) {
    errors.push("TORUS_BLOG_SANITY_API_TOKEN");
  }

  if (errors.length > 0) {
    throw new Error(
      `Missing required Sanity environment variables: ${errors.join(", ")}`
    );
  }
}

// Validate configuration before creating client
validateSanityConfig();

// Initialize the Sanity client
const client = createClient({
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
  apiVersion: SANITY_CONFIG.apiVersion,
  useCdn: SANITY_CONFIG.useCdn,
  token: SANITY_CONFIG.token,
});

export async function getSanityPosts(): Promise<SanityBlogPost[]> {
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
    canonicalURL,
    hideEditPost
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    throw new Error(
      `Failed to fetch Sanity blog posts: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getSanityPostBySlug(
  slug: string
): Promise<SanityBlogPost | null> {
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
    canonicalURL,
    hideEditPost
  }`;

  try {
    return await client.fetch(query, { slug });
  } catch (error) {
    throw new Error(
      `Failed to fetch Sanity blog post with slug "${slug}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
