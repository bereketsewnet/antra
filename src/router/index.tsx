import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'

// Route-level code splitting — each page is its own chunk, so loading the
// home page no longer downloads About/Consultancy/Trading/Contact code too.
// (Pages use named exports, hence the `.then` re-map to a default export.)
const HomePage        = lazy(() => import('@/pages/Home').then(m => ({ default: m.HomePage })))
const AboutPage       = lazy(() => import('@/pages/About').then(m => ({ default: m.AboutPage })))
const ConsultancyPage = lazy(() => import('@/pages/Consultancy').then(m => ({ default: m.ConsultancyPage })))
const TradingPage     = lazy(() => import('@/pages/Trading').then(m => ({ default: m.TradingPage })))
const ContactPage     = lazy(() => import('@/pages/Contact').then(m => ({ default: m.ContactPage })))
const PracticeDetailPage = lazy(() => import('@/pages/PracticeDetail').then(m => ({ default: m.PracticeDetailPage })))
const CareersPage     = lazy(() => import('@/pages/Careers').then(m => ({ default: m.CareersPage })))
const JobDetailPage   = lazy(() => import('@/pages/Careers/JobDetailPage').then(m => ({ default: m.JobDetailPage })))
// Admin panel — its own chunk, separate top-level route (no public navbar/footer).
const AdminApp        = lazy(() => import('@/admin/AdminApp').then(m => ({ default: m.AdminApp })))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'consultancy', element: <ConsultancyPage /> },
      { path: 'consultancy/practices/:slug', element: <PracticeDetailPage /> },
      { path: 'trading', element: <TradingPage /> },
      { path: 'careers', element: <CareersPage /> },
      { path: 'careers/:slug', element: <JobDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  { path: '/admin/*', element: <Suspense fallback={null}><AdminApp /></Suspense> },
])
