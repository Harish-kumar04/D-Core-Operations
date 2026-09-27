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
  const [memberName, setMemberName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!memberName.trim()) {
      setError('Your name is required to enter the portal and record history audit logs.');
      return;
    }

    if (!passcode.trim()) {
      setError('Please enter your authorized passcode.');
      return;
    }

    const res = loginUserSession(selectedUser.name, passcode, memberName);
    if (!res.success) {
      setError(res.error || `Incorrect passcode for ${selectedUser.name}.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex flex-col justify-between p-4 sm:p-8 selection:bg-red-100 selection:text-[#E42129] relative overflow-hidden font-sans">
      
      {/* Background Micro Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-red-50/50 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Top Header Logo */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10 py-3 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dikaxqooz/image/upload/v1790443218/ChatGPT_Image_Sep_26_2026_10_47_31_PM_mtiwsu.png"
            alt="D-CORE Logo"
            className="w-11 h-11 object-contain rounded-2xl shadow-xs border border-[#E8E8E8]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-2xl text-[#111111]">D-CORE</span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#E42129] text-white">
                INTERNAL PORTAL
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-wider text-[#666666] uppercase -mt-0.5">
              AUTHORIZED ADMIN ACCESS
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#111111] bg-[#F5F5F5] px-3.5 py-2 rounded-xl border border-[#E8E8E8]">
          <ShieldCheck className="w-4 h-4 text-[#E42129]" />
          <span>Protected Authentication</span>
        </div>
      </div>

      {/* Main Split-Screen Authentication Container */}
      <div className="max-w-5xl w-full mx-auto z-10 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E8E8E8] shadow-card overflow-hidden">
          
          {/* Left Column: Visual Showcase using Cloudinary Asset & Kalaignar Quote */}
          <div className="lg:col-span-5 relative bg-[#111111] p-8 text-white flex flex-col justify-between hidden md:flex min-h-[500px]">
            <div className="absolute inset-0 z-0 opacity-40">
              <img
                src="https://res.cloudinary.com/dikaxqooz/image/upload/v1790526461/4_bjljdl.webp"
                alt="D-Core Technology Visual"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent z-0"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3 text-[#E42129]" />
                <span>DMK DIGITAL OPERATIONS CENTER</span>
              </div>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
                Operations at Scale.<br />Technology at the Core.
              </h3>
            </div>

            <div className="relative z-10 space-y-4 pt-6 border-t border-white/10">
              {/* Integrated Kalaignar Quote */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-1.5">
                <p className="text-xs sm:text-sm font-bold italic text-red-100 leading-relaxed font-tamil">
                  "உண்மையை மறைக்க முனைவது, விதையை பூமிக்குள் மறைப்பதுபோலத்தான்."
                </p>
                <p className="text-[11px] font-extrabold text-white text-right font-tamil">
                  — கலைஞர் மு.கருணாநிதி
                </p>
              </div>

              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Centralized management for digital archives, platform infrastructure, current works, and workflow queues.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-red-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#E42129] animate-pulse"></span>
                <span>Audit Log Identity Gateway</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5 flex flex-col justify-center">
            
            {/* Header */}
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#E42129] bg-red-50 px-2.5 py-1 rounded border border-red-100 inline-block">
                RESTRICTED GATEWAY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight pt-1">
                Select Admin Profile
              </h2>
              <p className="text-xs text-[#666666] font-medium">
                Enter your name and select your authorized profile to record operations in history logs.
              </p>
            </div>

            {/* Tamil Quote Card Banner on Form Side */}
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-[#111111] space-y-1">
              <p className="text-xs font-bold text-[#E42129] italic leading-relaxed font-tamil">
                "உண்மையை மறைக்க முனைவது, விதையை பூமிக்குள் மறைப்பதுபோலத்தான்."
              </p>
              <p className="text-[10px] font-black text-[#111111] text-right font-tamil">
                — கலைஞர் மு.கருணாநிதி
              </p>
            </div>

            {/* User Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUTHORIZED_USERS.map((usr) => {
                const isSelected = selectedUser.id === usr.id;

                return (
                  <div
                    key={usr.id}
                    onClick={() => {
                      setSelectedUser(usr);
                      setError('');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-red-50/90 border-[#E42129] shadow-xs'
                        : 'bg-[#F5F5F5] border-[#E8E8E8] hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected ? 'bg-[#E42129] text-white shadow-xs' : 'bg-white text-[#111111] border border-[#E8E8E8]'
                      }`}>
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-[#111111] flex items-center gap-1.5">
                          <span>{usr.name}</span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-100 text-[#E42129]">
                            ADMIN
                          </span>
                        </h4>
                        <p className="text-[10px] text-[#666666] font-medium">{usr.roleTitle}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#E42129] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Form Inputs (Mandatory Name + Passcode) */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium pt-3 border-t border-[#E8E8E8]">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#E42129] font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E42129] shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Mandatory Member Name Field */}
              <div>
                <label className="block text-[#111111] font-extrabold mb-1.5 text-xs flex items-center justify-between">
                  <span>Your Full Name / Member Name *</span>
                  <span className="text-[10px] text-[#E42129] font-bold uppercase tracking-wider">Required for Audit Logs</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name (e.g. Sentinel / Member Name)"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-[#E42129] text-sm font-semibold text-[#111111] transition-all placeholder-slate-400"
                    autoFocus
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Passcode Field */}
              <div>
                <label className="block text-[#111111] font-extrabold mb-1.5 text-xs">
                  Passcode for <span className="text-[#E42129] font-black">{selectedUser.name}</span> *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-[#E42129] text-sm font-mono text-[#111111] transition-all placeholder-slate-400"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5"
              >
                <span>Authenticate & Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-[#666666] font-medium text-center pt-1">
              🔒 Identity verification enabled — All actions are logged into history.
            </p>

          </div>

        </div>
      </div>

      {/* Page Bottom Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-3 text-[11px] text-[#666666] z-10 border-t border-[#E8E8E8] font-medium">
        <p>© 2026 D-CORE OPERATIONS — DMK Digital Technology Platform</p>
      </footer>
    </div>
  );
};
