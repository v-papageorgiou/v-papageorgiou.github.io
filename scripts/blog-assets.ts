import fs from 'node:fs';
import path from 'node:path';
import { getPosts } from '../src/lib/posts';

export const blogDirectory = path.resolve('content/blog');
const assetExtensions = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.pdf',
  '.csv', '.tsv', '.json', '.txt', '.bib', '.zip',
  '.mp4', '.webm', '.mp3', '.wav', '.ogg',
]);

interface AssetOptions {
  directory?: string;
  destination?: string;
  includeDrafts?: boolean;
  skipInvalidPosts?: boolean;
}

// public/blog is generated from the post folders. It mirrors their asset paths,
// so ./figs/plot.png resolves under /blog/<slug>/ in both dev and static exports.
export function syncBlogAssets({
  directory = blogDirectory,
  destination = path.resolve('public/blog'),
  includeDrafts = false,
  skipInvalidPosts = false,
}: AssetOptions = {}) {
  const files = new Map<string, string>();

  function collect(relative: string, isPostRoot = false) {
    for (const entry of fs.readdirSync(path.join(directory, relative), { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const asset = path.join(relative, entry.name);
      if (entry.isDirectory()) collect(asset);
      // Copy only publishable assets, never Markdown, source code, or symlinks.
      else if (entry.isFile() && assetExtensions.has(path.extname(entry.name).toLowerCase())) {
        if (isPostRoot && entry.name.toLowerCase() === 'index.txt') {
          throw new Error(`${asset} is reserved for Next.js page data. Rename this asset or put it in a subfolder.`);
        }
        files.set(asset, path.join(directory, asset));
      }
    }
  }

  for (const post of getPosts({ directory, includeDrafts, skipInvalidPosts })) collect(post.slug, true);
  fs.mkdirSync(destination, { recursive: true });

  function prune(relative = '') {
    for (const entry of fs.readdirSync(path.join(destination, relative), { withFileTypes: true })) {
      const asset = path.join(relative, entry.name);
      const target = path.join(destination, asset);
      if (entry.isDirectory()) {
        prune(asset);
        if (fs.readdirSync(target).length === 0) fs.rmdirSync(target);
      } else if (entry.isSymbolicLink() || !files.has(asset)) {
        fs.unlinkSync(target);
      }
    }
  }
  // Remove deleted files and assets from removed posts or posts made drafts.
  prune();

  for (const [asset, source] of files) {
    const target = path.join(destination, asset);
    const original = fs.statSync(source);
    const existing = fs.existsSync(target) ? fs.statSync(target) : undefined;
    // Text-only edits should not recopy every figure in the blog.
    if (existing?.size === original.size && Math.abs(existing.mtimeMs - original.mtimeMs) < 1) continue;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    fs.utimesSync(target, original.atime, original.mtime);
  }
}
