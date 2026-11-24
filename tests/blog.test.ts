import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from '../src/components/Markdown';
import { formatPostAuthors, formatPostDate, getPost, getPosts, parsePost } from '../src/lib/posts';
import { getPdfFigure } from '../src/lib/figure-source';

function source(date: string, draft = false) {
  return `---\ntitle: "Test post"\nauthors: ["Test Author"]\ndate: "${date}"\ndraft: ${draft}\n---\nA useful post.`;
}

function render(content: string) {
  return renderToStaticMarkup(React.createElement(Markdown, { content }));
}

test('posts are sorted newest first and drafts stay out of public listings and direct lookups', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-blog-test-'));
  try {
    for (const [slug, date, draft] of [
      ['older', '2026-10-01', false],
      ['newer', '2026-11-02', false],
      ['private-draft', '2026-11-03', true],
    ] as const) {
      fs.mkdirSync(path.join(directory, slug));
      fs.writeFileSync(path.join(directory, slug, 'index.md'), source(date, draft));
      fs.writeFileSync(path.join(directory, slug, 'notes.md'), 'An extra source file, not another post.');
    }
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

test('local preview skips unfinished posts with warnings and keeps valid posts available', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-blog-incomplete-'));
  const warning = t.mock.method(console, 'warn', () => {});
  try {
    for (const slug of ['valid', 'unfinished-draft', 'unfinished-published']) {
      fs.mkdirSync(path.join(directory, slug));
      const content = source('2026-11-12', slug === 'unfinished-draft');
      fs.writeFileSync(path.join(directory, slug, 'index.md'), slug === 'valid'
        ? content : content.replace('authors: ["Test Author"]', 'authors: []'));
    }
    const options = { directory, includeDrafts: true, skipInvalidPosts: true };
    assert.deepEqual(getPosts(options).map((post) => post.slug), ['valid']);
    assert.equal(warning.mock.callCount(), 2);
    assert.match(String(warning.mock.calls[0].arguments[0]), /Skipping incomplete post.*authors/);
    assert.equal(getPost('valid', options)?.title, 'Test post');
    assert.equal(getPost('unfinished-draft', options), undefined);
    assert.throws(() => getPosts({ directory, includeDrafts: false, skipInvalidPosts: false }), /unfinished-published\/index.md: "authors"/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('production excludes unfinished explicit drafts but validates them when published', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-blog-draft-'));
  try {
    fs.mkdirSync(path.join(directory, 'work-in-progress'));
    const filename = path.join(directory, 'work-in-progress', 'index.md');
    const unfinished = source('2026-11-12', true).replace('authors: ["Test Author"]', 'authors: []');
    fs.writeFileSync(filename, unfinished);
    const options = { directory, includeDrafts: false, skipInvalidPosts: false };
    assert.deepEqual(getPosts(options), []);
    assert.equal(getPost('work-in-progress', options), undefined);
    fs.writeFileSync(filename, unfinished.replace('draft: true', 'draft: false'));
    assert.throws(() => getPosts(options), /"authors" must be a nonempty list of names/);
    fs.writeFileSync(filename, unfinished.replace('draft: true', 'draft: "true"'));
    assert.throws(() => getPosts(options), /"authors" must be a nonempty list of names/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('front matter rejects invalid dates and ambiguous draft flags with actionable errors', () => {
  assert.throws(() => parsePost(source('2026-02-30'), 'invalid-date'), /valid calendar date/);
  assert.throws(() => parsePost(source('2026-11-02').replace('draft: false', 'draft: "false"'), 'bad-draft'), /without quotes/);
  assert.throws(() => parsePost(source('2026-11-02').replace('title:', 'missing:'), 'no-title'), /no-title\/index.md: "title"/);
  assert.throws(() => parsePost(source('2026-11-02'), '../escape'), /Invalid blog folder/);
  assert.equal(parsePost(source('2026-11-02').replace('"2026-11-02"', '2026-11-02'), 'yaml-date').date, '2026-11-02');
  assert.equal(formatPostDate('2026-11-02'), 'November 2, 2026');
});

test('a paper PDF must be an exportable file beside the article', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-blog-paper-'));
  try {
    const folder = path.join(directory, 'paper');
    fs.mkdirSync(folder);
    const post = source('2026-11-19');
    const withPdf = (name: string) => post.replace('draft: false', `paperPdf: "${name}"`);
    assert.equal(parsePost(post, 'paper').paperPdf, undefined);
    for (const name of ['../other.pdf', 'figs/paper.pdf', '.hidden.pdf', 'plot.svg']) {
      assert.throws(() => parsePost(withPdf(name), 'paper'), /PDF filename/);
    }
    fs.writeFileSync(path.join(folder, 'index.md'), withPdf('Full text.pdf'));
    assert.throws(() => getPosts({ directory, skipInvalidPosts: false }), /Cannot find the paper PDF/);
    fs.writeFileSync(path.join(folder, 'Full text.pdf'), '%PDF-');
    assert.equal(getPost('paper', { directory })?.paperPdf, 'Full text.pdf');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('optional index figures resolve relative to their post folder', () => {
  const post = source('2026-11-02');
  const withFigure = (src: string) => post.replace('draft: false', `indexFigure:\n  src: "${src}"\n  alt: "Validation loss"`);
  assert.equal(parsePost(post, 'example').indexFigure, undefined);
  assert.deepEqual(parsePost(withFigure('./figs/loss curve.svg'), 'example').indexFigure, {
    src: '/blog/example/figs/loss%20curve.svg', alt: 'Validation loss',
  });
  assert.throws(() => parsePost(withFigure('../other/figs/loss.svg'), 'example'), /inside the post folder/);
});

test('author lists preserve byline order and older posts default to the site author', () => {
  const example = source('2026-11-02');
  const parse = (field: string) => parsePost(example.replace('authors: ["Test Author"]', field), 'byline');
  const authors = parse('authors:\n  - name: First Author\n    affiliation: " First University "\n  - " Second Author "').authors;
  assert.deepEqual(authors, [{ name: 'First Author', affiliation: 'First University' }, { name: 'Second Author' }]);
  assert.equal(formatPostAuthors(authors), 'First Author and Second Author');
  assert.deepEqual(parse('description: "An older post"\ntags: [Notes]').authors,
    [{ name: 'Vasilis Papageorgiou', affiliation: 'University of Wisconsin-Madison' }]);
  for (const invalid of ['authors: Someone', 'authors: []', 'authors: [Someone, " "]', 'authors: [42]', 'authors: null']) {
    assert.throws(() => parse(invalid), /nonempty list of names|nonempty name/);
  }
  assert.throws(() => parse('authors: [{affiliation: University}]'), /nonempty name/);
  assert.throws(() => parse('authors: [{name: Someone, affiliation: 42}]'), /affiliation for "Someone"/);
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

test('references are numbered by first citation and appear once in each list with intact return links', () => {
  const html = render(`First source.[^second] Another source.[^first]

The first source again.[^second]

[^first]: Alpha author. *Alpha title*. [Paper](https://example.com/alpha).
[^second]: Beta author. **Beta title**. [Paper](https://example.com/beta).
[^unused]: An uncited definition.`);
  const margin = html.split('<aside')[1]?.split('</aside>')[0];
  const footer = html.split('<section data-footnotes')[1];
  assert.ok(margin && footer);
  assert.match(html, /<h2 class="blog-references-heading" id="footnote-label">References<\/h2>/);
  assert.equal((margin.match(/class="blog-margin-note"/g) ?? []).length, 2);
  assert.match(margin, /data-reference-anchor="user-content-fnref-second"/);
  assert.doesNotMatch(margin, /data-reference-anchor="user-content-fnref-second-2"|data-footnote-backref/);
  assert.match(margin, /href="#user-content-fn-second" aria-label="Reference 1">1<\/a>/);
  assert.match(margin, /<strong>Beta title<\/strong>/);
  assert.match(footer, /<em>Alpha title<\/em>/);
  for (const references of [margin, footer]) {
    for (const paper of ['alpha', 'beta']) {
      assert.ok(references.includes(`href="https://example.com/${paper}" target="_blank" rel="noopener noreferrer"`));
    }
  }
  assert.doesNotMatch(html, /<a\b[^>]*href="#[^"]*"[^>]*target=/);
  assert.match(footer, /href="#user-content-fnref-second"/);
  assert.match(footer, /href="#user-content-fnref-second-2"/);
  assert.ok(footer.indexOf('Beta author') < footer.indexOf('Alpha author'));
  assert.equal((html.match(/Beta author/g) ?? []).length, 2);
  assert.doesNotMatch(html, /An uncited definition/);
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'margin copies must not duplicate IDs');
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(target), `missing link target: ${target}`);
  }
});

test('adjacent and whitespace-separated citations form bracketed groups with intact links', () => {
  const html = render(`Together.[^one][^two] Repeated.[^one]

Spaced.[^two] \n[^three]

[^three]: Third source.
[^two]: Second source.
[^one]: First source.`);
  const groups = Array.from(html.matchAll(/<sup class="blog-citation">([\s\S]*?)<\/sup>/g), (match) => match[1]);
  assert.deepEqual(groups.map((group) => group.replace(/<[^>]+>/g, '')), ['[1, 2]', '[1]', '[2, 3]']);
  assert.equal((groups[0].match(/data-footnote-ref/g) ?? []).length, 2);
  assert.match(groups[0], /href="#user-content-fn-one" id="user-content-fnref-one"/);
  assert.match(groups[0], /href="#user-content-fn-two" id="user-content-fnref-two"/);
  assert.match(html, /href="#user-content-fnref-one-2"/);
  assert.match(html, /href="#user-content-fnref-two-2"/);
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(target), `missing link target: ${target}`);
  }
  assert.equal((html.match(/class="blog-margin-note"/g) ?? []).length, 3);
});

test('citation groups keep multi-digit numbers distinct', () => {
  const keys = Array.from({ length: 12 }, (_, index) => `source${index + 1}`);
  const definitions = keys.map((key) => `[^${key}]: Reference ${key}.`).join('\n');
  const html = render(`${keys.slice(0, 11).map((key) => `A source.[^${key}]`).join(' ')}

A pair.[^source1][^source12]

${definitions}`);
  const groups = Array.from(html.matchAll(/<sup class="blog-citation">([\s\S]*?)<\/sup>/g), (match) => match[1].replace(/<[^>]+>/g, ''));
  assert.equal(groups.at(-1), '[1, 12]');
});

test('citation grouping preserves punctuation, paragraphs, math and literal code', () => {
  const html = render('Separate.[^one], [^two]; **another claim**[^one].\n\nNext paragraph.[^two]\n\nMath $x^2$ and code `[^one][^two]`.\n\n[^one]: First source.\n[^two]: Second source.');
  const groups = Array.from(html.matchAll(/<sup class="blog-citation">([\s\S]*?)<\/sup>/g), (match) => match[1].replace(/<[^>]+>/g, ''));
  assert.deepEqual(groups, ['[1]', '[2]', '[1]', '[2]']);
  assert.match(html, /<\/sup>, <sup/);
  assert.match(html, /<strong>another claim<\/strong>/);
  assert.match(html, /<p>Next paragraph\./);
  assert.match(html, /<code>\[\^one\]\[\^two\]<\/code>/);
  assert.match(html, /class="katex"/);
});

test('margin references preserve multiline Markdown and math while keeping unsafe content inert', () => {
  const html = render(String.raw`A note in a list:

- Read this.[^detailed]

[^detailed]: A reference with $x^2$, *emphasis*, and [a source](https://example.com).

    A second paragraph with [unsafe](javascript:alert%281%29).

    <script>alert(1)</script>`);
  assert.equal((html.match(/A second paragraph/g) ?? []).length, 2);
  assert.equal((html.match(/class="katex"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /<script|href="javascript:/);
  assert.match(html, /<aside[^>]*hidden=""/);
});

test('posts without citations do not gain a margin or empty references section', () => {
  const html = render('A normal post.\n\n[^unused]: An unused note.');
  assert.doesNotMatch(html, /<aside|blog-reference-layout|data-footnotes|References/);
  assert.match(html, /<p>A normal post\.<\/p>/);
});

test('display math renders aligned equations and matrices without math errors', () => {
  const html = render(String.raw`$$
\begin{aligned} x &= 1 \\ y &= 2 \end{aligned}
$$

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}
$$`);
  assert.doesNotMatch(html, /katex-error/);
  assert.equal((html.match(/class="katex-display"/g) ?? []).length, 2);
});

test('raw HTML and executable link protocols do not become executable article markup', () => {
  const html = render('<script>alert(1)</script>\n\n[unsafe](javascript:alert%281%29)');
  assert.doesNotMatch(html, /<script|href="javascript:/);
});

test('TL;DR panels preserve lists, formatting, math, and linked references', () => {
  const html = render(String.raw`> **TL;DR**
>
> - Compare **accuracy** and $p_\theta(x)$.[^paper]
> - Read the [paper](https://example.com/paper).
>
> A short explanation.

## Introduction

[^paper]: A reference.`);
  assert.match(html, /<section class="blog-tldr" aria-label="TL;DR">/);
  assert.match(html, /<h2 class="blog-tldr-title">TL;DR<\/h2>/);
  assert.match(html, /<ul>/);
  assert.match(html, /<strong>accuracy<\/strong>/);
  assert.match(html, /class="katex"/);
  assert.match(html, /href="https:\/\/example.com\/paper"/);
  assert.match(html, /<p>A short explanation\.<\/p>/);
  assert.match(html, /<\/section>\s*<h2 id="section-introduction">Introduction<\/h2>/);
  assert.match(html, /id="user-content-fn-paper"/);
  assert.match(html, /class="blog-margin-note"/);
  assert.doesNotMatch(html, /<blockquote|katex-error/);
});

test('only a standalone bold TL;DR label opts a blockquote into a panel', () => {
  assert.match(render('> **tl;dr**\n>\n> A summary.'), /class="blog-tldr"/);
  for (const content of [
    '> An ordinary quotation.',
    '> **TL;DR** is mentioned within a sentence.',
    '> `TL;DR`\n>\n> A code label.',
    '```markdown\n> **TL;DR**\n>\n> A literal example.\n```',
  ]) {
    assert.doesNotMatch(render(content), /class="blog-tldr"/);
  }
  assert.match(render('> An ordinary quotation.'), /<blockquote>/);
});

test('section links match heading text, including formatted text and math', () => {
  const html = render(String.raw`See [the definition](#section-measuring-forgetting-via-cost-of-pass).

## Measuring **Forgetting** via $\text{cost-of-pass}$[^paper]

[^paper]: A reference.`);
  assert.match(html, /href="#section-measuring-forgetting-via-cost-of-pass"/);
  assert.match(html, /<h2 id="section-measuring-forgetting-via-cost-of-pass">/);
  assert.match(html, /class="katex"/);
  assert.match(html, /id="footnote-label"/);
  assert.match(html, /id="user-content-fn-paper"/);
});

test('heading anchors are namespaced and remain unique for repeated or empty headings', () => {
  const html = render('## Results\n\n## Results\n\n## Results-2\n\n## Results\n\n##\n\n## location');
  const ids = Array.from(html.matchAll(/ id="([^"]+)"/g), match => match[1]);
  assert.deepEqual(ids, ['section-results', 'section-results-2', 'section-results-2-2', 'section-results-3', 'section-heading', 'section-location']);
  assert.equal(new Set(ids).size, ids.length);
});

test('standalone figures render captions and alt text without links or paragraph wrappers', () => {
  const html = render('Before the figure.\n\n![Loss decreases.](/blog/loss.png "Figure 1. Validation loss.")\n\nAfter the figure.');
  assert.match(html, /<figure class="blog-figure" id="figure-1">/);
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
  assert.match(html, /<figure class="blog-figure" id="figure-1">/);
  assert.match(html, /<canvas[^>]+role="img" aria-label="A diagram\."/);
  assert.match(html, /<figcaption>Figure 2\. A PDF plot\.<\/figcaption>/);
  assert.doesNotMatch(html, /<img\b|<a\b|<iframe\b|<object\b/);
});

test('figure links target standalone images and PDFs in order without counting inline icons', () => {
  const html = render(`See [Figure 1](#figure-1), [Figure 2](#figure-2), [Figure 3](#figure-3), and [Figure 4](#figure-4).

An inline ![icon](/blog/icon.svg) does not count.

![First plot](/blog/first.png "Figure 1. First plot.")

> ![Second plot](/blog/second.svg)

[![Third plot](/blog/third.gif "Figure 3. Third plot.")](/blog/third.gif)

![Fourth plot](/blog/fourth.pdf "Figure 4. Fourth plot.")`);
  const ids = Array.from(html.matchAll(/<figure[^>]+id="([^"]+)"/g), (match) => match[1]);
  assert.deepEqual(ids, ['figure-1', 'figure-2', 'figure-3', 'figure-4']);
  for (const id of ids) assert.ok(html.includes(`href="#${id}"`));
  assert.match(html, /<figure class="blog-figure" id="figure-4"><span class="pdf-figure"/);
  assert.doesNotMatch(html, /<figure[^>]*>\s*<a/);
  assert.match(render('![Another post](/blog/another.svg)'), /id="figure-1"/);
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
