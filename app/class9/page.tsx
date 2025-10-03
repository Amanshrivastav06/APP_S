import dynamic from "next/dynamic";

const Class9Subjects = dynamic(() => import("@/components/class9-subjects"), { ssr: false });

export default function Class9Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Class 9 Subjects</h1>
      <Class9Subjects />
    </div>
  );
}
