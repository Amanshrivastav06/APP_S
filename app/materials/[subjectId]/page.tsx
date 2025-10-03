import Link from "next/link";
import { SUBJECT_SECTIONS } from "@/data/material-categories";

export default function SubjectHub({ params }: { params: { subjectId: string } }) {
  const subject = params.subjectId;
  const title = subject.replace(/-/g, " ");

  const Row = ({ k, label }: { k: string; label: string }) => (
    <Link
      href={`/materials/${subject}/${k}`}
      className="flex items-center justify-between rounded-2xl border bg-white p-3 hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 grid place-items-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200">
          <span className="text-indigo-600 text-base">📄</span>
        </div>
        <div>
          <div className="text-[15px] font-medium">{label}</div>
        </div>
      </div>
      <span className="text-muted-foreground">›</span>
    </Link>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold capitalize">{title}</h1>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Downloads</h2>
        <div className="space-y-3">
          {SUBJECT_SECTIONS.downloads.map(x => (
            <Row key={x.key} k={x.key} label={x.label} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Resources</h2>
        <div className="space-y-3">
          {SUBJECT_SECTIONS.resources.map(x => (
            <Row key={x.key} k={x.key} label={x.label} />
          ))}
        </div>
      </section>
    </div>
  );
}
