import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import GoldBenchmarkSection from '../components/GoldBenchmarkSection';
import PriceChart from '../components/PriceChart';
import GoldTable from '../components/GoldTable';
import GoldCalculator from '../components/GoldCalculator';
import Disclaimer from '../components/Disclaimer';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import SocialPostWidget from '../components/SocialPostWidget';
import TemplateGalleryModal from '../components/TemplateGalleryModal';
import SocialPostHistoryModal from '../components/SocialPostHistoryModal';
import { getGoldOverview, getGoldHistory, getAvailableCities, refreshGoldRates } from '../services/goldApi';
import { Sparkles, TrendingUp, Calculator, Table, Layers } from 'lucide-react';

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState('India');
  const [availableCities, setAvailableCities] = useState([]);
  const [goldData, setGoldData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'calculator' | 'table' | 'poster' | 'all'
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [activeSocialPost, setActiveSocialPost] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const loadData = useCallback(async (isInitial = false, cityToLoad = selectedCity) => {
    if (isInitial) setLoading(true);
    setError(null);

    try {
      const [overviewRes, historyRes] = await Promise.all([
        getGoldOverview(cityToLoad),
        getGoldHistory(cityToLoad)
      ]);

      setGoldData(overviewRes);
      if (overviewRes && overviewRes.availableCities) {
        setAvailableCities(overviewRes.availableCities);
      }
      if (historyRes && Array.isArray(historyRes.history)) {
        setHistory(historyRes.history);
      }
    } catch (err) {
      console.error('Failed to load API Mitra gold rates:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load gold rates from API Mitra.');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [selectedCity]);

  // Load cities on mount
  useEffect(() => {
    getAvailableCities().then(cities => {
      if (cities && cities.length > 0) {
        setAvailableCities(cities);
      }
    }).catch(() => {});
  }, []);

  // Load data on mount & poll every 10 minutes
  useEffect(() => {
    loadData(true, selectedCity);

    const interval = setInterval(() => {
      loadData(false, selectedCity);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadData, selectedCity]);

  // City change handler
  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    loadData(false, newCity);
  };

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshMessage('');

    try {
      const res = await refreshGoldRates();
      if (res.success) {
        setGoldData(res.data);
        setRefreshMessage('✓ API Mitra commodity rates refreshed.');
        const historyRes = await getGoldHistory(selectedCity);
        if (historyRes && Array.isArray(historyRes.history)) {
          setHistory(historyRes.history);
        }
      } else if (res.isRateLimited) {
        setRefreshMessage(`⏳ ${res.message}`);
      }
    } catch (err) {
      setRefreshMessage('✕ Failed to check API Mitra. Please check server connection.');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRefreshMessage(''), 6000);
    }
  };

  const navTabs = [
    { id: 'chart', label: '7-Day Trend', icon: TrendingUp },
    { id: 'calculator', label: 'GST Calculator', icon: Calculator },
    { id: 'table', label: 'Weight Breakdown', icon: Table },
    { id: 'poster', label: 'Daily Poster', icon: Sparkles },
    { id: 'all', label: 'View All', icon: Layers }
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* Dynamic Ambient Gold Auroras in Background */}
      <div className="ambient-glow-orb w-[500px] h-[500px] bg-amber-500/15 top-[-100px] left-[15%] pointer-events-none" />
      <div className="ambient-glow-orb w-[450px] h-[450px] bg-blue-600/10 top-[200px] right-[10%] pointer-events-none" />
      <div className="ambient-glow-orb w-[600px] h-[600px] bg-amber-600/10 bottom-[100px] left-[25%] pointer-events-none" />

      {/* Modern Luxury Navigation Header */}
      <Header
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        refreshCooldownMessage={refreshMessage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 relative z-10">
        
        {loading ? (
          <LoadingState />
        ) : error && !goldData ? (
          <ErrorState message={error} onRetry={() => loadData(true, selectedCity)} />
        ) : (
          <>
            {/* Crown Jewel: Unified Indian Gold Market Rates from API Mitra */}
            <GoldBenchmarkSection
              data={goldData}
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
              availableCities={availableCities}
            />

            {/* High-Level Clean Tool Selector Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Market Tools & Analytics ({selectedCity}):
                </span>
              </div>

              {/* Tab Navigation Pills */}
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300/60 dark:border-slate-800 text-xs font-bold overflow-x-auto max-w-full">
                {navTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: 7-Day Trend Chart */}
            {(activeTab === 'chart' || activeTab === 'all') && (
              <section id="chart-section" aria-label="Gold Rate Price Trend" className="animate-fadeIn">
                <PriceChart history={history} city={selectedCity} />
              </section>
            )}

            {/* TAB 2: Estimated Jewellery Purchase & GST Calculator */}
            {(activeTab === 'calculator' || activeTab === 'all') && (
              <section id="calculator-section" aria-label="Estimated Jewellery Purchase Calculator" className="animate-fadeIn">
                <GoldCalculator goldData={goldData?.rates || goldData?.gold} city={selectedCity} />
              </section>
            )}

            {/* TAB 3: Gold Price by Weight Breakdown Table */}
            {(activeTab === 'table' || activeTab === 'all') && (
              <section id="weights-section" aria-label="Weight Breakdown Comparison Table" className="animate-fadeIn">
                <GoldTable
                  goldData={goldData?.rates || goldData?.gold}
                  rateTypeLabel={`API Mitra Rate (${selectedCity})`}
                />
              </section>
            )}

            {/* TAB 4: Daily Social Media Poster Generator */}
            {(activeTab === 'poster' || activeTab === 'all') && (
              <div id="social-post-section" className="animate-fadeIn">
                <SocialPostWidget
                  selectedPost={activeSocialPost}
                  onPostChange={setActiveSocialPost}
                  onOpenGallery={() => setIsGalleryOpen(true)}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                  city={selectedCity}
                />
              </div>
            )}

            {/* Concise Disclaimer */}
            <Disclaimer />
          </>
        )}

      </main>

      {/* Refined Luxury Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-8 bg-white/40 dark:bg-slate-950/60 backdrop-blur-xl text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-cinzel text-amber-500 font-bold text-sm tracking-wider">GOLD INDIA</span>
            <span>•</span>
            <span>Indian Gold Market Rates Powered by API Mitra</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} Gold Rate India. Data source: API Mitra.</span>
          </div>
        </div>
      </footer>

      {/* 55 Template Gallery Modal */}
      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        activeTemplateId={activeSocialPost?.templateId || activeTemplateId}
        onSelectTemplate={(newPost) => {
          setActiveSocialPost(newPost);
          setActiveTemplateId(newPost.templateId);
        }}
      />

      {/* Social Post History Modal */}
      <SocialPostHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectPost={(post) => {
          setActiveSocialPost(post);
          setActiveTemplateId(post.templateId);
        }}
      />
    </div>
  );
};

export default Dashboard;
