-- ── OPTIONAL: sample open jobs ──
-- Run this after schema.sql if you want to see the Careers page populated
-- before the admin panel exists. Delete these rows later from the admin
-- panel (or: DELETE FROM jobs WHERE slug LIKE 'sample-%';).

INSERT INTO jobs
  (slug, title, department, location, employment_type, summary, description, requirements, status, posted_at)
VALUES
  ('sample-management-consultant',
   'Management Consultant',
   'Consultancy',
   'Addis Ababa, Ethiopia',
   'full_time',
   'Lead client engagements across strategy, organizational transformation, and leadership development.',
   'You will work directly with client leadership teams to diagnose problems, design solutions, and stay through implementation. This is a hands-on role — we do not hand over a report and leave.',
   'Five or more years in consulting or a senior operational role. Strong facilitation and analytical skills. Experience in Ethiopian or regional markets is a plus.',
   'open', NOW()),

  ('sample-trading-officer',
   'Trading & Supply Officer',
   'Trading',
   'Addis Ababa, Ethiopia',
   'full_time',
   'Coordinate sourcing and supply of equipment through our Djibouti Free Zone operations.',
   'Own supplier relationships, manage orders from single units to full fleets, and coordinate logistics from the Djibouti Free Zone into Ethiopia and the region.',
   'Background in trade, procurement, or logistics. Comfortable with manufacturer relationships and freight coordination. Attention to detail and follow-through.',
   'open', NOW());
