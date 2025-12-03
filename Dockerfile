# Build stage
FROM node:lts AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build arguments for Sanity CMS
ARG PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID
ARG PUBLIC_TORUS_BLOG_SANITY_DATASET
ARG TORUS_BLOG_SANITY_API_TOKEN

# Set environment variables for build
ENV PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID=$PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID
ENV PUBLIC_TORUS_BLOG_SANITY_DATASET=$PUBLIC_TORUS_BLOG_SANITY_DATASET
ENV TORUS_BLOG_SANITY_API_TOKEN=$TORUS_BLOG_SANITY_API_TOKEN

RUN pnpm run build

# Runtime stage for Node.js server
FROM node:lts-alpine AS runtime
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]
