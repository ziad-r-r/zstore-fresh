import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  getProducts,
  getOrders,
  getSessions,
  calcLineTotal,
  SHIPPING_FEE,
  type Order,
} from "@/lib/store"

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  city: z.string().min(1),
  area: z.string().min(1),
  address: z.string().min(5),
  shippingNotes: z.string().optional(),
  confirmed: z.literal(true),
  items: z
    .array(
      z.object({
        productId: z.string(),
        color: z.string(),
        size: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
})

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-admin-token") || ""
  if (!getSessions().has(token)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }
  const list = Array.from(getOrders().values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  )
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const products = getProducts()

    const lines = data.items.map((item) => {
      const p = products.find((x) => x.id === item.productId)
      if (!p) throw new Error("منتج غير موجود")
      const sum = calcLineTotal(p.basePrice, p.offer2Price, item.quantity)
      const unit = Math.round((sum / item.quantity) * 100) / 100
      return {
        productId: p.id,
        name: p.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: unit,
      }
    })

    const basePrice =
      Math.round(lines.reduce((s, l) => s + l.price * l.quantity, 0) * 100) /
      100
    const shippingFee = SHIPPING_FEE
    const total = basePrice + shippingFee

    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: "ZS" + Date.now().toString().slice(-8),
      status: "جديد",
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      city: data.city,
      area: data.area,
      address: data.address,
      shippingNotes: data.shippingNotes,
      customerToken: crypto.randomUUID().replace(/-/g, ""),
      basePrice,
      shippingFee,
      total,
      items: lines,
      createdAt: new Date().toISOString(),
    }
    getOrders().set(order.id, order)
    return NextResponse.json(
      {
        success: true,
        orderNumber: order.orderNumber,
        total: order.total,
        id: order.id,
      },
      { status: 201 }
    )
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "فشل" },
      { status: 500 }
    )
  }
}
