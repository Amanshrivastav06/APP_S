import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, BookOpen, Brain, Bot } from "lucide-react"
import { notFound } from "next/navigation"
import { ProgressTracker } from "@/components/progress-tracker"
import { AISummary } from "@/components/ai-summary"

interface TopicPageProps {
  params: Promise<{ id: string }>
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get topic details with chapter, book, and subject info
  const { data: topic } = await supabase
    .from("topics")
    .select(`
      *,
      chapter:chapters(
        *,
        book:books(
          *,
          subject:subjects(*)
        )
      )
    `)
    .eq("id", id)
    .single()

  if (!topic) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/chapters/${topic.chapter.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chapter {topic.chapter.chapter_number}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {user && (
                <Link href="/dashboard">
                  <Button size="sm" variant="outline">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/ai-tutor">
                <Button size="sm" variant="outline">
                  <Bot className="h-4 w-4 mr-2" />
                  AI Tutor
                </Button>
              </Link>
              <Link href={`/quiz/topic/${topic.id}`}>
                <Button size="sm" variant="outline">
                  <Brain className="h-4 w-4 mr-2" />
                  Practice Questions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Topic Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Topic Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-balance">{topic.title}</h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="secondary">{topic.chapter.book.subject.name}</Badge>
              <Badge variant="outline">
                Chapter {topic.chapter.chapter_number}: {topic.chapter.title}
              </Badge>
            </div>
          </div>

          {/* Topic Summary */}
          {topic.summary && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Quick Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed">{topic.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detailed Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg prose-gray max-w-none">
                {topic.content ? (
                  <div className="text-gray-800 leading-relaxed space-y-4">
                    {topic.content.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Content for this topic will be available soon.</p>
                    <p className="text-sm">Check back later for detailed explanations and examples.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          {topic.content && <AISummary topicTitle={topic.title} content={topic.content} />}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <ProgressTracker userId={user?.id} topicId={topic.id} type="reading">
              <div />
            </ProgressTracker>
            <Link href={`/quiz/topic/${topic.id}`}>
              <Button
                size="lg"
                style={{ backgroundColor: topic.chapter.book.subject.color }}
                className="flex items-center gap-2"
              >
                <Brain className="h-5 w-5" />
                Practice Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
