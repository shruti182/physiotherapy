-- ============================================================
-- Learners Academy — per-class (grade 6–12) course pricing
-- Run in: Supabase dashboard → SQL Editor → New query → Run
--
-- These ids match what the Class filter on courses.html generates:
--   {subject-slug}-grade-{grade}
-- e.g. math-grade-6, science-grade-9, english-grade-12, ...
--
-- If your "courses" table doesn't exist yet, this creates it first
-- (safe to run even if it already exists — uses IF NOT EXISTS).
-- After this runs, change any price anytime in:
--   Supabase dashboard → Table Editor → courses → edit price_now / price_old → save
-- The website picks up the new price on next page load, no redeploy needed.
-- ============================================================

create table if not exists public.courses (
  id text primary key,          -- matches data-course-id on each course card
  name text,                    -- just for your reference in the table editor
  price_now numeric,            -- current selling price (in Rupees, no symbol)
  price_old numeric,            -- original / strikethrough price (leave blank if none)
  is_free boolean default false,
  updated_at timestamptz default now()
);

alter table public.courses enable row level security;

drop policy if exists "Anyone can view course prices" on public.courses;
create policy "Anyone can view course prices"
  on public.courses for select
  using (true);

-- No public write policy — prices can only be changed from the Supabase
-- dashboard (Table Editor), not from the website itself.

-- ============================================================
-- Per-class rows for the 5 School subjects × Class 6–12.
-- Prices below match the fallback prices already built into the site,
-- so nothing changes for visitors until you edit a row here.
-- on conflict do nothing — safe to re-run without overwriting any
-- prices you've already customized in the Table Editor.
-- ============================================================

insert into public.courses (id, name, price_now, price_old, is_free) values
  -- Mathematics
  ('math-grade-6',            'Mathematics — Class 6',            999,  2999, false),
  ('math-grade-7',            'Mathematics — Class 7',            999,  2999, false),
  ('math-grade-8',            'Mathematics — Class 8',            999,  2999, false),
  ('math-grade-9',            'Mathematics — Class 9',            999,  2999, false),
  ('math-grade-10',           'Mathematics — Class 10',           999,  2999, false),
  ('math-grade-11',           'Mathematics — Class 11',           999,  2999, false),
  ('math-grade-12',           'Mathematics — Class 12',           999,  2999, false),

  -- Science
  ('science-grade-6',         'Science — Class 6',                799,  2499, false),
  ('science-grade-7',         'Science — Class 7',                799,  2499, false),
  ('science-grade-8',         'Science — Class 8',                799,  2499, false),
  ('science-grade-9',         'Science — Class 9',                799,  2499, false),
  ('science-grade-10',        'Science — Class 10',               799,  2499, false),
  ('science-grade-11',        'Science — Class 11',               799,  2499, false),
  ('science-grade-12',        'Science — Class 12',               799,  2499, false),

  -- English
  ('english-grade-6',         'English — Class 6',                1199, 2999, false),
  ('english-grade-7',         'English — Class 7',                1199, 2999, false),
  ('english-grade-8',         'English — Class 8',                1199, 2999, false),
  ('english-grade-9',         'English — Class 9',                1199, 2999, false),
  ('english-grade-10',        'English — Class 10',               1199, 2999, false),
  ('english-grade-11',        'English — Class 11',               1199, 2999, false),
  ('english-grade-12',        'English — Class 12',               1199, 2999, false),

  -- Social Studies (free, like the existing overview card)
  ('social-studies-grade-6',  'Social Studies — Class 6',         null, null, true),
  ('social-studies-grade-7',  'Social Studies — Class 7',         null, null, true),
  ('social-studies-grade-8',  'Social Studies — Class 8',         null, null, true),
  ('social-studies-grade-9',  'Social Studies — Class 9',         null, null, true),
  ('social-studies-grade-10', 'Social Studies — Class 10',        null, null, true),
  ('social-studies-grade-11', 'Social Studies — Class 11',        null, null, true),
  ('social-studies-grade-12', 'Social Studies — Class 12',        null, null, true),

  -- Computers
  ('computers-grade-6',       'Computers — Class 6',              1199, 3499, false),
  ('computers-grade-7',       'Computers — Class 7',              1199, 3499, false),
  ('computers-grade-8',       'Computers — Class 8',              1199, 3499, false),
  ('computers-grade-9',       'Computers — Class 9',              1199, 3499, false),
  ('computers-grade-10',      'Computers — Class 10',             1199, 3499, false),
  ('computers-grade-11',      'Computers — Class 11',             1199, 3499, false),
  ('computers-grade-12',      'Computers — Class 12',             1199, 3499, false)
on conflict (id) do nothing;
