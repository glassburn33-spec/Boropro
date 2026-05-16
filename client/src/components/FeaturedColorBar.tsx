import React, { useState } from 'react';
import { Info } from 'lucide-react';
import type { FeaturedColor } from '@/data/glassAlchemyColors';

interface FeaturedColorBarProps {
  color: FeaturedColor;
  temperatureC: number;
}

export const FeaturedColorBar: React.FC<FeaturedColorBarProps> = ({
  color,
  temperatureC,
}) => {
  const [atmosphere, setAtmosphere] = useState<'neutral' | 'slightlyReducing' | 'reducing'>('neutral');
  const [showInfo, setShowInfo] = useState(false);

  const atmosphereData = color.atmosphereData[atmosphere];
  
  // Calculate position on gradient (0-100%)
  const minTemp = 20;
  const maxTemp = 1220;
  const indicatorPosition = ((temperatureC - minTemp) / (maxTemp - minTemp)) * 100;

  // Get current hue based on temperature
  const tempRange = maxTemp - minTemp;
  const tempProgress = (temperatureC - minTemp) / tempRange;
  const colorIndex = Math.min(
    Math.floor(tempProgress * atmosphereData.length),
    atmosphereData.length - 1
  );
  const currentColor = atmosphereData[colorIndex];

  // Create gradient string
  const gradientColors = atmosphereData.map((c, i) => c.rgb).join(', ');
  const gradientString = `linear-gradient(to right, ${gradientColors})`;

  // Determine if we're in kiln darkening or over-work zone
  const inKilnDarkeningZone = temperatureC < color.kiln_darkening_start;
  const inOverWorkZone = temperatureC > color.over_work_start;

  return (
    <div className="space-y-4 p-3 md:p-6 bg-slate-900 rounded-lg border border-amber-400/30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-amber-400 break-words">{color.name}</h3>
          <p className="text-xs md:text-sm text-slate-300 break-words">{color.manufacturer}</p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
          title="View detailed information"
        >
          <Info size={20} className="text-amber-400" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-slate-300 break-words">{color.description}</p>

      {/* Atmosphere Selector */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400">Flame:</span>
        {(['neutral', 'slightlyReducing', 'reducing'] as const).map((atm) => (
          <button
            key={atm}
            onClick={() => setAtmosphere(atm)}
            className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              atmosphere === atm
                ? 'bg-amber-400 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {atm === 'neutral' ? 'Neutral' : atm === 'slightlyReducing' ? 'Slightly Red' : 'Reducing'}
          </button>
        ))}
      </div>

      {/* Color Bar */}
      <div className="space-y-2">
        <div className="relative h-10 md:h-12 rounded-lg overflow-hidden border border-slate-700">
          <div
            style={{ background: gradientString }}
            className="w-full h-full"
          />
          
          {/* Temperature Indicator */}
          <div
            style={{ left: `${indicatorPosition}%` }}
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          />

          {/* Kiln Darkening Zone */}
          {inKilnDarkeningZone && (
            <div className="absolute top-0 bottom-0 left-0 w-1/6 bg-red-500/20 border-r border-red-500/50" />
          )}

          {/* Over-Work Zone */}
          {inOverWorkZone && (
            <div className="absolute top-0 bottom-0 right-0 w-1/6 bg-orange-500/20 border-l border-orange-500/50" />
          )}
        </div>

        {/* Temperature Scale */}
        <div className="flex justify-between text-xs text-slate-400 px-1 gap-1">
          <span className="truncate">{minTemp}°C</span>
          <span className="truncate">{Math.round((minTemp + maxTemp) / 2)}°C</span>
          <span className="truncate">{maxTemp}°C</span>
        </div>
      </div>

      {/* Current Color Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 p-2 md:p-4 bg-slate-800/50 rounded-lg">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Current Hue</p>
          <p className="text-xs md:text-sm font-semibold text-amber-400 break-words">{currentColor.hue}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Silver Effect</p>
          <p className="text-xs md:text-sm font-semibold text-amber-400 break-words">
            {color.silverEffect[atmosphere]}
          </p>
        </div>
      </div>

      {/* Caution Indicators */}
      <div className="flex flex-wrap gap-2">
        {inKilnDarkeningZone && (
          <div className="flex items-center gap-2 px-2 md:px-3 py-2 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-300">
            <span>⚠️ Kiln darkening</span>
          </div>
        )}
        {inOverWorkZone && (
          <div className="flex items-center gap-2 px-2 md:px-3 py-2 bg-orange-500/20 border border-orange-500/50 rounded text-xs text-orange-300">
            <span>⚠️ Over-work</span>
          </div>
        )}
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="p-2 md:p-4 bg-slate-800/50 rounded-lg space-y-3 border border-slate-700">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Working Range</p>
            <p className="text-sm text-slate-300">
              {color.workingRange.min}–{color.workingRange.max}°C
            </p>
          </div>
          {color.strikeTemp && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Striking Temperature</p>
              <p className="text-sm text-slate-300">{color.strikeTemp}°C</p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Kiln Tips</p>
            <ul className="space-y-1">
              {color.tips.map((tip, i) => (
                <li key={i} className="text-xs text-slate-300 flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
