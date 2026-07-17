<?php
declare(strict_types=1);

// ── Professional status-update emails sent to applicants ──
// Returns ['subject','html','plain'] for a given application status.
// Always references the job title, thanks the applicant, and — for
// 'rejected' — encourages them to keep applying and developing.

function application_status_email(string $status, string $name, string $jobTitle, string $note = ''): array
{
    $first = trim(explode(' ', trim($name))[0] ?: 'there');

    // [subject, intro paragraph, main body paragraph(s)]
    $map = [
        'reviewing' => [
            'Your application is under review — ' . $jobTitle,
            "Thank you for applying for the <strong>{$jobTitle}</strong> role at Antra Business Group.",
            "We wanted to let you know that your application is now being reviewed by our team. We appreciate the time you took to apply, and we will be in touch as soon as there is an update on the next steps.",
        ],
        'shortlisted' => [
            'Good news about your application — ' . $jobTitle,
            "Thank you for applying for the <strong>{$jobTitle}</strong> role at Antra Business Group.",
            "We are pleased to let you know that you have been <strong>shortlisted</strong> for this position. Our team was impressed with your application, and we will contact you shortly with details of the next stage of the process. We look forward to speaking with you.",
        ],
        'hired' => [
            'Congratulations from Antra Business Group — ' . $jobTitle,
            "Congratulations, and thank you for applying for the <strong>{$jobTitle}</strong> role at Antra Business Group.",
            "We are delighted to inform you that we would like to move forward with you for this position. A member of our team will be in touch very soon with the next steps and details. We are excited about the possibility of you joining us, and we look forward to working together.",
        ],
        'rejected' => [
            'Update on your application — ' . $jobTitle,
            "Thank you for taking the time to apply for the <strong>{$jobTitle}</strong> role at Antra Business Group, and for your interest in joining our team.",
            "After careful consideration, we are unable to move forward with your application for this particular role at this time. Please do not be discouraged — this decision reflects the specific needs of this one position and not your ability or potential.<br><br>We genuinely encourage you to keep applying for other opportunities with us as they open, and to keep building on your skills and experience. Talented people often find the right fit on a later opportunity, so please do not give up. We wish you every success in your career journey.",
        ],
        'new' => [
            'We received your application — ' . $jobTitle,
            "Thank you for applying for the <strong>{$jobTitle}</strong> role at Antra Business Group.",
            "This is a confirmation that we have received your application. Our team will review it and be in touch regarding the next steps.",
        ],
    ];

    [$subject, $intro, $bodyHtml] = $map[$status] ?? $map['reviewing'];

    $esc     = static fn ($s) => htmlspecialchars((string) $s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $noteEsc = $note !== '' ? $esc($note) : '';

    $noteBlockHtml = $noteEsc !== ''
        ? '<div style="margin:20px 0;padding:14px 16px;background:#fff8ef;border-left:3px solid #D97911;border-radius:4px">'
          . '<strong style="color:#0B2135">A note from our team:</strong><br>' . nl2br($noteEsc) . '</div>'
        : '';

    $html = '<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#f4f6fa;font-family:Arial,sans-serif;color:#0B2135;line-height:1.6">'
        . '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;padding:32px 30px">'
        . '<h2 style="color:#0B2135;margin:0 0 4px;font-size:20px">Antra Business Group</h2>'
        . '<div style="height:3px;width:44px;background:#D97911;margin:0 0 20px"></div>'
        . '<p style="margin:0 0 14px">Dear ' . $esc($first) . ',</p>'
        . '<p style="margin:0 0 14px">' . $intro . '</p>'
        . '<p style="margin:0 0 14px">' . $bodyHtml . '</p>'
        . $noteBlockHtml
        . '<p style="margin:20px 0 4px">Warm regards,</p>'
        . '<p style="margin:0;font-weight:600">The Recruitment Team<br>Antra Business Group</p>'
        . '<p style="color:#94a3b8;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:12px">'
        . 'This is an automated message regarding your application for ' . $esc($jobTitle) . '. '
        . 'Please do not reply directly; for questions, contact info@antragroup.et.</p>'
        . '</div></body></html>';

    // Plain-text version (strip the HTML tags from the body paragraph).
    $bodyPlain = trim(html_entity_decode(strip_tags(str_replace(['<br>', '<br><br>'], "\n", $bodyHtml)), ENT_QUOTES | ENT_HTML5));
    $introPlain = trim(html_entity_decode(strip_tags($intro), ENT_QUOTES | ENT_HTML5));
    $plain = "Dear {$first},\r\n\r\n{$introPlain}\r\n\r\n{$bodyPlain}\r\n\r\n"
        . ($note !== '' ? "A note from our team:\r\n{$note}\r\n\r\n" : '')
        . "Warm regards,\r\nThe Recruitment Team\r\nAntra Business Group\r\n";

    return ['subject' => $subject, 'html' => $html, 'plain' => $plain];
}
