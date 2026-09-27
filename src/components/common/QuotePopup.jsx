import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Quote as QuoteIcon, Sparkles } from 'lucide-react';

export const QuotePopup = () => {
  const { userSession } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userSession.isAuthenticated) {
      try {
        const seen = sessionStorage.getItem('dcore_quote_popup_seen');
        if (!seen) {
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 300);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userSession.isAuthenticated]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('dcore_quote_popup_seen', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E8E8] overflow-hidden relative p-6 sm:p-8 animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E42129]"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all z-10"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-6 pt-2">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E42129] text-xs font-black uppercase tracking-wider border border-red-100 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>D-CORE OPERATIONAL PHILOSOPHY</span>
          </div>

          {/* Quotation Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#E42129] text-white mx-auto flex items-center justify-center shadow-md shadow-red-500/20">
            <QuoteIcon className="w-6 h-6" />
          </div>

          {/* Tamil Quote Text */}
          <div className="space-y-4 px-2 sm:px-4">
            <p className="text-lg sm:text-xl font-serif font-bold text-[#111111] leading-relaxed tracking-wide tamil-quote">
              “மக்களிடம் செல்.<br />
              மக்களுடன் வாழ்.<br />
              அவர்களிடமிருந்து கற்றுக்கொள்.<br />
              அவர்களை నేசி.<br />
              அவர்களுக்குச் சேவை செய்.”
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="w-8 h-0.5 bg-[#E42129] rounded-full"></span>
              <p className="text-sm font-black text-[#E42129] tracking-wider">
                — பேரறிஞர் அண்ணா
              </p>
              <span className="w-8 h-0.5 bg-[#E42129] rounded-full"></span>
            </div>
          </div>

          {/* Action Close CTA */}
          <div className="pt-4 border-t border-[#E8E8E8]">
            <button
              onClick={handleClose}
              className="btn-primary w-full py-3.5"
            >
              Continue to Operations Center
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
