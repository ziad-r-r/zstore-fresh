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
  { id: "p1", name: "هودي قهوة", description: "هودي قطن ثقيل بقصة مريحة.", basePrice: 690, offer2Price: 1200, colors: ["بني", "بيج", "أسود"], sizes: ["S", "M", "L", "XL"], stock: 24, emoji: "🧥", tone: "#6F4E37" },
  { id: "p2", name: "تيشيرت أوف وايت", description: "تيشيرت ناعم يومي.", basePrice: 320, offer2Price: 550, colors: ["أوف وايت", "بيج", "بني"], sizes: ["S", "M", "L"], stock: 40, emoji: "👕", tone: "#C4A484" },
  { id: "p3", name: "بنطلون كتان", description: "بنطلون واسع خفيف.", basePrice: 540, colors: ["بيج", "كاكي", "أبيض"], sizes: ["30", "32", "34", "36"], stock: 18, emoji: "👖", tone: "#A89078" },
  { id: "p4", name: "كاب زستور", description: "كاب قطن بتطريز صغير.", basePrice: 180, offer2Price: 300, colors: ["بني", "أسود", "بيج"], sizes: ["مقاس واحد"], stock: 50, emoji: "🧢", tone: "#4A3222" },
  { id: "p5", name: "شنطة كتف", description: "شنطة يومية بجيوب داخلية.", basePrice: 450, colors: ["بني", "أسود"], sizes: ["واحدة"], stock: 12, emoji: "👜", tone: "#8B5E3C" },
  { id: "p6", name: "سنيكرز كلاسيك", description: "حذاء رياضي مريح.", basePrice: 890, offer2Price: 1600, colors: ["أبيض", "بيج"], sizes: ["40", "41", "42", "43", "44"], stock: 15, emoji: "👟", tone: "#E8DFD0" },
]

if (!g.__zs_products) g.__zs_products = seed.map((p) => ({ ...p }))

export function getProducts() {
  return g.__zs_products!
}
export function setProducts(list: Product[]) {
  g.__zs_products = list
}
export function getProduct(id: string) {
  return g.__zs_products!.find((p) => p.id === id)
}
export function getOrders() {
  return g.__zs_orders!
}
export function getSessions() {
  return g.__zs_sessions!
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ziadziad7777777@@"

export function calcLineTotal(
  basePrice: number,
  offer2Price: number | null | undefined,
  qty: number
) {
  if (!offer2Price || qty < 2) return basePrice * qty
  const pairs = Math.floor(qty / 2)
  const rem = qty % 2
  return pairs * offer2Price + rem * basePrice
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
  }).format(price)
}
