<?php
declare(strict_types=1);

// ── Antra API — shared SMTP mailer ──
// Reuses the same dependency-free SMTP approach as mail.php, but as a
// reusable helper for the API (job-application alerts, etc.). Reads SMTP
// credentials from mail-config.php so there is one place for email secrets.
//
// mail.php itself is left untouched (it keeps its own copy) so the contact
// form can never be affected by changes here.

/**
 * Send a multipart (plain + HTML) email. Returns true on success, or an
 * error string on failure.
 *
 * @return true|string
 */
function send_mail(string $toEmail, string $toName, string $subject, string $html, string $plain, ?string $replyToEmail = null, ?string $replyToName = null)
{
    $mailConfig = __DIR__ . '/../../mail-config.php';
    if (!file_exists($mailConfig)) {
        return 'mail not configured';
    }
    $cfg = require $mailConfig;

    $fromAddr = $cfg['smtp_user'];
    $boundary = 'antra-' . bin2hex(random_bytes(8));

    $enc = static function (string $value): string {
        if (preg_match('/[^\x20-\x7E]/', $value)) {
            return '=?UTF-8?B?' . base64_encode($value) . '?=';
        }
        return '"' . str_replace('"', '\"', $value) . '"';
    };

    $headers = [
        'From: "Antra Website" <' . $fromAddr . '>',
        'To: ' . $enc($toName) . ' <' . $toEmail . '>',
        'Subject: ' . $enc($subject),
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'Date: ' . date('r'),
        'Message-ID: <' . bin2hex(random_bytes(8)) . '@antragroup.et>',
        'X-Mailer: Antra-Web/1.0',
    ];
    if ($replyToEmail !== null && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $enc((string)$replyToName) . ' <' . $replyToEmail . '>';
    }

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

    return smtp_send($cfg, $fromAddr, $toEmail, $rawEmail);
}

/** @return true|string */
function smtp_send(array $cfg, string $from, string $to, string $rawEmail)
{
    $ctx = stream_context_create([
        'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
    ]);

    $socket = @stream_socket_client(
        'ssl://' . $cfg['smtp_host'] . ':' . $cfg['smtp_port'],
        $errno, $errstr, 20,
        STREAM_CLIENT_CONNECT,
        $ctx
    );
    if (!$socket) {
        return "connect failed: $errstr ($errno)";
    }
    stream_set_timeout($socket, 20);

    $read = static function () use ($socket): string {
        $out = '';
        while ($line = fgets($socket, 1024)) {
            $out .= $line;
            if (preg_match('/^\d{3} /', $line)) break;
        }
        return $out;
    };
    $send = static function (string $cmd) use ($socket, $read): string {
        fwrite($socket, $cmd . "\r\n");
        return $read();
    };
    $expect = static function (string $resp, string $code, string $label): void {
        if (substr($resp, 0, 3) !== $code) {
            throw new RuntimeException("$label expected $code, got: " . trim($resp));
        }
    };

    try {
        $expect($read(),                                 '220', 'greeting');
        $expect($send('EHLO antragroup.et'),             '250', 'EHLO');
        $expect($send('AUTH LOGIN'),                     '334', 'AUTH');
        $expect($send(base64_encode($cfg['smtp_user'])), '334', 'user');
        $expect($send(base64_encode($cfg['smtp_pass'])), '235', 'pass');
        $expect($send('MAIL FROM:<' . $from . '>'),      '250', 'MAIL FROM');
        $expect($send('RCPT TO:<' . $to . '>'),          '250', 'RCPT TO');
        $expect($send('DATA'),                           '354', 'DATA');

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
