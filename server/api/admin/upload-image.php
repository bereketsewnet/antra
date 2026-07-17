<?php
declare(strict_types=1);

// Authenticated image upload for public job thumbnails.
//   POST /api/admin/upload-image.php   (multipart, field: "image")
// Stores in server/uploads/jobs (web-accessible) and returns the public URL.
require __DIR__ . '/../_lib/bootstrap.php';
require __DIR__ . '/../_lib/http.php';
require __DIR__ . '/../_lib/db.php';
require __DIR__ . '/../_lib/auth.php';

require_role('admin', 'hr');
require_method('POST');

if (!isset($_FILES['image']) || $_FILES['image']['error'] === UPLOAD_ERR_NO_FILE) {
    json_error('No image was uploaded.', 400);
}
$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    json_error('The image could not be uploaded. Please try again.', 400);
}
if ($file['size'] > 4 * 1024 * 1024) {
    json_error('Image is too large (max 4 MB).', 413);
}

$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
if (!isset($allowed[$mime])) {
    json_error('Only JPG, PNG, WEBP or GIF images are allowed.', 415);
}
$ext = $allowed[$mime];

$dir = __DIR__ . '/../../uploads/jobs';
if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
    error_log('[antra-upload] cannot create ' . $dir);
    json_error('Server could not store the image.', 500);
}

$name = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
$dest = $dir . DIRECTORY_SEPARATOR . $name;
if (!@move_uploaded_file($file['tmp_name'], $dest)) {
    error_log('[antra-upload] move failed to ' . $dest);
    json_error('Server could not store the image.', 500);
}

json_ok(['url' => '/uploads/jobs/' . $name]);
