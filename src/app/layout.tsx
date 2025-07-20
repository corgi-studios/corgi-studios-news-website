import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'
import BackToTopButton from '@/components/BackToTopButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Corgi Studios News',
  description: 'The latest news and updates from Corgi Studios',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-corgi-blue text-white shadow-md">
          <nav className="container mx-auto flex items-center justify-between p-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Corgi Studios Logo" width={150} height={40} priority />
            </Link>
          </nav>
        </header>
        <main className="container mx-auto p-4 md:p-8 min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-white text-center p-6">
          <p>&copy; Copyright {currentYear} Corgi Studios</p>
        </footer>
        <BackToTopButton />
      </body>
    </html>
  )
}