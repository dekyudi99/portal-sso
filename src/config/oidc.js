import { WebStorageStateStore } from 'oidc-client-ts'

export const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORITY || 'http://localhost:8081/realms/wefgis',
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'portal',
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: import.meta.env.VITE_LANDING_URL || 'http://localhost:3000',
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  monitorSession: true,
  checkSessionIntervalInSeconds: Number(import.meta.env.VITE_SESSION_CHECK_INTERVAL_SECONDS) || 2,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname)
  },
}

