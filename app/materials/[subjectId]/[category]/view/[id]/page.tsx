import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const FALLBACK = [
  { id: "math-syl-2026", subject_id: "mathematics", category: "syllabus", title: "CBSE Syllabus 2025-26 Class 9 Mathematics", file_url: "/materials/mathematics/syllabus/2025-26.pdf" },
  { id: "math-syl-2025", subject_id: "mathematics", category: "syllabus", title: "CBSE Syllabus 2024-25 Class 9 Mathematics", file_url: "/materials/mathematics/syllabus/2024-25.pdf" },
  { id: "math-syl-2024", subject_id: "mathematics", category: "syllabus", title: "CBSE Syllabus 2023-24 Class 9 Mathematics", file_url: "/materials/mathematics/syllabus/2023-24.pdf" },
  {
    id: "math-sp-2025-set1", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 1 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-1.pdf"
  },
  {
    id: "math-sp-2025-set2", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 2 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-2.pdf"
  },
  {
    id: "math-sp-2025-set3", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 3 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-3.pdf"
  },
  {
    id: "math-sp-2025-set4", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 4 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-4.pdf"
  },
  {
    id: "math-sp-2025-set5", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 5 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-5.pdf"
  },
  {
    id: "math-sp-2025-set6", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 6 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-6.pdf"
  },
  {
    id: "math-sp-2025-set7", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 7 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-7.pdf"
  },
  {
    id: "math-sp-2025-set8", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 8 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-8.pdf"
  },
  {
    id: "math-sp-2025-set9", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 9 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-9.pdf"
  },
  {
    id: "math-sp-2025-set10", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 10 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-10.pdf"
  },
  {
    id: "math-sp-2025-set11", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 11 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-11.pdf"
  },
  {
    id: "math-sp-2025-set12", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 12 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-12.pdf"
  },
  {
    id: "math-sp-2025-set13", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 13 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-13.pdf"
  },
  {
    id: "math-sp-2025-set14", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 14 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-14.pdf"
  },
  {
    id: "math-sp-2025-set15", subject_id: "mathematics", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 15 (Class 9 Mathematics)",
    file_url: "/materials/mathematics/sample-papers/2025-set-15.pdf"
  },

  // chapterwise_questions

  {
    id: "math", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Number System",
    file_url: "/materials/mathematics/Chapter_wise_questions/Number Systems Important Questions for Class 9 Maths.pdf"
  },

  {
    id: "math_P", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Polynomials Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Polynomials Questions.pdf"
  },

  {
    id: "math_C", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Coordinate Geometry Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Coordinate Geometry Questions.pdf"
  },

  {
    id: "math_L", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Linear Equations in Two Variables Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Linear Equations in Two Variables Questions.pdf"
  },

  {
    id: "math_I", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Introduction to Euclid’s Geometry Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Introduction to Euclid’s Geometry Questions.pdf"
  },

  {
    id: "math_Li", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Lines and Angles Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Lines and Angles Questions.pdf"
  },

  {
    id: "math_T", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Triangles Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Triangles Questions.pdf"
  },

  {
    id: "math_Q", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Quadrilaterals Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Quadrilaterals Questions.pdf"
  },

  {
    id: "math_Ci", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Circles Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Circles Questions.pdf"
  },

  {
    id: "math_He", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Heron’s Formula Important Questions for Class 9 Maths",
    file_url: "/materials/mathematics/Chapter_wise_questions/Heron’s Formula Important Questions for Class 9 Maths.pdf"
  },

  {
    id: "math_Su", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Surface Areas and Volumes Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Surface Areas and Volumes Questions.pdf"
  },

  {
    id: "math_St", subject_id: "mathematics", category: "Chapterwise_questions_with_Solution",
    title: "Statistics Questions",
    file_url: "/materials/mathematics/Chapter_wise_questions/Statistics Questions.pdf"
  },


  {
    id: "science-sp-2025-set1", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 1 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-1.pdf"
  },
  {
    id: "science-sp-2025-set2", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 2 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-2.pdf"
  },
  {
    id: "science-sp-2025-set3", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 3 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-3.pdf"
  },
  {
    id: "science-sp-2025-set3", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 3 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-3.pdf"
  },
  {
    id: "science-sp-2025-set4", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 4 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-4.pdf"
  },
  {
    id: "science-sp-2025-set5", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 5 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-5.pdf"
  },
  {
    id: "science-sp-2025-set6", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 6 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-6.pdf"
  },
  {
    id: "science-sp-2025-set7", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 7 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-7.pdf"
  },
  {
    id: "science-sp-2025-set8", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 8 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-8.pdf"
  },
  {
    id: "science-sp-2025-set9", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 9 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-9.pdf"
  },
  {
    id: "science-sp-2025-set10", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 10 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-10.pdf"
  },
  {
    id: "science-sp-2025-set11", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 11 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-11.pdf"
  },
  {
    id: "science-sp-2025-set12", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 12 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-12.pdf"
  },
  {
    id: "science-sp-2025-set13", subject_id: "science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 13 (Class 9 Science)",
    file_url: "/materials/science/sample-papers/Science-(25)-13.pdf"
  },
  // {
  //   id: "science-sp-2025-set14", subject_id: "science", category: "sample-papers",
  //   title: "CBSE Sample Paper 2025 – Set 14 (Class 9 Science)",
  //   file_url: "/materials/science/sample-papers/Science-(25)-14.pdf"
  // },
  // {
  //   id: "science-sp-2025-set15", subject_id: "science", category: "sample-papers",
  //   title: "CBSE Sample Paper 2025 – Set 15 (Class 9 Science)",
  //   file_url: "/materials/science/sample-papers/Science-(25)-15.pdf"
  // },
  {
    id: "social-science-sp-2025-set1", subject_id: "social-science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 13 (Class 9 social-science)",
    file_url: "/materials/social-science/sample-papers/social science 1.pdf"
  },

  {
    id: "social-science-sp-2025-set2", subject_id: "social-science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 2 (Class 9 social-science)",
    file_url: "/materials/social-science/sample-papers/social science 2.pdf"
  },
  {
    id: "social-science-sp-2025-set3", subject_id: "social-science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 3 (Class 9 social-science)",
    file_url: "/materials/social-science/sample-papers/social science 3.pdf"
  },
  {
    id: "social-science-sp-2025-set4", subject_id: "social-science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 4 (Class 9 social-science)",
    file_url: "/materials/social-science/sample-papers/social science 4.pdf"
  },
  {
    id: "social-science-sp-2025-set5", subject_id: "social-science", category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 5 (Class 9 social-science)",
    file_url: "/materials/social-science/sample-papers/social science 5.pdf"
  },
  {
    id: "social-science-sp-2024-set1", subject_id: "social-science", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 1 (Class 9 social-science)",
    file_url: "/materials/social-science/sample-papers/social science 1(24).pdf"
  },
  {
    id: "english-sp-2024-set1", subject_id: "english", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 1 (Class 9 english_L&L)",
    file_url: "/materials/english/sample-papers/Eng L&L 1.pdf"
  },
  {
    id: "english-sp-2024-set2", subject_id: "english", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 2 (Class 9 english_L&L)",
    file_url: "/materials/english/sample-papers/Eng L&L 2.pdf"
  },
  {
    id: "english-sp-2024-set3", subject_id: "english", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 3 (Class 9 english_L&L)",
    file_url: "/materials/english/sample-papers/Eng L&L 3.pdf"
  },
  {
    id: "english-sp-2024-set4", subject_id: "english", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 4 (Class 9 english_L&L)",
    file_url: "/materials/english/sample-papers/Eng L&L 4.pdf"
  },
  {
    id: "english-sp-2024-set4", subject_id: "english", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 4 (Class 9 english_L&L)",
    file_url: "/materials/english/sample-papers/Eng L&L 4.pdf"
  },
  {
    id: "english-sp-2024-set5", subject_id: "english", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 5 (Class 9 english_L&L)",
    file_url: "/materials/english/sample-papers/Eng L&L 5.pdf"
  },
  {
    id: "english_C-sp-2024-set1", subject_id: "english", category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 1 (Class 9 english_Communication)",
    file_url: "/materials/english/sample-papers/eng_c_1.pdf"
  },


];

export default async function Page({ params }: { params: { subjectId: string; category: string; id: string } }) {
  const { subjectId, category, id } = params;
  const decoded = decodeURIComponent(id);

  let row: { title: string; file_url: string } | null = null;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("materials")
      .select("id,title,file_url")
      .eq("subject_id", subjectId)
      .eq("category", category)
      .eq("id", decoded)
      .maybeSingle();
    if (data?.file_url) row = { title: data.title, file_url: data.file_url };
  } catch { }

  if (!row) {
    const f = FALLBACK.find(x => String(x.id) === decoded);
    if (f) row = { title: f.title, file_url: f.file_url };
  }

  if (!row) return notFound();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link href={`/materials/${subjectId}/${category}`} className="underline">← Back</Link>
      </div>

      <h1 className="mt-3 text-2xl font-semibold">{row.title}</h1>

      <div className="mt-4 h-[85vh] w-full overflow-hidden rounded-xl border bg-white">
        <iframe src={`${row.file_url}#view=FitH`} className="h-full w-full" />
      </div>

      <div className="mt-3 text-sm">
        <a href={row.file_url} target="_blank" className="underline">Open PDF in new tab</a>
      </div>
    </div>
  );
}
