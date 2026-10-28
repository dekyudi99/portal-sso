import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, ChevronDown } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useTheme from '../hooks/useTheme'
import useLanguage from '../hooks/useLanguage'
import UserMenu from './UserMenu'
import logoImg from '../assets/logo.jpeg'

const Header = () => {
  const { user, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const { lang, setLang, t } = useLanguage()

  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langRef = useRef(null)

  const portalTitle = import.meta.env.VITE_PORTAL_TITLE || 'WEFGIS'
  const portalBadge = import.meta.env.VITE_PORTAL_BADGE || t.portalBadge || 'Single Sign-On'

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'th', label: 'ภาษาไทย (Thai)', flag: '🇹🇭' },
  ]

  const currentLang = languages.find((l) => l.code === lang) || languages[0]

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-150 bg-white/90 border-slate-200/80 dark:bg-slate-950/90 dark:border-slate-800/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        
        {/* Left: Logo + Portal Name + Pill Badge */}
        <Link to="/" className="flex items-center space-x-3 text-decoration-none group">
          <div className="w-8 h-8 rounded-lg p-0.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-emerald-400 shadow-xs flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
            <img 
              src={logoImg} 
              alt={`${portalTitle} Logo`} 
              className="w-full h-full object-cover rounded-[6px]" 
            />
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
              {portalTitle}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-cyan-500/10 text-indigo-700 dark:text-cyan-300 border border-indigo-200/60 dark:border-cyan-800/60 hidden sm:inline-block">
              {portalBadge}
            </span>
          </div>
        </Link>

        {/* Right: Language Selector, Theme Toggle, UserMenu */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
              aria-label="Select language"
              aria-expanded={langDropdownOpen}
            >
              <span className="text-sm leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline uppercase text-[11px] font-bold tracking-wider">{currentLang.code}</span>
              <ChevronDown className="w-3 h-3 opacity-60" aria-hidden="true" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl py-1.5 z-50 shadow-lg border bg-white/95 backdrop-blur-md border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code)
                      setLangDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 transition-colors cursor-pointer ${
                      l.code === lang
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <span className="text-sm">{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
            title={isDark ? t.themeLight : t.themeDark}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" aria-hidden="true" />
            )}
          </button>

          {/* Reusable Profile Dropdown Menu */}
          <UserMenu user={user} logout={logout} t={t} />

        </div>
      </div>
    </header>
  )
}

export default Header
