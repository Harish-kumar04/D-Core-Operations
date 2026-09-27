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
      <div className={`p-8 rounded-3xl bg-[#111111] text-white border border-[#E8E8E8] shadow-card relative overflow-hidden select-none ${className}`}>
        <div className="absolute right-4 bottom-4 opacity-10 text-white pointer-events-none">
          <QuoteIcon className="w-32 h-32" />
        </div>
        <div className="relative z-10 space-y-4">
          <p className="text-base sm:text-lg font-serif font-bold leading-relaxed tracking-wide text-white tamil-quote">
            “{quote}”
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-8 h-0.5 bg-[#E42129]"></span>
            <p className="text-xs font-black text-red-400 tracking-wider">
              — {speaker}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`glass-card p-6 rounded-2xl border-l-4 border-l-[#E42129] border-y border-r border-[#E8E8E8] bg-white relative overflow-hidden select-none ${className}`}>
        <div className="absolute right-3 top-3 opacity-5 text-[#E42129] pointer-events-none">
          <QuoteIcon className="w-24 h-24" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-[#E42129] text-xs font-black uppercase tracking-wider">
            <QuoteIcon className="w-4 h-4" />
            <span>Operational Philosophy</span>
          </div>
          <p className="text-sm sm:text-base font-serif font-bold text-[#111111] leading-relaxed tamil-quote">
            “{quote}”
          </p>
          <p className="text-xs font-extrabold text-[#E42129] text-right">
            — {speaker}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`p-4 rounded-xl bg-red-50/70 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-[#111111] select-none ${className}`}>
        <p className="font-serif leading-relaxed text-[#111111] font-bold tamil-quote">
          “{quote}”
        </p>
        <span className="font-black text-[#E42129] shrink-0 text-xs">
          — {speaker}
        </span>
      </div>
    );
  }

  // Default 'inline'
  return (
    <div className={`p-5 rounded-2xl bg-white border border-[#E8E8E8] shadow-soft flex items-start gap-4 select-none ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E42129] flex items-center justify-center shrink-0 font-bold border border-red-100">
        <QuoteIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-xs sm:text-sm font-serif font-bold text-[#111111] leading-relaxed tamil-quote">
          “{quote}”
        </p>
        <p className="text-xs font-black text-[#E42129]">
          — {speaker}
        </p>
      </div>
    </div>
  );
};
