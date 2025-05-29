'use client';

import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import type { PropsWithChildren } from 'react';

export function MainLayout({ children }: PropsWithChildren) {

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      
      {/* Mobile Sidebar */}
      <div className="lg:hidden border-b border-gray-800">
        <Sidebar />
      </div>

      <div className="flex flex-1 overflow-x-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className="flex-1 ml-0 lg:ml-15 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
