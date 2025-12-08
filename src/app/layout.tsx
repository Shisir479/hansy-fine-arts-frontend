import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/lib/redux/provider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// import TopNavbar from '@/components/layout/TopNavbar';
import CartProvider from '@/components/cart/CartProvider';

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
      <body className="font-sans antialiased bg-white dark:bg-black transition-colors duration-300 min-h-screen">
        <StoreProvider>
          <ThemeProvider>
            <CartProvider>
              {/* <TopNavbar /> */}
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster position="top-right" />
            </CartProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
