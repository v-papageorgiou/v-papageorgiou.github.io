# Writing blog posts

Give each post its own folder in `content/blog/`. Write the article in `index.md`
and keep its figures and supporting assets in that same folder:

```text
content/blog/my-first-post/
├── index.md
├── figs/
│   ├── architecture.svg
│   ├── loss.png
│   └── results.pdf
└── data.csv
```

The folder name becomes the URL:
`content/blog/my-first-post/index.md` → `/blog/my-first-post/`.
Use lowercase words separated by hyphens for folder names; numbers are allowed.
The article file must be named `index.md`. Folders without one are not posts.

## Post metadata

Every post starts with YAML front matter:

```yaml
---
title: "My first post"
authors:
  - name: Vasilis Papageorgiou
    affiliation: University of Wisconsin-Madison
date: "2026-11-02"
draft: true
---
```

`title` and `date` are required. The date uses `YYYY-MM-DD`.
For a coauthored post, add one entry per person under `authors`, in byline order.
On the post, each affiliation appears directly below its author’s name.
The blog index lists author names only. A plain name such as `- Alex Smith` also works.
The page’s author metadata lists the names. Posts that omit `authors` use the
site owner’s name and affiliation.
Keep `draft: true` until you are ready to publish. The default is `false`.
Dates control ordering, not scheduled publication.

For a research post with a full-text PDF, put the PDF beside `index.md` and
add `paperPdf: forgetting.pdf` to the front matter, using your filename.
This adds a **PDF version** link to the article and its Blogposts index entry, and gives Google Scholar the post title,
each author's name, the publication date from `date`, and the absolute PDF URL.
Publishing the post makes both the article and its PDF available to crawlers.

To show a figure below the byline on the Blogposts index, add an optional
`indexFigure` to the front matter. Use a path relative to the post folder.

```yaml
indexFigure:
  src: ./figs/loss.png
  alt: "Validation loss decreases as training progresses."
```

You can create a post folder before its content is ready. A folder without
`index.md` is ignored. During `npm run dev`, an incomplete or invalid post
(for example, `title: ""`) produces a terminal warning and is skipped;
the rest of the site keeps running. Complete its metadata and body, then
restart the preview if the post does not appear.

Production builds exclude posts explicitly marked `draft: true` before
validating their remaining fields. Posts marked `draft: false` (or with no
draft flag) must pass all validation before the build can succeed. Keep
`draft: true` while preparing a new post.

The page already renders your title, byline, and date. Start the body
with an optional TL;DR panel or a paragraph, and use `##` for section headings.

## TL;DR summary panel

To show a summary below the byline, put this block immediately
after the closing `---` of your front matter, before the introduction:

```markdown
> **TL;DR**
>
> - State the main finding.
> - Explain why it matters.
> - Give the reader a practical takeaway.

## Introduction
```

Keep the bold `**TL;DR**` label on its own paragraph, followed by an empty
quoted line (`>`). Prefix every line inside the panel with `>`, including
blank lines. End the panel with a blank, unquoted line. The label is
case-insensitive; an ordinary blockquote without this label stays a quotation.

The panel uses upright text, a subtle border, and theme-aware background and
text colors. It is always expanded and appears in both local preview and the
published post, including print. It is not a local-only TODO note.

Aim for 2–4 short bullets. Paragraphs, emphasis, links, math, and footnote
citations work inside the panel. Keep using the same reference keys; citing a
paper here makes this its first citation for numbering and margin positioning.
In other Markdown editors, this syntax remains a readable blockquote.

## Linking to sections

Each Markdown heading automatically gets a link anchor. Use `section-` followed
by the lowercase heading text, with spaces replaced by hyphens and punctuation
removed. Formatting is ignored; math contributes its rendered text, not LaTeX
commands. For example:

```markdown
See [the cost-of-pass definition](#section-measuring-forgetting-via-cost-of-pass).

## Measuring Forgetting via $\text{cost-of-pass}$
```

These links jump to the section with space below the fixed navigation bar.
You can also append the `#section-...` fragment to a post's URL when sharing it.
Repeated headings get suffixes such as `-2` and `-3`. Update your links if you
rename a heading. The generated TL;DR label and bottom References heading use
their existing behavior; the latter retains its `#footnote-label` anchor.

## Math

Use `$...$` for inline math:

```markdown
For $x \in \mathbb{R}$, we have $x^2 \geq 0$.
```

Use `$$` on separate lines for centered display math with full-size fractions:

```markdown
$$
\mathcal{L}(\theta) = -\frac{1}{N}\sum_{i=1}^{N}
\log p_{\theta}(y_i \mid x_i).
$$
```

Keep each `$$` delimiter on its own line, with a blank line before and after
the whole block. Writing `$$equation$$` on one line is treated as inline math
by this site's parser, so it does not get display centering or full-size fractions.

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

## TODO notes for local preview

Leave editing reminders as HTML comments in `index.md`:

```markdown
<!-- TODO: Add a citation and explain this more clearly. -->

<!-- FIXME: Check the numbers in Figure 2. -->
```

With `npm run dev`, **TODO** notes appear in amber and **FIXME** notes in rose,
with matching colors in light and dark themes. They work on any post in local
development, including posts with `draft: false`. A standalone comment becomes
a callout; leave a blank line before and after it. You can also write a short
inline note:

```markdown
This result is promising. <!-- TODO: Quantify the improvement. -->
```

For longer reminders, use a multiline comment:

```markdown
<!-- TODO:
Add the ablation figure.
Explain how the compute budget was measured.
-->
```

Keep the colon after `TODO` or `FIXME` and close the comment with `-->`.
Labels are case-insensitive. Note bodies are plain text, so Markdown and HTML
inside a note are displayed literally. Comments inside code blocks or inline
code are ordinary code examples, not editing notes. Other HTML comments remain
hidden, including in local preview.

`npm run build` and `npm run export` omit editing notes and their text from the
rendered article. They also stay hidden when serving `out/` locally or printing
the preview. No manual cleanup or front matter setting is needed to hide them
on the published website. The comments remain in your Markdown source, so they
can still be read in the repository if you push that source to GitHub.

Use **Cmd+Shift+F** in VS Code to find `TODO:` or `FIXME:` across posts.

## References and margin notes

Use Markdown footnotes to cite papers, books, websites, or explanatory notes.
Place a citation key after the relevant text and define that key once, usually
at the end of the source file:

```markdown
This result follows from earlier work.[^smith2026]
Another source provides a different perspective.[^jones2025]

We can cite the first paper again.[^smith2026]

[^smith2026]: A. Smith. *Paper title*. Conference, 2026. [Read paper](https://example.com/paper).

[^jones2025]: B. Jones. *Another paper*. Journal, 2025. [DOI](https://doi.org/your-doi).
```

Replace the example authors, titles, and URLs with your actual sources.
Paper links in the margin and the bottom reference list open in a new tab.
Use descriptive keys without spaces, such as `smith2026` or `transformer`.
The keys are for writing; readers see numbers assigned in order of first
citation. Reusing a key reuses its number and creates only one reference entry.
The order of definitions at the bottom of the source does not control numbering.
Unused definitions do not appear in the rendered list.

Inline citations appear in brackets: `[1]` for one source and `[1, 2]` for
adjacent sources. Each number links to its own reference. Keep using normal
footnote syntax; adjacent markers are grouped automatically, with or without
spaces between them:

```markdown
Both papers support this result.[^smith2026][^jones2025]
```

The site displays references in two places from the same definition:

- **Right margin:** on laptop and wider screens (at least 1024 CSS pixels with the default
  browser font size), each numbered reference appears near its first citation.
  Nearby notes stack to avoid overlapping. The article shifts left as needed
  to fit the references, keeping its full reading width from 1120 pixels up.
- **Bottom of the post:** a visible **References** section always lists all
  cited sources, with matching numbers and links back to each citation.
- **Narrow screens:** margin notes are hidden; clicking a citation jumps to the
  bottom entry. Clicking a margin note's number also jumps to its bottom entry.

Do not manually number references or add a `## References` heading: the site
generates both. Reference text supports Markdown links, emphasis, and math.
For a definition with multiple paragraphs, indent continuation paragraphs by
four spaces:

```markdown
[^detail]: The first paragraph of a longer note.

    A second paragraph with more detail.
```

Keep references concise so they fit comfortably in the margin. Explanatory
footnotes use the same numbering and appear in the same References section.
Enter bibliographic details yourself; there is no BibTeX or citation-manager
import. Margin positioning uses JavaScript and adjusts when fonts or figures
load. The bottom list and citation links also work with JavaScript disabled
and in print.

## Figures and captions

Keep figures inside the post's folder, optionally in a `figs/` subfolder.
Reference them relative to `index.md`, so the same paths work in VS Code's
Markdown preview and on the website. Leave a blank line above and below images:

```markdown
![Description of the figure](./figs/my-figure.png)
```

Add an optional quoted title to display a caption beneath the figure:

```markdown
![Validation loss decreases over the training steps.](./figs/loss.png "Figure 1. Validation loss during training.")
```

The text in square brackets is the alt text for accessibility; the quoted
text is the visible caption. Captions are plain text, with figure numbers
written by you. Standalone figures fill the article column on desktop and
mobile, scaling up or down while preserving their aspect ratio. They keep
their original colors in both themes and are not clickable. Standalone
figures have no link wrappers, even if the Markdown wraps the image in a link.
Use a separate text link if you want to offer an original file for download.

Link to figures within the post using ordinary Markdown links:

```markdown
See [Figure 1](#figure-1) for the training curves.
Compare [Figure 4a](#figure-4) with [Figure 5](#figure-5).
```

Standalone figures automatically receive `figure-1`, `figure-2`, and so on,
in their order in the post, including figures without captions. Inline images
within sentences do not count. Keep the numbers in your captions and links
in sync when adding or reordering figures. A panel reference such as Figure 4a
links to the whole Figure 4. Figure links work without JavaScript and leave
space for the navigation bar above the target.

SVG, PNG, JPG/JPEG, WebP, GIF, AVIF, and PDF figures use the same syntax:

```markdown
![Architecture diagram](./figs/architecture.svg "Figure 1. The model.")

![Training curve](./figs/loss.png "Figure 2. Training loss.")

![Evaluation plot](./figs/results.pdf "Figure 3. Evaluation results.")
```

PDFs render directly in the article using PDF.js, with no clickable image,
toolbar, or link overlays. The first page is shown by default. For another
page, use a fragment: `![Results](./figs/results.pdf#page=2 "Figure 4. Results.")`.
PDF rendering needs JavaScript and loads when the figure approaches the
viewport. Missing, encrypted, or invalid PDFs show an error in the preview.
SVG is useful for vector diagrams; PDF works directly with plots exported
from Matplotlib or LaTeX. EPS and TIFF need to be exported to one of the
supported formats first.

You can also place a figure directly beside `index.md` and use `./plot.png`.
For downloads, use ordinary links such as `[Download data](./data.csv)`.
Use lowercase filenames with hyphens where possible. External HTTPS image URLs
also work. External PDFs require the remote server to allow CORS; keeping the
PDF in your post's folder avoids that issue.

`npm run dev` automatically copies assets and watches for additions, changes,
renames, and deletions. Refresh the browser after saving. Both `npm run build`
and `npm run export` prepare the assets for published posts before building.
For example, `content/blog/my-first-post/figs/loss.png` is served at
`/blog/my-first-post/figs/loss.png`; your Markdown only needs `./figs/loss.png`.

The generated copies live in `public/blog/`, which is ignored by Git. Edit and
commit files in `content/blog/<post-name>/` only. Generated copies are refreshed
automatically, and removed assets are cleaned up. Draft assets appear in local
development but are excluded from production builds.

Supported asset extensions are `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`,
`.avif`, `.pdf`, `.csv`, `.tsv`, `.json`, `.txt`, `.bib`, `.zip`, `.mp4`, `.webm`,
`.mp3`, `.wav`, and `.ogg`. All supported assets in a published post's folder
are public, including ones not linked from the article. Markdown source, code
files, hidden files/folders, and symlinks are not copied. Keep original scripts
or notes in the post folder if useful; link to a ZIP if you want to offer code
for download.

Reserve `index.txt` at the top of a post folder for the site's generated page
data. Name a text download differently or place it in a subfolder.

## Writing, testing, and publishing with VS Code

The usual workflow is: **create a branch → write and preview → test → commit →
merge into `main` → push to publish**. Replace `my-first-post` below with your
post's folder slug. Run commands from the repository root.

### 1. Open the project and create a writing branch

Open the `vibe-website` folder in VS Code, then choose **Terminal → New Terminal**.
Check your current work before switching branches:

```bash
git status
```

Commit any existing work that you intend to keep on its current branch before
continuing. Leave unrelated files out of the post's commit. Then update `main`
and create your writing branch:

```bash
git switch main
git pull --ff-only origin main
git switch -c codex/blog-my-first-post
```

VS Code shows the active branch in its bottom-left corner. The branch picker
there also lets you create or switch branches. You can use the Source Control
view to inspect diffs, stage individual files, and commit.

Use **Node.js 24**, matching `.github/workflows/deploy.yml`. Check your version
with `node --version`. On first setup, or after dependencies change, install
the versions recorded in the lockfile:

```bash
npm ci
```

### 2. Write the post

Create a folder for the post and its figures.

```bash
mkdir -p content/blog/my-first-post/figs
touch content/blog/my-first-post/index.md
```

Open `index.md` in VS Code and paste the front matter from [Post metadata](#post-metadata).
Set the title, authors, and date. Keep `draft: true` while writing.

Write your text below the closing `---`. Use `##` for sections, `$...$` and
`$$` for math, and `[^key]` for references as described above. Put figures in
`content/blog/my-first-post/figs/` and reference them with `./figs/...` URLs.
Save your edits before previewing or testing.

### 3. Preview locally while writing

```bash
npm run dev
```

Keep this terminal running and open:

- Blog index: <http://localhost:3000/blog/>
- Your post: <http://localhost:3000/blog/my-first-post/>

Use the address printed by the server if port 3000 is already occupied.
Save and refresh to inspect changes. If a newly added post does not appear,
stop the server with **Ctrl+C** and run `npm run dev` again.

The preview uses the files in your checked-out branch. Drafts appear locally
with a preview label and are excluded from production pages and the sitemap.
`draft` controls website visibility; files pushed to a public repository,
including writing branches, are still visible in that repository.

Check equations, captions, reference numbering, repeated citations, and links.
Widen the browser to see the margin notes, then narrow it to check the mobile
layout and bottom references. Check both light and dark themes.

#### Share a draft privately as one HTML file

Keep `npm run dev` running. In a second terminal, run the command below with
your post's folder name. It uses Python 3 and Beautiful Soup (`beautifulsoup4`).

```bash
python3 scripts/share-blog.py my-first-post
```

Send `build/previews/my-first-post.html` to your reviewer. They can download it
and open it in a browser. The file includes the article, its local image figures
(including animated GIFs), styles, and fonts. Links to external papers still open online.
Run the command again after edits to make a fresh copy. If your dev server uses
another port, add `--port 3001` with the port printed in your terminal.

### 4. Test the publishable version

When ready to publish, set the post's front matter to:

```yaml
draft: false
```

Stop the development server with **Ctrl+C**, then run:

```bash
npm test && npm run export
```

The tests cover metadata, draft filtering, asset copying, Markdown, math,
figures, and references. The export runs the production build used by GitHub Pages, writes
`out/`, and adds `.nojekyll`. Both commands must succeed before publishing.
The npm scripts also prepare the post assets and local PDF support automatically.

To inspect the actual production output, serve it locally (requires Python 3):

```bash
python3 -m http.server 8000 --directory out
```

Visit <http://localhost:8000/blog/my-first-post/> and check the final result.
A post with `draft: true` will be absent from this production preview. Stop
the server with **Ctrl+C** afterward. Rebuild if you make further edits.
Use this static server for `out/`; `npm start` is not the preview command for
this site's static export.

### 5. Commit on the writing branch

Stage the whole post folder, including the Markdown and figures:

```bash
git add content/blog/my-first-post/
```

Review the staged changes and commit:

```bash
git diff --cached
git commit -m "Add my first blog post"
```

Stage only the source files and figures belonging to your change. Generated
folders such as `out/`, `.next/`, `public/blog/`, and `public/_pdfjs/` are ignored.

Optionally back up your branch on GitHub:

```bash
git push -u origin codex/blog-my-first-post
```

You can commit and push to this branch throughout writing, including while
`draft: true`. A push to a writing branch does **not** deploy the website.
For later sessions, switch back with `git switch codex/blog-my-first-post`.

### 6. Merge into main and publish

With the final changes committed and checks passing:

```bash
git switch main
git pull --ff-only origin main
git merge --ff-only codex/blog-my-first-post
git push origin main
```

Run these commands in order and stop if one fails. The fast-forward merge
publishes the same commits you tested. If `main` has advanced and the merge
refuses to fast-forward, update your writing branch first:

```bash
git switch codex/blog-my-first-post
git merge main
```

If Git reports conflicts, resolve them in VS Code, stage each resolved file
with `git add <path>`, and finish the merge with `git commit`. To abandon an
unresolved merge, use `git merge --abort`. After a successful merge, rerun
`npm test && npm run export`, inspect the result, and repeat the publishing
commands above.

If the final push is rejected because GitHub has newer commits, bring those
commits into the writing branch:

```bash
git switch codex/blog-my-first-post
git fetch origin
git merge origin/main
```

Resolve any conflicts and finish the merge as described above. Rerun
`npm test && npm run export` and inspect the result. Your local `main` already
contains your earlier merge, so finish this recovery with:

```bash
git switch main
git merge --ff-only codex/blog-my-first-post
git push origin main
```

If another remote update races with this push, repeat the recovery. Do not
force-push.

A push to `main` triggers `.github/workflows/deploy.yml`. Follow the build and
deployment in the repository's [Actions tab](https://github.com/v-papageorgiou/v-papageorgiou.github.io/actions).
Once deployment succeeds, check the [live blog](https://v-papageorgiou.github.io/blog/).
Pushing a branch or making a local commit alone does not publish the post.

After successful publication, you can delete the merged local writing branch
while on `main`:

```bash
git branch -d codex/blog-my-first-post
```
