<?php
declare(strict_types=1);

// ── Antra API — request / response helpers ──

/** Send a JSON success payload and stop. */
function json_ok(array $data = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode(['ok' => true] + $data);
    exit;
}

/** Send a JSON error and stop. */
function json_error(string $message, int $status = 400, array $extra = []): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message] + $extra);
    exit;
}

/** Enforce the allowed HTTP method(s). */
function require_method(string ...$methods): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $methods, true)) {
        json_error('Method not allowed', 405);
    }
}

/** Read + decode a JSON request body into an array. */
function read_json_body(): array
{
    $raw  = file_get_contents('php://input') ?: '';
    $body = json_decode($raw, true);
    if (is_array($body)) {
        return $body;
    }
    // Fall back to form-encoded bodies.
    return $_POST ?? [];
}

/** Trim a string field from an input array. */
function field(array $src, string $key, string $default = ''): string
{
    return trim((string)($src[$key] ?? $default));
}

/** Simple per-IP rate limit (file-based, matches mail.php's approach). */
function rate_limit(string $bucket, int $seconds): void
{
    $ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/antra_' . $bucket . '_' . md5($ip);
    if (file_exists($file) && (time() - filemtime($file)) < $seconds) {
        json_error('Too many requests — please wait a moment and try again.', 429);
    }
    @touch($file);
}

/** Client IP, best effort. */
function client_ip(): string
{
    return (string)($_SERVER['REMOTE_ADDR'] ?? '');
}
