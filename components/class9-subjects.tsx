"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SUBJECTS_9 } from "@/data/subjects9";
import { Plus } from "lucide-react";

type Props = {
  title?: string;
  showMore?: boolean;
};

export default function Class9Subjects({
  title = "Hi, what would you learn today?",
  showMore = true,
}: Props) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5">
        {SUBJECTS_9.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.id}
              href={s.href ?? `/materials/${s.id}` }   // ← go to subject hub
              className="flex flex-col items-center group"
            >
              <div
                className={`h-14 w-14 rounded-full ${s.color} flex items-center justify-center shadow-sm transition-transform group-hover:scale-105`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <span className="mt-2 text-xs text-center leading-tight">
                {s.title}
              </span>
            </Link>
          );
        })}

        {showMore && (
          <a
            href="https://ncert.nic.in/textbook.php"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="h-14 w-14 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <Plus className="h-6 w-6" />
            </div>
            <span className="mt-2 text-xs text-center leading-tight">More</span>
          </a>
        )}
      </div>
    </Card>
  );
}
