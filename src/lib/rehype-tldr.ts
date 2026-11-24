import type { Element, Root } from 'hast';

// A standalone bold TL;DR label keeps the source useful in other Markdown
// editors while opting this blockquote into the site's summary panel.
export default function rehypeTldr() {
  return (tree: Root) => {
    function walk(parent: Root | Element) {
      for (const node of parent.children) {
        if (node.type !== 'element') continue;
        walk(node);
        if (node.tagName !== 'blockquote') continue;

        const first = node.children.find((child) => child.type !== 'text' || child.value.trim() !== '');
        if (first?.type !== 'element' || first.tagName !== 'p') continue;
        const content = first.children.filter((child) => child.type !== 'text' || child.value.trim() !== '');
        const label = content[0];
        if (content.length !== 1 || label?.type !== 'element' || label.tagName !== 'strong') continue;
        if (label.children.length !== 1 || label.children[0].type !== 'text' ||
            !/^TL;DR$/i.test(label.children[0].value.trim())) continue;

        node.tagName = 'section';
        node.properties.className = ['blog-tldr'];
        node.properties.ariaLabel = 'TL;DR';
        first.tagName = 'h2';
        first.properties.className = ['blog-tldr-title'];
        first.children = [{ type: 'text', value: 'TL;DR' }];
      }
    }

    walk(tree);
  };
}
