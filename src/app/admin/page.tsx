"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminDashboard() {
  const [ready, setReady] = useState(false)
  const [productCount, setProductCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    const token = sessionStorage.getItem("zstore_admin") || ""
    if (!token) {
      window.location.href = "/admin/login"
      return
    }
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders", {
        headers: { "x-admin-token": token },
      }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([products, orders]) => {
        setProductCount(Array.isArray(products) ? products.length : 0)
        setOrderCount(Array.isArray(orders) ? orders.length : 0)
      })
      .finally(() => setReady(true))
  }, [])

  if (!ready) return <p className="text-muted">جاري التحميل...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-coffee-dark mb-6">لوحة التحكم</h1>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-border p-6">
          <p className="text-muted text-sm">المنتجات</p>
          <p className="text-3xl font-bold text-coffee mt-1">{productCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-6">
          <p className="text-muted text-sm">الطلبات</p>
          <p className="text-3xl font-bold text-coffee mt-1">{orderCount}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="bg-coffee text-white px-6 py-3 rounded-full font-semibold"
        >
          إدارة المنتجات
        </Link>
        <Link
          href="/admin/orders"
          className="bg-white border border-coffee text-coffee px-6 py-3 rounded-full font-semibold"
        >
          إدارة الطلبات
        </Link>
      </div>
    </div>
  )
}
