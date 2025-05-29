'use client';

import { useTheme } from '@/context/ThemeContext';
import { Menu, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  isMobile?: boolean;
  onMenuClick?: () => void;
}

export default function Header({ isMobile = false, onMenuClick }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const getPageTitle = () => {
    switch (pathname) {
      default:
        return 'Content Management Dashboard';
    }
  };
  
  return (
    <header className="bg-theme border-b border-theme px-4 sm:px-6 py-3 sm:py-4 z-20 backdrop-blur-lg bg-opacity-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 hover-theme rounded-lg mr-2"
              type="button"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-theme-secondary hover:text-theme" />
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-semibold text-theme">
            {getPageTitle()}
          </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
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
          
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
              }}
              className="flex items-center space-x-3 hover-theme rounded-lg p-2"
              type="button"
              aria-label="Open profile menu"
            >
              <div className="w-8 h-8 bg-theme-secondary rounded-lg flex items-center justify-center">
                <span className="text-theme font-medium">P</span>
              </div>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 card-theme rounded-lg shadow-lg py-1 border border-theme z-50">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/auth/signout', {
                        method: 'POST',
                      });

                      if (response.ok) {
                        window.location.href = '/';
                      } else {
                        console.error('Failed to sign out');
                      }
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-theme hover-theme"
                  type="button"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
