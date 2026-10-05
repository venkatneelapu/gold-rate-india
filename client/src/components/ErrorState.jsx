import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="w-full rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
        <WifiOff className="w-7 h-7" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Unable to Load Gold Rates
      </h3>
      
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
        {message || 'Could not connect to the backend server. Please verify the backend is running on port 5000 and try again.'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-md shadow-rose-600/20 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
