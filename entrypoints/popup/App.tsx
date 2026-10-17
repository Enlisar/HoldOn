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
    <div className="w-[380px] bg-black text-white min-h-[520px] flex flex-col font-sans select-none antialiased border border-neutral-800">
      {/* Top Header */}
      <div className="p-3.5 bg-black border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
            <Pause className="w-2.5 h-2.5 fill-black text-black" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold tracking-tight text-white">HoldOn</span>
        </div>

        <span className="text-[10px] font-medium text-neutral-300 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800">
          Delhi NCR
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center px-2 py-1.5 bg-neutral-950 border-b border-neutral-800 text-xs">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'status' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('pause')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'pause' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Pause List</span>
        </button>

        <button
          onClick={() => setActiveTab('local')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'local' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Local Hubs</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
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
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                  Active Page
                </span>
                {isProductPage ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-black">
                    <CheckCircle className="w-2.5 h-2.5" strokeWidth={1.5} /> Product Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black text-neutral-400 border border-neutral-800">
                    Browsing Web
                  </span>
                )}
              </div>

              {isProductPage && productData ? (
                <div className="space-y-2 pt-0.5">
                  <div className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    {productData.title}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-white">
                      {productData.currency} {productData.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={handleToggleWidgetOnPage}
                      className="px-3 py-1.5 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-black" strokeWidth={1.5} /> Toggle Scorecard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-0.5">
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Navigate to any product page on <strong>Amazon.in</strong> or <strong>Flipkart</strong> to see the HoldOn companion card appear automatically.
                  </p>
                </div>
              )}
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-white" strokeWidth={1.5} /> Total Saved
                </div>
                <div className="text-base font-bold text-white mt-1">
                  ₹{stats.totalMoneySaved.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {stats.reconsideredCount} resisted purchases
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-medium flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-white" strokeWidth={1.5} /> Diverted CO₂
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {stats.totalCo2SavedKg} kg
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Embodied carbon saved
                </div>
              </div>
            </div>

            {/* Mindful Companion Reflection */}
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-white space-y-1">
              <div className="font-semibold text-white flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-white" strokeWidth={1.5} /> Intelligent Companion
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
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
