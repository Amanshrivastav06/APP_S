"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type UploadedFile = { name: string; url: string; type: string };

export function MediaUploadLocal({ onUploaded }: { onUploaded: (f: UploadedFile[]) => void }) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [loading, setLoading] = React.useState(false);

    const pick: React.ChangeEventHandler<HTMLInputElement> = (e) =>
        setFiles(Array.from(e.target.files ?? []));

    const upload = async () => {
        if (!files.length) return;
        setLoading(true);
        try {
            const fd = new FormData();
            files.forEach((f) => fd.append("files", f));
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Upload failed");
            onUploaded(data.files as UploadedFile[]);
            setFiles([]);
        } catch (e) {
            alert((e as Error).message);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Input type="file" multiple accept="image/*,application/pdf,video/*,audio/*" onChange={pick} />
            <Button onClick={upload} disabled={!files.length || loading}>
                {loading ? "Uploading..." : "Upload"}
            </Button>
        </div>
    );
}
