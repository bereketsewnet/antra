<?php
declare(strict_types=1);

// ── Antra API — MySQL (PDO) connection ──

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    /** @var array $CONFIG */
    global $CONFIG;

    $host    = $CONFIG['db_host']    ?? 'localhost';
    $name    = $CONFIG['db_name']    ?? '';
    $user    = $CONFIG['db_user']    ?? '';
    $pass    = $CONFIG['db_pass']    ?? '';
    $charset = $CONFIG['db_charset'] ?? 'utf8mb4';

    $dsn = "mysql:host={$host};dbname={$name};charset={$charset}";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}
