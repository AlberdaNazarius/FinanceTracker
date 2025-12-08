import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Header from '@/components/common/header/Header';


export const metadata: Metadata = {
  title: "Finance Tacker",
  description: "Website for tracking personal finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header/>
        {/*min-h-screen*/}
        <main className='flex mt-4 items-center justify-center bg-background px-2 mx-auto max-w-7xl'>
          {children}
        </main>
      </body>
    </html>
  );
}
