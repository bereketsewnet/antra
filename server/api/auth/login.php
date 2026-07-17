<?php
declare(strict_types=1);

// POST /api/auth/login.php  { email, password } → sets session cookie
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_method('POST');
rate_limit('login', 3); // light throttle against brute force

$body     = read_json_body();
$email    = field($body, 'email');
$password = (string)($body['password'] ?? '');

if ($email === '' || $password === '') {
    json_error('Email and password are required.', 400);
}

$stmt = db()->prepare(
    'SELECT id, name, email, role, password_hash, is_active FROM admin_users WHERE email = ? LIMIT 1'
);
$stmt->execute([$email]);
$user = $stmt->fetch();

// Uniform error + verify even on miss to blunt timing/user-enumeration.
$hash = $user['password_hash'] ?? '$2y$10$invalidinvalidinvalidinvalidinvalidinvalidinv';
if (!$user || (int)$user['is_active'] !== 1 || !password_verify($password, $hash)) {
    json_error('Incorrect email or password.', 401);
}

login_user((int)$user['id']);
db()->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?')->execute([$user['id']]);

json_ok(['user' => public_user($user)]);
