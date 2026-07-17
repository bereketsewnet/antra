// ── Tiny API client for the PHP backend (/api/*.php on cPanel) ──
// Note: these endpoints only respond on the deployed site (they need PHP +
// MySQL). During `vite dev` there is no PHP server, so calls will fail —
// same as the existing contact form, which posts to /mail.php.

const BASE = '/api'

export interface ApiError extends Error {
  status: number
  fields?: Record<string, string>
}

async function handle<T>(res: Response): Promise<T> {
  let data: any = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON response */
  }
  if (!res.ok || !data || data.ok === false) {
    const err = new Error(data?.error || `Request failed (${res.status})`) as ApiError
    err.status = res.status
    err.fields = data?.fields
    throw err
  }
  return data as T
}

export function apiGet<T = any>(path: string): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  }).then(r => handle<T>(r))
}

export function apiPostJson<T = any>(path: string, body: unknown): Promise<T> {
  return apiJson<T>('POST', path, body)
}

/** Generic JSON request (POST / PATCH / PUT / DELETE). */
export function apiJson<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(r => handle<T>(r))
}

/** POST multipart form data (for file uploads like CVs). */
export function apiPostForm<T = any>(path: string, form: FormData): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
    body: form,
  }).then(r => handle<T>(r))
}

// ── Shared types ──
export interface JobListItem {
  id: number
  slug: string
  title: string
  department: string | null
  location: string | null
  employment_type: string
  summary: string | null
  posted_at: string | null
  closes_at: string | null
}

export interface JobDetail extends JobListItem {
  description: string | null
  requirements: string | null
  salary_range: string | null
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
}
