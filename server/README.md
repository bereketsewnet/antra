# Antra Backend — cPanel Deployment Guide

The site is a static React build **plus** a small PHP + MySQL API that powers
**Careers/Jobs**, **Surveys**, and the **Admin panel**. It runs on standard
cPanel — the same stack the contact form (`mail.php`) already uses.
**No Node.js is needed on the server.**

### Do I need a separate domain (e.g. `api.antragroup.et`)? — No.
The API is just PHP files served by the **same** domain. The frontend calls
`/api/jobs.php`, `/mail.php`, `/uploads/…` on `antragroup.et`, and those are
real files served directly. A separate subdomain would only add CORS and
cross-subdomain cookie problems. Everything stays same-origin.

### Shared cPanel with an addon/subdomain
This account hosts several sites, so `antragroup.et` is **not** served from
`public_html`. Its document root is its own folder — typically
**`/home/USERNAME/antragroup.et/`**. Everywhere below, **“the site folder”**
means that `antragroup.et/` folder (check cPanel → Domains for the exact
"Document Root" if unsure). `public_html` is a different site — leave it
alone.

---

## Final layout on the server

```
/home/USERNAME/
  .env                        ← secrets — NEXT TO the site folder, NOT inside it
  antra_private/
    cvs/                      ← uploaded CVs (private)
  antragroup.et/              ← ★ the site folder (document root for antragroup.et)
    index.html, assets/…      ← the built React site (contents of dist/)
    .htaccess                 ← from dist/ (SPA routing + HTTPS + file protection)
    favicon.ico, robots.txt, sitemap.xml
    mail.php                  ← contact form (from server/)
    mail-config.php           ← email SMTP secrets (from server/)
    create-admin.php          ← run once, then DELETE (from server/)
    cron-close-jobs.php       ← optional cron (from server/)
    uploads/jobs/             ← public job images (create; must be writable)
    api/                      ← everything from server/api/
      config.php              ← reads ../../.env (no secrets in it)
      _lib/  auth/  admin/  jobs.php  apply.php  survey.php …
  public_html/                ← your OTHER site(s) — untouched
```

The frontend calls `/api/…`, `/mail.php`, and `/uploads/…`, so those sit at the
**root of the `antragroup.et/` folder** exactly as above.

---

## Step 1 — Build the frontend

On your machine:
```
npm run build
```
Upload the **contents of `dist/`** into the **`antragroup.et/` folder**.

## Step 2 — Upload the PHP API

Upload the **contents of `server/`** into the same **`antragroup.et/` folder**,
so `mail.php`, `create-admin.php`, `cron-close-jobs.php`, and the `api/` folder
land at its root (see layout). `mail-config.php` sits next to `mail.php`.

> Don't upload `schema.sql`, `seed-*.sql`, or `README.md` to a web-visible spot
> — they're only used during setup.

## Step 3 — Create the database

cPanel → **MySQL Databases**:
1. Create a database (e.g. `antra_web` → becomes `cpaneluser_antra_web`).
2. Create a DB user with a strong password.
3. Add the user to the database with **All Privileges**.

Then cPanel → **phpMyAdmin** → select the database → **SQL** tab → paste all of
`schema.sql` → **Go**. (Optional: also run `seed-sample-jobs.sql`.)

## Step 4 — Create the `.env` secrets file (NEXT TO the site folder)

`api/config.php` looks for `.env` **one level above the site folder** first —
i.e. in your home directory, **beside** `antragroup.et/`. Create
`/home/USERNAME/.env` from `.env.example`:

```
DB_HOST=localhost
DB_NAME=cpaneluser_antra_web
DB_USER=cpaneluser_antra_web
DB_PASS=your-db-password
DB_CHARSET=utf8mb4

SESSION_NAME=antra_admin_sess
COOKIE_SECURE=true

UPLOAD_DIR=/home/USERNAME/antra_private/cvs
MAX_UPLOAD_BYTES=5242880

HR_ALERT_EMAIL=
SEND_ALERTS=true
```

> **If the home directory is shared/cluttered** across your sites and you'd
> rather keep `.env` with the site: you can instead put it **inside** the
> `antragroup.et/` folder (`antragroup.et/.env`). `config.php` checks that
> location too, and the `.htaccess` blocks it from being downloaded. The
> home-directory spot above is still the preferred, safest option.

## Step 5 — Private CV folder + writable uploads

- Create `/home/USERNAME/antra_private/cvs` (matches `UPLOAD_DIR`) — outside the
  site folder. CVs are stored here and only served to signed-in admins via
  `download-cv.php`.
- Ensure `antragroup.et/uploads/jobs/` exists and is **writable** (`0755`).
  Public job thumbnails are stored here.

## Step 6 — Email (SMTP)

`mail-config.php` already holds the `info@antragroup.et` SMTP credentials
(shared by the contact form and the application/status emails). Since the
mailbox is on the same host, no extra config is needed.

## Step 7 — Create your first admin login

cPanel → **Terminal** (or a one-time Cron). From the site folder:
```
cd ~/antragroup.et
php create-admin.php "Your Name" "you@antragroup.et" "StrongPassword123" admin
```
Then **delete `create-admin.php`**. Log in at **`https://antragroup.et/admin`**.
All other admin / HR / survey accounts are created from inside the panel.

## Step 8 — (Optional) Auto-close cron

cPanel → **Cron Jobs**, daily (e.g. 00:05):
```
/usr/local/bin/php /home/USERNAME/antragroup.et/cron-close-jobs.php
```

---

## Requirements
- **PHP 8.0+** (cPanel → **MultiPHP Manager**, set it for the `antragroup.et`
  domain) with `pdo_mysql`, `fileinfo`, `openssl` (all standard on cPanel).
- MySQL / MariaDB.
- **HTTPS** on `antragroup.et` (the session cookie is `Secure`).

## Security notes
- `.env` and `antra_private/cvs` live **outside** the site's web root.
- `.htaccess` blocks direct web access to `.env`, `config.php`,
  `mail-config.php`; `api/_lib/` is denied too. Admin endpoints verify the
  session **and role** server-side on every request. Passwords use bcrypt.
- Delete `create-admin.php` after first use.

## Updating later
- **Frontend/UI:** `npm run build`, re-upload `dist/` contents into `antragroup.et/`.
- **Backend:** re-upload the changed files under `antragroup.et/api/`.
- **DB change:** run the matching `ALTER`/`CREATE` in phpMyAdmin.
