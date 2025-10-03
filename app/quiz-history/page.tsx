import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Clock, Trophy, RotateCcw, Eye } from "lucide-react"

export default async function QuizHistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get all quiz attempts with detailed data
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select(`
      *,
      subject:subjects(name, color, icon),
      chapter:chapters(title, chapter_number)
    `)
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-100"
    if (percentage >= 70) return "text-blue-600 bg-blue-100"
    if (percentage >= 50) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const getQuizTypeLabel = (type: string, chapter?: any) => {
    switch (type) {
      case "chapter":
        return chapter ? `Chapter ${chapter.chapter_number}: ${chapter.title}` : "Chapter Quiz"
      case "subject":
        return "Subject Quiz"
      case "mixed":
        return "Mixed Practice"
      default:
        return "Quiz"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Quiz History</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">{quizAttempts?.length || 0} quizzes completed</div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {quizAttempts?.length ? (
          <div className="space-y-4">
            {quizAttempts.map((attempt) => {
              const percentage = Math.round((attempt.scored_marks / attempt.total_marks) * 100)
              return (
                <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                          style={{
                            backgroundColor: `${attempt.subject?.color || "#3b82f6"}20`,
                            color: attempt.subject?.color || "#3b82f6",
                          }}
                        >
                          {attempt.subject?.icon || "📚"}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{attempt.subject?.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {getQuizTypeLabel(attempt.quiz_type, attempt.chapter)}
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>{formatDate(attempt.completed_at)}</span>
                            <span>{attempt.total_questions} questions</span>
                            {attempt.time_taken && (
                              <span>
                                {Math.floor(attempt.time_taken / 60)}m {attempt.time_taken % 60}s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-lg font-bold ${getScoreColor(percentage)}`}>{percentage}%</Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {attempt.scored_marks}/{attempt.total_marks} marks
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">{attempt.correct_answers} correct</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-red-600">
                            {attempt.total_questions - attempt.correct_answers} incorrect
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        {attempt.quiz_type === "chapter" && attempt.chapter && (
                          <Link href={`/quiz/chapter/${attempt.chapter.id}`}>
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Retake
                            </Button>
                          </Link>
                        )}
                        {attempt.quiz_type === "subject" && (
                          <Link href={`/quiz/subject/${attempt.subject_id}`}>
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Retake
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6 text-gray-400" />
                  No Quiz History
                </CardTitle>
                <CardDescription>
                  You haven't taken any quizzes yet. Start learning to build your quiz history!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button className="w-full">Start Learning</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
