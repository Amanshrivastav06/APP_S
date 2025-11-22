import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, FileText, Clock } from "lucide-react"
import { notFound } from "next/navigation"

interface BookPageProps {
  params: Promise<{ id: string }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get book details with subject info
  const { data: book } = await supabase
    .from("books")
    .select(`
      *,
      subject:subjects(*)
    `)
    .eq("id", id)
    .single()

  if (!book) {
    notFound()
  }

  // Get chapters for this book
  const { data: chapters } = await supabase
    .from("chapters")
    .select(`
      *,
      topics:topics(count)
    `)
    .eq("book_id", id)
    .order("chapter_number")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href={`/subjects/${book.subject.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {book.subject.name}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Book Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div
                className="w-24 h-32 rounded-lg flex items-center justify-center text-4xl"
                style={{ backgroundColor: `${book.subject.color}20`, color: book.subject.color }}
              >
                📚
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-balance">{book.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{book.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">Class {book.class_level}</Badge>
                <Badge style={{ backgroundColor: `${book.subject.color}20`, color: book.subject.color }}>
                  {book.subject.name}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters List */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Chapters</h2>
            <div className="text-sm text-gray-600">{chapters?.length || 0} chapters available</div>
          </div>

          <div className="space-y-4">
            {chapters?.map((chapter) => (
              <Link key={chapter.id} href={`/chapters/${chapter.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          Chapter {chapter.chapter_number}: {chapter.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{chapter.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {chapter.topics?.[0]?.count || 0} topics
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>~15 min</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Start Reading
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
