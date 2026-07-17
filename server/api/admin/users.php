<?php
declare(strict_types=1);

// Admin staff management — ADMIN ROLE ONLY.
//   GET    /api/admin/users.php          → list staff
//   POST   /api/admin/users.php           → create { name, email, password, role }
//   PATCH  /api/admin/users.php?id=5       → update { name?, email?, role?, is_active?, password? }
//   DELETE /api/admin/users.php?id=5       → delete
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

$me     = require_role('admin');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id     = (int)($_GET['id'] ?? 0);

function active_admin_count(): int
{
    return (int) db()->query("SELECT COUNT(*) FROM admin_users WHERE role='admin' AND is_active=1")->fetchColumn();
}

if ($method === 'GET') {
    $rows = db()->query(
        'SELECT id, name, email, role, is_active, last_login_at, created_at FROM admin_users ORDER BY created_at ASC'
    )->fetchAll();
    json_ok(['users' => $rows]);
}

if ($method === 'POST') {
    $body  = read_json_body();
    $name  = field($body, 'name');
    $email = field($body, 'email');
    $pass  = (string)($body['password'] ?? '');
    $role  = in_array(field($body, 'role'), ['admin', 'hr', 'survey'], true) ? field($body, 'role') : 'hr';

    if ($name === '')                              json_error('Name is required.', 422, ['fields' => ['name' => 'Required']]);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('A valid email is required.', 422, ['fields' => ['email' => 'Invalid email']]);
    if (strlen($pass) < 8)                          json_error('Password must be at least 8 characters.', 422, ['fields' => ['password' => 'Too short']]);

    try {
        $stmt = db()->prepare('INSERT INTO admin_users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)');
        $stmt->execute([$name, $email, hash_password($pass), $role]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') json_error('A user with that email already exists.', 409, ['fields' => ['email' => 'Already used']]);
        throw $e;
    }
    json_ok(['id' => (int)db()->lastInsertId()], 201);
}

if ($method === 'PATCH' || $method === 'PUT') {
    if ($id <= 0) json_error('Missing user id', 400);
    $stmt = db()->prepare('SELECT id, role, is_active FROM admin_users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $target = $stmt->fetch();
    if (!$target) json_error('User not found', 404);

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
    if (array_key_exists('role', $body)) {
        $role = in_array(field($body, 'role'), ['admin', 'hr', 'survey'], true) ? field($body, 'role') : $target['role'];
        // Don't allow demoting the last active admin.
        if ($target['role'] === 'admin' && $role !== 'admin' && active_admin_count() <= 1) {
            json_error('You cannot demote the last remaining admin.', 409);
        }
        $sets[] = 'role = ?'; $args[] = $role;
    }
    if (array_key_exists('is_active', $body)) {
        $active = !empty($body['is_active']) ? 1 : 0;
        if ($target['role'] === 'admin' && $active === 0 && active_admin_count() <= 1) {
            json_error('You cannot deactivate the last remaining admin.', 409);
        }
        if ((int)$target['id'] === (int)$me['id'] && $active === 0) {
            json_error('You cannot deactivate your own account.', 409);
        }
        $sets[] = 'is_active = ?'; $args[] = $active;
    }
    if (!empty($body['password'])) {
        if (strlen((string)$body['password']) < 8) json_error('Password must be at least 8 characters.', 422, ['fields' => ['password' => 'Too short']]);
        $sets[] = 'password_hash = ?'; $args[] = hash_password((string)$body['password']);
    }

    if (!$sets) json_ok(['id' => $id]);

    try {
        $args[] = $id;
        db()->prepare('UPDATE admin_users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($args);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') json_error('That email is already used by another account.', 409, ['fields' => ['email' => 'Already used']]);
        throw $e;
    }
    json_ok(['id' => $id]);
}

if ($method === 'DELETE') {
    if ($id <= 0) json_error('Missing user id', 400);
    if ($id === (int)$me['id']) json_error('You cannot delete your own account.', 409);

    $stmt = db()->prepare('SELECT role, is_active FROM admin_users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $target = $stmt->fetch();
    if (!$target) json_error('User not found', 404);
    if ($target['role'] === 'admin' && (int)$target['is_active'] === 1 && active_admin_count() <= 1) {
        json_error('You cannot delete the last remaining admin.', 409);
    }
    db()->prepare('DELETE FROM admin_users WHERE id = ?')->execute([$id]);
    json_ok();
}

json_error('Method not allowed', 405);
