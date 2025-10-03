import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { topicTitle, content } = await req.json()

    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a comprehensive summary for the Class 9 NCERT topic "${topicTitle}". 
      
      Content: ${content}
      
      Please provide:
      1. A brief overview (2-3 sentences)
      2. Key concepts and definitions
      3. Important points to remember
      4. Real-world applications or examples
      
      Keep the language appropriate for Class 9 students and make it engaging.`,
    })

    return Response.json({ summary: result.text })
  } catch (error) {
    console.error("Error generating summary:", error)
    return Response.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
