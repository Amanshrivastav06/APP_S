"use client"

import { Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface QuizTimerProps {
  onTimeUp?: () => void
  duration?: number // in seconds, optional
}

export function QuizTimer({ onTimeUp, duration }: QuizTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1
        if (duration && newTime >= duration && onTimeUp) {
          onTimeUp()
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [duration, onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
      <Clock className="h-4 w-4" />
      <span>{formatTime(timeElapsed)}</span>
      {duration && <span className="text-gray-400">/ {formatTime(duration)}</span>}
    </div>
  )
}
