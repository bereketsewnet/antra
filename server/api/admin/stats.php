<?php
declare(strict_types=1);

// Dashboard counts (auth required).
//   GET /api/admin/stats.php
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_auth();
require_method('GET');

$one = fn(string $sql): int => (int) db()->query($sql)->fetchColumn();

json_ok(['stats' => [
    'jobs_total'      => $one('SELECT COUNT(*) FROM jobs'),
    'jobs_open'       => $one("SELECT COUNT(*) FROM jobs WHERE status = 'open'"),
    'jobs_draft'      => $one("SELECT COUNT(*) FROM jobs WHERE status = 'draft'"),
    'applications'    => $one('SELECT COUNT(*) FROM applications'),
    'applications_new'=> $one("SELECT COUNT(*) FROM applications WHERE status = 'new'"),
    'surveys'         => $one('SELECT COUNT(*) FROM surveys'),
]]);
