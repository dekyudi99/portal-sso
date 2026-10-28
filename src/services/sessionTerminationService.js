import { setOidcAccessToken, getOidcUserManager } from './oidcTokenService'

let isTerminating = false
let isLoggingOut = false

/**
 * Flag untuk menandai proses logout yang sedang berlangsung.
 * Saat flag ini aktif, handler session termination (dari iframe/tab lain)
 * diabaikan agar tidak berebut redirect dengan signoutRedirect.
 */
export const setIsLoggingOut = (val) => {
  isLoggingOut = Boolean(val)
}

export const getIsLoggingOut = () => isLoggingOut

/**
 * Pembersihan sesi lokal terpusat untuk Portal SSO.
 * PENTING: Jangan memanggil signoutRedirect() di sini untuk mencegah loop logout antar-aplikasi.
 * Setelah sesi berakhir, arahkan ke landing page SSO (VITE_LANDING_URL).
 */
export const terminateLocalSession = async (reason = 'Sesi berakhir') => {
  if (isTerminating || isLoggingOut) return
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
