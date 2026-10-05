import React, { useState, useEffect } from 'react';
import { 
  Download, 
  RefreshCw, 
  Grid, 
  History, 
  Sparkles, 
  Share2, 
  Check, 
  Copy, 
  Instagram, 
  MessageCircle, 
  Twitter, 
  Linkedin, 
  Eye, 
  Clock, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  getLatestSocialPost, 
  generateSocialPost, 
  getDownloadUrl 
} from '../services/socialApi';
import { formatINR } from '../services/goldApi';

const FORMAT_OPTIONS = [
  { id: 'portrait', label: 'Instagram Portrait', dims: '1080 × 1350', aspect: 'aspect-[4/5]' },
  { id: 'square', label: 'Instagram Square', dims: '1080 × 1080', aspect: 'aspect-square' },
  { id: 'story', label: 'Instagram Story', dims: '1080 × 1920', aspect: 'aspect-[9/16]' }
];

const SocialPostWidget = ({ onOpenGallery, onOpenHistory, selectedPost, onPostChange, city = 'Hyderabad' }) => {
  const [post, setPost] = useState(selectedPost || null);
  const [loading, setLoading] = useState(!selectedPost);
  const [generating, setGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('portrait');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  // Sync with selectedPost prop if passed from parent
  useEffect(() => {
    if (selectedPost) {
      setPost(selectedPost);
      if (selectedPost.format) {
        setSelectedFormat(selectedPost.format);
      }
      setLoading(false);
    }
  }, [selectedPost]);

  // Load latest post on initial mount if not provided
  const fetchLatest = async () => {
    try {
      setLoading(true);
      const data = await getLatestSocialPost();
      if (data) {
        setPost(data);
        if (data.format) {
          setSelectedFormat(data.format);
        }
        if (onPostChange) {
          onPostChange(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch latest social post:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedPost) {
      fetchLatest();
    }
  }, []);

  // Regenerate with another random template (same verified snapshot)
  const handleRegenerateAnother = async () => {
    if (generating) return;
    try {
      setGenerating(true);
      setFeedbackMsg('');
      const updated = await generateSocialPost({
        format: selectedFormat,
        snapshotId: post?.snapshotId || null
      });
      if (updated) {
        setPost(updated);
        if (onPostChange) onPostChange(updated);
        setFeedbackMsg(`Generated with Template #${updated.templateIndex}: ${updated.templateName}`);
        setTimeout(() => setFeedbackMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to regenerate post:', err);
      setFeedbackMsg('Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Change aspect ratio format
  const handleFormatChange = async (newFormat) => {
    if (newFormat === selectedFormat || generating) return;
    setSelectedFormat(newFormat);
    try {
      setGenerating(true);
      const updated = await generateSocialPost({
        templateId: post?.templateId || null,
        format: newFormat,
        snapshotId: post?.snapshotId || null
      });
      if (updated) {
        setPost(updated);
        if (onPostChange) onPostChange(updated);
      }
    } catch (err) {
      console.error('Failed to change format:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Handle direct download
  const handleDownload = () => {
    if (!post) return;
    const downloadUrl = getDownloadUrl(post.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = post.filename || `gold-india-${post.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Social Share helper
  const handleShareClick = (platform) => {
    const text = `Today's Gold Rate: ₹${post?.price24K?.toLocaleString('en-IN')}/g (24K Gold). Source: ${post?.sourceLabel || 'Market Reference'}.`;
    const shareUrl = window.location.origin;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'instagram' || platform === 'facebook') {
      // Trigger image download and copy caption
      handleDownload();
      navigator.clipboard.writeText(text);
      setShareCopied(true);
      setFeedbackMsg('Image downloaded! Post caption copied to clipboard.');
      setTimeout(() => {
        setShareCopied(false);
        setFeedbackMsg('');
      }, 5000);
    }
  };

  const isUp = (post?.change24K || 0) >= 0;

  return (
    <section className="frosted-glass border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Background ambient gold glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Hourly Generator
            </span>
            {post?.isAutoHourly && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="w-3 h-3" /> Auto-Generated
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Today's Social Media Gold Post
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Studio-grade ready-to-publish graphics rendered automatically every hour from verified gold rate snapshots.
          </p>
        </div>

        {/* Gallery & History buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenGallery}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white rounded-xl text-sm font-semibold border border-slate-700 transition shadow-sm"
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <span>Browse 55 Templates</span>
          </button>
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800/60 hover:bg-slate-700/80 active:scale-95 text-slate-300 hover:text-white rounded-xl text-sm font-semibold border border-slate-700/60 transition"
            title="View Post History"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
          <p className="text-sm font-medium">Generating social graphics from verified snapshot...</p>
        </div>
      ) : !post ? (
        <div className="bg-slate-800/40 rounded-2xl p-8 text-center border border-slate-800">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Awaiting Hourly Gold Snapshot</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
            Social posts are automatically created once verified gold rates are recorded from the commodity desk.
          </p>
          <button
            onClick={fetchLatest}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition"
          >
            Check Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          {/* Left Column: Image Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Format selector tab pills */}
            <div className="w-full flex items-center justify-between gap-2 mb-4 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 px-3 hidden sm:inline">Aspect Ratio:</span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                {FORMAT_OPTIONS.map((f) => {
                  const isActive = selectedFormat === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => handleFormatChange(f.id)}
                      disabled={generating}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isActive 
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{f.label.replace('Instagram ', '')}</span>
                      <span className={`text-[10px] ${isActive ? 'text-slate-900/80' : 'text-slate-500'}`}>({f.dims})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Canvas Box */}
            <div className="w-full relative group rounded-2xl overflow-hidden border-2 border-slate-800/90 bg-slate-950 shadow-2xl flex items-center justify-center max-h-[620px]">
              {generating && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-amber-400">
                  <RefreshCw className="w-10 h-10 animate-spin mb-3 text-amber-400" />
                  <p className="text-sm font-bold text-white tracking-wide">Rendering Crisp High-Res Vector PNG...</p>
                  <p className="text-xs text-slate-400 mt-1">Applying typography &amp; layout primitives</p>
                </div>
              )}

              <img
                key={`${post.id}-${post.format}-${post.templateId}`}
                src={post.imageUrl ? `${post.imageUrl}?t=${new Date(post.generatedAt || Date.now()).getTime()}` : `/api/social-posts/${post.id}/image`}
                alt={`Gold Rate Social Post - ${post.templateName}`}
                onError={(e) => {
                  if (post.id && !e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = `/api/social-posts/${post.id}/image`;
                  }
                }}
                className="w-full h-auto max-h-[600px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              />

              {/* Watermark badge on hover */}
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {post.dimensions?.width} × {post.dimensions?.height} px PNG
              </div>
            </div>

            {/* Temporary feedback banner */}
            {feedbackMsg && (
              <div className="w-full mt-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-between animate-fade-in">
                <span>{feedbackMsg}</span>
                <Check className="w-4 h-4 text-amber-400" />
              </div>
            )}
          </div>

          {/* Right Column: Controls & Meta Information */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            {/* Active Template & Snapshot Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">Active Template</span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>#{String(post.templateIndex).padStart(2, '0')}</span>
                    <span>{post.templateName}</span>
                  </h3>
                </div>
                <button
                  onClick={onOpenGallery}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg border border-amber-500/20 transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Change
                </button>
              </div>

              {/* Snapshot Prices Injected */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400">24K Pure Gold</div>
                  <div className="text-xl font-extrabold text-white mt-0.5">
                    ₹{post.price24K?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/g</span>
                  </div>
                  <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span>{isUp ? '▲ +' : '▼ -'}₹{Math.abs(post.change24K || 0).toLocaleString('en-IN')}</span>
                    <span>({Math.abs(post.changePercent24K || 0).toFixed(2)}%)</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400">22K Jewellery (916)</div>
                  <div className="text-xl font-extrabold text-slate-200 mt-0.5">
                    ₹{post.price22K?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/g</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">18K: ₹{post.price18K?.toLocaleString('en-IN')}/g</div>
                </div>
              </div>

              {/* Source Verification Badge */}
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Snapshot Date:
                  </span>
                  <span className="font-semibold text-slate-300">{post.date}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Timestamp (IST):</span>
                  <span className="font-semibold text-slate-300">{post.time}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/50">
                  <span>Market Reference:</span>
                  <span className="font-bold text-amber-400">{post.sourceLabel || 'API Mitra Commodities Feed'}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.99] text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 text-base transition duration-200"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>Download High-Res PNG ({post.dimensions?.width}×{post.dimensions?.height})</span>
              </button>

              <button
                onClick={handleRegenerateAnother}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-white font-bold rounded-2xl border border-slate-700 transition duration-150 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 text-amber-400 ${generating ? 'animate-spin' : ''}`} />
                <span>Generate Another Template (Same Snapshot Price)</span>
              </button>
            </div>

            {/* Social Media Share / Publish Quick Actions */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-amber-400" /> Share &amp; Publish To
                </span>
                <span className="text-[11px] text-slate-500">Auto-downloads &amp; copies text</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleShareClick('instagram')}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-600 hover:to-rose-600 text-slate-300 hover:text-white transition group border border-slate-800"
                  title="Share to Instagram"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition" />
                  <span className="text-[11px] font-semibold">Instagram</span>
                </button>

                <button
                  onClick={() => handleShareClick('whatsapp')}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white transition group border border-slate-800"
                  title="Share to WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" />
                  <span className="text-[11px] font-semibold">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleShareClick('twitter')}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 hover:bg-sky-500 text-slate-300 hover:text-white transition group border border-slate-800"
                  title="Share to X (Twitter)"
                >
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition" />
                  <span className="text-[11px] font-semibold">X (Twitter)</span>
                </button>

                <button
                  onClick={() => handleShareClick('linkedin')}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition group border border-slate-800"
                  title="Share to LinkedIn"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition" />
                  <span className="text-[11px] font-semibold">LinkedIn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialPostWidget;
