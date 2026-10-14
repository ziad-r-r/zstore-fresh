"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { calcLineTotal } from "@/lib/store"

export type CartItem = {
  productId: string
  name: string
  price: number
  offer2Price?: number | null
  color: string
  size: string
  quantity: number
  emoji?: string
  tone?: string
}

type Ctx = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string, size: string) => void
  updateQuantity: (
    productId: string,
    color: string,
    size: string,
    quantity: number
  ) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  lineTotal: (item: CartItem) => number
}

const CartContext = createContext<Ctx | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem("zstore_cart")
      if (s) setItems(JSON.parse(s))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem("zstore_cart", JSON.stringify(items))
  }, [items, loaded])

  const lineTotal = (item: CartItem) =>
    calcLineTotal(item.price, item.offer2Price, item.quantity)

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const i = prev.findIndex(
        (x) =>
          x.productId === item.productId &&
          x.color === item.color &&
          x.size === item.size
      )
      if (i >= 0) {
        const next = [...prev]
        next[i] = {
          ...next[i],
          quantity: next[i].quantity + item.quantity,
          price: item.price,
          offer2Price: item.offer2Price ?? next[i].offer2Price,
        }
        return next
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: string, color: string, size: string) => {
    setItems((prev) =>
      prev.filter(
        (x) =>
          !(x.productId === productId && x.color === color && x.size === size)
      )
    )
  }

  const updateQuantity = (
    productId: string,
    color: string,
    size: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      removeItem(productId, color, size)
      return
    }
    setItems((prev) =>
      prev.map((x) =>
        x.productId === productId && x.color === color && x.size === size
          ? { ...x, quantity }
          : x
      )
    )
  }

  const clearCart = () => setItems([])
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = items.reduce((s, i) => s + lineTotal(i), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lineTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart outside provider")
  return ctx
}
