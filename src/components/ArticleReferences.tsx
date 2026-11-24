'use client';

import React, { useEffect, useRef } from 'react';

// The article and both reference lists are rendered on the server. JavaScript
// only positions the optional margin copies; bottom references work without it.
export default function ArticleReferences({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = container.current;
    const layout = root?.querySelector<HTMLElement>('.blog-reference-layout');
    const body = layout?.querySelector<HTMLElement>('.blog-article-body');
    const margin = layout?.querySelector<HTMLElement>('.blog-margin-references');
    if (!root || !layout || !body || !margin) return;

    const notes = Array.from(margin.querySelectorAll<HTMLElement>('.blog-margin-note'));
    // Keep this in sync with the margin-reference breakpoint in prose.css.
    const wide = window.matchMedia('(min-width: 64rem)');
    let frame = 0;
    let disposed = false;

    function positionNotes() {
      if (!layout || !body || !margin) return;
      margin.hidden = !wide.matches;
      if (!wide.matches) {
        layout.style.removeProperty('min-height');
        margin.style.removeProperty('height');
        delete margin.dataset.ready;
        return;
      }

      const origin = layout.getBoundingClientRect().top;
      let bottom = 0;
      for (const note of notes) {
        const anchor = document.getElementById(note.dataset.referenceAnchor ?? '');
        if (!anchor || !body.contains(anchor)) continue;
        // Align to the first citation, pushing later notes down when needed.
        const top = Math.max(anchor.getBoundingClientRect().top - origin, bottom);
        note.style.top = `${top}px`;
        bottom = top + note.getBoundingClientRect().height + 16;
      }
      // Long or densely cited notes must finish before the bottom references.
      margin.style.height = `${Math.ceil(bottom)}px`;
      layout.style.minHeight = `${Math.ceil(bottom)}px`;
      margin.dataset.ready = 'true';
    }

    function schedule() {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(positionNotes);
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(body);
    for (const child of body.children) observer.observe(child);
    for (const note of notes) observer.observe(note);
    wide.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    root.addEventListener('load', schedule, true);
    void document.fonts.ready.then(schedule);
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      wide.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
      root.removeEventListener('load', schedule, true);
      margin.hidden = true;
      delete margin.dataset.ready;
      margin.style.removeProperty('height');
      layout.style.removeProperty('min-height');
    };
  }, [children]);

  return <div className="blog-prose" ref={container}>{children}</div>;
}
