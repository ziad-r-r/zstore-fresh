import { NextRequest, NextResponse } from "next/server"
import {
  getProducts,
  setProducts,
  getSessions,
  type Product,
} from "@/lib/store"

function isAdmin(req: NextRequest) {
  const token = req.headers.get("x-admin-token")
  return !!(token && getSessions().has(token))
}

export async function GET() {
  return NextResponse.json(getProducts())
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const name = String(body.name || "").trim()
    if (!name) {
      return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 })
    }
    const basePrice = Number(body.basePrice)
    if (!Number.isFinite(basePrice) || basePrice < 0) {
      return NextResponse.json({ error: "السعر غير صالح" }, { status: 400 })
    }
    let offer2: number | null = null
    if (body.offer2Price !== "" && body.offer2Price != null) {
      offer2 = Number(body.offer2Price)
      if (!Number.isFinite(offer2) || offer2 < 0) {
        return NextResponse.json({ error: "سعر العرض غير صالح" }, { status: 400 })
      }
    }
    const product: Product = {
      id: `p${Date.now()}`,
      name,
      description: String(body.description || "").trim(),
      basePrice,
      offer2Price: offer2,
      colors: Array.isArray(body.colors)
        ? body.colors.map(String).filter(Boolean)
        : String(body.colors || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
      sizes: Array.isArray(body.sizes)
        ? body.sizes.map(String).filter(Boolean)
        : String(body.sizes || "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
      stock: Math.max(0, Number(body.stock) || 0),
      emoji: String(body.emoji || "🛍️").trim() || "🛍️",
      tone: String(body.tone || "#C4A484").trim() || "#C4A484",
    }
    if (!product.colors.length) product.colors = ["افتراضي"]
    if (!product.sizes.length) product.sizes = ["مقاس واحد"]
    const list = getProducts()
    list.unshift(product)
    setProducts(list)
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: "خطأ في البيانات" }, { status: 400 })
  }
}
