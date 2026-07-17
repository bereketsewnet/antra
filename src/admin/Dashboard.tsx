import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '@/lib/api'
import type { DashboardStats } from './types'
import { useAuth } from './AuthContext'
import s from './admin.module.css'

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    apiGet<{ stats: DashboardStats }>('/admin/stats.php')
      .then(d => setStats(d.stats))
      .catch(() => setStats(null))
  }, [])

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Dashboard</h1>
          <p className={s.pageSub}>Welcome back, {user?.name}.</p>
        </div>
        <Link to="/admin/jobs/new" className={`${s.btn} ${s.btnPrimary}`}>+ New job</Link>
      </div>

      <div className={s.statGrid}>
        <Stat value={stats?.jobs_open} label="Open jobs" />
        <Stat value={stats?.jobs_draft} label="Draft jobs" />
        <Stat value={stats?.applications_new} label="New applications" />
        <Stat value={stats?.applications} label="Total applications" />
      </div>

      <div className={s.statGrid}>
        <Link to="/admin/jobs" className={s.statCard} style={{ textDecoration: 'none' }}>
          <div className={s.statValue}>{stats?.jobs_total ?? '—'}</div>
          <div className={s.statLabel}>Manage jobs →</div>
        </Link>
        <Link to="/admin/applications" className={s.statCard} style={{ textDecoration: 'none' }}>
          <div className={s.statValue}>{stats?.applications ?? '—'}</div>
          <div className={s.statLabel}>Review applications →</div>
        </Link>
      </div>
    </>
  )
}

function Stat({ value, label }: { value?: number; label: string }) {
  return (
    <div className={s.statCard}>
      <div className={s.statValue}>{value ?? '—'}</div>
      <div className={s.statLabel}>{label}</div>
    </div>
  )
}
