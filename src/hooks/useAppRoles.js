import { useMemo } from 'react'
import useAuth from './useAuth'
import { appsConfig } from '../config/apps.config'
import { getRealmRoles } from '../utils/tokenUtils'

export { getRealmRoles }

export const useAppRoles = () => {
  const { roles, user, oidcAuth } = useAuth()

  const { allowedApps, isAdmin, effectiveRoles } = useMemo(() => {
    // Gunakan roles dari context, jika belum siap fallback ke getRealmRoles langsung dari user/oidcAuth
    const userRoles = (roles && roles.length > 0)
      ? roles
      : getRealmRoles(oidcAuth?.user || user)

    const isUserAdmin = userRoles.includes('admin')

    const filtered = appsConfig.filter((app) => {
      if (isUserAdmin) return true
      return userRoles.includes(app.requiredRole)
    })

    return {
      allowedApps: filtered,
      isAdmin: isUserAdmin,
      effectiveRoles: userRoles,
    }
  }, [roles, user, oidcAuth?.user])

  return {
    allowedApps,
    isAdmin,
    totalApps: appsConfig.length,
    userRoles: effectiveRoles,
    hasAccess: allowedApps.length > 0,
  }
}

export default useAppRoles
