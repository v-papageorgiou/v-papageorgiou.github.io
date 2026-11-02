'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { themeStorageKey, type ReadingTheme } from '@/lib/appearance';
import { colors, transitions } from '@/styles/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ReadingTheme>('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

    const syncPreference = (event: StorageEvent) => {
      if (event.key !== themeStorageKey && event.key !== null) return;
      const nextTheme = event.newValue === 'dark' ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      setTheme(nextTheme);
    };

    window.addEventListener('storage', syncPreference);
    return () => window.removeEventListener('storage', syncPreference);
  }, []);

  const toggleTheme = () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);

    try {
      localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Switching still works for this visit if storage is blocked or full.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Dark theme"
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Switch to paper theme' : 'Switch to dark theme'}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${colors.borderSocial} ${colors.borderSocialHover} ${colors.bgSocialIcon} ${colors.textNavLink} hover:bg-paper-hover ${transitions.colors}`}
    >
      <Moon aria-hidden="true" className="theme-icon-light h-4 w-4" />
      <Sun aria-hidden="true" className="theme-icon-dark h-4 w-4" />
    </button>
  );
}
