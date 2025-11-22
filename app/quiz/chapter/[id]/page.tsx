"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { ArrowLeft, Brain, Trophy, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizTimer } from "@/components/quiz-timer"

interface ChapterQuizPageProps {
  params: Promise<{ id: string }>
}

interface Question {
  id: string
  question_text: string
  question_type: "multiple_choice" | "true_false" | "short_answer" | "long_answer"
  options?: string[]
  correct_answer: string
  explanation?: string
  difficulty_level: "easy" | "medium" | "hard"
  marks: number
}

interface QuizResponse {
  questionId: string
  answer: string
  isCorrect: boolean
  timeTaken: number
}

export default function ChapterQuizPage({ params }: ChapterQuizPageProps) {
  const [chapterId, setChapterId] = useState<string>("")
  const [chapter, setChapter] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<QuizResponse[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [quizAttemptId, setQuizAttemptId] = useState<string>("")

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const initializeQuiz = async () => {
      const resolvedParams = await params
      setChapterId(resolvedParams.id)

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }
      setUser(currentUser)

      // Get chapter details
      const { data: chapterData } = await supabase
        .from("chapters")
        .select(`
          *,
          book:books(
            *,
            subject:subjects(*)
          )
        `)
        .eq("id", resolvedParams.id)
        .single()

      setChapter(chapterData)

      // Get questions for this chapter
      const { data: questionsData } = await supabase
        .from("questions")
        .select("*")
        .eq("chapter_id", resolvedParams.id)
        .limit(10) // Limit to 10 questions per quiz

      if (questionsData) {
        const formattedQuestions = questionsData.map((q) => ({
          ...q,
          options: q.options ? JSON.parse(q.options as string) : undefined,
        }))
        setQuestions(formattedQuestions)
      }

      setLoading(false)
    }

    initializeQuiz()
  }, [params, supabase, router])

  const startQuiz = async () => {
    if (!user || !chapter) return

    // Create quiz attempt
    const { data: attemptData, error } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: user.id,
        subject_id: chapter.book.subject.id,
        chapter_id: chapterId,
        quiz_type: "chapter",
        total_questions: questions.length,
        total_marks: questions.reduce((sum, q) => sum + q.marks, 0),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating quiz attempt:", error)
      return
    }

    setQuizAttemptId(attemptData.id)
    setQuizStarted(true)
  }

  const handleAnswer = async (questionId: string, answer: string, isCorrect: boolean, timeTaken: number) => {
    const newResponse: QuizResponse = {
      questionId,
      answer,
      isCorrect,
      timeTaken,
    }

    const updatedResponses = [...responses, newResponse]
    setResponses(updatedResponses)

    // Save response to database
    await supabase.from("quiz_responses").insert({
      quiz_attempt_id: quizAttemptId,
      question_id: questionId,
      user_answer: answer,
      is_correct: isCorrect,
      marks_awarded: isCorrect ? questions.find((q) => q.id === questionId)?.marks || 0 : 0,
      time_taken: timeTaken,
    })

    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }, 2000) // Show result for 2 seconds
    } else {
      setTimeout(() => {
        completeQuiz(updatedResponses)
      }, 2000)
    }
  }

  const completeQuiz = async (finalResponses: QuizResponse[]) => {
    const correctAnswers = finalResponses.filter((r) => r.isCorrect).length
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)
    const scoredMarks = finalResponses.reduce((sum, response) => {
      const question = questions.find((q) => q.id === response.questionId)
      return sum + (response.isCorrect ? question?.marks || 0 : 0)
    }, 0)

    // Update quiz attempt
    await supabase
      .from("quiz_attempts")
      .update({
        correct_answers: correctAnswers,
        scored_marks: scoredMarks,
      })
      .eq("id", quizAttemptId)

    // Mark chapter as quiz completed in user progress
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      chapter_id: chapterId,
      progress_type: "quiz_completed",
    })

    setQuizCompleted(true)
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setResponses([])
    setQuizStarted(false)
    setQuizCompleted(false)
    setQuizAttemptId("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!chapter || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link href={`/chapters/${chapterId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chapter
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Questions Available</CardTitle>
              <CardDescription>There are no quiz questions available for this chapter yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/chapters/${chapterId}`}>
                <Button className="w-full">Back to Chapter</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + (quizCompleted ? 1 : 0)) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/chapters/${chapterId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chapter
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              {quizStarted && !quizCompleted && <QuizTimer />}
              <Badge style={{ backgroundColor: `${chapter.book.subject.color}20`, color: chapter.book.subject.color }}>
                {chapter.book.subject.name}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizStarted && !quizCompleted && (
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Chapter {chapter.chapter_number} Quiz: {chapter.title}
                </CardTitle>
                <CardDescription>
                  Test your knowledge with {questions.length} questions from this chapter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-900">{questions.length}</div>
                    <div className="text-blue-700">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-900">{questions.reduce((sum, q) => sum + q.marks, 0)}</div>
                    <div className="text-green-700">Total Marks</div>
                  </div>
                </div>
                <Button onClick={startQuiz} size="lg" className="w-full">
                  <Brain className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {quizStarted && !quizCompleted && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Chapter {chapter.chapter_number} Quiz</h1>
              <div className="text-sm text-gray-600">
                {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <Progress value={progress} className="h-2" />

            <QuizQuestion
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              showResult={responses.some((r) => r.questionId === currentQuestion.id)}
              userAnswer={responses.find((r) => r.questionId === currentQuestion.id)?.answer}
              isCorrect={responses.find((r) => r.questionId === currentQuestion.id)?.isCorrect}
            />
          </div>
        )}

        {quizCompleted && (
          <div className="text-center space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  Quiz Completed!
                </CardTitle>
                <CardDescription>
                  Here are your results for Chapter {chapter.chapter_number}: {chapter.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">
                      {responses.filter((r) => r.isCorrect).length}
                    </div>
                    <div className="text-blue-700">Correct</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-900">
                      {responses.filter((r) => !r.isCorrect).length}
                    </div>
                    <div className="text-red-700">Incorrect</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">
                      {Math.round((responses.filter((r) => r.isCorrect).length / questions.length) * 100)}%
                    </div>
                    <div className="text-green-700">Score</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={restartQuiz} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                  <Link href={`/chapters/${chapterId}`}>
                    <Button>Back to Chapter</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
