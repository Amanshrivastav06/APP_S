export type MaterialCategory = "textbook" | "notes" | "solutions" | "videos" | "worksheets";

export const MATERIAL_CATEGORIES: { key: MaterialCategory; label: string }[] = [
  { key: "textbook", label: "Textbook" },
  { key: "notes", label: "Notes" },
  { key: "solutions", label: "Solutions" },
  { key: "videos", label: "Videos" },
  { key: "worksheets", label: "Worksheets" },
];


// High-level sections for Subject Hub (Downloads + Resources)
export const SUBJECT_SECTIONS = {
  downloads: [
    { key: "syllabus", label: "CBSE Syllabus" },
    { key: "sample-papers", label: "CBSE Sample Papers" },
    { key: "Chapterwise_questions_with_Solution", label: "Chapterwise-Questions" },
    { key: "case-study", label: "Case Study Questions" },
  ],
  resources: [
    { key: "revision-notes", label: "Revision Notes" },
    { key: "solutions", label: "Class 09 • Textbook Solutions" },
    { key: "pyq", label: "Previous Year Question Bank" },
    { key: "mcq", label: "Topicwise MCQ Questions" },
  ],
} as const;
