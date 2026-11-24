import type { Element, ElementContent, Root } from 'hast';

function headingText(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type !== 'element') return '';
  // KaTeX emits both MathML and visual HTML, plus the original TeX source.
  // Read only the MathML text so equations contribute once, without commands.
  if (node.tagName === 'annotation' || node.tagName === 'annotation-xml' ||
      node.properties.className?.includes('katex-html') ||
      node.properties.dataFootnoteRef !== undefined) return '';
  if (node.tagName === 'img') return String(node.properties.alt ?? '');
  return node.children.map(headingText).join('');
}

export default function rehypeHeadingIds() {
  return (tree: Root) => {
    const headings: Element[] = [];
    const used = new Set<string>();

    function collect(parent: Root | Element) {
      for (const node of parent.children) {
        if (node.type !== 'element') continue;
        if (typeof node.properties.id === 'string') used.add(node.properties.id);
        if (/^h[1-6]$/.test(node.tagName)) headings.push(node);
        collect(node);
      }
    }
    collect(tree);

    for (const heading of headings) {
      if (heading.properties.id !== undefined) continue;
      const slug = headingText(heading).normalize('NFKC').toLowerCase()
        .replace(/[^\p{L}\p{N}\s_-]/gu, '')
        .trim().replace(/[\s_-]+/g, '-').replace(/^-|-$/g, '') || 'heading';
      // Namespace anchors to avoid collisions with browser DOM properties and
      // the existing footnote IDs. Repeated titles receive unique suffixes.
      const base = `section-${slug}`;
      let id = base;
      for (let suffix = 2; used.has(id); suffix += 1) id = `${base}-${suffix}`;
      heading.properties.id = id;
      used.add(id);
    }
  };
}
