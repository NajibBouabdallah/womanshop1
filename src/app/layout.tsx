// 📁 app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'My App',
  description: 'This is my app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar"  dir="rtl" className="scroll-smooth">
      <body suppressHydrationWarning >
        <Navbar/>
        <main>
          {children}
        </main>
        
      </body>
    </html>
  );
}
