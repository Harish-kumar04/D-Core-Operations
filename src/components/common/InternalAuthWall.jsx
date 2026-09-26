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
    passcode: 'admin@321'
  },
  {
    id: 'user_2',
    name: 'admin2',
    roleTitle: 'Operations Admin',
    role: 'ADMIN',
    email: 'admin2@dcore.ops',
    passcode: 'admin!321'
  },
  {
    id: 'user_3',
    name: 'admin3',
    roleTitle: 'DMK Infrastructure Admin',
    role: 'ADMIN',
    email: 'admin3@dcore.ops',
    passcode: 'admin@dmk67'
  },
  {
    id: 'user_4',
    name: 'admin4',
    roleTitle: 'Core Ops Admin',
    role: 'ADMIN',
    email: 'admin4@dcore.ops',
    passcode: 'admin@dcore67'
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

    const res = loginUserSession(selectedUser.name, passcode);
    if (!res.success) {
      setError(`Incorrect passcode for ${selectedUser.name}.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-8 selection:bg-red-100 selection:text-dcore-red relative overflow-hidden font-sans">
      
      {/* Background Aesthetic Red Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-100/60 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-dcore-red/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Header Logo */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 py-3 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-dcore-red to-dcore-maroon text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-dcore-red/30 transform hover:rotate-3 transition-transform">
            <span className="tracking-tighter">D</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-2xl text-slate-900">D-CORE</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-dcore-red text-white shadow-xs">
                INTERNAL PORTAL
              </span>
            </div>
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase -mt-0.5">
              4 AUTHORIZED ADMIN USERS
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-dcore-red" />
          <span>Strict Internal Authentication</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-xl w-full mx-auto z-10 my-auto py-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/95 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-red-100/90 shadow-2xl shadow-red-950/10 space-y-7 relative overflow-hidden">
          
          {/* Top DMK Red Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-dcore-red via-red-600 to-dcore-maroon"></div>

          {/* Card Header */}
          <div className="text-center space-y-2 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 text-dcore-red border border-red-100 text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-dcore-red animate-spin" style={{ animationDuration: '6s' }} />
              <span>PRODUCTION OPERATIONS PORTAL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              Select Admin User
            </h2>

            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Select your authorized profile to sign into the D-Core operations center.
            </p>
          </div>

          {/* 4 Authorized User Cards Grid (No Pictures, Clean Aesthetic Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUTHORIZED_USERS.map((usr) => {
              const isSelected = selectedUser.id === usr.id;

              return (
                <div
                  key={usr.id}
                  onClick={() => {
                    setSelectedUser(usr);
                    setPasscode('');
                    setError('');
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group transform hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-red-50/80 border-dcore-red ring-2 ring-dcore-red/30 shadow-md'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                      isSelected ? 'bg-dcore-red text-white shadow-md shadow-dcore-red/30' : 'bg-white text-slate-600 border border-slate-200 group-hover:border-slate-300'
                    }`}>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{usr.name}</span>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-100 text-dcore-red">
                          ADMIN
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">{usr.roleTitle}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-dcore-red text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form with Passcode Input (NO HINT DISPLAYED) */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium pt-2 border-t border-slate-100">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-dcore-red font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-dcore-red shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-extrabold mb-1.5 text-xs">
                Passcode for <span className="text-dcore-red font-black">{selectedUser.name}</span> *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder={`Enter passcode`}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dcore-red/30 focus:border-dcore-red text-sm font-mono text-slate-900 transition-all placeholder-slate-400"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-dcore-red to-dcore-maroon hover:opacity-95 text-white py-3.5 rounded-xl font-extrabold text-xs shadow-lg shadow-dcore-red/25 hover:shadow-dcore-red/40 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Authenticate as {selectedUser.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Security Notice */}
          <div className="pt-1 text-center text-[11px] text-slate-400 font-medium">
            <p>🔒 Access restricted to authorized internal admin users.</p>
          </div>

        </div>
      </div>

      {/* Page Bottom Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-3 text-[11px] text-slate-400 z-10 border-t border-slate-200/60 font-medium">
        <p>© 2026 D-CORE OPERATIONS — DMK Digital Operations Platform</p>
      </footer>
    </div>
  );
};
