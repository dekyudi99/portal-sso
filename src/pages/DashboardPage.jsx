import { ShieldAlert, Sparkles, Layers, ShieldCheck } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useAppRoles from '../hooks/useAppRoles'
import Header from '../components/Header'
import AppTile from '../components/AppTile'

const DashboardPage = () => {
  const { user } = useAuth()
  const { allowedApps, hasAccess, isAdmin } = useAppRoles()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Single Sign-On Command Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Selamat Datang, <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Akses seluruh platform analitik geospasial dan ekologi ekosistem Astra dalam satu pintu otentikasi terpadu.
          </p>
        </div>

        {/* Tiles Grid atau Empty State */}
        {hasAccess ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-300">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Platform Tersedia ({allowedApps.length})</span>
              </div>
              {isAdmin && (
                <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Mode Administrator: Menampilkan Seluruh Aplikasi
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allowedApps.map((app) => (
                <AppTile key={app.id} app={app} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State jika user tidak memiliki role aplikasi */
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-xl mt-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Belum Ada Akses Aplikasi</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Akun Anda belum memiliki izin (role) untuk membuka aplikasi manapun dalam ekosistem ini. Silakan hubungi Administrator untuk meminta hak akses role aplikasi.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-500 font-mono">
              User ID: {user?.sub}
            </div>
          </div>
        )}
      </main>

      {/* Security Disclaimer Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="flex items-center justify-center space-x-1.5 mb-1 text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Keamanan Terdesentralisasi Terverifikasi</span>
          </p>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Catatan: Menyembunyikan kartu aplikasi pada portal ini bukan merupakan pengamanan tunggal. Setiap aplikasi secara mandiri memverifikasi token dan hak akses role masing-masing pengguna.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage
