import { createBrowserRouter } from 'react-router-dom'
import AuthRoot from './AuthRoot'
import AuthGuard from './AuthGuard'
import AuthCallbackPage from './AuthCallbackPage'
import ErrorPage from './ErrorPage'
import DashboardPage from '../pages/DashboardPage'
import ProfilePage from '../pages/ProfilePage'

const routes = createBrowserRouter([
  {
    element: <AuthRoot />,
    children: [
      // Rute Publik Terbatas
      {
        path: '/auth/callback',
        element: <AuthCallbackPage />,
      },
      {
        path: '/error',
        element: <ErrorPage />,
      },

      // Seluruh Rute Portal WAJIB LOGIN
      {
        element: <AuthGuard />,
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '*',
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
])

export default routes
