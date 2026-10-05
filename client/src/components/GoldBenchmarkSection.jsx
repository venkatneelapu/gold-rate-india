import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, MapPin, Scale, AlertTriangle, ShieldCheck, ChevronDown } from 'lucide-react';
import { formatINR } from '../services/goldApi';

const GoldBenchmarkSection = ({ data, selectedCity, onCityChange, availableCities = [] }) => {
  const [selectedUnit, setSelectedUnit] = useState('1g'); // '1g' | '10g' | '8g' | 'tola'

  if (!data) return null;

  const rates = data.rates || data.gold;
  if (!rates) return null;

  const location = data.location || selectedCity || 'India';
  const isApiConnected = data.apiConnected !== false;
  const isCached = data.status === 'fallback' || !isApiConnected;
  const priceChange = data.priceChange;
  const hasChange = priceChange && priceChange.hasComparison;

  // City list with default fallback
  const cityList = availableCities && availableCities.length > 0 
    ? availableCities 
    : ['India', 'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Hyderabad'];

  // Timestamps
  const lastFetchedText = data.fetchedAtFormatted || data.lastSuccessfulUpdate || 'Recently';

  const purities = [
    {
      key: '24K',
      title: '24K Gold',
      purity: '999 Pure',
      badge: '99.9% 24 Karat Gold',
      isHero: true
    },
    {
      key: '22K',
      title: '22K Gold',
      purity: '916 Hallmarked',
      badge: '91.6% Jewellery Grade',
      isHero: false
    },
    {
      key: '18K',
      title: '18K Gold',
      purity: '750 Hallmarked',
      badge: '75.0% Standard Grade',
      isHero: false
    }
  ];

  const getUnitDisplay = (item) => {
    switch (selectedUnit) {
      case '10g':
        return {
          price: item.per10Grams,
          unitLabel: '/ 10 grams',
          secondaryLabel: `₹${Number(item.perGram).toLocaleString('en-IN')} / gram`
        };
      case '8g':
        return {
          price: item.per8GramsPavan || item.perGram * 8,
          unitLabel: '/ Sovereign (8g)',
          secondaryLabel: `₹${Number(item.perGram).toLocaleString('en-IN')} / gram`
        };
      case 'tola':
        return {
          price: item.perTola || item.perGram * 11.6638,
          unitLabel: '/ Tola (11.66g)',
          secondaryLabel: `₹${Number(item.perGram).toLocaleString('en-IN')} / gram`
        };
      case '1g':
      default:
        return {
          price: item.perGram,
          unitLabel: '/ gram',
          secondaryLabel: `₹${Number(item.per10Grams).toLocaleString('en-IN')} / 10g`
        };
    }
  };

  return (
    <section aria-labelledby="gold-rates-heading" className="space-y-6">
      
      {/* Offline / Fallback Notice strictly when API fails */}
      {isCached && (
        <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 backdrop-blur-md">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong className="font-bold">Notice: </strong>
            Unable to fetch the latest gold rate. Showing last successfully fetched rate ({lastFetchedText}). No artificial or spot rates are used.
          </div>
        </div>
      )}

      {/* Main Benchmark Card Container */}
      <div className="frosted-glass rounded-3xl p-6 sm:p-8 space-y-7 border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
        
        {/* Top Header: Title, City Selector, and Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-200/70 dark:border-slate-800/70">
          
          {/* Left Title & Status Indicator */}
          <div>
            <div className="flex items-center space-x-2.5 mb-2 flex-wrap">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${
                isApiConnected
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span>{isApiConnected ? '● API Connected' : '● API Temporarily Unavailable'}</span>
              </span>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Source: API Mitra
              </span>
            </div>

            <div className="flex items-center space-x-3 flex-wrap">
              <h2 id="gold-rates-heading" className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Today's Gold Rate in <span className="text-gold-gradient font-black">{location}</span>
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Indian Gold Market Rate • Powered by API Mitra
            </p>
          </div>

          {/* Right Controls: Interactive City Selector & Fetch Timestamp */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 text-xs">
            
            {/* Indian City Dropdown Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Select City:</span>
              </span>
              <div className="relative">
                <select
                  value={selectedCity || 'India'}
                  onChange={(e) => onCityChange && onCityChange(e.target.value)}
                  className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold py-2 pl-3.5 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-colors shadow-sm"
                >
                  {cityList.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Fetch Timestamp Display */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Last Updated:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{lastFetchedText}</strong>
            </div>

          </div>

        </div>

        {/* Denomination Unit Selector Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Scale className="w-4 h-4 text-amber-500" />
            <span>Select Denomination:</span>
          </div>

          <div className="inline-flex p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs font-bold overflow-x-auto max-w-full">
            {[
              { id: '1g', label: '1 Gram' },
              { id: '10g', label: '10 Grams' },
              { id: '8g', label: '1 Sovereign / Pavan (8g)' },
              { id: 'tola', label: '1 Tola (11.66g)' }
            ].map(unit => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 shrink-0 ${
                  selectedUnit === unit.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {unit.label}
              </button>
            ))}
          </div>
        </div>

        {/* 24K, 22K, 18K Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {purities.map(({ key, title, purity, badge, isHero }) => {
            const item = rates[key];
            if (!item) return null;

            const changeItem = hasChange ? priceChange[key] : null;
            const isPos = changeItem ? changeItem.isPositive : true;
            const unitInfo = getUnitDisplay(item);

            return (
              <div
                key={key}
                className={`relative rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                  isHero
                    ? 'gold-card-hero'
                    : 'frosted-glass rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:-translate-y-1'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                      {title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {purity}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isHero
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                    {badge}
                  </span>
                </div>

                {/* Main Price */}
                <div className="space-y-1 mb-4">
                  <div className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                    {formatINR(unitInfo.price)}
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1.5">
                      {unitInfo.unitLabel}
                    </span>
                  </div>
                  
                  {/* Secondary Benchmark */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Reference: <span className="font-semibold text-slate-700 dark:text-slate-300">{unitInfo.secondaryLabel}</span>
                  </div>
                </div>

                {/* Session Change against previous snapshot for the same city */}
                {changeItem && (
                  <div className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-xl ${
                    isPos
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                  }`}>
                    {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPos ? '+' : ''}{formatINR(changeItem.diff)} ({isPos ? '+' : ''}{changeItem.percentage}%)</span>
                    <span className="text-[10px] text-slate-400 font-normal">vs prev update</span>
                  </div>
                )}
                {!changeItem && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    No previous data
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Statutory Footnote */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div>
            <strong>* Market Notice:</strong> Rates exclude 3% GST and retail jewellery making charges.
          </div>
          <div className="text-slate-400">
            Source: <strong className="text-slate-600 dark:text-slate-300">API Mitra</strong>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GoldBenchmarkSection;
