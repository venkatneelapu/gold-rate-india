import React from 'react';
import { Info, Building2 } from 'lucide-react';

const Disclaimer = () => {
  return (
    <footer className="w-full mt-12 rounded-3xl frosted-glass border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 transition-all">
      <div className="flex items-start space-x-4 sm:space-x-5">
        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-1">
          <Building2 className="w-5 h-5" />
        </div>
        
        <div className="space-y-4 flex-1">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-display font-bold text-slate-900 dark:text-white">
                About Indian Gold Market Rates
              </h4>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Powered by API Mitra
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Indian Commodity Reference
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              The gold market rates published on this platform are sourced from API Mitra's Indian commodities data feed. Rates represent base wholesale market prices quoted per gram in Indian Rupees (INR) and exclude GST (3%), local taxes, and retail jeweller making charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Indian GST (3%)
              </span>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Under the Indian tax regime, retail jewellery purchases add 3% GST on precious metal value and 5% GST on artisan making charges.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Making Charges &amp; Wastage
              </span>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Jewellers determine their own crafting/making fees (typically 8% to 18%) depending on artisanal intricacy and design specifications.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Standard Purity Definitions
              </span>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                24K refers to 999 purity fine gold, 22K refers to 916 hallmarked jewellery gold, and 18K refers to 750 standard hallmarked gold.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Disclaimer;
