import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import './animations.css'
import { SiteShell } from '@/components/SiteShell'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0a09',
}

export const metadata: Metadata = {
  title: 'El Kiosco',
  description: 'Made by artists. Worn by outsiders. Regístrate para acceso anticipado al próximo drop de Kiosco.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SiteShell shopEnabled={shopEnabled}>{children}</SiteShell>
        <Analytics />
        <Script src="/validation.js" strategy="afterInteractive" />
        <Script src="/animations.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
