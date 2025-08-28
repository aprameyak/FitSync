import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'FitSync',
    template: '%s | FitSync'
  },
  description: 'Modern fitness tracking and workout management',
  keywords: ['fitness', 'workout', 'tracking', 'health'],
  authors: [{ name: 'FitSync Team' }],
  creator: 'FitSync',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fitsync.com',
    title: 'FitSync',
    description: 'Modern fitness tracking and workout management',
    siteName: 'FitSync'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitSync',
    description: 'Modern fitness tracking and workout management'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} h-full antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
