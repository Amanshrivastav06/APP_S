// app/api/chat-plain/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Attachment = { url: string; type: string; name?: string };

// lightweight allow-list: study topics (NCERT/CBSE) + student mental health
function isAllowedTopic(text: string): boolean {
    const t = (text || "").toLowerCase();
    const study = [
        "ncert", "cbse", "class 9", "math", "algebra", "geometry", "trigonometry", "science",
        "physics", "chemistry", "biology", "social science", "history", "civics", "economics",
        "english", "hindi", "sanskrit", "it", "chapter", "exercise", "question", "syllabus",
        "exam", "homework", "assignment", "topic", "formula", "derivation", "proof"
    ];
    const mental = [
        "mental health", "stress", "anxiety", "focus", "concentration", "motivation",
        "study habits", "procrastination", "sleep", "burnout", "revision plan", "time management"
    ];
    return study.some(w => t.includes(w)) || mental.some(w => t.includes(w));
}

export async function POST(req: Request) {
    try {
        // --- Parse input ---
        const body = await req.json().catch(() => ({} as any));
        const messages: any[] = Array.isArray(body?.messages) ? body.messages : [];
        const attachments: Attachment[] = Array.isArray(body?.attachments) ? body.attachments : [];

        const lastUser = [...messages].reverse().find((m) => m?.role === "user");
        const question = (lastUser?.content ?? "").toString().trim();

        // --- Guardrails: only study + student mental health ---
        if (!isAllowedTopic(question)) {
            return Response.json({
                text:
                    "I’m designed for study help (NCERT/CBSE) and student well-being only.\n" +
                    "Please ask about your subjects (Math, Science, Social Science, English, Hindi, Sanskrit, IT, Civics, Economics)\n" +
                    "or student mental health (focus, motivation, stress, sleep, time-management, etc.)."
            });
        }

        // --- API key ---
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY in .env.local" }), { status: 500 });
        }

        // --- Build multimodal user content (images only) ---
        // gpt-4o-mini supports image input via chat completions.
        const userContent: any =
            attachments?.some(a => a.type?.startsWith("image/"))
                ? [
                    { type: "text", text: question || "Hi" },
                    ...attachments
                        .filter(a => a.type?.startsWith("image/"))
                        .map(a => ({ type: "image_url", image_url: { url: a.url } }))
                ]
                : question || "Hi";

        // --- OpenAI payload ---
        const payload = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI tutor for Class 9 NCERT/CBSE. Answer ONLY study topics or student well-being.\n" +
                        "Be clear, step-by-step, supportive. Avoid medical/clinical diagnoses. If out-of-scope, politely refuse."
                },
                { role: "user", content: userContent }
            ],
            temperature: 0.2
        };

        // --- Call OpenAI ---
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!r.ok) {
            const errText = await r.text();
            // Forward actual OpenAI error text to help debugging in Network tab
            return new Response(JSON.stringify({ error: "OpenAI error", details: errText }), { status: r.status });
        }

        const data = await r.json();
        const text: string = data?.choices?.[0]?.message?.content ?? "No reply.";
        return Response.json({ text });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500 });
    }
}

// (Optional) respond 405 for non-POST
export async function GET() {
    return new Response("Method Not Allowed", { status: 405 });
}
