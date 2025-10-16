// lib/ai/practice/generators.ts
import type { SubjectKey } from "@/data/class9_chapters"

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

export type Category = "MCQ" | "Assertion-Reason" | "True/False" | "Short Answer"
export type Level = "Easy" | "Medium" | "Hard"

export type StemItem = { question: string }
export type OptionItem = { options: string[] } // MCQ only
export type SolutionItem =
  | { category: "MCQ"; answerIndex: number; solution: string }
  | { category: Exclude<Category, "MCQ">; answer: string; solution: string }

// ─────────────────────────────────────────────────────────────
// Core OpenAI JSON caller
// ─────────────────────────────────────────────────────────────
async function callOpenAIJSON(system: string, user: string): Promise<any> {
  const r = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
    cache: "no-store",
  })
  const data = await r.json()
  if (!r.ok) {
    throw new Error(data?.error?.message || "OpenAI error")
  }
  const content = data?.choices?.[0]?.message?.content || "{}"
  try {
    return JSON.parse(content)
  } catch {
    throw new Error("Model returned non-JSON")
  }
}

// ─────────────────────────────────────────────────────────────
// 1) STEMS (no options/answers)
// ─────────────────────────────────────────────────────────────
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

Rules:
- Strictly Class 9 NCERT content (textbook + official sample paper patterns).
- The stem must stand alone, with all variables given.
- When Category = "Assertion-Reason", include both parts clearly:
  "Assertion (A): ..." and "Reason (R): ...".
- Do NOT embed MCQ choices or answer hints in stems.
- Do NOT create Assertion-Reason stems if category ≠ "Assertion-Reason".

Return:
{ "stems": [ { "question": "..." } ] }`

  const parsed = await callOpenAIJSON(system, user)
  const stems = Array.isArray(parsed?.stems) ? (parsed.stems as StemItem[]) : []
  return stems.slice(0, quantity)
}

// ─────────────────────────────────────────────────────────────
// 2) OPTIONS (MCQ only)
// ─────────────────────────────────────────────────────────────
export async function generateOptions(params: { stems: StemItem[] }) {
  const system = `You are an MCQ option generator for Class 9 NCERT. Output JSON only.`
  const user = `For each stem, create exactly 4 plausible, distinct options with only ONE correct option.
Input stems (index aligned):
${JSON.stringify(params.stems, null, 2)}

Constraints:
- 4 options exactly. No “All/None of the above”.
- Keep options concise (≤ 16 words).
- For numeric questions:
  - Use correct NCERT formulas.
  - Round to the nearest integer (unless the problem implies units/2-decimal precision).
  - Make three distractors differ by ≥ 10% from the correct value and not equal to it.
- Do NOT reveal which option is correct here.

Return:
{ "options": [ { "options": ["A","B","C","D"] }, ... ] }`

  const parsed = await callOpenAIJSON(system, user)
  const arr = Array.isArray(parsed?.options) ? (parsed.options as OptionItem[]) : []
  return arr.map((o) => ({
    options: Array.isArray(o?.options) ? o.options.slice(0, 4) : [],
  }))
}

// ─────────────────────────────────────────────────────────────
// 3) SOLUTIONS (ground truth)
// ─────────────────────────────────────────────────────────────
export async function generateSolutions(params: {
  stems: StemItem[]
  category: Category
  options?: OptionItem[] // for MCQ
}) {
  const { stems, category } = params
  const system = `You are a strict answer key generator for Class 9 NCERT. Output JSON only.`

  const user =
    category === "MCQ"
      ? `For each stem + its 4 options, pick the single correct option index (0..3) and give a clear solution (2–5 sentences).
Inputs (index aligned)
stems: ${JSON.stringify(stems, null, 2)}
options: ${JSON.stringify(params.options ?? [], null, 2)}

Rules:
- Index must match one of the 4 options.
- Show the formula and small working if numeric; follow NCERT conventions.
- Round numeric results to the nearest integer unless precision is specified.
- Explain briefly why the other options are wrong.

Return:
{ "solutions": [ { "category": "MCQ", "answerIndex": 0, "solution": "..." }, ... ] }`
      : `Provide the correct answer and a short solution (2–4 sentences) for each stem.
stems: ${JSON.stringify(stems, null, 2)}

Rules by category:
- "True/False": answer must be exactly "True" or "False".
- "Assertion-Reason": answer must be exactly one of:
  1) "Both A and R are true, and R is the correct explanation of A"
  2) "Both A and R are true, but R is not the correct explanation of A"
  3) "A is true but R is false"
  4) "A is false but R is true"
- "Short Answer": 1–2 sentence answer. Avoid paragraphs.
- Show the key concept/formula where relevant.

Return:
{ "solutions": [ { "category": "${category}", "answer": "...", "solution": "..." }, ... ] }`

  const parsed = await callOpenAIJSON(system, user)
  const sols = Array.isArray(parsed?.solutions) ? (parsed.solutions as SolutionItem[]) : []
  return sols
}

// ─────────────────────────────────────────────────────────────
// 4) Validator pass for MCQ: recompute the correct index
//    If mismatch, overwrite answerIndex.
// ─────────────────────────────────────────────────────────────
async function validateMcqIndex(stem: string, options: string[]) {
  const system = `You are a strict answer checker for Class 9 questions. Output JSON only.`
  const user = `Determine the single correct option index (0..3) for this question by reasoning/calculation.

Question:
${stem}

Options:
${options.map((o, i) => `${i}. ${o}`).join("\n")}

Rules:
- Use NCERT formulas for numeric questions; round like the options.
- Return JSON ONLY:
{ "answerIndex": 0 }`

  const parsed = await callOpenAIJSON(system, user)
  const idx = Number(parsed?.answerIndex)
  return Number.isInteger(idx) && idx >= 0 && idx < 4 ? idx : -1
}

// (Optional) regenerate a short solution aligned to a specific index
async function regenerateSolutionForIndex(stem: string, options: string[], answerIndex: number) {
  const system = `You are a concise explainer for Class 9 NCERT MCQs. Output JSON only.`
  const user = `Write a brief 2–4 sentence solution justifying why option ${answerIndex} is correct and others are not.

Question:
${stem}

Options:
${options.map((o, i) => `${i}. ${o}`).join("\n")}

Return:
{ "solution": "..." }`

  const parsed = await callOpenAIJSON(system, user)
  return typeof parsed?.solution === "string" ? parsed.solution : ""
}

// ─────────────────────────────────────────────────────────────
// 5) Orchestrator
// ─────────────────────────────────────────────────────────────
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

    merged = stems.map((s, i) => ({
      question: s.question,
      category: "MCQ" as const,
      options: options?.[i]?.options ?? [],
      answerIndex: (sols?.[i] as any)?.answerIndex ?? -1,
      solution: (sols?.[i] as any)?.solution ?? "",
    }))

    // Validator pass — correct common mistakes (e.g., Q7, Q9 cases)
    for (let i = 0; i < merged.length; i++) {
      const m = merged[i]
      if (!m?.options || m.options.length !== 4) continue
      const verified = await validateMcqIndex(m.question, m.options)
      if (verified !== -1 && verified !== m.answerIndex) {
        m.answerIndex = verified
        // keep solutions consistent with the verified index
        m.solution = await regenerateSolutionForIndex(m.question, m.options, verified)
      }
    }
  } else {
    const sols = await generateSolutions({ stems, category: params.category })
    merged = stems.map((s, i) => ({
      question: s.question,
      category: params.category,
      answer: (sols?.[i] as any)?.answer ?? "",
      solution: (sols?.[i] as any)?.solution ?? "",
    }))
  }

  return merged
}
