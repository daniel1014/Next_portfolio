import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import ClientAnalytics from '../components/ClientAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Discover More About Daniel Wong's Work",
  description: 'Full-stack & AI Engineer | Turning Ideas into Scalable Products',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              url: 'https://faithfulstack.com',
              name: 'Daniel Wong',
              logo: 'https://faithfulstack.com/android-chrome-512x512.png',
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <ClientAnalytics />
      </body>
    </html>
  );
}