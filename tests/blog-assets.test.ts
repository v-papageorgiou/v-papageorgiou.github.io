import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { syncBlogAssets } from '../scripts/blog-assets';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-blog-assets-'));
  const directory = path.join(root, 'content');
  const destination = path.join(root, 'public');
  const write = (relative: string, contents: string) => {
    const file = path.join(directory, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
    return file;
  };
  const post = (slug: string, draft = false) => write(`${slug}/index.md`,
    `---\ntitle: "Post"\nauthors: ["Test Author"]\ndate: "2026-11-12"\ndraft: ${draft}\n---\nBody.`);
  return { root, directory, destination, write, post };
}

test('folder assets retain their paths while source, hidden files, symlinks, and production drafts are excluded', () => {
  const f = fixture();
  try {
    f.post('published');
    f.post('draft', true);
    f.write('published/figs/plot.png', 'image');
    f.write('published/figs/vector.SVG', 'vector');
    f.write('published/results.pdf', 'pdf');
    f.write('published/data.csv', 'x,y\n1,2');
    f.write('published/notes.md', 'Private source notes.');
    f.write('published/plot.py', 'print("source")');
    f.write('published/index.html', 'Must not overwrite the article route.');
    f.write('published/.hidden.png', 'hidden');
    f.write('published/.notes/plot.png', 'hidden folder');
    f.write('draft/figs/plot.png', 'draft image');
    const outside = f.write('not-a-post/unrelated.png', 'outside the post');
    fs.symlinkSync(outside, path.join(f.directory, 'published', 'linked.png'));
    syncBlogAssets(f);
    for (const asset of ['figs/plot.png', 'figs/vector.SVG', 'results.pdf', 'data.csv']) {
      assert.deepEqual(fs.readFileSync(path.join(f.destination, 'published', asset)), fs.readFileSync(path.join(f.directory, 'published', asset)));
    }
    for (const asset of ['index.md', 'notes.md', 'plot.py', 'index.html', '.hidden.png', '.notes', 'linked.png']) {
      assert.equal(fs.existsSync(path.join(f.destination, 'published', asset)), false, asset);
    }
    assert.equal(fs.existsSync(path.join(f.destination, 'draft')), false);
    assert.equal(fs.existsSync(path.join(f.destination, 'not-a-post')), false);
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('asset sync handles additions, edits, renames, deletions, and switching from dev to production', () => {
  const f = fixture();
  try {
    f.post('published');
    f.post('draft', true);
    const figure = f.write('published/figs/plot.png', 'before');
    f.write('draft/figs/plot.png', 'draft');
    syncBlogAssets({ ...f, includeDrafts: true });
    assert.equal(fs.existsSync(path.join(f.destination, 'draft/figs/plot.png')), true);

    fs.writeFileSync(figure, 'edited');
    const updated = new Date(Date.now() + 2000);
    fs.utimesSync(figure, updated, updated);
    f.write('published/new.pdf', 'new');
    syncBlogAssets(f);
    assert.equal(fs.readFileSync(path.join(f.destination, 'published/figs/plot.png'), 'utf8'), 'edited');
    assert.equal(fs.existsSync(path.join(f.destination, 'published/new.pdf')), true);
    assert.equal(fs.existsSync(path.join(f.destination, 'draft')), false);

    fs.renameSync(figure, path.join(f.directory, 'published/figs/renamed.png'));
    fs.unlinkSync(path.join(f.directory, 'published/new.pdf'));
    syncBlogAssets(f);
    assert.equal(fs.existsSync(path.join(f.destination, 'published/figs/plot.png')), false);
    assert.equal(fs.existsSync(path.join(f.destination, 'published/figs/renamed.png')), true);
    assert.equal(fs.existsSync(path.join(f.destination, 'published/new.pdf')), false);

    f.post('published', true);
    syncBlogAssets(f);
    assert.deepEqual(fs.readdirSync(f.destination), []);
    syncBlogAssets({ ...f, includeDrafts: true });
    fs.rmSync(f.directory, { recursive: true });
    syncBlogAssets(f);
    assert.deepEqual(fs.readdirSync(f.destination), []);
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('a root index.txt asset cannot overwrite the exported page data', () => {
  const f = fixture();
  try {
    f.post('published');
    f.write('published/index.txt', 'An asset, not Next.js page data.');
    assert.throws(() => syncBlogAssets(f), /index.txt is reserved for Next.js page data/);
    fs.unlinkSync(path.join(f.directory, 'published/index.txt'));
    f.write('published/data/index.txt', 'A text download in a subfolder.');
    syncBlogAssets(f);
    assert.equal(fs.readFileSync(path.join(f.destination, 'published/data/index.txt'), 'utf8'), 'A text download in a subfolder.');
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});

test('dev asset preparation tolerates incomplete posts and production excludes unfinished drafts', (t) => {
  const f = fixture();
  t.mock.method(console, 'warn', () => {});
  try {
    f.post('published');
    f.write('published/figs/plot.png', 'published image');
    const filename = f.post('unfinished', true);
    f.write('unfinished/figs/plot.png', 'draft image');
    const unfinished = fs.readFileSync(filename, 'utf8').replace('authors: ["Test Author"]', 'authors: []');
    fs.writeFileSync(filename, unfinished);
    syncBlogAssets({ ...f, includeDrafts: true, skipInvalidPosts: true });
    assert.equal(fs.existsSync(path.join(f.destination, 'published/figs/plot.png')), true);
    assert.equal(fs.existsSync(path.join(f.destination, 'unfinished')), false);
    assert.doesNotThrow(() => syncBlogAssets(f));
    fs.writeFileSync(filename, unfinished.replace('draft: true', 'draft: false'));
    assert.throws(() => syncBlogAssets(f), /"authors" must be a nonempty list of names/);
  } finally {
    fs.rmSync(f.root, { recursive: true, force: true });
  }
});
