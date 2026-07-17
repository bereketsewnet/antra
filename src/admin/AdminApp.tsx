import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { AdminLayout } from './AdminLayout'
import { LoginPage } from './LoginPage'
import { Dashboard } from './Dashboard'
import { JobsManager } from './JobsManager'
import { JobEditor } from './JobEditor'
import { ApplicationsManager } from './ApplicationsManager'
import { SurveysManager } from './SurveysManager'
import { SurveyEditor } from './SurveyEditor'
import { SurveyResults } from './SurveyResults'
import { UsersManager } from './UsersManager'
import { Profile } from './Profile'

// Mounted at /admin/* (a top-level route, so it has none of the public
// site's navbar/footer/theme chrome). Auth is handled inside AdminLayout.
export function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobsManager />} />
          <Route path="jobs/new" element={<JobEditor />} />
          <Route path="jobs/:id/edit" element={<JobEditor />} />
          <Route path="applications" element={<ApplicationsManager />} />
          <Route path="surveys" element={<SurveysManager />} />
          <Route path="surveys/new" element={<SurveyEditor />} />
          <Route path="surveys/:id/edit" element={<SurveyEditor />} />
          <Route path="surveys/:id/results" element={<SurveyResults />} />
          <Route path="staff" element={<UsersManager />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  )
}
