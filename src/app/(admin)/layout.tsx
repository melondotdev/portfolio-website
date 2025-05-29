'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className="flex h-screen bg-theme">
      {/* Mobile sidebar overlay */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowMobileSidebar(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowMobileSidebar(false);
            }
          }}
          role="button"
          tabIndex={0}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
          isMobile && !showMobileSidebar ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <Sidebar
          isMobile={isMobile}
          onClose={() => setShowMobileSidebar(false)}
        />
      </div>
      
      <div
        className={`flex-1 flex flex-col ${isMobile ? 'pl-0' : 'pl-[224px]'}`}
      >
        <div
          className={`fixed top-0 right-0 z-20 bg-theme ${isMobile ? 'left-0' : 'left-[224px]'}`}
        >
          <Header
            isMobile={isMobile}
            onMenuClick={() => setShowMobileSidebar(true)}
          />
        </div>
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
