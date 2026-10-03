import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle, ServerOff } from 'lucide-react';

export const InternalAuthWall = () => {
  const { loginUserSession } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Invalid email or password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUserSession(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
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
              AUTHENTICATED ACCESS
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#111111] bg-[#F5F5F5] px-3.5 py-2 rounded-xl border border-[#E8E8E8]">
          <ShieldCheck className="w-4 h-4 text-[#E42129]" />
          <span>Protected Supabase Auth</span>
        </div>
      </div>

      {/* Main Split-Screen Authentication Container */}
      <div className="max-w-5xl w-full mx-auto z-10 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E8E8E8] shadow-card overflow-hidden">
          
          {/* Left Column: Visual Showcase using Cloudinary Asset & Kalaignar Quote */}
          <div className="lg:col-span-5 relative bg-[#111111] p-8 text-white flex flex-col justify-between hidden md:flex min-h-[500px]">
            <div className="absolute inset-0 z-0 opacity-40">
              <img
                src="https://res.cloudinary.com/dikaxqooz/image/upload/w_600,f_auto,q_auto/v1790526461/4_bjljdl.webp"
                alt="D-Core Technology Visual Showcase"
                className="w-full h-full object-cover"
                width="600"
                height="800"
                fetchpriority="high"
                decoding="async"
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
                <span>Supabase Secure Authentication</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Form / Backend Not Configured Screen */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5 flex flex-col justify-center">
            
            {!isSupabaseConfigured ? (
              /* Backend Not Configured Screen */
              <div className="space-y-4 text-center p-6 bg-red-50 rounded-2xl border border-red-200">
                <ServerOff className="w-12 h-12 text-[#E42129] mx-auto" />
                <h2 className="text-xl font-black text-[#111111]">Backend Not Configured</h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Supabase environment variables (<code className="font-mono text-red-600 bg-white px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono text-red-600 bg-white px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>) are missing.
                </p>
                <p className="text-xs font-bold text-slate-600">
                  Please configure environment variables in your Vercel / local settings to enable authentication.
                </p>
              </div>
            ) : (
              /* Real Supabase Email + Password Login Form */
              <>
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#E42129] bg-red-50 px-2.5 py-1 rounded border border-red-100 inline-block">
                    RESTRICTED GATEWAY
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight pt-1">
                    Sign In to Portal
                  </h2>
                  <p className="text-xs text-[#666666] font-medium">
                    Enter your authorized team email and password to access D-Core Operations.
                  </p>
                </div>

                {/* Tamil Quote Banner */}
                <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-[#111111] space-y-1">
                  <p className="text-xs font-bold text-[#E42129] italic leading-relaxed font-tamil">
                    "உண்மையை மறைக்க முனைவது, விதையை பூமிக்குள் மறைப்பதுபோலத்தான்."
                  </p>
                  <p className="text-[10px] font-black text-[#111111] text-right font-tamil">
                    — கலைஞர் மு.கருணாநிதி
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium pt-2">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#E42129] font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#E42129] shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label htmlFor="auth-email-input" className="block text-[#111111] font-extrabold mb-1.5 text-xs">
                      Authorized Email Address *
                    </label>
                    <div className="relative">
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        placeholder="admin@dcore.ops"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-[#E42129] text-sm font-semibold text-[#111111] transition-all placeholder-slate-400"
                        autoFocus
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="auth-password-input" className="block text-[#111111] font-extrabold mb-1.5 text-xs">
                      Account Password *
                    </label>
                    <div className="relative">
                      <input
                        id="auth-password-input"
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F5F5] border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-[#E42129] text-sm font-mono text-[#111111] transition-all placeholder-slate-400"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <p className="text-[11px] text-[#666666] font-medium text-center pt-1">
                  🔒 Authenticated access enforced — Authorized team members only.
                </p>
              </>
            )}

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
