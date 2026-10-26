import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingScreen from '../components/LoadingScreen'

/**
 * Guard WAJIB LOGIN:
 * Pengguna tanpa sesi login otomatis dialihkan ke Keycloak signinRedirect()
 * dengan menyimpan URL path asal.
 */
const AuthGuard = () => {
  const { isAuthenticated, isLoading, signinRedirect } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const fullPath = location.pathname + location.search
      sessionStorage.setItem('PORTAL_REDIRECT_TARGET', fullPath)
      signinRedirect()
    }
  }, [isLoading, isAuthenticated, location, signinRedirect])

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen message="Memeriksa sesi login ke Keycloak..." />
  }

  return <Outlet />
}

export default AuthGuard
