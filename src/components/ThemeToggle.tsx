'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover-theme rounded-lg"
      type="button"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-theme-secondary hover:text-theme" />
      ) : (
        <Moon className="w-5 h-5 text-theme-secondary hover:text-theme" />
      )}
    </button>
  );
}
