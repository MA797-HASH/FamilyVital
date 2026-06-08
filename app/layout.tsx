import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Nunito, Inter } from 'next/font/google'
import './globals.css'

const heading = Nunito({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})
const sans = Inter({ variable: '--font-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FamilyVital — Your family health coach',
  description:
    'FamilyVital keeps your whole family healthy with personalized AI coaching, shared tracking, profiles, reminders, and goals.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${sans.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
