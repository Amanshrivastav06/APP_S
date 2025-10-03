"use client"

import { createClient } from "@/lib/supabase/client"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"

interface ChapterProgressProps {
  userId?: string
  chapterId: string
  totalTopics: number
}

export function ChapterProgress({ userId, chapterId, totalTopics }: ChapterProgressProps) {
  const [completedTopics, setCompletedTopics] = useState(0)
  const [isChapterComplete, setIsChapterComplete] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (userId) {
      fetchProgress()
    }
  }, [userId, chapterId])

  const fetchProgress = async () => {
    if (!userId) return

    // Get completed topics count
    const { data: topicProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .eq("progress_type", "reading")

    const completed = topicProgress?.length || 0
    setCompletedTopics(completed)

    // Check if chapter is marked as complete
    const { data: chapterProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .eq("progress_type", "quiz_completed")
      .single()

    setIsChapterComplete(!!chapterProgress)
  }

  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

  if (!userId) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <BookOpen className="h-4 w-4" />
        <span>Sign in to track progress</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Reading Progress</span>
        </div>
        <Badge variant={isChapterComplete ? "default" : "secondary"} className="text-xs">
          {isChapterComplete ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Chapter Complete
            </>
          ) : (
            `${completedTopics}/${totalTopics} topics`
          )}
        </Badge>
      </div>
      <div className="space-y-1">
        <Progress value={progressPercentage} className="h-2" />
        <div className="text-xs text-gray-600 text-right">{Math.round(progressPercentage)}% complete</div>
      </div>
    </div>
  )
}
