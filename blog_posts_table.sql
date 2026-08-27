-- Run this in Supabase → SQL Editor (once).
-- Creates the table that blog.html and blog-post.html read from.

create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,          -- used in the URL: blog-post.html?slug=this-value
  title         text not null,
  excerpt       text,                          -- short teaser shown on the blog listing page
  content_html  text,                          -- the full post body, written as HTML
  cover_image   text,                          -- image URL for the card + post banner
  category      text,                          -- one of: school | board-prep | competitive | career
  author_name   text default 'Learners Academy',
  status        text not null default 'draft', -- 'draft' or 'published' — only 'published' shows on the site
  published_at  timestamptz default now(),
  created_at    timestamptz default now()
);

-- Allow the public (anonymous) site to READ only published posts.
alter table public.blog_posts enable row level security;

create policy "Public can read published posts"
  on public.blog_posts
  for select
  using (status = 'published');

-- You (as the logged-in owner in the Supabase dashboard / Table Editor) can
-- always read and write regardless of status, since dashboard access uses
-- the service role and bypasses RLS automatically — no extra policy needed
-- for that.
