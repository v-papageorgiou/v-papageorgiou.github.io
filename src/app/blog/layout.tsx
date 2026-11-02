import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { colors, classes } from '@/styles/theme';
import 'katex/dist/katex.min.css';
import './prose.css';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen ${colors.bgMain}`}>
      <Navigation />
      <main id="main-content" className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
        {children}
      </main>
      <footer className={`mx-auto max-w-4xl border-t ${colors.borderNav} px-5 py-8 sm:px-6`}>
        <div className={`flex flex-wrap items-center justify-between gap-4 text-sm ${colors.textFooterSecondary}`}>
          <Link href="/" className={classes.link}>Vasilis Papageorgiou</Link>
          <span>Notes on machine learning &amp; reasoning.</span>
        </div>
      </footer>
    </div>
  );
}
