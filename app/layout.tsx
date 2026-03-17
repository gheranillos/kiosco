import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import './animations.css'
import { AnimatedLogo } from '@/components/AnimatedLogo'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Kiosco — Drop Preregistro',
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
        <header
          data-animate-header
          className="anim-header fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 text-sm font-semibold uppercase text-stone-100 bg-stone-950"
          aria-label="Navegación"
        >
          <AnimatedLogo lightSrc="/kiosco-logo-white.png" />
        </header>
        <div className="pt-14">
          {children}
        </div>
        <Analytics />
        <Script src="/validation.js" strategy="afterInteractive" />
        <Script src="/animations.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
