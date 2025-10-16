import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { generateSolutions, Category } from "@/lib/ai/practice/generators"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { stems, category, options } = body || {}
        if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 })
        if (!Array.isArray(stems) || stems.length === 0) return NextResponse.json({ error: "No stems" }, { status: 400 })
        if (!category) return NextResponse.json({ error: "Missing category" }, { status: 400 })
        const sols = await generateSolutions({ stems, category, options })
        return NextResponse.json({ solutions: sols })
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
    }
}
