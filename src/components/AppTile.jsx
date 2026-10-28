import React from 'react'
import { ArrowUpRight, Map, TreePine, Waves, Compass, Sprout, Shield, Sparkles } from 'lucide-react'
import useLanguage from '../hooks/useLanguage'

const iconMap = {
  Map,
  TreePine,
  Waves,
  Compass,
  Sprout,
}

const getTargetUrl = (app) => {
  if (!app.entryPath) return app.url
  const base = (app.url || '').replace(/\/+$/, '')
  const path = app.entryPath.replace(/^\/+/, '')
  return `${base}/${path}`
}

export default function AppTile({ app }) {
  const { t } = useLanguage()

  const IconComponent = iconMap[app.iconName] || Shield
  const targetUrl = getTargetUrl(app)

  const appData = t.apps?.[app.appKey || app.id] || {
    name: app.name,
    category: 'Application',
    description: app.description,
  }

  // Fallback styling tokens if not defined in config
  const topBarGradient = app.topBarGradient || 'from-indigo-500 to-blue-500'
  const iconBoxClass = app.iconBoxClass || 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
  const badgeClass = app.badgeClass || 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
  const buttonHoverClass = app.buttonHoverClass || 'hover:bg-indigo-600 hover:text-white'
  const glowBorder = app.glowBorder || 'hover:border-indigo-400/50'

  return (
    <div className={`group relative rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${glowBorder} overflow-hidden`}>
      {/* Colorful Accent Top Border */}
      <div className={`h-1 w-full bg-gradient-to-r ${topBarGradient}`} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Top bar: Dynamic Icon & Category Badge */}
        <div className="flex items-center justify-between mb-3.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 shadow-xs ${iconBoxClass}`}>
            <IconComponent className="w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${badgeClass}`}>
            {appData.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
          {appData.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-1">
          {appData.description}
        </p>

        {/* Tags / Feature Chips */}
        {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5 pt-1">
            {app.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Launch Action Button */}
      <div className="p-5 pt-0">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-xs ${buttonHoverClass}`}
        >
          <span>{t.launchApp}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </a>
      </div>
    </div>
  )
}
