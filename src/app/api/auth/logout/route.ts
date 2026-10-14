import { NextRequest, NextResponse } from "next/server"
import { getSessions } from "@/lib/store"

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token") || ""
  getSessions().delete(token)
  return NextResponse.json({ success: true })
}
