# Writing blog posts

Write ordinary `.md` files in `content/blog/`. Each filename becomes its URL:
`content/blog/my-first-post.md` → `/blog/my-first-post/`.
Use lowercase letters, numbers, and hyphens in filenames.

Start by copying `content/blog/markdown-and-math.md`. It is a draft example,
visible in local development but excluded from production and the sitemap.

## Post metadata

Every post starts with YAML front matter:

```yaml
---
title: "My first post"
description: "A short description for the blog index and search results."
date: "2026-11-02"
draft: true
tags: [Machine learning, Reasoning]
---
```

`title`, `description`, and `date` are required. The date uses `YYYY-MM-DD`.
`tags` is optional. `draft` defaults to `false`; keep it explicitly `true`
until you are ready to publish. Draft values are booleans, not quoted strings.
Dates control ordering, not scheduled publication.

The page already renders your title, description, and date. Start the body
with a paragraph and use `##` for section headings.

## Math

Use `$...$` for inline math:

```markdown
For $x \in \mathbb{R}$, we have $x^2 \geq 0$.
```

Use `$$` on separate lines for display math:

```markdown
$$
\mathcal{L}(\theta) = -\frac{1}{N}\sum_{i=1}^{N}
\log p_{\theta}(y_i \mid x_i).
$$
```

Use environments such as `aligned`, `bmatrix`, and `cases` inside a display
block. A literal dollar sign in prose should be escaped as `\$`.
Backslashes in `.md` files are written once: `\frac`, not `\\frac`.
Code spans and fenced code blocks keep math syntax literal.

Rendering uses `remark-math` and KaTeX at build time, with accessible MathML
alongside the visual output. This supports LaTeX-style equations, not entire
`.tex` documents, arbitrary packages, or a LaTeX preamble.
See [KaTeX's supported functions](https://katex.org/docs/supported.html).
Unsupported commands appear as errors in the local preview; check equations
before publishing.

## Other formatting

Standard Markdown plus tables, task lists, strikethrough, and footnotes are
supported. Use fenced code blocks with an optional language name. Code is
rendered in JetBrains Mono without syntax coloring. Raw HTML is ignored;
React/MDX components are not required.

## Figures and captions

Place figures in `public/blog/` (or a subfolder for each post), then reference
them with a site-relative URL. Leave a blank line above and below the image:

```markdown
![Description of the figure](/blog/my-figure.png)
```

Add an optional quoted title to display a caption beneath the figure:

```markdown
![Validation loss decreases over the training steps.](/blog/my-post/loss.png "Figure 1. Validation loss during training.")
```

The text in square brackets is the alt text for accessibility; the quoted
text is the visible caption. Captions are plain text, with figure numbers
written by you. Figures resize to fit the article on desktop and mobile,
keep their original colors in both themes, and are not clickable. Standalone
figures have no link wrappers, even if the Markdown wraps the image in a link.
Use a separate text link if you want to offer an original file for download.

SVG, PNG, JPG/JPEG, WebP, GIF, AVIF, and PDF figures use the same syntax:

```markdown
![Architecture diagram](/blog/my-post/architecture.svg "Figure 1. The model.")

![Training curve](/blog/my-post/loss.png "Figure 2. Training loss.")

![Evaluation plot](/blog/my-post/results.pdf "Figure 3. Evaluation results.")
```

PDFs render directly in the article using PDF.js, with no clickable image,
toolbar, or link overlays. The first page is shown by default. For another
page, use a fragment: `![Results](/blog/results.pdf#page=2 "Figure 4. Results.")`.
PDF rendering needs JavaScript and loads when the figure approaches the
viewport. Missing, encrypted, or invalid PDFs show an error in the preview.
SVG is useful for vector diagrams; PDF works directly with plots exported
from Matplotlib or LaTeX. EPS and TIFF need to be exported to one of the
supported formats first.

Use `/blog/...` URLs, not `public/blog/...` or paths relative to the Markdown
source file. External HTTPS image URLs also work. External PDFs require the
remote server to allow CORS; putting them in `public/blog/` avoids that issue.

See SVG, PDF, and PNG examples in `content/blog/markdown-and-math.md` and
their matching assets in `public/blog/`.

## Preview, test, and publish

Use Node.js 24 LTS (PDF.js requires Node 22.13 or newer for its tooling).
The npm commands below automatically prepare the PDF worker, fonts, and
support files for local use and static hosting; no external PDF service is used.

```bash
npm run dev
```

Visit `http://localhost:3000/blog/`. Drafts appear with a local-preview label.
The example is at `http://localhost:3000/blog/markdown-and-math/`.

```bash
npm test
npm run build
```

The tests cover Markdown math, figures, captions, code, metadata, and draft filtering. The build
verifies the static export. To publish a post, set `draft: false`, then commit
and push through the existing GitHub Pages workflow. `npm run export` builds
`out/` and adds `.nojekyll`; no server, database, or CMS is needed.
