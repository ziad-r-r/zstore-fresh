"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/components/CartProvider"
import { calcLineTotal, formatPrice, type Product } from "@/lib/store"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(async (r) => {
        if (r.ok) {
          const d = await r.json()
          setProduct(d)
          if (d.colors?.[0]) setColor(d.colors[0])
          if (d.sizes?.[0]) setSize(d.sizes[0])
        }
      })
      .finally(() => setLoading(false))
  }, [params.id])

  const total = useMemo(() => {
    if (!product) return 0
    return calcLineTotal(product.basePrice, product.offer2Price, qty)
  }, [product, qty])

  const hasOffer = !!(product?.offer2Price && product.offer2Price > 0)
  const offerOn = hasOffer && qty >= 2
  const normal = product ? product.basePrice * qty : 0

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex-1 py-20 text-center text-muted">جاري التحميل...</div>
        <Footer />
      </>
    )
  }
  if (!product) {
    return (
      <>
        <Header />
        <div className="flex-1 py-20 text-center">
          <button onClick={() => router.push("/")} className="text-coffee underline">
            العودة
          </button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div
          className="rounded-2xl border border-border aspect-square grid place-items-center text-8xl"
          style={{ background: product.tone }}
        >
          {product.emoji}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-coffee-dark">{product.name}</h1>
          <p className="text-3xl font-bold text-coffee mt-2">
            {formatPrice(product.basePrice)}{" "}
            <span className="text-sm text-muted font-normal">للقطعة</span>
          </p>
          {hasOffer && (
            <p className="mt-2 inline-block bg-success/10 text-success border border-success/30 rounded-full px-3 py-1 text-sm font-semibold">
              عرض: قطعتين بـ {formatPrice(product.offer2Price!)}
            </p>
          )}
          <p className="text-muted mt-4">{product.description}</p>
          <p className="font-semibold mt-6 mb-2">اللون</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  color === c
                    ? "bg-coffee text-white border-coffee"
                    : "bg-white border-border"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="font-semibold mt-4 mb-2">المقاس</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  size === s
                    ? "bg-coffee text-white border-coffee"
                    : "bg-white border-border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 rounded-full border border-border"
            >
              −
            </button>
            <span className="font-semibold w-8 text-center">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-10 h-10 rounded-full border border-border"
            >
              +
            </button>
          </div>
          <div className="mt-4 p-4 rounded-2xl bg-beige/50 border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">المجموع</span>
              <div className="text-left">
                {offerOn && (
                  <span className="text-sm text-muted line-through block">
                    {formatPrice(normal)}
                  </span>
                )}
                <span className="text-xl font-bold text-coffee">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
          <button
            className={`mt-6 px-8 py-3 rounded-full text-white font-semibold ${
              added ? "bg-success" : "bg-coffee hover:bg-coffee-dark"
            }`}
            onClick={() => {
              addItem({
                productId: product.id,
                name: product.name,
                price: product.basePrice,
                offer2Price: product.offer2Price ?? null,
                color,
                size,
                quantity: qty,
                emoji: product.emoji,
                tone: product.tone,
              })
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
            }}
          >
            {added ? "تمت الإضافة ✓" : "أضف إلى السلة"}
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
