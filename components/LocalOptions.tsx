import React, { useState } from 'react';
import { getLocalPlaces } from '../lib/localData';
import type { LocalPlace, PlaceType } from '../lib/types';
import { 
  MapPin, 
  Wrench, 
  RotateCcw, 
  Share2, 
  Recycle, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Star
} from 'lucide-react';

interface LocalOptionsProps {
  currentCity?: string;
  onCityChange?: (city: string) => void;
}

export const LocalOptions: React.FC<LocalOptionsProps> = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const places = getLocalPlaces('Delhi NCR', filterType);

  const getTypeBadge = (type: PlaceType) => {
    switch (type) {
      case 'repair':
        return {
          icon: <Wrench className="w-3 h-3 text-[#3E5234]" strokeWidth={1.5} />,
          label: 'Repair Hub',
          bg: 'bg-[#A7B79B]/15 text-[#3E5234] border-[#A7B79B]/30',
        };
      case 'second-hand':
        return {
          icon: <RotateCcw className="w-3 h-3 text-[#825520]" strokeWidth={1.5} />,
          label: 'Pre-owned / Refurb',
          bg: 'bg-[#D9A66B]/15 text-[#825520] border-[#D9A66B]/30',
        };
      case 'borrow':
        return {
          icon: <Share2 className="w-3 h-3 text-[#252923]" strokeWidth={1.5} />,
          label: 'Tool Library / Rental',
          bg: 'bg-[#E9E7E0] text-[#252923] border-[#D5D2C7]',
        };
      case 'recycle':
        return {
          icon: <Recycle className="w-3 h-3 text-[#8A3B30]" strokeWidth={1.5} />,
          label: 'E-Waste Recycler',
          bg: 'bg-[#B96C60]/15 text-[#8A3B30] border-[#B96C60]/30',
        };
    }
  };

  return (
    <div className="space-y-3 text-[#252923] font-sans antialiased">
      {/* City Banner */}
      <div className="p-3 bg-white/80 rounded-2xl border border-[#E9E7E0] flex items-center justify-between gap-2 shadow-[0_2px_8px_rgba(37,41,35,0.03)]">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-[#A7B79B] flex-shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-[#5E645A]">Circular Ecosystem</div>
            <div className="text-xs font-bold text-[#252923] flex items-center gap-1.5 mt-0.5">
              <span>Delhi NCR</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-[#A7B79B]/20 text-[#3E5234]">
                8 Verified Hubs
              </span>
            </div>
          </div>
        </div>

        <span className="text-[10px] text-[#5E645A] px-2 py-0.5 rounded-full bg-[#F7F6F0] border border-[#E9E7E0]">
          &lt; 10 km radius
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'All Places' },
          { id: 'repair', label: 'Repair' },
          { id: 'second-hand', label: 'Second-Hand' },
          { id: 'borrow', label: 'Rent / Borrow' },
          { id: 'recycle', label: 'E-Waste' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterType === chip.id
                ? 'bg-[#252923] text-[#F7F6F0]'
                : 'bg-white/80 text-[#5E645A] hover:text-[#252923] border border-[#E9E7E0]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Places List */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-0.5">
        {places.map((place) => {
          const badge = getTypeBadge(place.type);
          return (
            <div
              key={place.id}
              className="p-3 rounded-2xl bg-white/90 border border-[#E9E7E0] hover:border-[#D5D2C7] transition-all space-y-2 shadow-[0_2px_6px_rgba(37,41,35,0.03)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-semibold text-[#252923]">{place.name}</h4>
                    {place.verified && (
                      <span title="Verified Circular Hub">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5234]" strokeWidth={1.5} />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#5E645A] mt-0.5">{place.category}</div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-[#3E5234]">
                    {place.distanceKm} km
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] text-[#825520] font-medium justify-end">
                    <Star className="w-2.5 h-2.5 fill-[#D9A66B] text-[#D9A66B]" strokeWidth={1.5} />
                    <span>{place.rating}</span>
                  </div>
                </div>
              </div>

              {/* Tag and Hours */}
              <div className="flex items-center justify-between text-[10px] text-[#5E645A] pt-1 border-t border-[#E9E7E0]">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-medium ${badge.bg}`}>
                  {badge.icon} {badge.label}
                </span>

                {place.timing && (
                  <span className="flex items-center gap-1 text-[#5E645A]">
                    <Clock className="w-2.5 h-2.5" strokeWidth={1.5} /> {place.timing}
                  </span>
                )}
              </div>

              {/* Address snippet & Directions button */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-[11px] text-[#5E645A] truncate max-w-[210px]" title={place.address}>
                  {place.address}
                </span>

                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F7F6F0] hover:bg-[#E9E7E0] text-[#252923] text-[11px] font-medium transition-colors flex-shrink-0 border border-[#E9E7E0]"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3 text-[#5E645A]" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          );
        })}

        {places.length === 0 && (
          <div className="text-center py-6 text-[#5E645A] space-y-1">
            <p className="text-xs">No hubs found for this category in Delhi NCR.</p>
          </div>
        )}
      </div>

      {/* Sustainable Circular Tip Banner */}
      <div className="p-2.5 rounded-xl bg-[#A7B79B]/15 border border-[#A7B79B]/30 text-[11px] text-[#3E5234] flex items-start gap-1.5">
        <span className="font-bold">Tip:</span>
        <span className="text-[#3E5234]">A 20-minute repair at Nehru Place or Gaffar Market keeps dangerous heavy metals out of landfills.</span>
      </div>
    </div>
  );
};
