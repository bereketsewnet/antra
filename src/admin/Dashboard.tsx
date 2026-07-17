import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiGet } from '@/lib/api'
import { useAuth } from './AuthContext'
import { Donut, HBars, AreaChart, type Segment } from './charts'
import s from './admin.module.css'

interface Stats {
  counters: Record<string, number>
  apps_by_status: Record<string, number>
  jobs_by_status: Record<string, number>
  apps_over_time: { date: string; count: number }[]
  top_jobs: { title: string; count: number }[]
  recent: { id: number; applicant_name: string; status: string; created_at: string; job_title: string }[]
  survey_summary: { title: string; status: string; count: number }[]
}

const APP_COLORS: Record<string, string> = {
  new: '#f59e0b', reviewing: '#3b82f6', shortlisted: '#8b5cf6', rejected: '#94a3b8', hired: '#16a34a',
}
const JOB_COLORS: Record<string, string> = { open: '#16a34a', draft: '#f59e0b', closed: '#94a3b8' }
const statusBadge: Record<string, string> = {
  new: s.badgeNew, reviewing: s.badgeReviewing, shortlisted: s.badgeShortlisted,
  rejected: s.badgeRejected, hired: s.badgeHired,
}

export function Dashboard() {
  const { user } = useAuth()
  const [d, setD] = useState<Stats | null>(null)

  useEffect(() => { apiGet<Stats>('/admin/stats.php').then(setD).catch(() => setD(null)) }, [])

  const c = d?.counters ?? {}
  const appSegments: Segment[] = Object.entries(d?.apps_by_status ?? {}).map(([k, v]) => ({ label: k, value: v, color: APP_COLORS[k] ?? '#cbd5e1' }))
  const jobSegments: Segment[] = Object.entries(d?.jobs_by_status ?? {}).map(([k, v]) => ({ label: k, value: v, color: JOB_COLORS[k] ?? '#cbd5e1' }))

  const cards = [
    { label: 'Open jobs', value: c.jobs_open, accent: '#16a34a', to: '/admin/jobs' },
    { label: 'New applications', value: c.applications_new, accent: '#f59e0b', to: '/admin/applications' },
    { label: 'Applications (7d)', value: c.applications_7d, accent: '#3b82f6', to: '/admin/applications' },
    { label: 'Hired', value: c.hired, accent: '#8b5cf6', to: '/admin/applications' },
    { label: 'Survey responses', value: c.survey_responses, accent: '#d97911', to: '/admin/surveys' },
  ]

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Dashboard</h1>
          <p className={s.pageSub}>Welcome back, {user?.name}. Here’s what’s happening.</p>
        </div>
        <Link to="/admin/jobs/new" className={`${s.btn} ${s.btnPrimary}`}>+ New job</Link>
      </div>

      {/* Stat cards */}
      <div className={s.statGrid}>
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link to={card.to} className={s.statCard} style={{ display: 'block', textDecoration: 'none', borderTop: `3px solid ${card.accent}` }}>
              <div className={s.statValue}>{card.value ?? '—'}</div>
              <div className={s.statLabel}>{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className={s.dashGrid}>
        <ChartCard title="Applications over the last 14 days">
          {d && <AreaChart data={d.apps_over_time} />}
        </ChartCard>
        <ChartCard title="Applications by status">
          {d && appSegments.length > 0 && <Donut segments={appSegments} />}
        </ChartCard>
      </div>

      <div className={s.dashGrid}>
        <ChartCard title="Top jobs by applications">
          {d && (d.top_jobs.length ? <HBars items={d.top_jobs.map(j => ({ label: j.title, value: j.count }))} /> : <div className={s.muted}>No applications yet.</div>)}
        </ChartCard>
        <ChartCard title="Jobs by status">
          {d && <Donut segments={jobSegments} size={148} thickness={20} />}
        </ChartCard>
      </div>

      {/* Recent + surveys */}
      <div className={s.dashGrid}>
        <ChartCard title="Recent applications">
          {d && (d.recent.length ? (
            <table className={s.table}>
              <thead><tr><th>Applicant</th><th>Role</th><th>Status</th><th>When</th></tr></thead>
              <tbody>
                {d.recent.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.applicant_name}</td>
                    <td className={s.muted}>{r.job_title}</td>
                    <td><span className={`${s.badge} ${statusBadge[r.status] ?? ''}`}>{r.status}</span></td>
                    <td className={s.muted}>{r.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className={s.muted}>No applications yet.</div>)}
        </ChartCard>
        <ChartCard title="Survey responses">
          {d && (d.survey_summary.length ? <HBars items={d.survey_summary.map(x => ({ label: x.title, value: x.count }))} color="#3b82f6" /> : <div className={s.muted}>No surveys yet.</div>)}
        </ChartCard>
      </div>
    </>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div className={s.card}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className={s.label} style={{ fontSize: 14, marginBottom: 18 }}>{title}</div>
      {children}
    </motion.div>
  )
}
