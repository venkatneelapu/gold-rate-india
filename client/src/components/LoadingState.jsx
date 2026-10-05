import React from 'react';

const LoadingState = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-16 w-full rounded-2xl bg-slate-200 dark:bg-slate-800/80" />

      {/* 3 Gold Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800/60 rounded" />
            <div className="pt-4 space-y-2">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
              <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Calculator / Interactive Skeleton */}
      <div className="h-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6" />

      {/* Chart Skeleton */}
      <div className="h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6" />

      {/* Table Skeleton */}
      <div className="h-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6" />
    </div>
  );
};

export default LoadingState;
