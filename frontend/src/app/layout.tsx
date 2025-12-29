import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Electron - Marketing Tool',
  description: 'AI-powered marketing tool built with CloudFlare',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
