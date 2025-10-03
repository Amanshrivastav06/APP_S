# Practice with AI (Class 9)

New section added at **/practice/ai**.

## How it works
- Select Subject → Chapter → Category → Level → Quantity.
- Click **Generate & Start** to fetch questions (strictly Class 9 NCERT).
- Quiz shows one-by-one; results include score and detailed solutions.

## API
- `/api/practice` (POST) with `{ subject, chapter, category, level, quantity }`.
- Uses `OPENAI_API_KEY` and `OPENAI_MODEL` (default `gpt-4o-mini`).

## Notes
- Chapters list is seeded from `data/class9_chapters.ts`. Extend lists as needed.
- No database migration required; session is in-memory on the page.
