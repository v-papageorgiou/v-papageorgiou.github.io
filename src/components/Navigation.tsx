'use client';

import { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#news', label: 'News' },
    { href: '#publications', label: 'Publications' },
  ];

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-cyan-400/30 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text drop-shadow-lg">Vasilis Papageorgiou</h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/cv.pdf"
              className="flex items-center space-x-1 text-gray-300 hover:text-pink-400 transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
            >
              <FileText className="w-4 h-4" />
              <span>CV</span>
            </a>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-cyan-400/30">
            <div className="flex flex-col space-y-3 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 px-2 py-1 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/cv.pdf"
                className="flex items-center space-x-1 text-gray-300 hover:text-pink-400 transition-colors duration-300 px-2 py-1 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                onClick={() => setIsOpen(false)}
              >
                <FileText className="w-4 h-4" />
                <span>CV</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
