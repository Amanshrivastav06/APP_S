"use client";

import React, { useMemo, useState } from "react";
import { CLASS9_CHAPTERS, SubjectKey } from "@/data/class9_chapters";
import {
  exportQuestionsAsPDF,
  exportQuestionsAsDOCX,
  exportQuestionsAsCSV,
  exportQuestionsAsJSON,
} from "@/lib/export-questions";

type Category = "MCQ" | "Assertion-Reason" | "True/False" | "Short Answer";
type Level = "Easy" | "Medium" | "Hard";

type GenReq = {
  subject: SubjectKey;
  chapter: string;
  category: Category;
  level: Level;
  quantity: number;
};

type McqQ = { question: string; category: "MCQ"; options: string[]; answerIndex: number; solution: string };
type NonMcqQ = { question: string; category: Exclude<Category, "MCQ">; answer: string; solution: string };
type AnyQ = McqQ | NonMcqQ;

type ExportableQ = {
  question: string;
  options?: string[];
  answer?: string;
  solution?: string;
  category?: string;
  level?: string;
};

export default function PracticeWithAIPage() {
  const subjects = Object.keys(CLASS9_CHAPTERS) as SubjectKey[];
  const [subject, setSubject] = useState<SubjectKey>(subjects[0]);
  const [chapter, setChapter] = useState<string>(CLASS9_CHAPTERS[subjects[0]][0]);
  const [category, setCategory] = useState<Category>("MCQ");
  const [level, setLevel] = useState<Level>("Easy");
  const [quantity, setQuantity] = useState<number>(5);
  const [phase, setPhase] = useState<"form" | "quiz" | "results">("form");
  const [questions, setQuestions] = useState<AnyQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});

  const chapters = useMemo(() => CLASS9_CHAPTERS[subject], [subject]);

  const exportable: ExportableQ[] = useMemo(() => {
    return questions.map((q) => {
      if ((q as any).category === "MCQ") {
        const m = q as McqQ;
        const ansText = m.options?.[m.answerIndex] ?? "";
        const ansLetter = typeof m.answerIndex === "number" ? String.fromCharCode(65 + m.answerIndex) : "";
        return {
          question: m.question,
          options: m.options,
          answer: `${ansLetter}${ansLetter ? ". " : ""}${ansText}`,
          solution: m.solution,
          category: m.category,
          level,
        };
      }
      const n = q as NonMcqQ;
      return {
        question: n.question,
        answer: n.answer,
        solution: n.solution,
        category: n.category,
        level,
      };
    });
  }, [questions, level]);

  const fileBase = useMemo(() => {
    const clean = (s: string) => s.replace(/[^a-z0-9-_]/gi, "_").slice(0, 80);
    return `Class9_${clean(subject)}_${clean(chapter)}`;
  }, [subject, chapter]);

  const handleDownload = (fmt: "pdf" | "docx" | "csv" | "json") => {
    if (!questions.length) return alert("No questions to download yet.");
    switch (fmt) {
      case "pdf":
        return exportQuestionsAsPDF(exportable as any, `${fileBase}.pdf`, { includeSolutions: false });
      case "docx":
        return exportQuestionsAsDOCX(exportable as any, `${fileBase}.docx`);
      case "csv":
        return exportQuestionsAsCSV(exportable as any, `${fileBase}.csv`);
      case "json":
        return exportQuestionsAsJSON(exportable as any, `${fileBase}.json`);
    }
  };

  const start = async () => {
    const payload: GenReq = { subject, chapter, category, level, quantity };
    const r = await fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) {
      alert(data?.error || "Failed to generate questions");
      return;
    }
    setQuestions(data.questions || []);
    setPhase("quiz");
    setIdx(0);
    setScore(0);
    setAnswers({});
  };

  const submitAnswer = (ans: number | string) => {
    const q = questions[idx];
    const newAns = { ...answers, [idx]: ans };
    setAnswers(newAns);

    if ((q as any).category === "MCQ") {
      const mcq = q as McqQ;
      if (typeof ans === "number" && ans === mcq.answerIndex) {
        setScore((s) => s + 1);
      }
    } else {
      const non = q as NonMcqQ;
      const norm = (x: any) => String(x ?? "").trim().toLowerCase();
      if (["true/false"].includes(non.category.toLowerCase())) {
        if (norm(ans) === norm(non.answer)) setScore((s) => s + 1);
      }
    }

    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      setPhase("results");
    }
  };

  const DownloadBar = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => exportQuestionsAsPDF(exportable as any, `${fileBase}.pdf`, { includeSolutions: false })}
        className="px-3 py-2 rounded-xl border"
      >
        Download PDF
      </button>
      <button onClick={() => handleDownload("docx")} className="px-3 py-2 rounded-xl border">DOCX</button>
      <button onClick={() => handleDownload("csv")} className="px-3 py-2 rounded-xl border">CSV</button>
      <button onClick={() => handleDownload("json")} className="px-3 py-2 rounded-xl border">JSON</button>
    </div>
  );

  if (phase === "form") {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Practice with AI</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Subject</label>
            <select
              className="w-full border rounded-lg p-2"
              value={subject}
              onChange={(e) => {
                const s = e.target.value as SubjectKey;
                setSubject(s);
                setChapter(CLASS9_CHAPTERS[s][0]);
              }}
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Chapter</label>
            <select
              className="w-full border rounded-lg p-2"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            >
              {chapters.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Class 9 NCERT chapters only.</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Question Category</label>
            <select className="w-full border rounded-lg p-2" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              <option>MCQ</option>
              <option>Assertion-Reason</option>
              <option>True/False</option>
              <option>Short Answer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Level</label>
            <select className="w-full border rounded-lg p-2" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Quantity</label>
            <input type="number" min={1} max={25} className="w-full border rounded-lg p-2" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || "1"))} />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={start} className="px-4 py-2 rounded-xl bg-black text-white">Generate & Start</button>
        </div>
        <ul className="text-xs text-gray-500 list-disc pl-5">
          <li>Strictly Class 9 syllabus + sample papers.</li>
          <li>Exactly the number of questions you choose.</li>
          <li>MCQ has 4 options; others show solutions after completion.</li>
        </ul>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = questions[idx];
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Question {idx + 1} / {questions.length}</h1>
          <span className="text-sm">Score: {score}</span>
        </div>

        <DownloadBar />

        <div className="p-4 rounded-2xl border bg-white shadow-sm">
          <p className="mb-4">{q.question}</p>
          {(q as any).category === "MCQ" ? (
            <div className="space-y-2">
              {(q as any).options.map((opt: string, i: number) => (
                <button key={i} onClick={() => submitAnswer(i)} className="w-full text-left border rounded-lg p-2 hover:bg-gray-50">{String.fromCharCode(65 + i)}. {opt}</button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Type your answer (e.g., True/False or short response)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    submitAnswer((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button onClick={() => {
                const inp = (document.activeElement as HTMLInputElement);
                submitAnswer(inp?.value ?? "");
              }} className="px-4 py-2 rounded-xl bg-black text-white">Submit</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Results</h1>
      <p className="text-sm">Score: {score} / {questions.length}</p>
      <DownloadBar />
      <div className="space-y-4">
        {questions.map((q, i) => {
          const userAns = answers[i];
          const isMcq = (q as any).category === "MCQ";
          return (
            <div key={i} className="p-4 border rounded-2xl">
              <p className="font-medium">Q{i + 1}. {q.question}</p>
              {isMcq ? (
                <div className="mt-2 text-sm">
                  {(q as any).options.map((o: string, idx: number) => (
                    <div key={idx}>{String.fromCharCode(65 + idx)}. {o}</div>
                  ))}
                  <div className="mt-2">Your answer: {typeof userAns === "number" ? String.fromCharCode(65 + (userAns as number)) : "—"}</div>
                  <div>Correct answer: {String.fromCharCode(65 + ((q as any).answerIndex))}</div>
                </div>
              ) : (
                <div className="mt-2 text-sm">
                  <div>Your answer: {String(userAns ?? "—")}</div>
                  <div>Expected: {(q as any).answer}</div>
                </div>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600">Show solution</summary>
                <p className="text-sm mt-2 whitespace-pre-wrap">{(q as any).solution}</p>
              </details>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        <a href="/practice/ai" className="px-4 py-2 rounded-xl border">Try Again</a>
      </div>
    </div>
  );
}
