import { Loader2, ShieldCheck } from 'lucide-react'

const LoadingScreen = ({ message = 'Memverifikasi sesi Keycloak...' }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse">
          <ShieldCheck className="w-9 h-9 text-white" />
        </div>
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin absolute -bottom-2 -right-2 bg-slate-950 rounded-full p-0.5 border border-slate-800" />
      </div>
      <h2 className="text-xl font-bold text-slate-100 mb-2">Astra Ecosystem Portal</h2>
      <p className="text-sm text-slate-400 font-medium animate-pulse">{message}</p>
    </div>
  )
}

export default LoadingScreen
