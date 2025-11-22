// lib/export-questions.ts

// NOTE: We lazy-load pdfmake inside the function to avoid SSR/ESM pitfalls in Next.js.
// DOCX is safe to import statically.
import { Document, Packer, Paragraph, TextRun } from "docx";

/* =========================
   Shared types & helpers
========================= */

export type AnyQuestion = {
    id?: string;
    question?: string;
    question_text?: string;
    options?: string[];
    choices?: string[];
    correct?: string;
    correct_answer?: string;
    answer?: string;
    solution?: string;
    explanation?: string;
    type?: string;
    category?: string;
    difficulty?: string;
    level?: string;
};

function normalizeQuestion(q: AnyQuestion) {
    const text = q.question || q.question_text || "";
    const options = (q.options?.length ? q.options : q.choices) || [];
    const answer = q.correct_answer || q.correct || q.answer || "";
    const solution = q.explanation || q.solution || "";
    const meta: string[] = [];
    if (q.type) meta.push(`Type: ${q.type}`);
    if (q.category) meta.push(`Category: ${q.category}`);
    if (q.difficulty || q.level) meta.push(`Level: ${q.difficulty || q.level}`);
    return { text, options, answer, solution, meta: meta.join(" • ") };
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/** Convert simple LaTeX/HTML-ish math to Unicode so it looks nice in all exports */
function normalizeMath(s: string) {
    if (!s) return s;
    let t = s;

    // HTML entities
    t = t
        .replace(/&radic;|&#8730;|&#x221A;/gi, "√")
        .replace(/&pi;|&#960;|&#x3C0;/gi, "π")
        .replace(/&times;|&#215;|&#x00D7;/gi, "×")
        .replace(/&divide;|&#247;|&#x00F7;/gi, "÷");

    // LaTeX
    t = t
        .replace(/\\pi\b/g, "π")
        .replace(/\\times\b/g, "×")
        .replace(/\\div\b/g, "÷")
        .replace(/\\sqrt\s*\{([^}]+)\}/g, "√$1")
        .replace(/\\sqrt\s*\(([^)]+)\)/g, "√$1")
        .replace(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/g, "$1/$2");

    // Text sqrt(...)
    t = t.replace(/\bsqrt\s*\(([^)]+)\)/gi, "√$1");

    // Smart quotes / minus
    t = t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\u2212/g, "-");

    return t;
}

/* =========================
   JSON / CSV exporters
========================= */

export function exportQuestionsAsJSON(questions: AnyQuestion[], filename = "questions.json") {
    downloadBlob(new Blob([JSON.stringify(questions, null, 2)], { type: "application/json" }), filename);
}

export function exportQuestionsAsCSV(questions: AnyQuestion[], filename = "questions.csv") {
    const rows = [["No", "Question", "Options", "Answer", "Solution", "Meta"]];
    questions.forEach((q, i) => {
        const n = normalizeQuestion(q);
        rows.push([
            String(i + 1),
            normalizeMath(n.text),
            (n.options || []).map(normalizeMath).join(" | "),
            normalizeMath(n.answer),
            normalizeMath(n.solution),
            normalizeMath(n.meta),
        ]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
}

/* =========================
   PDF exporter (pdfmake, lazy-loaded)
   - robust unicode, no extra fonts
   - answers/solutions HIDDEN
========================= */

export async function exportQuestionsAsPDF(
    questions: AnyQuestion[],
    filename = "questions.pdf"
) {
    // Lazy-load pdfmake only on the client
    const pdfMakeMod: any = await import("pdfmake/build/pdfmake");
    const pdfFontsMod: any = await import("pdfmake/build/vfs_fonts");

    // Attach VFS safely regardless of how the module is packed
    const vfs =
        pdfFontsMod?.pdfMake?.vfs ??
        pdfFontsMod?.default?.pdfMake?.vfs ??
        pdfFontsMod?.vfs ??
        undefined;

    if (!vfs) {
        console.warn("[PDF] Could not find vfs in pdfmake fonts module. Falling back to default embedded fonts.");
    } else {
        pdfMakeMod.default ? (pdfMakeMod.default.vfs = vfs) : (pdfMakeMod.vfs = vfs);
    }

    const pdfMake = (pdfMakeMod.default ?? pdfMakeMod) as any;

    const content: any[] = [
        { text: "Practice with AI – Questions", style: "title", margin: [0, 0, 0, 8] },
    ];

    questions.forEach((q, i) => {
        const n = normalizeQuestion(q);

        content.push({ text: `${i + 1}. ${normalizeMath(n.text)}`, style: "question" });

        if (n.options && n.options.length) {
            n.options.forEach((opt, idx) => {
                content.push({
                    text: `(${String.fromCharCode(65 + idx)}) ${normalizeMath(opt)}`,
                    style: "option",
                    margin: [12, 2, 0, 0],
                });
            });
        }

        // ❌ answers & solutions intentionally omitted
        if (n.meta) {
            content.push({ text: normalizeMath(n.meta), style: "meta", margin: [0, 4, 0, 10] });
        } else {
            content.push({ text: "", margin: [0, 0, 0, 8] });
        }
    });

    const docDefinition: any = {
        pageSize: "A4",
        pageMargins: [40, 40, 40, 40],
        content,
        styles: {
            title: { fontSize: 16, bold: true },
            question: { fontSize: 11, bold: true, margin: [0, 6, 0, 2] },
            option: { fontSize: 11 },
            meta: { fontSize: 9, color: "#666" },
        },
        defaultStyle: {
            font: "Roboto", // comes bundled in vfs_fonts
        },
    };

    pdfMake.createPdf(docDefinition).download(filename);
}

/* =========================
   DOCX exporter
   - answers/solutions HIDDEN here too
========================= */

export async function exportQuestionsAsDOCX(questions: AnyQuestion[], filename = "questions.docx") {
    const children: Paragraph[] = [
        new Paragraph({
            children: [new TextRun({ text: "Practice with AI – Questions", bold: true, size: 28 })],
        }),
    ];

    questions.forEach((q, idx) => {
        const n = normalizeQuestion(q);

        children.push(
            new Paragraph({ children: [new TextRun({ text: `${idx + 1}. ${normalizeMath(n.text)}`, bold: true })] })
        );

        (n.options || []).forEach((opt, i) => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: `   (${String.fromCharCode(65 + i)}) ${normalizeMath(opt)}` })],
                })
            );
        });

        // ❌ answers & solutions intentionally omitted

        if (n.meta) {
            children.push(new Paragraph({ children: [new TextRun({ text: normalizeMath(n.meta), italics: true, size: 20 })] }));
        }
        children.push(new Paragraph({ children: [new TextRun({ text: "" })] })); // spacer
    });

    const blob = await Packer.toBlob(new Document({ sections: [{ properties: {}, children }] }));
    downloadBlob(blob, filename);
}
