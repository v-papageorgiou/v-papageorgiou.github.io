import type { Element, ElementContent, Root } from 'hast';

function citationLink(node: Root['children'][number] | undefined): Element | undefined {
  if (node?.type !== 'element' || node.tagName !== 'sup') return;
  const content = node.children.filter((child) => child.type !== 'text' || child.value.trim() !== '');
  const link = content[0];
  if (content.length === 1 && link.type === 'element' && link.tagName === 'a' &&
      link.properties.dataFootnoteRef !== undefined) return link;
}

// Group adjacent footnotes using actual text punctuation, so the brackets and
// commas survive copying, printing, and rendering without JavaScript or CSS.
function groupCitations(parent: Root | Element) {
  const children = parent.children;
  for (let index = 0; index < children.length; index++) {
    const node = children[index];
    if (node.type !== 'element') continue;
    const first = citationLink(node);
    if (!first) {
      groupCitations(node);
      continue;
    }

    const links = [first];
    let end = index + 1;
    while (end < children.length) {
      let next = end;
      while (next < children.length) {
        const separator = children[next];
        if (separator.type !== 'text' || separator.value.trim() !== '') break;
        next++;
      }
      const link = citationLink(children[next]);
      if (!link) break;
      links.push(link);
      end = next + 1;
    }

    node.properties.className = ['blog-citation'];
    node.children = [{ type: 'text', value: '[' }];
    links.forEach((link, position) => {
      if (position > 0) node.children.push({ type: 'text', value: ', ' });
      node.children.push(link);
    });
    node.children.push({ type: 'text', value: ']' });
    children.splice(index + 1, end - index - 1);
  }
}

function openSourceLinksInNewTabs(node: Element) {
  const { href } = node.properties;
  if (node.tagName === 'a' && typeof href === 'string' && href && !href.startsWith('#')) {
    const scheme = /^[a-z][\w+.-]*:/i.exec(href);
    if (!scheme || /^https?:$/i.test(scheme[0])) {
      node.properties.target = '_blank';
      node.properties.rel = ['noopener', 'noreferrer'];
    }
  }
  for (const child of node.children) {
    if (child.type === 'element') openSourceLinksInNewTabs(child);
  }
}

// Keep the canonical footnotes (and their return links) intact. The margin
// contains another view of each definition, with no duplicate anchor IDs.
function copyContent(nodes: ElementContent[]): ElementContent[] {
  return nodes.flatMap((node): ElementContent[] => {
    if (node.type !== 'element') return [{ ...node }];
    if (node.properties.dataFootnoteBackref !== undefined) return [];
    const properties = { ...node.properties };
    delete properties.id;
    delete properties.dataFootnoteRef;
    return [{ ...node, properties, children: copyContent(node.children) }];
  });
}

export default function rehypeReferences() {
  return (tree: Root) => {
    const footnotes = tree.children.find((node): node is Element =>
      node.type === 'element' && node.properties.dataFootnotes !== undefined);
    const list = footnotes?.children.find((node): node is Element =>
      node.type === 'element' && node.tagName === 'ol');
    if (!footnotes || !list) return;

    openSourceLinksInNewTabs(list);
    groupCitations(tree);
    const body = tree.children.filter((node) => node !== footnotes);
    const firstCitations = new Map<string, string>();
    function findCitations(nodes: Root['children']) {
      for (const node of nodes) {
        if (node.type !== 'element') continue;
        const { dataFootnoteRef, href, id } = node.properties;
        if (dataFootnoteRef !== undefined && typeof href === 'string' && typeof id === 'string' && !firstCitations.has(href)) {
          firstCitations.set(href, id);
        }
        findCitations(node.children);
      }
    }
    findCitations(body);

    const entries = list.children.filter((node): node is Element =>
      node.type === 'element' && node.tagName === 'li');
    const notes: Element[] = [];
    entries.forEach((entry, index) => {
      const href = `#${entry.properties.id}`;
      const anchor = firstCitations.get(href);
      if (!anchor) return;
      notes.push({
        type: 'element', tagName: 'li',
        properties: { className: ['blog-margin-note'], dataReferenceAnchor: anchor },
        children: [
          {
            type: 'element', tagName: 'a',
            properties: { className: ['blog-margin-number'], href, ariaLabel: `Reference ${index + 1}` },
            children: [{ type: 'text', value: String(index + 1) }],
          },
          {
            type: 'element', tagName: 'div',
            properties: { className: ['blog-margin-content'] },
            children: copyContent(entry.children),
          },
        ],
      });
    });
    if (!notes.length) return;

    tree.children = [
      {
        type: 'element', tagName: 'div',
        properties: { className: ['blog-reference-layout'] },
        children: [
          { type: 'element', tagName: 'div', properties: { className: ['blog-article-body'] }, children: body as ElementContent[] },
          {
            type: 'element', tagName: 'aside',
            properties: { className: ['blog-margin-references'], ariaLabel: 'References beside the text', hidden: true },
            children: [{ type: 'element', tagName: 'ol', properties: { role: 'list' }, children: notes }],
          },
        ],
      },
      footnotes,
    ];
  };
}
