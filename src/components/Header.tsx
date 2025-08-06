import { ThemeToggle } from '@/components/ThemeToggle';
import { Github, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';

interface HeaderProps {
  activePage?: 'projects' | 'blog';
}

export function Header({ activePage = 'projects' }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-foreground flex items-center"
            >
              <Image
                src="/assets/logo.png"
                alt="logo"
                width={36}
                height={36}
                className="mr-2"
              />
              melondotdev
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={
                  activePage === 'projects'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground transition-colors'
                }
              >
                projects
              </Link>
              <Link
                href="/blog"
                className={
                  activePage === 'blog'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground transition-colors'
                }
              >
                blog
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/melondotdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@melondotdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/melondotdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
            </div>
            <div className="h-6 w-px bg-border" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
