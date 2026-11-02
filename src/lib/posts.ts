import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  tags: string[];
  readingMinutes: number;
  content: string;
}

interface PostOptions {
  includeDrafts?: boolean;
  directory?: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'blog');
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parsePost(source: string, slug: string): BlogPost {
  if (!validSlug.test(slug)) {
    throw new Error(`Invalid blog filename "${slug}.md". Use lowercase words separated by hyphens.`);
  }

  const { data, content } = matter(source);
  const fail = (message: string): never => {
    throw new Error(`content/blog/${slug}.md: ${message}`);
  };

  const requiredText = (field: string): string => {
    const value: unknown = data[field];
    if (typeof value !== 'string' || !value.trim()) return fail(`"${field}" must be a nonempty string.`);
    return value.trim();
  };

  const title = requiredText('title');
  const description = requiredText('description');
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
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag: unknown) => typeof tag !== 'string'))) {
    return fail('"tags" must be a list of strings.');
  }
  if (!content.trim()) return fail('The post body is empty.');

  return {
    slug,
    title,
    description,
    date,
    draft: data.draft === true,
    tags: data.tags ?? [],
    readingMinutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200)),
    content,
  };
}

export function getPosts({ includeDrafts = process.env.NODE_ENV === 'development', directory = postsDirectory }: PostOptions = {}): BlogPost[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => parsePost(fs.readFileSync(path.join(directory, entry.name), 'utf8'), entry.name.slice(0, -3)))
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getPost(slug: string, options?: PostOptions): BlogPost | undefined {
  if (!validSlug.test(slug)) return undefined;
  return getPosts(options).find((post) => post.slug === slug);
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
