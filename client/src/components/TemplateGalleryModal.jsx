import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Check, 
  Layers, 
  Filter, 
  ArrowRight, 
  Palette, 
  RefreshCw 
} from 'lucide-react';
import { getTemplateCatalog, generateSpecificTemplate } from '../services/socialApi';

const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'luxury', label: 'Luxury (1-10)' },
  { id: 'minimal', label: 'Minimal (11-20)' },
  { id: 'indian', label: 'Indian Heritage (21-30)' },
  { id: 'financial', label: 'Financial & Market (31-40)' },
  { id: 'social', label: 'Modern Social (41-55)' }
];

const CATEGORY_STYLES = {
  luxury: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  minimal: { bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30' },
  indian: { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  financial: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  social: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' }
};

const TemplateGalleryModal = ({ isOpen, onClose, onSelectTemplate, activeTemplateId }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('portrait');
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const data = await getTemplateCatalog();
        setTemplates(data || []);
      } catch (err) {
        console.error('Failed to load template catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [isOpen]);

  // Filter templates based on Category and Search Query
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesCat = selectedCategory === 'all' || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        tpl.name.toLowerCase().includes(q) || 
        tpl.id.toLowerCase().includes(q) ||
        String(tpl.index).includes(q) ||
        tpl.description?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const handleApplyTemplate = async (template) => {
    try {
      setGeneratingId(template.id);
      const generatedPost = await generateSpecificTemplate(template.id, {
        format: selectedFormat
      });
      if (generatedPost && onSelectTemplate) {
        onSelectTemplate(generatedPost);
      }
      onClose();
    } catch (err) {
      console.error('Failed to generate template:', err);
    } finally {
      setGeneratingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                55 Professional Templates
              </span>
              <span className="text-xs text-slate-400">Deterministic SVG-to-PNG Vector Engine</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Social Media Template Gallery</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, number (#01), or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Format selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 pl-2 hidden sm:inline">Format:</span>
            {['portrait', 'square', 'story'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                  selectedFormat === fmt 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Templates Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          {loading ? (
            <div className="py-24 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading template designs...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <Filter className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-base font-semibold text-slate-400">No templates match your search</p>
              <p className="text-xs mt-1">Try searching for a different keyword or reset filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTemplates.map((tpl) => {
                const isActive = activeTemplateId === tpl.id;
                const isGenerating = generatingId === tpl.id;
                const catStyle = CATEGORY_STYLES[tpl.category] || CATEGORY_STYLES.social;

                return (
                  <div
                    key={tpl.id}
                    className={`bg-slate-950/80 rounded-2xl border transition duration-200 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 hover:shadow-xl ${
                      isActive ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-800'
                    }`}
                  >
                    {/* Card Visual Header */}
                    <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          #{String(tpl.index).padStart(2, '0')}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${catStyle.bg}`}>
                          {tpl.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="p-3 bg-slate-950 flex items-center justify-between gap-2 border-t border-slate-800/50">
                      <span className="text-[11px] text-slate-500">
                        {tpl.supportedFormats?.join(' · ')}
                      </span>

                      <button
                        onClick={() => handleApplyTemplate(tpl)}
                        disabled={isGenerating}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Rendering...</span>
                          </>
                        ) : isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <span>Select</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredTemplates.length} of {templates.length} templates</span>
          <span>Click any template to instantly inject the verified snapshot price</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateGalleryModal;
