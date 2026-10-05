import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, ShieldCheck, Award } from 'lucide-react';
import { formatINR } from '../services/goldApi';

const PriceChart = ({ history = [], city = 'India' }) => {
  const [selectedPurity, setSelectedPurity] = useState('24K');

  if (!history || history.length === 0) {
    return null;
  }

  // Map history to clean Indian chart data points
  const chartData = history.map((item, idx) => {
    const prev = idx > 0 ? history[idx - 1] : item;
    const pricePerGram = item[`price${selectedPurity}`] || 0;
    const price10g = item[`price${selectedPurity}_10g`] || Math.round(pricePerGram * 10);
    const prevPricePerGram = prev[`price${selectedPurity}`] || pricePerGram;
    const changeDiff = Number((pricePerGram - prevPricePerGram).toFixed(2));
    const changePct = prevPricePerGram > 0 ? Number(((changeDiff / prevPricePerGram) * 100).toFixed(2)) : 0;

    // Short date format e.g. "05 Oct PM" or "29 Sep"
    let shortLabel = item.rateDate ? item.rateDate.substring(0, 5) : '';
    if (item.rateTime) {
      if (item.rateTime.includes('AM')) shortLabel += ' AM';
      else if (item.rateTime.includes('PM')) shortLabel += ' PM';
    }

    return {
      date: item.rateDate,
      time: item.rateTime || 'Official Release',
      label: shortLabel,
      pricePerGram,
      price10g,
      changeDiff,
      changePct,
      isPositive: changeDiff >= 0
    };
  });

  const prices = chartData.map(d => d.pricePerGram).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices) * 0.997) : 10000;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices) * 1.003) : 16000;
  const currentPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
  const current10g = chartData.length > 0 ? chartData[chartData.length - 1].price10g : 0;
  const firstPrice = prices.length > 0 ? prices[0] : 0;
  const totalChangeDiff = Number((currentPrice - firstPrice).toFixed(2));
  const totalChangePct = firstPrice > 0 ? Number(((totalChangeDiff / firstPrice) * 100).toFixed(2)) : 0;
  const isNetPositive = totalChangeDiff >= 0;

  // Custom clean tooltip for Indian users
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-2xl bg-slate-950/95 text-white p-4 shadow-2xl border border-amber-500/30 backdrop-blur-md text-xs space-y-2 min-w-[210px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px] text-amber-400 font-bold">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{data.date}</span>
            </span>
            <span className="text-slate-400 font-normal">{data.time}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400">Rate per 10g:</span>
              <span className="text-sm font-black text-white tabular-nums">
                {formatINR(data.price10g)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400">Rate per Gram:</span>
              <span className="text-xs font-bold text-amber-300 tabular-nums">
                {formatINR(data.pricePerGram)}/g
              </span>
            </div>
          </div>

          {data.changeDiff !== 0 && (
            <div className={`text-[11px] font-bold pt-1.5 border-t border-slate-800 flex items-center justify-between ${
              data.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <span>Change vs prior session:</span>
              <span>{data.isPositive ? '+' : ''}{formatINR(data.changeDiff)} ({data.isPositive ? '+' : ''}{data.changePct}%)</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-3xl frosted-glass border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 transition-all">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              7-Day Gold Price Trend ({city})
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              API Mitra Historical
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical price movements in INR for {city} sourced from API Mitra
          </p>
        </div>

        {/* Clean Purity Selector Buttons */}
        <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 text-xs font-bold self-start sm:self-auto border border-slate-200/80 dark:border-slate-700">
          {[
            { id: '24K', label: '24K (999)' },
            { id: '22K', label: '22K (916)' },
            { id: '18K', label: '18K (750)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedPurity(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                selectedPurity === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Current Benchmark (10g)</span>
          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
            {formatINR(current10g)}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Current Rate (per 1g)</span>
          <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tabular-nums">
            {formatINR(currentPrice)}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">7-Day Range</span>
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums mt-0.5 block">
            {formatINR(Math.min(...prices))} – {formatINR(Math.max(...prices))}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">7-Day Movement</span>
          <div className={`flex items-center space-x-1 font-black text-xs sm:text-sm tabular-nums mt-0.5 ${
            isNetPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {isNetPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isNetPositive ? '+' : ''}{formatINR(totalChangeDiff)} ({isNetPositive ? '+' : ''}{totalChangePct}%)</span>
          </div>
        </div>
      </div>

      {/* Clean Smooth Area Trend Chart */}
      <div className="w-full h-72 sm:h-80 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="apimitraGoldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.12} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              domain={[minPrice, maxPrice]}
              tickFormatter={(val) => `₹${Math.round(val).toLocaleString('en-IN')}`}
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="pricePerGram"
              stroke="#f59e0b"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#apimitraGoldGradient)"
              dot={{ r: 4, stroke: '#d97706', strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 3, fill: '#0f172a' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Source: API Mitra Commodities Data</span>
        </div>
        <span>Rates shown per gram in Indian Rupees (INR)</span>
      </div>

    </div>
  );
};

export default PriceChart;
