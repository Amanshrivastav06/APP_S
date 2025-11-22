"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, Target, Zap, BookOpen, Brain } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  earned: boolean
  progress?: number
  target?: number
  color: string
}

interface AchievementBadgesProps {
  userStats: {
    totalQuizzes: number
    averageScore: number
    perfectScores: number
    streakDays: number
    topicsRead: number
    chaptersCompleted: number
  }
}

export function AchievementBadges({ userStats }: AchievementBadgesProps) {
  const achievements: Achievement[] = [
    {
      id: "first_quiz",
      title: "Getting Started",
      description: "Complete your first quiz",
      icon: <BookOpen className="h-5 w-5" />,
      earned: userStats.totalQuizzes >= 1,
      color: "bg-blue-500",
    },
    {
      id: "quiz_master",
      title: "Quiz Master",
      description: "Complete 10 quizzes",
      icon: <Brain className="h-5 w-5" />,
      earned: userStats.totalQuizzes >= 10,
      progress: userStats.totalQuizzes,
      target: 10,
      color: "bg-purple-500",
    },
    {
      id: "perfectionist",
      title: "Perfectionist",
      description: "Score 100% on a quiz",
      icon: <Star className="h-5 w-5" />,
      earned: userStats.perfectScores >= 1,
      color: "bg-yellow-500",
    },
    {
      id: "high_achiever",
      title: "High Achiever",
      description: "Maintain 80%+ average score",
      icon: <Trophy className="h-5 w-5" />,
      earned: userStats.averageScore >= 80,
      color: "bg-green-500",
    },
    {
      id: "consistent",
      title: "Consistent Learner",
      description: "Study for 7 days in a row",
      icon: <Target className="h-5 w-5" />,
      earned: userStats.streakDays >= 7,
      progress: userStats.streakDays,
      target: 7,
      color: "bg-orange-500",
    },
    {
      id: "speed_reader",
      title: "Speed Reader",
      description: "Read 50 topics",
      icon: <Zap className="h-5 w-5" />,
      earned: userStats.topicsRead >= 50,
      progress: userStats.topicsRead,
      target: 50,
      color: "bg-red-500",
    },
  ]

  const earnedAchievements = achievements.filter((a) => a.earned)
  const inProgressAchievements = achievements.filter((a) => !a.earned && a.progress !== undefined)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">Earned ({earnedAchievements.length})</h4>
            <div className="grid grid-cols-2 gap-3">
              {earnedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${achievement.color}`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-gray-900 truncate">{achievement.title}</h5>
                    <p className="text-xs text-gray-600 truncate">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In Progress Achievements */}
        {inProgressAchievements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-3">In Progress</h4>
            <div className="space-y-3">
              {inProgressAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${achievement.color} opacity-60`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm text-gray-900">{achievement.title}</h5>
                      <span className="text-xs text-gray-600">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${achievement.color}`}
                        style={{
                          width: `${Math.min(((achievement.progress || 0) / (achievement.target || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {earnedAchievements.length === 0 && inProgressAchievements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start taking quizzes to earn achievements!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
