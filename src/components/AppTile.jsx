import { ArrowUpRight, Map, TreePine, Waves, Compass, Shield } from 'lucide-react'

const iconMap = {
  Map,
  TreePine,
  Waves,
  Compass,
}

const colorMap = {
  emerald: {
    bgHover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    iconBg: 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
  },
  blue: {
    bgHover: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    iconBg: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
  },
  cyan: {
    bgHover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconBg: 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white',
    btn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20',
  },
}

const getTargetUrl = (app) => {
  if (!app.entryPath) return app.url
  const base = (app.url || '').replace(/\/+$/, '')
  const path = app.entryPath.replace(/^\/+/, '')
  return `${base}/${path}`
}

const AppTile = ({ app }) => {
  const IconComponent = iconMap[app.iconName] || Shield
  const theme = colorMap[app.colorScheme] || colorMap.blue
  const targetUrl = getTargetUrl(app)

  return (
    <div className={`group relative rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.bgHover}`}>
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top bar: Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${theme.iconBg}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${theme.badge}`}>
            {app.badge}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
          {app.name}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
          {app.description}
        </p>
      </div>

      {/* Action Button: Langsung ke entryPath dashboard atau fallback app.url */}
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-200 shadow-md ${theme.btn}`}
      >
        <span>Buka Platform</span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  )
}

export default AppTile
