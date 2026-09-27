import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Quote as QuoteIcon, Sparkles } from 'lucide-react';

const POPUP_QUOTES = [
  {
    quote: "சுயமரியாதை இல்லாத வாழ்க்கை, பிறர் கருணையில் உயிர்வாழும் அடிமைத்தனமே.",
    speaker: "தந்தை பெரியார்",
    tag: "சுயமரியாதை"
  },
  {
    quote: "கேள்வி கேட்கத் துணிவில்லாத சமூகம் முன்னேற முடியாது.",
    speaker: "தந்தை பெரியார்",
    tag: "பகுத்தறிவு"
  },
  {
    quote: "மனிதனை உயர்த்துவது ஜாதி அல்ல; அவனது சிந்தனையே.",
    speaker: "தந்தை பெரியார்",
    tag: "சிந்தனை"
  },
  {
    quote: "நானே சொல்லியிருந்தாலும் நம்பாதே! உன் பகுத்தறிவைக் கொண்டு யோசித்து பார்.",
    speaker: "தந்தை பெரியார்",
    tag: "சுயநம்பிக்கை"
  },
  {
    quote: "எந்த மனிதனும் எனக்குக் கீழானவன் அல்ல, அது போலவே எவனும் எனக்கு மேலானவனும் அல்ல.",
    speaker: "தந்தை பெரியார்",
    tag: "சமத்துவம்"
  },
  {
    quote: "வெற்றி என்பது குறிக்கோள்களை அடைவதற்கான பயணமே.",
    speaker: "கலைஞர் மு.கருணாநிதி",
    tag: "முயற்சி"
  },
  {
    quote: "நம்மால் பயனடைந்தவர்கள் நம்மிடம் நன்றி காட்டுவார்கள் என்று எதிர்பார்க்க வேண்டாம். நாம் செய்தது மனிதத்திற்காக... புகழுக்காக அல்ல.",
    speaker: "கலைஞர் மு.கருணாநிதி",
    tag: "சேவை"
  },
  {
    quote: "ஒவ்வொரு தடையும் தன்னம்பிக்கையை வளர்க்கும் வாய்ப்பே.",
    speaker: "கலைஞர் மு.கருணாநிதி",
    tag: "தடை"
  },
  {
    quote: "உண்மையை மறைக்க முனைவது, விதையை பூமிக்குள் மறைப்பதுபோலத்தான்.",
    speaker: "கலைஞர் மு.கருணாநிதி",
    tag: "உண்மை"
  }
];

export const QuotePopup = () => {
  const { userSession } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuote, setActiveQuote] = useState(POPUP_QUOTES[0]);

  useEffect(() => {
    if (userSession.isAuthenticated) {
      try {
        const seen = sessionStorage.getItem('dcore_quote_popup_seen');
        if (!seen) {
          const randomIndex = Math.floor(Math.random() * POPUP_QUOTES.length);
          setActiveQuote(POPUP_QUOTES[randomIndex]);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E42129] text-xs font-black uppercase tracking-wider border border-red-100 shadow-xs font-tamil">
            <Sparkles className="w-3.5 h-3.5" />
            <span>D-CORE OPERATIONAL PHILOSOPHY • {activeQuote.tag}</span>
          </div>

          {/* Quotation Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#E42129] text-white mx-auto flex items-center justify-center shadow-md shadow-red-500/20">
            <QuoteIcon className="w-6 h-6" />
          </div>

          {/* Tamil Quote Text */}
          <div className="space-y-4 px-2 sm:px-4">
            <p className="text-lg sm:text-xl font-serif font-bold text-[#111111] leading-relaxed tracking-wide font-tamil">
              “{activeQuote.quote}”
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <span className="w-8 h-0.5 bg-[#E42129] rounded-full"></span>
              <p className="text-sm font-black text-[#E42129] tracking-wider font-tamil">
                — {activeQuote.speaker}
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
