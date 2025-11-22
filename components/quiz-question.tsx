"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

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

interface QuizQuestionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer: (questionId: string, answer: string, isCorrect: boolean, timeTaken: number) => void
  showResult?: boolean
  userAnswer?: string
  isCorrect?: boolean
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  userAnswer,
  isCorrect,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || "")
  const [startTime] = useState(Date.now())
  const [hasAnswered, setHasAnswered] = useState(!!userAnswer)

  const handleSubmitAnswer = () => {
    if (!selectedAnswer.trim()) return

    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const correct = checkAnswer(selectedAnswer)
    setHasAnswered(true)
    onAnswer(question.id, selectedAnswer, correct, timeTaken)
  }

  const checkAnswer = (answer: string): boolean => {
    if (question.question_type === "multiple_choice" || question.question_type === "true_false") {
      return answer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim()
    }
    // For short/long answers, we'll do a simple case-insensitive match
    // In a real app, you might want more sophisticated matching
    return answer.toLowerCase().trim().includes(question.correct_answer.toLowerCase().trim())
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const renderQuestionInput = () => {
    switch (question.question_type) {
      case "multiple_choice":
        return (
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={hasAnswered}>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                  {showResult && option === question.correct_answer && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {showResult && option === userAnswer && option !== question.correct_answer && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        )

      case "true_false":
        return (
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={hasAnswered}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="True" id="true" />
                <Label htmlFor="true" className="cursor-pointer">
                  True
                </Label>
                {showResult && "True" === question.correct_answer && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id="false" />
                <Label htmlFor="false" className="cursor-pointer">
                  False
                </Label>
                {showResult && "False" === question.correct_answer && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
            </div>
          </RadioGroup>
        )

      case "short_answer":
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={hasAnswered}
            />
            {showResult && (
              <div className="text-sm text-gray-600">
                <strong>Correct answer:</strong> {question.correct_answer}
              </div>
            )}
          </div>
        )

      case "long_answer":
        return (
          <div className="space-y-3">
            <Textarea
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Write your detailed answer..."
              className="min-h-[120px]"
              disabled={hasAnswered}
            />
            {showResult && (
              <div className="text-sm text-gray-600">
                <strong>Expected answer:</strong> {question.correct_answer}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty_level)}`}
            >
              {question.difficulty_level}
            </span>
            <span className="text-sm text-gray-600">
              {question.marks} mark{question.marks !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium text-gray-900">{question.question_text}</div>

        {renderQuestionInput()}

        {!hasAnswered && !showResult && (
          <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer.trim()} className="w-full" size="lg">
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            {question.explanation && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                <p className="text-blue-800">{question.explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
