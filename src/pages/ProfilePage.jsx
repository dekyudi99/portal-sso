import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, KeyRound, Loader2, Check, AlertCircle, Shield, User as UserIcon } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useLanguage from '../hooks/useLanguage'
import Header from '../components/Header'
import { getOidcAccessToken } from '../services/oidcTokenService'

export default function ProfilePage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const authority = import.meta.env.VITE_KEYCLOAK_AUTHORITY || 'http://localhost:8081/realms/wefgis'
  const accountBaseUrl = import.meta.env.VITE_KEYCLOAK_ACCOUNT_URL || `${authority.replace(/\/+$/, '')}/account`
  const portalTitle = import.meta.env.VITE_PORTAL_TITLE || 'WEFGIS'

  // Fetch current user profile directly from Keycloak Account API
  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      setIsLoading(true)
      setErrorMsg('')

      try {
        const token = getOidcAccessToken()
        if (!token) {
          throw new Error('Sesi autentikasi tidak ditemukan. Silakan login kembali.')
        }

        const endpoint = `${accountBaseUrl.replace(/\/+$/, '')}`
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })

        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            if (isMounted) {
              setFormData({
                username: user?.preferred_username || user?.username || '',
                firstName: user?.profile?.given_name || (user?.name ? user.name.split(' ')[0] : '') || '',
                lastName: user?.profile?.family_name || (user?.name ? user.name.split(' ').slice(1).join(' ') : '') || '',
                email: user?.email || '',
              })
            }
            return
          }
          throw new Error(`Gagal mengambil data profil (HTTP ${res.status})`)
        }

        const data = await res.json()
        if (isMounted) {
          setFormData({
            username: data.username || user?.preferred_username || user?.username || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || user?.email || '',
          })
        }
      } catch (err) {
        if (isMounted) {
          setFormData({
            username: user?.preferred_username || user?.username || '',
            firstName: user?.profile?.given_name || (user?.name ? user.name.split(' ')[0] : '') || '',
            lastName: user?.profile?.family_name || (user?.name ? user.name.split(' ').slice(1).join(' ') : '') || '',
            email: user?.email || '',
          })
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchProfile()
    return () => {
      isMounted = false
    }
  }, [accountBaseUrl, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const token = getOidcAccessToken()
      if (!token) {
        throw new Error('Sesi autentikasi tidak ditemukan.')
      }

      if (!formData.firstName.trim()) {
        throw new Error(t.errFirstNameRequired || 'First name is required.')
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        throw new Error(t.errEmailInvalid || 'Valid email address is required.')
      }

      const endpoint = `${accountBaseUrl.replace(/\/+$/, '')}`
      const payload = {
        username: formData.username,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let errorDetail = ''
        try {
          const errJson = await res.json()
          errorDetail = errJson.errorMessage || errJson.error || ''
        } catch {
          // ignore json parse error
        }
        throw new Error(errorDetail || `Gagal memperbarui profil (HTTP ${res.status})`)
      }

      setSuccessMsg(t.profileSaved || 'Profil berhasil diperbarui.')
    } catch (err) {
      setErrorMsg(err.message || (t.profileError || 'Gagal menyimpan perubahan profil.'))
    } finally {
      setIsSaving(false)
    }
  }

  // URL untuk ubah password via Keycloak Account Console
  const changePasswordUrl = `${accountBaseUrl.replace(/\/+$/, '')}/#/security/signingin?referrer=portal&referrer_uri=${encodeURIComponent(window.location.origin + '/profile')}`
  const initial = formData.firstName ? formData.firstName.charAt(0).toUpperCase() : (formData.username ? formData.username.charAt(0).toUpperCase() : 'U')

  return (
    <div className="relative min-h-screen transition-colors duration-150 bg-slate-50/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-500/6 via-indigo-500/4 to-transparent pointer-events-none" />

      <Header />

      <main className="relative flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToDashboard}</span>
          </Link>
        </div>

        {/* User Identity Header Card */}
        <div className="mb-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-xs flex items-center space-x-4">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-xl shadow-sm shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {formData.firstName ? `${formData.firstName} ${formData.lastName}`.trim() : (formData.username || 'User Profile')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {formData.email || user?.email || 'Keycloak OIDC Account'}
            </p>
          </div>
        </div>

        {/* Feedback Banners */}
        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Main Form Card */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          {isLoading ? (
            <div className="py-14 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-xs font-medium">Memuat data akun...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username (Read-Only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.username}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  disabled
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 cursor-not-allowed select-none font-mono"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  {t.usernameHelp}
                </span>
              </div>

              {/* Name fields row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.firstName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 dark:focus:border-blue-400/60 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.lastName}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 dark:focus:border-blue-400/60 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.email} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 dark:focus:border-blue-400/60 transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white disabled:opacity-50 transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? t.saving : t.saveChanges}</span>
                </button>
              </div>

            </form>
          )}

          {/* Password Security Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                  <span>{t.changePassword}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.changePasswordHelp}
                </p>
              </div>
              <a
                href={changePasswordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
              >
                <span>{t.changePassword}</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-5 text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 {portalTitle} Single Sign-On Portal. All rights reserved.
      </footer>
    </div>
  )
}
