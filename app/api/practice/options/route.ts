import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { generateOptions } from "@/lib/ai/practice/generators"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { stems } = body || {}
        if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 })
        if (!Array.isArray(stems) || stems.length === 0) return NextResponse.json({ error: "No stems" }, { status: 400 })
        const options = await generateOptions({ stems })
        return NextResponse.json({ options })
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
    }
}
