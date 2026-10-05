import React, { useState } from 'react';
import { Calculator, Percent, Receipt, Info, Sparkles } from 'lucide-react';
import { formatINR, TOLA_IN_GRAMS, PAVAN_IN_GRAMS } from '../services/goldApi';

const GoldCalculator = ({ goldData, city = 'Hyderabad' }) => {
  const [weight, setWeight] = useState('10');
  const [selectedPurity, setSelectedPurity] = useState('22K');
  const [includeGst, setIncludeGst] = useState(true);
  const [makingChargesPercent, setMakingChargesPercent] = useState('10');

  if (!goldData) return null;

  const numericWeight = parseFloat(weight) || 0;
  const purityPricePerGram = goldData[selectedPurity]?.perGram || 0;

  // Base Gold Value (Pure metal value excluding GST and charges)
  const baseGoldValue = numericWeight * purityPricePerGram;

  // Making Charges (customized retail fee percentage)
  const makingChargesPct = parseFloat(makingChargesPercent) || 0;
  const makingCharges = (baseGoldValue * makingChargesPct) / 100;

  // Taxable Base
  const taxableAmount = baseGoldValue + makingCharges;

  // 3% GST on jewellery (applicable on gold value + making charges in Indian retail)
  const gstAmount = includeGst ? taxableAmount * 0.03 : 0;

  // Estimated Retail Total
  const estimatedTotal = taxableAmount + gstAmount;

  // Supported standard Indian weights: 1g, 8g (1 Pavan), 10g (Benchmark), 1 Tola (11.6638g), 50g, 100g
  const quickWeights = [
    { label: '1g', val: '1' },
    { label: '8g (1 Pavan)', val: String(PAVAN_IN_GRAMS) },
    { label: '10g (Benchmark)', val: '10' },
    { label: '1 Tola (11.66g)', val: String(TOLA_IN_GRAMS) },
    { label: '50g', val: '50' },
    { label: '100g (1 Bar)', val: '100' }
  ];

  return (
    <div className="w-full rounded-3xl frosted-glass border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-gold-glow">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              Estimated Jewellery Purchase Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Computed strictly from API Mitra gold rates with separate making charges and 3% GST breakdown
            </p>
          </div>
        </div>

        <span className="inline-flex items-center self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
          API Mitra Reference ({city})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Input Configuration */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Purity Switcher */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Select Purity
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: '24K', name: '24K Gold', purity: '999 Fine' },
                { id: '22K', name: '22K Gold', purity: '916 Hallmark' },
                { id: '18K', name: '18K Gold', purity: '750 Standard' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPurity(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedPurity === p.id
                      ? 'bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white ring-2 ring-amber-500/30 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="font-extrabold text-sm">{p.name}</div>
                  <div className="text-[11px] opacity-75">{p.purity}</div>
                  <div className="text-xs font-mono font-bold mt-1 text-amber-600 dark:text-amber-400">
                    {formatINR(goldData[p.id]?.perGram)}/g
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight Input & Quick Presets */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="calc-weight-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Weight (in Grams)
              </label>
              <span className="text-xs text-slate-400">1 Pavan = 8g • 1 Tola = 11.66g • 10g Benchmark</span>
            </div>

            <div className="relative rounded-2xl shadow-sm">
              <input
                id="calc-weight-input"
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight in grams"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-4 py-3.5 text-base font-extrabold text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-xs font-bold text-slate-400">
                GRAMS
              </div>
            </div>

            {/* Quick Weight Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickWeights.map(q => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => setWeight(q.val)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                    weight === q.val
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Making Charges Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="making-charges-slider" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Estimated Making Charges: <span className="text-amber-500 font-extrabold">{makingChargesPercent}%</span>
              </label>
              <span className="text-xs text-slate-400">Typical retail: 8% – 18%</span>
            </div>
            <input
              id="making-charges-slider"
              type="range"
              min="0"
              max="25"
              step="1"
              value={makingChargesPercent}
              onChange={(e) => setMakingChargesPercent(e.target.value)}
              className="w-full accent-amber-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3% GST Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <Percent className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Add 3% Jewellery GST
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Base market gold rate excludes GST. Retail billing adds 3% on (Gold + Making Charges).
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIncludeGst(!includeGst)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                includeGst ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeGst ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Right Cost Summary Receipt */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-7 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    Estimate Receipt
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-400">
                  {selectedPurity} · {numericWeight}g
                </span>
              </div>

              {/* Breakdown Items */}
              <div className="space-y-3.5 py-5 text-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Base Gold Value ({numericWeight}g @ {formatINR(purityPricePerGram)}/g):</span>
                  <strong className="font-mono text-white text-base">{formatINR(baseGoldValue)}</strong>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span>Making Charges ({makingChargesPercent}%):</span>
                  <strong className="font-mono text-slate-200">{formatINR(makingCharges)}</strong>
                </div>

                <div className="flex justify-between items-center text-slate-400 text-xs pt-1 border-t border-slate-800">
                  <span>Subtotal before Tax:</span>
                  <span className="font-mono">{formatINR(taxableAmount)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span>GST (3%):</span>
                  <strong className="font-mono text-amber-300">{formatINR(gstAmount)}</strong>
                </div>
              </div>
            </div>

            {/* Total Footer */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block">
                    Estimated Total
                  </span>
                  <span className="text-[11px] text-slate-500">Includes Gold Value + Making + GST</span>
                </div>
                <div className="text-3xl sm:text-4xl font-display font-black text-amber-400 tabular-nums">
                  {formatINR(estimatedTotal)}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 leading-normal flex items-start space-x-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Info className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                <span>
                  <strong>Market Notice:</strong> Base gold prices strictly exclude GST and making charges. Jewellers determine their own making charges.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default GoldCalculator;
