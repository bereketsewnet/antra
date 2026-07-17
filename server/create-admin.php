<?php
declare(strict_types=1);

// ── One-time bootstrap: create the first admin user ──
//
// Run this ONCE from the cPanel Terminal (or Cron "run once"):
//   php create-admin.php "Full Name" "email@antragroup.et" "StrongPassword123" admin
//
// Role defaults to 'admin' if omitted. After you have your first admin, you
// can create the rest from inside the admin panel — then DELETE this file
// from the server so it can never be run again.

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("This script can only be run from the command line.\n");
}

$CONFIG = require __DIR__ . '/api/config.php';
require __DIR__ . '/api/_lib/db.php';
require __DIR__ . '/api/_lib/auth.php';

$name  = $argv[1] ?? '';
$email = $argv[2] ?? '';
$pass  = $argv[3] ?? '';
$role  = $argv[4] ?? 'admin';

if ($name === '' || $email === '' || $pass === '') {
    fwrite(STDERR, "Usage: php create-admin.php \"Name\" \"email\" \"password\" [admin|hr]\n");
    exit(1);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Invalid email address.\n");
    exit(1);
}
if (strlen($pass) < 8) {
    fwrite(STDERR, "Password must be at least 8 characters.\n");
    exit(1);
}
if (!in_array($role, ['admin', 'hr'], true)) {
    fwrite(STDERR, "Role must be 'admin' or 'hr'.\n");
    exit(1);
}

$stmt = db()->prepare(
    'INSERT INTO admin_users (name, email, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, 1)'
);

try {
    $stmt->execute([$name, $email, hash_password($pass), $role]);
    echo "Created {$role} user: {$email}\n";
    echo "You can now log in at /admin. Remember to DELETE this file from the server.\n";
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        fwrite(STDERR, "A user with that email already exists.\n");
    } else {
        fwrite(STDERR, "Error: " . $e->getMessage() . "\n");
    }
    exit(1);
}
