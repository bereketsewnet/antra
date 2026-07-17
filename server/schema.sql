-- ── Antra Business Group — MySQL schema ──
-- Run this once in cPanel → phpMyAdmin (select your database first, then
-- paste this into the SQL tab). Safe to re-run: uses IF NOT EXISTS.
--
-- Covers: admin users, jobs, applications, and the custom survey builder
-- (surveys, questions, responses, answers).

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ─────────────────────────────────────────────────────────────
-- Admin users (multi-user with roles: 'admin' sees everything,
-- 'hr' sees jobs + applications only)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(190)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('admin','hr') NOT NULL DEFAULT 'hr',
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  last_login_at DATETIME      NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Jobs / vacancies
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(200)  NOT NULL,
  title         VARCHAR(200)  NOT NULL,
  department    VARCHAR(120)  NULL,
  location      VARCHAR(160)  NULL,
  employment_type ENUM('full_time','part_time','contract','internship','temporary') NOT NULL DEFAULT 'full_time',
  summary       VARCHAR(500)  NULL,           -- short teaser for the listing card
  description   MEDIUMTEXT    NULL,           -- full description (sanitized HTML)
  requirements  MEDIUMTEXT    NULL,           -- responsibilities / requirements (sanitized HTML)
  salary_range  VARCHAR(120)  NULL,
  status        ENUM('draft','open','closed') NOT NULL DEFAULT 'draft',
  posted_at     DATETIME      NULL,           -- set when first published
  closes_at     DATE          NULL,           -- optional application deadline
  created_by    INT UNSIGNED  NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_job_slug (slug),
  KEY idx_job_status (status),
  CONSTRAINT fk_job_creator FOREIGN KEY (created_by) REFERENCES admin_users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Job applications (+ CV file reference)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  job_id         INT UNSIGNED NOT NULL,
  applicant_name VARCHAR(160) NOT NULL,
  email          VARCHAR(190) NOT NULL,
  phone          VARCHAR(60)  NULL,
  cover_letter   TEXT         NULL,
  cv_filename    VARCHAR(255) NULL,           -- original filename, for display
  cv_stored_path VARCHAR(255) NULL,           -- path on disk (outside web root)
  status         ENUM('new','reviewing','shortlisted','rejected','hired') NOT NULL DEFAULT 'new',
  status_note    TEXT         NULL,           -- last note the admin added on a status change
  status_updated_at DATETIME  NULL,           -- when status was last changed
  ip             VARCHAR(45)  NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_app_job (job_id),
  KEY idx_app_status (status),
  CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Surveys (custom Google-Forms-style builder)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS surveys (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug         VARCHAR(200) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT         NULL,
  status       ENUM('draft','published','closed') NOT NULL DEFAULT 'draft',
  -- Flexible settings bag: collect_email, one_response, shuffle, show_progress,
  -- response_limit, close_at, confirmation_message, theme, etc.
  settings     JSON         NULL,
  created_by   INT UNSIGNED NULL,
  published_at DATETIME     NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_survey_slug (slug),
  KEY idx_survey_status (status),
  CONSTRAINT fk_survey_creator FOREIGN KEY (created_by) REFERENCES admin_users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Survey questions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS survey_questions (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  survey_id   INT UNSIGNED NOT NULL,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  type        ENUM('short_text','paragraph','multiple_choice','checkboxes','dropdown','linear_scale','rating','date','email','number') NOT NULL DEFAULT 'short_text',
  title       VARCHAR(500) NOT NULL,
  help_text   VARCHAR(500) NULL,
  is_required TINYINT(1)   NOT NULL DEFAULT 0,
  -- Type-specific config: options list, scale min/max + labels, star count, etc.
  config      JSON         NULL,
  PRIMARY KEY (id),
  KEY idx_q_survey (survey_id),
  CONSTRAINT fk_q_survey FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Survey responses (one row per submission)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS survey_responses (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  survey_id   INT UNSIGNED NOT NULL,
  email       VARCHAR(190) NULL,             -- if the survey collects email
  ip          VARCHAR(45)  NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_resp_survey (survey_id),
  CONSTRAINT fk_resp_survey FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
-- Survey answers (one row per question per response)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS survey_answers (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  response_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  -- Stored as text; for checkboxes (multi-select) a JSON array is stored.
  answer      TEXT         NULL,
  PRIMARY KEY (id),
  KEY idx_ans_response (response_id),
  KEY idx_ans_question (question_id),
  CONSTRAINT fk_ans_response FOREIGN KEY (response_id) REFERENCES survey_responses (id) ON DELETE CASCADE,
  CONSTRAINT fk_ans_question FOREIGN KEY (question_id) REFERENCES survey_questions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
