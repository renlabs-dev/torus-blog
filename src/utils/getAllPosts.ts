import { type CollectionEntry } from "astro:content";
import { getSanityPosts, type SanityBlogPost } from "@/lib/sanity";
import { toHTML, escapeHTML } from "@portabletext/to-html";
import sanitizeHtml from "sanitize-html";
import type { ImageAsset } from "@sanity/types";
import imageUrlBuilder from "@sanity/image-url";
import { SANITY_CONFIG } from "@/lib/sanity.config";

// Initialize Sanity image URL builder
const builder = imageUrlBuilder({
  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,
});

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
  // Convert Portable Text to HTML with custom image serializer
  const rawHtml = toHTML(sanityPost.content, {
    components: {
      types: {
        image: ({ value }) => {
          const imageUrl = builder.image(value).width(800).url();
          const alt = escapeHTML(value.alt || "");
          const caption = escapeHTML(value.caption || "");

          return `
            <figure class="sanity-image">
              <img src="${imageUrl}" alt="${alt}" loading="lazy" />
              ${caption ? `<figcaption>${caption}</figcaption>` : ""}
            </figure>
          `;
        },
      },
    },
  });

  // Sanitize HTML to prevent XSS attacks from compromised Sanity accounts
  const htmlContent = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "figure",
      "figcaption",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "loading", "width", "height"],
      figure: ["class"],
    },
  });

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
      hideEditPost: true, // Always hide for Sanity posts - managed in Sanity Studio, not GitHub
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
 * Returns all posts from Sanity CMS (markdown disabled)
 */
export async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  // Fetch Sanity posts (immutable approach with promise handling)
  const sanityPosts = await getSanityPosts()
    .then(sanityData => sanityData.map(sanityPostToCollectionEntry))
    .catch(error => {
      // eslint-disable-next-line no-console -- Production error logging for diagnosing Sanity issues
      console.error("Failed to fetch Sanity posts:", error);
      return [] as CollectionEntry<"blog">[];
    });

  // Return Sanity posts only
  return sanityPosts;
}
