export type Product = {
  id: string
  name: string
  description: string
  basePrice: number
  offer2Price?: number | null
  colors: string[]
  sizes: string[]
  stock: number
  emoji: string
  tone: string
  image?: string | null
}

export type OrderItem = {
  productId: string
  name: string
  color: string
  size: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  orderNumber: string
  status: string
  customerName: string
  customerPhone: string
  city: string
  area: string
  address: string
  shippingNotes?: string
  customerToken: string
  basePrice: number
  shippingFee: number
  total: number
  items: OrderItem[]
  createdAt: string
}

const g = globalThis as unknown as {
  __zs_orders?: Map<string, Order>
  __zs_sessions?: Set<string>
  __zs_products?: Product[]
}

if (!g.__zs_orders) g.__zs_orders = new Map()
if (!g.__zs_sessions) g.__zs_sessions = new Set()

const seed: Product[] = [
  { id: "p1", name: "هودي قهوة", description: "هودي قطن ثقيل بقصة مريحة.", basePrice: 690, offer2Price: 1200, colors: ["بني", "بيج", "أسود"], sizes: ["S", "M", "L", "XL"], stock: 24, emoji: "🧥", tone: "#6F4E37", image: null },
  { id: "p2", name: "تيشيرت أوف وايت", description: "تيشيرت ناعم يومي.", basePrice: 320, offer2Price: 550, colors: ["أوف وايت", "بيج", "بني"], sizes: ["S", "M", "L"], stock: 40, emoji: "👕", tone: "#C4A484", image: null },
  { id: "p3", name: "بنطلون كتان", description: "بنطلون 
