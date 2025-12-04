import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: "URL-friendly version of the title",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Torus",
    }),
    defineField({
      name: "pubDatetime",
      title: "Publish Date & Time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      description: "When this post should be published",
    }),
    defineField({
      name: "modDatetime",
      title: "Modified Date & Time",
      type: "datetime",
      description: "Last modified date (optional)",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show this post in the featured section on homepage",
    }),
    defineField({
      name: "draft",
      title: "Draft",
      type: "boolean",
      initialValue: false,
      description: "Hide this post from public view",
    }),
    defineField({
      name: "unlisted",
      title: "Unlisted",
      type: "boolean",
      initialValue: false,
      description: "Hide from listings but accessible via direct URL",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Topics related to this post",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      description: "Short summary for SEO and previews (max 200 chars)",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption displayed below the image",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
      description: "Main blog post content (supports rich text and images)",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Social media preview image (recommended: 1200x640px)",
    }),
    defineField({
      name: "canonicalURL",
      title: "Canonical URL",
      type: "url",
      description: "If this post was published elsewhere first",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "ogImage",
      draft: "draft",
      featured: "featured",
    },
    prepare(selection) {
      const { title, author, draft, featured } = selection;
      const subtitle = [
        author,
        draft && "DRAFT",
        featured && "⭐ Featured",
      ]
        .filter(Boolean)
        .join(" • ");

      return {
        title: title,
        subtitle: subtitle || author,
        media: selection.media,
      };
    },
  },
});
