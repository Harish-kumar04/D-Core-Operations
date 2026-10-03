import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Trash2,
  Tag,
  Calendar,
  User,
  Sparkles,
  Users,
  Video,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'GENERAL', label: 'General Update', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'MEETING', label: 'Physical / Sync Meeting', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'UPDATE', label: 'Platform Update', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'CAMPAIGN', label: 'Campaign & Social Media', color: 'bg-red-50 text-[#E42129] border-red-200' },
  { id: 'EVENT', label: 'Event Launch', color: 'bg-amber-50 text-amber-800 border-amber-200' }
];

export const FeedsView = () => {
  const { state, addFeedPost, deleteFeedPost, userSession, adminName } = useApp();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const activeAuthor = userSession?.memberName || adminName || 'Core Team Member';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    addFeedPost({
      content: content.trim(),
      category
    });

    setContent('');
  };

  const feedsList = state.feeds || [];

  const filteredFeeds = feedsList.filter(post => {
    if (activeCategoryFilter === 'ALL') return true;
    return post.category === activeCategoryFilter;
  });

  const getCategoryBadge = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
    return (
      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs ${cat.color}`}>
        {cat.label}
      </span>
    );
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-[#E42129] text-xs font-black uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Activity Stream & Internal Social Feed</span>
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">D-CORE FEEDS</h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Broadcast updates, meeting details, physical meet logs, campaign milestones, and team announcements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center bg-red-50 text-[#E42129] px-3.5 py-2 rounded-xl border border-red-100 text-xs font-bold shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>{feedsList.length} Feed Posts Published</span>
        </div>
      </div>

      {/* Main Grid: Composer & Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Post Composer */}
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-soft space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E42129] text-white flex items-center justify-center font-black text-xs">
                  {activeAuthor.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-black text-[#111111]">{activeAuthor}</div>
                  <div className="text-[10px] text-[#666666] font-bold uppercase">Posting to Feed</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                TEXT POST
              </span>
            </div>

            {/* Category Picker */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#666666] block mb-1.5">
                Post Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      category === cat.id
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Input */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-[#666666] block mb-1.5">
                Update / Notes Content
              </label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share physical meeting details, social media tasks, campaign updates, or platform announcements..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#111111] focus:outline-none focus:border-[#E42129] focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 bg-[#E42129] hover:bg-[#c21920]"
            >
              <Send className="w-4 h-4" />
              <span>Publish Feed Post</span>
            </button>
          </form>
        </div>

        {/* Right Column: Timeline Feed */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white border border-[#E8E8E8] shadow-xs text-xs font-bold">
            <button
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategoryFilter === 'ALL'
                  ? 'bg-[#E42129] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Feeds ({feedsList.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = feedsList.filter(f => f.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeCategoryFilter === cat.id
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Timeline Feed Stream */}
          {filteredFeeds.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#E8E8E8] text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-sm">No feed posts in this category</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first to publish a meeting note or social update using the post composer!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeeds.map(post => (
                <div
                  key={post.id}
                  className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-soft space-y-3 hover:border-slate-300 transition-all"
                >
                  {/* Post Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {(post.author || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-[#111111]">{post.author}</span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {post.role || 'ADMIN'}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-600">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getCategoryBadge(post.category)}
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this feed post?')) {
                            deleteFeedPost(post.id);
                          }
                        }}
                        className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Body Content */}
                  <p className="text-xs text-[#111111] font-medium leading-relaxed whitespace-pre-wrap pt-1">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
