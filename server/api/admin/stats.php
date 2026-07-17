<?php
declare(strict_types=1);

// Rich dashboard data (auth required).
//   GET /api/admin/stats.php
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_auth();
require_method('GET');

$one = fn(string $sql): int => (int) db()->query($sql)->fetchColumn();

// ── Headline counters ──
$counters = [
    'jobs_total'       => $one('SELECT COUNT(*) FROM jobs'),
    'jobs_open'        => $one("SELECT COUNT(*) FROM jobs WHERE status = 'open'"),
    'jobs_draft'       => $one("SELECT COUNT(*) FROM jobs WHERE status = 'draft'"),
    'jobs_closed'      => $one("SELECT COUNT(*) FROM jobs WHERE status = 'closed'"),
    'applications'     => $one('SELECT COUNT(*) FROM applications'),
    'applications_new' => $one("SELECT COUNT(*) FROM applications WHERE status = 'new'"),
    'applications_7d'  => $one('SELECT COUNT(*) FROM applications WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'),
    'hired'            => $one("SELECT COUNT(*) FROM applications WHERE status = 'hired'"),
    'surveys'          => $one('SELECT COUNT(*) FROM surveys'),
    'surveys_published'=> $one("SELECT COUNT(*) FROM surveys WHERE status = 'published'"),
    'survey_responses' => $one('SELECT COUNT(*) FROM survey_responses'),
];

// ── Applications grouped by status ──
$appsByStatus = [];
foreach (db()->query('SELECT status, COUNT(*) c FROM applications GROUP BY status')->fetchAll() as $r) {
    $appsByStatus[$r['status']] = (int)$r['c'];
}
foreach (['new','reviewing','shortlisted','rejected','hired'] as $st) {
    $appsByStatus[$st] = $appsByStatus[$st] ?? 0;
}

// ── Jobs grouped by status ──
$jobsByStatus = [];
foreach (db()->query('SELECT status, COUNT(*) c FROM jobs GROUP BY status')->fetchAll() as $r) {
    $jobsByStatus[$r['status']] = (int)$r['c'];
}
foreach (['draft','open','closed'] as $st) {
    $jobsByStatus[$st] = $jobsByStatus[$st] ?? 0;
}

// ── Applications over the last 14 days (fill gaps with 0) ──
$rows = [];
foreach (db()->query(
    "SELECT DATE(created_at) d, COUNT(*) c FROM applications
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
     GROUP BY DATE(created_at)"
)->fetchAll() as $r) {
    $rows[$r['d']] = (int)$r['c'];
}
$overTime = [];
$today = new DateTimeImmutable('today');
for ($i = 13; $i >= 0; $i--) {
    $day = $today->sub(new DateInterval("P{$i}D"))->format('Y-m-d');
    $overTime[] = ['date' => $day, 'count' => $rows[$day] ?? 0];
}

// ── Top jobs by application count ──
$topJobs = db()->query(
    'SELECT j.title, COUNT(a.id) c FROM jobs j
     LEFT JOIN applications a ON a.job_id = j.id
     GROUP BY j.id HAVING c > 0 ORDER BY c DESC LIMIT 5'
)->fetchAll(PDO::FETCH_ASSOC);
$topJobs = array_map(fn($r) => ['title' => $r['title'], 'count' => (int)$r['c']], $topJobs);

// ── Recent applications ──
$recent = db()->query(
    'SELECT a.id, a.applicant_name, a.status, a.created_at, j.title AS job_title
     FROM applications a JOIN jobs j ON j.id = a.job_id
     ORDER BY a.created_at DESC LIMIT 6'
)->fetchAll(PDO::FETCH_ASSOC);

// ── Survey response counts ──
$surveySummary = db()->query(
    "SELECT s.title, s.status, (SELECT COUNT(*) FROM survey_responses r WHERE r.survey_id = s.id) c
     FROM surveys s ORDER BY c DESC LIMIT 6"
)->fetchAll(PDO::FETCH_ASSOC);
$surveySummary = array_map(fn($r) => ['title' => $r['title'], 'status' => $r['status'], 'count' => (int)$r['c']], $surveySummary);

json_ok([
    'counters'          => $counters,
    'apps_by_status'    => $appsByStatus,
    'jobs_by_status'    => $jobsByStatus,
    'apps_over_time'    => $overTime,
    'top_jobs'          => $topJobs,
    'recent'            => $recent,
    'survey_summary'    => $surveySummary,
]);
