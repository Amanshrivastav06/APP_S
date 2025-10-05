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
    file_url: "/materials/mathematics/Formulas/Chapter 1 - Number Systems Formulas.pdf",
  },

  {
    id: "For_2",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 2 - Polynomials Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Polynomials Formulas.pdf",
  },

  {
    id: "For_3",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 3 - Coordinate Geometry Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 3 - Coordinate Geometry Formulas.pdf",
  },

  {
    id: "For_4",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 4 - Linear Equations in Two Variables Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 4 - Linear Equations in Two Variables Formulas.pdf",
  },

  {
    id: "For_5",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 5 - Introduction to Euclids Geometry Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 5 - Introduction to Euclids Geometry Formulas.pdf",
  },

  {
    id: "For_6",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 6 - Lines and Angles Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 6 - Lines and Angles Formulas.pdf",
  },


  {
    id: "For_7",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 7 - Triangles Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 7 - Triangles Formulas.pdf",
  },


  {
    id: "For_8",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 8 - Quadrilaterals Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 8 - Quadrilaterals Formulas.pdf",
  },

  {
    id: "For_9",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 9 - Areas of Parallelograms and Triangles Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 9 - Areas of Parallelograms and Triangles Formulas.pdf",
  },
  {
    id: "For_10",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 10 - Circles Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 10 - Circles Formulas.pdf",
  },
  {
    id: "For_12",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 12 - Heron's Formula Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 12 - Heron's Formula Formulas.pdf",
  },
  {
    id: "For_13",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 13 - Surface Areas and Volumes Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 13 - Surface Areas and Volumes Formulas.pdf",
  },
  {
    id: "For_14",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 14 - Statistics Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 14 - Statistics Formulas.pdf",
  },
  {
    id: "For_15",
    subject_id: "mathematics",
    category: "Chapters_Formulas",
    title: "Chapter 15 - Probability Formulas",
    year: "2025",
    file_url: "/materials/mathematics/Formulas/Chapter 15 - Probability Formulas.pdf",
  },

  // Text Book Solution
  {
    id: "text_1",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 1 Number Systems",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 1 Number Systems.pdf",
  },
  {
    id: "text_2",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 2 Polynomials",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 2 Polynomials.pdf",
  },
  {
    id: "text_3",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 3 Coordinate Geometry",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 3 Coordinate Geometry.pdf",
  },
  {
    id: "text_4",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 4 Linear Equations in Two Variables",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 4 Linear Equations in Two Variables.pdf",
  },
  {
    id: "text_5",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 5 Introduction to Euclids Geometry",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 5 Introduction to Euclids Geometry.pdf",
  },
  {
    id: "text_6",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 6 Lines and Angles",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 6 Lines and Angles.pdf",
  },
  {
    id: "text_7",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 7 Triangles",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 7 Triangles.pdf",
  },
  {
    id: "text_8",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 8 Quadrilaterals",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 8 Quadrilaterals.pdf",
  },

  {
    id: "text_9",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 9 Circles",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 9 Circles.pdf",
  },
  {
    id: "text_10",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 10 Heron's Formula",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 10.pdf",
  },
  {
    id: "text_11",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 11 Surface Area and Volume",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 11 Surface Area and Volume.pdf",
  },
  {
    id: "text_12",
    subject_id: "mathematics",
    category: "solutions",
    title: "Chapter 12 Statistics",
    year: "2025",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 12 Statistics.pdf",
  },


  // Revision Notes
  {
    id: "re_1",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 1 Number Systems",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 1 Number Systems.pdf",
  },

  {
    id: "re_2",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 2 Polynomials",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 2 Polynomials.pdf",
  },
  {
    id: "re_3",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 3 Coordinate Geometry",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 3 Coordinate Geometry.pdf",
  },
  {
    id: "re_4",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 4 Linear Equations in Two Variables",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 4 Linear Equations in Two Variables.pdf",
  },
  {
    id: "re_5",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 5 Introduction To Euclids Geometry",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 5 Introduction To Euclids Geometry.pdf",
  },
  {
    id: "re_6",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 6 Lines and Angles",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 6 Lines and Angles.pdf",
  },
  {
    id: "re_7",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 7 Triangles Class 9",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 7 Triangles Class 9.pdf",
  },
  {
    id: "re_8",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 8 Quadrilaterals",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 8 Quadrilaterals.pdf",
  },
  {
    id: "re_9",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 9 Circles",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 9 Circles.pdf",
  },
  {
    id: "re_10",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 10 Herons Formula",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 10 Herons Formula.pdf",
  },
  {
    id: "re_11",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 11 Surface Areas and Volumes",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 11 Surface Areas and Volumes.pdf",
  },
  {
    id: "re_12",
    subject_id: "mathematics",
    category: "revision-notes",
    title: "Chapter 12 Statistics",
    year: "2025",
    file_url: "/materials/mathematics/revision-notes/Chapter 12 Statistics.pdf",
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



  // Science Chapterwise Questions

  // -------------------- Science Chapterwise Questions --------------------
  {
    id: "science-cq-2025-ch01",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 1 — Matter in Our Surroundings",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-1.pdf",
  },
  {
    id: "science-cq-2025-ch02",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 2 — Is Matter Around Us Pure?",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-2.pdf",
  },
  {
    id: "science-cq-2025-ch03",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 3 — Atoms and Molecules",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-3.pdf",
  },
  {
    id: "science-cq-2025-ch04",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 4 — Structure of the Atom",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-4.pdf",
  },
  {
    id: "science-cq-2025-ch05",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 5 — The Fundamental Unit of Life",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-5.pdf",
  },
  {
    id: "science-cq-2025-ch06",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 6 — Tissues",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-6.pdf",
  },
  {
    id: "science-cq-2025-ch07",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 7 — Diversity in Living Organisms",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-7.pdf",
  },
  {
    id: "science-cq-2025-ch08",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 8 — Motion",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-8.pdf",
  },
  {
    id: "science-cq-2025-ch09",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 9 — Force and Laws of Motion",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-9.pdf",
  },
  {
    id: "science-cq-2025-ch10",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 10 — Gravitation",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-10.pdf",
  },
  {
    id: "science-cq-2025-ch11",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 11 — Work and Energy",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-11.pdf",
  },
  {
    id: "science-cq-2025-ch12",
    subject_id: "science",
    category: "chapterwise_questions_with_solution",
    title: "Chapter 12 — Sound",
    year: "2025",
    file_url: "/materials/science/Chapter_wise_questions/Chapter-12.pdf",
  },
  // ------------------ /Science Chapterwise Questions ---------------------


  // Science Sample Papers
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
