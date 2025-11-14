import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/lib/redux/provider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hansy Fine Arts - Original Art & Custom Portraits',
  description: 'Discover unique fine art pieces, custom portraits, and 3D art previews. Shop our curated collection of contemporary and abstract art.',
  keywords: 'fine art, custom portraits, art gallery, contemporary art, abstract art, 3D art preview',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}