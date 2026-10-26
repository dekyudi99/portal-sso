import { Shield, ExternalLink, LogOut, User, Sparkles } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Header = () => {
  const { user, logout } = useAuth()
  const accountUrl = import.meta.env.VITE_KEYCLOAK_ACCOUNT_URL || 'http://localhost:8080/realms/astra/account'

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-white">
                ASTRA<span className="text-emerald-400">GIS</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Portal SSO
              </span>
            </div>
            <p className="text-xs text-slate-400">Integrated Spatial Ecosystem</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <span>{user?.name || 'User'}</span>
                {user?.isAdmin && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Admin
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                {user?.email || user?.username}
              </div>
            </div>
          </div>

          {/* Kelola Akun Keycloak */}
          <a
            href={accountUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-all duration-150"
            title="Buka konsol manajemen akun profil Keycloak"
          >
            <span>Kelola Akun</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all duration-150 cursor-pointer"
            title="Keluar dari seluruh sesi SSO"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
