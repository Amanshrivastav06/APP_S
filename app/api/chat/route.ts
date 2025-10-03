import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are an AI tutor for Class 9 NCERT subjects. Help students understand concepts, solve problems, and provide explanations in a clear, educational manner. Focus on:
    - Breaking down complex topics into simple explanations
    - Providing step-by-step solutions
    - Encouraging critical thinking
    - Relating concepts to real-world examples
    - Being patient and supportive`,
    messages: convertToCoreMessages(messages),
  })

  return result.toDataStreamResponse()
}
