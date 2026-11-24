'use client';

import React, { useEffect, useRef } from 'react';

export default function PreviewImage({ src, alt, title }: { src: string; alt: string; title?: string }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = ref.current;
    if (!image) return;

    // An editor save can refresh the article before the asset watcher finishes copying.
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function retry() {
      if (!image || timer !== undefined || attempt >= 5) return;
      timer = setTimeout(() => {
        timer = undefined;
        const url = new URL(src, document.baseURI);
        url.searchParams.set('_previewRetry', String(++attempt));
        image.src = url.href;
      }, 300 * 2 ** attempt);
    }

    image.addEventListener('error', retry);
    // The first request may have failed before React hydrated the page.
    if (image.complete && image.naturalWidth === 0) retry();
    return () => {
      clearTimeout(timer);
      image.removeEventListener('error', retry);
    };
  }, [src]);

  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} title={title} loading="eager" decoding="async" />;
}
