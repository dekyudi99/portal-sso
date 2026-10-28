import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, User, LogOut, ShieldCheck, Sparkles } from 'lucide-react'

export default function UserMenu({ user, logout, t }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const itemRefs = useRef([])
  const navigate = useNavigate()

  // Menu items data configuration (reusable and dynamic)
  const menuItems = [
    {
      id: 'profile',
      label: t.menuProfile || 'Profile',
      icon: User,
      action: () => {
        closeMenu()
        navigate('/profile')
      },
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    {
      id: 'signout',
      label: t.menuSignOut || 'Sign out',
      icon: LogOut,
      action: () => {
        closeMenu()
        logout()
      },
      isMutedText: true,
      iconColor: 'text-rose-500 dark:text-rose-400',
    },
  ]

  const openMenu = () => {
    setIsOpen(true)
    setFocusedIndex(0)
  }

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setFocusedIndex(-1)
    if (triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeMenu])

  // Focus management for keyboard navigation
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus()
    }
  }, [isOpen, focusedIndex])

  // Keyboard navigation handler on trigger & menu
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openMenu()
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeMenu()
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) => (prev + 1) % menuItems.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length)
        break
      case 'Tab':
        closeMenu()
        break
      default:
        break
    }
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')
  const userRoles = user?.roles || []
  const primaryRole = userRoles.includes('admin') ? 'Admin' : (userRoles.includes('analyst') ? 'Analyst' : null)

  return (
    <div className="relative inline-block text-left" onKeyDown={handleKeyDown}>
      {/* Trigger Button: Vibrant Avatar gradient + Name + Chevron */}
      <button
        ref={triggerRef}
        type="button"
        id="user-menu-button"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="user-menu-dropdown"
        aria-label="User account menu"
        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
      >
        <span className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs">
          {initial}
        </span>
        <span className="text-xs font-semibold max-w-[120px] truncate hidden sm:inline-block">
          {user?.name || user?.username || 'User'}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          id="user-menu-dropdown"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1}
          className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl py-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Header section: Avatar + Name + Email + Role badge */}
          <div className="px-4 py-3 select-none flex items-center space-x-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || user?.username || 'User'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user?.email || user?.username || ''}
              </div>
              {primaryRole && (
                <div className="mt-1">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    primaryRole === 'Admin'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{primaryRole}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thin divider */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" role="separator" />

          {/* Action Items */}
          <div className="p-1 space-y-0.5">
            {menuItems.map((item, index) => {
              const ItemIcon = item.icon
              return (
                <button
                  key={item.id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  role="menuitem"
                  id={`user-menu-item-${item.id}`}
                  tabIndex={focusedIndex === index ? 0 : -1}
                  onClick={item.action}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2.5 text-xs font-medium transition-colors cursor-pointer ${
                    focusedIndex === index
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <ItemIcon className={`w-4 h-4 shrink-0 ${item.iconColor || 'text-slate-400'}`} aria-hidden="true" />
                  <span className={item.isMutedText ? 'text-slate-600 dark:text-slate-400 font-semibold' : 'text-slate-800 dark:text-slate-200'}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
