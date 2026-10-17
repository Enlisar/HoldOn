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

  const getScoreStyle = (score: number) => {
    if (score >= 8) {
      return {
        badgeBg: 'bg-[#B9A1F5]/15',
        badgeText: 'text-[#B9A1F5]',
        badgeBorder: 'border-[#B9A1F5]/40',
        barColor: '#B9A1F5',
      };
    }
    if (score >= 5) {
      return {
        badgeBg: 'bg-[#F0C987]/15',
        badgeText: 'text-[#F0C987]',
        badgeBorder: 'border-[#F0C987]/40',
        barColor: '#F0C987',
      };
    }
    return {
      badgeBg: 'bg-[#F08787]/15',
      badgeText: 'text-[#F08787]',
      badgeBorder: 'border-[#F08787]/40',
      barColor: '#F08787',
    };
  };

  const scoreStyle = getScoreStyle(analysis.repairabilityScore);

  return (
    <div className="space-y-3.5 text-[#F4F0FA] font-sans antialiased">
      {/* Product Summary Header */}
      <div className="flex items-start gap-3 p-3 bg-[#292438] rounded-2xl border border-[#3A344E] shadow-[0_4px_16px_rgba(23,21,31,0.25)]">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-12 h-12 object-contain rounded-xl bg-[#17151F] p-1 border border-[#3A344E] flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#C8C2D8]">
            <span className="truncate">{analysis.category}</span>
            {analysis.source === 'grok' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[#B9A1F5]/20 text-[#B9A1F5] border border-[#B9A1F5]/30 flex-shrink-0">
                <Sparkles className="w-2.5 h-2.5" strokeWidth={1.5} /> Grok AI
              </span>
            )}
          </div>
          <h2 className="text-xs font-semibold text-[#F4F0FA] line-clamp-1 mt-0.5" title={product.title}>
            {product.title}
          </h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-[#F0C987]">
              {product.currency} {product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#A69FB8]">
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
            <span className="text-[11px] font-medium text-[#C8C2D8] flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-[#B9A1F5]" strokeWidth={1.5} /> Repairability
            </span>
            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#17151F]/70 ${scoreStyle.badgeText}`}>
              {analysis.repairabilityRating}
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-[#F4F0FA]">
              {analysis.repairabilityScore}
            </span>
            <span className="text-xs text-[#A69FB8] font-medium">/ 10</span>
          </div>
          <div className="w-full bg-[#17151F]/60 rounded-full h-1.5 mt-2 overflow-hidden">
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
        <div className="p-3 rounded-2xl border border-[#3A344E] bg-[#292438] flex flex-col justify-between shadow-[0_4px_16px_rgba(23,21,31,0.2)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#C8C2D8] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F0C987]" strokeWidth={1.5} /> Est. Lifespan
            </span>
            <span className="text-[10px] text-[#A69FB8]">Average</span>
          </div>
          <div className="mt-2.5">
            <div className="text-base font-bold text-[#F4F0FA]">
              {analysis.estimatedLifespan}
            </div>
            <div className="text-[10px] text-[#A69FB8] mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-[#F0C987]" strokeWidth={1.5} />
              <span>Resale ~{analysis.currency}{analysis.resaleValue1Yr.toLocaleString('en-IN')} (1 yr)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verdict Callout */}
      <div className="p-3 rounded-2xl bg-[#292438] border border-[#3A344E] shadow-[0_4px_16px_rgba(23,21,31,0.2)] space-y-1">
        <div className="flex items-start gap-2">
          {analysis.verdictType === 'warning' && (
            <ShieldAlert className="w-4 h-4 text-[#F08787] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          )}
          {analysis.verdictType === 'caution' && (
            <AlertCircle className="w-4 h-4 text-[#F0C987] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          )}
          {(analysis.verdictType === 'recommended' || analysis.verdictType === 'neutral') && (
            <ShieldCheck className="w-4 h-4 text-[#B9A1F5]" strokeWidth={1.5} />
          )}
          <div>
            <div className="text-xs font-semibold text-[#F4F0FA]">
              {analysis.verdict}
            </div>
            <p className="text-[11px] text-[#C8C2D8] leading-relaxed mt-0.5">
              {analysis.summary}
            </p>
          </div>
        </div>
      </div>

      {/* True Ownership Metrics */}
      <div className="p-3 rounded-2xl bg-[#292438]/80 border border-[#3A344E] space-y-2">
        <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#3A344E]">
          <span className="font-semibold text-[#C8C2D8] text-[10px] uppercase tracking-wider">
            True Ownership Cost
          </span>
          <span className="flex items-center gap-1 text-[#B9A1F5] text-[11px]">
            <Leaf className="w-3 h-3" strokeWidth={1.5} /> ~{analysis.co2FootprintKg} kg CO₂e
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
          <div className="p-2 rounded-xl bg-[#17151F] border border-[#3A344E]">
            <div className="text-[9px] text-[#A69FB8] uppercase font-medium">Monthly Cost</div>
            <div className="text-xs font-bold text-[#F4F0FA] mt-0.5">
              {analysis.currency}{analysis.costPerMonth}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#17151F] border border-[#3A344E]">
            <div className="text-[9px] text-[#A69FB8] uppercase font-medium">Per Use</div>
            <div className="text-xs font-bold text-[#F4F0FA] mt-0.5">
              {analysis.currency}{analysis.costPerUse}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#17151F] border border-[#3A344E]">
            <div className="text-[9px] text-[#A69FB8] uppercase font-medium">1-Yr Value Loss</div>
            <div className="text-xs font-bold text-[#F08787] mt-0.5">
              -{100 - analysis.resalePercentage}%
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Toggle */}
        {analysis.breakdown && analysis.breakdown.length > 0 && (
          <div className="pt-1.5">
            <button
              onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
              className="w-full text-left flex items-center justify-between text-[11px] font-medium text-[#C8C2D8] hover:text-[#F4F0FA] py-0.5 transition-colors cursor-pointer"
            >
              <span>Component Factors ({analysis.breakdown.length})</span>
              <ChevronRight
                className={`w-3.5 h-3.5 text-[#B9A1F5] transition-transform duration-200 ${
                  showDetailedBreakdown ? 'rotate-90' : ''
                }`}
                strokeWidth={1.5}
              />
            </button>

            {showDetailedBreakdown && (
              <div className="mt-2 space-y-1.5 pt-1.5 border-t border-[#3A344E]">
                {analysis.breakdown.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#17151F] text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#F4F0FA] flex items-center gap-1.5">
                        {item.status === 'good' && <CheckCircle2 className="w-3 h-3 text-[#B9A1F5]" strokeWidth={1.5} />}
                        {item.status === 'average' && <Info className="w-3 h-3 text-[#F0C987]" strokeWidth={1.5} />}
                        {item.status === 'poor' && <XCircle className="w-3 h-3 text-[#F08787]" strokeWidth={1.5} />}
                        {item.label}
                      </span>
                      <span className="text-[10px] font-semibold text-[#A69FB8]">
                        {item.score}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A69FB8] pl-4 leading-normal">{item.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sustainable Alternatives */}
      {analysis.alternatives && analysis.alternatives.length > 0 && (
        <div className="p-3 rounded-2xl bg-[#292438]/80 border border-[#3A344E] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#F4F0FA]">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#B9A1F5]" strokeWidth={1.5} /> Smarter Alternatives
            </span>
            <span className="text-[10px] text-[#A69FB8] font-normal">Higher durability</span>
          </div>

          <div className="space-y-1.5">
            {analysis.alternatives.map((alt, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#17151F] border border-[#3A344E] flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[#F4F0FA] truncate">{alt.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#292438] text-[#C8C2D8] border border-[#3A344E]">{alt.brand}</span>
                  </div>
                  <p className="text-[10px] text-[#A69FB8] truncate mt-0.5">{alt.highlight}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold text-[#F0C987]">
                    {analysis.currency}{alt.estPrice.toLocaleString('en-IN')}
                  </div>
                  {alt.repairScore && (
                    <div className="text-[10px] text-[#B9A1F5] font-medium">
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
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#B9A1F5] hover:bg-[#cbb9f8] text-[#17151F] shadow-[0_4px_16px_rgba(185,161,245,0.25)] transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>"Should I Buy This?" Decision Check</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#17151F]" strokeWidth={1.5} />
        </button>

        <button
          onClick={onSaveToPauseList}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#292438] hover:bg-[#342E47] text-[#F0C987] border border-[#3A344E] transition-all cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-[#F0C987]" strokeWidth={1.5} />
          <span>Save to 30-Day Pause List</span>
        </button>
      </div>
    </div>
  );
};
