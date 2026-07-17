<?php
declare(strict_types=1);

// Survey results (auth required).
//   GET /api/admin/survey-results.php?id=5              → JSON: questions + aggregates + responses
//   GET /api/admin/survey-results.php?id=5&format=csv   → CSV download
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_role('admin', 'survey');
require_method('GET');

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) json_error('Missing survey id', 400);

$stmt = db()->prepare('SELECT id, title, slug FROM surveys WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$survey = $stmt->fetch();
if (!$survey) json_error('Survey not found', 404);

// Questions.
$qs = db()->prepare('SELECT id, type, title, config FROM survey_questions WHERE survey_id = ? ORDER BY sort_order ASC, id ASC');
$qs->execute([$id]);
$questions = array_map(function ($q) {
    $q['id'] = (int)$q['id'];
    $q['config'] = $q['config'] ? json_decode($q['config'], true) : [];
    return $q;
}, $qs->fetchAll());

// Responses + their answers.
$rs = db()->prepare('SELECT id, email, created_at FROM survey_responses WHERE survey_id = ? ORDER BY created_at ASC');
$rs->execute([$id]);
$responses = $rs->fetchAll();

$answersByResp = [];
if ($responses) {
    $ids = array_column($responses, 'id');
    $in  = implode(',', array_fill(0, count($ids), '?'));
    $as  = db()->prepare("SELECT response_id, question_id, answer FROM survey_answers WHERE response_id IN ($in)");
    $as->execute($ids);
    foreach ($as->fetchAll() as $a) {
        $answersByResp[(int)$a['response_id']][(int)$a['question_id']] = $a['answer'];
    }
}

/** Decode a stored answer into a human string. */
function answer_text($raw): string
{
    if ($raw === null) return '';
    $decoded = json_decode((string)$raw, true);
    if (is_array($decoded)) return implode(', ', array_map('strval', $decoded));
    return (string)$raw;
}

// ── CSV export ──
if (($_GET['format'] ?? '') === 'csv') {
    header_remove('Content-Type');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="survey-' . $survey['slug'] . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF"); // UTF-8 BOM for Excel

    $header = ['#', 'Submitted', 'Email'];
    foreach ($questions as $q) $header[] = $q['title'];
    fputcsv($out, $header);

    $n = 0;
    foreach ($responses as $r) {
        $row = [++$n, $r['created_at'], $r['email'] ?? ''];
        foreach ($questions as $q) {
            $row[] = answer_text($answersByResp[(int)$r['id']][$q['id']] ?? null);
        }
        fputcsv($out, $row);
    }
    fclose($out);
    exit;
}

// ── JSON: per-question aggregates + raw responses ──
$aggregates = [];
foreach ($questions as $q) {
    $qid = $q['id'];
    $isChoice = in_array($q['type'], ['multiple_choice','checkboxes','dropdown'], true);
    $counts = [];
    $values = [];
    foreach ($responses as $r) {
        $raw = $answersByResp[(int)$r['id']][$qid] ?? null;
        if ($raw === null) continue;
        if ($q['type'] === 'checkboxes') {
            $arr = json_decode((string)$raw, true);
            foreach ((is_array($arr) ? $arr : []) as $opt) $counts[(string)$opt] = ($counts[(string)$opt] ?? 0) + 1;
        } elseif ($isChoice) {
            $counts[(string)$raw] = ($counts[(string)$raw] ?? 0) + 1;
        } else {
            $values[] = answer_text($raw);
        }
    }
    $aggregates[] = [
        'question_id' => $qid,
        'type'        => $q['type'],
        'title'       => $q['title'],
        'is_choice'   => $isChoice,
        'counts'      => $counts,   // for choice types
        'values'      => $values,   // for text/number/etc.
    ];
}

$rawResponses = array_map(function ($r) use ($answersByResp, $questions) {
    $answers = [];
    foreach ($questions as $q) {
        $answers[$q['id']] = answer_text($answersByResp[(int)$r['id']][$q['id']] ?? null);
    }
    return ['id' => (int)$r['id'], 'email' => $r['email'], 'created_at' => $r['created_at'], 'answers' => $answers];
}, $responses);

json_ok([
    'survey'     => $survey,
    'questions'  => $questions,
    'total'      => count($responses),
    'aggregates' => $aggregates,
    'responses'  => $rawResponses,
]);
