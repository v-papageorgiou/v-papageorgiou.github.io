'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist';

type Props = { src: string; page: number; alt: string };

export default function PdfFigure({ src, page, alt }: Props) {
  const container = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    let loading: PDFDocumentLoadingTask | undefined;
    let rendering: RenderTask | undefined;

    async function draw() {
      try {
        // Only posts containing PDFs load the renderer, and only as a figure
        // approaches the viewport. No PDF viewer controls or link overlays.
        const pdfjs = await import('pdfjs-dist');
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = `/_pdfjs/pdf.worker.min.mjs?v=${pdfjs.version}`;
        loading = pdfjs.getDocument({
          url: src,
          cMapUrl: '/_pdfjs/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/_pdfjs/standard_fonts/',
          wasmUrl: '/_pdfjs/wasm/',
        });
        const document = await loading.promise;
        const pdfPage = await document.getPage(page);
        if (cancelled || !canvas.current) return;

        const natural = pdfPage.getViewport({ scale: 1 });
        // Keep labels crisp on high-density displays while bounding canvas
        // memory for unusually large or tall pages. CSS handles resizing.
        const scale = Math.min(2016 / natural.width, 4096 / natural.height);
        const viewport = pdfPage.getViewport({ scale });
        const target = canvas.current;
        target.width = Math.ceil(viewport.width);
        target.height = Math.ceil(viewport.height);
        rendering = pdfPage.render({ canvas: target, viewport });
        await rendering.promise;
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      } finally {
        if (loading) void loading.destroy().catch(() => {});
      }
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void draw();
      }
    }, { rootMargin: '400px' });
    if (container.current) observer.observe(container.current);

    return () => {
      cancelled = true;
      observer.disconnect();
      rendering?.cancel();
      if (loading) void loading.destroy().catch(() => {});
    };
  }, [src, page]);

  return (
    <span className="pdf-figure" ref={container} data-state={status}>
      <canvas ref={canvas} role="img" aria-label={alt || 'PDF figure'} hidden={status !== 'ready'} />
      {status !== 'ready' && (
        <span className="pdf-figure-status" role="status">
          {status === 'error' ? `Unable to display this PDF figure${alt ? `: ${alt}` : '.'}` : 'Loading figure…'}
        </span>
      )}
      <noscript>Enable JavaScript to view this PDF figure.</noscript>
    </span>
  );
}
