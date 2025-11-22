// app/materials/[subjectId]/[category]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MATERIAL_CATEGORIES, type MaterialCategoryKey } from "@/data/material-categories";
import { SUBJECTS_9 } from "@/data/subjects9";
import { ExternalLink } from "lucide-react";

export default async function MaterialsListPage({
  params,
}: {
  params: Promise<{ subjectId: string; category: MaterialCategoryKey }>;
}) {
  const { subjectId, category } = await params;
  const supabase = await createClient();

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, title")
    .eq("id", subjectId)
    .single();

  const fallback = SUBJECTS_9.find((s) => s.id === subjectId);
  const subjectTitle = subject?.title ?? fallback?.title;
  if (!subjectTitle) notFound();

  const cat = MATERIAL_CATEGORIES.find((c) => c.key === category);
  if (!cat) notFound();

  const { data: items, error } = await supabase
    .from("materials")
    .select("id, title, url, source")
    .eq("subject_id", subjectId)
    .eq("category", category)
    .order("title", { ascending: true });

  if (error) throw error;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        {subjectTitle} – {cat.label}
      </h1>

      {!items || items.length === 0 ? (
        <Card className="p-6 text-muted-foreground">
          No items yet. Add rows in the <code>materials</code> table for category <b>{category}</b>.
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((it) => (
            <Card key={it.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{it.title}</div>
                {it.source && (
                  <div className="text-xs text-muted-foreground mt-0.5">Source: {it.source}</div>
                )}
              </div>
              <a href={it.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="secondary">
                  Open PDF <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
