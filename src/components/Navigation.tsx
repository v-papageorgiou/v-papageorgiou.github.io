'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, FileText } from 'lucide-react';
import { colors, transitions, classes } from '@/styles/theme';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const homePrefix = pathname === '/' ? '' : '/';

  const navLinks = [
    { href: `${homePrefix}#about`, label: 'About' },
    { href: `${homePrefix}#experience`, label: 'Experience' },
    { href: `${homePrefix}#publications`, label: 'Publications' },
    { href: '/blog/', label: 'Blog' },
  ];

  const mobileMenuId = 'primary-navigation';

  return (
    <header className={`${colors.bgNav} border-b ${colors.borderNav} sticky top-0 z-50`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <nav className="flex justify-between items-center gap-3">
          <Link href="/" onClick={() => setIsOpen(false)} className={`min-w-0 text-base sm:text-lg font-bold ${colors.textHeading}`}>
            Vasilis Papageorgiou
          </Link>
          
          {/* Desktop Navigation */}
          <div className="ml-auto hidden md:flex items-center space-x-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={classes.navLink}
                aria-current={link.label === 'Blog' && pathname.startsWith('/blog') ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/cv.pdf"
              className={`flex items-center space-x-1 ${colors.textNavLink} ${colors.textNavLinkHover} ${transitions.colors}`}
            >
              <FileText className="w-4 h-4" />
              <span>CV</span>
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-1 md:ml-3">
            <ThemeToggle />
            {/* Mobile Navigation Button */}
            <button
              type="button"
              className={`md:hidden flex h-11 w-11 items-center justify-center ${colors.textNavLink} ${colors.textNavLinkHover} ${transitions.colors}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls={mobileMenuId}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          id={mobileMenuId}
          className={`md:hidden mt-4 pb-4 border-t ${colors.borderNav} ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="flex flex-col space-y-3 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${classes.navLink} px-2 py-1`}
                aria-current={link.label === 'Blog' && pathname.startsWith('/blog') ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/cv.pdf"
              className={`flex items-center space-x-1 ${colors.textNavLink} ${colors.textNavLinkHover} ${transitions.colors} px-2 py-1`}
              onClick={() => setIsOpen(false)}
            >
              <FileText className="w-4 h-4" />
              <span>CV</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
