'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isScrollable = pathname === '/' || pathname === '/profile';
  const hideNavigation = pathname === '/docs' || pathname === '/company-details' || pathname === '/landing';

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white ${isScrollable ? 'scrollable' : 'no-scroll'}`}>
        <main className={hideNavigation ? '' : 'pb-20'}>
          {children}
        </main>
        {!hideNavigation && <Navigation />}
      </body>
    </html>
  );
}