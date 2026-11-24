"""Save a local blog post as a self-contained HTML attachment."""

import argparse
import base64
from functools import lru_cache
from html import escape
import mimetypes
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen

from bs4 import BeautifulSoup, Comment


def save_preview(slug, port):
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise ValueError("Use the post's folder name as the slug.")
    origin = f"http://localhost:{port}"
    page_url = f"{origin}/blog/{slug}/"

    def read(url):
        if urlsplit(url).netloc != urlsplit(origin).netloc:
            raise ValueError(f"Expected a local asset, found {url}")
        with urlopen(url, timeout=30) as response:
            return response.read()

    @lru_cache(maxsize=None)
    def embed(url):
        mime = mimetypes.guess_type(urlsplit(url).path)[0] or "application/octet-stream"
        return f"data:{mime};base64," + base64.b64encode(read(url)).decode("ascii")

    page = BeautifulSoup(read(page_url), "html.parser")
    article = page.select_one("article.blog-post")
    if article is None:
        raise ValueError(f"No blog article found at {page_url}")
    if article.select_one(".pdf-figure"):
        raise ValueError("This preview supports image figures. Use an image version of inline PDF figures.")

    for element in article.select("script, .blog-editor-note"):
        element.decompose()
    for comment in article.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()
    draft_label = article.header.find(string="Draft · local preview")
    if draft_label:
        draft_label.replace_with("Draft")
    for link in article.select('a[href="/blog/"]'):
        if link.parent.parent is article and link.parent.name == "div":
            link.parent.decompose()
        else:
            link.decompose()
    for link in article.select("header a[href]"):
        if link.get_text(strip=True) == "PDF version":
            separator = link.next_sibling
            if isinstance(separator, str) and separator.strip() == "·":
                separator.extract()
            link.decompose()
    for img in article.select("img[src]"):
        img["src"] = embed(urljoin(page_url, img["src"]))
        img.attrs.pop("srcset", None)
    for link in article.select("a[href]"):
        href = link["href"]
        if not href.startswith("#") and not urlsplit(href).scheme:
            asset_url = urljoin(page_url, href)
            link["href"] = embed(asset_url)
            link["download"] = Path(urlsplit(asset_url).path).name

    # Float each margin note beside its first citation. Clear earlier notes
    # so they don't overlap, even when a recipient resizes the window.
    body = article.select_one(".blog-article-body")
    for note in article.select(".blog-margin-note"):
        anchor = body.find(id=note["data-reference-anchor"])
        while anchor.parent is not body:
            anchor = anchor.parent
        note.name = "aside"
        note["class"] = ["review-note"]
        anchor.insert_before(note.extract())
    margin = article.select_one(".blog-margin-references")
    if margin:
        margin.decompose()

    styles = []
    for link in page.select('link[rel~="stylesheet"]'):
        css_url = urljoin(page_url, link["href"])
        css = re.sub(r"/\*.*?\*/", "", read(css_url).decode(), flags=re.S)

        def inline_url(match):
            src = match[1].strip().strip("\"'")
            if src.startswith(("data:", "#")):
                return match[0]
            return 'url("' + embed(urljoin(css_url, src)) + '")'

        styles.append(re.sub(r"url\(([^)]+)\)", inline_url, css))

    styles.append("""
        .review-note { display: none; }
        @media screen and (min-width: 64rem) {
          .review-note {
            display: grid; grid-template-columns: 1.5rem minmax(0, 1fr); gap: .5rem;
            float: right; clear: right; width: 15rem; margin: .25rem -17rem 1rem 2rem;
            color: var(--ink-muted); font-size: .8125rem; line-height: 1.6;
          }
        }
    """)
    main = page.new_tag("main", attrs={"class": page.select_one("main")["class"]})
    main.append(article.extract())
    if article.select_one("button[data-copy-bibtex]"):
        script = page.new_tag("script")
        script.string = (Path(__file__).resolve().parents[1] / "public" / "copy-bibtex.js").read_text(encoding="utf-8")
        main.append(script)
    body_classes = escape(" ".join(page.body.get("class", [])), quote=True)
    title = escape(article.h1.get_text(strip=True))
    html = f"""<!doctype html>
<html lang="en" data-theme="light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{title}</title>
<style>{''.join(styles)}</style></head><body class="{body_classes}">{main}</body></html>
"""
    destination = Path(__file__).resolve().parents[1] / "build" / "previews" / f"{slug}.html"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(html, encoding="utf-8")
    print(f"{destination} ({destination.stat().st_size / 1_000_000:.1f} MB)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", help="folder name under content/blog")
    parser.add_argument("--port", type=int, default=3000, help="local development server port")
    args = parser.parse_args()
    save_preview(args.slug, args.port)
