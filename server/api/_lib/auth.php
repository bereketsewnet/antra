<?php
declare(strict_types=1);

// ── Antra API — admin authentication + roles ──
// Depends on: bootstrap.php (session), db.php, http.php.

/** The logged-in admin user row, or null. */
function current_user(): ?array
{
    if (empty($_SESSION['uid'])) {
        return null;
    }
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    $stmt = db()->prepare(
        'SELECT id, name, email, role, is_active FROM admin_users WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$_SESSION['uid']]);
    $user = $stmt->fetch();
    if (!$user || (int)$user['is_active'] !== 1) {
        return null;
    }
    return $cached = $user;
}

/** Require a logged-in admin; 401 otherwise. Returns the user row. */
function require_auth(): array
{
    $user = current_user();
    if (!$user) {
        json_error('Not signed in', 401);
    }
    return $user;
}

/** Require one of the given roles; 403 otherwise. Returns the user row. */
function require_role(string ...$roles): array
{
    $user = require_auth();
    if (!in_array($user['role'], $roles, true)) {
        json_error('You do not have permission to do that', 403);
    }
    return $user;
}

/** Establish a session for a user id (regenerates id to prevent fixation). */
function login_user(int $userId): void
{
    session_regenerate_id(true);
    $_SESSION['uid'] = $userId;
}

/** Destroy the current admin session. */
function logout_user(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

/** Hash a plaintext password for storage. */
function hash_password(string $plain): string
{
    return password_hash($plain, PASSWORD_DEFAULT);
}

/** Public-safe view of a user row (no password hash). */
function public_user(array $u): array
{
    return [
        'id'    => (int)$u['id'],
        'name'  => $u['name'],
        'email' => $u['email'],
        'role'  => $u['role'],
    ];
}
