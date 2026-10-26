import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ErrorPage = () => {
  const [searchParams] = useSearchParams()
  const { signinRedirect } = useAuth()

  const errorTitle = searchParams.get('error') || 'Autentikasi Dibatalkan atau Gagal'
  const errorDesc = searchParams.get('error_description') || 'Proses otorisasi Keycloak tidak dapat diselesaikan atau akses ditolak.'
  const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:3000'

  const handleRetry = () => {
    sessionStorage.removeItem('PORTAL_REDIRECT_TARGET')
    signinRedirect()
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Gagal Masuk</h2>
        <p className="text-xs uppercase tracking-wider font-semibold text-rose-400 mb-4">{errorTitle}</p>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{errorDesc}</p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Login Lagi</span>
          </button>

          <a
            href={landingUrl}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
