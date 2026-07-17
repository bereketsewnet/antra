<?php
declare(strict_types=1);

// Shared slug helpers (used by the survey endpoints).

function make_slug(string $text): string
{
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-') ?: 'item';
}

/** Make a slug unique within $table (table name is a trusted literal). */
function unique_slug_in(string $table, string $base, int $excludeId = 0): string
{
    $slug = $base;
    $i = 2;
    while (true) {
        $stmt = db()->prepare("SELECT id FROM {$table} WHERE slug = ? AND id <> ? LIMIT 1");
        $stmt->execute([$slug, $excludeId]);
        if (!$stmt->fetch()) {
            return $slug;
        }
        $slug = $base . '-' . $i++;
    }
}
