import React, { useEffect, useState } from 'react';
import { analyzeProductWithAi } from '../lib/api';
import { addToPauseList, getSettings } from '../lib/storage';
import type { ProductInfo, TrueCostAnalysis } from '../lib/types';
import { DecisionTree } from './DecisionTree';
import { ScoreCard } from './ScoreCard';
import { LocalOptions } from './LocalOptions';
import { PauseList } from './PauseList';
import { SettingsModal } from './SettingsModal';
import { 
  Pause, 
  Sparkles, 
  HelpCircle, 
  MapPin, 
  Clock, 
  Settings, 
  X, 
  Minus, 
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
  const [minimized, setMinimized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('scorecard');
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<TrueCostAnalysis | null>(null);
  const [showPausePrompt, setShowPausePrompt] = useState<boolean>(false);
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeProductWithAi(
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
      co2EstimateKg: analysis?.co2FootprintKg || 25,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
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
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-black hover:bg-neutral-900 text-white border border-neutral-800 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer group"
        >
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
            <Pause className="w-2.5 h-2.5 fill-black text-black" strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">HoldOn</span>
            {analysis && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-900 text-white font-medium border border-neutral-800">
                {analysis.repairabilityScore}/10
              </span>
            )}
          </div>
          <Maximize2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors ml-1" strokeWidth={1.5} />
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
          : 'fixed top-5 right-5 z-[9999999] w-[390px] shadow-[0_16px_48px_rgba(0,0,0,0.8)]'
      } font-sans antialiased text-white transition-all duration-200`}
      style={{
        maxHeight: standalone ? 'none' : 'calc(100vh - 40px)',
      }}
    >
      <div className="flex flex-col bg-black border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-neutral-800 select-none">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
              <Pause className="w-2.5 h-2.5 fill-black text-black" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">HoldOn</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={runAnalysis}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            </button>
            {!standalone && (
              <button
                onClick={() => setMinimized(true)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-2 py-1.5 bg-neutral-950 border-b border-neutral-800 text-xs">
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
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
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
              <div className="w-8 h-8 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-white">Analyzing Lifecycle &amp; Repairability</p>
                <p className="text-[11px] text-neutral-400">Evaluating repairability and true ownership cost...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab 1: Scorecard */}
              {activeTab === 'scorecard' && analysis && (
                <ScoreCard
                  analysis={analysis}
                  product={product}
                  onOpenDecisionTree={() => setActiveTab('decision')}
                  onSaveToPauseList={() => setShowPausePrompt(true)}
                />
              )}

              {/* Tab 2: Decision Tree */}
              {activeTab === 'decision' && (
                <DecisionTree
                  product={product}
                  onFinishRecommendation={(_verdict) => {}}
                  onSwitchToLocalOptions={() => setActiveTab('local')}
                  onSwitchToPauseList={() => setActiveTab('pause')}
                  onBackToScorecard={() => setActiveTab('scorecard')}
                />
              )}

              {/* Tab 3: Local Options */}
              {activeTab === 'local' && <LocalOptions />}

              {/* Tab 4: 30-Day Pause List */}
              {activeTab === 'pause' && (
                <PauseList onBackToScorecard={() => setActiveTab('scorecard')} />
              )}

              {/* Tab 5: Settings */}
              {activeTab === 'settings' && <SettingsModal onClose={() => setActiveTab('scorecard')} />}
            </>
          )}
        </div>

        {/* Pause Modal Overlay */}
        {showPausePrompt && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col justify-end p-4 z-50 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Clock className="w-4 h-4 text-white" strokeWidth={1.5} />
                  <span>30-Day Impulse Shield</span>
                </div>
                <button
                  onClick={() => setShowPausePrompt(false)}
                  className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Step away for 30 days. We'll track how much money and carbon you divert if you choose not to buy later.
              </p>

              <div>
                <label className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">
                  Why do you want this right now? (Optional note)
                </label>
                <textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  placeholder="e.g. Looks convenient, but maybe I don't need it urgently..."
                  className="w-full bg-black border border-neutral-800 rounded-xl p-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white resize-none h-16"
                />
              </div>

              <button
                onClick={handleSaveToPause}
                disabled={saveSuccess}
                className="w-full py-2 px-3 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {saveSuccess ? (
                  <span>Item Shielded!</span>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-black text-black" strokeWidth={1.5} />
                    <span>Pause Impulse for 30 Days</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
