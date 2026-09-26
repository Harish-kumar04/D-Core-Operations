import React from 'react';
import { Quote as QuoteIcon } from 'lucide-react';

export const QuoteCard = ({
  quote,
  speaker,
  variant = 'inline',
  className = ''
}) => {
  if (variant === 'dark') {
    return (
      <div className={`p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-dcore-maroon text-white border border-slate-800 shadow-card relative overflow-hidden ${className}`}>
        <div className="absolute -right-4 -bottom-4 opacity-10 text-white pointer-events-none">
          <QuoteIcon className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-3">
          <p className="text-sm sm:text-base font-serif font-semibold leading-relaxed tracking-wide text-slate-100">
            “{quote}”
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-6 h-0.5 bg-dcore-red"></span>
            <p className="text-xs font-bold text-red-300 tracking-wider">
              — {speaker}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`glass-card p-6 rounded-2xl border-l-4 border-l-dcore-red border-y border-r border-slate-200/90 bg-white relative overflow-hidden ${className}`}>
        <div className="absolute right-3 top-3 opacity-5 text-dcore-red pointer-events-none">
          <QuoteIcon className="w-24 h-24" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-dcore-red text-xs font-bold uppercase tracking-wider">
            <QuoteIcon className="w-4 h-4" />
            <span>Operational Philosophy</span>
          </div>
          <p className="text-sm sm:text-base font-serif font-medium text-slate-900 leading-relaxed">
            “{quote}”
          </p>
          <p className="text-xs font-extrabold text-dcore-red text-right">
            — {speaker}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`p-4 rounded-xl bg-red-50/60 border border-red-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-800 ${className}`}>
        <p className="italic font-serif leading-relaxed text-slate-900">
          “{quote}”
        </p>
        <span className="font-bold text-dcore-red shrink-0 text-[11px]">
          — {speaker}
        </span>
      </div>
    );
  }

  // Default 'inline'
  return (
    <div className={`p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft flex items-start gap-4 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-red-50 text-dcore-red flex items-center justify-center shrink-0 font-bold">
        <QuoteIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-xs sm:text-sm font-serif font-medium text-slate-800 leading-relaxed">
          “{quote}”
        </p>
        <p className="text-xs font-bold text-dcore-red">
          — {speaker}
        </p>
      </div>
    </div>
  );
};
