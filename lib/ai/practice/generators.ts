// lib/ai/practice/generators.ts
import type { SubjectKey } from "@/data/class9_chapters"

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

export type Category = "MCQ" | "Assertion-Reason" | "True/False" | "Short Answer"
export type Level = "Easy" | "Medium" | "Hard"

export type StemItem = { question: string }
export type OptionItem = { options: string[] } // MCQ only, exactly 4
export type SolutionItem =
    | { category: "MCQ"; answerIndex: number; solution: string }
    | { category: Exclude<Category, "MCQ">; answer: string; solution: string }

export async function callOpenAIJSON(system: string, user: string): Promise<any> {
    const r = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            temperature: 0.2,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
            response_format: { type: "json_object" },
        }),
    })
    const data = await r.json()
    if (!r.ok) {
        const msg = data?.error?.message || "OpenAI error"
        throw new Error(msg)
    }
    const content = data?.choices?.[0]?.message?.content || "{}"
    try {
        return JSON.parse(content)
    } catch {
        throw new Error("Model returned non‑JSON")
    }
}

/** Step 1: generate stems only */
export async function generateStems(params: {
    subject: SubjectKey
    chapter: string
    category: Category
    level: Level
    quantity: number
}) {
    const { subject, chapter, category, level, quantity } = params
    const system = `You are a Class 9 NCERT question writer. Output JSON only.`
    const user = `Create ${quantity} question stems ONLY (no options, no answers) for:
- Subject: ${subject}
- Chapter: ${chapter}
- Category: ${category}
- Difficulty: ${level}

Return: { "stems": [ { "question": "..." } ] }
Rules:
- Target Class 9, NCERT exam style.
- For "Assertion-Reason", the stem MUST contain both Assertion (A) and Reason (R) clearly.
- For "True/False", write a statement to evaluate as True or False.
- For "Short Answer", ask for 2–3 line responses.
- DO NOT include answer hints or choices.`
    const parsed = await callOpenAIJSON(system, user)
    const stems = Array.isArray(parsed?.stems) ? parsed.stems as StemItem[] : []
    return stems.slice(0, quantity)
}

/** Step 2: generate options (MCQ only) */
export async function generateOptions(params: {
    stems: StemItem[]
}) {
    const system = `You are an MCQ option generator for Class 9 NCERT. Output JSON only.`
    const user = `For each question stem, create exactly 4 plausible, distinct options with only one correct among them.
Return: { "options": [ { "options": ["A","B","C","D"] }, ... ] }
Input stems (index aligned):
${JSON.stringify(params.stems, null, 2)}
Constraints:
- Options must be concise (max 16 words each), mutually exclusive.
- Avoid "All of the above"/"None of the above".
- Do NOT reveal which option is correct here.`
    const parsed = await callOpenAIJSON(system, user)
    const arr = Array.isArray(parsed?.options) ? parsed.options as OptionItem[] : []
    // Ensure 4 options for each, pad if needed
    return arr.map((o) => ({
        options: Array.isArray(o?.options) ? (o.options as string[]).slice(0, 4) : []
    }))
}

/** Step 3: solutions (ground truth) */
export async function generateSolutions(params: {
    stems: StemItem[]
    category: Category
    options?: OptionItem[] // provided for MCQ
}) {
    const { stems, category } = params
    const system = `You are a strict answer key generator for Class 9 NCERT. Output JSON only.`
    const user =
        category === "MCQ"
            ? `For each stem and its options, choose the single correct option index (0-3) and write a clear solution (2-4 sentences).
Return: { "solutions": [ { "category": "MCQ", "answerIndex": 0, "solution": "..." }, ... ] }
Inputs (index aligned):
stems: ${JSON.stringify(stems, null, 2)}
options: ${JSON.stringify(params.options ?? [], null, 2)}
Rules:
- The answerIndex must match one of the 4 options.
- Solutions must justify WHY that option is correct and others are not.`
            : `For each stem, provide the correct answer string and a brief solution (2-4 sentences).
Return: { "solutions": [ { "category": "${category}", "answer": "...", "solution": "..." }, ... ] }
stems: ${JSON.stringify(stems, null, 2)}
Rules:
- "True/False": answer must be exactly "True" or "False" (capitalized).
- "Assertion-Reason": answer must be one of: 
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true but R is false",
  "A is false but R is true".
- "Short Answer": answer should be 1–2 sentences (not a paragraph).`
    const parsed = await callOpenAIJSON(system, user)
    const sols = Array.isArray(parsed?.solutions) ? parsed.solutions as SolutionItem[] : []
    return sols
}

/** Orchestrator to produce final quiz objects for UI */
export async function buildQuiz(params: {
    subject: SubjectKey
    chapter: string
    category: Category
    level: Level
    quantity: number
}) {
    const stems = await generateStems(params)
    let merged: any[] = []

    if (params.category === "MCQ") {
        const options = await generateOptions({ stems })
        const sols = await generateSolutions({ stems, category: "MCQ", options })
        // merge by index
        merged = stems.map((s, i) => ({
            question: s.question,
            category: "MCQ",
            options: options?.[i]?.options ?? [],
            answerIndex: (sols?.[i] as any)?.answerIndex ?? -1,
            solution: (sols?.[i] as any)?.solution ?? "",
        }))
    } else {
        const sols = await generateSolutions({ stems, category: params.category })
        merged = stems.map((s, i) => ({
            question: s.question,
            category: params.category as any,
            answer: (sols?.[i] as any)?.answer ?? "",
            solution: (sols?.[i] as any)?.solution ?? "",
        }))
    }

    return merged
}
