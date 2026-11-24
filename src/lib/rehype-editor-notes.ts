import type { Element, ElementContent, Root } from 'hast';

interface Options {
  enabled?: boolean;
}

const blockParents = new Set(['blockquote', 'li', 'div', 'section', 'dd']);

// Recognize only HTML comments already identified by the Markdown parser.
// Code examples stay literal, and note bodies become escaped text, never HTML.
export default function rehypeEditorNotes({ enabled = false }: Options = {}) {
  return (tree: Root) => {
    if (!enabled) return;

    function walk(parent: Root | Element) {
      const inline = parent.type === 'element' && !blockParents.has(parent.tagName);
      for (let index = 0; index < parent.children.length; index += 1) {
        const node = parent.children[index];
        if (node.type === 'element') {
          walk(node);
          continue;
        }
        if (node.type !== 'raw') continue;

        // Consecutive comments can share a raw node. Do not interpret comments
        // embedded in other raw HTML, which remains subject to skipHtml.
        const comments = Array.from(node.value.matchAll(/<!--([\s\S]*?)-->/g));
        if (!comments.length || node.value.replace(/<!--[\s\S]*?-->/g, '').trim()) continue;

        const notes: ElementContent[] = [];
        for (const comment of comments) {
          const match = /^\s*(TODO|FIXME)\s*:\s*([\s\S]*?)\s*$/i.exec(comment[1]);
          if (!match || !match[2]) continue;
          const label = match[1].toUpperCase();
          notes.push({
            type: 'element', tagName: inline ? 'span' : 'aside',
            properties: {
              className: ['blog-editor-note', `blog-editor-note-${label.toLowerCase()}`, ...(inline ? ['blog-editor-note-inline'] : [])],
              role: 'note', ariaLabel: `${label}, local preview only`,
            },
            children: [
              {
                type: 'element', tagName: 'strong',
                properties: { className: ['blog-editor-note-label'] },
                children: [{ type: 'text', value: label }],
              },
              { type: 'text', value: ' ' },
              {
                type: 'element', tagName: 'span',
                properties: { className: ['blog-editor-note-body'] },
                children: [{ type: 'text', value: match[2] }],
              },
            ],
          });
        }
        parent.children.splice(index, 1, ...notes);
        index += notes.length - 1;
      }
    }

    walk(tree);
  };
}
