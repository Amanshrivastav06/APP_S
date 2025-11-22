import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const FALLBACK = [
    {
        subject_id: "mathematics",
        category: "textbook",
        chapter_number: 1,
        title: "Chapter 1 – Number Systems (NCERT Class 9)",
        description: "NCERT Class 9 Mathematics, Chapter 1 PDF",
        file_url: "/materials/math/class9/ch1.pdf",
    },
    {
        subject_id: "mathematics",
        category: "textbook",
        chapter_number: 2,
        title: "Chapter 2 – Polynomials",
        description: "NCERT Class 9 Mathematics, Chapter 2 PDF",
        file_url: "/materials/math/class9/ch2.pdf",
    },
    {
        subject_id: "hindi-a",
        category: "textbook",
        chapter_number: 1,
        title: "Chapter 1 – दो बैलों की कथा",
        description: "Class 9 Hindi (Course A) – Ch 1",
        file_url: "/materials/hindi-a/class9/ch-1.pdf",
    },
];

export default async function Page({
    params,
}: { params: { subjectId: string; category: string; ch: string } }) {
    const chNum = Number(params.ch);

    let row: { title: string; description?: string | null; file_url?: string | null } | null = null;

    try {
        const supabase = createClient();
        const { data } = await supabase
            .from("materials")
            .select("title, description, file_url")
            .eq("subject_id", params.subjectId)
            .eq("category", params.category)
            .eq("chapter_number", chNum)
            .maybeSingle();
        row = data ?? null;
    } catch {
        // ignore
    }

    if (!row) {
        row =
            FALLBACK.find(
                r =>
                    r.subject_id === params.subjectId &&
                    r.category === params.category &&
                    r.chapter_number === chNum
            ) ?? null;
    }
    if (!row?.file_url) return notFound();

    return (
        <div className="p-4 md:p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Link href={`/materials/${params.subjectId}/${params.category}`} className="underline">
                    ← Back to chapters
                </Link>
            </div>

            <h1 className="mt-3 text-2xl font-semibold">{row.title}</h1>
            {row.description ? <p className="text-sm text-muted-foreground">{row.description}</p> : null}

            <div className="mt-4 h-[85vh] w-full overflow-hidden rounded-xl border bg-white">
                <iframe src={`${row.file_url}#view=FitH`} className="h-full w-full" />
            </div>

            <div className="mt-3 text-sm">
                <a href={row.file_url!} target="_blank" className="underline">Open PDF in new tab</a>
            </div>
        </div>
    );
}
