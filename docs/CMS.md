# Sanity CMS Documentation

## Table of Contents

- [Overview](#overview)
- [Accessing Sanity CMS](#accessing-sanity-cms)
- [Creating a Blog Post](#creating-a-blog-post)
- [Post Fields Reference](#post-fields-reference)
- [Tips for Writing Great Posts](#tips-for-writing-great-posts)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Torus Blog uses **Sanity CMS** as a content management system, allowing non-technical team members to create and publish blog posts through a user-friendly visual interface.

### Two Ways to Create Content

1. **Sanity CMS** (Recommended for content creators)
   - Visual editor with rich text formatting
   - No coding knowledge required
   - Real-time preview
   - Easy image upload (coming soon)

2. **Markdown Files** (For developers)
   - Direct file editing in `src/data/blog/`
   - Version control through Git
   - Full control over content structure

Both methods create posts that appear together on the blog seamlessly.

---

## Accessing Sanity CMS

### What is Sanity CMS?

Sanity is a modern, open-source headless CMS that allows content creators to manage blog posts through a visual, user-friendly interface. Unlike traditional CMS platforms, Sanity provides a flexible editor with real-time collaboration, rich content formatting, and API-first architecture.

### Sign In

First, you need to log in with your Sanity account credentials:

**[Click here to sign in to Sanity](https://www.sanity.io/login?type=token&origin=https%3A%2F%2Fwww.sanity.io%2Fapi%2Fdashboard%2Fauthenticate%3FredirectTo%3D%252Fwelcome%253Fref%253Dnavbar)**

### Access Sanity Studio

After signing in, you can access the studio environments:

**Production Environment:**
- Access at: [https://www.sanity.io/@oXwUdOu4G/studio/u3alw10wiw1vp5ppsf963mn9/default](https://www.sanity.io/@oXwUdOu4G/studio/u3alw10wiw1vp5ppsf963mn9/default)
- Use this for creating and publishing live posts

**Development Environment:**
- Access at: [https://www.sanity.io/@oXwUdOu4G/studio/b52kakns02jpetbxtmdrl3so/default](https://www.sanity.io/@oXwUdOu4G/studio/b52kakns02jpetbxtmdrl3so/default)
- Use this for testing and development purposes

### No Access? Request Permission

If you don't have access to view or edit posts in Sanity Studio, you need to be added to the project whitelist.

**Contact one of the team members below to request access:**

- **@kingu**
- **@ed**
- **@rodrigooler**

You'll need to provide your email address to be added to the whitelist. Once approved, you'll be able to create, edit, and manage blog posts.

---

## Creating a Blog Post

### Step 1: Open Sanity Studio

1. Navigate to the `/studio` route
2. Sign in with your credentials
3. You'll see the Sanity Studio dashboard

### Step 2: Start a New Post

1. Click **"Blog Post"** in the left sidebar
2. Click the **"+"** button or **"Create new Blog Post"**
3. A new post editor will open

### Step 3: Fill in Required Fields

#### Title ✅ Required
- The main headline of your post
- Should be clear, descriptive, and engaging
- **Example:** `Understanding Torus Protocol`

#### Slug ✅ Required
- The URL-friendly version of your title
- Click **"Generate"** to auto-create from title
- Appears in the URL: `yourdomain.com/posts/your-slug-here`
- **Example:** `understanding-torus-protocol`
- **Tips:**
  - Keep it short and readable
  - Use hyphens, not underscores or spaces
  - Avoid special characters

#### Description ✅ Required
- A brief summary of your post
- Used for SEO and social media previews
- Appears in search results and post cards
- **Recommended length:** 120-160 characters
- **Example:** `Learn how Torus enables recursive coordination through autonomous agent swarms and decentralized protocols.`

#### Content ✅ Required
- The main body of your blog post
- Rich text editor with formatting options:
  - **Headings** (H2, H3, H4)
  - **Bold** and *italic* text
  - Bullet lists and numbered lists
  - Links
  - Block quotes
- **Tips:**
  - Break content into sections with headings
  - Use short paragraphs for readability
  - Add links to related content

#### Publication Date (pubDatetime) ✅ Required
- When the post should go live
- Use the date/time picker
- Posts with future dates won't appear until that time
- **Note:** Posts are sorted by this date on the homepage

### Step 4: Fill in Optional Fields

#### Author
- Your name or pseudonym
- **Default:** `Torus` (if left empty)
- **Examples:** `Anonymous`, `John Doe`, `Alice Smith`

#### Modified Date (modDatetime)
- Automatically updated when you edit
- Leave empty for new posts
- Useful for tracking when content was last updated

#### Tags
- Keywords or categories for your post
- Click **"Add item"** to add multiple tags
- Helps readers find related content
- Appears below the post title
- **Examples:**
  - `coordination`
  - `swarms`
  - `protocol`
  - `dao`
  - `governance`

#### Featured
- Toggle **ON** to show in the "Featured" section on homepage
- Featured posts get prominent display
- Only use for your best/most important content
- **Default:** OFF

#### Draft
- Toggle **ON** to save without publishing
- Draft posts are invisible to readers
- Great for work-in-progress content
- Remember to toggle OFF when ready to publish!
- **Default:** OFF

#### Unlisted
- Toggle **ON** to hide from listings but keep URL accessible
- Useful for sharing specific posts privately
- Post won't appear on homepage or tag pages
- Still accessible via direct URL
- **Default:** OFF

#### OG Image
- Custom image for social media sharing (Twitter, Facebook, etc.)
- **Recommended size:** 1200x630 pixels
- If empty, a dynamic image is auto-generated
- **Coming soon:** Image upload support

#### Canonical URL
- Original publication URL if reposting content
- Helps avoid SEO duplicate content penalties
- **Example:** `https://medium.com/@author/original-post`
- **Leave empty** for original content

### Step 5: Preview and Publish

1. **Review your content** in the editor
2. **Check formatting** looks correct
3. **Verify all required fields** are filled
4. **Toggle Draft to OFF** (if it was on)
5. Click **"Publish"** (bottom right corner)
6. Wait for confirmation message

### Step 6: View Your Published Post

1. Navigate to the blog homepage
2. Your post should appear in the listing
3. Click on it to view the full post
4. Share the URL with others!

---

## Post Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **title** | Text | ✅ Yes | Post headline |
| **slug** | Slug | ✅ Yes | URL identifier (auto-generated) |
| **description** | Text | ✅ Yes | SEO summary (120-160 chars) |
| **content** | Rich Text | ✅ Yes | Main post content |
| **pubDatetime** | DateTime | ✅ Yes | Publication date/time |
| **author** | Text | No | Author name (default: "Torus") |
| **modDatetime** | DateTime | No | Last modified date (auto-updated) |
| **tags** | Array[String] | No | Post categories/keywords |
| **featured** | Boolean | No | Show in featured section |
| **draft** | Boolean | No | Hide from public (default: false) |
| **unlisted** | Boolean | No | Hide from listings (default: false) |
| **ogImage** | Image | No | Social sharing preview image |
| **canonicalURL** | URL | No | Original source URL |

---

## Tips for Writing Great Posts

### Content Strategy

1. **Write Compelling Titles**
   - Clear and specific
   - Hint at the value readers will get
   - Keep under 60 characters for best SEO

2. **Craft Effective Descriptions**
   - Appears in search results
   - Should entice clicks
   - Include primary keyword
   - 120-160 characters ideal

3. **Structure Your Content**
   - Use H2 and H3 headings to break up sections
   - Keep paragraphs short (2-4 sentences)
   - Use bullet points for lists
   - Add visual breaks between sections

4. **Choose Relevant Tags**
   - 3-5 tags per post is ideal
   - Use existing tags when possible
   - Helps readers discover related content
   - Think about how people search

5. **Optimize for SEO**
   - Include keywords naturally
   - Use descriptive headings
   - Add internal links to other posts
   - Keep URLs short and readable

### Publishing Best Practices

1. **Preview Before Publishing**
   - Check all formatting
   - Verify links work
   - Read through for typos

2. **Set Proper Dates**
   - Posts sort by publication date
   - Can schedule future posts
   - Don't backdate unless necessary

3. **Use Draft Mode**
   - Save work in progress
   - Get feedback before publishing
   - Prevent accidental publication

4. **Update Existing Posts**
   - Refresh outdated information
   - Modified date tracks changes
   - Readers see "Updated" badge

---

## Troubleshooting

### Post Not Showing Up

**Problem:** My post isn't visible on the site

**Solutions:**
- ✅ Verify **Draft** toggle is OFF
- ✅ Check **pubDatetime** is not in the future
- ✅ Confirm you clicked **"Publish"**
- ✅ Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- ✅ Check **Unlisted** is not toggled ON

### Can't Access Sanity Studio

**Problem:** `/studio` page won't load

**Solutions:**
- ✅ Ensure dev server is running (`pnpm run dev`)
- ✅ Check internet connection (authentication required)
- ✅ Verify you have project access permissions
- ✅ Try clearing browser cache
- ✅ Check browser console for errors (F12)

### Changes Not Appearing

**Problem:** Edits aren't showing on the site

**Solutions:**
- ✅ Click **"Publish"** after making changes
- ✅ Wait 10-30 seconds for propagation
- ✅ Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- ✅ Check if you're in Draft mode
- ✅ Verify you saved the document

### Formatting Issues

**Problem:** Content doesn't look right

**Solutions:**
- ✅ Use the toolbar formatting options
- ✅ Avoid pasting from Word (use plain text)
- ✅ Preview in Sanity Studio
- ✅ Check heading hierarchy (H2 → H3, don't skip)

### Authentication Problems

**Problem:** Can't sign in to Sanity

**Solutions:**
- ✅ Use correct Sanity account
- ✅ Request access from admin
- ✅ Check email for verification
- ✅ Try password reset if needed

### Delete a Post

**How to delete:**
1. Open the post in Sanity Studio
2. Click **"..."** menu (top right)
3. Select **"Delete"**
4. Confirm deletion
5. Post will be removed from site

**Note:** Deletion is permanent! Consider using Draft mode instead.

---

## Getting Help

### Resources

- **Main Documentation:** [README.md](../README.md)
- **Sanity Documentation:** [sanity.io/docs](https://www.sanity.io/docs)
- **Astro Documentation:** [docs.astro.build](https://docs.astro.build)

### Support Channels

- Open an issue on GitHub
- Contact the development team
- Check Sanity community forums

---

## Quick Reference Card

### Before Publishing Checklist

- [ ] Title is clear and compelling
- [ ] Slug is generated and readable
- [ ] Description is 120-160 characters
- [ ] Content is well-formatted with headings
- [ ] Tags are added (3-5 recommended)
- [ ] Author name is set
- [ ] Publication date is correct
- [ ] Draft mode is OFF
- [ ] Clicked "Publish" button
- [ ] Verified post appears on site

### Common Keyboard Shortcuts

- **Bold:** Ctrl/Cmd + B
- **Italic:** Ctrl/Cmd + I
- **Save:** Ctrl/Cmd + S

---

**Happy blogging! 🚀**

For questions or issues, reach out to the development team.
