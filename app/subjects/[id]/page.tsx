import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, BookOpen, FileText } from "lucide-react"
import { notFound } from "next/navigation"

interface SubjectPageProps {
  params: Promise<{ id: string }>
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get subject details
  const { data: subject } = await supabase.from("subjects").select("*").eq("id", id).single()

  if (!subject) {
    notFound()
  }

  // Get books for this subject
  const { data: books } = await supabase
    .from("books")
    .select(`
      *,
      chapters:chapters(count)
    `)
    .eq("subject_id", id)
    .order("title")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Subjects
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Subject Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
          >
            {subject.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject.name}</h1>
          <p className="text-lg text-gray-600 mb-4">{subject.description}</p>
          <Badge variant="secondary">Class {subject.class_level}</Badge>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books?.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-8 w-8 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                        <CardDescription className="mt-2">{book.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{book.chapters?.[0]?.count || 0} Chapters</span>
                      </div>
                      <Button size="sm" style={{ backgroundColor: subject.color }}>
                        Read Book
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
