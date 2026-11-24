import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

// Run the actual server renderer in separate environments, without changing
// NODE_ENV for other tests or exposing a production override on the component.
function render(content: string, environment: 'development' | 'production' | 'test') {
  const result = spawnSync(process.execPath, ['--import', 'tsx', '-e', `
    const React = require('react');
    const { renderToStaticMarkup } = require('react-dom/server');
    const Markdown = require('./src/components/Markdown.tsx').default;
    process.stdout.write(renderToStaticMarkup(React.createElement(Markdown, { content: process.argv[1] })));
  `, '--', content], { encoding: 'utf8', env: { ...process.env, NODE_ENV: environment } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('development renders standalone, adjacent, multiline, and inline editing notes', () => {
  const html = render(`Before. <!-- TODO: Explain the claim. --> After.

<!-- TODO:
Add a figure.
Explain its axes.
-->
<!-- fIxMe: Check the results. -->`, 'development');
  assert.equal((html.match(/role="note"/g) ?? []).length, 3);
  assert.equal((html.match(/<aside /g) ?? []).length, 2);
  assert.match(html, /<span class="blog-editor-note blog-editor-note-todo blog-editor-note-inline"/);
  assert.match(html, /blog-editor-note-fixme/);
  assert.match(html, /Add a figure\.\nExplain its axes\./);
  assert.match(html, />FIXME<\/strong>/);
  assert.match(html, /Before\./);
  assert.match(html, /After\./);
  assert.doesNotMatch(html, /<p>\s*<aside/);
});

test('editing notes are absent from production and other non-development rendering', () => {
  const content = `Public text. <!-- TODO: PRIVATE_INLINE_REMINDER --> More public text.

<!-- TODO: PRIVATE_BLOCK_REMINDER -->
<!-- FIXME: PRIVATE_FIX_REMINDER -->

Final public paragraph.`;
  for (const environment of ['production', 'test'] as const) {
    const html = render(content, environment);
    assert.doesNotMatch(html, /PRIVATE_|blog-editor-note|role="note"|<!--/);
    assert.match(html, /Public text\.\s+More public text\./);
    assert.match(html, /Final public paragraph\./);
  }
});

test('notes stay escaped and ordinary HTML comments remain hidden in development', () => {
  const html = render(`<!-- TODO: Check <img src=x onerror=alert(1)> and **literal Markdown**. -->

<!-- An ordinary hidden comment. -->

<div><!-- TODO: A comment inside raw HTML stays hidden. --></div>`, 'development');
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /\*\*literal Markdown\*\*/);
  assert.doesNotMatch(html, /<img|<script|ordinary hidden comment|inside raw HTML stays hidden/);
  assert.equal((html.match(/role="note"/g) ?? []).length, 1);
});

test('comment syntax inside code stays literal in preview and production', () => {
  const content = 'Inline code: `<!-- TODO: Code example. -->`\n\n```html\n<!-- FIXME: Fenced example. -->\n```';
  for (const environment of ['development', 'production'] as const) {
    const html = render(content, environment);
    assert.match(html, /&lt;!-- TODO: Code example\. --&gt;/);
    assert.match(html, /&lt;!-- FIXME: Fenced example\. --&gt;/);
    assert.doesNotMatch(html, /blog-editor-note|role="note"/);
  }
});
