import React from 'react'
import { Loader2 } from 'lucide-react'
import logoImg from '../assets/logo.jpeg'

const LoadingScreen = ({ message = 'Verifying session...' }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-400 shadow-lg">
          <img src={logoImg} alt="WEFGIS" className="w-full h-full object-cover rounded-[14px]" />
        </div>
        <div className="flex items-center space-x-2 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
