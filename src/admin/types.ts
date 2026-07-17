export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'hr' | 'survey'
}

export interface StaffUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'hr' | 'survey'
  is_active: number | boolean
  last_login_at: string | null
  created_at: string
}

export type JobStatus = 'draft' | 'open' | 'closed'

export interface AdminJob {
  id: number
  slug: string
  title: string
  department: string | null
  location: string | null
  employment_type: string
  summary: string | null
  description: string | null
  requirements: string | null
  salary_range: string | null
  status: JobStatus
  posted_at: string | null
  closes_at: string | null
  created_at: string
  application_count?: number
}

export type ApplicationStatus = 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'

export interface Application {
  id: number
  job_id: number
  applicant_name: string
  email: string
  phone: string | null
  status: ApplicationStatus
  cv_filename: string | null
  created_at: string
  job_title: string
  job_slug?: string
  cover_letter?: string | null
  status_note?: string | null
  has_cv?: boolean
}

export interface DashboardStats {
  jobs_total: number
  jobs_open: number
  jobs_draft: number
  applications: number
  applications_new: number
  surveys: number
}

export const EMPLOYMENT_TYPES: { value: string; label: string }[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
]

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'new', 'reviewing', 'shortlisted', 'rejected', 'hired',
]
