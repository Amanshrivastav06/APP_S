"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type ChapterItem = {
    id: string;
    title: string;
    chapter_number?: number | null;
    description?: string | null;
    file_url: string;
};

type Props = { items: ChapterItem[]; subjectLabel?: string };

export default function ChapterPdfViewer({ items, subjectLabel }: Props) {
    const sp = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // show nothing selected by default; only select if ?ch= is present
    const chParam = sp.get("ch");
    const initialIdx = chParam
        ? Math.max(
            0,
            items.findIndex(i => (i.chapter_number ?? 0) === Number(chParam))
        )
        : -1;

    const [idx, setIdx] = useState<number>(initialIdx);
    const selected = idx >= 0 ? items[idx] : null;

    const select = (i: number) => {
        setIdx(i);
        const n = items[i].chapter_number ?? "";
        router.replace(n ? `${pathname}?ch=${n}` : pathname);
    };

    const clean = (t: string) =>
        // remove leading "Chapter X –/—/- " safely
        t.replace(/^Chapter\s*\d+\s*[–—-]\s*/i, "");

    if (!items?.length) return <div className="p-6 text-muted-foreground">No materials found.</div>;

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Left: chapter list */}
            <aside className="md:col-span-1">
                <div className="sticky top-4 max-h-[85vh] overflow-auto rounded-2xl border bg-white/70 backdrop-blur p-3">
                    <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                        {subjectLabel ?? "Chapters"}
                    </div>
                    <ul className="mt-2 space-y-1">
                        {items.map((it, i) => (
                            <li key={it.id}>
                                <button
                                    onClick={() => select(i)}
                                    className={`w-full text-left rounded-xl px-3 py-2 border transition
                    ${i === idx ? "border-indigo-500 bg-indigo-50" : "border-transparent hover:bg-gray-50"}`}
                                >
                                    <div className="text-sm font-medium">
                                        {it.chapter_number ? `Chapter ${it.chapter_number}` : "Chapter"} – {clean(it.title)}
                                    </div>
                                    {it.description ? (
                                        <div className="text-xs text-muted-foreground line-clamp-1">{it.description}</div>
                                    ) : null}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Right: viewer (only after click) */}
            <section className="md:col-span-2">
                <div className="rounded-2xl border bg-white/70 backdrop-blur p-4">
                    {selected ? (
                        <>
                            <h2 className="text-xl font-semibold">{selected.title}</h2>
                            {selected.description ? (
                                <p className="text-sm text-muted-foreground">{selected.description}</p>
                            ) : null}
                            <div className="mt-4 min-h-[85vh] w-full overflow-hidden rounded-xl border bg-white">
                                <iframe src={`${selected.file_url}#view=FitH`} className="w-full h-full" />
                            </div>
                            <div className="mt-3 text-sm">
                                <a href={selected.file_url} target="_blank" className="underline">Open PDF in new tab</a>
                            </div>
                        </>
                    ) : (
                        <div className="h-[85vh] flex items-center justify-center text-center">
                            <div>
                                <div className="text-lg font-medium">Select a chapter to view the PDF</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    Click “Chapter 1”, “Chapter 2”, … from the list on the left.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
