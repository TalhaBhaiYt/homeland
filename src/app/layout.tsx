import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getUser } from '@/lib/auth';
import { Navbar, Providers } from '@/components/shell';
import { Footer } from '@/components/ui';
import SmoothScroll from '@/components/smooth-scroll';
import LoadingBar from '@/components/loading-bar';
import SwordCursor from '@/components/sword-cursor';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://homeland.example'),
  title: { default: 'HOMELAND — Discover. Download. Create.', template: '%s — HOMELAND' },
  description: 'Your premium destination for digital content, creator resources, tools, downloads and community creations.',
  icons: {
    icon: '/images/smp-logo.png',
    apple: '/images/smp-logo.png',
  },
  openGraph: {
    title: 'HOMELAND — Discover. Download. Create.',
    description: 'A home for your next big idea. Explore premium digital resources from creators and the community.',
    images: ['/images/hero-art.png'],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'HOMELAND — Discover. Download. Create.', images: ['/images/hero-art.png'] },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let user = null;
  try { user = await getUser(); } catch {}
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LoadingBar />
        <SwordCursor />
        <Providers>
          <SmoothScroll>
            <a className="skip-link" href="#main">Skip to content</a>
            <Navbar user={user} />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
