import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-offwhite">
      <nav className="bg-coffee text-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href="/admin" className="font-bold text-lg">
              Zstore Admin
            </Link>
            <Link href="/admin/products" className="text-sm opacity-90 hover:underline">
              المنتجات
            </Link>
            <Link href="/admin/orders" className="text-sm opacity-90 hover:underline">
              الطلبات
            </Link>
          </div>
          <Link href="/" className="text-sm opacity-90 hover:underline">
            المتجر
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
