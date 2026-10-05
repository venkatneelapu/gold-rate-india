import React, { useState, useEffect } from 'react';
import { 
  Download, 
  RefreshCw, 
  Grid, 
  History, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Layers, 
  Search, 
  Trash2, 
  Eye, 
  Share2, 
  Instagram, 
  MessageCircle, 
  Twitter, 
  Linkedin,
  Filter
} from 'lucide-react';
import { 
  getLatestSocialPost, 
  getAllSocialPosts, 
  getTemplateCatalog, 
  generateSocialPost, 
  generateSpecificTemplate, 
  deleteSocialPost, 
  getDownloadUrl 
} from '../services/socialApi';

const FORMAT_OPTIONS = [
  { id: 'portrait', label: 'Instagram Portrait', dims: '1080 × 1350' },
  { id: 'square', label: 'Instagram Square', dims: '1080 × 1080' },
  { id: 'story', label: 'Instagram Story', dims: '1080 × 1920' }
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates (55)' },
  { id: 'luxury', label: 'Luxury (1-10)' },
  { id: 'minimal', label: 'Minimal (11-20)' },
  { id: 'indian', label: 'Indian Heritage (21-30)' },
  { id: 'financial', label: 'Financial & Market (31-40)' },
  { id: 'social', label: 'Modern Social (41-55)' }
];

const CATEGORY_STYLES = {
  luxury: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  minimal: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  indian: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  financial: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  social: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
};

const SocialPostsPage = ({ initialTab = 'preview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'preview' | 'templates' | 'history'
  const [latestPost, setLatestPost] = useState(null);
  const [historyPosts, setHistoryPosts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('portrait');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState('');
  const [selectedPreviewModal, setSelectedPreviewModal] = useState(null);

  // Sync tab with URL
  const changeTab = (tab) => {
    setActiveTab(tab);
    let path = '/social-posts';
    if (tab === 'templates') path = '/social-posts/templates';
    if (tab === 'history') path = '/social-posts/history';
    window.history.pushState({}, '', path);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      const [latest, history, catalog] = await Promise.all([
        getLatestSocialPost(),
        getAllSocialPosts(),
        getTemplateCatalog()
      ]);
      setLatestPost(latest);
      setHistoryPosts(history || []);
      setTemplates(catalog || []);
      if (latest?.format) {
        setSelectedFormat(latest.format);
      }
    } catch (err) {
      console.error('Failed to load social posts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Regenerate with random template (same snapshot)
  const handleRegenerateRandom = async () => {
    if (generating) return;
    try {
      setGenerating(true);
      const updated = await generateSocialPost({
        format: selectedFormat,
        snapshotId: latestPost?.snapshotId || null
      });
      if (updated) {
        setLatestPost(updated);
        setHistoryPosts(prev => [updated, ...prev]);
        setNotification(`Generated Template #${updated.templateIndex}: ${updated.templateName}`);
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err) {
      console.error('Regeneration error:', err);
      setNotification('Failed to generate template.');
    } finally {
      setGenerating(false);
    }
  };

  // Generate specific template
  const handleSelectTemplate = async (templateId) => {
    try {
      setGenerating(true);
      const updated = await generateSpecificTemplate(templateId, {
        format: selectedFormat,
        snapshotId: latestPost?.snapshotId || null
      });
      if (updated) {
        setLatestPost(updated);
        setHistoryPosts(prev => [updated, ...prev]);
        changeTab('preview');
        setNotification(`Applied Template #${updated.templateIndex}: ${updated.templateName}`);
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err) {
      console.error('Select template error:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Change aspect ratio format
  const handleFormatChange = async (format) => {
    if (format === selectedFormat || generating) return;
    setSelectedFormat(format);
    try {
      setGenerating(true);
      const updated = await generateSocialPost({
        templateId: latestPost?.templateId || null,
        format,
        snapshotId: latestPost?.snapshotId || null
      });
      if (updated) {
        setLatestPost(updated);
        setHistoryPosts(prev => [updated, ...prev]);
      }
    } catch (err) {
      console.error('Format change error:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Download image
  const handleDownload = (postToDownload = latestPost) => {
    if (!postToDownload) return;
    const downloadUrl = getDownloadUrl(postToDownload.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = postToDownload.filename || `gold-india-${postToDownload.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete from history
  const handleDeletePost = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this generated social post?')) return;
    try {
      await deleteSocialPost(id);
      setHistoryPosts(prev => prev.filter(p => p.id !== id));
      if (latestPost?.id === id) {
        const remaining = historyPosts.filter(p => p.id !== id);
        setLatestPost(remaining[0] || null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCat = selectedCategory === 'all' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      tpl.name.toLowerCase().includes(q) ||
      tpl.id.toLowerCase().includes(q) ||
      String(tpl.index).includes(q) ||
      tpl.description?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Dashboard</span>
            </a>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Social Media Posts</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Hourly Engine
                </span>
              </h1>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => changeTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'preview' 
                  ? 'bg-amber-500 text-slate-950 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Today's Post</span>
            </button>
            <button
              onClick={() => changeTab('templates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'templates' 
                  ? 'bg-amber-500 text-slate-950 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>55 Templates</span>
            </button>
            <button
              onClick={() => changeTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'history' 
                  ? 'bg-amber-500 text-slate-950 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({historyPosts.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div className="mb-6 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-semibold flex items-center justify-between">
            <span>{notification}</span>
          </div>
        )}

        {/* TAB 1: TODAY'S POST PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Today's Generated Post</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Indian gold market rate release formatted for Instagram, WhatsApp, and social media publication.
                </p>
              </div>

              {/* Format Switcher */}
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 pl-2">Format:</span>
                {FORMAT_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleFormatChange(f.id)}
                    disabled={generating}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedFormat === f.id
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label.replace('Instagram ', '')} ({f.dims})
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-sm">Fetching social media preview...</p>
              </div>
            ) : !latestPost ? (
              <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800">
                <Clock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">No Generated Post Found</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Social posts are created once a verified gold rate snapshot is recorded.
                </p>
                <button
                  onClick={loadAll}
                  className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-2xl text-sm"
                >
                  Reload Snapshot
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Large Preview */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  <div className="w-full relative group rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center max-h-[660px]">
                    {generating && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-amber-400">
                        <RefreshCw className="w-10 h-10 animate-spin mb-3 text-amber-400" />
                        <p className="text-sm font-bold text-white">Rendering Vector Template PNG...</p>
                      </div>
                    )}
                    <img
                      src={latestPost.imageUrl}
                      alt={latestPost.templateName}
                      className="w-full h-auto max-h-[640px] object-contain"
                    />
                  </div>
                </div>

                {/* Details & Action Sidebar */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Template #{String(latestPost.templateIndex).padStart(2, '0')}
                        </span>
                        <h3 className="text-xl font-extrabold text-white">{latestPost.templateName}</h3>
                      </div>
                      <button
                        onClick={() => changeTab('templates')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/20"
                      >
                        View Template
                      </button>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400 font-medium">24K Pure Gold Rate</span>
                        <span className="text-white font-extrabold text-base">₹{latestPost.price24K?.toLocaleString('en-IN')}/g</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400 font-medium">22K Jewellery Rate</span>
                        <span className="text-slate-200 font-bold">₹{latestPost.price22K?.toLocaleString('en-IN')}/g</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400 font-medium">18K Standard Rate</span>
                        <span className="text-slate-200 font-bold">₹{latestPost.price18K?.toLocaleString('en-IN')}/g</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400 font-medium">Date &amp; Time (IST)</span>
                        <span className="text-slate-300 font-semibold">{latestPost.date} · {latestPost.time}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400 font-medium">Verified Source</span>
                        <span className="text-amber-400 font-bold">{latestPost.sourceLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleDownload(latestPost)}
                      className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.99] text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 text-base transition"
                    >
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>Download PNG ({latestPost.dimensions?.width}×{latestPost.dimensions?.height})</span>
                    </button>

                    <button
                      onClick={handleRegenerateRandom}
                      disabled={generating}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-white font-bold rounded-2xl border border-slate-700 transition"
                    >
                      <RefreshCw className={`w-4 h-4 text-amber-400 ${generating ? 'animate-spin' : ''}`} />
                      <span>Generate Another (Same Snapshot Price)</span>
                    </button>

                    <button
                      onClick={() => changeTab('templates')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold rounded-2xl border border-slate-800 transition"
                    >
                      <Grid className="w-4 h-4 text-amber-400" />
                      <span>Browse All 55 Templates</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEMPLATE GALLERY */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Template Gallery</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Browse and select from 55 distinct luxury, minimal, Indian heritage, financial, and modern social layouts.
                </p>
              </div>

              {/* Format selection */}
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 pl-2">Format:</span>
                {['portrait', 'square', 'story'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition ${
                      selectedFormat === fmt
                        ? 'bg-amber-500 text-slate-950 font-extrabold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search templates by title, number (#01), or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredTemplates.map((tpl) => {
                const catStyle = CATEGORY_STYLES[tpl.category] || CATEGORY_STYLES.social;
                const isCurrent = latestPost?.templateId === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    className={`bg-slate-900/80 rounded-2xl border transition duration-200 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 hover:shadow-2xl ${
                      isCurrent ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                          #{String(tpl.index).padStart(2, '0')}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catStyle}`}>
                          {tpl.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{tpl.name}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/60 border-t border-slate-800/70 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500">
                        {tpl.supportedFormats?.join(' · ')}
                      </span>
                      <button
                        onClick={() => handleSelectTemplate(tpl.id)}
                        disabled={generating}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isCurrent
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Preview'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SOCIAL POST HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Social Post History</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Hourly generated archives stored with verified snapshot records.
                </p>
              </div>
              <button
                onClick={loadAll}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-800 transition flex items-center gap-2 self-start"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Refresh Archives</span>
              </button>
            </div>

            {historyPosts.length === 0 ? (
              <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-base font-bold text-white">No historical posts yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Posts are generated automatically every hour when rates refresh.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {historyPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/40 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => setSelectedPreviewModal(post)}
                        className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 cursor-pointer relative group"
                      >
                        <img src={post.imageUrl} alt={post.templateName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            #{String(post.templateIndex).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-bold text-white">{post.templateName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
                            {post.format}
                          </span>
                        </div>

                        <div className="text-lg font-extrabold text-white">
                          ₹{post.price24K?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/g</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                          <span>{post.date}</span>
                          <span>·</span>
                          <span>{post.time}</span>
                          <span>·</span>
                          <span className="text-amber-400/80">{post.sourceLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <button
                        onClick={() => {
                          setLatestPost(post);
                          changeTab('preview');
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleDownload(post)}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                        title="Delete from storage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Full Preview Modal */}
      {selectedPreviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPreviewModal(null)}
        >
          <div className="max-w-xl max-h-[88vh] relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPreviewModal.imageUrl}
              alt={selectedPreviewModal.templateName}
              className="max-h-[75vh] w-auto rounded-2xl shadow-2xl border border-slate-700"
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => handleDownload(selectedPreviewModal)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>
              <button
                onClick={() => setSelectedPreviewModal(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPostsPage;
