<?php
declare(strict_types=1);

// Public survey submission.
//   POST /api/survey-submit.php  { survey_id, email?, answers: { "<qid>": value, ... } }
require __DIR__ . '/_lib/bootstrap.php';
require __DIR__ . '/_lib/http.php';
require __DIR__ . '/_lib/db.php';

require_method('POST');
rate_limit('survey', 5);

$body     = read_json_body();
$surveyId = (int)($body['survey_id'] ?? 0);
$email    = trim((string)($body['email'] ?? ''));
$answers  = is_array($body['answers'] ?? null) ? $body['answers'] : [];

$stmt = db()->prepare("SELECT id, settings FROM surveys WHERE id = ? AND status = 'published' LIMIT 1");
$stmt->execute([$surveyId]);
$survey = $stmt->fetch();
if (!$survey) {
    json_error('This survey is not available.', 410);
}
$settings = $survey['settings'] ? json_decode($survey['settings'], true) : [];

// Response limit.
$limit = (int)($settings['response_limit'] ?? 0);
if ($limit > 0) {
    $c = db()->prepare('SELECT COUNT(*) FROM survey_responses WHERE survey_id = ?');
    $c->execute([$surveyId]);
    if ((int)$c->fetchColumn() >= $limit) {
        json_error('This survey is no longer accepting responses.', 410);
    }
}

// Email required?
if (!empty($settings['collect_email'])) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_error('Please enter a valid email address.', 422, ['fields' => ['email' => 'Required']]);
    }
}

// Load questions to validate required + shape answers.
$qs = db()->prepare('SELECT id, type, is_required FROM survey_questions WHERE survey_id = ?');
$qs->execute([$surveyId]);
$questions = $qs->fetchAll();

$errors = [];
$toStore = [];
foreach ($questions as $q) {
    $qid = (int)$q['id'];
    $raw = $answers[$qid] ?? ($answers[(string)$qid] ?? null);

    $isEmpty = $raw === null || $raw === '' || (is_array($raw) && count($raw) === 0);
    if ($q['is_required'] && $isEmpty) {
        $errors[(string)$qid] = 'This question is required.';
        continue;
    }
    if ($isEmpty) continue;

    // Checkboxes store a JSON array; everything else stores a string.
    if ($q['type'] === 'checkboxes') {
        $arr = is_array($raw) ? array_values(array_map('strval', $raw)) : [(string)$raw];
        $value = json_encode($arr);
    } else {
        $value = is_array($raw) ? json_encode($raw) : (string)$raw;
    }
    $toStore[] = ['question_id' => $qid, 'answer' => $value];
}

if ($errors) {
    json_error('Please answer the required questions.', 422, ['fields' => $errors]);
}

// Persist.
db()->beginTransaction();
try {
    $ins = db()->prepare('INSERT INTO survey_responses (survey_id, email, ip) VALUES (?, ?, ?)');
    $ins->execute([$surveyId, ($email !== '' ? $email : null), client_ip()]);
    $responseId = (int)db()->lastInsertId();

    $ans = db()->prepare('INSERT INTO survey_answers (response_id, question_id, answer) VALUES (?, ?, ?)');
    foreach ($toStore as $a) {
        $ans->execute([$responseId, $a['question_id'], $a['answer']]);
    }
    db()->commit();
} catch (Throwable $e) {
    db()->rollBack();
    error_log('[antra-survey] submit failed: ' . $e->getMessage());
    json_error('Your response could not be saved. Please try again.', 500);
}

$msg = trim((string)($settings['confirmation_message'] ?? '')) ?: 'Thank you — your response has been recorded.';
json_ok(['message' => $msg]);
