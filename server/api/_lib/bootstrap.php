<?php
declare(strict_types=1);

// ── Antra API — shared bootstrap ──
// Every endpoint starts with: require __DIR__ . '/../_lib/bootstrap.php';
// (adjust the relative depth). Loads config, sets JSON + security headers,
// and starts the admin session.

// Fail loudly in logs, never leak details to the client.
error_reporting(E_ALL);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Load config (copied from config.example.php). Bail cleanly if missing.
$configPath = __DIR__ . '/../config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'API not configured']);
    exit;
}
/** @var array $CONFIG */
$CONFIG = require $configPath;

// Harden + start the session used for admin auth.
session_name($CONFIG['session_name'] ?? 'antra_admin_sess');
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'httponly' => true,
    'secure'   => (bool)($CONFIG['cookie_secure'] ?? true),
    'samesite' => 'Lax',
]);
session_start();

// Turn any uncaught error into a clean 500 JSON response.
set_exception_handler(function (Throwable $e): void {
    error_log('[antra-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
    }
    echo json_encode(['ok' => false, 'error' => 'Something went wrong. Please try again.']);
    exit;
});
