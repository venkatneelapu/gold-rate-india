import React from 'react';
import { formatINR, TOLA_IN_GRAMS, PAVAN_IN_GRAMS } from '../services/goldApi';
import { Table } from 'lucide-react';

const GoldTable = ({ goldData, rateTypeLabel = 'API Mitra Gold Rate' }) => {
  if (!goldData) return null;

  const g24 = goldData['24K']?.perGram || 0;
  const g22 = goldData['22K']?.perGram || 0;
  const g18 = goldData['18K']?.perGram || 0;

  // Supported standard Indian weights
  const rows = [
    { weight: '1 Gram', grams: 1, description: 'Standard retail unit', tag: null },
    { weight: '8 Grams', grams: PAVAN_IN_GRAMS, description: '1 Pavan / Sovereign (Bridal Standard)', tag: 'Popular' },
    { weight: '10 Grams', grams: 10, description: 'Standard 10g Trading Unit', tag: 'Standard' },
    { weight: '11.66 Grams', grams: TOLA_IN_GRAMS, description: '1 Traditional Indian Tola', tag: 'Traditional' },
    { weight: '50 Grams', grams: 50, description: 'Bullion Cast Bar (Half Biscuit)', tag: null },
    { weight: '100 Grams', grams: 100, description: '100g Investment Gold Bar', tag: 'Bullion' }
  ];

  return (
    <div className="w-full rounded-3xl frosted-glass border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all">
      <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/30">
              <Table className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              Gold Price by Weight Table
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard unit denominations dynamically computed from official {rateTypeLabel} rates.
          </p>
        </div>

        <span className="text-xs text-slate-400 self-start sm:self-center font-medium">
          Source: API Mitra
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-4 px-6">Weight</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6 text-right">
                <span className="text-amber-600 dark:text-amber-400 block font-black">24K (999)</span>
                <span className="text-[10px] text-slate-400 font-normal">Pure Gold</span>
              </th>
              <th className="py-4 px-6 text-right">
                <span className="text-yellow-600 dark:text-yellow-400 block font-black">22K (916)</span>
                <span className="text-[10px] text-slate-400 font-normal">Jewellery Rate</span>
              </th>
              <th className="py-4 px-6 text-right">
                <span className="text-orange-600 dark:text-orange-400 block font-black">18K (750)</span>
                <span className="text-[10px] text-slate-400 font-normal">Standard Hallmarked</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {rows.map((row, idx) => {
              const val24 = g24 * row.grams;
              const val22 = g22 * row.grams;
              const val18 = g18 * row.grams;

              return (
                <tr
                  key={idx}
                  className="hover:bg-amber-500/[0.04] dark:hover:bg-amber-500/[0.03] transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white tabular-nums">
                    {row.weight}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{row.description}</span>
                      {row.tag && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          {row.tag}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-slate-900 dark:text-white tabular-nums">
                    {formatINR(val24)}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {formatINR(val22)}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatINR(val18)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoldTable;
