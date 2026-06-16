<?php
declare(strict_types=1);

// ── Antra Business Group — Contact form handler ──

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$configPath = __DIR__ . '/mail-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail not configured']);
    exit;
}
$config = require $configPath;

$raw  = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) $body = $_POST;

// Honeypot — bots fill hidden fields; humans don't
if (!empty($body['website']) || !empty($body['url'])) {
    echo json_encode(['ok' => true]); // pretend success
    exit;
}

$name    = trim((string)($body['name']    ?? ''));
$email   = trim((string)($body['email']   ?? ''));
$phone   = trim((string)($body['phone']   ?? ''));
$company = trim((string)($body['company'] ?? ''));
$service = trim((string)($body['service'] ?? ''));
$message = trim((string)($body['message'] ?? ''));

$errors = [];
if ($name === '' || strlen($name) > 100)            $errors[] = 'Invalid name';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))     $errors[] = 'Invalid email';
if ($message === '' || strlen($message) > 5000)    $errors[] = 'Invalid message';
if ($errors) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

// Rate limit: 1 submit per IP per 30s
$ip       = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/antra_rate_' . md5($ip);
if (file_exists($rateFile) && (time() - filemtime($rateFile)) < 30) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Too many requests, please wait a moment.']);
    exit;
}
@touch($rateFile);

$serviceLabels = [
    'consultancy' => 'Management Consultancy',
    'trading'     => 'Trading & Supply',
    'both'        => 'Both practices',
    'unsure'      => 'Not sure yet',
];
$serviceLabel = $serviceLabels[$service] ?? '—';

$subject  = 'New Contact Enquiry — ' . $name;
$fromAddr = $config['smtp_user'];
$toAddr   = $config['to_email'];

$plain = "New enquiry from antragroup.et\r\n\r\n"
       . "Name: $name\r\n"
       . "Email: $email\r\n"
       . "Phone: " . ($phone ?: '—') . "\r\n"
       . "Company: " . ($company ?: '—') . "\r\n"
       . "Area of interest: $serviceLabel\r\n\r\n"
       . "--- Message ---\r\n$message\r\n";

$esc  = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
$html = '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0B2135;line-height:1.55;margin:0;padding:24px">'
      . '<div style="max-width:600px;margin:0 auto">'
      . '<h2 style="color:#FF6F3C;margin:0 0 16px;font-size:22px">New Contact Enquiry</h2>'
      . '<p style="margin:0 0 16px">You received a new message from <strong>antragroup.et</strong>:</p>'
      . '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;background:#f8f9fb;border-radius:8px">'
      . '<tr><td style="width:120px"><strong>Name</strong></td><td>'    . $esc($name)    . '</td></tr>'
      . '<tr><td><strong>Email</strong></td><td><a href="mailto:'        . $esc($email)   . '" style="color:#FF6F3C">' . $esc($email) . '</a></td></tr>'
      . '<tr><td><strong>Phone</strong></td><td>'                       . $esc($phone   ?: '—') . '</td></tr>'
      . '<tr><td><strong>Company</strong></td><td>'                     . $esc($company ?: '—') . '</td></tr>'
      . '<tr><td><strong>Area</strong></td><td>'                        . $esc($serviceLabel)   . '</td></tr>'
      . '</table>'
      . '<h3 style="margin:24px 0 8px;font-size:16px">Message</h3>'
      . '<div style="background:#fff;border-left:3px solid #FF6F3C;padding:16px;white-space:pre-wrap">'
      . nl2br($esc($message))
      . '</div>'
      . '<p style="color:#888;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:12px">'
      . 'Sent automatically from the antragroup.et contact form. Reply directly to this email to respond to the sender.'
      . '</p>'
      . '</div></body></html>';

$boundary = 'antra-' . bin2hex(random_bytes(8));
$headers  = [
    'From: "Antra Website" <' . $fromAddr . '>',
    'Reply-To: ' . encodeHeader($name) . ' <' . $email . '>',
    'To: "' . $config['to_name'] . '" <' . $toAddr . '>',
    'Subject: ' . encodeHeader($subject),
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    'Date: ' . date('r'),
    'Message-ID: <' . bin2hex(random_bytes(8)) . '@antragroup.et>',
    'X-Mailer: Antra-Web/1.0',
];

$emailBody = "--$boundary\r\n"
           . "Content-Type: text/plain; charset=utf-8\r\n"
           . "Content-Transfer-Encoding: 8bit\r\n\r\n"
           . $plain . "\r\n\r\n"
           . "--$boundary\r\n"
           . "Content-Type: text/html; charset=utf-8\r\n"
           . "Content-Transfer-Encoding: 8bit\r\n\r\n"
           . $html . "\r\n\r\n"
           . "--$boundary--\r\n";

$rawEmail = implode("\r\n", $headers) . "\r\n\r\n" . $emailBody;

$result = sendViaSmtp($config, $fromAddr, $toAddr, $rawEmail);
if ($result === true) {
    echo json_encode(['ok' => true]);
} else {
    error_log('[antra-mail] ' . $result);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not send message. Please email info@antragroup.et directly.']);
}

// ── helpers ──

function encodeHeader(string $value): string {
    if (preg_match('/[^\x20-\x7E]/', $value)) {
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }
    return '"' . str_replace('"', '\"', $value) . '"';
}

function sendViaSmtp(array $cfg, string $from, string $to, string $rawEmail) {
    $ctx = stream_context_create([
        'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
    ]);

    $socket = @stream_socket_client(
        'ssl://' . $cfg['smtp_host'] . ':' . $cfg['smtp_port'],
        $errno, $errstr, 20,
        STREAM_CLIENT_CONNECT,
        $ctx
    );
    if (!$socket) return "connect failed: $errstr ($errno)";
    stream_set_timeout($socket, 20);

    $read = function () use ($socket): string {
        $out = '';
        while ($line = fgets($socket, 1024)) {
            $out .= $line;
            if (preg_match('/^\d{3} /', $line)) break;
        }
        return $out;
    };
    $send = function (string $cmd) use ($socket, $read): string {
        fwrite($socket, $cmd . "\r\n");
        return $read();
    };
    $expect = function (string $resp, string $code, string $label) {
        if (substr($resp, 0, 3) !== $code) {
            throw new RuntimeException("$label expected $code, got: " . trim($resp));
        }
    };

    try {
        $expect($read(),                                    '220', 'greeting');
        $expect($send('EHLO antragroup.et'),                '250', 'EHLO');
        $expect($send('AUTH LOGIN'),                        '334', 'AUTH');
        $expect($send(base64_encode($cfg['smtp_user'])),    '334', 'user');
        $expect($send(base64_encode($cfg['smtp_pass'])),    '235', 'pass');
        $expect($send('MAIL FROM:<' . $from . '>'),         '250', 'MAIL FROM');
        $expect($send('RCPT TO:<' . $to . '>'),             '250', 'RCPT TO');
        $expect($send('DATA'),                              '354', 'DATA');

        // Dot-stuff lines starting with "."
        foreach (explode("\r\n", $rawEmail) as $line) {
            fwrite($socket, (strlen($line) && $line[0] === '.' ? '.' : '') . $line . "\r\n");
        }
        $expect($send('.'), '250', 'end-of-data');

        @fwrite($socket, "QUIT\r\n");
        @fclose($socket);
        return true;
    } catch (Throwable $e) {
        @fclose($socket);
        return $e->getMessage();
    }
}
