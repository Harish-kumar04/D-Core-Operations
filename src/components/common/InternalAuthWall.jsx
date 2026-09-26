import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, ArrowRight, UserCheck, Sparkles, AlertCircle, Check } from 'lucide-react';

export const AUTHORIZED_USERS = [
  {
    id: 'user_1',
    name: 'admin',
    roleTitle: 'Primary System Admin',
    role: 'ADMIN',
    email: 'admin@dcore.ops',
    passcode: 'admin@321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_2',
    name: 'admin2',
    roleTitle: 'Operations Admin',
    role: 'ADMIN',
    email: 'admin2@dcore.ops',
    passcode: 'admin!321',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_3',
    name: 'admin3',
    roleTitle: 'DMK Infrastructure Admin',
    role: 'ADMIN',
    email: 'admin3@dcore.ops',
    passcode: 'admin@dmk67',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_4',
    name: 'admin4',
    roleTitle: 'Core Ops Admin',
    role: 'ADMIN',
    email: 'admin4@dcore.ops',
    passcode: 'admin@dcore67',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const InternalAuthWall = () => {
  const { loginUserSession } = useApp();
  const [selectedUser, setSelectedUser] = useState(AUTHORIZED_USERS[0]);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!passcode.trim()) {
      setError('Please enter your authorized passcode.');
      return;
    }

    const res = loginUserSession(selectedUser.name, passcode, selectedUser.role === 'ADMIN');
    if (!res.success) {
      setError(`Incorrect passcode for ${selectedUser.name}.`);
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
                INTERNAL PORTAL
              </span>
            </div>
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-0.5">
              RESTRICTED — 4 AUTHORIZED USERS
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict 4-User Authentication</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-2xl w-full mx-auto z-10 my-auto py-6">
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-slate-950/80 space-y-6 relative">
          
          {/* Subtle Red Top Bar */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-dcore-red via-red-600 to-dcore-maroon rounded-b"></div>

          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-300 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-dcore-red" />
              <span>PRODUCTION READY PORTAL GATEWAY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
              Select Your User Profile
            </h2>

            <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">
              Choose your authorized profile from the 4 internal D-Core team members below to authenticate.
            </p>
          </div>

          {/* 4 Authorized User Cards Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {AUTHORIZED_USERS.map((usr) => {
              const isSelected = selectedUser.id === usr.id;
              const isAdmin = usr.role === 'ADMIN';

              return (
                <div
                  key={usr.id}
                  onClick={() => {
                    setSelectedUser(usr);
                    setPasscode('');
                    setError('');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-dcore-red ring-2 ring-dcore-red/40 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700 shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                        <span>{usr.name}</span>
                        {isAdmin && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-dcore-red text-white">
                            ADMIN
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{usr.roleTitle}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-dcore-red text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form with Passcode Input */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium pt-2 border-t border-slate-800/80">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-bold">
                  Enter Authorized Passcode for <span className="text-dcore-red font-black">{selectedUser.name}</span> *
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  Passcode: <strong className="text-slate-300 font-mono">{selectedUser.passcode}</strong>
                </span>
              </div>
              <input
                type="password"
                required
                placeholder={`Passcode for ${selectedUser.name}`}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-dcore-red text-sm font-mono text-white"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-dcore-red to-dcore-maroon hover:opacity-95 text-white py-3.5 rounded-xl font-extrabold text-xs shadow-lg shadow-dcore-red/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Authenticate as {selectedUser.name} ({selectedUser.role})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Security Notice */}
          <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1">
            <p>🔒 Strictly restricted to 4 authorized team members.</p>
          </div>

        </div>
      </div>

      {/* Page Bottom Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-3 text-[11px] text-slate-500 z-10 border-t border-slate-900">
        <p>© 2026 D-CORE OPERATIONS — Production Ready Supabase Backend</p>
      </footer>
    </div>
  );
};
