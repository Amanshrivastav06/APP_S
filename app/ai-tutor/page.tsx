import { AIChat } from "@/components/ai-chat"

export default function AITutorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Study Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get instant help with your NCERT subjects. Ask questions, get explanations, and receive personalized study
            guidance from our AI tutor.
          </p>
        </div>

        <AIChat />
      </div>
    </div>
  )
}
