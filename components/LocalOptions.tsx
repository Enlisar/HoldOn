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
          icon: <Wrench className="w-3 h-3 text-[#B9A1F5]" strokeWidth={1.5} />,
          label: 'Repair Hub',
          bg: 'bg-[#B9A1F5]/15 text-[#B9A1F5] border-[#B9A1F5]/30',
        };
      case 'second-hand':
        return {
          icon: <RotateCcw className="w-3 h-3 text-[#F0C987]" strokeWidth={1.5} />,
          label: 'Pre-owned / Refurb',
          bg: 'bg-[#F0C987]/15 text-[#F0C987] border-[#F0C987]/30',
        };
      case 'borrow':
        return {
          icon: <Share2 className="w-3 h-3 text-[#F4F0FA]" strokeWidth={1.5} />,
          label: 'Tool Library / Rental',
          bg: 'bg-[#3A344E] text-[#F4F0FA] border-[#4D4565]',
        };
      case 'recycle':
        return {
          icon: <Recycle className="w-3 h-3 text-[#F08787]" strokeWidth={1.5} />,
          label: 'E-Waste Recycler',
          bg: 'bg-[#F08787]/15 text-[#F08787] border-[#F08787]/30',
        };
    }
  };

  return (
    <div className="space-y-3 text-[#F4F0FA] font-sans antialiased">
      {/* City Banner */}
      <div className="p-3 bg-[#292438] rounded-2xl border border-[#3A344E] flex items-center justify-between gap-2 shadow-[0_4px_16px_rgba(23,21,31,0.2)]">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-[#B9A1F5] flex-shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-[#A69FB8]">Local Circular Network</div>
            <div className="text-xs font-bold text-[#F4F0FA] flex items-center gap-1.5 mt-0.5">
              <span>Delhi NCR</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-[#B9A1F5]/20 text-[#B9A1F5]">
                8 Verified Hubs
              </span>
            </div>
          </div>
        </div>

        <span className="text-[10px] text-[#A69FB8] px-2 py-0.5 rounded-full bg-[#17151F] border border-[#3A344E]">
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
                ? 'bg-[#B9A1F5] text-[#17151F] font-semibold'
                : 'bg-[#292438] text-[#C8C2D8] hover:text-[#F4F0FA] border border-[#3A344E]'
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
              className="p-3 rounded-2xl bg-[#292438] border border-[#3A344E] hover:border-[#B9A1F5]/50 transition-all space-y-2 shadow-[0_4px_16px_rgba(23,21,31,0.2)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-semibold text-[#F4F0FA]">{place.name}</h4>
                    {place.verified && (
                      <span title="Verified Hub">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B9A1F5]" strokeWidth={1.5} />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#A69FB8] mt-0.5">{place.category}</div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-[#B9A1F5]">
                    {place.distanceKm} km
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] text-[#F0C987] font-medium justify-end">
                    <Star className="w-2.5 h-2.5 fill-[#F0C987] text-[#F0C987]" strokeWidth={1.5} />
                    <span>{place.rating}</span>
                  </div>
                </div>
              </div>

              {/* Tag and Hours */}
              <div className="flex items-center justify-between text-[10px] text-[#A69FB8] pt-1 border-t border-[#3A344E]">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-medium ${badge.bg}`}>
                  {badge.icon} {badge.label}
                </span>

                {place.timing && (
                  <span className="flex items-center gap-1 text-[#A69FB8]">
                    <Clock className="w-2.5 h-2.5" strokeWidth={1.5} /> {place.timing}
                  </span>
                )}
              </div>

              {/* Address snippet & Directions button */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-[11px] text-[#A69FB8] truncate max-w-[210px]" title={place.address}>
                  {place.address}
                </span>

                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#17151F] hover:bg-[#342E47] text-[#F4F0FA] text-[11px] font-medium transition-colors flex-shrink-0 border border-[#3A344E]"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3 text-[#B9A1F5]" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          );
        })}

        {places.length === 0 && (
          <div className="text-center py-6 text-[#A69FB8] space-y-1">
            <p className="text-xs">No hubs found for this category in Delhi NCR.</p>
          </div>
        )}
      </div>

      {/* Tip Banner */}
      <div className="p-2.5 rounded-xl bg-[#B9A1F5]/10 border border-[#B9A1F5]/25 text-[11px] text-[#F4F0FA] flex items-start gap-1.5">
        <span className="font-bold text-[#B9A1F5]">Tip:</span>
        <span className="text-[#C8C2D8]">Repairing hardware locally in Nehru Place or Gaffar Market extends gadget lifespan and prevents e-waste.</span>
      </div>
    </div>
  );
};
