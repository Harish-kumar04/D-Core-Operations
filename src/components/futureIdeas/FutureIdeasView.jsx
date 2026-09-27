import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  Lightbulb,
  Plus,
  ArrowRight,
  User,
  CheckCircle2,
  BrainCircuit,
  Edit3,
  X,
  Sparkles,
  Quote as QuoteIcon
} from 'lucide-react';

export const FutureIdeasView = () => {
  const { state, convertIdeaToProject, setIsQuickAddOpen, setQuickAddType, openEditModal } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showQuotePopup, setShowQuotePopup] = useState(false);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('dcore_future_idea_quote_seen');
      if (!seen) {
        setShowQuotePopup(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleClosePopup = () => {
    setShowQuotePopup(false);
    try {
      sessionStorage.setItem('dcore_future_idea_quote_seen', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  let ideas = state.ideas || [];

  if (statusFilter !== 'ALL') {
    ideas = ideas.filter(i => i.status === statusFilter);
  }

  const handleOpenAddIdea = () => {
    setQuickAddType('idea');
    setIsQuickAddOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 select-none relative">
      
      {/* Dr. Kalaignar Effort Quote Pop-Up Modal */}
      {showQuotePopup && (
        <div
          className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          onClick={handleClosePopup}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E8E8] overflow-hidden relative p-6 sm:p-8 animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E42129]"></div>

            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all z-10"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-6 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E42129] text-xs font-black uppercase tracking-wider border border-red-100 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FUTURE IDEAS & INNOVATION VISION</span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#E42129] text-white mx-auto flex items-center justify-center shadow-md shadow-red-500/20">
                <QuoteIcon className="w-6 h-6" />
              </div>

              <div className="space-y-4 px-2 sm:px-4">
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#111111] leading-relaxed tracking-wide font-tamil">
                  “வெற்றி என்பது குறிக்கோள்களை அடைவதற்கான பயணமே.”
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="w-8 h-0.5 bg-[#E42129] rounded-full"></span>
                  <p className="text-sm font-black text-[#E42129] tracking-wider font-tamil">
                    — கலைஞர் மு.கருணாநிதி
                  </p>
                  <span className="w-8 h-0.5 bg-[#E42129] rounded-full"></span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E8E8]">
                <button
                  onClick={handleClosePopup}
                  className="btn-primary w-full py-3.5"
                >
                  Explore Innovation Repository
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-[#E42129] text-xs font-black uppercase tracking-wider mb-1">
            <Lightbulb className="w-4 h-4 text-[#E42129]" />
            <span>Innovation Repository</span>
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">FUTURE IDEAS</h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Capture tech proposals, AI automations & infrastructure ideas without cluttering active operational work.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={() => setShowQuotePopup(true)}
            className="btn-secondary py-2.5 px-3.5 text-xs flex items-center gap-1.5"
            title="Show Kalaignar Vision Quote"
          >
            <QuoteIcon className="w-3.5 h-3.5 text-[#E42129]" />
            <span>Vision Quote</span>
          </button>
          <button
            onClick={handleOpenAddIdea}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Future Idea</span>
          </button>
        </div>
      </div>

      {/* Integrated Periyar Self-Confidence / Rationalism Quote */}
      <QuoteCard
        quote="நானே சொல்லியிருந்தாலும் நம்பாதே! உன் பகுத்தறிவைக் கொண்டு யோசித்து பார்."
        speaker="தந்தை பெரியார்"
        variant="featured"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F5F5F5] border border-[#E8E8E8] text-xs font-bold">
        {['ALL', 'NEW', 'DISCUSSION', 'RESEARCH', 'APPROVED', 'CONVERTED TO PROJECT'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              statusFilter === st
                ? 'bg-white text-[#E42129] shadow-xs border border-[#E8E8E8]'
                : 'text-[#666666] hover:bg-white/60'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Ideas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.length === 0 ? (
          <div className="col-span-2 bg-white p-12 text-center rounded-2xl border border-[#E8E8E8] text-slate-400 space-y-3">
            <BrainCircuit className="w-12 h-12 mx-auto text-[#E42129]" />
            <h3 className="text-base font-extrabold text-[#111111]">No ideas in repository</h3>
            <p className="text-xs text-[#666666] font-medium max-w-sm mx-auto">
              Capture the next big digital innovation before it gets lost.
            </p>
            <button
              onClick={handleOpenAddIdea}
              className="btn-primary mt-2"
            >
              + Submit Idea
            </button>
          </div>
        ) : (
          ideas.map((idea) => {
            const isConverted = idea.status === 'CONVERTED TO PROJECT';

            return (
              <div
                key={idea.id}
                className={`glass-card p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isConverted
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                    : 'border-[#E8E8E8] bg-white hover:border-[#E42129]/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Metadata Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-red-50 text-[#E42129] border border-red-200 uppercase">
                      {idea.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isConverted ? 'bg-emerald-100 text-emerald-800' : 'bg-[#F5F5F5] text-[#111111] border border-[#E8E8E8]'
                      }`}>
                        {idea.status}
                      </span>
                      <button
                        onClick={() => openEditModal('IDEA', idea)}
                        className="p-1.5 rounded-lg bg-[#F5F5F5] hover:bg-red-50 text-[#666666] hover:text-[#E42129] border border-[#E8E8E8] transition-colors"
                        title="Edit Idea"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Idea Title */}
                  <h3 className="text-base font-extrabold text-[#111111] leading-snug flex items-start gap-2">
                    <span className="text-amber-500">💡</span>
                    <span>{idea.title}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#333333] font-medium leading-relaxed">
                    {idea.description}
                  </p>

                  {/* Impact & Complexity indicators */}
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <div className="px-2.5 py-1 rounded-lg bg-[#F5F5F5] border border-[#E8E8E8] font-bold text-[#111111]">
                      Impact: <span className="font-extrabold text-[#E42129]">{idea.impact}</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-[#F5F5F5] border border-[#E8E8E8] font-bold text-[#111111]">
                      Complexity: <span className="font-bold text-[#111111]">{idea.complexity}</span>
                    </div>
                  </div>

                  {idea.notes && (
                    <div className="p-3 rounded-xl bg-[#F5F5F5] border border-[#E8E8E8] text-[11px] text-[#333333] font-mono">
                      Note: {idea.notes}
                    </div>
                  )}
                </div>

                {/* Footer Creator & Convert CTA */}
                <div className="pt-4 border-t border-[#E8E8E8] flex items-center justify-between gap-3 text-xs font-medium">
                  <div className="flex items-center gap-2 text-[#666666] font-bold">
                    <User className="w-3.5 h-3.5 text-[#666666]" />
                    <span>D-Core Strategy Desk</span>
                  </div>

                  {!isConverted ? (
                    <button
                      onClick={() => convertIdeaToProject(idea.id)}
                      className="btn-primary py-2 px-3.5"
                    >
                      <span>Convert to Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Project Created
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
