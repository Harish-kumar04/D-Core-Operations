import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, ShieldCheck, UserCheck, KeyRound } from 'lucide-react';

export const AdminLoginModal = ({ isOpen, onClose }) => {
  const { loginAdmin } = useApp();
  const [email, setEmail] = useState('admin@dcore.ops');
  const [password, setPassword] = useState('admin123');
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminName.trim()) {
      setError('Please enter your Name so your edits can be recorded in the History Audit Log.');
      return;
    }
    const res = loginAdmin(email, password, adminName);
    if (res.success) {
      setError('');
      onClose();
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-dcore-maroon text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-dcore-red text-white flex items-center justify-center shadow-lg mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">Admin Access Login</h3>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Authenticate as Administrator to unlock full data editing and record audit history.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-dcore-red font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-extrabold mb-1">
              Your Name * <span className="text-dcore-red font-normal">(Recorded in History Log)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Arun Kumar / Operations Manager"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red text-sm font-bold text-slate-900"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Admin Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red font-mono text-slate-800"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-mono">
            Default Credentials: <strong>admin@dcore.ops</strong> / <strong>admin123</strong>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-extrabold text-white bg-dcore-red hover:bg-dcore-red-hover shadow-md shadow-dcore-red/20 transition-all hover:scale-[1.02]"
            >
              Unlock Admin Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
