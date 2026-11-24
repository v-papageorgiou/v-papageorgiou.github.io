import type { Metadata } from 'next';
import Link from 'next/link';
import PreviewImage from '@/components/PreviewImage';
import { formatPostAuthors, formatPostDate, getPosts } from '@/lib/posts';
import { classes, colors } from '@/styles/theme';

export const metadata: Metadata = {
  title: { absolute: 'Blogposts' },
  description: null,
  alternates: { canonical: '/blog/' },
  openGraph: { title: 'Blogposts', url: '/blog/' },
  twitter: { card: 'summary', title: 'Blogposts' },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/" className={`${classes.link} mb-10 inline-block text-sm`}>← Home</Link>
      <header className="mb-6">
        <h1 className={`text-5xl font-medium tracking-tight sm:text-6xl ${colors.textHeading}`}>Blogposts</h1>
      </header>

      {posts.length === 0 ? (
        <div className={`border-t ${colors.borderNav} py-10`}>
          <p className={`font-sans text-2xl ${colors.textHeading}`}>The first post is on its way.</p>
        </div>
      ) : (
        <div className={`divide-y divide-paper-line border-t ${colors.borderNav}`}>
          {posts.map((post) => (
            <article key={post.slug} className="py-8">
              <div className={`mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs ${colors.textFooterSecondary}`}>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span>{post.readingMinutes} min read</span>
                {post.draft && <span className="rounded border border-paper-line-strong px-2 py-1 text-accent">Draft · local preview</span>}
              </div>
              <h2 className="mb-3 text-3xl font-medium leading-tight">
                <Link href={`/blog/${post.slug}/`} className={`${colors.textHeading} ${colors.textLinkHover} transition-colors`}>{post.title}</Link>
              </h2>
              <p className={`text-sm ${colors.textBody}`}>By {formatPostAuthors(post.authors)}</p>
              {post.paperPdf && (
                <a
                  href={`/blog/${post.slug}/${encodeURIComponent(post.paperPdf)}`}
                  className="mt-1 inline-block text-sm text-link underline underline-offset-2 hover:text-link-hover"
                >
                  PDF version<span className="sr-only"> of {post.title}</span>
                </a>
              )}
              {post.indexFigure && (
                <div className="mt-5 max-w-md overflow-hidden rounded border border-paper-line [&>img]:block [&>img]:h-auto [&>img]:w-full">
                  {process.env.NODE_ENV === 'development'
                    ? <PreviewImage {...post.indexFigure} />
                    // eslint-disable-next-line @next/next/no-img-element
                    : <img src={post.indexFigure.src} alt={post.indexFigure.alt} loading="lazy" decoding="async" />}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
