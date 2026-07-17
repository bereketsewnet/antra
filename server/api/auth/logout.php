<?php
declare(strict_types=1);

// POST /api/auth/logout.php → clears session
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_method('POST');
logout_user();
json_ok();
