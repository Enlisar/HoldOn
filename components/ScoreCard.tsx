import React, { useState } from 'react';
import type { TrueCostAnalysis, ProductInfo } from '../lib/types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Wrench, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  TrendingDown, 
  Leaf, 
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface ScoreCardProps {
  analysis: TrueCostAnalysis;
  product: ProductInfo;
  onOpenDecisionTree: () => void;
  onSaveToPauseList: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  analysis,
  product,
  onOpenDecisionTree,
  onSaveToPauseList,
}) => {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Calm color styling helper
  const getScoreStyle = (score: number) => {
    if (score >= 8) {
      return {
        badgeBg: 'bg-[#A7B79B]/15',
        badgeText: 'text-[#3E5234]',
        badgeBorder: 'border-[#A7B79B]/40',
        barColor: '#A7B79B',
      };
    }
    if (score >= 5) {
      return {
        badgeBg: 'bg-[#D9A66B]/15',
        badgeText: 'text-[#825520]',
        badgeBorder: 'border-[#D9A66B]/40',
        barColor: '#D9A66B',
      };
    }
    return {
      badgeBg: 'bg-[#B96C60]/15',
      badgeText: 'text-[#8A3B30]',
      badgeBorder: 'border-[#B96C60]/40',
      barColor: '#B96C60',
    };
  };

  const scoreStyle = getScoreStyle(analysis.repairabilityScore);

  return (
    <div className="space-y-3.5 text-[#252923] font-sans antialiased">
      {/* Product Summary Header */}
      <div className="flex items-start gap-3 p-3 bg-white/80 rounded-2xl border border-[#E9E7E0] shadow-[0_2px_8px_rgba(37,41,35,0.04)]">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-12 h-12 object-contain rounded-xl bg-[#F7F6F0] p-1 border border-[#E9E7E0] flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5E645A]">
            <span className="truncate">{analysis.category}</span>
            {analysis.source === 'grok' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#A7B79B]/20 text-[#334628] border border-[#A7B79B]/30 flex-shrink-0">
                <Sparkles className="w-2.5 h-2.5" strokeWidth={1.5} /> Grok AI
              </span>
            )}
          </div>
          <h2 className="text-xs font-semibold text-[#252923] line-clamp-1 mt-0.5" title={product.title}>
            {product.title}
          </h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-[#252923]">
              {product.currency} {product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#5E645A]">
              • {analysis.currency}{analysis.costPerMonth}/mo over {analysis.estimatedLifespan}
            </span>
          </div>
        </div>
      </div>

      {/* Repairability & Lifespan Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Repairability Gauge */}
        <div className={`p-3 rounded-2xl border ${scoreStyle.badgeBorder} ${scoreStyle.badgeBg} flex flex-col justify-between`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#5E645A] flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-[#5E645A]" strokeWidth={1.5} /> Repairability
            </span>
            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-white/70 ${scoreStyle.badgeText}`}>
              {analysis.repairabilityRating}
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-[#252923]">
              {analysis.repairabilityScore}
            </span>
            <span className="text-xs text-[#5E645A] font-medium">/ 10</span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${analysis.repairabilityScore * 10}%`,
                backgroundColor: scoreStyle.barColor,
              }}
            />
          </div>
        </div>

        {/* Expected Lifespan */}
        <div className="p-3 rounded-2xl border border-[#E9E7E0] bg-white/80 flex flex-col justify-between shadow-[0_2px_8px_rgba(37,41,35,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#5E645A] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#5E645A]" strokeWidth={1.5} /> Est. Lifespan
            </span>
            <span className="text-[10px] text-[#5E645A]">Average</span>
          </div>
          <div className="mt-2.5">
            <div className="text-base font-bold text-[#252923]">
              {analysis.estimatedLifespan}
            </div>
            <div className="text-[10px] text-[#5E645A] mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-[#D9A66B]" strokeWidth={1.5} />
              <span>Resale ~{analysis.currency}{analysis.resaleValue1Yr.toLocaleString('en-IN')} (1 yr)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calm Verdict Callout */}
      <div className="p-3 rounded-2xl bg-white/90 border border-[#E9E7E0] shadow-[0_2px_8px_rgba(37,41,35,0.03)] space-y-1">
        <div className="flex items-start gap-2">
          {analysis.verdictType === 'warning' && (
            <ShieldAlert className="w-4 h-4 text-[#B96C60] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          )}
          {analysis.verdictType === 'caution' && (
            <AlertCircle className="w-4 h-4 text-[#D9A66B] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          )}
          {(analysis.verdictType === 'recommended' || analysis.verdictType === 'neutral') && (
            <ShieldCheck className="w-4 h-4 text-[#3E5234]" strokeWidth={1.5} />
          )}
          <div>
            <div className="text-xs font-semibold text-[#252923]">
              {analysis.verdict}
            </div>
            <p className="text-[11px] text-[#5E645A] leading-relaxed mt-0.5">
              {analysis.summary}
            </p>
          </div>
        </div>
      </div>

      {/* True Ownership Metrics */}
      <div className="p-3 rounded-2xl bg-white/70 border border-[#E9E7E0] space-y-2">
        <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#E9E7E0]">
          <span className="font-semibold text-[#5E645A] text-[10px] uppercase tracking-wider">
            True Ownership Cost
          </span>
          <span className="flex items-center gap-1 text-[#3E5234] text-[11px]">
            <Leaf className="w-3 h-3" strokeWidth={1.5} /> ~{analysis.co2FootprintKg} kg CO₂e
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
          <div className="p-2 rounded-xl bg-[#F7F6F0] border border-[#E9E7E0]">
            <div className="text-[9px] text-[#5E645A] uppercase font-medium">Monthly Cost</div>
            <div className="text-xs font-bold text-[#252923] mt-0.5">
              {analysis.currency}{analysis.costPerMonth}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#F7F6F0] border border-[#E9E7E0]">
            <div className="text-[9px] text-[#5E645A] uppercase font-medium">Per Use</div>
            <div className="text-xs font-bold text-[#252923] mt-0.5">
              {analysis.currency}{analysis.costPerUse}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#F7F6F0] border border-[#E9E7E0]">
            <div className="text-[9px] text-[#5E645A] uppercase font-medium">1-Yr Value Loss</div>
            <div className="text-xs font-bold text-[#B96C60] mt-0.5">
              -{100 - analysis.resalePercentage}%
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Toggle */}
        {analysis.breakdown && analysis.breakdown.length > 0 && (
          <div className="pt-1.5">
            <button
              onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
              className="w-full text-left flex items-center justify-between text-[11px] font-medium text-[#5E645A] hover:text-[#252923] py-0.5 transition-colors cursor-pointer"
            >
              <span>Component Factors ({analysis.breakdown.length})</span>
              <ChevronRight
                className={`w-3.5 h-3.5 text-[#5E645A] transition-transform duration-200 ${
                  showDetailedBreakdown ? 'rotate-90' : ''
                }`}
                strokeWidth={1.5}
              />
            </button>

            {showDetailedBreakdown && (
              <div className="mt-2 space-y-1.5 pt-1.5 border-t border-[#E9E7E0]">
                {analysis.breakdown.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#F7F6F0] text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#252923] flex items-center gap-1.5">
                        {item.status === 'good' && <CheckCircle2 className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} />}
                        {item.status === 'average' && <Info className="w-3 h-3 text-[#D9A66B]" strokeWidth={1.5} />}
                        {item.status === 'poor' && <XCircle className="w-3 h-3 text-[#B96C60]" strokeWidth={1.5} />}
                        {item.label}
                      </span>
                      <span className="text-[10px] font-semibold text-[#5E645A]">
                        {item.score}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-[#5E645A] pl-4 leading-normal">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sustainable Alternatives */}
      {analysis.alternatives && analysis.alternatives.length > 0 && (
        <div className="p-3 rounded-2xl bg-white/70 border border-[#E9E7E0] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#252923]">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#A7B79B]" strokeWidth={1.5} /> Circular Alternatives
            </span>
            <span className="text-[10px] text-[#5E645A] font-normal">Higher durability</span>
          </div>

          <div className="space-y-1.5">
            {analysis.alternatives.map((alt, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#F7F6F0] border border-[#E9E7E0] flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[#252923] truncate">{alt.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-[#5E645A] border border-[#E9E7E0]">{alt.brand}</span>
                  </div>
                  <p className="text-[10px] text-[#5E645A] truncate mt-0.5">{alt.highlight}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold text-[#252923]">
                    {analysis.currency}{alt.estPrice.toLocaleString('en-IN')}
                  </div>
                  {alt.repairScore && (
                    <div className="text-[10px] text-[#3E5234] font-medium">
                      Score: {alt.repairScore}/10
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onOpenDecisionTree}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#252923] hover:bg-[#343a31] text-[#F7F6F0] shadow-sm transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>"Should I Buy This?" Decision Check</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#A7B79B]" strokeWidth={1.5} />
        </button>

        <button
          onClick={onSaveToPauseList}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-[#F0EEE7] text-[#252923] border border-[#E9E7E0] transition-all cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-[#D9A66B]" strokeWidth={1.5} />
          <span>Save to 30-Day Pause List</span>
        </button>
      </div>
    </div>
  );
};
