<?php
declare(strict_types=1);

// ── Cron: close jobs whose application deadline has passed ──
// The public + admin job listings already auto-close on read, so this is a
// safety net for accuracy even when nobody visits. Schedule it once a day in
// cPanel → Cron Jobs, e.g. at 00:05:
//   /usr/local/bin/php /home/USERNAME/public_html/server/cron-close-jobs.php

$CONFIG = require __DIR__ . '/api/config.php';
require __DIR__ . '/api/_lib/db.php';
require __DIR__ . '/api/_lib/jobs-maintenance.php';

$closed = close_expired_jobs();
echo date('c') . " — closed {$closed} expired job(s)\n";
