<?php
declare(strict_types=1);

// ── Tiny dependency-free .env loader ──
// Parses KEY=VALUE lines into $GLOBALS['__ENV']. Supports # comments, blank
// lines, and single/double quoted values. No putenv() (keeps values out of
// subprocess environments).

function load_env(string $path): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }
        $key = trim(substr($line, 0, $pos));
        $val = trim(substr($line, $pos + 1));

        // Strip one layer of matching surrounding quotes.
        $len = strlen($val);
        if ($len >= 2) {
            $first = $val[0];
            $last  = $val[$len - 1];
            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                $val = substr($val, 1, -1);
            }
        }
        if ($key !== '') {
            $GLOBALS['__ENV'][$key] = $val;
        }
    }
}

/** Read a loaded env value, or a default. */
function env(string $key, ?string $default = null): ?string
{
    return $GLOBALS['__ENV'][$key] ?? $default;
}
