import React, { useEffect, useState } from 'react';
import { analyzeProductWithGrok } from '../lib/api';
import { addToPauseList, getSettings } from '../lib/storage';
import type { ProductInfo, TrueCostAnalysis } from '../lib/types';
import { DecisionTree } from './DecisionTree';
import { LocalOptions } from './LocalOptions';
import { PauseList } from './PauseList';
import { ScoreCard } from './ScoreCard';
import { SettingsModal } from './SettingsModal';
import { 
  Pause, 
  X, 
  Minus, 
  HelpCircle, 
  MapPin, 
  Clock, 
  Settings, 
  Sparkles, 
  Check, 
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface FloatingCardProps {
  product: ProductInfo;
  onClose?: () => void;
  standalone?: boolean;
}

type TabType = 'scorecard' | 'decision' | 'local' | 'pause' | 'settings';

export const FloatingCard: React.FC<FloatingCardProps> = ({
  product,
  onClose,
  standalone = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('scorecard');
  const [minimized, setMinimized] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<TrueCostAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPausePrompt, setShowPausePrompt] = useState<boolean>(false);
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [pauseSuccess, setPauseSuccess] = useState<boolean>(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeProductWithGrok(
        product.title,
        product.price,
        product.currency,
        product.category
      );
      setAnalysis(result);
    } catch (err) {
      console.error('[HoldOn] Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
    runAnalysis();
  }, [product.title, product.price]);

  const handleSaveToPause = async () => {
    await addToPauseList({
      title: product.title,
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl,
      url: product.url,
      category: analysis?.category || product.category,
      reflectionNote: reflectionNote.trim() || 'Impulse cool-off for 30 days.',
      co2EstimateKg: analysis?.co2FootprintKg || 15,
    });
    setPauseSuccess(true);
    setTimeout(() => {
      setPauseSuccess(false);
      setShowPausePrompt(false);
      setActiveTab('pause');
    }, 1200);
  };

  // Calm Minimalist Minimized Pill View
  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999999] font-sans antialiased">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#F7F6F0] hover:bg-white text-[#252923] border border-[#E9E7E0] shadow-[0_8px_24px_rgba(37,41,35,0.08)] backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-[#A7B79B] flex items-center justify-center text-[#252923] shadow-sm">
            <Pause className="w-2.5 h-2.5 fill-[#252923] text-[#252923]" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-[#252923] flex items-center gap-1.5">
              <span>HoldOn</span>
              {analysis && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E9E7E0] text-[#3E5234] font-medium">
                  {analysis.repairabilityScore}/10
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#5E645A]">Click to review</div>
          </div>
          <Maximize2 className="w-3.5 h-3.5 text-[#8A9084] group-hover:text-[#252923] transition-colors ml-1" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // Master Floating Window in Calm Minimalism
  return (
    <div
      className={`${
        standalone
          ? 'relative w-full max-w-md mx-auto shadow-sm'
          : 'fixed top-5 right-5 z-[9999999] w-[390px] shadow-[0_12px_40px_rgba(37,41,35,0.08)]'
      } font-sans antialiased text-[#252923] transition-all duration-200`}
      style={{
        maxHeight: standalone ? 'none' : 'calc(100vh - 40px)',
      }}
    >
      <div className="flex flex-col bg-[#F7F6F0] border border-[#E9E7E0] rounded-2xl overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#F7F6F0] border-b border-[#E9E7E0] select-none">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#A7B79B] flex items-center justify-center text-[#252923] shadow-xs">
              <Pause className="w-2.5 h-2.5 fill-[#252923] text-[#252923]" strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-[#252923]">HoldOn</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-[#A7B79B]/20 text-[#3E5234]">
                Circular Lens
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={runAnalysis}
              className="p-1 rounded-lg text-[#5E645A] hover:text-[#252923] hover:bg-[#E9E7E0] transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            </button>
            {!standalone && (
              <button
                onClick={() => setMinimized(true)}
                className="p-1 rounded-lg text-[#5E645A] hover:text-[#252923] hover:bg-[#E9E7E0] transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#5E645A] hover:text-[#252923] hover:bg-[#E9E7E0] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-2 py-1.5 bg-[#F0EEE7] border-b border-[#E9E7E0] text-xs">
          {[
            { id: 'scorecard', label: 'Scorecard', icon: <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'decision', label: 'Decision', icon: <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'local', label: 'Local', icon: <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'pause', label: 'Pause List', icon: <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" strokeWidth={1.5} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setShowPausePrompt(false);
              }}
              className={`flex-1 py-1 px-1.5 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#252923] shadow-xs font-semibold'
                  : 'text-[#5E645A] hover:text-[#252923]'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Card Body */}
        <div className="p-3.5 overflow-y-auto max-h-[520px]">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#A7B79B] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#252923]">
                  Analysing True Cost &amp; Durability...
                </p>
                <p className="text-[11px] text-[#5E645A]">
                  Reviewing lifespan, repairability index, and local alternatives
                </p>
              </div>
            </div>
          ) : showPausePrompt ? (
            /* Quick Modal: Save to 30-Day Pause List */
            <div className="space-y-3 p-1">
              <div className="flex items-center justify-between pb-1 border-b border-[#E9E7E0]">
                <span className="text-xs font-semibold text-[#252923] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D9A66B]" strokeWidth={1.5} />
                  Save to 30-Day Pause List
                </span>
                <button
                  onClick={() => setShowPausePrompt(false)}
                  className="text-xs text-[#5E645A] hover:text-[#252923] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#E9E7E0] text-xs">
                <div className="font-semibold text-[#252923] truncate">{product.title}</div>
                <div className="text-[#3E5234] font-bold mt-0.5">
                  {product.currency} {product.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#5E645A] font-medium">
                  Reflection note (Why do you want this right now?):
                </label>
                <textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="e.g. Looks interesting, but stepping back to see if I genuinely need it next month..."
                  rows={3}
                  className="w-full bg-white border border-[#E9E7E0] rounded-xl p-2.5 text-xs text-[#252923] placeholder:text-[#8A9084] focus:outline-none focus:border-[#A7B79B] resize-none"
                />
              </div>

              {pauseSuccess ? (
                <div className="p-2.5 rounded-xl bg-[#A7B79B]/20 border border-[#A7B79B]/40 text-[#3E5234] text-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" strokeWidth={1.5} /> Saved to 30-Day Pause Shield
                </div>
              ) : (
                <button
                  onClick={handleSaveToPause}
                  className="w-full py-2.5 rounded-xl bg-[#252923] hover:bg-[#343a31] text-[#F7F6F0] font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-[#D9A66B]" strokeWidth={1.5} />
                  <span>Start 30-Day Reflection</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {activeTab === 'scorecard' && analysis && (
                <ScoreCard
                  analysis={analysis}
                  product={product}
                  onOpenDecisionTree={() => setActiveTab('decision')}
                  onSaveToPauseList={() => setShowPausePrompt(true)}
                />
              )}

              {activeTab === 'decision' && (
                <DecisionTree
                  product={product}
                  onFinishRecommendation={() => {}}
                  onSwitchToLocalOptions={() => setActiveTab('local')}
                  onSwitchToPauseList={() => setShowPausePrompt(true)}
                  onBackToScorecard={() => setActiveTab('scorecard')}
                />
              )}

              {activeTab === 'local' && <LocalOptions />}

              {activeTab === 'pause' && (
                <PauseList onBackToScorecard={() => setActiveTab('scorecard')} />
              )}

              {activeTab === 'settings' && <SettingsModal />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
