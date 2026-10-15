"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/components/CartProvider"
import { formatPrice, SHIPPING_FEE } from "@/lib/store"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{
    orderNumber: string
    total: number
  } | null>(null)
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    city: "",
    area: "",
    address: "",
    shippingNotes: "",
    confirmed: false,
  })

  useEffect(() => {
    try {
      const n = sessionStorage.getItem("zstore_checkout_notes")
      if (n) setForm((f) => ({ ...f, shippingNotes: n }))
    } catch {}
  }, [])

  if (items.length === 0 && !success) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <p className="text-muted">السلة فارغة</p>
          <Link href="/" className="mt-4 text-coffee underline">
            العودة للتسوق
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h1 className="text-2xl font-bold text-coffee-dark mb-2">
              تم استلام طلبك!
            </h1>
            <p className="text-3xl font-bold text-coffee mb-4">
              {success.orderNumber}
            </p>
            <p className="text-muted mb-6">
              الإجمالي: {formatPrice(success.total)}
            </p>
            <Link
              href="/"
              className="inline-block bg-coffee text-white px-6 py-3 rounded-full font-semibold"
            >
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.confirmed) {
      setError("يجب تأكيد الطلب")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            color: i.color,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(
          typeof data.error === "string" ? data.error : "حدث خطأ"
        )
        setLoading(false)
        return
      }
      clearCart()
      try {
        localStorage.removeItem("zstore_cart_notes")
        sessionStorage.removeItem("zstore_checkout_notes")
      } catch {}
      setSuccess({ orderNumber: data.orderNumber, total: data.total })
    } catch {
      setError("فشل الاتصال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-coffee-dark mb-6">
          إتمام الطلب
        </h1>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-3 bg-white rounded-2xl border border-border p-6">
            <input
              required
              placeholder="الاسم الكامل *"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
              className="w-full rounded-xl border border-border px-4 py-2.5"
            />
            <input
              required
              type="tel"
              placeholder="رقم الهاتف *"
              value={form.customerPhone}
              onChange={(e) =>
                setForm({ ...form, customerPhone: e.target.value })
              }
              className="w-full rounded-xl border border-border px-4 py-2.5"
              dir="ltr"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="المدينة *"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-xl border border-border px-4 py-2.5"
              />
              <input
                required
                placeholder="المنطقة *"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="rounded-xl border border-border px-4 py-2.5"
              />
            </div>
            <textarea
              required
              rows={3}
              placeholder="العنوان بالتفصيل *"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-border px-4 py-2.5"
            />
            <textarea
              rows={2}
              placeholder="ملاحظات (اختياري)"
              value={form.shippingNotes}
              onChange={(e) =>
                setForm({ ...form, shippingNotes: e.target.value })
              }
              className="w-full rounded-xl border border-border px-4 py-2.5"
            />
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.confirmed}
                onChange={(e) =>
                  setForm({ ...form, confirmed: e.target.checked })
                }
                className="mt-1 w-5 h-5 accent-coffee"
                required
              />
              <span className="text-sm font-medium">
                هل تأكدت من هذا الطلب؟ *
              </span>
            </label>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-3">ملخص الطلب</h2>
              <ul className="space-y-1 text-sm mb-4 text-muted">
                {items.map((i) => (
                  <li key={`${i.productId}-${i.color}-${i.size}`}>
                    {i.name} × {i.quantity}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm text-muted mb-1">
                <span>المنتجات</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>الشحن</span>
                <span>{formatPrice(SHIPPING_FEE)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-coffee">{formatPrice(totalPrice + SHIPPING_FEE)}</span>
              </div>
              {error && (
                <p className="mt-3 text-danger text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-coffee text-white py-3.5 rounded-full font-semibold disabled:opacity-60"
              >
                {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}
