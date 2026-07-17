<?php
declare(strict_types=1);

// Public job-application endpoint.
//   POST /api/apply.php  (multipart/form-data)
//   fields: job_id, name, email, phone?, cover_letter?, cv (file)
require __DIR__ . '/_lib/bootstrap.php';
require __DIR__ . '/_lib/http.php';
require __DIR__ . '/_lib/db.php';
require __DIR__ . '/_lib/mailer.php';

require_method('POST');
rate_limit('apply', 20); // one application per IP per 20s

// Honeypot (bots fill hidden fields).
if (!empty($_POST['website']) || !empty($_POST['url'])) {
    json_ok(); // pretend success
}

$jobId       = (int)($_POST['job_id'] ?? 0);
$name        = field($_POST, 'name');
$email       = field($_POST, 'email');
$phone       = field($_POST, 'phone');
$coverLetter = trim((string)($_POST['cover_letter'] ?? ''));

// ── Validate the applicant fields ──
$errors = [];
if ($name === '' || mb_strlen($name) > 160)         $errors['name']    = 'Please enter your full name.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))     $errors['email']   = 'Please enter a valid email address.';
if (mb_strlen($coverLetter) > 5000)                 $errors['cover_letter'] = 'Message is too long.';
if ($errors) {
    json_error('Please check the highlighted fields.', 422, ['fields' => $errors]);
}

// ── Confirm the job exists, is open, and hasn't passed its deadline ──
$stmt = db()->prepare(
    "SELECT id, title FROM jobs
     WHERE id = ? AND status = 'open'
       AND (closes_at IS NULL OR closes_at >= CURDATE()) LIMIT 1"
);
$stmt->execute([$jobId]);
$job = $stmt->fetch();
if (!$job) {
    json_error('This position is no longer accepting applications.', 410);
}

// ── Handle the CV upload ──
$storedPath   = null;
$origFilename = null;

if (isset($_FILES['cv']) && $_FILES['cv']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['cv'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        json_error('Your CV could not be uploaded. Please try again.', 400);
    }
    if ($file['size'] > (int)($CONFIG['max_upload_bytes'] ?? 5242880)) {
        json_error('Your CV is too large (max 5 MB).', 413);
    }

    // Trust the file contents, not the client-sent MIME type.
    $finfo    = new finfo(FILEINFO_MIME_TYPE);
    $mime     = $finfo->file($file['tmp_name']) ?: '';
    $allowed  = $CONFIG['allowed_cv_types'] ?? [];
    if (!isset($allowed[$mime])) {
        json_error('CV must be a PDF or Word document.', 415);
    }
    $ext = $allowed[$mime];

    $dir = $CONFIG['upload_dir'] ?? (__DIR__ . '/../private/cvs');
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('[antra-apply] cannot create upload dir: ' . $dir);
        json_error('Server could not store the file. Please email your CV directly.', 500);
    }

    $origFilename = mb_substr(preg_replace('/[^\p{L}\p{N}\.\-_ ]/u', '', $file['name']) ?: 'cv', 0, 200);
    $safeName     = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
    $dest         = rtrim($dir, '/\\') . DIRECTORY_SEPARATOR . $safeName;

    if (!@move_uploaded_file($file['tmp_name'], $dest)) {
        error_log('[antra-apply] move_uploaded_file failed to: ' . $dest);
        json_error('Server could not store the file. Please email your CV directly.', 500);
    }
    $storedPath = $safeName; // store only the basename; dir comes from config
}

// ── Persist the application ──
$stmt = db()->prepare(
    'INSERT INTO applications
        (job_id, applicant_name, email, phone, cover_letter, cv_filename, cv_stored_path, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $jobId, $name, $email, ($phone ?: null), ($coverLetter ?: null),
    $origFilename, $storedPath, client_ip(),
]);

// ── Alert HR by email (best-effort; never block the applicant on mail issues) ──
$mailCfgPath = __DIR__ . '/../mail-config.php';
$mailCfg = file_exists($mailCfgPath) ? require $mailCfgPath : [];
$to      = $CONFIG['hr_alert_email'] ?: ($mailCfg['to_email'] ?? null);
if ($to && ($CONFIG['send_alerts'] ?? true)) {
    $esc  = static fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $subj = 'New Job Application — ' . $job['title'];
    $plain = "New application for: {$job['title']}\r\n\r\n"
        . "Name: $name\r\nEmail: $email\r\nPhone: " . ($phone ?: '—') . "\r\n"
        . "CV: " . ($origFilename ?: 'not attached') . "\r\n\r\n"
        . "Cover letter:\r\n" . ($coverLetter ?: '—') . "\r\n\r\n"
        . "View in the admin panel → Applications.";
    $html = '<div style="font-family:Arial,sans-serif;color:#0B2135;line-height:1.55">'
        . '<h2 style="color:#D97911">New Job Application</h2>'
        . '<p>New application for <strong>' . $esc($job['title']) . '</strong>:</p>'
        . '<table cellpadding="6" style="border-collapse:collapse">'
        . '<tr><td><strong>Name</strong></td><td>' . $esc($name) . '</td></tr>'
        . '<tr><td><strong>Email</strong></td><td>' . $esc($email) . '</td></tr>'
        . '<tr><td><strong>Phone</strong></td><td>' . $esc($phone ?: '—') . '</td></tr>'
        . '<tr><td><strong>CV</strong></td><td>' . $esc($origFilename ?: 'not attached') . '</td></tr>'
        . '</table>'
        . '<h3>Cover letter</h3><div style="white-space:pre-wrap">' . nl2br($esc($coverLetter ?: '—')) . '</div>'
        . '<p style="color:#888;font-size:12px;margin-top:20px">Full details and the CV are in the admin panel under Applications.</p>'
        . '</div>';
    $result = send_mail($to, ($mailCfg['to_name'] ?? 'Antra HR'), $subj, $html, $plain, $email, $name);
    if ($result !== true) {
        error_log('[antra-apply] alert email failed: ' . $result);
    }
}

json_ok(['message' => 'Application received.']);
