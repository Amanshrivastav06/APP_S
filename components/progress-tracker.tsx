"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ProgressTrackerProps {
  userId?: string
  chapterId?: string
  topicId?: string
  type: "reading" | "quiz_completed"
  children: React.ReactNode
}

export function ProgressTracker({ userId, chapterId, topicId, type, children }: ProgressTrackerProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (userId && (chapterId || topicId)) {
      checkProgress()
    }
  }, [userId, chapterId, topicId])

  const checkProgress = async () => {
    if (!userId) return

    const { data } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("progress_type", type)
      .eq(chapterId ? "chapter_id" : "topic_id", chapterId || topicId)
      .single()

    setIsCompleted(!!data)
  }

  const toggleProgress = async () => {
    if (!userId) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    try {
      if (isCompleted) {
        // Remove progress
        await supabase
          .from("user_progress")
          .delete()
          .eq("user_id", userId)
          .eq("progress_type", type)
          .eq(chapterId ? "chapter_id" : "topic_id", chapterId || topicId)
      } else {
        // Add progress
        await supabase.from("user_progress").insert({
          user_id: userId,
          chapter_id: chapterId || null,
          topic_id: topicId || null,
          progress_type: type,
        })
      }

      setIsCompleted(!isCompleted)
    } catch (error) {
      console.error("Error updating progress:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {children}
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        onClick={toggleProgress}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {isCompleted ? "Completed" : "Mark Complete"}
      </Button>
    </div>
  )
}
