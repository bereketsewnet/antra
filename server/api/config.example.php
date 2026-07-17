<?php
// ── Antra Business Group — API configuration template ──
// Copy this file to `config.php` and fill in real values.
// `config.php` is gitignored — never commit real credentials.
//
// This file only RETURNS an array; requesting it directly over HTTP executes
// it and outputs nothing, so it is safe to sit alongside the API scripts
// (same pattern already used by mail-config.php).

return [
    // ── MySQL (created in cPanel → MySQL Databases) ──
    // cPanel usually prefixes the names, e.g. "antra_admin", "antra_web".
    'db_host'    => 'localhost',
    'db_name'    => 'antra_web',
    'db_user'    => 'antra_web',
    'db_pass'    => 'YOUR_DB_PASSWORD_HERE',
    'db_charset' => 'utf8mb4',

    // ── Sessions / security ──
    // A long random string, used to name the admin session cookie. Change once.
    'session_name' => 'antra_admin_sess',
    // Restrict the cookie to HTTPS (leave true in production).
    'cookie_secure' => true,

    // ── CV / file uploads ──
    // IMPORTANT: point this at a folder OUTSIDE public_html so uploaded CVs
    // can never be downloaded directly by URL. They are only served through
    // the authenticated download endpoint. Example on cPanel:
    //   /home/USERNAME/antra_private/cvs
    'upload_dir'       => __DIR__ . '/../../private/cvs',
    'max_upload_bytes' => 5 * 1024 * 1024, // 5 MB
    'allowed_cv_types' => [
        'application/pdf'                                                         => 'pdf',
        'application/msword'                                                      => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
    ],

    // ── Email alerts (reuse the mail settings from mail-config.php) ──
    // Where new job-application alerts are sent. Falls back to mail-config's
    // to_email if left null.
    'hr_alert_email' => null,

    // Set false for local development so the app doesn't try to reach the
    // real SMTP server on every application. Leave true in production.
    'send_alerts' => true,
];
