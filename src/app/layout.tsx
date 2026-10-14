import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/components/CartProvider"

export const metadata: Metadata = {
  title: "Zstore | متجر إلكتروني",
  description: "متجر Zstore — تسوق بالعربية",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col bg-offwhite text-text antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
