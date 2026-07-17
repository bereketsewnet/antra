<?php
declare(strict_types=1);

// Public jobs endpoint.
//   GET /api/jobs.php            → list of currently open jobs
//   GET /api/jobs.php?slug=xyz   → single open job (full detail)
require __DIR__ . '/_lib/bootstrap.php';
require __DIR__ . '/_lib/http.php';
require __DIR__ . '/_lib/db.php';
require __DIR__ . '/_lib/jobs-maintenance.php';

require_method('GET');

// Flip any past-deadline jobs to closed before we read.
close_expired_jobs();

$slug = field($_GET, 'slug');

if ($slug !== '') {
    $stmt = db()->prepare(
        "SELECT id, slug, title, department, location, employment_type,
                summary, description, requirements, salary_range,
                posted_at, closes_at
         FROM jobs
         WHERE slug = ? AND status = 'open'
         LIMIT 1"
    );
    $stmt->execute([$slug]);
    $job = $stmt->fetch();
    if (!$job) {
        json_error('Job not found or no longer open.', 404);
    }
    // Hide expired postings.
    if (!empty($job['closes_at']) && $job['closes_at'] < date('Y-m-d')) {
        json_error('This posting has closed.', 410);
    }
    json_ok(['job' => $job]);
}

// List — newest first, exclude expired.
$stmt = db()->query(
    "SELECT id, slug, title, department, location, employment_type, summary,
            posted_at, closes_at
     FROM jobs
     WHERE status = 'open'
       AND (closes_at IS NULL OR closes_at >= CURDATE())
     ORDER BY posted_at DESC, id DESC"
);
$jobs = $stmt->fetchAll();

json_ok(['jobs' => $jobs]);
