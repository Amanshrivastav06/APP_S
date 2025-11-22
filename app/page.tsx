import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, User, Trophy, Bot, Sparkles } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  // Get subjects for the homepage
  const { data: subjects } = await supabase.from("subjects").select("*").eq("class_level", 9).order("name")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">NCERT Study App</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/ai-tutor">
                <Button variant="outline" size="sm">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Tutor
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            Master Class 9 NCERT with AI-Powered Learning
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Read all NCERT books, get AI-generated summaries, and test your knowledge with intelligent practice
            questions
          </p>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Choose Your Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects?.map((subject) => (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="text-center pb-4">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
                    >
                      {subject.icon}
                    </div>
                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                    <CardDescription className="text-sm">{subject.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button className="w-full" style={{ backgroundColor: subject.color }}>
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">What You'll Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Complete NCERT Books</h4>
              <p className="text-gray-600">Access all Class 9 NCERT textbooks with chapter-wise content</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Practice Questions</h4>
              <p className="text-gray-600">Solve previous year questions and get instant feedback</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">AI-Generated Summaries</h4>
              <p className="text-gray-600">Get intelligent topic summaries and explanations powered by AI</p>
            </div>
            <div className="text-center">
              <Bot className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">AI Study Assistant</h4>
              <p className="text-gray-600">Ask questions and get personalized help from your AI tutor</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
