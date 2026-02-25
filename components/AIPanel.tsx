import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Zap } from 'lucide-react';
import { getProjectInsights } from '../services/geminiService';

const AIPanel: React.FC = () => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getProjectInsights();
      setInsight(result || 'No insights available at this time.');
    } catch {
      setError(true);
      setInsight('Unable to load insights. Tap refresh to try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <section
      className="bg-gradient-to-br from-[#3b82f6] via-[#e85d30] to-[#d94d22] dark:from-[#d94d22] dark:via-[#c43d1a] dark:to-[#a03015] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden"
      aria-label="AI Assistant Panel"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-black/10 rounded-full blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight">Kala AI Assistant</h2>
            <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">Smart Insights</p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          aria-label={loading ? 'Loading insights...' : 'Refresh insights'}
          className="
            w-9 h-9 bg-white/20 rounded-xl backdrop-blur-sm
            flex items-center justify-center
            transition-all duration-200
            hover:bg-white/30 active:scale-90
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b82f6]
          "
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[72px] relative" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="space-y-2.5">
            <div className="h-3.5 bg-white/20 rounded-lg w-full animate-shimmer" style={{ animationDelay: '0ms' }} />
            <div className="h-3.5 bg-white/20 rounded-lg w-[90%] animate-shimmer" style={{ animationDelay: '100ms' }} />
            <div className="h-3.5 bg-white/20 rounded-lg w-[70%] animate-shimmer" style={{ animationDelay: '200ms' }} />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-white/80">
            <span className="text-sm font-medium">{insight}</span>
          </div>
        ) : (
          <div className="text-[13px] font-medium leading-relaxed text-white/95">
            {insight.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Flash Reasoning v3</span>
        </div>
        <button
          className="
            flex items-center gap-1.5 text-[11px] font-bold
            bg-white text-[#3b82f6] px-4 py-2 rounded-xl
            shadow-lg shadow-black/10
            transition-all duration-200
            hover:shadow-xl hover:scale-[1.02]
            active:scale-95
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3b82f6]
          "
        >
          <Zap size={12} />
          Optimize Schedule
        </button>
      </div>
    </section>
  );
};

export default AIPanel;
