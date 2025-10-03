-- Insert Class 9 NCERT subjects
insert into public.subjects (name, description, icon, color, class_level) values
  ('Mathematics', 'Class 9 Mathematics NCERT', '📐', '#3b82f6', 9),
  ('Science', 'Class 9 Science NCERT', '🔬', '#10b981', 9),
  ('Social Science', 'Class 9 Social Science NCERT', '🌍', '#f59e0b', 9),
  ('English', 'Class 9 English NCERT', '📚', '#8b5cf6', 9),
  ('Hindi', 'Class 9 Hindi NCERT', '🇮🇳', '#ef4444', 9)
on conflict (name) do nothing;

-- Insert sample books for Mathematics
insert into public.books (subject_id, title, description, class_level)
select 
  s.id,
  'Mathematics Textbook for Class IX',
  'NCERT Mathematics textbook covering all fundamental concepts for Class 9',
  9
from public.subjects s 
where s.name = 'Mathematics'
on conflict do nothing;

-- Insert sample books for Science
insert into public.books (subject_id, title, description, class_level)
select 
  s.id,
  'Science Textbook for Class IX',
  'NCERT Science textbook covering Physics, Chemistry, and Biology for Class 9',
  9
from public.subjects s 
where s.name = 'Science'
on conflict do nothing;

-- Insert sample chapters for Mathematics
insert into public.chapters (book_id, chapter_number, title, description)
select 
  b.id,
  1,
  'Number Systems',
  'Introduction to rational and irrational numbers, real numbers and their decimal expansions'
from public.books b 
join public.subjects s on b.subject_id = s.id
where s.name = 'Mathematics'
on conflict do nothing;

insert into public.chapters (book_id, chapter_number, title, description)
select 
  b.id,
  2,
  'Polynomials',
  'Introduction to polynomials, remainder theorem, and factorization'
from public.books b 
join public.subjects s on b.subject_id = s.id
where s.name = 'Mathematics'
on conflict do nothing;

-- Insert sample chapters for Science
insert into public.chapters (book_id, chapter_number, title, description)
select 
  b.id,
  1,
  'Matter in Our Surroundings',
  'Physical nature of matter, characteristics of particles of matter'
from public.books b 
join public.subjects s on b.subject_id = s.id
where s.name = 'Science'
on conflict do nothing;

-- Insert sample topics for Number Systems chapter
insert into public.topics (chapter_id, title, summary, topic_order)
select 
  c.id,
  'Rational Numbers',
  'Numbers that can be expressed in the form p/q where p and q are integers and q ≠ 0',
  1
from public.chapters c 
join public.books b on c.book_id = b.id
join public.subjects s on b.subject_id = s.id
where s.name = 'Mathematics' and c.title = 'Number Systems'
on conflict do nothing;

insert into public.topics (chapter_id, title, summary, topic_order)
select 
  c.id,
  'Irrational Numbers',
  'Numbers that cannot be expressed in the form p/q, such as √2, π, etc.',
  2
from public.chapters c 
join public.books b on c.book_id = b.id
join public.subjects s on b.subject_id = s.id
where s.name = 'Mathematics' and c.title = 'Number Systems'
on conflict do nothing;

-- Insert sample questions
insert into public.questions (subject_id, chapter_id, question_text, question_type, options, correct_answer, explanation, difficulty_level, marks)
select 
  s.id,
  c.id,
  'Which of the following is a rational number?',
  'multiple_choice',
  '["√2", "π", "3/4", "√3"]'::jsonb,
  '3/4',
  'A rational number can be expressed as p/q where p and q are integers and q ≠ 0. 3/4 satisfies this condition.',
  'easy',
  1
from public.subjects s
join public.books b on s.id = b.subject_id
join public.chapters c on b.id = c.book_id
where s.name = 'Mathematics' and c.title = 'Number Systems'
on conflict do nothing;
