import type { Element, Root } from 'hast';

function onlyImage(element: Element): Element | undefined {
  const content = element.children.filter((child) => child.type !== 'text' || child.value.trim() !== '');
  const child = content.length === 1 ? content[0] : undefined;
  if (child?.type !== 'element') return undefined;
  if (child.tagName === 'img') return child;
  if (child.tagName === 'a') return onlyImage(child);
  return undefined;
}

// Turn standalone Markdown images into semantic figures before React renders
// them, so a <figure> is never nested inside an invalid paragraph wrapper.
export default function rehypeFigures() {
  return (tree: Root) => {
    function walk(parent: Root | Element) {
      for (const node of parent.children) {
        if (node.type !== 'element') continue;
        walk(node);
        if (node.tagName !== 'p') continue;

        const image = onlyImage(node);
        if (!image) continue;

        const caption = typeof image.properties.title === 'string' ? image.properties.title.trim() : '';
        image.properties.loading = 'lazy';
        image.properties.decoding = 'async';
        delete image.properties.title;

        node.tagName = 'figure';
        node.properties.className = ['blog-figure'];

        // Figures are illustrations, including when the source Markdown wraps
        // an image in a link. Authors can put ordinary text links nearby.
        node.children = [image];

        if (caption) {
          node.children.push({
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: caption }],
          });
        }
      }
    }

    walk(tree);
  };
}
