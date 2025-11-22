-- Create questions table
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('multiple_choice', 'true_false', 'short_answer', 'long_answer')),
  options jsonb, -- For multiple choice questions
  correct_answer text not null,
  explanation text,
  difficulty_level text not null check (difficulty_level in ('easy', 'medium', 'hard')),
  marks integer default 1,
  year integer, -- Previous year question paper year
  exam_type text, -- CBSE, State Board, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user progress table
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  progress_type text not null check (progress_type in ('reading', 'quiz_completed')),
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, chapter_id, topic_id, progress_type)
);

-- Create quiz attempts table
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete cascade,
  quiz_type text not null check (quiz_type in ('chapter', 'subject', 'mixed')),
  total_questions integer not null,
  correct_answers integer not null default 0,
  total_marks integer not null,
  scored_marks integer not null default 0,
  time_taken integer, -- in seconds
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create quiz responses table
create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  quiz_attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  user_answer text,
  is_correct boolean not null default false,
  marks_awarded integer not null default 0,
  time_taken integer -- in seconds for this question
);

-- Enable RLS
alter table public.questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_responses enable row level security;

-- Public read access for questions
create policy "questions_select_all" on public.questions for select using (true);

-- User-specific access for progress and attempts
create policy "user_progress_select_own" on public.user_progress for select using (auth.uid() = user_id);
create policy "user_progress_insert_own" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "user_progress_update_own" on public.user_progress for update using (auth.uid() = user_id);

create policy "quiz_attempts_select_own" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "quiz_attempts_insert_own" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "quiz_attempts_update_own" on public.quiz_attempts for update using (auth.uid() = user_id);

create policy "quiz_responses_select_own" on public.quiz_responses 
  for select using (auth.uid() = (select user_id from quiz_attempts where id = quiz_attempt_id));
create policy "quiz_responses_insert_own" on public.quiz_responses 
  for insert with check (auth.uid() = (select user_id from quiz_attempts where id = quiz_attempt_id));
