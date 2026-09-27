import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  Lightbulb,
  Plus,
  ArrowRight,
  User,
  CheckCircle2,
  BrainCircuit,
  Edit3
} from 'lucide-react';

export const FutureIdeasView = () => {
  const { state, convertIdeaToProject, setIsQuickAddOpen, setQuickAddType, openEditModal } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');

  let ideas = state.ideas || [];

  if (statusFilter !== 'ALL') {
    ideas = ideas.filter(i => i.status === statusFilter);
  }

  const handleOpenAddIdea = () => {
    setQuickAddType('idea');
    setIsQuickAddOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 select-none">
      
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

        <button
          onClick={handleOpenAddIdea}
          className="btn-primary self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Future Idea</span>
        </button>
      </div>

      {/* Integrated Periyar Critical Thinking / Research Quote */}
      <QuoteCard
        quote="எதையும் யாரும் சொன்னார்கள் என்பதற்காக நம்பாதீர்கள்; சிந்தித்து, ஆராய்ந்து, உண்மை எனத் தெரிந்ததை ஏற்றுக்கொள்ளுங்கள்."
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
                    <span>{idea.createdBy || 'D-Core Team'}</span>
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
