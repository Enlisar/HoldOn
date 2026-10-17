import React, { useEffect, useState } from 'react';
import { 
  getPauseList, 
  updatePauseItemStatus, 
  removeFromPauseList, 
  getImpactStats 
} from '../lib/storage';
import type { ImpactStats, PauseItem } from '../lib/types';
import { 
  Clock, 
  Trash2, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  Leaf
} from 'lucide-react';

interface PauseListProps {
  onBackToScorecard?: () => void;
}

export const PauseList: React.FC<PauseListProps> = () => {
  const [items, setItems] = useState<PauseItem[]>([]);
  const [stats, setStats] = useState<ImpactStats>({
    totalItemsPaused: 0,
    totalMoneySaved: 0,
    totalCo2SavedKg: 0,
    reconsideredCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'reconsidered'>('active');

  const loadData = async () => {
    setLoading(true);
    const list = await getPauseList();
    const currentStats = await getImpactStats();
    setItems(list);
    setStats(currentStats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReconsider = async (id: string) => {
    const updated = await updatePauseItemStatus(id, 'reconsidered');
    setItems(updated);
    const updatedStats = await getImpactStats();
    setStats(updatedStats);
  };

  const handleRemove = async (id: string) => {
    const updated = await removeFromPauseList(id);
    setItems(updated);
    const updatedStats = await getImpactStats();
    setStats(updatedStats);
  };

  const calculateDaysLeft = (expiresAt: number) => {
    const diffMs = expiresAt - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const activeItems = items.filter((i) => i.status === 'active');
  const reconsideredItems = items.filter((i) => i.status === 'reconsidered');
  const displayedItems = activeTab === 'active' ? activeItems : reconsideredItems;

  return (
    <div className="space-y-3 text-[#252923] font-sans antialiased">
      {/* Mindfulness & Savings Summary Banner */}
      <div className="p-3.5 bg-white/90 rounded-2xl border border-[#E9E7E0] shadow-[0_2px_8px_rgba(37,41,35,0.04)] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3E5234]">
            <Sparkles className="w-3.5 h-3.5 text-[#A7B79B]" strokeWidth={1.5} />
            <span>30-Day Impulse Pause Shield</span>
          </div>
          <span className="text-[10px] text-[#5E645A]">
            Active Pauses: {activeItems.length}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E9E7E0]">
          <div className="p-2.5 rounded-xl bg-[#F7F6F0] border border-[#E9E7E0]">
            <div className="text-[10px] text-[#5E645A] uppercase font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} /> Total Money Saved
            </div>
            <div className="text-base font-bold text-[#252923] mt-0.5">
              ₹{stats.totalMoneySaved.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-[#5E645A]">from {stats.reconsideredCount} skipped impulses</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F7F6F0] border border-[#E9E7E0]">
            <div className="text-[10px] text-[#5E645A] uppercase font-medium flex items-center gap-1">
              <Leaf className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} /> Diverted Carbon
            </div>
            <div className="text-base font-bold text-[#3E5234] mt-0.5">
              {stats.totalCo2SavedKg} kg
            </div>
            <div className="text-[9px] text-[#5E645A]">embodied emissions saved</div>
          </div>
        </div>
      </div>

      {/* Segmented Filter */}
      <div className="flex p-1 rounded-xl bg-[#E9E7E0]/70 text-xs">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-white text-[#252923] shadow-sm font-semibold'
              : 'text-[#5E645A] hover:text-[#252923]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#D9A66B]" strokeWidth={1.5} />
          <span>In Reflection ({activeItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reconsidered')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'reconsidered'
              ? 'bg-white text-[#252923] shadow-sm font-semibold'
              : 'text-[#5E645A] hover:text-[#252923]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5234]" strokeWidth={1.5} />
          <span>Skipped &amp; Saved ({reconsideredItems.length})</span>
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-0.5">
        {displayedItems.map((item) => {
          const daysLeft = calculateDaysLeft(item.expiresAt);

          return (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-white/90 border border-[#E9E7E0] hover:border-[#D5D2C7] transition-all space-y-2 shadow-[0_2px_6px_rgba(37,41,35,0.03)]"
            >
              <div className="flex items-start gap-2.5">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-10 h-10 object-contain rounded-xl bg-[#F7F6F0] p-1 border border-[#E9E7E0] flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#F7F6F0] flex items-center justify-center text-[#5E645A] flex-shrink-0">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-[#252923] truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-[#252923]">
                      {item.currency} {item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#5E645A] truncate">
                      {item.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-[#8A9084] hover:text-[#B96C60] p-1 transition-colors cursor-pointer"
                  title="Remove from list"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Reflection Note */}
              {item.reflectionNote && (
                <div className="p-2 rounded-xl bg-[#F7F6F0] text-[11px] text-[#5E645A] italic border-l-2 border-[#D9A66B]">
                  "{item.reflectionNote}"
                </div>
              )}

              {/* Status and Action Row */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E9E7E0] text-[11px]">
                {item.status === 'active' ? (
                  <>
                    <span className="text-[#825520] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D9A66B]" strokeWidth={1.5} />
                      {daysLeft > 0 ? `${daysLeft} days remaining` : 'Cool-off complete!'}
                    </span>

                    <button
                      onClick={() => handleReconsider(item.id)}
                      className="px-2.5 py-1 rounded-xl bg-[#A7B79B]/20 hover:bg-[#A7B79B]/30 text-[#3E5234] border border-[#A7B79B]/40 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} />
                      <span>I Skipped It! 🎉</span>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[#3E5234] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} /> Saved ₹{item.price.toLocaleString('en-IN')}!
                    </span>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5E645A] hover:text-[#252923] flex items-center gap-1"
                    >
                      <span>Original Link</span>
                      <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {displayedItems.length === 0 && !loading && (
          <div className="text-center py-8 text-[#5E645A] space-y-1.5">
            <Clock className="w-7 h-7 mx-auto text-[#B4B9AE]" strokeWidth={1.5} />
            <div className="text-xs font-semibold text-[#252923]">
              {activeTab === 'active' ? 'No items paused right now' : 'No reconsidered items yet'}
            </div>
            <p className="text-[11px] text-[#5E645A] max-w-[240px] mx-auto leading-relaxed">
              When browsing, use the 30-Day Pause shield to step away from flash deals and let impulse desires settle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
