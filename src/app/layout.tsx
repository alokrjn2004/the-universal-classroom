'use client'; // This must be a client component to read the URL

import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import { usePathname } from 'next/navigation'; // Import hook to read URL
import './globals.css';
import Header from '@/components/Header';
import Link from 'next/link';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// We don't export metadata from a client component layout.
// We'll handle titles on a per-page basis later.

// A new component for the minimal back button
function BackButton() {
  return (
    <Link
      href="/"
      // NEW STYLES: Rectangular shape, glassy effect
      className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 backdrop-blur-sm border border-primary/20 text-primary font-bold px-4 py-2 rounded-md transition-colors text-sm"
    >
      <span>&larr;</span>
      <span>Back</span>
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current URL path

  // Define which paths should have the minimal layout (no main header)
  const minimalLayoutPaths = ['/login'];
  const isMinimalLayout = minimalLayoutPaths.includes(pathname);

  return (
    <html lang="en">
      <body className={`${lato.className}`}>
        {/* Conditionally render the header or the back button */}
        {isMinimalLayout ? <BackButton /> : <Header />}

        <main>{children}</main>
      </body>
    </html>
  );
}