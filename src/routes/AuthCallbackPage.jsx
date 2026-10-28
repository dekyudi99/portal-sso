import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth as useOidcAuth } from 'react-oidc-context'
import LoadingScreen from '../components/LoadingScreen'

const AuthCallbackPage = () => {
  const oidcAuth = useOidcAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const urlError = searchParams.get('error')
  const urlErrorDesc = searchParams.get('error_description')

  useEffect(() => {
    // 1. Tangani error callback langsung dari URL query parameter
    if (urlError) {
      navigate(`/error?error=${encodeURIComponent(urlError)}&error_description=${encodeURIComponent(urlErrorDesc || '')}`, { replace: true })
      return
    }

    // 2. Tangani error dari oidcAuth context
    if (oidcAuth.error) {
      navigate(`/error?error=${encodeURIComponent(oidcAuth.error.name || 'AuthError')}&error_description=${encodeURIComponent(oidcAuth.error.message || '')}`, { replace: true })
      return
    }

    // 3. Jika login sukses dan user terotentikasi, kembalikan ke path yang dituju
    if (oidcAuth.isAuthenticated) {
      const target = sessionStorage.getItem('PORTAL_REDIRECT_TARGET') || '/'
      sessionStorage.removeItem('PORTAL_REDIRECT_TARGET')
      navigate(target, { replace: true })
    }
  }, [urlError, urlErrorDesc, oidcAuth.error, oidcAuth.isAuthenticated, navigate])

  return <LoadingScreen message="Verifying Keycloak token..." />
}

export default AuthCallbackPage
