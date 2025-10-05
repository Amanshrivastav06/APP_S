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

  // Math formula Resorces

  {
    id: "For_1", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 1 - Number Systems Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 1 - Number Systems Formulas.pdf"
  },

  {
    id: "For_2", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 2 - Polynomials Formulas",
    file_url: "/materials/mathematics/Formulas/Polynomials Formulas.pdf"
  },
  {
    id: "For_3", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 3 - Coordinate Geometry Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 3 - Coordinate Geometry Formulas.pdf"
  },

  {
    id: "For_4", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 4 - Linear Equations in Two Variables Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 4 - Linear Equations in Two Variables Formulas.pdf"
  },


  {
    id: "For_5", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 5 - Introduction to Euclids Geometry Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 5 - Introduction to Euclids Geometry Formulas.pdf"
  },

  {
    id: "For_6", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 6 - Lines and Angles Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 6 - Lines and Angles Formulas.pdf"
  },

  {
    id: "For_7", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 7 - Triangles Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 7 - Triangles Formulas.pdf"
  },

  {
    id: "For_8", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 8 - Quadrilaterals Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 8 - Quadrilaterals Formulas.pdf"
  },

  {
    id: "For_9", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 9 - Areas of Parallelograms and Triangles Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 9 - Areas of Parallelograms and Triangles Formulas.pdf"
  },

  {
    id: "For_10", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 10 - Circles Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 10 - Circles Formulas.pdf"
  },
  {
    id: "For_12", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 12 - Heron's Formula Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 12 - Heron's Formula Formulas.pdf"
  },
  {
    id: "For_13", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 13 - Surface Areas and Volumes Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 13 - Surface Areas and Volumes Formulas.pdf"
  },
  {
    id: "For_14", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 14 - Statistics Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 14 - Statistics Formulas.pdf"
  },
  {
    id: "For_15", subject_id: "mathematics", category: "Chapters_Formulas",
    title: "Chapter 15 - Probability Formulas",
    file_url: "/materials/mathematics/Formulas/Chapter 15 - Probability Formulas.pdf"
  },

  // Text Solution
  {
    id: "text_1", subject_id: "mathematics", category: "solutions",
    title: "Chapter 1 Number Systems",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 1 Number Systems.pdf"
  },

  {
    id: "text_2", subject_id: "mathematics", category: "solutions",
    title: "Chapter 2 Polynomials",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 2 Polynomials.pdf"
  },

  {
    id: "text_3", subject_id: "mathematics", category: "solutions",
    title: "Chapter 3 Coordinate Geometry",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 3 Coordinate Geometry.pdf"
  },

  {
    id: "text_4", subject_id: "mathematics", category: "solutions",
    title: "Chapter 4 Linear Equations in Two Variables",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 4 Linear Equations in Two Variables.pdf"
  },

  {
    id: "text_5", subject_id: "mathematics", category: "solutions",
    title: "Chapter 5 Introduction to Euclids Geometry",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 5 Introduction to Euclids Geometry.pdf"
  },

  {
    id: "text_6", subject_id: "mathematics", category: "solutions",
    title: "Chapter 6 Lines and Angles",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 6 Lines and Angles.pdf"
  },

  {
    id: "text_7", subject_id: "mathematics", category: "solutions",
    title: "Chapter 7 Triangles",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 7 Triangles.pdf"
  },

  {
    id: "text_8", subject_id: "mathematics", category: "solutions",
    title: "Chapter 8 Quadrilaterals",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 8 Quadrilaterals.pdf"
  },
  {
    id: "text_9", subject_id: "mathematics", category: "solutions",
    title: "Chapter 9 Circles",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 9 Circles.pdf"
  },
  {
    id: "text_10", subject_id: "mathematics", category: "solutions",
    title: "Chapter 10 Heron's Formula",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 10.pdf"
  },
  {
    id: "text_11", subject_id: "mathematics", category: "solutions",
    title: "Chapter 11 Surface Area and Volume",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 11 Surface Area and Volume.pdf"
  },
  {
    id: "text_12", subject_id: "mathematics", category: "solutions",
    title: "Chapter 12 Statistics",
    file_url: "/materials/mathematics/TextBook Solution/Chapter 12 Statistics.pdf"
  },


  // Revision Notes
  {
    id: "re_1", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 1 Number Systems",
    file_url: "/materials/mathematics/Revision Notes/Chapter 1 Number Systems.pdf"
  },

  {
    id: "re_2", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 2 Polynomials",
    file_url: "/materials/mathematics/Revision Notes/Chapter 2 Polynomials.pdf"
  },

  {
    id: "re_3", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 3 Coordinate Geometry",
    file_url: "/materials/mathematics/Revision Notes/Chapter 3 Coordinate Geometry.pdf"
  },


  {
    id: "re_4", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 4 Linear Equations in Two Variables",
    file_url: "/materials/mathematics/Revision Notes/Chapter 4 Linear Equations in Two Variables.pdf"
  },


  {
    id: "re_5", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 5 Introduction To Euclids Geometry",
    file_url: "/materials/mathematics/Revision Notes/Chapter 5 Introduction To Euclids Geometry.pdf"
  },
  {
    id: "re_6", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 6 Lines and Angles",
    file_url: "/materials/mathematics/Revision Notes/Chapter 6 Lines and Angles.pdf"
  },
  {
    id: "re_7", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 7 Triangles Class 9",
    file_url: "/materials/mathematics/Revision Notes/Chapter 7 Triangles Class 9.pdf"
  },
  {
    id: "re_8", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 8 Quadrilaterals",
    file_url: "/materials/mathematics/Revision Notes/Chapter 8 Quadrilaterals.pdf"
  },
  {
    id: "re_9", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 9 Circles",
    file_url: "/materials/mathematics/Revision Notes/Chapter 9 Circles.pdf"
  },
  {
    id: "re_10", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 10 Herons Formula",
    file_url: "/materials/mathematics/Revision Notes/Chapter 10 Herons Formula.pdf"
  },
  {
    id: "re_11", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 11 Surface Areas and Volumes",
    file_url: "/materials/mathematics/Revision Notes/Chapter 11 Surface Areas and Volumes.pdf"
  },
  {
    id: "re_12", subject_id: "mathematics", category: "revision-notes",
    title: "Chapter 12 Statistics",
    file_url: "/materials/mathematics/Revision Notes/Chapter 12 Statistics.pdf"
  },

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
    file_url: "/materials/science/Chapter_wise_questions/Chapter-12.pdf",
  },
  // ------------------ /Science Chapterwise Questions ---------------------




  // Science Sample Papers 
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
