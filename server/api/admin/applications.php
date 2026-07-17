<?php
declare(strict_types=1);

// Admin applications (auth required).
//   GET   /api/admin/applications.php               → list all
//   GET   /api/admin/applications.php?job_id=5       → list for one job
//   GET   /api/admin/applications.php?id=9           → single application
//   PATCH /api/admin/applications.php?id=9  { status } → update status
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';
require __DIR__ . '/../_lib/mailer.php';
require __DIR__ . '/../_lib/status-emails.php';

require_role('admin', 'hr');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id     = (int)($_GET['id'] ?? 0);
$jobId  = (int)($_GET['job_id'] ?? 0);

const APP_STATUSES = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];

if ($method === 'GET') {
    if ($id > 0) {
        $stmt = db()->prepare(
            'SELECT a.*, j.title AS job_title, j.slug AS job_slug
             FROM applications a JOIN jobs j ON j.id = a.job_id
             WHERE a.id = ? LIMIT 1'
        );
        $stmt->execute([$id]);
        $app = $stmt->fetch();
        if (!$app) json_error('Application not found', 404);
        $app['has_cv'] = !empty($app['cv_stored_path']);
        unset($app['cv_stored_path']); // never expose the disk path
        json_ok(['application' => $app]);
    }

    if ($jobId > 0) {
        $stmt = db()->prepare(
            'SELECT a.id, a.job_id, a.applicant_name, a.email, a.phone, a.status,
                    a.cv_filename, a.created_at, j.title AS job_title
             FROM applications a JOIN jobs j ON j.id = a.job_id
             WHERE a.job_id = ? ORDER BY a.created_at DESC'
        );
        $stmt->execute([$jobId]);
    } else {
        $stmt = db()->query(
            'SELECT a.id, a.job_id, a.applicant_name, a.email, a.phone, a.status,
                    a.cv_filename, a.created_at, j.title AS job_title
             FROM applications a JOIN jobs j ON j.id = a.job_id
             ORDER BY a.created_at DESC'
        );
    }
    json_ok(['applications' => $stmt->fetchAll()]);
}

if ($method === 'PATCH' || $method === 'PUT') {
    if ($id <= 0) json_error('Missing application id', 400);
    $body   = read_json_body();
    $status = field($body, 'status');
    $note   = trim((string)($body['note'] ?? ''));
    $notify = (bool)($body['notify'] ?? false);
    if (!in_array($status, APP_STATUSES, true)) {
        json_error('Invalid status', 422);
    }

    // Fetch the applicant + job title (for the email + response).
    $stmt = db()->prepare(
        'SELECT a.applicant_name, a.email, j.title AS job_title
         FROM applications a JOIN jobs j ON j.id = a.job_id
         WHERE a.id = ? LIMIT 1'
    );
    $stmt->execute([$id]);
    $app = $stmt->fetch();
    if (!$app) json_error('Application not found', 404);

    db()->prepare(
        'UPDATE applications SET status = ?, status_note = ?, status_updated_at = NOW() WHERE id = ?'
    )->execute([$status, ($note !== '' ? $note : null), $id]);

    // Email the applicant a professional status update, if requested + possible.
    $emailed = false;
    $emailError = null;
    if ($notify && filter_var($app['email'], FILTER_VALIDATE_EMAIL)) {
        $tpl    = application_status_email($status, (string)$app['applicant_name'], (string)$app['job_title'], $note);
        $result = send_mail((string)$app['email'], (string)$app['applicant_name'], $tpl['subject'], $tpl['html'], $tpl['plain']);
        if ($result === true) {
            $emailed = true;
        } else {
            $emailError = 'Status saved, but the email could not be sent.';
            error_log('[antra-status-email] ' . $result);
        }
    }

    json_ok(['id' => $id, 'status' => $status, 'emailed' => $emailed, 'email_error' => $emailError]);
}

json_error('Method not allowed', 405);
