import { setOidcAccessToken, getOidcUserManager } from './oidcTokenService'

let isTerminating = false

/**
 * Pembersihan sesi lokal terpusat untuk Portal SSO.
 * PENTING: Jangan memanggil signoutRedirect() di sini untuk mencegah loop logout antar-aplikasi.
 * Setelah sesi berakhir, arahkan ke landing page SSO (VITE_LANDING_URL).
 */
export const terminateLocalSession = async (reason = 'Sesi berakhir') => {
  if (isTerminating) return
  isTerminating = true

  const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:3000'

  try {
    setOidcAccessToken(null)

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        Object.keys(window.sessionStorage).forEach((k) => {
          if (k.startsWith('oidc.user:') || k === 'PORTAL_REDIRECT_TARGET') {
            window.sessionStorage.removeItem(k)
          }
        })
      } catch {
        // Ignore storage error
      }
      window.sessionStorage.setItem('SESSION_EXPIRED', 'true')
      if (reason) {
        window.sessionStorage.setItem('SESSION_TERMINATED_MSG', reason)
      }
    }

    const userManager = getOidcUserManager()
    if (userManager) {
      try {
        await userManager.removeUser()
      } catch {
        // Ignore userManager error
      }
    }
  } finally {
    // Alihkan ke Landing Page SSO
    if (typeof window !== 'undefined') {
      window.location.replace(landingUrl)
    }

    setTimeout(() => {
      isTerminating = false
    }, 2000)
  }
}
