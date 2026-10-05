import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Layers, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import { getAllSocialPosts, deleteSocialPost, getDownloadUrl } from '../services/socialApi';

const SocialPostHistoryModal = ({ isOpen, onClose, onSelectPost }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPost, setPreviewPost] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getAllSocialPosts();
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load post history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this generated post from storage?')) return;
    try {
      await deleteSocialPost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      if (previewPost?.id === id) {
        setPreviewPost(null);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleDownload = (post, e) => {
    e.stopPropagation();
    const downloadUrl = getDownloadUrl(post.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = post.filename || `gold-india-${post.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Storage Ledger</span>
            <h2 className="text-2xl font-extrabold text-white">Social Post History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          {loading ? (
            <div className="py-24 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading generated post history...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-base font-semibold text-slate-400">No generated posts yet</p>
              <p className="text-xs mt-1">Posts will appear here as hourly rate snapshots are created.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-500/30 transition group"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => setPreviewPost(post)}
                      className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 cursor-pointer hover:opacity-90 relative group/thumb"
                    >
                      <img 
                        src={post.imageUrl || `/api/social-posts/${post.id}/image`} 
                        alt={post.templateName} 
                        onError={(e) => {
                          if (post.id && !e.target.dataset.tried) {
                            e.target.dataset.tried = 'true';
                            e.target.src = `/api/social-posts/${post.id}/image`;
                          }
                        }}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          #{String(post.templateIndex).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {post.templateName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
                          {post.format}
                        </span>
                        {post.isAutoHourly && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Hourly Auto
                          </span>
                        )}
                      </div>

                      <div className="text-lg font-extrabold text-white">
                        ₹{post.price24K?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/g (24K)</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" /> {post.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {post.time}
                        </span>
                        <span>·</span>
                        <span className="text-slate-500 truncate max-w-[200px]" title={post.sourceLabel}>
                          {post.sourceLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <button
                      onClick={() => {
                        if (onSelectPost) onSelectPost(post);
                        onClose();
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Use Post</span>
                    </button>

                    <button
                      onClick={(e) => handleDownload(post, e)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>PNG</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(post.id, e)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Big Preview Modal inside history if clicked */}
        {previewPost && (
          <div 
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setPreviewPost(null)}
          >
            <div className="max-w-xl max-h-[85vh] relative flex flex-col items-center">
              <button
                onClick={() => setPreviewPost(null)}
                className="absolute -top-10 right-0 p-2 text-white hover:text-amber-400"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={previewPost.imageUrl}
                alt={previewPost.templateName}
                className="max-h-[75vh] w-auto rounded-2xl shadow-2xl border border-slate-700"
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={(e) => handleDownload(previewPost, e)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPostHistoryModal;
