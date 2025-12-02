# Torus Blog

## 📚 Documentation

- **[CMS Guide](./docs/CMS.md)** - How to create and manage blog posts using Sanity CMS
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Environment variables setup and deployment instructions

## Project Structure

Inside of Torus Blog, you'll see the following folders and files:

```bash
/
├── public/
│   ├── assets/
|   ├── pagefind/ # auto-generated when build
│   └── favicon.svg
│   └── og-image.jpg
│   └── favicon.svg
│   └── toggle-theme.js
├── src/
│   ├── assets/
│   │   └── icons/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── blog/
│   │       └── some-blog-posts.md
│   ├── layouts/
│   └── pages/
│   └── styles/
│   └── utils/
│   └── config.ts
│   └── constants.ts
│   └── content.config.ts
└── astro.config.ts
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images can be placed in the `public/` directory.

All blog posts are stored in `src/data/blog` directory.

## Content Management

This blog supports two ways to create content:

1. **Sanity CMS** (Recommended for content creators)

   - Access at `/admin` route (e.g., `http://localhost:4321/admin`)
   - User-friendly visual editor
   - No coding required
   - See [docs/CMS.md](./docs/CMS.md) for detailed instructions

2. **Markdown Files** (For developers)
   - Create `.md` files in `src/data/blog/`
   - Full control over content structure

## Commands

All commands are run from the root of the project, from a terminal.

### Using Just (Recommended)

This project includes a [`justfile`](https://github.com/casey/just) for convenient command execution:

```bash
# Install just: brew install just (macOS) or cargo install just

just           # List all available commands
just dev       # Start dev server
just build     # Build for production
just check     # Run lint + format check
just fix       # Auto-fix formatting and linting
just start     # Full setup: install + sync + dev
```

### Using pnpm directly

| Command                 | Action                                                                                                                           |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`          | Installs dependencies                                                                                                            |
| `pnpm run dev`          | Starts local dev server at `localhost:4321`                                                                                      |
| `pnpm run build`        | Build your production site to `./dist/`                                                                                          |
| `pnpm run preview`      | Preview your build locally, before deploying                                                                                     |
| `pnpm run format:check` | Check code format with Prettier                                                                                                  |
| `pnpm run format`       | Format codes with Prettier                                                                                                       |
| `pnpm run sync`         | Generates TypeScript types for all Astro modules. [Learn more](https://docs.astro.build/en/reference/cli-reference/#astro-sync). |
| `pnpm run lint`         | Lint with ESLint                                                                                                                 |
