'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import Script from 'next/script'
import { metadata } from './metadata'; // Import metadata from the new file

const inter = Inter({ subsets: ['latin'] })
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID; // environment variable in Vercel production environment

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', measurementId, {
        page_path: url,
      });
    };

    // Listen for route changes
    const handleRouteChangeComplete = (event: PopStateEvent) => {
      const url = window.location.pathname; // Get the current URL
      handleRouteChange(url);
    };

    // Add event listener for route changes
    window.addEventListener('popstate', handleRouteChangeComplete);
    return () => {
      window.removeEventListener('popstate', handleRouteChangeComplete);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}