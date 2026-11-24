import React from 'react';
import ReactMarkdown from 'react-markdown';
import Script from 'next/script';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeFigures from '../lib/rehype-figures';
import rehypeReferences from '../lib/rehype-references';
import rehypeEditorNotes from '../lib/rehype-editor-notes';
import rehypeTldr from '../lib/rehype-tldr';
import rehypeHeadingIds from '../lib/rehype-heading-ids';
import { getPdfFigure } from '../lib/figure-source';
import PdfFigure from './PdfFigure';
import PreviewImage from './PreviewImage';
import ArticleReferences from './ArticleReferences';

export default function Markdown({ content, postSlug }: { content: string; postSlug?: string }) {
  return (
    <ArticleReferences>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        remarkRehypeOptions={{ footnoteLabel: 'References', footnoteLabelProperties: { className: ['blog-references-heading'] } }}
        rehypePlugins={[
          [rehypeEditorNotes, { enabled: process.env.NODE_ENV === 'development' }],
          [rehypeKatex, { trust: false, strict: 'warn' }],
          rehypeHeadingIds, rehypeTldr, rehypeFigures, rehypeReferences,
        ]}
        skipHtml
        components={{
          img: ({ src, alt, title }) => {
            const source = typeof src === 'string' ? src : '';
            const pdf = getPdfFigure(source);
            if (pdf) return <PdfFigure key={`${pdf.url}#${pdf.page}`} src={pdf.url} page={pdf.page} alt={alt ?? ''} />;
            if (process.env.NODE_ENV === 'development' && postSlug && source && !/^(?:[a-z][\w+.-]*:|\/\/)/i.test(source)) {
              const previewSrc = source.startsWith('/') ? source : `/blog/${postSlug}/${source.replace(/^\.\//, '')}`;
              return <PreviewImage key={previewSrc} src={previewSrc} alt={alt ?? ''} title={title} />;
            }
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={source || undefined} alt={alt ?? ''} title={title} loading="lazy" decoding="async" />;
          },
          table: ({ children }) => (
            <div className="blog-table" role="region" aria-label="Article table" tabIndex={0}>
              <table>{children}</table>
            </div>
          ),
          pre: ({ node, children }) => {
            const code = node?.children[0];
            const block = <pre tabIndex={0}>{children}</pre>;
            if (code?.type !== 'element' || !Array.isArray(code.properties.className)
              || !code.properties.className.includes('language-bibtex')) return block;

            return (
              <div className="blog-bibtex">
                <button type="button" data-copy-bibtex="" aria-live="polite">Copy BibTeX</button>
                {block}
                <Script src="/copy-bibtex.js" />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </ArticleReferences>
  );
}
