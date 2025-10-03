import { NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, chapter, category, level, quantity } = body || {};

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    if (!subject || !chapter || !category || !level || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // System rules enforcing Class 9 only generation
    const system = `You are an AI question generator and quiz assistant for NCERT Class 9 only.
- Strictly generate questions from Class 9 NCERT syllabus and official sample papers.
- Never include content outside Class 9.
Format response as JSON with an array "questions".
Supported categories: MCQ, Assertion-Reason, True/False, Short Answer.
For MCQ: include "options" (4 strings) and "answerIndex" (0-3). 
For others: include "answer" (string). 
Always include "solution" (concise, step-by-step, Class 9 level).`;

    const user = `Subject: ${subject}
Chapter: ${chapter}
Category: ${category}
Level: ${level}
Quantity: ${quantity}

Output JSON schema:
{
  "questions": [
    {
      "question": "string",
      "category": "MCQ|Assertion-Reason|True/False|Short Answer",
      "options": ["A","B","C","D"],   // MCQ only
      "answerIndex": 0,               // MCQ only
      "answer": "string",             // Non-MCQ
      "solution": "string"
    }
  ]
}

If the requested chapter is not part of Class 9 for the given subject, respond with:
{ "error": "Chapter not in Class 9 syllabus." }`;

    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: data?.error?.message || "OpenAI error" }, { status: 500 });
    }

    // Extract and validate JSON
    const content = data?.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }
    if (parsed?.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const questions = Array.isArray(parsed?.questions) ? parsed.questions.slice(0, quantity) : [];

    return NextResponse.json({ questions });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
