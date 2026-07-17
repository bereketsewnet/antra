<?php
declare(strict_types=1);

// Admin jobs management (auth required).
//   GET    /api/admin/jobs.php          → list all jobs (any status)
//   GET    /api/admin/jobs.php?id=5      → single job
//   POST   /api/admin/jobs.php           → create   { title, ... }
//   PATCH  /api/admin/jobs.php?id=5       → update   { ...fields }
//   DELETE /api/admin/jobs.php?id=5       → delete
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';
require __DIR__ . '/../_lib/jobs-maintenance.php';

$user   = require_role('admin', 'hr');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id     = (int)($_GET['id'] ?? 0);

const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'contract', 'internship', 'temporary'];
const JOB_STATUSES     = ['draft', 'open', 'closed'];

/** Turn a title into a URL slug. */
function slugify(string $text): string
{
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-') ?: 'job';
}

/** Make a slug unique in the jobs table (optionally excluding one id). */
function unique_slug(string $base, int $excludeId = 0): string
{
    $slug = $base;
    $i = 2;
    while (true) {
        $stmt = db()->prepare('SELECT id FROM jobs WHERE slug = ? AND id <> ? LIMIT 1');
        $stmt->execute([$slug, $excludeId]);
        if (!$stmt->fetch()) {
            return $slug;
        }
        $slug = $base . '-' . $i++;
    }
}

if ($method === 'GET') {
    close_expired_jobs(); // keep statuses accurate whenever the admin views jobs
    if ($id > 0) {
        $stmt = db()->prepare('SELECT * FROM jobs WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $job = $stmt->fetch();
        if (!$job) json_error('Job not found', 404);
        json_ok(['job' => $job]);
    }
    $rows = db()->query(
        'SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS application_count
         FROM jobs j ORDER BY j.created_at DESC'
    )->fetchAll();
    json_ok(['jobs' => $rows]);
}

if ($method === 'POST' || $method === 'PATCH' || $method === 'PUT') {
    $body = read_json_body();

    $title = field($body, 'title');
    if ($method === 'POST' && $title === '') {
        json_error('A job title is required.', 422, ['fields' => ['title' => 'Required']]);
    }

    $employmentType = field($body, 'employment_type', 'full_time');
    if (!in_array($employmentType, EMPLOYMENT_TYPES, true)) $employmentType = 'full_time';

    $status = field($body, 'status', 'draft');
    if (!in_array($status, JOB_STATUSES, true)) $status = 'draft';

    $closesAt = field($body, 'closes_at');
    $closesAt = ($closesAt !== '' && preg_match('/^\d{4}-\d{2}-\d{2}$/', $closesAt)) ? $closesAt : null;

    $data = [
        'title'           => $title,
        'department'      => field($body, 'department') ?: null,
        'location'        => field($body, 'location') ?: null,
        'employment_type' => $employmentType,
        'summary'         => field($body, 'summary') ?: null,
        'thumbnail'       => field($body, 'thumbnail') ?: null,
        'description'     => trim((string)($body['description'] ?? '')) ?: null,
        'requirements'    => trim((string)($body['requirements'] ?? '')) ?: null,
        'salary_range'    => field($body, 'salary_range') ?: null,
        'status'          => $status,
        'closes_at'       => $closesAt,
    ];

    if ($method === 'POST') {
        $data['slug']       = unique_slug(slugify($title));
        $data['created_by'] = (int)$user['id'];
        $data['posted_at']  = $status === 'open' ? date('Y-m-d H:i:s') : null;

        $cols = array_keys($data);
        $place = implode(', ', array_map(fn($c) => ':' . $c, $cols));
        $stmt = db()->prepare('INSERT INTO jobs (' . implode(', ', $cols) . ') VALUES (' . $place . ')');
        $stmt->execute($data);
        json_ok(['id' => (int)db()->lastInsertId()], 201);
    }

    // PATCH / PUT — update existing.
    if ($id <= 0) json_error('Missing job id', 400);
    $stmt = db()->prepare('SELECT status, posted_at FROM jobs WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) json_error('Job not found', 404);

    if ($title !== '') {
        $data['slug'] = unique_slug(slugify($title), $id);
    } else {
        unset($data['title']); // don't blank the title on partial update
    }

    // First time it goes open, stamp posted_at.
    if ($status === 'open' && empty($existing['posted_at'])) {
        $data['posted_at'] = date('Y-m-d H:i:s');
    }

    $set = implode(', ', array_map(fn($c) => "$c = :$c", array_keys($data)));
    $data['id'] = $id;
    db()->prepare("UPDATE jobs SET $set WHERE id = :id")->execute($data);
    json_ok(['id' => $id]);
}

if ($method === 'DELETE') {
    if ($id <= 0) json_error('Missing job id', 400);
    db()->prepare('DELETE FROM jobs WHERE id = ?')->execute([$id]);
    json_ok();
}

json_error('Method not allowed', 405);
