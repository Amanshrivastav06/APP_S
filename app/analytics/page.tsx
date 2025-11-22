import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target } from "lucide-react"
import { PerformanceChart } from "@/components/performance-chart"
import { SubjectPerformance } from "@/components/subject-performance"
import { AchievementBadges } from "@/components/achievement-badges"

export default async function AnalyticsPage() {
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
      subject:subjects(name, color, icon)
    `)
    .eq("user_id", user.id)
    .order("completed_at", { ascending: true })

  // Get user progress data
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

  // Get subjects with chapter counts
  const { data: subjects } = await supabase
    .from("subjects")
    .select(`
      *,
      books:books(
        chapters:chapters(count)
      )
    `)
    .eq("class_level", 9)

  // Process data for charts
  const performanceData =
    quizAttempts?.map((attempt) => ({
      date: attempt.completed_at,
      score: Math.round((attempt.scored_marks / attempt.total_marks) * 100),
      subject: attempt.subject?.name || "Unknown",
    })) || []

  // Calculate subject performance stats
  const subjectStats =
    subjects?.map((subject) => {
      const subjectQuizzes = quizAttempts?.filter((q) => q.subject_id === subject.id) || []
      const totalChapters =
        subject.books?.reduce((sum: number, book: any) => sum + (book.chapters?.[0]?.count || 0), 0) || 0
      const completedChapters =
        quizProgress?.filter((p) => {
          // This is a simplified calculation - in a real app you'd need to join with chapters table
          return true // For now, assume all quiz_completed progress is for this subject
        }).length || 0

      const averageScore =
        subjectQuizzes.length > 0
          ? Math.round(
              subjectQuizzes.reduce((sum, quiz) => sum + (quiz.scored_marks / quiz.total_marks) * 100, 0) /
                subjectQuizzes.length,
            )
          : 0

      const bestScore =
        subjectQuizzes.length > 0
          ? Math.max(...subjectQuizzes.map((quiz) => Math.round((quiz.scored_marks / quiz.total_marks) * 100)))
          : 0

      // Simple trend calculation based on last 3 quizzes
      const recentQuizzes = subjectQuizzes.slice(-3)
      let recentTrend: "up" | "down" | "stable" = "stable"
      if (recentQuizzes.length >= 2) {
        const firstScore = (recentQuizzes[0].scored_marks / recentQuizzes[0].total_marks) * 100
        const lastScore =
          (recentQuizzes[recentQuizzes.length - 1].scored_marks / recentQuizzes[recentQuizzes.length - 1].total_marks) *
          100
        if (lastScore > firstScore + 5) recentTrend = "up"
        else if (lastScore < firstScore - 5) recentTrend = "down"
      }

      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        icon: subject.icon,
        totalQuizzes: subjectQuizzes.length,
        averageScore,
        bestScore,
        recentTrend,
        completedChapters: Math.min(completedChapters, totalChapters), // Cap at total chapters
        totalChapters,
      }
    }) || []

  // Calculate user stats for achievements
  const userStats = {
    totalQuizzes: quizAttempts?.length || 0,
    averageScore:
      quizAttempts?.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, quiz) => sum + (quiz.scored_marks / quiz.total_marks) * 100, 0) /
              quizAttempts.length,
          )
        : 0,
    perfectScores: quizAttempts?.filter((quiz) => quiz.scored_marks === quiz.total_marks).length || 0,
    streakDays: 5, // This would need more complex calculation based on daily activity
    topicsRead: readingProgress?.length || 0,
    chaptersCompleted: quizProgress?.length || 0,
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
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Learning Analytics</h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">Welcome, {profile?.full_name || "Student"}!</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Total Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {quizAttempts?.reduce((sum, quiz) => sum + quiz.scored_marks, 0) || 0}
              </div>
              <p className="text-xs text-gray-600">
                out of {quizAttempts?.reduce((sum, quiz) => sum + quiz.total_marks, 0) || 0} marks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userStats.averageScore}%</div>
              <p className="text-xs text-gray-600">across all quizzes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{userStats.streakDays}</div>
              <p className="text-xs text-gray-600">days in a row</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Best Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.max(
                  ...(quizAttempts?.map((quiz) => Math.round((quiz.scored_marks / quiz.total_marks) * 100)) || [0]),
                )}
                %
              </div>
              <p className="text-xs text-gray-600">highest quiz score</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <PerformanceChart data={performanceData} title="Score Trend Over Time" type="line" />

          {/* Subject Performance */}
          <SubjectPerformance subjects={subjectStats} />
        </div>

        {/* Achievements */}
        <AchievementBadges userStats={userStats} />
      </div>
    </div>
  )
}
