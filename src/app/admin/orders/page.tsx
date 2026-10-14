"use client"

import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/store"

type Order = {
  id: string
  orderNumber: string
  status: string
  customerName: string
  customerPhone: string
  city: string
  area: string
  address: string
  shippingNotes?: string
  total: number
  items: {
    name: string
    color: string
    size: string
    quantity: number
    price: number
  }[]
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const token = sessionStorage.getItem("zstore_admin") || ""
    if (!token) {
      window.location.href = "/admin/login"
      return
    }
    const res = await fetch("/api/orders", {
      headers: { "x-admin-token": token },
    })
    if (res.ok) setOrders(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <p className="text-muted">جاري التحميل...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-coffee-dark">الطلبات</h1>
        <button
          type="button"
          onClick={() => load()}
          className="text-sm bg-coffee text-white px-4 py-2 rounded-full"
        >
          تحديث
        </button>
      </div>
      {orders.length === 0 ? (
        <p className="text-muted">لا توجد طلبات بعد</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-white rounded-2xl border border-border p-5"
            >
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <span className="font-bold text-coffee">{o.orderNumber}</span>
                <span className="text-sm bg-beige px-2 py-0.5 rounded-full">
                  {o.status}
                </span>
              </div>
              <p className="text-sm">
                {o.customerName} — {o.customerPhone}
              </p>
              <p className="text-sm text-muted">
                {o.city} / {o.area} — {o.address}
              </p>
              {o.shippingNotes ? (
                <p className="text-sm text-muted mt-1">
                  ملاحظات: {o.shippingNotes}
                </p>
              ) : null}
              <ul className="text-sm mt-2 space-y-1">
                {(o.items || []).map((it, i) => (
                  <li key={i}>
                    {it.name} × {it.quantity} —{" "}
                    {formatPrice(it.price * it.quantity)}
                  </li>
                ))}
              </ul>
              <p className="font-bold text-coffee mt-2">
                الإجمالي: {formatPrice(o.total)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
