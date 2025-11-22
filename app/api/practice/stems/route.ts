import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { buildQuiz } from "@/lib/ai/practice/generators"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { subject, chapter, category, level, quantity } = body || {}

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 })
        }
        if (!subject || !chapter || !category || !level || !quantity) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const questions = await buildQuiz({ subject, chapter, category, level, quantity })
        return NextResponse.json({ questions })
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
    }
}
