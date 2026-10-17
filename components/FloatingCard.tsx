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

  // Minimized Pill View
  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999999] font-sans antialiased">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#17151F] hover:bg-[#292438] text-[#F4F0FA] border border-[#3A344E] shadow-[0_8px_32px_rgba(23,21,31,0.5)] backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-[#B9A1F5] flex items-center justify-center text-[#17151F] shadow-sm">
            <Pause className="w-2.5 h-2.5 fill-[#17151F] text-[#17151F]" strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#F4F0FA]">HoldOn</span>
            {analysis && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#292438] text-[#F0C987] font-medium border border-[#3A344E]">
                {analysis.repairabilityScore}/10
              </span>
            )}
          </div>
          <Maximize2 className="w-3.5 h-3.5 text-[#A69FB8] group-hover:text-[#F4F0FA] transition-colors ml-1" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  // Master Floating Window
  return (
    <div
      className={`${
        standalone
          ? 'relative w-full max-w-md mx-auto shadow-sm'
          : 'fixed top-5 right-5 z-[9999999] w-[390px] shadow-[0_16px_48px_rgba(23,21,31,0.6)]'
      } font-sans antialiased text-[#F4F0FA] transition-all duration-200`}
      style={{
        maxHeight: standalone ? 'none' : 'calc(100vh - 40px)',
      }}
    >
      <div className="flex flex-col bg-[#17151F] border border-[#3A344E] rounded-2xl overflow-hidden backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#17151F] border-b border-[#3A344E] select-none">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#B9A1F5] flex items-center justify-center text-[#17151F] shadow-sm">
              <Pause className="w-2.5 h-2.5 fill-[#17151F] text-[#17151F]" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold tracking-tight text-[#F4F0FA]">HoldOn</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={runAnalysis}
              className="p-1 rounded-lg text-[#A69FB8] hover:text-[#F4F0FA] hover:bg-[#292438] transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            </button>
            {!standalone && (
              <button
                onClick={() => setMinimized(true)}
                className="p-1 rounded-lg text-[#A69FB8] hover:text-[#F4F0FA] hover:bg-[#292438] transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#A69FB8] hover:text-[#F4F0FA] hover:bg-[#292438] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-2 py-1.5 bg-[#292438] border-b border-[#3A344E] text-xs">
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
                  ? 'bg-[#17151F] text-[#B9A1F5] shadow-sm font-semibold'
                  : 'text-[#A69FB8] hover:text-[#F4F0FA]'
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
              <div className="w-8 h-8 border-2 border-[#B9A1F5] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#F4F0FA]">
                  Analyzing True Cost &amp; Durability...
                </p>
                <p className="text-[11px] text-[#A69FB8]">
                  Evaluating lifespan, repairability index, and local alternatives
                </p>
              </div>
            </div>
          ) : showPausePrompt ? (
            /* Quick Modal: Save to 30-Day Pause List */
            <div className="space-y-3 p-1">
              <div className="flex items-center justify-between pb-1 border-b border-[#3A344E]">
                <span className="text-xs font-semibold text-[#F0C987] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F0C987]" strokeWidth={1.5} />
                  Save to 30-Day Pause List
                </span>
                <button
                  onClick={() => setShowPausePrompt(false)}
                  className="text-xs text-[#A69FB8] hover:text-[#F4F0FA] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-[#292438] border border-[#3A344E] text-xs">
                <div className="font-semibold text-[#F4F0FA] truncate">{product.title}</div>
                <div className="text-[#F0C987] font-bold mt-0.5">
                  {product.currency} {product.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#C8C2D8] font-medium">
                  Reflection note (Why do you want this right now?):
                </label>
                <textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="e.g. Looks enticing, but pausing to see if it remains necessary next month..."
                  rows={3}
                  className="w-full bg-[#292438] border border-[#3A344E] rounded-xl p-2.5 text-xs text-[#F4F0FA] placeholder:text-[#5E5873] focus:outline-none focus:border-[#B9A1F5] resize-none"
                />
              </div>

              {pauseSuccess ? (
                <div className="p-2.5 rounded-xl bg-[#B9A1F5]/20 border border-[#B9A1F5]/40 text-[#B9A1F5] text-xs flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" strokeWidth={1.5} /> Saved to 30-Day Pause Shield
                </div>
              ) : (
                <button
                  onClick={handleSaveToPause}
                  className="w-full py-2.5 rounded-xl bg-[#B9A1F5] hover:bg-[#cbb9f8] text-[#17151F] font-semibold text-xs shadow-[0_4px_16px_rgba(185,161,245,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-[#17151F]" strokeWidth={1.5} />
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
