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
  Layers,
  ArrowUpRight
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
    <div className="w-[380px] bg-[#F7F6F0] text-[#252923] min-h-[520px] flex flex-col font-sans select-none antialiased">
      {/* Top Header */}
      <div className="p-3.5 bg-[#F7F6F0] border-b border-[#E9E7E0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#A7B79B] flex items-center justify-center text-[#252923] shadow-xs">
            <Pause className="w-2.5 h-2.5 fill-[#252923] text-[#252923]" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-[#252923]">HoldOn</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-[#A7B79B]/20 text-[#3E5234]">
                Circular Lens
              </span>
            </div>
            <div className="text-[10px] text-[#5E645A]">Think Before You Click Buy</div>
          </div>
        </div>

        <span className="text-[10px] font-medium text-[#5E645A] px-2 py-0.5 rounded-full bg-white border border-[#E9E7E0]">
          Delhi NCR
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center px-2 py-1.5 bg-[#F0EEE7] border-b border-[#E9E7E0] text-xs">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'status' ? 'bg-white text-[#252923] font-semibold shadow-xs' : 'text-[#5E645A] hover:text-[#252923]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('pause')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'pause' ? 'bg-white text-[#252923] font-semibold shadow-xs' : 'text-[#5E645A] hover:text-[#252923]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Pause List</span>
        </button>

        <button
          onClick={() => setActiveTab('local')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'local' ? 'bg-white text-[#252923] font-semibold shadow-xs' : 'text-[#5E645A] hover:text-[#252923]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Local Hubs</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1 rounded-xl flex items-center justify-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-white text-[#252923] font-semibold shadow-xs' : 'text-[#5E645A] hover:text-[#252923]'
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
            <div className="p-3 rounded-2xl bg-white border border-[#E9E7E0] space-y-2 shadow-[0_2px_8px_rgba(37,41,35,0.03)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#5E645A] tracking-wider">
                  Active Page
                </span>
                {isProductPage ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#A7B79B]/20 text-[#3E5234]">
                    <CheckCircle className="w-2.5 h-2.5" strokeWidth={1.5} /> Product Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F7F6F0] text-[#5E645A] border border-[#E9E7E0]">
                    Browsing Web
                  </span>
                )}
              </div>

              {isProductPage && productData ? (
                <div className="space-y-2 pt-0.5">
                  <div className="text-xs font-semibold text-[#252923] line-clamp-2 leading-snug">
                    {productData.title}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-[#252923]">
                      {productData.currency} {productData.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={handleToggleWidgetOnPage}
                      className="px-3 py-1.5 bg-[#252923] hover:bg-[#343a31] text-[#F7F6F0] rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#A7B79B]" strokeWidth={1.5} /> Toggle Scorecard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-0.5">
                  <p className="text-[11px] text-[#5E645A] leading-relaxed">
                    Navigate to any product page on <strong>Amazon.in</strong> or <strong>Flipkart</strong> to see the True Cost Scorecard automatically appear.
                  </p>
                </div>
              )}
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-white border border-[#E9E7E0] shadow-[0_2px_8px_rgba(37,41,35,0.03)]">
                <div className="text-[10px] text-[#5E645A] uppercase font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} /> Total Saved
                </div>
                <div className="text-base font-bold text-[#252923] mt-1">
                  ₹{stats.totalMoneySaved.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-[#5E645A] mt-0.5">
                  {stats.reconsideredCount} resisted purchases
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#E9E7E0] shadow-[0_2px_8px_rgba(37,41,35,0.03)]">
                <div className="text-[10px] text-[#5E645A] uppercase font-medium flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} /> Diverted CO₂
                </div>
                <div className="text-base font-bold text-[#3E5234] mt-1">
                  {stats.totalCo2SavedKg} kg
                </div>
                <div className="text-[10px] text-[#5E645A] mt-0.5">
                  Embodied carbon saved
                </div>
              </div>
            </div>

            {/* Circular Reflection Quote */}
            <div className="p-3 rounded-2xl bg-[#A7B79B]/15 border border-[#A7B79B]/30 text-xs text-[#252923] space-y-1">
              <div className="font-semibold text-[#3E5234] flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} /> Mindful Practice
              </div>
              <p className="text-[11px] text-[#5E645A] leading-relaxed">
                "The most sustainable product is the one that already exists." Pause before buying, repair before replacing, and borrow before owning.
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
