import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { colors, classes } from '@/styles/theme';
import 'katex/dist/katex.min.css';
import './prose.css';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen ${colors.bgMain}`}>
      <Navigation />
      <main id="main-content" className="blog-main mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
        {children}
      </main>
      <footer className={`mx-auto max-w-4xl border-t ${colors.borderNav} px-5 py-8 text-sm sm:px-6`}>
        <Link href="/" className={classes.link}>Vasilis Papageorgiou</Link>
      </footer>
    </div>
  );
}
