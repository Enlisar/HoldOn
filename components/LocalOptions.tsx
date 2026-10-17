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
          icon: <Wrench className="w-3 h-3 text-white" strokeWidth={1.5} />,
          label: 'Repair Hub',
          bg: 'bg-neutral-800 text-white border-neutral-700',
        };
      case 'second-hand':
        return {
          icon: <RotateCcw className="w-3 h-3 text-white" strokeWidth={1.5} />,
          label: 'Pre-owned / Refurb',
          bg: 'bg-neutral-800 text-white border-neutral-700',
        };
      case 'borrow':
        return {
          icon: <Share2 className="w-3 h-3 text-white" strokeWidth={1.5} />,
          label: 'Tool Library / Rental',
          bg: 'bg-neutral-800 text-white border-neutral-700',
        };
      case 'recycle':
        return {
          icon: <Recycle className="w-3 h-3 text-white" strokeWidth={1.5} />,
          label: 'E-Waste Recycler',
          bg: 'bg-neutral-800 text-white border-neutral-700',
        };
    }
  };

  return (
    <div className="space-y-3 text-white font-sans antialiased">
      {/* City Banner */}
      <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-white flex-shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Delhi NCR Circular Directory</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                Active City
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              Verified local repair, refurbish, tool libraries &amp; e-waste hubs
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700">
            {places.length} Hubs
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'all', label: 'All Services' },
          { id: 'repair', label: 'Repair' },
          { id: 'second-hand', label: 'Refurb/Thrift' },
          { id: 'borrow', label: 'Borrow/Rent' },
          { id: 'recycle', label: 'E-Waste' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`py-1 px-2.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterType === f.id
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Directory List */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-0.5">
        {places.map((place: LocalPlace) => {
          const badge = getTypeBadge(place.type);

          return (
            <div
              key={place.id}
              className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                    {place.verified && (
                      <span className="text-[10px] text-neutral-400 flex items-center gap-0.5 font-medium">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={1.5} /> Verified
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-white mt-1 leading-snug">
                    {place.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {place.category}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-0.5 justify-end text-xs font-semibold text-white">
                    <Star className="w-3 h-3 fill-white text-white" strokeWidth={1.5} />
                    <span>{place.rating}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    ~{place.distanceKm} km
                  </div>
                </div>
              </div>

              {/* Address and timing info */}
              <div className="space-y-0.5 text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
                <div className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-neutral-500 flex-shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{place.address}</span>
                </div>
                {place.timing && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-neutral-500 flex-shrink-0" strokeWidth={1.5} />
                    <span className="truncate">{place.timing}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                {place.phone ? (
                  <a
                    href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-neutral-400 hover:text-white font-medium"
                  >
                    {place.phone}
                  </a>
                ) : (
                  <span className="text-[10px] text-neutral-500">Walk-in hub</span>
                )}

                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors flex items-center gap-1 text-[10px]"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          );
        })}

        {places.length === 0 && (
          <div className="text-center py-8 text-neutral-500 text-xs">
            No local hubs found in this category for Delhi NCR.
          </div>
        )}
      </div>
    </div>
  );
};
