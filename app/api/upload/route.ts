export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const entries = Array.from(form.entries());

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const saved: { name: string; url: string; type: string; size: number }[] = [];

        for (const [, v] of entries) {
            if (!(v instanceof File)) continue;

            // basic guardrails
            if (v.size > 20 * 1024 * 1024) {
                return new Response(JSON.stringify({ error: "File too large (max 20MB)" }), { status: 400 });
            }

            const orig = v.name || "file";
            const safe = orig.replace(/[^\w.\-]+/g, "_");
            const filename = `${Date.now()}-${crypto.randomUUID()}-${safe}`;
            const filepath = path.join(uploadDir, filename);

            const buffer = Buffer.from(await v.arrayBuffer());
            await fs.writeFile(filepath, buffer);

            saved.push({
                name: orig,
                url: `/uploads/${filename}`,
                type: v.type || "application/octet-stream",
                size: v.size,
            });
        }

        return Response.json({ files: saved });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e?.message || "Upload failed" }), { status: 500 });
    }
}
