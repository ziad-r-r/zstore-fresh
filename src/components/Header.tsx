"use client"

import Link from "next/link"
import { useCart } from "./CartProvider"

export default function Header() {
  const { totalItems } = useCart()
  return (
    <header className="sticky top-0 z-50 bg-coffee text-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Zstore
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="hover:underline opacity-90">
            المتجر
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full bg-white/15 px-3 py-1.5 hover:bg-white/25"
          >
            السلة
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-coffee-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link href="/admin" className="hover:underline opacity-90">
            الإدارة
          </Link>
        </nav>
      </div>
    </header>
  )
}
