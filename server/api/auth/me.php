<?php
declare(strict_types=1);

// GET /api/auth/me.php → current admin user (or 401). Used by the admin
// panel on load to check whether a session already exists.
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_method('GET');
$user = require_auth();
json_ok(['user' => public_user($user)]);
