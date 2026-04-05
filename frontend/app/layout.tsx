import type { Metadata } from 'next'
import { Noto_Sans, Noto_Sans_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner"

const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSansMono = Noto_Sans_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-noto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PTIT Admission Portal 2026 - Posts and Telecommunications Institute of Technology',
  description: 'Official admission portal for PTIT. Find information about programs, quotas, and registration for the 2026 academic year.',
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
    <html lang="vi">
      <body className={`${notoSans.variable} ${notoSansMono.variable} font-sans antialiased`}>
        <AuthProvider>
        {children}
        <Toaster />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
