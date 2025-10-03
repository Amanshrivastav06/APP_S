"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"

interface AISummaryProps {
  topicTitle: string
  content: string
}

export function AISummary({ topicTitle, content }: AISummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const generateSummary = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicTitle, content }),
      })

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI-Generated Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!summary ? (
          <Button onClick={generateSummary} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Summary
              </>
            )}
          </Button>
        ) : (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{summary}</div>
            <Button
              onClick={generateSummary}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="mt-4 bg-transparent"
            >
              Regenerate Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
