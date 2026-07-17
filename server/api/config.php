<?php
// ── Antra API configuration — sourced from the .env file ──
// This file holds NO secrets (only safe fallback defaults), so it is safe to
// commit. Real values live in `.env` (gitignored). See `.env.example`.
//
// The .env is looked for one level ABOVE the server/web root:
//   • local dev:  <project>/.env
//   • cPanel:     /home/USERNAME/.env  (outside public_html — not web-readable)

require_once __DIR__ . '/_lib/env.php';

foreach ([__DIR__ . '/../../.env', __DIR__ . '/../.env'] as $candidate) {
    if (is_file($candidate)) {
        load_env($candidate);
        break;
    }
}

$asBool = static fn (string $key, bool $default): bool =>
    filter_var(env($key, $default ? 'true' : 'false'), FILTER_VALIDATE_BOOLEAN);

return [
    // ── MySQL ──
    'db_host'    => env('DB_HOST', '127.0.0.1'),
    'db_name'    => env('DB_NAME', 'antra_web'),
    'db_user'    => env('DB_USER', 'root'),
    'db_pass'    => (string) env('DB_PASS', ''),
    'db_charset' => env('DB_CHARSET', 'utf8mb4'),

    // ── Sessions ──
    'session_name'  => env('SESSION_NAME', 'antra_admin_sess'),
    'cookie_secure' => $asBool('COOKIE_SECURE', true),

    // ── Uploads ──
    'upload_dir'       => env('UPLOAD_DIR') ?: (__DIR__ . '/../private/cvs'),
    'max_upload_bytes' => (int) env('MAX_UPLOAD_BYTES', (string) (5 * 1024 * 1024)),
    'allowed_cv_types' => [
        'application/pdf'                                                         => 'pdf',
        'application/msword'                                                      => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
    ],

    // ── Email alerts ──
    'hr_alert_email' => env('HR_ALERT_EMAIL') ?: null,
    'send_alerts'    => $asBool('SEND_ALERTS', true),
];
