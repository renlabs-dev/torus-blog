import { getCollection, type CollectionEntry } from "astro:content";
import { getSanityPosts, type SanityBlogPost } from "@/lib/sanity";
import { toHTML } from "@portabletext/to-html";

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
      ogImage: sanityPost.ogImage as string | { src: string } | undefined,
      canonicalURL: sanityPost.canonicalURL,
      hideEditPost: sanityPost.hideEditPost || false,
    },
    body: htmlContent,
    // @ts-expect-error - Additional fields required for CollectionEntry
    slug: sanityPost.slug.current,
    filePath: undefined, // Sanity posts don't have filePath
    render: async () => ({
      Content: ({ sanitize = true }: { sanitize?: boolean }) => {
        // Return a functional component that renders the HTML
        const html = sanitize ? htmlContent : htmlContent;
        return {
          type: "div",
          props: {
            dangerouslySetInnerHTML: { __html: html },
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

  // Fetch Sanity posts
  let sanityPosts: CollectionEntry<"blog">[] = [];
  try {
    const sanityData = await getSanityPosts();
    sanityPosts = sanityData.map(sanityPostToCollectionEntry);
  } catch {
    // Silently fail if Sanity posts cannot be fetched
    // Continue without Sanity posts if there's an error
  }

  // Combine and return all posts
  return [...markdownPosts, ...sanityPosts];
}
