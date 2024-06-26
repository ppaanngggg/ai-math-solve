import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import { Inter } from 'next/font/google';
import clsx from 'clsx';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

const meta = {
  title: 'AI Math Solver',
  description:
    'Unlock the power of AI. Whether uploading photos or describing math problems, ' +
    'our advanced multi-modal AI can assist you in solving math problems step by step. ' +
    'Additionally, you can easily save and share your math notes.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    authors: [{ name: 'Hantian Pang', url: 'https://github.com/ppaanngggg' }],
    creator: 'Hantian Pang',
    publisher: 'Hantian Pang',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Vercel',
      creator: '@Vercel',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage]
    }
  };
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html data-theme="cupcake" lang="en">
      <body
        className={clsx(
          'min-h-screen flex flex-col subpixel-antialiased',
          inter.className
        )}
      >
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center bg-base-200">
          {children}
        </main>
        <Footer />
        <Suspense>
          <Toaster />
        </Suspense>
        <GoogleAnalytics gaId="G-PLRB728EP9" />
      </body>
    </html>
  );
}
