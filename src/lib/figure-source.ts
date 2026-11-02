export function getPdfFigure(source: string) {
  const [url, fragment = ''] = source.split('#');
  if (!/\.pdf$/i.test(url.split('?')[0])) return undefined;

  const requestedPage = new URLSearchParams(fragment).get('page') ?? '1';
  const page = /^\d+$/.test(requestedPage) ? Number(requestedPage) : 1;
  return { url, page: Number.isSafeInteger(page) && page > 0 ? page : 1 };
}
