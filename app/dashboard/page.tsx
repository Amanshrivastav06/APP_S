import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { redirect } from "next/navigation"
import { BookOpen, Trophy, Clock, TrendingUp, LogOut, BarChart3, History, Bot, Sparkles, Brain } from "lucide-react"
import Class9Subjects from "@/components/class9-subjects";

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user progress stats
  const { data: readingProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("progress_type", "reading")

  const { data: quizProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("progress_type", "quiz_completed")

  // Get recent quiz attempts
  const { data: recentQuizzes } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      subject:subjects(name, color)
    `,
    )
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(5)

  // Get subjects for quick access
  const { data: subjects } = await supabase.from("subjects").select("*").eq("class_level", 9).order("name")

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">NCERT Study Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {profile?.full_name || "Student"}!</span>
              <Link href="/ai-tutor">
                <Button variant="outline" size="sm">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Tutor
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/quiz-history">
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </Link>
              <form action={handleSignOut}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Topics Read</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{readingProgress?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Chapters Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">{quizProgress?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Quizzes Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">{recentQuizzes?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold">
                  {recentQuizzes?.length
                    ? Math.round(
                      recentQuizzes.reduce((acc, quiz) => acc + (quiz.scored_marks / quiz.total_marks) * 100, 0) /
                      recentQuizzes.length,
                    )
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI-Powered Learning
            </CardTitle>
            <CardDescription>Enhance your studies with artificial intelligence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/ai-tutor">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Bot className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-semibold">AI Study Assistant</h4>
                        <p className="text-sm text-gray-600">Ask questions and get instant help</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>AI-generated topic summaries available on all topics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Brain className="h-4 w-4 text-green-600" />
                  <span>Intelligent question generation for better practice</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subjects */}
          <Class9Subjects />


          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Results</CardTitle>
              <CardDescription>Your latest quiz performance</CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuizzes?.length ? (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                          style={{
                            backgroundColor: `${quiz.subject?.color || "#3b82f6"}20`,
                            color: quiz.subject?.color || "#3b82f6",
                          }}
                        >
                          {Math.round((quiz.scored_marks / quiz.total_marks) * 100)}%
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{quiz.subject?.name}</h4>
                          <p className="text-xs text-gray-600">
                            {quiz.correct_answers}/{quiz.total_questions} correct
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={quiz.scored_marks / quiz.total_marks >= 0.8 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {quiz.scored_marks}/{quiz.total_marks}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No quizzes taken yet</p>
                  <p className="text-sm">Start reading chapters to unlock quizzes!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

        {/* Practice with AI card */}
        <a href="/practice/ai" className="block p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
          <div className="text-sm text-purple-600 font-semibold mb-1">Practice with AI</div>
          <div className="text-gray-700">Generate syllabus-accurate questions and take a quick quiz.</div>
        </a>
        