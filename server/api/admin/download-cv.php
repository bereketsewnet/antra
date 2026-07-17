<?php
declare(strict_types=1);

// Authenticated CV download — streams a stored CV file to a signed-in admin.
//   GET /api/admin/download-cv.php?id=9            → download (attachment)
//   GET /api/admin/download-cv.php?id=9&inline=1   → view in browser (inline)
// The CV lives outside the web root; this is the ONLY way to retrieve it.
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_role('admin', 'hr');
require_method('GET');

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) json_error('Missing application id', 400);

$stmt = db()->prepare('SELECT cv_filename, cv_stored_path FROM applications WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$app = $stmt->fetch();
if (!$app || empty($app['cv_stored_path'])) {
    json_error('No CV on file for this application.', 404);
}

$dir  = $CONFIG['upload_dir'] ?? (__DIR__ . '/../../private/cvs');
$path = rtrim($dir, '/\\') . DIRECTORY_SEPARATOR . basename((string)$app['cv_stored_path']);

if (!is_file($path)) {
    json_error('The stored file could not be found.', 404);
}

$download = $app['cv_filename'] ?: ('cv-' . $id);
$mime     = (new finfo(FILEINFO_MIME_TYPE))->file($path) ?: 'application/octet-stream';

// inline=1 → render in the browser (PDF preview); otherwise force a download.
$inline      = !empty($_GET['inline']);
$disposition = $inline ? 'inline' : 'attachment';

// Replace the JSON headers set by bootstrap with file headers.
header_remove('Content-Type');
header('Content-Type: ' . $mime);
header('Content-Disposition: ' . $disposition . '; filename="' . str_replace('"', '', $download) . '"');
header('Content-Length: ' . filesize($path));
header('X-Content-Type-Options: nosniff');

readfile($path);
exit;
