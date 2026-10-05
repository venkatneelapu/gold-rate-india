import React, { useState, useEffect } from 'react';
import { RefreshCw, Moon, Sun, Clock, ShieldCheck, Sparkles } from 'lucide-react';

const Header = ({ onRefresh, isRefreshing, refreshCooldownMessage, darkMode, toggleDarkMode }) => {
  const [currentISTTime, setCurrentISTTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);
      setCurrentISTTime(`${timeStr} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      {/* Sleek Frosted Glass Header Bar */}
      <div className="frosted-glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Identity */}
          <div className="flex items-center space-x-3.5 group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <span className="font-cinzel text-amber-400 font-black text-lg tracking-tighter">
                  Au
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Gold Rate <span className="text-gold-gradient font-black">India</span>
                </h1>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>API Mitra</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                India Gold Rate • Powered by API Mitra
              </p>
            </div>
          </div>

          {/* Right Action Hub */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Live IST Clock */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] text-slate-400 font-medium">Live IST:</span>
              <span className="font-mono font-semibold tabular-nums text-slate-800 dark:text-slate-200">{currentISTTime}</span>
            </div>

            {/* Manual Refresh CTA */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`relative inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                isRefreshing
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-gold-glow hover:shadow-gold-glow-lg hover:brightness-105 active:scale-95'
              }`}
              title="Refresh API Mitra gold rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Checking...' : 'Refresh'}</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 transition-all duration-200 active:scale-95"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Floating Refresh Alert Banner if any */}
      {refreshCooldownMessage && (
        <div className="bg-amber-500/10 dark:bg-amber-950/80 border-b border-amber-500/20 backdrop-blur-md py-1.5 px-4 text-center text-xs text-amber-900 dark:text-amber-200 font-semibold">
          {refreshCooldownMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
