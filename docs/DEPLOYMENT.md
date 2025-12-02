# Deployment Guide

## Environment Variables Setup

The project requires Sanity CMS environment variables to be configured before deployment.

### Required Variables

Add these environment variables to your deployment platform:

```bash
PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID=your-project-id
PUBLIC_TORUS_BLOG_SANITY_DATASET=production
TORUS_BLOG_SANITY_API_TOKEN=your-api-token
```

---

## GitHub Actions Secrets

To enable CI/CD builds, add these secrets to your GitHub repository:

### Steps:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each of the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID` | Your Sanity project ID | `abc123xyz` |
| `PUBLIC_TORUS_BLOG_SANITY_DATASET` | Sanity dataset name | `production` |
| `TORUS_BLOG_SANITY_API_TOKEN` | Sanity API token with read access | `sk...` |

### How to get these values:

1. **Project ID & Dataset:**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Find values in project settings

2. **API Token:**
   - In your Sanity project settings
   - Go to **API** → **Tokens**
   - Create a new token with **Read** permissions
   - Copy the token (shown only once!)

---

## Docker Deployment

### Building with Docker

Pass environment variables as build arguments:

```bash
docker build \
  --build-arg PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID=your-project-id \
  --build-arg PUBLIC_TORUS_BLOG_SANITY_DATASET=production \
  --build-arg TORUS_BLOG_SANITY_API_TOKEN=your-token \
  -t torus-blog .
```

### Running the container

```bash
docker run -p 80:80 torus-blog
```

### Using docker-compose

Create a `.env` file in the project root (already gitignored):

```bash
PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID=your-project-id
PUBLIC_TORUS_BLOG_SANITY_DATASET=production
TORUS_BLOG_SANITY_API_TOKEN=your-token
```

Update `docker-compose.yml` to include env vars:

```yaml
services:
  app:
    build:
      context: .
      args:
        - PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID=${PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID}
        - PUBLIC_TORUS_BLOG_SANITY_DATASET=${PUBLIC_TORUS_BLOG_SANITY_DATASET}
        - TORUS_BLOG_SANITY_API_TOKEN=${TORUS_BLOG_SANITY_API_TOKEN}
    ports:
      - "80:80"
```

Then run:

```bash
docker-compose up
```

---

## Verifying Deployment

After deploying, verify everything works:

1. **Blog loads:** Homepage shows posts
2. **Sanity posts appear:** If you created posts in Sanity Studio
3. **Images load:** Check post thumbnails
4. **Admin works:** Navigate to `/admin` to access Sanity Studio
5. **No console errors:** Check browser developer console

---

## Troubleshooting

### Build fails with "undefined" errors

**Problem:** Environment variables not set correctly

**Solution:**
- Verify all three variables are set in your platform
- Check for typos in variable names
- Ensure values don't have extra spaces or quotes

### Sanity Studio shows "Project not found"

**Problem:** Incorrect project ID

**Solution:**
- Verify `PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID` matches your Sanity project
- Check [sanity.io/manage](https://sanity.io/manage) for correct ID

### Posts don't show up

**Problem:** API token missing or invalid

**Solution:**
- Verify `TORUS_BLOG_SANITY_API_TOKEN` is set
- Ensure token has **Read** permissions
- Generate a new token if needed

### Build works locally but fails in CI

**Problem:** GitHub secrets not configured

**Solution:**
- Add all three secrets to GitHub repository settings
- Check secret names match exactly (case-sensitive)
- Verify secrets are available to the workflow

---

## Security Notes

- **Never commit** `.env` file to git (already in `.gitignore`)
- API tokens should have **minimum required permissions** (Read only)
- Rotate tokens periodically
- Use different tokens for development and production
- Keep `TORUS_BLOG_SANITY_API_TOKEN` secret (not public)
