<?php
declare(strict_types=1);

// Admin survey management (auth required).
//   GET    /api/admin/surveys.php           → list surveys (+ counts)
//   GET    /api/admin/surveys.php?id=5        → one survey WITH questions
//   POST   /api/admin/surveys.php             → create { title, description, settings, questions[] }
//   PATCH  /api/admin/surveys.php?id=5         → update meta/settings/status (+ questions if no responses yet)
//   DELETE /api/admin/surveys.php?id=5         → delete
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';
require __DIR__ . '/../_lib/slug.php';

$user   = require_role('admin', 'survey');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id     = (int)($_GET['id'] ?? 0);

const Q_TYPES = ['short_text','paragraph','multiple_choice','checkboxes','dropdown','linear_scale','rating','date','email','number'];
const SURVEY_STATUSES = ['draft','published','closed'];

/** Normalise + validate a question payload from the builder. */
function clean_question(array $q, int $order): array
{
    $type = (string)($q['type'] ?? 'short_text');
    if (!in_array($type, Q_TYPES, true)) $type = 'short_text';

    $config = [];
    if (in_array($type, ['multiple_choice','checkboxes','dropdown'], true)) {
        $opts = array_values(array_filter(array_map(
            fn($o) => trim((string)$o),
            is_array($q['config']['options'] ?? null) ? $q['config']['options'] : []
        ), fn($o) => $o !== ''));
        $config['options'] = $opts ?: ['Option 1'];
    } elseif ($type === 'linear_scale') {
        $config['min'] = (int)($q['config']['min'] ?? 1);
        $config['max'] = max($config['min'] + 1, (int)($q['config']['max'] ?? 5));
        $config['minLabel'] = trim((string)($q['config']['minLabel'] ?? ''));
        $config['maxLabel'] = trim((string)($q['config']['maxLabel'] ?? ''));
    } elseif ($type === 'rating') {
        $config['max'] = min(10, max(3, (int)($q['config']['max'] ?? 5)));
    }

    return [
        'sort_order'  => $order,
        'type'        => $type,
        'title'       => trim((string)($q['title'] ?? '')) ?: 'Untitled question',
        'help_text'   => trim((string)($q['help_text'] ?? '')) ?: null,
        'is_required' => !empty($q['is_required']) ? 1 : 0,
        'config'      => json_encode($config),
    ];
}

function insert_questions(int $surveyId, array $questions): void
{
    $stmt = db()->prepare(
        'INSERT INTO survey_questions (survey_id, sort_order, type, title, help_text, is_required, config)
         VALUES (:survey_id, :sort_order, :type, :title, :help_text, :is_required, :config)'
    );
    $order = 0;
    foreach ($questions as $q) {
        if (!is_array($q)) continue;
        $row = clean_question($q, $order++);
        $row['survey_id'] = $surveyId;
        $stmt->execute($row);
    }
}

function response_count(int $surveyId): int
{
    $stmt = db()->prepare('SELECT COUNT(*) FROM survey_responses WHERE survey_id = ?');
    $stmt->execute([$surveyId]);
    return (int)$stmt->fetchColumn();
}

// ── GET ──
if ($method === 'GET') {
    if ($id > 0) {
        $stmt = db()->prepare('SELECT * FROM surveys WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $survey = $stmt->fetch();
        if (!$survey) json_error('Survey not found', 404);

        $qs = db()->prepare('SELECT * FROM survey_questions WHERE survey_id = ? ORDER BY sort_order ASC, id ASC');
        $qs->execute([$id]);
        $questions = array_map(function ($q) {
            $q['is_required'] = (bool)$q['is_required'];
            $q['config'] = $q['config'] ? json_decode($q['config'], true) : new stdClass();
            return $q;
        }, $qs->fetchAll());

        $survey['settings'] = $survey['settings'] ? json_decode($survey['settings'], true) : new stdClass();
        $survey['response_count'] = response_count($id);
        json_ok(['survey' => $survey, 'questions' => $questions]);
    }

    $rows = db()->query(
        'SELECT s.id, s.slug, s.title, s.status, s.created_at,
                (SELECT COUNT(*) FROM survey_responses r WHERE r.survey_id = s.id) AS response_count,
                (SELECT COUNT(*) FROM survey_questions q WHERE q.survey_id = s.id) AS question_count
         FROM surveys s ORDER BY s.created_at DESC'
    )->fetchAll();
    json_ok(['surveys' => $rows]);
}

// ── POST (create) ──
if ($method === 'POST') {
    $body  = read_json_body();
    $title = field($body, 'title') ?: 'Untitled survey';
    $status = in_array(field($body, 'status'), SURVEY_STATUSES, true) ? field($body, 'status') : 'draft';
    $settings = is_array($body['settings'] ?? null) ? $body['settings'] : [];
    $questions = is_array($body['questions'] ?? null) ? $body['questions'] : [];

    $slug = unique_slug_in('surveys', make_slug($title));
    $stmt = db()->prepare(
        'INSERT INTO surveys (slug, title, description, status, settings, created_by, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $slug, $title, field($body, 'description') ?: null, $status,
        json_encode($settings), (int)$user['id'],
        $status === 'published' ? date('Y-m-d H:i:s') : null,
    ]);
    $newId = (int)db()->lastInsertId();
    insert_questions($newId, $questions);
    json_ok(['id' => $newId, 'slug' => $slug], 201);
}

// ── PATCH (update) ──
if ($method === 'PATCH' || $method === 'PUT') {
    if ($id <= 0) json_error('Missing survey id', 400);
    $stmt = db()->prepare('SELECT id, title, status, published_at FROM surveys WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    if (!$existing) json_error('Survey not found', 404);

    $body = read_json_body();
    $title = field($body, 'title') ?: $existing['title'];
    $status = in_array(field($body, 'status'), SURVEY_STATUSES, true) ? field($body, 'status') : $existing['status'];
    $settings = is_array($body['settings'] ?? null) ? $body['settings'] : [];

    $publishedAt = $existing['published_at'];
    if ($status === 'published' && empty($publishedAt)) $publishedAt = date('Y-m-d H:i:s');

    db()->prepare(
        'UPDATE surveys SET title = ?, description = ?, status = ?, settings = ?, published_at = ? WHERE id = ?'
    )->execute([
        $title, field($body, 'description') ?: null, $status,
        json_encode($settings), $publishedAt, $id,
    ]);

    // Only replace questions when none of the responses would be orphaned.
    if (array_key_exists('questions', $body) && is_array($body['questions'])) {
        if (response_count($id) > 0) {
            json_error('This survey already has responses, so its questions are locked. You can still edit the title, description, settings and status.', 409);
        }
        db()->prepare('DELETE FROM survey_questions WHERE survey_id = ?')->execute([$id]);
        insert_questions($id, $body['questions']);
    }

    json_ok(['id' => $id]);
}

// ── DELETE ──
if ($method === 'DELETE') {
    if ($id <= 0) json_error('Missing survey id', 400);
    db()->prepare('DELETE FROM surveys WHERE id = ?')->execute([$id]);
    json_ok();
}

json_error('Method not allowed', 405);
