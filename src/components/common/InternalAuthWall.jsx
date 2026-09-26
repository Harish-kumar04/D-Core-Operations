import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, ArrowRight, UserCheck, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

export const InternalAuthWall = () => {
  const { loginUserSession } = useApp();
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [accessMode, setAccessMode] = useState('MEMBER'); // MEMBER or ADMIN
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your Name before signing in.');
      return;
    }

    const res = loginUserSession(name, passcode, accessMode === 'ADMIN');
    if (!res.success) {
      setError(res.error || 'Invalid passcode or credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 selection:bg-red-100 selection:text-dcore-red relative overflow-hidden">
      
      {/* Background Subtle Red & Tech Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-dcore-red/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-dcore-maroon/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Header Logo */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dcore-red to-dcore-maroon text-white flex items-center justify-center font-black text-xl shadow-lg shadow-dcore-red/30">
            <span className="tracking-tighter">D</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-xl text-white">D-CORE</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800">
                INTERNAL
              </span>
            </div>
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
              OPERATIONS PORTAL
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Restricted Network</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto z-10 my-auto py-8">
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-slate-950/80 space-y-6 relative">
          
          {/* Subtle Red Top Bar */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-dcore-red via-red-600 to-dcore-maroon rounded-b"></div>

          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-300 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-dcore-red" />
              <span>Internal Authentication Gateway</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight pt-2">
              Sign In to D-Core Operations
            </h2>

            <p className="text-xs text-slate-400 font-medium">
              Technology at the Core. Operations at Scale.
            </p>
          </div>

          {/* Access Mode Switcher */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAccessMode('MEMBER');
                setPasscode('dcore2026');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                accessMode === 'MEMBER'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Team Access</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAccessMode('ADMIN');
                setPasscode('admin123');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                accessMode === 'ADMIN'
                  ? 'bg-dcore-red text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Your Full Name / Team Identifier *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arun Kumar / Priya R."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-dcore-red text-sm font-bold text-white placeholder-slate-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                <span>{accessMode === 'ADMIN' ? 'Admin Password' : 'Internal Passcode'} *</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {accessMode === 'ADMIN' ? 'Default: admin123' : 'Default: dcore2026'}
                </span>
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-dcore-red text-sm font-mono text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-dcore-red to-dcore-maroon hover:opacity-95 text-white py-3.5 rounded-xl font-extrabold text-xs shadow-lg shadow-dcore-red/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Authenticate & Enter Operations Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Security Notice */}
          <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1 border-t border-slate-800/80">
            <p>🔒 Closed Internal Application for DMK Technology Operations.</p>
            <p className="font-mono text-[10px] text-slate-600">Unauthorized access attempts are monitored and logged.</p>
          </div>

        </div>
      </div>

      {/* Page Bottom Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-3 text-[11px] text-slate-500 z-10 border-t border-slate-900">
        <p>© 2026 D-CORE OPERATIONS — Restricted Access</p>
      </footer>
    </div>
  );
};
