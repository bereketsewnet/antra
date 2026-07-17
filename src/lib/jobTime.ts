// Countdown for a job's application deadline (closes_at is a YYYY-MM-DD date;
// the deadline is the END of that day). Returns a warning only when it's
// close (≤ 5 days), plus an hours countdown on the final day.

export interface JobTimeLeft {
  closed: boolean
  urgent: boolean   // within the 5-day warning window (or hours left)
  label: string     // "5 days left", "3 hrs left", "Closes today", "Closed"
  days: number
}

export function jobTimeLeft(closesAt: string | null | undefined): JobTimeLeft | null {
  if (!closesAt) return null

  const end = new Date(`${closesAt}T23:59:59`)
  if (isNaN(end.getTime())) return null

  const ms = end.getTime() - Date.now()
  if (ms <= 0) {
    return { closed: true, urgent: true, label: 'Closed', days: 0 }
  }

  const days = Math.floor(ms / 86_400_000)
  if (days >= 1) {
    return { closed: false, urgent: days <= 5, label: `${days} day${days > 1 ? 's' : ''} left`, days }
  }

  // Final day → count down in hours.
  const hrs = Math.max(1, Math.floor(ms / 3_600_000))
  return { closed: false, urgent: true, label: `${hrs} hr${hrs > 1 ? 's' : ''} left`, days: 0 }
}
