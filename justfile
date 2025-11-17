# Torus Blog - Just Commands
# https://github.com/casey/just

# Default recipe to display help information
default:
    @just --list

# Install dependencies
install:
    pnpm install

# Start local dev server at localhost:4321
dev:
    pnpm run dev

# Build production site to ./dist/
build:
    pnpm run build

# Preview build locally before deploying
preview:
    pnpm run preview

# Check code format with Prettier
format-check:
    pnpm run format:check

# Format code with Prettier
format:
    pnpm run format

# Generate TypeScript types for all Astro modules
sync:
    pnpm run sync

# Lint with ESLint
lint:
    pnpm run lint

# Run both lint and format check
check: lint format-check

# Fix all code issues (format + lint)
fix: format
    pnpm run lint --fix

# Clean build artifacts
clean:
    rm -rf dist .astro

# Full clean (including node_modules)
clean-all: clean
    rm -rf node_modules

# Reinstall dependencies from scratch
reinstall: clean-all install

# Development workflow: install, sync, and start dev server
start: install sync dev

# Pre-commit checks: lint, format, and type check
pre-commit: lint format-check sync

# Production build workflow: clean, install, sync, and build
prod: clean install sync build
