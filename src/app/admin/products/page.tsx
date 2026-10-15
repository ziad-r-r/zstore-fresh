"use client"

import { useEffect, useState } from "react"
import { formatPrice, type Product } from "@/lib/store"

const empty = {
  name: "",
  description: "",
  basePrice: "",
  offer2Price: "",
  colors: "",
  sizes: "",
  stock: "",
  emoji: "🛍️",
  tone: "#C4A484",
  image: "",
}

function headers(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-admin-token":
      typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem("zstore_admin") || ""
        : "",
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const load = async () => {
    const res = await fetch("/api/products")
    if (res.ok) setProducts(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    const token = sessionStorage.getItem("zstore_admin")
    if (!token) {
      window.location.href = "/admin/login"
      return
    }
    load()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      basePrice: Number(form.basePrice),
      offer2Price: form.offer2Price === "" ? null : Number(form.offer2Price),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock) || 0,
      emoji: form.emoji.trim() || "🛍️",
      tone: form.tone.trim() || "#C4A484",
      image: form.image.trim() || null,
    }
    const url = editing ? `/api/products/${editing.id}` : "/api/products"
    const method = editing ? "PUT" : "POST"
    try {
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || "فشل الحفظ — سجّل الدخول")
        setSaving(false)
        return
      }
      setShow(false)
      setEditing(null)
      setForm(empty)
      await load()
    } catch {
      setError("خطأ في الاتصال")
    }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm("حذف المنتج؟")) return
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: headers(),
    })
    if (res.ok) load()
    else alert("فشل الحذف")
  }

  const startEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description || "",
      basePrice: String(p.basePrice),
      offer2Price: p.offer2Price != null ? String(p.offer2Price) : "",
      colors: (p.colors || []).join(", "),
      sizes: (p.sizes || []).join(", "),
      stock: String(p.stock ?? 0),
      emoji: p.emoji || "🛍️",
      tone: p.tone || "#C4A484",
      image: p.image || "",
    })
    setError("")
    setShow(true)
  }

  if (loading) return <p className="text-muted">جاري التحميل...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-coffee-dark">إدارة المنتجات</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setForm(empty)
            setError("")
            setShow(true)
          }}
          className="bg-coffee text-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          + إضافة منتج
        </button>
      </div>

      {show && (
        <form onSubmit={submit} className="bg-white rounded-2xl border border-border p-5 mb-6 space-y-3">
          <h2 className="font-bold">{editing ? "تعديل منتج" : "منتج جديد"}</h2>
          <input required placeholder="اسم المنتج *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" />
          <textarea placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted">سعر القطعة *</label>
              <input required type="number" min={0} value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" />
            </div>
            <div>
              <label className="text-xs text-muted">سعر القطعتين (عرض)</label>
              <input type="number" min={0} placeholder="اختياري" value={form.offer2Price} onChange={(e) => setForm({ ...form, offer2Price: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5" />
            </div>
          </div>
          <p className="text-xs text-muted">قطعة واحدة بالسعر العادي، وقطعتين بالعرض إن وُجد.</p>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" min={0} placeholder="المخزون" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border 
