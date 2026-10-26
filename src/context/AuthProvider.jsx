import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth as useOidcAuth } from 'react-oidc-context'
import AuthContext from './AuthContext'
import { setOidcAccessToken, setOidcUserManager, getOidcAccessToken } from '../services/oidcTokenService'
import { terminateLocalSession } from '../services/sessionTerminationService'
import { getRealmRoles } from '../utils/tokenUtils'

const AuthProvider = ({ children }) => {
  const oidcAuth = useOidcAuth()
  const [roles, setRoles] = useState([])

  // Simpan userManager OIDC ke service global
  useEffect(() => {
    if (oidcAuth) {
      setOidcUserManager(oidcAuth)
    }
  }, [oidcAuth])

  // Daftarkan listener event OIDC: OP Signout (iframe), Silent Renew Error, Token Expired
  useEffect(() => {
    if (!oidcAuth?.events) return

    const handleSessionEnded = async () => {
      await terminateLocalSession('Sesi Anda telah berakhir.')
    }

    oidcAuth.events.addUserSignedOut(handleSessionEnded)
    oidcAuth.events.addSilentRenewError(handleSessionEnded)
    oidcAuth.events.addAccessTokenExpired(handleSessionEnded)

    return () => {
      oidcAuth.events.removeUserSignedOut(handleSessionEnded)
      oidcAuth.events.removeSilentRenewError(handleSessionEnded)
      oidcAuth.events.removeAccessTokenExpired(handleSessionEnded)
    }
  }, [oidcAuth?.events])

  // Pengecekan sesi saat tab kembali aktif (visibilitychange & focus) dengan throttle 15 detik
  useEffect(() => {
    let lastCheckTime = 0
    const CHECK_THROTTLE_MS = 15000

    const handleVisibilityOrFocus = async () => {
      if (typeof document !== 'undefined' && document.visibilityState && document.visibilityState !== 'visible') {
        return
      }

      const now = Date.now()
      if (now - lastCheckTime < CHECK_THROTTLE_MS) {
        return
      }
      lastCheckTime = now

      if (oidcAuth.isAuthenticated || getOidcAccessToken()) {
        try {
          await oidcAuth.signinSilent()
        } catch {
          await terminateLocalSession('Sesi berakhir')
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleVisibilityOrFocus)
      document.addEventListener('visibilitychange', handleVisibilityOrFocus)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleVisibilityOrFocus)
        document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      }
    }
  }, [oidcAuth])

  // Ekstrak token & realm_access.roles menggunakan utilitas tunggal getRealmRoles
  useEffect(() => {
    if (oidcAuth.isAuthenticated && oidcAuth.user?.access_token) {
      setOidcAccessToken(oidcAuth.user.access_token)
      const tokenRoles = getRealmRoles(oidcAuth.user)
      setRoles(tokenRoles)
    } else {
      setOidcAccessToken(null)
      setRoles([])
    }
  }, [oidcAuth.isAuthenticated, oidcAuth.user])

  // Logout via Keycloak OP signoutRedirect ke landing URL
  const logout = useCallback(async () => {
    const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:3000'
    try {
      setOidcAccessToken(null)
      await oidcAuth.signoutRedirect({
        post_logout_redirect_uri: landingUrl,
      })
    } catch {
      window.location.replace(landingUrl)
    }
  }, [oidcAuth])

  const user = useMemo(() => {
    if (!oidcAuth.user?.profile) return null
    return {
      sub: oidcAuth.user.profile.sub,
      name: oidcAuth.user.profile.name || oidcAuth.user.profile.preferred_username || 'Pengguna',
      username: oidcAuth.user.profile.preferred_username || '',
      email: oidcAuth.user.profile.email || '',
      roles,
      isAdmin: roles.includes('admin'),
    }
  }, [oidcAuth.user, roles])

  const value = useMemo(
    () => ({
      user,
      roles,
      isAuthenticated: oidcAuth.isAuthenticated,
      isLoading: oidcAuth.isLoading,
      logout,
      signinRedirect: oidcAuth.signinRedirect,
      oidcAuth,
    }),
    [user, roles, oidcAuth.isAuthenticated, oidcAuth.isLoading, logout, oidcAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
