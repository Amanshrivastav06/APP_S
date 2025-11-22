"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface SubjectStats {
  id: string
  name: string
  color: string
  icon: string
  totalQuizzes: number
  averageScore: number
  bestScore: number
  recentTrend: "up" | "down" | "stable"
  completedChapters: number
  totalChapters: number
}

interface SubjectPerformanceProps {
  subjects: SubjectStats[]
}

export function SubjectPerformance({ subjects }: SubjectPerformanceProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
                  >
                    {subject.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{subject.name}</h4>
                    <p className="text-sm text-gray-600">{subject.totalQuizzes} quizzes taken</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(subject.recentTrend)}
                  <span className={`text-sm font-medium ${getTrendColor(subject.recentTrend)}`}>
                    {subject.averageScore}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {subject.completedChapters}/{subject.totalChapters}
                    </span>
                  </div>
                  <Progress
                    value={(subject.completedChapters / subject.totalChapters) * 100}
                    className="h-2"
                    style={{ backgroundColor: `${subject.color}20` }}
                  />
                </div>
                <div className="text-right">
                  <div className="text-gray-600">Best Score</div>
                  <Badge
                    variant={subject.bestScore >= 90 ? "default" : subject.bestScore >= 70 ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {subject.bestScore}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
