import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Markdown from '@/components/Markdown';
import { formatPostDate, getPost, getPosts } from '@/lib/posts';
import { colors, classes } from '@/styles/theme';

export const dynamic = 'force-static';
export const dynamicParams = false;

type PostPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const params = getPosts().map((post) => ({ slug: post.slug }));
  // Next 15's static exporter requires at least one param even for an empty
  // blog. This reserved, invalid post slug resolves to notFound(), never content.
  return params.length > 0 ? params : [{ slug: '__empty' }];
}

export async function generateMetadata({ params }: PostPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = `/blog/${post.slug}/`;
  const { metadataBase } = await parent;

  return {
    title: post.title,
    description: null,
    keywords: null,
    authors: post.authors.map(({ name }) => ({ name })),
    alternates: { canonical: url },
    other: post.paperPdf && metadataBase ? {
      citation_title: post.title,
      citation_author: post.authors.map(({ name }) => name),
      citation_publication_date: post.date.replaceAll('-', '/'),
      citation_pdf_url: new URL(url + encodeURIComponent(post.paperPdf), metadataBase).href,
    } : undefined,
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article', title: post.title, url,
      publishedTime: `${post.date}T00:00:00Z`,
      authors: post.authors.map(({ name }) => name),
    },
    twitter: { card: 'summary', title: post.title },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const bylineLinks = [
    post.paperPdf && `[PDF version](<./${encodeURIComponent(post.paperPdf)}>)`,
    post.bylineLinks,
  ].filter(Boolean).join(' · ');

  return (
    <article className="blog-post mx-auto max-w-[50rem]">
      <Link href="/blog/" className={`${classes.link} mb-10 inline-block text-sm`}>← Blogposts</Link>
      <header className="mb-10 border-b border-paper-line">
        <div className={`mb-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs ${colors.textFooterSecondary}`}>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
          {post.draft && <span className="text-accent">Draft · local preview</span>}
        </div>
        <h1 className={`text-[2rem] font-medium leading-[1.12] tracking-tight sm:text-[2.5rem] ${colors.textHeading}`}>{post.title}</h1>
        <ul aria-label="Authors" className="mt-4 mb-10 flex flex-wrap gap-x-8 gap-y-3">
          {post.authors.map(({ name, affiliation }, index) => (
            <li key={`${index}-${name}`}>
              <span className={`block text-sm font-medium ${colors.textBody}`}>{name}</span>
              {affiliation && (
                <span className={`block text-xs ${colors.textFooterSecondary}`}>{affiliation}</span>
              )}
            </li>
          ))}
        </ul>
        {bylineLinks && (
          <div className="pb-1 text-sm text-ink-muted [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-link-hover">
            <ReactMarkdown allowedElements={['p', 'a']} skipHtml>{bylineLinks}</ReactMarkdown>
          </div>
        )}
      </header>
      <Markdown content={post.content} postSlug={post.slug} />
      <div className="mt-14 border-t border-paper-line pt-8">
        <Link href="/blog/" className={`${classes.link} text-sm`}>← Blogposts</Link>
      </div>
    </article>
  );
}
