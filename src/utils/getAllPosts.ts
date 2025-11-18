import { getCollection, type CollectionEntry } from "astro:content";
import { getSanityPosts, type SanityBlogPost } from "@/lib/sanity";
import { toHTML } from "@portabletext/to-html";
import type { ImageAsset } from "@sanity/types";

/**
 * Safely converts Sanity ImageAsset to Astro-compatible ogImage format
 */
function convertOgImage(
  ogImage: ImageAsset | undefined
): string | { src: string } | undefined {
  if (!ogImage) {
    return undefined;
  }

  // If ogImage is already a string URL, return as-is
  if (typeof ogImage === "string") {
    return ogImage;
  }

  // If it's an ImageAsset object, extract the URL
  // Sanity ImageAsset typically has _type and other properties
  if (typeof ogImage === "object" && "url" in ogImage) {
    return ogImage.url as string;
  }

  // Fallback: return undefined if we can't convert
  return undefined;
}

// Convert a Sanity post to Astro's CollectionEntry format
function sanityPostToCollectionEntry(
  sanityPost: SanityBlogPost
): CollectionEntry<"blog"> {
  // Convert Portable Text to HTML
  const htmlContent = toHTML(sanityPost.content);

  return {
    id: sanityPost.slug.current,
    collection: "blog",
    data: {
      title: sanityPost.title,
      author: sanityPost.author || "Torus",
      pubDatetime: new Date(sanityPost.pubDatetime),
      modDatetime: sanityPost.modDatetime
        ? new Date(sanityPost.modDatetime)
        : undefined,
      featured: sanityPost.featured || false,
      draft: sanityPost.draft || false,
      unlisted: sanityPost.unlisted || false,
      tags: sanityPost.tags || [],
      description: sanityPost.description,
      ogImage: convertOgImage(sanityPost.ogImage),
      canonicalURL: sanityPost.canonicalURL,
      hideEditPost: sanityPost.hideEditPost || false,
    },
    body: htmlContent,
    slug: sanityPost.slug.current,
    filePath: undefined, // Sanity posts don't have filePath
    render: async () => ({
      Content: () => {
        // Return a functional component that renders the HTML
        return {
          type: "div",
          props: {
            dangerouslySetInnerHTML: { __html: htmlContent },
            className: "sanity-content",
          },
        };
      },
      headings: [],
      remarkPluginFrontmatter: {},
    }),
  } as CollectionEntry<"blog">;
}

/**
 * Returns all posts: local markdown + Sanity CMS
 */
export async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  // Fetch markdown posts
  const markdownPosts = await getCollection("blog");

  // Fetch Sanity posts (immutable approach with promise handling)
  const sanityPosts = await getSanityPosts()
    .then(sanityData => sanityData.map(sanityPostToCollectionEntry))
    .catch(() => [] as CollectionEntry<"blog">[]);

  // Combine and return all posts
  return [...markdownPosts, ...sanityPosts];
}
