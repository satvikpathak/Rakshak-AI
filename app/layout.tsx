import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rakshak AI - Chandigarh Police Surveillance System',
  description: 'Advanced AI-powered surveillance system for Chandigarh Police',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <div className="min-h-screen">
          <Navigation />
          <main className="lg:ml-64">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}