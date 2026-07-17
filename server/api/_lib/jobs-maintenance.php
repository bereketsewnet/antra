<?php
declare(strict_types=1);

// ── Auto-close jobs whose application deadline has passed ──
// A job with closes_at = today is still open for its final day (the public
// listing shows it while closes_at >= today); once closes_at is in the past
// it flips to 'closed'. Called lazily whenever jobs are listed, and by the
// cron script for reliability.

function close_expired_jobs(): int
{
    try {
        $stmt = db()->query(
            "UPDATE jobs SET status = 'closed'
             WHERE status = 'open' AND closes_at IS NOT NULL AND closes_at < CURDATE()"
        );
        return $stmt->rowCount();
    } catch (Throwable $e) {
        error_log('[antra-jobs] auto-close failed: ' . $e->getMessage());
        return 0;
    }
}
