'use client';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    icon: BookOpen,
    label: 'Content',
    path: '/admin',
  },
];

export default function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const pathname = usePathname();

  return (
    <div
      className={`${isExpanded ? 'w-56' : 'w-16'} bg-theme border-r border-theme h-screen flex flex-col transition-all duration-300`}
    >
      <div
        className={`p-4 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}
      >
        {isExpanded && (
          <h2 className="text-lg font-bold text-theme">Admin Panel</h2>
        )}
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover-theme text-theme-secondary hover:text-theme transition-colors mr-2"
              type="button"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover-theme text-theme-secondary hover:text-theme transition-colors"
            type="button"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center px-4 py-2 my-1 transition-colors ${
                isActive
                  ? 'bg-theme-secondary text-theme'
                  : 'text-theme-secondary hover:text-theme hover-theme'
              } ${isExpanded ? '' : 'justify-center'}`}
              onClick={(e) => {
                if (isMobile && onClose) {
                  onClose();
                }
              }}
              title={isExpanded ? undefined : item.label}
            >
              <Icon className="w-5 h-5" />
              {isExpanded && (
                <div className="flex flex-col ml-3">
                  <span>{item.label}</span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
