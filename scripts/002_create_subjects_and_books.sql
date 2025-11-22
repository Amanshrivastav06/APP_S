-- Create subjects table
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon text,
  color text default '#3b82f6',
  class_level integer not null default 9,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create books table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  description text,
  cover_image_url text,
  class_level integer not null default 9,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chapters table
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  chapter_number integer not null,
  title text not null,
  description text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create topics table
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  content text,
  summary text,
  topic_order integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables (public read access for educational content)
alter table public.subjects enable row level security;
alter table public.books enable row level security;
alter table public.chapters enable row level security;
alter table public.topics enable row level security;

-- Public read access for educational content
create policy "subjects_select_all" on public.subjects for select using (true);
create policy "books_select_all" on public.books for select using (true);
create policy "chapters_select_all" on public.chapters for select using (true);
create policy "topics_select_all" on public.topics for select using (true);
