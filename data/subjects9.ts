// data/subjects9.ts
import {
  Calculator, FlaskConical, Globe2, Landmark, BookOpen,
  Languages, Library, ScrollText, IndianRupee, Book, Sparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Subject9 = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  url: string;        // external NCERT portal link
  href?: string;      // optional internal link override
};

export const SUBJECTS_9: Subject9[] = [
  { id: "mathematics", title: "Mathematics", icon: Calculator, color: "bg-indigo-50 text-indigo-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "science", title: "Science", icon: FlaskConical, color: "bg-emerald-50 text-emerald-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "social-science", title: "Social Science", icon: Globe2, color: "bg-rose-50 text-rose-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "english", title: "English (Lang & Lit)", icon: BookOpen, color: "bg-blue-50 text-blue-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "hindi-a", title: "Hindi – Course A", icon: Languages, color: "bg-amber-50 text-amber-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "hindi-b", title: "Hindi – Course B", icon: Library, color: "bg-lime-50 text-lime-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "sanskrit", title: "Sanskrit", icon: ScrollText, color: "bg-purple-50 text-purple-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "it", title: "Information Technology", icon: Book, color: "bg-teal-50 text-teal-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "economics", title: "Economics", icon: IndianRupee, color: "bg-fuchsia-50 text-fuchsia-700", url: "https://ncert.nic.in/textbook.php" },
  { id: "civics", title: "Civics (Democratic Politics I)", icon: Landmark, color: "bg-sky-50 text-sky-700", url: "https://ncert.nic.in/textbook.php" },
    ,
{ id: "practice-ai", title: "Practice with AI", icon: Sparkles, color: "bg-purple-50 text-purple-700", url: "https://ncert.nic.in/textbook.php", href: "/practice/ai" }
];
