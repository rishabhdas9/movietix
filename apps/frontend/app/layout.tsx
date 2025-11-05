import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MovieTix - Book Movie Tickets Online',
  description: 'Book movie tickets online at your favorite theaters',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <a href="/" className="inline-flex items-center gap-2 group">
                <span className="text-3xl transition-transform group-hover:scale-110">🎬</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  MovieTix
                </span>
              </a>
              <div className="flex items-center gap-3">
                <a href="/" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Movies
                </a>
                {/* <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <span>👤</span>
                  <span>Sign In</span>
                </button> */}
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50">{children}</main>
        <footer className="mt-12 border-t border-black/5 bg-white/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-700">
            <p>© 2025 MovieTix. A BookMyShow Clone for demonstration purposes.</p>
            <p className="mt-2 text-xs text-gray-700">Built with Next.js, NestJS, Prisma & PostgreSQL</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

