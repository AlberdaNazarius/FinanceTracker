"use client"

import {useState} from "react"
import {CircleDollarSign, User, Menu} from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <CircleDollarSign className='h-6 w-6'/>
            <span className="text-xl font-bold text-foreground">FinTrack</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/transactions"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              Transactions
            </Link>
            <Link href="/budgets"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              Budgets
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center font-semibold justify-center">
              <User className='h-5 w-5'/>
              <span className="text-sm text-foreground">User</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className='h-6 w-6'/>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-sm font-medium text-foreground">
              Dashboard
            </Link>
            <Link href="/transactions" className="text-sm font-medium text-muted">
              Transactions
            </Link>
            <Link href="#" className="text-sm font-medium text-muted">
              Budgets
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}