import React, { useEffect, useState } from 'react';
import { PauseList } from '../../components/PauseList';
import { LocalOptions } from '../../components/LocalOptions';
import { SettingsModal } from '../../components/SettingsModal';
import { getImpactStats, getSettings } from '../../lib/storage';
import type { ImpactStats, ProductInfo } from '../../lib/types';
import { 
  Pause, 
  Sparkles, 
  Clock, 
  MapPin, 
  Settings, 
  CheckCircle, 
  TrendingUp,
  Leaf,
  Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'status' | 'pause' | 'local' | 'settings'>('status');
  const [isProductPage, setIsProductPage] = useState<boolean>(false);
  const [productData, setProductData] = useState<ProductInfo | null>(null);
  const [stats, setStats] = useState<ImpactStats>({
    totalItemsPaused: 0,
    totalMoneySaved: 0,
    totalCo2SavedKg: 0,
    reconsideredCount: 0,
  });

  useEffect(() => {
    getImpactStats().then(setStats);
    getSettings();

    // Check active browser tab
    if (typeof browser !== 'undefined' && browser.tabs?.query) {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const current = tabs[0];
        if (current?.id && current?.url) {
          browser.tabs.sendMessage(current.id, { type: 'CHECK_STATUS' }).then((res: any) => {
            if (res) {
              setIsProductPage(res.isProductPage);
              setProductData(res.product);
            }
          }).catch(() => {});
        }
      }).catch(() => {});
    }
  }, []);

  const handleToggleWidgetOnPage = () => {
    if (typeof browser !== 'undefined' && browser.tabs?.query) {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const current = tabs[0];
        if (current?.id) {
          browser.tabs.sendMessage(current.id, { type: 'TOGGLE_HOLDON' }).catch(() => {});
        }
      });
    }
  };

  return (
    <div className="w-[380px] bg-[#17151F] text-[#F4F0FA] min-h-[520px] flex flex-col font-sans select-none antialiased">
      {/* Top Header */}
      <div className="p-3.5 bg-[#17151F] border-b border-[#3A344E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#B9A1F5] flex items-center justify-center text-[#17151F] shadow-sm">
            <Pause className="w-2.5 h-2.5 fill-[#17151F] text-[#17151F]" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold tracking-tight text-[#F4F0FA]">HoldOn</span>
        </div>

        <span className="text-[10px] font-medium text-[#F0C987] px-2 py-0.5 rounded-full bg-[#292438] border border-[#3A344E]">
          Delhi NCR
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center px-2 py-1.5 bg-[#292438] border-b border-[#3A344E] text-xs">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'status' ? 'bg-[#17151F] text-[#B9A1F5] font-semibold shadow-sm' : 'text-[#A69FB8] hover:text-[#F4F0FA]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('pause')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'pause' ? 'bg-[#17151F] text-[#B9A1F5] font-semibold shadow-sm' : 'text-[#A69FB8] hover:text-[#F4F0FA]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Pause List</span>
        </button>

        <button
          onClick={() => setActiveTab('local')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'local' ? 'bg-[#17151F] text-[#B9A1F5] font-semibold shadow-sm' : 'text-[#A69FB8] hover:text-[#F4F0FA]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Local Hubs</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-[#17151F] text-[#B9A1F5] font-semibold shadow-sm' : 'text-[#A69FB8] hover:text-[#F4F0FA]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Settings</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-3.5 flex-1 overflow-y-auto">
        {activeTab === 'status' && (
          <div className="space-y-3">
            {/* Active Page Detection Status */}
            <div className="p-3 rounded-2xl bg-[#292438] border border-[#3A344E] space-y-2 shadow-[0_4px_16px_rgba(23,21,31,0.2)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#A69FB8] tracking-wider">
                  Active Page
                </span>
                {isProductPage ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#B9A1F5]/15 text-[#B9A1F5] border border-[#B9A1F5]/30">
                    <CheckCircle className="w-2.5 h-2.5" strokeWidth={1.5} /> Product Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#17151F] text-[#A69FB8] border border-[#3A344E]">
                    Browsing Web
                  </span>
                )}
              </div>

              {isProductPage && productData ? (
                <div className="space-y-2 pt-0.5">
                  <div className="text-xs font-semibold text-[#F4F0FA] line-clamp-2 leading-snug">
                    {productData.title}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-[#F0C987]">
                      {productData.currency} {productData.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={handleToggleWidgetOnPage}
                      className="px-3 py-1.5 bg-[#B9A1F5] hover:bg-[#cbb9f8] text-[#17151F] rounded-xl text-xs font-semibold transition-all shadow-[0_4px_16px_rgba(185,161,245,0.25)] cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#17151F]" strokeWidth={1.5} /> Toggle Scorecard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-0.5">
                  <p className="text-[11px] text-[#C8C2D8] leading-relaxed">
                    Navigate to any product page on <strong>Amazon.in</strong> or <strong>Flipkart</strong> to see the HoldOn companion card appear automatically.
                  </p>
                </div>
              )}
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-[#292438] border border-[#3A344E] shadow-[0_4px_16px_rgba(23,21,31,0.2)]">
                <div className="text-[10px] text-[#A69FB8] uppercase font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#F0C987]" strokeWidth={1.5} /> Total Saved
                </div>
                <div className="text-base font-bold text-[#F0C987] mt-1">
                  ₹{stats.totalMoneySaved.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#A69FB8] mt-0.5">
                  {stats.reconsideredCount} resisted purchases
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#292438] border border-[#3A344E] shadow-[0_4px_16px_rgba(23,21,31,0.2)]">
                <div className="text-[10px] text-[#A69FB8] uppercase font-medium flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-[#B9A1F5]" strokeWidth={1.5} /> Diverted CO₂
                </div>
                <div className="text-base font-bold text-[#B9A1F5] mt-1">
                  {stats.totalCo2SavedKg} kg
                </div>
                <div className="text-[10px] text-[#A69FB8] mt-0.5">
                  Embodied carbon saved
                </div>
              </div>
            </div>

            {/* Mindful Companion Reflection */}
            <div className="p-3 rounded-2xl bg-[#B9A1F5]/10 border border-[#B9A1F5]/25 text-xs text-[#F4F0FA] space-y-1">
              <div className="font-semibold text-[#B9A1F5] flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-[#B9A1F5]" strokeWidth={1.5} /> Intelligent Companion
              </div>
              <p className="text-[11px] text-[#C8C2D8] leading-relaxed">
                "True value comes from ownership longevity, not checkout impulse." Let clarity and repairability guide your purchases.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'pause' && <PauseList />}

        {activeTab === 'local' && <LocalOptions />}

        {activeTab === 'settings' && <SettingsModal />}
      </div>
    </div>
  );
}
