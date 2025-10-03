# OpenAI setup for NCERT Study App

This project already includes the Vercel AI SDK (`@ai-sdk/openai` + `@ai-sdk/react`).
The AI Tutor page `/ai-tutor` talks to the server route `/api/chat` which calls OpenAI `gpt-4o`.

## Steps

1. **Create `.env.local`**
   ```bash
   cp .env.example .env.local
   # then edit and put your real keys
   ```

   Required:
   - `OPENAI_API_KEY`  ← from https://platform.openai.com/api-keys
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already in your .env.local)

2. **Install deps and run**
   ```bash
   npm install
   npm run dev
   ```

3. **Test**
   - Open http://localhost:3000/ai-tutor
   - Ask a question; the request hits `app/api/chat/route.ts` using `gpt-4o`.

## Notes
- The SDK reads `OPENAI_API_KEY` automatically. No other code changes are required.
- To change the model, edit `app/api/chat/route.ts` and update:
  ```ts
  model: openai("gpt-4o")
  ```

