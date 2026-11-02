import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from '../src/components/Markdown';
import { formatPostDate, getPost, getPosts, parsePost } from '../src/lib/posts';
import { getPdfFigure } from '../src/lib/figure-source';

function source(date: string, draft = false) {
  return `---\ntitle: "Test post"\ndescription: "Test description"\ndate: "${date}"\ndraft: ${draft}\n---\nA useful post.`;
}

function render(content: string) {
  return renderToStaticMarkup(React.createElement(Markdown, { content }));
}

test('posts are sorted newest first and drafts stay out of public listings and direct lookups', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-blog-test-'));
  try {
    fs.writeFileSync(path.join(directory, 'older.md'), source('2026-10-01'));
    fs.writeFileSync(path.join(directory, 'newer.md'), source('2026-11-02'));
    fs.writeFileSync(path.join(directory, 'private-draft.md'), source('2026-11-03', true));
    fs.writeFileSync(path.join(directory, 'notes.txt'), 'not a post');
    fs.mkdirSync(path.join(directory, 'assets'));
    const publicOptions = { directory, includeDrafts: false };
    assert.deepEqual(getPosts(publicOptions).map((post) => post.slug), ['newer', 'older']);
    assert.equal(getPost('private-draft', publicOptions), undefined);
    assert.equal(getPost('../private-draft', { directory, includeDrafts: true }), undefined);
    assert.equal(getPost('missing', publicOptions), undefined);
    assert.deepEqual(getPosts({ directory, includeDrafts: true }).map((post) => post.slug), ['private-draft', 'newer', 'older']);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('an empty or missing content directory yields an empty blog', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-blog-empty-'));
  try {
    assert.deepEqual(getPosts({ directory }), []);
    assert.deepEqual(getPosts({ directory: path.join(directory, 'missing') }), []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('front matter rejects invalid dates and ambiguous draft flags with actionable errors', () => {
  assert.throws(() => parsePost(source('2026-02-30'), 'invalid-date'), /valid calendar date/);
  assert.throws(() => parsePost(source('2026-11-02').replace('draft: false', 'draft: "false"'), 'bad-draft'), /without quotes/);
  assert.throws(() => parsePost(source('2026-11-02').replace('title:', 'missing:'), 'no-title'), /no-title.md: "title"/);
  assert.throws(() => parsePost(source('2026-11-02'), '../escape'), /Invalid blog filename/);
  assert.equal(parsePost(source('2026-11-02').replace('"2026-11-02"', '2026-11-02'), 'yaml-date').date, '2026-11-02');
  assert.equal(formatPostDate('2026-11-02'), 'November 2, 2026');
});

test('inline math and display equations render as accessible KaTeX during server rendering', () => {
  const html = render(String.raw`Let $x \in \mathbb{R}$.

$$
\sum_{i=1}^{N} x_i^2
$$`);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /<math[^>]+xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/);
  assert.match(html, /aria-hidden="true"/);
  assert.doesNotMatch(html, /katex-error/);
});

test('code and escaped currency stay literal while tables and footnotes render', () => {
  const html = render('A price of \\$5. Inline code: `$x^2$`.\n\n```tex\n$$ \\sum x_i $$\n```\n\n| Symbol | Meaning |\n| --- | --- |\n| N | Count |\n\nA note.[^one]\n\n[^one]: Footnote text.');
  assert.match(html, /A price of \$5/);
  assert.match(html, /<code>\$x\^2\$<\/code>/);
  assert.doesNotMatch(html, /class="katex"/);
  assert.match(html, /<table>/);
  assert.match(html, /data-footnotes/);
});

test('the real draft example renders aligned equations and matrices without math errors', () => {
  const example = getPost('markdown-and-math', { includeDrafts: true });
  assert.ok(example?.draft);
  const html = render(example.content);
  assert.doesNotMatch(html, /katex-error/);
  assert.equal((html.match(/class="katex-display"/g) ?? []).length, 3);
});

test('raw HTML and executable link protocols do not become executable article markup', () => {
  const html = render('<script>alert(1)</script>\n\n[unsafe](javascript:alert%281%29)');
  assert.doesNotMatch(html, /<script|href="javascript:/);
});

test('standalone figures render captions and alt text without links or paragraph wrappers', () => {
  const html = render('Before the figure.\n\n![Loss decreases.](/blog/loss.png "Figure 1. Validation loss.")\n\nAfter the figure.');
  assert.match(html, /<figure class="blog-figure">/);
  assert.match(html, /<figcaption>Figure 1\. Validation loss\.<\/figcaption>/);
  assert.match(html, /alt="Loss decreases\."/);
  assert.doesNotMatch(html, /<a\b|href=|target=/);
  assert.match(html, /loading="lazy" decoding="async"/);
  assert.doesNotMatch(html, /<p>\s*<figure/);
  assert.match(html, /<p>After the figure\.<\/p>/);
});

test('figures remain non-clickable even with authored links, while inline images retain tooltips', () => {
  const plain = render('![A plot.](/blog/plot.svg)');
  assert.match(plain, /<figure/);
  assert.doesNotMatch(plain, /<figcaption/);
  const linked = render('[![A plot.](/blog/plot.svg "A caption.")](/blog/full-plot.pdf)');
  assert.doesNotMatch(linked, /<a\b|href=/);
  assert.match(linked, /<figcaption>A caption\.<\/figcaption>/);
  const inline = render('An inline ![icon](/blog/icon.svg "Tooltip") in a sentence.');
  assert.doesNotMatch(inline, /<figure|<figcaption/);
  assert.match(inline, /title="Tooltip"/);
});

test('SVG, PNG, JPEG, WebP, GIF, and AVIF figures keep their native image sources', () => {
  for (const extension of ['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif']) {
    const html = render(`![A diagram.](/blog/figure.${extension} "A caption.")`);
    assert.ok(html.includes(`src="/blog/figure.${extension}"`));
    assert.match(html, /<img\b/);
    assert.doesNotMatch(html, /<a\b|<canvas/);
  }
});

test('PDF figures use accessible canvases with captions instead of broken images or viewer links', () => {
  const html = render('![A diagram.](/blog/figure.pdf#page=2 "Figure 2. A PDF plot.")');
  assert.match(html, /<figure class="blog-figure">/);
  assert.match(html, /<canvas[^>]+role="img" aria-label="A diagram\."/);
  assert.match(html, /<figcaption>Figure 2\. A PDF plot\.<\/figcaption>/);
  assert.doesNotMatch(html, /<img\b|<a\b|<iframe\b|<object\b/);
});

test('PDF detection handles query strings, uppercase extensions, page selection, and invalid pages', () => {
  assert.deepEqual(getPdfFigure('/blog/plot.pdf'), { url: '/blog/plot.pdf', page: 1 });
  assert.deepEqual(getPdfFigure('/blog/plot.PDF?version=2#page=3'), { url: '/blog/plot.PDF?version=2', page: 3 });
  for (const page of ['0', '-2', 'word', '1.5', '9007199254740992']) {
    assert.equal(getPdfFigure(`/blog/plot.pdf#page=${page}`)?.page, 1);
  }
  assert.equal(getPdfFigure('/blog/image.png?name=plot.pdf'), undefined);
  assert.equal(getPdfFigure('/blog/file.pdf.png'), undefined);
});

test('captions remain escaped text and reference-style Markdown images also become figures', () => {
  const html = render('![Description][plot]\n\n[plot]: /blog/plot.png "<script>alert(1)</script>"');
  assert.match(html, /<figure/);
  assert.match(html, /<figcaption>&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});
