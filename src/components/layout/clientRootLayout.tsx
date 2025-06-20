// src/components/layout/ClientRootLayout.tsx
"use client";

import "@/app/globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import { LoadingProvider } from "@/components/loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import React from "react";

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body className="antialiased">
        <LoadingProvider>
          {isAuthPage ? (
            <>{children}</>
          ) : (
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                 <ToastContainer />
                <div className="flex-1 mt-16 ml-64">{children}</div>
              </div>
            </div>
          )}
        </LoadingProvider>
      </body>
    </html>
  );
}
