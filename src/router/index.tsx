import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { HomePage } from '@/pages/Home'
import { AboutPage } from '@/pages/About'
import { ConsultancyPage } from '@/pages/Consultancy'
import { TradingPage } from '@/pages/Trading'
import { ContactPage } from '@/pages/Contact'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'consultancy', element: <ConsultancyPage /> },
      { path: 'trading', element: <TradingPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])
