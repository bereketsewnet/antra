<?php
declare(strict_types=1);

// Public survey endpoint.
//   GET /api/survey.php            → list published surveys (for the site card)
//   GET /api/survey.php?slug=xyz   → one published survey WITH questions (to fill)
require __DIR__ . '/_lib/bootstrap.php';
require __DIR__ . '/_lib/http.php';
require __DIR__ . '/_lib/db.php';

require_method('GET');

$slug = field($_GET, 'slug');

if ($slug === '') {
    $rows = db()->query(
        "SELECT id, slug, title, description
         FROM surveys WHERE status = 'published' ORDER BY published_at DESC, id DESC"
    )->fetchAll();
    json_ok(['surveys' => $rows]);
}

$stmt = db()->prepare("SELECT * FROM surveys WHERE slug = ? AND status = 'published' LIMIT 1");
$stmt->execute([$slug]);
$survey = $stmt->fetch();
if (!$survey) {
    json_error('This survey is not available.', 404);
}

$settings = $survey['settings'] ? json_decode($survey['settings'], true) : [];

// Response limit reached?
$limit = (int)($settings['response_limit'] ?? 0);
if ($limit > 0) {
    $count = db()->prepare('SELECT COUNT(*) FROM survey_responses WHERE survey_id = ?');
    $count->execute([$survey['id']]);
    if ((int)$count->fetchColumn() >= $limit) {
        json_ok(['closed' => true, 'title' => $survey['title'], 'message' => 'This survey is no longer accepting responses.']);
    }
}

$qs = db()->prepare('SELECT id, type, title, help_text, is_required, config FROM survey_questions WHERE survey_id = ? ORDER BY sort_order ASC, id ASC');
$qs->execute([$survey['id']]);
$questions = array_map(function ($q) {
    return [
        'id'          => (int)$q['id'],
        'type'        => $q['type'],
        'title'       => $q['title'],
        'help_text'   => $q['help_text'],
        'is_required' => (bool)$q['is_required'],
        'config'      => $q['config'] ? json_decode($q['config'], true) : new stdClass(),
    ];
}, $qs->fetchAll());

json_ok([
    'survey' => [
        'id'          => (int)$survey['id'],
        'slug'        => $survey['slug'],
        'title'       => $survey['title'],
        'description' => $survey['description'],
        'settings'    => [
            'collect_email'        => !empty($settings['collect_email']),
            'show_progress'        => !empty($settings['show_progress']),
            'confirmation_message' => (string)($settings['confirmation_message'] ?? ''),
        ],
    ],
    'questions' => $questions,
])
;
