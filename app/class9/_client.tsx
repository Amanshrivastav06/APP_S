"use client";

import dynamic from "next/dynamic";

// ✅ Dynamic import allowed in Client Component
const Class9Subjects = dynamic(
    () => import("@/components/class9-subjects"),
    { ssr: false }
);

export default function Class9Client() {
    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-semibold">Class 9 Subjects</h1>
            <Class9Subjects />
        </div>
    );
}
