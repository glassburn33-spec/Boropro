import React, { useState } from 'react';
import { dragonTearsV2, type FlameAtmosphere } from '@/data/dragonTearsV2';
import { Info } from 'lucide-react';

interface DragonTearsBarProps {
  temperatureC: number;
  onInfoClick?: () => void;
}

export const DragonTearsBar: React.FC<DragonTearsBarProps> = ({ temperatureC, onInfoClick }) => {
  const [atmosphere, setAtmosphere] = useState<FlameAtmosphere>('neutral');
  const [hoveredTemp, setHoveredTemp] = useState<number | null>(null);

  const atmosphereData = dragonTearsV2.atmospheres[atmosphere];
  const minTemp = 20;
  const maxTemp = 1220;
  
  // Calculate indicator position (0-100%)
  const indicatorPosition = ((temperatureC - minTemp) / (maxTemp - minTemp)) * 100;

  // Find current phase based on temperature
  const currentPhase = atmosphereData.phases.reduce((closest, phase) => {
    if (Math.abs(phase.temperature - temperatureC) < Math.abs(closest.temperature - temperatureC)) {
      return phase;
    }
    return closest;
  }, atmosphereData.phases[0]);

  // Determine if in over-work zone (above 1000°C)
  const isOverwork = temperatureC > 1000;
  
  // Determine if in kiln-darkening zone (566-700°C annealing range)
  const isKilnDarkening = temperatureC >= 566 && temperatureC <= 700;

  // Create gradient with caution zones
  let gradientStyle = `linear-gradient(to right, ${atmosphereData.gradient.colors
    .map((color, idx) => `${color} ${atmosphereData.gradient.stops[idx]}%`)
    .join(', ')})`;

  // Add overlay for over-work zone
  if (isOverwork) {
    gradientStyle = `
      linear-gradient(to right, 
        ${atmosphereData.gradient.colors
          .map((color, idx) => `${color} ${atmosphereData.gradient.stops[idx]}%`)
          .join(', ')}),
      linear-gradient(to right, 
        rgba(0, 0, 0, 0) 0%, 
        rgba(0, 0, 0, 0) 80%, 
        rgba(100, 50, 50, 0.3) 100%)
    `;
  }

  return (
    <div className="bg-gray-900 rounded-lg p-3 md:p-6 border border-amber-900/30">
      {/* Header with name and info button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-amber-400 break-words">
            {dragonTearsV2.name} — {dragonTearsV2.manufacturer}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 mt-1 break-words">{dragonTearsV2.shortDescription}</p>
        </div>
        <button
          onClick={onInfoClick}
          className="p-2 hover:bg-amber-900/20 rounded-full transition-colors flex-shrink-0"
          title="View detailed information"
        >
          <Info size={20} className="text-amber-400" />
        </button>
      </div>

      {/* Atmosphere selector */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 font-semibold">Flame:</span>
        {(['neutral', 'slightly-reducing', 'reducing'] as const).map((atm) => (
          <button
            key={atm}
            onClick={() => setAtmosphere(atm)}
            className={`px-2 md:px-3 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
              atmosphere === atm
                ? 'bg-amber-500 text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {atm === 'neutral' && 'Neutral'}
            {atm === 'slightly-reducing' && 'Slightly Red'}
            {atm === 'reducing' && 'Reducing'}
          </button>
        ))}
      </div>

      {/* Color gradient bar */}
      <div className="relative mb-3">
        {/* Gradient background */}
        <div
          className="w-full h-10 md:h-12 rounded border border-gray-700"
          style={{ background: gradientStyle }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            const temp = minTemp + (percent / 100) * (maxTemp - minTemp);
            setHoveredTemp(Math.round(temp));
          }}
          onMouseLeave={() => setHoveredTemp(null)}
        />

        {/* Temperature indicator line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{
            left: `${indicatorPosition}%`,
            transform: 'translateX(-50%)',
            height: '100%'
          }}
        />

        {/* Over-work caution marker */}
        {isOverwork && (
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center gap-1">
            <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-1 rounded">
              ⚠ Over-work
            </span>
          </div>
        )}

        {/* Kiln-darkening indicator */}
        {isKilnDarkening && (
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
            <span className="text-xs font-semibold text-amber-300 bg-amber-900/40 px-2 py-1 rounded">
              Kiln darkening zone
            </span>
          </div>
        )}
      </div>

      {/* Temperature scale labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-4 gap-1">
        <span className="truncate">{minTemp}°C</span>
        <span className="truncate">620°C</span>
        <span className="truncate">{maxTemp}°C</span>
      </div>

      {/* Current state display */}
      <div className="bg-gray-800/50 rounded p-2 md:p-3 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Current Hue</p>
            <p className="text-xs md:text-sm font-semibold text-amber-300 mt-1 break-words">{currentPhase.baseHue}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Silver Effect</p>
            <p className="text-xs md:text-sm font-semibold text-amber-300 mt-1 break-words">{currentPhase.silverEffect}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Atmosphere</p>
            <p className="text-xs md:text-sm font-semibold text-amber-300 mt-1 break-words">{atmosphereData.displayName}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Notes</p>
            <p className="text-xs text-gray-300 mt-1 italic break-words">{currentPhase.notes}</p>
          </div>
        </div>
      </div>

      {/* Behavior note */}
      <p className="text-xs text-gray-400 mt-3 italic break-words">
        {atmosphereData.description}
      </p>
    </div>
  );
};
