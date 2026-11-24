import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { personalInfo } from '../data/personal';

interface BlogAuthor {
  name: string;
  affiliation?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  authors: BlogAuthor[];
  paperPdf?: string;
  bylineLinks?: string;
  indexFigure?: { src: string; alt: string };
  date: string;
  draft: boolean;
  readingMinutes: number;
  content: string;
}

interface PostOptions {
  includeDrafts?: boolean;
  skipInvalidPosts?: boolean;
  directory?: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'blog');
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parsePost(source: string, slug: string): BlogPost {
  if (!validSlug.test(slug)) {
    throw new Error(`Invalid blog folder "${slug}". Use lowercase words separated by hyphens.`);
  }

  const { data, content } = matter(source);
  const fail = (message: string): never => {
    throw new Error(`content/blog/${slug}/index.md: ${message}`);
  };

  if (typeof data.title !== 'string' || !data.title.trim()) return fail('"title" must be a nonempty string.');
  const entries = data.authors === undefined ? [personalInfo] : data.authors;
  if (!Array.isArray(entries) || !entries.length) {
    return fail('"authors" must be a nonempty list of names.');
  }
  const authors = entries.map((entry): BlogAuthor => {
    const author = typeof entry === 'string' ? { name: entry } : entry;
    if (typeof author?.name !== 'string' || !author.name.trim()) {
      return fail('Each author must have a nonempty name.');
    }
    const name = author.name.trim();
    if (author.affiliation === undefined) return { name };
    if (typeof author.affiliation !== 'string' || !author.affiliation.trim()) {
      return fail(`The affiliation for "${name}" must be a nonempty string.`);
    }
    return { name, affiliation: author.affiliation.trim() };
  });
  // YAML also accepts unquoted dates, which gray-matter parses as Date objects.
  const rawDate: unknown = data.date;
  const date = rawDate instanceof Date && !Number.isNaN(rawDate.getTime())
    ? rawDate.toISOString().slice(0, 10)
    : rawDate;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return fail('"date" must use YYYY-MM-DD format.');
  }
  const timestamp = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(timestamp.getTime()) || timestamp.toISOString().slice(0, 10) !== date) {
    return fail('"date" must be a valid calendar date.');
  }
  if (data.draft !== undefined && typeof data.draft !== 'boolean') {
    return fail('"draft" must be true or false, without quotes.');
  }
  if (data.bylineLinks !== undefined && typeof data.bylineLinks !== 'string') {
    return fail('"bylineLinks" must be a string of Markdown links.');
  }
  const paperPdf = data.paperPdf;
  if (paperPdf !== undefined && (typeof paperPdf !== 'string' || !/^[^./\\][^/\\]*\.pdf$/i.test(paperPdf))) {
    return fail('"paperPdf" must be a PDF filename in the same folder as index.md.');
  }
  if (!content.trim()) return fail('The post body is empty.');

  let indexFigure: BlogPost['indexFigure'];
  if (data.indexFigure !== undefined) {
    const { src, alt } = data.indexFigure ?? {};
    if (typeof src !== 'string' || !src.trim() || typeof alt !== 'string' || !alt.trim()) {
      return fail('"indexFigure" must include a source path (src) and alternative text (alt).');
    }
    const asset = path.posix.normalize(src.trim());
    if (/^(?:\/|\.\.(?:\/|$)|[a-z][\w+.-]*:)/i.test(asset) || asset === '.') {
      return fail('"indexFigure.src" must point to a file inside the post folder.');
    }
    indexFigure = { src: `/blog/${slug}/${asset.split('/').map(encodeURIComponent).join('/')}`, alt: alt.trim() };
  }

  return {
    slug,
    title: data.title.trim(),
    authors,
    paperPdf,
    bylineLinks: data.bylineLinks?.trim(),
    indexFigure,
    date,
    draft: data.draft === true,
    readingMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
    content,
  };
}

export function getPosts({
  includeDrafts = process.env.NODE_ENV === 'development',
  skipInvalidPosts = process.env.NODE_ENV === 'development',
  directory = postsDirectory,
}: PostOptions = {}): BlogPost[] {
  if (!fs.existsSync(directory)) return [];

  const posts: BlogPost[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const filename = path.join(directory, entry.name, 'index.md');
    if (!fs.existsSync(filename)) continue;
    try {
      const source = fs.readFileSync(filename, 'utf8');
      // Explicit drafts can be unfinished without blocking a production build.
      // Validate published posts strictly, including ambiguous draft flags.
      if (!includeDrafts && matter(source).data.draft === true) continue;
      const post = parsePost(source, entry.name);
      if (post.paperPdf && !fs.lstatSync(path.join(directory, entry.name, post.paperPdf), { throwIfNoEntry: false })?.isFile()) {
        throw new Error(`content/blog/${entry.name}/index.md: Cannot find the paper PDF "${post.paperPdf}" as a regular file.`);
      }
      posts.push(post);
    } catch (error) {
      if (!skipInvalidPosts) throw error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[blog] Skipping incomplete post "${entry.name}" (${filename}): ${message}`);
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getPost(slug: string, options?: PostOptions): BlogPost | undefined {
  if (!validSlug.test(slug)) return undefined;
  return getPosts(options).find((post) => post.slug === slug);
}

export function formatPostAuthors(authors: BlogAuthor[]): string {
  return new Intl.ListFormat('en').format(authors.map(({ name }) => name));
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
