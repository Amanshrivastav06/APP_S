import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, BookOpen, Brain, FileText, Play } from "lucide-react"
import { notFound } from "next/navigation"
import { ChapterProgress } from "@/components/chapter-progress"

interface ChapterPageProps {
  params: Promise<{ id: string }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get chapter details with book and subject info
  const { data: chapter } = await supabase
    .from("chapters")
    .select(`
      *,
      book:books(
        *,
        subject:subjects(*)
      )
    `)
    .eq("id", id)
    .single()

  if (!chapter) {
    notFound()
  }

  // Get topics for this chapter
  const { data: topics } = await supabase.from("topics").select("*").eq("chapter_id", id).order("topic_order")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/books/${chapter.book.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {chapter.book.title}
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
              <Link href={`/quiz/chapter/${chapter.id}`}>
                <Button size="sm" style={{ backgroundColor: chapter.book.subject.color }}>
                  <Brain className="h-4 w-4 mr-2" />
                  Take Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-balance">
              Chapter {chapter.chapter_number}: {chapter.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{chapter.description}</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge variant="secondary">{chapter.book.subject.name}</Badge>
              <Badge style={{ backgroundColor: `${chapter.book.subject.color}20`, color: chapter.book.subject.color }}>
                Class {chapter.book.class_level}
              </Badge>
            </div>

            <div className="max-w-md mx-auto">
              <ChapterProgress userId={user?.id} chapterId={chapter.id} totalTopics={topics?.length || 0} />
            </div>
          </div>

          {/* Chapter Content */}
          {chapter.content && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Chapter Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{chapter.content}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Topics in this Chapter</h2>

          <div className="space-y-4">
            {topics?.map((topic, index) => (
              <Link key={topic.id} href={`/topics/${topic.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                            {index + 1}
                          </span>
                          {topic.title}
                        </CardTitle>
                        {topic.summary && <CardDescription className="mt-2 ml-11">{topic.summary}</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between ml-11">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Read Topic</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Chapter Actions */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-center gap-4">
              <Link href={`/quiz/chapter/${chapter.id}`}>
                <Button size="lg" style={{ backgroundColor: chapter.book.subject.color }}>
                  <Brain className="h-5 w-5 mr-2" />
                  Take Chapter Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
