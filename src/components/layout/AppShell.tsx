import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import solvpathLogo from "@/assets/solvpath-logo.png"

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center transition-opacity hover:opacity-80">
            <img src={solvpathLogo} alt="solvpath" className="h-7 w-auto" />
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
