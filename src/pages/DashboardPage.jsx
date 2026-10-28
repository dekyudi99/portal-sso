import React, { useState } from 'react'
import { ShieldAlert, Search, Sparkles, CheckCircle2 } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useAppRoles from '../hooks/useAppRoles'
import useLanguage from '../hooks/useLanguage'
import Header from '../components/Header'
import AppTile from '../components/AppTile'

export default function DashboardPage() {
  const { user } = useAuth()
  const { allowedApps, hasAccess, isAdmin } = useAppRoles()
  const { t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')

  const filteredApps = allowedApps.filter((app) => {
    const appData = t.apps?.[app.appKey || app.id]
    const nameMatch = (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (appData?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const descMatch = (app.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (appData?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    return nameMatch || descMatch
  })

  const portalTitle = import.meta.env.VITE_PORTAL_TITLE || 'WEFGIS'

  return (
    <div className="relative min-h-screen transition-colors duration-150 bg-slate-50/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Ambient Top Glow for subtle colorful depth */}
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-blue-500/6 via-indigo-500/4 to-transparent pointer-events-none" />

      <Header />

      <main className="relative flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Welcome Hero Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200/70 dark:border-slate-800/70">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Active SSO Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.welcome}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
                {user?.name || user?.username}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {t.subtitle}
            </p>
          </div>

          {/* Quick Counter Pill */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{t.availableApps}:</span>
            <span className="px-2 py-0.5 rounded-md font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {filteredApps.length}
            </span>
          </div>
        </div>

        {/* Toolbar: Search Filter */}
        {allowedApps.length > 2 && (
          <div className="flex items-center justify-between mb-6">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-white text-slate-900 border border-slate-200/90 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/60 dark:focus:border-blue-400/60 transition-all shadow-xs"
              />
            </div>
          </div>
        )}

        {/* Apps Grid (Max 3 cols, rich colors, clean structure) */}
        {hasAccess && filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApps.map((app) => (
              <AppTile key={app.id} app={app} />
            ))}
          </div>
        ) : hasAccess && filteredApps.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            {t.noMatchText || `No application matching "${searchTerm}"`}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-12 px-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 mt-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-3.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              {t.noAccessTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {t.noAccessDesc}
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 text-[11px] font-mono">
              {t.userIdLabel}: {user?.sub}
            </div>
          </div>
        )}
      </main>

      {/* Minimal Single-Line Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-5 text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 {portalTitle} Single Sign-On Portal. All rights reserved.
      </footer>
    </div>
  )
}
