<?php
declare(strict_types=1);

// Current user's own profile (any signed-in admin/hr).
//   GET   /api/admin/profile.php
//   PATCH /api/admin/profile.php  { name?, email?, current_password?, new_password? }
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

$me     = require_auth();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    json_ok(['user' => public_user($me)]);
}

if ($method === 'PATCH' || $method === 'PUT') {
    $body = read_json_body();
    $sets = [];
    $args = [];

    if (array_key_exists('name', $body)) {
        $name = field($body, 'name');
        if ($name === '') json_error('Name cannot be empty.', 422, ['fields' => ['name' => 'Required']]);
        $sets[] = 'name = ?'; $args[] = $name;
    }
    if (array_key_exists('email', $body)) {
        $email = field($body, 'email');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('Invalid email.', 422, ['fields' => ['email' => 'Invalid']]);
        $sets[] = 'email = ?'; $args[] = $email;
    }

    // Password change requires the current password.
    if (!empty($body['new_password'])) {
        $current = (string)($body['current_password'] ?? '');
        $stmt = db()->prepare('SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1');
        $stmt->execute([$me['id']]);
        $hash = (string)$stmt->fetchColumn();
        if (!password_verify($current, $hash)) {
            json_error('Your current password is incorrect.', 422, ['fields' => ['current_password' => 'Incorrect']]);
        }
        if (strlen((string)$body['new_password']) < 8) {
            json_error('New password must be at least 8 characters.', 422, ['fields' => ['new_password' => 'Too short']]);
        }
        $sets[] = 'password_hash = ?'; $args[] = hash_password((string)$body['new_password']);
    }

    if (!$sets) json_ok(['ok' => true]);

    try {
        $args[] = $me['id'];
        db()->prepare('UPDATE admin_users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($args);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') json_error('That email is already in use.', 409, ['fields' => ['email' => 'Already used']]);
        throw $e;
    }
    json_ok();
}

json_error('Method not allowed', 405);
