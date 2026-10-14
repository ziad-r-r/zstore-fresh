"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/components/CartProvider"
import { formatPrice } from "@/lib/store"

const NOTES_KEY = "zstore_cart_notes"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, lineTotal } =
    useCart()
  const [notes, setNotes] = useState("")

  useEffect(() => {
    try {
      const s = localStorage.getItem(NOTES_KEY)
      if (s) setNotes(s)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_KEY, notes)
    } catch {}
  }, [notes])

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <h1 className="text-2xl font-bold text-coffee-dark mb-2">السلة فارغة</h1>
          <Link href="/" className="bg-coffee text-white px-6 py-3 rounded-full font-semibold mt-4">
            تصفح المنتجات
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-coffee-dark mb-6">
          سلة التسوق ({totalItems})
        </h1>
        <div className="space-y-4">
          {items.map((item) => {
            const total = lineTotal(item)
            const normal = item.price * item.quantity
            const offer =
              !!item.offer2Price && item.quantity >= 2 && total < normal
            return (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex gap-4 bg-white rounded-2xl border border-border p-4"
              >
                <div
                  className="w-20 h-20 rounded-xl grid place-items-center text-3xl shrink-0"
                  style={{ background: item.tone || "#E8DFD0" }}
                >
                  {item.emoji || "🛍️"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted">
                    {item.color} / {item.size}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.color,
                          item.size,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.color,
                          item.size,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="mr-auto text-danger text-sm"
                      onClick={() =>
                        removeItem(item.productId, item.color, item.size)
                      }
                    >
                      حذف
                    </button>
                  </div>
                </div>
                <div className="text-left self-center">
                  {offer && (
                    <p className="text-xs text-muted line-through">
                      {formatPrice(normal)}
                    </p>
                  )}
                  <p className="font-bold text-coffee">{formatPrice(total)}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-border p-5">
          <label className="block text-sm font-semibold mb-2">
            ملاحظات على الطلب (اختياري)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثلاً: موعد توصيل، لون معين، هدية..."
            className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-offwhite"
          />
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-border p-6">
          <div className="flex justify-between text-lg font-bold">
            <span>المجموع</span>
            <span className="text-coffee">{formatPrice(totalPrice)}</span>
          </div>
          <p className="text-sm text-muted mt-1">سعر المنتجات فقط</p>
          <Link
            href="/checkout"
            onClick={() => {
              try {
                if (notes.trim())
                  sessionStorage.setItem("zstore_checkout_notes", notes.trim())
              } catch {}
            }}
            className="mt-4 block w-full text-center bg-coffee text-white py-3.5 rounded-full font-semibold"
          >
            إتمام الطلب
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
