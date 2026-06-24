import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Toaster from "@/components/ui/toaster";
import ConfirmDialog from "@/components/ui/confirm-dialog";

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Website for tracking personal finances",
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className='bg-background'>
          {children}
        </main>
        <Toaster />
        <ConfirmDialog />
      </body>
    </html>
  );
}
