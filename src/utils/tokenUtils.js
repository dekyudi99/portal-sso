/**
 * Fungsi tunggal untuk mengekstrak realm roles dari user Keycloak OIDC.
 * Membaca payload JWT dari user.access_token (decode base64url tanpa verifikasi tanda tangan),
 * dengan fallback ke user.profile bila ada.
 * Menangani token yang tidak valid/rusak dengan mengembalikan array kosong [] tanpa crash.
 *
 * @param {object|null} user - OIDC user object
 * @returns {string[]} daftar realm roles
 */
export const getRealmRoles = (user) => {
  if (!user) return []

  // 1. Baca payload JWT dari user.access_token
  if (user.access_token && typeof user.access_token === 'string') {
    try {
      const parts = user.access_token.split('.')
      if (parts.length === 3) {
        const base64Url = parts[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
        const jsonPayload = decodeURIComponent(
          atob(padded)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const parsed = JSON.parse(jsonPayload)
        if (Array.isArray(parsed?.realm_access?.roles)) {
          return parsed.realm_access.roles
        }
      }
    } catch {
      // Jangan crash jika token rusak/tidak bisa di-decode, lanjut ke fallback
    }
  }

  // 2. Fallback: Baca dari user.profile jika sudah ada di ID token
  if (Array.isArray(user.profile?.realm_access?.roles)) {
    return user.profile.realm_access.roles
  }

  // 3. Fallback: Jika objek user sudah memiliki roles (state internal)
  if (Array.isArray(user.roles)) {
    return user.roles
  }

  return []
}

export default getRealmRoles
