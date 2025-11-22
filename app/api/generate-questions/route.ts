import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import type { NextRequest } from "next/server"

const questionSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      type: z.enum(["multiple_choice", "true_false", "short_answer"]),
      options: z.array(z.string()).optional(),
      correct_answer: z.string(),
      explanation: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
  ),
})

export async function POST(req: NextRequest) {
  try {
    const { topicTitle, content, count = 5 } = await req.json()

    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: questionSchema,
      prompt: `Generate ${count} practice questions for the Class 9 NCERT topic "${topicTitle}".
      
      Content: ${content}
      
      Create a mix of question types:
      - Multiple choice questions (4 options each)
      - True/false questions
      - Short answer questions
      
      Ensure questions test understanding, not just memorization. Include clear explanations for each answer.
      Make questions appropriate for Class 9 level and follow NCERT exam patterns.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Error generating questions:", error)
    return Response.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
