import React from 'react'

export default function Header({ onResetSession, isResetting, onNavigateHome }) {
  return (
    <header className="border-b border-slate-800/80 bg-[#0B1117]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={onNavigateHome}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF7A3D] via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-[#FF7A3D]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B1117] rounded-[14px] flex items-center justify-center">
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#FFB547] to-teal-200">
                  ♺
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                  Re<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFB547] to-teal-300">Volve</span>
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                One triage engine. Two waste streams. Five circular pathways.
              </p>
            </div>
          </div>

          {/* Engine Status Indicators & Demo Controls */}
          <div className="flex items-center space-x-3 text-xs">
            {onResetSession && (
              <button
                type="button"
                onClick={onResetSession}
                disabled={isResetting}
                className="px-3 py-1.5 rounded-xl bg-[#121B24] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition text-[11px] font-medium flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                title="Reset session impact ledger for fresh demo"
              >
                <span>↺</span>
                <span className="hidden sm:inline">Reset Ledger</span>
              </button>
            )}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#121B24] border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-[#FFB547] animate-pulse" />
              <span className="text-slate-300 font-medium">Engine Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

