import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeFigures from '../lib/rehype-figures';
import { getPdfFigure } from '../lib/figure-source';
import PdfFigure from './PdfFigure';

export default function Markdown({ content }: { content: string }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { trust: false, strict: 'warn' }], rehypeFigures]}
        skipHtml
        components={{
          img: ({ src, alt, title }) => {
            const source = typeof src === 'string' ? src : '';
            const pdf = getPdfFigure(source);
            return pdf
              ? <PdfFigure key={`${pdf.url}#${pdf.page}`} src={pdf.url} page={pdf.page} alt={alt ?? ''} />
              // Markdown assets are already static and can also be external.
              // eslint-disable-next-line @next/next/no-img-element
              : <img src={source || undefined} alt={alt ?? ''} title={title} loading="lazy" decoding="async" />;
          },
          table: ({ children }) => (
            <div className="blog-table" role="region" aria-label="Article table" tabIndex={0}>
              <table>{children}</table>
            </div>
          ),
          pre: ({ children }) => <pre tabIndex={0}>{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
