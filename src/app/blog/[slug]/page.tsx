import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = `/blog/${post.slug}/`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article', title: post.title, description: post.description, url,
      publishedTime: `${post.date}T00:00:00Z`,
      authors: ['Vasilis Papageorgiou'], tags: post.tags,
    },
    twitter: { card: 'summary', title: post.title, description: post.description },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[42rem]">
      <Link href="/blog/" className={`${classes.link} mb-10 inline-block text-sm`}>← All writing</Link>
      <header className="mb-10 border-b border-paper-line pb-10">
        <div className={`mb-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs ${colors.textFooterSecondary}`}>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
          {post.draft && <span className="text-accent">Draft · local preview</span>}
        </div>
        <h1 className={`text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl ${colors.textHeading}`}>{post.title}</h1>
        <p className={`mt-5 font-serif text-xl leading-relaxed sm:text-2xl ${colors.textBody}`}>{post.description}</p>
        {post.tags.length > 0 && (
          <ul className={`mt-5 flex flex-wrap gap-3 font-mono text-xs ${colors.textFooterSecondary}`}>
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}
      </header>
      <Markdown content={post.content} />
      <div className="mt-14 border-t border-paper-line pt-8">
        <Link href="/blog/" className={`${classes.link} text-sm`}>← All writing</Link>
      </div>
    </article>
  );
}
