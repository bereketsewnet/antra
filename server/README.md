# Antra Backend — cPanel Setup Guide

The site is a static React build **plus** a small PHP API for two features:
**Careers/Jobs** and (coming next) **Surveys**, managed from an admin panel.
It runs on standard cPanel (PHP + MySQL) — the same stack the contact form
(`mail.php`) already uses. **No Node.js required.**

---

## What's in this folder

```
server/
  mail.php                  ← existing contact-form handler (unchanged)
  mail-config.php           ← existing email secrets (gitignored)
  schema.sql                ← run once to create all database tables
  seed-sample-jobs.sql      ← OPTIONAL: 2 sample jobs to preview the Careers page
  create-admin.php          ← run once (CLI) to create your first admin login
  api/
    config.example.php      ← copy to config.php and fill in DB credentials
    config.php              ← your real DB credentials (gitignored)
    _lib/                   ← shared code (blocked from direct web access)
    auth/  login.php  logout.php  me.php
    jobs.php                ← public: list / show open jobs
    apply.php               ← public: submit an application (+ CV upload)
```

---

## One-time setup on cPanel

### 1. Create the MySQL database
cPanel → **MySQL Databases**:
1. Create a database (e.g. `antra_web`).
2. Create a user with a strong password.
3. Add the user to the database with **All Privileges**.
   (cPanel will prefix names, e.g. `cpaneluser_antra_web`.)

### 2. Create the tables
cPanel → **phpMyAdmin** → select your database → **SQL** tab → paste the
contents of `schema.sql` → **Go**. (Optionally run `seed-sample-jobs.sql`
too, to preview the Careers page with sample roles.)

### 3. Deploy the files
Upload so the site is laid out like this under `public_html`:
```
public_html/
  index.html, assets/, .htaccess …   ← the built React site (from `dist/`)
  mail.php, mail-config.php           ← existing contact form
  api/                                ← everything from server/api/
```
The frontend calls `/api/jobs.php`, `/api/apply.php`, `/api/auth/login.php`, etc.

### 4. Configure the API
Copy `api/config.example.php` → `api/config.php` and fill in:
- the **MySQL** host / name / user / password from step 1
- `upload_dir` → a folder **outside** `public_html` (see step 5)
- `hr_alert_email` → where new application alerts should go (or leave `null`
  to reuse the contact-form address in `mail-config.php`)

### 5. Create the private CV folder (outside the web root)
Uploaded CVs must **never** be downloadable by URL. Create a folder that is
NOT inside `public_html`, e.g.:
```
/home/USERNAME/antra_private/cvs
```
Point `upload_dir` in `config.php` at it. CVs are then only accessible to
signed-in admins through the (upcoming) download endpoint.

### 6. Create your first admin login
cPanel → **Terminal** (or a "run once" Cron job):
```
cd ~/public_html/server        # wherever create-admin.php lives
php create-admin.php "Your Name" "you@antragroup.et" "StrongPassword123" admin
```
Then **delete `create-admin.php` from the server.** After this first admin,
all other admin/HR users are created from inside the admin panel.

---

### 7. (Optional) Schedule the auto-close cron
Jobs auto-close as soon as anyone loads the listings after the deadline, so
a cron isn't strictly required — but for accuracy even on quiet days, add a
daily cron in cPanel → **Cron Jobs** (e.g. at 00:05):
```
/usr/local/bin/php /home/USERNAME/public_html/server/cron-close-jobs.php
```

---

## Requirements checklist
- PHP 8.0+ with `pdo_mysql` and `fileinfo` extensions (both standard on cPanel).
- MySQL / MariaDB database.
- HTTPS enabled (the admin session cookie is set `Secure`).

## Security notes
- `config.php`, `mail-config.php`, and the `private/` CV folder are gitignored
  and must never be committed or placed inside the public web root.
- Admin endpoints check the session server-side on every request — the
  frontend `/admin` guard is only for UX.
- Passwords are stored with PHP `password_hash()` (bcrypt).
