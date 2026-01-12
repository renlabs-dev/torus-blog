/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';
import { createClient, type SanityClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// ============================================================================
// Types
// ============================================================================

interface FrontmatterData {
  readonly title: string;
  readonly slug?: string;
  readonly author?: string;
  readonly pubDatetime?: Date;
  readonly modDatetime?: Date;
  readonly featured: boolean;
  readonly draft: boolean;
  readonly unlisted: boolean;
  readonly tags: readonly string[];
  readonly description: string;
  readonly ogImage?: string;
  readonly canonicalURL?: string;
}

interface MarkdownPost {
  readonly frontmatter: FrontmatterData;
  readonly body: string;
  readonly slug: string;
  readonly filename: string;
}

interface SanitySpan {
  readonly _type: 'span';
  readonly text: string;
  readonly marks?: readonly string[];
  readonly _linkUrl?: string;
}

interface SanityBlockBase {
  readonly _key: string;
  readonly _type: string;
}

interface SanityTextBlock extends SanityBlockBase {
  readonly _type: 'block';
  readonly style: string;
  readonly children: readonly SanitySpan[];
  readonly listItem?: 'ol' | 'ul';
}

interface SanityCodeBlock extends SanityBlockBase {
  readonly _type: 'code';
  readonly language: string;
  readonly code: string;
}

interface SanityImageBlock extends SanityBlockBase {
  readonly _type: 'image';
  readonly asset: {
    readonly _type: 'reference';
    readonly _ref: string;
  };
  readonly alt: string;
}

type SanityBlock = SanityTextBlock | SanityCodeBlock | SanityImageBlock;

interface SanityAsset {
  readonly _type: 'image';
  readonly asset: {
    readonly _type: 'reference';
    readonly _ref: string;
  };
}

interface SanityBlogPost {
  readonly _type: 'blogPost';
  readonly title: string;
  readonly slug: { readonly _type: 'slug'; readonly current: string };
  readonly description: string;
  readonly pubDatetime: string;
  readonly modDatetime: string | null;
  readonly author: string;
  readonly tags: readonly string[];
  readonly featured: boolean;
  readonly draft: boolean;
  readonly unlisted: boolean;
  readonly content: readonly SanityBlock[];
  readonly ogImage: SanityAsset | null;
  readonly canonicalURL: string | null;
}

interface MigrationResult {
  readonly success: boolean;
  readonly id?: string;
  readonly slug?: string;
  readonly error?: string;
}

interface Config {
  readonly projectId: string;
  readonly dataset: string;
  readonly token: string;
  readonly blogDir: string;
}

type ParsedYamlValue = string | number | boolean | Date | readonly string[];

interface ParseState {
  readonly blocks: readonly SanityBlock[];
  readonly index: number;
}

interface SpanAccumulator {
  readonly spans: readonly SanitySpan[];
  readonly lastEnd: number;
}

// ============================================================================
// Configuration
// ============================================================================

dotenv.config();

const createConfig = (): Config => {
  const projectId = process.env.PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID;
  const token = process.env.TORUS_BLOG_SANITY_API_TOKEN;
  const dataset = process.env.PUBLIC_TORUS_BLOG_SANITY_DATASET ?? 'dev';

  if (!projectId) throw new Error('Missing PUBLIC_TORUS_BLOG_SANITY_PROJECT_ID');
  if (!token) throw new Error('Missing TORUS_BLOG_SANITY_API_TOKEN');

  return { projectId, dataset, token, blogDir: path.join(process.cwd(), 'src/data/blog') };
};

const CONFIG = createConfig();

const getClient = (): SanityClient =>
  createClient({
    projectId: CONFIG.projectId,
    dataset: CONFIG.dataset,
    token: CONFIG.token,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

// ============================================================================
// Pure Utilities
// ============================================================================

const generateKey = (): string => Math.random().toString(36).slice(2, 11);

const readFileContent = (filePath: string): string => {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  return fs.readFileSync(filePath, 'utf-8');
};

const parseYamlValue = (value: string): ParsedYamlValue => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  const stripped = value.replace(/^["']|["']$/g, '');
  return stripped !== value ? stripped : value;
};

const parseDateField = (key: string, value: string): ParsedYamlValue =>
  key === 'pubDatetime' || key === 'modDatetime' ? new Date(value) : parseYamlValue(value);

const findIndex = (
  lines: readonly string[],
  startIndex: number,
  predicate: (line: string) => boolean
): number => {
  const remaining = lines.slice(startIndex);
  const found = remaining.findIndex(predicate);
  return found === -1 ? lines.length : startIndex + found;
};

// ============================================================================
// Frontmatter Parsing
// ============================================================================

const parseFrontmatterLine = (
  acc: Record<string, ParsedYamlValue>,
  line: string
): Record<string, ParsedYamlValue> => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('- ')) return acc;

  const colonIndex = trimmed.indexOf(': ');
  if (colonIndex === -1) return acc;

  const key = trimmed.slice(0, colonIndex).trim();
  const value = trimmed.slice(colonIndex + 2).trim();

  return { ...acc, [key]: parseDateField(key, value) };
};

const extractTags = (frontmatterStr: string): readonly string[] => {
  const tagsMatch = frontmatterStr.match(/tags:\n([\s\S]*?)(?=\n[a-z]|\n---)/);
  if (!tagsMatch) return [];

  return tagsMatch[1]
    .split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.trim().slice(2));
};

const buildFrontmatter = (parsed: Record<string, ParsedYamlValue>, tags: readonly string[]): FrontmatterData => {
  if (typeof parsed.title !== 'string') throw new Error('Missing required field: title');
  if (typeof parsed.description !== 'string') throw new Error('Missing required field: description');

  return {
    title: parsed.title,
    description: parsed.description,
    slug: typeof parsed.slug === 'string' ? parsed.slug : undefined,
    author: typeof parsed.author === 'string' ? parsed.author : undefined,
    pubDatetime: parsed.pubDatetime instanceof Date ? parsed.pubDatetime : undefined,
    modDatetime: parsed.modDatetime instanceof Date ? parsed.modDatetime : undefined,
    featured: parsed.featured === true,
    draft: parsed.draft === true,
    unlisted: parsed.unlisted === true,
    tags,
    ogImage: typeof parsed.ogImage === 'string' ? parsed.ogImage : undefined,
    canonicalURL: typeof parsed.canonicalURL === 'string' ? parsed.canonicalURL : undefined,
  };
};

const parseFrontmatter = (content: string): { frontmatter: FrontmatterData; body: string } => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid markdown format - missing frontmatter');

  const [, frontmatterStr, body] = match;
  const parsed = frontmatterStr.split('\n').reduce(parseFrontmatterLine, {});
  const tags = extractTags(frontmatterStr);

  return { frontmatter: buildFrontmatter(parsed, tags), body };
};

// ============================================================================
// Markdown Post Reading
// ============================================================================

const readMarkdownPost = (filename: string): MarkdownPost => {
  const filePath = path.join(CONFIG.blogDir, `${filename}.md`);
  const content = readFileContent(filePath);
  const { frontmatter, body } = parseFrontmatter(content);

  return { frontmatter, body, slug: frontmatter.slug ?? filename, filename };
};

const getMarkdownPosts = (): readonly string[] =>
  fs.readdirSync(CONFIG.blogDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('_'))
    .map(file => file.replace('.md', ''))
    .sort();

// ============================================================================
// Inline Markdown Parsing
// ============================================================================

const createSpanFromMatch = (matchText: string, groups: RegExpMatchArray): SanitySpan | null => {
  if (matchText.startsWith('![')) return null;
  if (matchText.startsWith('[')) return { _type: 'span', text: groups[2], marks: ['strong'], _linkUrl: groups[3] };
  if (matchText.startsWith('**')) return { _type: 'span', text: groups[4], marks: ['strong'] };
  if (matchText.startsWith('*')) return { _type: 'span', text: groups[5], marks: ['em'] };
  return null;
};

const processInlineMatch = (
  acc: SpanAccumulator,
  match: RegExpMatchArray,
  text: string
): SpanAccumulator => {
  const matchIndex = match.index ?? 0;
  const prefixSpan: readonly SanitySpan[] =
    matchIndex > acc.lastEnd ? [{ _type: 'span', text: text.slice(acc.lastEnd, matchIndex) }] : [];

  const span = createSpanFromMatch(match[0], match);
  const newSpans: readonly SanitySpan[] = span ? [...prefixSpan, span] : prefixSpan;

  return {
    spans: [...acc.spans, ...newSpans],
    lastEnd: matchIndex + match[0].length,
  };
};

const parseInlineMarkdown = (text: string): readonly SanitySpan[] => {
  const matches = Array.from(text.matchAll(/(!?\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g));

  if (matches.length === 0) return [{ _type: 'span', text }];

  const result = matches.reduce<SpanAccumulator>(
    (acc, match) => processInlineMatch(acc, match, text),
    { spans: [], lastEnd: 0 }
  );

  const suffix: readonly SanitySpan[] =
    result.lastEnd < text.length ? [{ _type: 'span', text: text.slice(result.lastEnd) }] : [];

  return [...result.spans, ...suffix];
};

// ============================================================================
// Block Creators
// ============================================================================

const createTextBlock = (style: string, text: string, listItem?: 'ol' | 'ul'): SanityTextBlock => ({
  _key: generateKey(),
  _type: 'block',
  style,
  children: parseInlineMarkdown(text),
  ...(listItem && { listItem }),
});

const createCodeBlock = (code: string, language: string): SanityCodeBlock => ({
  _key: generateKey(),
  _type: 'code',
  language: language || 'javascript',
  code: code.trimEnd(),
});

const createImageBlock = async (client: SanityClient, alt: string, imagePath: string): Promise<readonly SanityBlock[]> => {
  const uploadedImage = await uploadImageAsset(client, imagePath);

  if (!uploadedImage) {
    console.warn(`⚠️  Failed to upload image: ${imagePath} - skipping`);
    return [
      {
        _key: generateKey(),
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: `[Image not found: ${alt}]` }],
      },
    ];
  }

  return [
    { _key: generateKey(), _type: 'block', style: 'normal', children: [{ _type: 'span', text: '' }] },
    {
      _key: generateKey(),
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: uploadedImage.assetId,
      },
      alt,
    },
  ];
};

const extractImages = (text: string): readonly { alt: string; path: string }[] =>
  Array.from(text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)).map(m => ({ alt: m[1], path: m[2] }));

// ============================================================================
// Line Matchers
// ============================================================================

type HeadingMatch = { readonly level: number; readonly style: string; readonly text: string };
type ListMatch = { readonly isOrdered: boolean; readonly text: string };

const matchHeading = (line: string): HeadingMatch | null => {
  if (line.startsWith('# ')) return { level: 1, style: 'h2', text: line.slice(2) };
  if (line.startsWith('## ')) return { level: 2, style: 'h3', text: line.slice(3) };
  if (line.startsWith('### ')) return { level: 3, style: 'h4', text: line.slice(4) };
  return null;
};

const matchList = (line: string): ListMatch | null => {
  if (line.startsWith('- ')) return { isOrdered: false, text: line.slice(2) };
  const match = line.match(/^\d+\.\s(.*)$/);
  return match ? { isOrdered: true, text: match[1] } : null;
};

const isBlockBoundary = (line: string): boolean =>
  !line || line.startsWith('#') || line.startsWith('```') ||
  line.startsWith('- ') || /^\d+\./.test(line) || line.startsWith('![');

// ============================================================================
// Markdown to Portable Text
// ============================================================================

const processHeading = (lines: readonly string[], index: number, heading: HeadingMatch): ParseState => ({
  blocks: [createTextBlock(heading.style, heading.text)],
  index: index + 1,
});

const processCodeBlock = (lines: readonly string[], index: number): ParseState => {
  const language = lines[index].trim().slice(3);
  const endIndex = findIndex(lines, index + 1, line => line.trim().startsWith('```'));
  const code = lines.slice(index + 1, endIndex).join('\n');

  return { blocks: [createCodeBlock(code, language)], index: endIndex + 1 };
};

const processImage = async (client: SanityClient, lines: readonly string[], index: number): Promise<ParseState> => {
  const images = extractImages(lines[index]);
  const imageBlockArrays = await Promise.all(images.map(img => createImageBlock(client, img.alt, img.path)));
  const imageBlocks = imageBlockArrays.flat();
  return { blocks: imageBlocks, index: index + 1 };
};

const processList = (lines: readonly string[], index: number, listMatch: ListMatch): ParseState => ({
  blocks: [createTextBlock('normal', listMatch.text, listMatch.isOrdered ? 'ol' : 'ul')],
  index: index + 1,
});

const processParagraph = (lines: readonly string[], index: number): ParseState => {
  const endIndex = findIndex(lines, index + 1, line => isBlockBoundary(line.trim()));
  const paragraphText = [lines[index].trim(), ...lines.slice(index + 1, endIndex).map(l => l.trim())].join(' ');

  return { blocks: [createTextBlock('normal', paragraphText)], index: endIndex };
};

const processLine = async (client: SanityClient, lines: readonly string[], index: number): Promise<ParseState> => {
  const trimmed = lines[index].trim();

  if (!trimmed) return { blocks: [], index: index + 1 };

  const heading = matchHeading(trimmed);
  if (heading) return processHeading(lines, index, heading);

  if (trimmed.startsWith('```')) return processCodeBlock(lines, index);
  if (trimmed.startsWith('![')) return processImage(client, lines, index);

  const listMatch = matchList(trimmed);
  if (listMatch) return processList(lines, index, listMatch);

  return processParagraph(lines, index);
};

const parseMarkdownRecursive = async (
  client: SanityClient,
  lines: readonly string[],
  index: number,
  blocks: readonly SanityBlock[]
): Promise<readonly SanityBlock[]> => {
  if (index >= lines.length) return blocks;

  const result = await processLine(client, lines, index);
  return parseMarkdownRecursive(client, lines, result.index, [...blocks, ...result.blocks]);
};

const markdownToPortableText = async (client: SanityClient, markdown: string): Promise<readonly SanityBlock[]> => {
  const lines = markdown.split('\n');
  const blocks = await parseMarkdownRecursive(client, lines, 0, []);

  return blocks.length > 0
    ? blocks
    : [{ _key: generateKey(), _type: 'block', style: 'normal', children: [{ _type: 'span', text: '' }] }];
};

// ============================================================================
// Image Upload
// ============================================================================

const buildImageUrl = (projectId: string, dataset: string, assetId: string): string => {
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}`;
};

const uploadImageAsset = async (client: SanityClient, imagePath: string): Promise<{ assetId: string } | null> => {
  if (!imagePath) return null;

  const actualPath = imagePath.replace('@/assets', 'src/assets');
  const fullPath = path.join(process.cwd(), actualPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${imagePath}`);
    return null;
  }

  try {
    const filename = path.basename(fullPath);
    console.log(`📤 Uploading: ${filename}`);
    const fileBuffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload('image', fileBuffer, { filename });
    console.log(`✅ Uploaded: ${filename}`);
    console.log(`   Asset ID: ${asset._id}`);

    return { assetId: asset._id };
  } catch (error) {
    console.error(`❌ Error uploading ${imagePath}: ${(error as Error).message}`);
    return null;
  }
};

// ============================================================================
// Document Building
// ============================================================================

const buildSanityDocument = (
  frontmatter: FrontmatterData,
  slug: string,
  content: readonly SanityBlock[],
  ogImage: SanityAsset | null
): SanityBlogPost => ({
  _type: 'blogPost',
  title: frontmatter.title,
  slug: { _type: 'slug', current: slug },
  description: frontmatter.description,
  pubDatetime: frontmatter.pubDatetime?.toISOString() ?? new Date().toISOString(),
  modDatetime: frontmatter.modDatetime?.toISOString() ?? null,
  author: frontmatter.author ?? 'Torus',
  tags: frontmatter.tags,
  featured: frontmatter.featured,
  draft: frontmatter.draft,
  unlisted: frontmatter.unlisted,
  content,
  ogImage,
  canonicalURL: frontmatter.canonicalURL ?? null,
});

// ============================================================================
// Migration Operations
// ============================================================================

const migrateSinglePost = async (filename: string): Promise<MigrationResult> => {
  try {
    console.log(`\n🔄 Migrating: ${filename}`);
    const client = getClient();
    const post = readMarkdownPost(filename);

    console.log('📝 Converting markdown to PortableText...');
    const content = await markdownToPortableText(client, post.body);

    console.log('🖼️  Uploading cover image...');
    const uploadedOgImage = await uploadImageAsset(client, post.frontmatter.ogImage ?? '');
    const ogImage = uploadedOgImage
      ? {
          _type: 'image' as const,
          asset: {
            _type: 'reference' as const,
            _ref: uploadedOgImage.assetId,
          },
        }
      : null;

    console.log('💾 Creating Sanity document...');
    const document = buildSanityDocument(post.frontmatter, post.slug, content, ogImage);

    const result = await client.create(document);
    const resultSlug = (result.slug as { current: string }).current;

    console.log(`✅ Post migrated: ${resultSlug}\n`);
    return { success: true, id: result._id, slug: resultSlug };
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    return { success: false, error: (error as Error).message };
  }
};

const migrateAllPosts = async (): Promise<void> => {
  console.log(`Dataset: ${CONFIG.dataset}\n`);

  const posts = getMarkdownPosts();
  console.log(`Found ${posts.length} posts\n`);

  const results = await Promise.all(posts.map(migrateSinglePost));

  const successful = results.filter((r): r is MigrationResult & { success: true } => r.success);
  const failed = results.filter((r): r is MigrationResult & { success: false } => !r.success);

  console.log(`\n✅ Successful: ${successful.length}`);

  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`);
    failed.forEach((f) => console.log(`   ${posts[results.indexOf(f)]}: ${f.error}`));
  }
};

const listPosts = (): void => {
  const posts = getMarkdownPosts();
  console.log(`Available posts (${posts.length} total):\n`);
  posts.forEach((post, i) => console.log(`${i + 1}. ${post}`));
};

const deletePost = async (postId: string): Promise<void> => {
  const client = getClient();
  await client.delete(postId);
  console.log(`✅ Post deleted: ${postId}`);
};

const getAllPostIds = async (): Promise<readonly string[]> => {
  const client = getClient();
  const query = '*[_type == "blogPost"]._id';
  return await client.fetch(query);
};

const deleteAllPosts = async (): Promise<void> => {
  console.log('🔍 Fetching all posts...');
  const postIds = await getAllPostIds();

  if (postIds.length === 0) {
    console.log('✅ No posts found to delete.');
    return;
  }

  console.log(`Found ${postIds.length} posts. Deleting...\n`);

  const client = getClient();

  const batchSize = 10;
  for (let i = 0; i < postIds.length; i += batchSize) {
    const batch = postIds.slice(i, i + batchSize);
    await Promise.all(batch.map(id => client.delete(id)));
    const deleted = Math.min(i + batchSize, postIds.length);
    console.log(`📊 Deleted ${deleted}/${postIds.length} posts`);
  }

  console.log(`\n✅ All ${postIds.length} posts deleted successfully`);
};

// ============================================================================
// CLI
// ============================================================================

type CommandHandler = (arg?: string) => Promise<void> | void;

const commands: Record<string, CommandHandler> = {
  list: () => listPosts(),
  migrate: async (arg) => {
    if (!arg) throw new Error('Filename required: migrate <filename>');
    await migrateSinglePost(arg);
  },
  'migrate-all': () => migrateAllPosts(),
  delete: async (arg) => {
    if (!arg) throw new Error('Post ID required: delete <post-id>');
    await deletePost(arg);
  },
  'delete-all': async () => {
    await deleteAllPosts();
  },
};

const printUsage = (): void => {
  console.log('Commands:');
  console.log('  list              - List available posts');
  console.log('  migrate <file>    - Migrate single post');
  console.log('  migrate-all       - Migrate all posts');
  console.log('  delete <id>       - Delete single post');
  console.log('  delete-all        - Delete all posts from Sanity');
};

const main = async (): Promise<void> => {
  const [command, arg] = process.argv.slice(2);

  console.log(`Project: ${CONFIG.projectId}`);
  console.log(`Dataset: ${CONFIG.dataset}\n`);

  if (!command) {
    printUsage();
    return;
  }

  const handler = commands[command];
  if (!handler) throw new Error(`Unknown command: ${command}`);

  await handler(arg);
};

main().catch(error => {
  console.error(`❌ Fatal: ${(error as Error).message}`);
  process.exit(1);
});
