import type { Metadata } from 'next';
import Link from 'next/link';
import { formatPostDate, getPosts } from '@/lib/posts';
import { colors, classes } from '@/styles/theme';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on machine learning, language models, and reasoning by Vasilis Papageorgiou.',
  alternates: { canonical: '/blog/' },
  openGraph: { title: 'Blog | Vasilis Papageorgiou', description: 'Notes on machine learning, language models, and reasoning.', url: '/blog/' },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-12">
        <p className={`mb-4 font-mono text-xs uppercase tracking-widest ${colors.textFooterSecondary}`}>Notes &amp; ideas</p>
        <h1 className={`mb-4 text-5xl font-medium tracking-tight sm:text-6xl ${colors.textHeading}`}>Writing</h1>
        <p className={`font-serif text-xl leading-relaxed ${colors.textBody}`}>
          On machine learning, language models, and the questions behind them.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className={`border-t ${colors.borderNav} py-10`}>
          <p className={`font-serif text-2xl ${colors.textHeading}`}>The first post is on its way.</p>
          <p className={`mt-3 text-sm ${colors.textBody}`}>In the meantime, explore my <Link href="/#publications" className={`${classes.link} underline underline-offset-4`}>research publications</Link>.</p>
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
              <p className={`font-serif text-xl leading-relaxed ${colors.textBody}`}>{post.description}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
