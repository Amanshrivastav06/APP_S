import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type MaterialRow = {
  id?: string | number;
  subject_id: string;
  category: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  class?: number | null;
  chapter_number?: number | null;
  year?: string | number | null;
};

// ---- Local fallback (works without DB) ----
const FALLBACK: MaterialRow[] = [
  // textbook (chapters)
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

  // syllabus (examples)
  {
    id: "math-syl-2026",
    subject_id: "mathematics",
    category: "syllabus",
    title: "CBSE Syllabus 2025-26 Class 9 Mathematics",
    year: "2025-26",
    file_url: "/materials/mathematics/syllabus/2025-26.pdf",
  },
  {
    id: "math-syl-2025",
    subject_id: "mathematics",
    category: "syllabus",
    title: "CBSE Syllabus 2024-25 Class 9 Mathematics",
    year: "2024-25",
    file_url: "/materials/mathematics/syllabus/2024-25.pdf",
  },
  {
    id: "math-syl-2024",
    subject_id: "mathematics",
    category: "syllabus",
    title: "CBSE Syllabus 2023-24 Class 9 Mathematics",
    year: "2023-24",
    file_url: "/materials/mathematics/syllabus/2023-24.pdf",
  },
  {
    id: "math-sp-2025-set1",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 1 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-1.pdf",
  },
  {
    id: "math-sp-2025-set2",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 2 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-2.pdf",
  },
  {
    id: "math-sp-2025-set3",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 3 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-3.pdf",
  },
  {
    id: "math-sp-2025-set4",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 4 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-4.pdf",
  },
  {
    id: "math-sp-2025-set5",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 5 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-5.pdf",
  },
  {
    id: "math-sp-2025-set6",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 6 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-6.pdf",
  },
  {
    id: "math-sp-2025-set7",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 7 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-7.pdf",
  },
  {
    id: "math-sp-2025-set8",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 8 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-8.pdf",
  },
  {
    id: "math-sp-2025-set9",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 9 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-9.pdf",
  },
  {
    id: "math-sp-2025-set10",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 10 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-10.pdf",
  },
  {
    id: "math-sp-2025-set11",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 11 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-11.pdf",
  },
  {
    id: "math-sp-2025-set12",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 12 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-12.pdf",
  },
  {
    id: "math-sp-2025-set13",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 13 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-13.pdf",
  },
  {
    id: "math-sp-2025-set14",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 14 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-14.pdf",
  },
  {
    id: "math-sp-2025-set15",
    subject_id: "mathematics",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 15 (Class 9 Mathematics)",
    year: "2025",
    file_url: "/materials/mathematics/sample-papers/2025-set-15.pdf",
  },


  // chapterwise_questions
  {
    id: "math",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Number System",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Number Systems Important Questions for Class 9 Maths.pdf",
  },

  {
    id: "math_P",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Polynomials Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Polynomials Questions.pdf",
  },

  {
    id: "math_C",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Coordinate Geometry Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Coordinate Geometry Questions.pdf",
  },

  {
    id: "math_L",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Linear Equations in Two Variables Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Linear Equations in Two Variables Questions.pdf",
  },

  {
    id: "math_Li",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Lines and Angles Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Lines and Angles Questions.pdf",
  },

  {
    id: "math_T",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Triangles Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Triangles Questions.pdf",
  },

  {
    id: "math_Q",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Quadrilaterals Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Triangles Questions.pdf",
  },

  {
    id: "math_Ci",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Circles Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Circles Questions.pdf",
  },
  {
    id: "math_He",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Heron’s Formula Important Questions for Class 9 Maths",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Heron’s Formula Important Questions for Class 9 Maths.pdf",
  },

  {
    id: "math_Su",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Surface Areas and Volumes Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Surface Areas and Volumes Questions.pdf",
  },
  {
    id: "math_St",
    subject_id: "mathematics",
    category: "Chapterwise_questions_with_Solution",
    title: "Statistics Questions",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Statistics Questions.pdf",
  },

  // Math Formulas resources

  {
    id: "For_1",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 1 - Number Systems Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Chapter_wise_questions/Chapter 1 - Number Systems Formulas.pdf",
  },



  // {
  //   id: "math",
  //   subject_id: "mathematics",
  //   category: "Chapterwise_questions_with_Solution",
  //   title: "Chapterwise-Questions",
  //   year: "2025",
  //   file_url: "/materials/mathematics/Chapter_wise_questions/l.pdf",
  // },

  // {
  //   id: "math",
  //   subject_id: "mathematics",
  //   category: "Chapterwise_questions_with_Solution",
  //   title: "Chapterwise-Questions",
  //   year: "2025",
  //   file_url: "/materials/mathematics/Chapter_wise_questions/l.pdf",
  // },


  {
    id: "science-sp-2025-set1",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 1 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-1.pdf",
  },
  {
    id: "science-sp-2025-set2",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 2(Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-2.pdf",
  },
  {
    id: "science-sp-2025-set3",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 3(Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-3.pdf",
  },
  {
    id: "science-sp-2025-set4",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 4(Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-4.df",
  },
  {
    id: "science-sp-2025-set5",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 5 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-5.pdf",
  },
  {
    id: "science-sp-2025-set6",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 6 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-6.pdf",
  },
  {
    id: "science-sp-2025-set7",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 7 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-7.pdf",
  },
  {
    id: "science-sp-2025-set8",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 8 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-8.pdf",
  },
  {
    id: "science-sp-2025-set9",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 9 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-9.pdf",
  },
  {
    id: "science-sp-2025-set10",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 10 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-10.pdf",
  },
  {
    id: "science-sp-2025-set11",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 11 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-11.pdf",
  },
  {
    id: "science-sp-2025-set12",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 12 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-12.pdf",
  },
  {
    id: "science-sp-2025-set13",
    subject_id: "science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 13 (Class 9 Science)",
    year: "2025",
    file_url: "/materials/science/sample-papers/Science-(25)-13.pdf",
  },
  // {
  //   id: "science-sp-2025-set14",
  //   subject_id: "science",
  //   category: "sample-papers",
  //   title: "CBSE Sample Paper 2025 – Set 14 (Class 9 Science)",
  //   year: "2025",
  //   file_url: "/materials/science/sample-papers/Science-(25)-14.pdf",
  // },
  // {
  //   id: "science-sp-2025-set15",
  //   subject_id: "science",
  //   category: "sample-papers",
  //   title: "CBSE Sample Paper 2025 – Set 15 (Class 9 Science)",
  //   year: "2025",
  //   file_url: "/materials/science/sample-papers/Science-(25)-15.pdf",
  // },
  {
    id: "social-science-sp-2025-set1",
    subject_id: "social-science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 1 (Class 9 social-science)",
    year: "2025",
    file_url: "/materials/social-science/sample-papers/social science 1.pdf",
  },
  {
    id: "social-science-sp-2025-set2",
    subject_id: "social-science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 2 (Class 9 social-science)",
    year: "2025",
    file_url: "/materials/social-science/sample-papers/social science 2.pdf",
  },
  {
    id: "social-science-sp-2025-set3",
    subject_id: "social-science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 3 (Class 9 social-science)",
    year: "2025",
    file_url: "/materials/social-science/sample-papers/social science 3.pdf",
  },
  {
    id: "social-science-sp-2025-set4",
    subject_id: "social-science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 4 (Class 9 social-science)",
    year: "2025",
    file_url: "/materials/social-science/sample-papers/social science 4.pdf",
  },
  {
    id: "social-science-sp-2025-set5",
    subject_id: "social-science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2025 – Set 5 (Class 9 social-science)",
    year: "2025",
    file_url: "/materials/social-science/sample-papers/social science 5.pdf",
  },
  {
    id: "social-science-sp-2024-set1",
    subject_id: "social-science",
    category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 1 (Class 9 social-science)",
    year: "2025",
    file_url: "/materials/social-science/sample-papers/social science 1(24).pdf",
  },
  {
    id: "english-sp-2024-set1",
    subject_id: "english",
    category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 1 (Class 9 english_L&L)",
    year: "2025",
    file_url: "/materials/english/sample-papers/Eng L&L 1.pdf",
  },
  {
    id: "english-sp-2024-set2",
    subject_id: "english",
    category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 2 (Class 9 english_L&L)",
    year: "2025",
    file_url: "/materials/english/sample-papers/Eng L&L 2.pdf",
  },
  {
    id: "english-sp-2024-set3",
    subject_id: "english",
    category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 3 (Class 9 english_L&L)",
    year: "2025",
    file_url: "/materials/english/sample-papers/Eng L&L 3.pdf",
  },
  {
    id: "english-sp-2024-set4",
    subject_id: "english",
    category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 4 (Class 9 english_L&L)",
    year: "2025",
    file_url: "/materials/english/sample-papers/Eng L&L 4.pdf",
  },
  {
    id: "english-sp-2024-set5",
    subject_id: "english",
    category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 5 (Class 9 english_L&L)",
    year: "2025",
    file_url: "/materials/english/sample-papers/Eng L&L 5.pdf",
  },
  {
    id: "english_C-sp-2024-set1",
    subject_id: "english",
    category: "sample-papers",
    title: "CBSE Sample Paper 2024 – Set 1 (Class 9 english_Communication)",
    year: "2025",
    file_url: "/materials/english/sample-papers/eng_c_1.pdf",
  },


];

async function getMaterials(subjectId: string, category: string): Promise<MaterialRow[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("materials")
      .select("id,subject_id,category,title,description,file_url,class,chapter_number,year")
      .eq("subject_id", subjectId)
      .eq("category", category)
      .order("chapter_number", { ascending: true })
      .order("year", { ascending: false });

    if (error) throw error;
    if (!data?.length) return FALLBACK.filter(r => r.subject_id === subjectId && r.category === category);
    return data as MaterialRow[];
  } catch {
    return FALLBACK.filter(r => r.subject_id === subjectId && r.category === category);
  }
}

export default async function Page({ params }: { params: { subjectId: string; category: string } }) {
  const { subjectId, category } = params;
  const rows = await getMaterials(subjectId, category);
  const pretty = (s: string) => s.replace(/-/g, " ");
  const title = `${pretty(subjectId)} • ${pretty(category)}`;

  const isTextbook = category === "textbook";

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold capitalize">{title}</h1>

      <div className="rounded-2xl border bg-white">
        <div className="divide-y">
          {rows.map((r) => {
            const href = isTextbook && r.chapter_number
              ? `/materials/${subjectId}/${category}/chapter/${r.chapter_number}`
              : `/materials/${subjectId}/${category}/view/${encodeURIComponent(String(r.id ?? r.title))}`;
            return (
              <Link
                key={`${r.id ?? r.title}`}
                href={href}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="text-[15px]">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.year ?? ""}</div>
              </Link>
            );
          })}

          {!rows.length && (
            <div className="px-4 py-6 text-sm text-muted-foreground">No items yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
