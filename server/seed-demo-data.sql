-- ── OPTIONAL demo data: extra jobs + a spread of applications ──
-- Run after schema.sql (and optionally seed-sample-jobs.sql). Uses slugs so
-- it won't clash. To remove later: delete the rows whose slugs start below,
-- or just delete from the admin panel.

-- ── Jobs (varied statuses + deadlines so the countdown shows) ──
INSERT INTO jobs (slug, title, department, location, employment_type, summary, description, requirements, status, posted_at, closes_at) VALUES
('senior-hr-consultant', 'Senior HR Consultant', 'Consultancy', 'Addis Ababa, Ethiopia', 'full_time',
 'Lead HR transformation and people-strategy engagements for our consulting clients.',
 'You will run end-to-end HR and organizational engagements — from diagnosis through implementation — for corporate and government clients across Ethiopia and the region.',
 'At least 7 years in HR consulting or a senior HR leadership role. Strong facilitation, stakeholder management, and a track record of delivering change that sticks.',
 'open', NOW(), DATE_ADD(CURDATE(), INTERVAL 3 DAY)),

('procurement-officer', 'Procurement Officer', 'Trading', 'Addis Ababa, Ethiopia', 'full_time',
 'Own sourcing and supplier coordination through our Djibouti Free Zone operations.',
 'Manage the procurement cycle for construction machinery, medical equipment, and EVs — supplier negotiation, ordering, and logistics coordination.',
 'Background in procurement, supply chain, or trade. Detail-oriented with strong supplier-management skills.',
 'open', NOW(), CURDATE()),

('marketing-lead', 'Marketing & Brand Lead', 'Corporate', 'Addis Ababa, Ethiopia', 'full_time',
 'Own brand, content, and growth across both our consulting and trading divisions.',
 'Shape how Antra shows up in the market — brand, digital presence, campaigns, and lead generation.',
 'Experience leading marketing for a services or B2B brand. Strong writing and a portfolio of campaigns.',
 'open', NOW(), NULL),

('finance-analyst', 'Finance Analyst', 'Corporate', 'Addis Ababa, Ethiopia', 'contract',
 'Financial modelling and analysis to support engagements and trading deals.',
 'Support consulting engagements and trading decisions with financial modelling, analysis, and reporting.',
 'Strong Excel/financial-modelling skills. Accounting or finance background.',
 'draft', NULL, NULL),

('logistics-coordinator', 'Logistics Coordinator', 'Trading', 'Djibouti Free Zone', 'full_time',
 'Coordinate freight and clearance between the Djibouti Free Zone and Ethiopia.',
 'Coordinate shipments, clearance, and last-mile logistics for goods moving from Djibouti into Ethiopia and the region.',
 'Logistics or freight-forwarding experience. Knowledge of Djibouti–Ethiopia trade corridors is a plus.',
 'closed', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY));

-- ── Applications (spread across statuses) ──
INSERT INTO applications (job_id, applicant_name, email, phone, cover_letter, status, created_at) VALUES
((SELECT id FROM jobs WHERE slug='senior-hr-consultant'), 'Meron Alemu', 'meron.alemu@example.com', '+251911223344', 'Ten years in HR across banking and telecom — I would love to bring that to your consulting practice.', 'new', DATE_SUB(NOW(), INTERVAL 1 DAY)),
((SELECT id FROM jobs WHERE slug='senior-hr-consultant'), 'Dawit Bekele', 'dawit.bekele@example.com', '+251922334455', 'I have led three org-transformation programs end to end.', 'reviewing', DATE_SUB(NOW(), INTERVAL 2 DAY)),
((SELECT id FROM jobs WHERE slug='senior-hr-consultant'), 'Hanna Girma', 'hanna.girma@example.com', '+251933445566', 'Passionate about leadership development and coaching.', 'shortlisted', DATE_SUB(NOW(), INTERVAL 3 DAY)),
((SELECT id FROM jobs WHERE slug='procurement-officer'), 'Yonas Tesfaye', 'yonas.tesfaye@example.com', '+251944556677', 'Five years in procurement for a construction firm.', 'new', DATE_SUB(NOW(), INTERVAL 1 DAY)),
((SELECT id FROM jobs WHERE slug='procurement-officer'), 'Sara Mohammed', 'sara.mohammed@example.com', '+251955667788', 'Supply-chain background with Djibouti corridor experience.', 'reviewing', DATE_SUB(NOW(), INTERVAL 4 DAY)),
((SELECT id FROM jobs WHERE slug='marketing-lead'), 'Nahom Assefa', 'nahom.assefa@example.com', '+251966778899', 'B2B marketing lead, ex-agency. Portfolio attached.', 'new', DATE_SUB(NOW(), INTERVAL 2 DAY)),
((SELECT id FROM jobs WHERE slug='marketing-lead'), 'Liya Haile', 'liya.haile@example.com', '+251977889900', 'Brand and content specialist.', 'rejected', DATE_SUB(NOW(), INTERVAL 6 DAY)),
((SELECT id FROM jobs WHERE slug='marketing-lead'), 'Samuel Tadesse', 'samuel.tadesse@example.com', '+251988990011', 'Growth marketer with strong analytics.', 'hired', DATE_SUB(NOW(), INTERVAL 8 DAY)),
((SELECT id FROM jobs WHERE slug='sample-management-consultant'), 'Rahel Negash', 'rahel.negash@example.com', '+251999001122', 'Management consultant, ex-Big Four.', 'reviewing', DATE_SUB(NOW(), INTERVAL 3 DAY)),
((SELECT id FROM jobs WHERE slug='sample-trading-officer'), 'Kaleb Fikru', 'kaleb.fikru@example.com', '+251900112233', 'Trading and distribution background.', 'new', DATE_SUB(NOW(), INTERVAL 1 DAY));
