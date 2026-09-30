import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, FolderKanban, CheckSquare, Lightbulb, User, ArrowRight } from 'lucide-react';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, state, navigate } = useApp();
  const [query, setQuery] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedProjects = q
    ? (state.projects || []).filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    : [];

  const matchedTasks = q
    ? (state.tasks || []).filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      )
    : [];

  const matchedIdeas = q
    ? (state.ideas || []).filter(
        i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
      )
    : [];

  const totalResults = matchedProjects.length + matchedTasks.length + matchedIdeas.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-dcore-red shrink-0" />
          <input
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across Projects, Tasks, Ideas, Team Members... (e.g. Kalaignar, SSL, AI)"
            aria-label="Search across Projects, Tasks, Ideas and Team Members"
            className="w-full bg-transparent text-slate-900 font-medium placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search modal"
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-slate-600">Type to search the D-CORE operational database.</p>
              <p className="mt-1">Try searching for <span className="text-dcore-red font-mono font-bold">Kalaignar</span>, <span className="text-dcore-red font-mono font-bold">Periyar</span>, <span className="text-dcore-red font-mono font-bold">Infrastructure</span>, or <span className="text-dcore-red font-mono font-bold">AI</span>.</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <p className="font-bold text-slate-700 text-sm">No operational records found for "{query}"</p>
              <p className="mt-1 text-slate-400">Check spelling or search for broader keywords.</p>
            </div>
          ) : (
            <>
              {/* Projects */}
              {matchedProjects.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-dcore-red" />
                    Projects ({matchedProjects.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedProjects.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('projects', p.id);
                        }}
                        className="p-2.5 rounded-xl hover:bg-red-50/60 border border-transparent hover:border-red-100 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-dcore-red flex items-center gap-2">
                            {p.name}
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.category}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-dcore-red group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {matchedTasks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Tasks ({matchedTasks.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('work-queue');
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-dcore-red flex items-center gap-2">
                            {t.title}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {t.status}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-dcore-red group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideas */}
              {matchedIdeas.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Future Ideas ({matchedIdeas.length})
                  </h4>
                  <div className="space-y-1.5">
                    {matchedIdeas.map(i => (
                      <div
                        key={i.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate('future-ideas');
                        }}
                        className="p-2.5 rounded-xl hover:bg-blue-50/60 border border-slate-100 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-2">
                            💡 {i.title}
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {i.status}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{i.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">ESC</kbd> to close</span>
          <span>D-CORE Operational Search</span>
        </div>
      </div>
    </div>
  );
};
