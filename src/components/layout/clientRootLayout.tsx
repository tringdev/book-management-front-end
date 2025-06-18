// src/components/layout/ClientRootLayout.tsx
'use client';

import '@/app/globals.css';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { usePathname } from 'next/navigation';

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body className="antialiased">
        {isAuthPage ? (
          <>{children}</>
        ) : (
          <div className="flex flex-col min-h-screen">
            <Header /> 
            <div className="flex flex-1">
              <Sidebar />
              <div className="flex-1 p-6 mt-16 ml-64"> 
                {children}
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}