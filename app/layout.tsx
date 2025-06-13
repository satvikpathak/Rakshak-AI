import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';
import ChatBot from '@/components/ChatBot';

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
        <div className="min-h-screen ">
          <div className='flex'>
           <Navigation />
          <main className='min-w-[88%]  ' >
           
            {children}
          </main>
          </div>
        </div>
        <ChatBot/>
        <Toaster />
      </body>
    </html>
  );
}