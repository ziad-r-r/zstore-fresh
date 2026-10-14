import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>Zstore 2026 ©</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-coffee">
            المتجر
          </Link>
          <Link href="/cart" className="hover:text-coffee">
            السلة
          </Link>
          <Link href="/admin" className="hover:text-coffee">
            الإدارة
          </Link>
        </div>
      </div>
    </footer>
  )
}
