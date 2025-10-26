'use client';

import { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { colors, effects, transitions, classes } from '@/styles/theme';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#publications', label: 'Publications' },
  ];

  const mobileMenuId = 'primary-navigation';

  return (
    <header className={`${colors.bgNav} border-b ${colors.borderNav} sticky top-0 z-50`}>
      <div className="max-w-4xl mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <span className={`text-xl font-bold ${colors.orange} ${effects.dropShadow}`}>
            Vasilis Papageorgiou
          </span>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={classes.navLink}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/cv.pdf"
              className={`flex items-center space-x-1 ${colors.textNavLink} hover:text-pink-400 ${transitions.colors} hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]`}
            >
              <FileText className="w-4 h-4" />
              <span>CV</span>
            </a>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className={`md:hidden p-2 ${colors.textNavLink} ${colors.textNavLinkHover} ${transitions.colors}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls={mobileMenuId}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          id={mobileMenuId}
          className={`md:hidden mt-4 pb-4 border-t ${colors.borderNav} ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="flex flex-col space-y-3 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${classes.navLink} px-2 py-1`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/cv.pdf"
              className={`flex items-center space-x-1 ${colors.textNavLink} hover:text-pink-400 ${transitions.colors} px-2 py-1 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]`}
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
