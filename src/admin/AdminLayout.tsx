import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import s from './admin.module.css'

export function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <div className={s.centered}>Loading…</div>
  }
  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${s.navItem} ${isActive ? s.navItemActive : ''}`

  const onLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className={s.root}>
      <div className={s.shell}>
        <aside className={s.sidebar}>
          <div className={s.sidebarLogo}>Antra Admin</div>
          <nav className={s.navList}>
            <NavLink to="/admin" end className={navClass}>Dashboard</NavLink>
            {(user.role === 'admin' || user.role === 'hr') && (
              <>
                <NavLink to="/admin/jobs" className={navClass}>Jobs</NavLink>
                <NavLink to="/admin/applications" className={navClass}>Applications</NavLink>
              </>
            )}
            {(user.role === 'admin' || user.role === 'survey') && (
              <NavLink to="/admin/surveys" className={navClass}>Surveys</NavLink>
            )}
            {user.role === 'admin' && <NavLink to="/admin/staff" className={navClass}>Staff</NavLink>}
            <NavLink to="/admin/profile" className={navClass}>My profile</NavLink>
          </nav>
          <div className={s.sidebarFoot}>
            <div className={s.sidebarUser}>{user.name}</div>
            <div className={s.sidebarRole}>{user.role}</div>
            <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={onLogout}
              style={{ width: '100%', justifyContent: 'center', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
              Sign out
            </button>
          </div>
        </aside>
        <main className={s.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
