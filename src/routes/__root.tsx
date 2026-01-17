import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

export const Route = createRootRoute({
  component: RootLayout,
})

function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 shadow-sm">
            <FileText className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            MD Convert
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            v1.0
          </span>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Internal Tool &middot; Text to Markdown
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Built with React + TanStack
        </p>
      </div>
    </footer>
  )
}

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
