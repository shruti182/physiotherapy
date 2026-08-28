-- Run this once in Supabase → SQL Editor to bring the `courses` table
-- in line with the new grade-band pricing (₹4,500 for Grade 6–10,
-- ₹7,000 for Grade 11–12). Only touches school courses whose id follows
-- the "<subject>-grade-<n>" convention — professional/career courses
-- (sql-mastery, python-data-science, etc.) are untouched.

-- Grade 6–10 subjects → ₹4,500/month
update courses
set price_now = 4500,
    price_old = null   -- old "% off" markdown doesn't apply to subscription pricing
where id ~ '-grade-(6|7|8|9|10)$';

-- Grade 11–12 subjects → ₹7,000/month
update courses
set price_now = 7000,
    price_old = null
where id ~ '-grade-(11|12)$';

-- Optional: the generic "Class 6–12 overview" cards (mathematics-school,
-- science-school, english-school, computers-school) — set them to the
-- Grade 6–10 starting price too, if these ids exist as their own rows.
update courses
set price_now = 4500,
    price_old = null
where id in ('mathematics-school', 'science-school', 'english-school', 'computers-school');

-- Sanity check: see what's left with an old/blank price
select id, price_now, price_old, is_free
from courses
where id ~ '-grade-\d+$' or id like '%-school'
order by id;
