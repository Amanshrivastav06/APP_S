import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { subject, chapter, category, level, quantity } = body;

        const supabase = createClient();

        // 1) Try DB first
        const { data: rows } = await supabase
            .from("questions")
            .select("*")
            .eq("subject", subject)
            .eq("chapter", chapter)
            .eq("difficulty", level)
            .eq("question_type", category);

        if (rows && rows.length > 0) {
            const shuffled = [...rows].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, quantity);

            return NextResponse.json({
                ok: true,
                source: "database",
                items: selected
            });
        }

        // 2) Fallback to OpenAI
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Generate NCERT Class 9 questions with 4 MCQ options."
                },
                {
                    role: "user",
                    content: `Generate ${quantity} ${level} MCQs for ${chapter}.`
                }
            ]
        });

        const text = completion.choices[0].message.content;

        return NextResponse.json({
            ok: true,
            source: "ai",
            raw: text
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, error: "Server error" });
    }
}
