import type { Metadata } from "next";
import "./globals.css";
import React from "react";


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
        <main className='bg-background'>
          {children}
        </main>
      </body>
    </html>
  );
}
