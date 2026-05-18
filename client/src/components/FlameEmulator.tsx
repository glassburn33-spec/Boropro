'use client';
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Flame, Info, Volume2, Wind } from 'lucide-react';

interface FlameCharacteristics {
  type: 'reducing' | 'neutral' | 'oxidizing';
  color: string;
  shape: string;
  intensity: number;
  temperature: string;
  description: string;
  hexColor: string;
  outerHexColor: string;
  soundIntensity: number;
}

export function FlameEmulator() {
  const [gasFlow, setGasFlow] = useState(5);
  const [oxygenFlow, setOxygenFlow] = useState(10);
  const [isLit, setIsLit] = useState(true);

  // Calculate flame characteristics based on gas/oxygen ratio
  const flameCharacteristics = useMemo((): FlameCharacteristics => {
    if (!isLit || (gasFlow < 2 && oxygenFlow < 2)) {
      return {
        type: 'reducing',
        color: 'Unlit',
        shape: 'No flame',
        intensity: 0,
        temperature: 'Room temperature',
        description: 'Torch is not lit or gas/oxygen insufficient',
        hexColor: '#000000',
        outerHexColor: '#1a1a1a',
        soundIntensity: 0
      };
    }

    const effectiveOxygen = Math.min(oxygenFlow, 15);
    const effectiveGas = Math.min(gasFlow, 10);
    const ratio = effectiveOxygen / Math.max(effectiveGas, 0.1);

    let flameType: 'reducing' | 'neutral' | 'oxidizing';
    let hexColor: string;
    let outerHexColor: string;
    let temperature: string;
    let shape: string;
    let intensity: number;
    let soundIntensity: number;

    if (ratio < 1.5) {
      flameType = 'reducing';
      hexColor = '#FF4500';
      outerHexColor = '#FFD700';
      temperature = '1,100–1,200°C';
      shape = 'Bushy, soft, feathery';
      intensity = 40 + (effectiveGas * 3);
      soundIntensity = 20;
    } else if (ratio < 2.5) {
      flameType = 'neutral';
      hexColor = '#4169E1';
      outerHexColor = '#87CEEB';
      temperature = '1,300–1,400°C';
      shape = 'Smooth cone, pointed tip';
      intensity = 70 + (effectiveGas * 2);
      soundIntensity = 50;
    } else {
      flameType = 'oxidizing';
      hexColor = '#0047AB';
      outerHexColor = '#00D9FF';
      temperature = '1,400–1,500°C';
      shape = 'Jagged, sharp, pointed';
      intensity = 85 + (effectiveOxygen * 1.5);
      soundIntensity = 80;
    }

    intensity = Math.min(100, intensity + (effectiveGas + effectiveOxygen) * 0.5);

    return {
      type: flameType,
      color: flameType.charAt(0).toUpperCase() + flameType.slice(1),
      shape,
      intensity: Math.min(100, intensity),
      temperature,
      description: getFlameDescription(flameType, effectiveGas, effectiveOxygen),
      hexColor,
      outerHexColor,
      soundIntensity
    };
  }, [gasFlow, oxygenFlow, isLit]);

  const getFlameDescription = (type: string, gas: number, oxygen: number): string => {
    if (type === 'reducing') {
      return `Excess fuel creates a soft, bushy flame. Good for metallic effects and reducing oxidation. Current ratio: ${(oxygen / gas).toFixed(1)}:1 (target: <1.5:1)`;
    } else if (type === 'neutral') {
      return `Balanced oxygen-fuel mixture creates the ideal working flame. Smooth, pointed, and controllable. Current ratio: ${(oxygen / gas).toFixed(1)}:1 (target: 1.5-2.5:1)`;
    } else {
      return `Excess oxygen creates an intense, hot flame. Ideal for fast heating and preventing chrome cracking. Current ratio: ${(oxygen / gas).toFixed(1)}:1 (target: >2.5:1)`;
    }
  };

  const handleGasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGasFlow(parseFloat(e.target.value));
  };

  const handleOxygenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOxygenFlow(parseFloat(e.target.value));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-amber-500 pl-4 md:pl-6">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">Flame Emulator</h2>
        <p className="text-stone-300 text-xs md:text-sm">Adjust gas and oxygen valves to explore neutral, reducing, and oxidizing flame characteristics</p>
      </div>

      {/* Main Emulator Card */}
      <Card className="bg-stone-800/50 border border-stone-700/50 p-4 md:p-8">
        <div className="space-y-8">
          {/* Flame Visualization */}
          <div className="flex justify-center">
            <div className="relative w-48 h-96 md:w-56 md:h-[28rem]">
              {/* Torch body */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-24 bg-gradient-to-b from-stone-600 to-stone-800 rounded-b-lg border border-stone-700 shadow-lg" />

              {/* Flame visualization */}
              {isLit && flameCharacteristics.intensity > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 400">
                  <defs>
                    <radialGradient id="flameGradient" cx="50%" cy="100%">
                      <stop offset="0%" stopColor={flameCharacteristics.outerHexColor} stopOpacity="0.6" />
                      <stop offset="100%" stopColor={flameCharacteristics.outerHexColor} stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Outer glow */}
                  <ellipse
                    cx="100"
                    cy="200"
                    rx={40 + (flameCharacteristics.intensity * 0.3)}
                    ry={80 + (flameCharacteristics.intensity * 0.5)}
                    fill="url(#flameGradient)"
                  />

                  {/* Main flame body */}
                  {flameCharacteristics.type === 'reducing' && (
                    <path
                      d={`M 80 200 Q 50 150 60 80 Q 70 40 100 20 Q 130 40 140 80 Q 150 150 120 200 Z`}
                      fill={flameCharacteristics.hexColor}
                      opacity="0.8"
                    />
                  )}

                  {flameCharacteristics.type === 'neutral' && (
                    <path
                      d={`M 85 200 L 60 100 L 70 50 L 100 10 L 130 50 L 140 100 L 115 200 Z`}
                      fill={flameCharacteristics.hexColor}
                      opacity="0.85"
                    />
                  )}

                  {flameCharacteristics.type === 'oxidizing' && (
                    <path
                      d={`M 85 200 L 65 140 L 55 100 L 50 60 L 60 30 L 100 5 L 140 30 L 150 60 L 145 100 L 135 140 L 115 200 Z`}
                      fill={flameCharacteristics.hexColor}
                      opacity="0.9"
                    />
                  )}

                  {/* Inner bright core */}
                  <ellipse
                    cx="100"
                    cy="150"
                    rx={15 + (flameCharacteristics.intensity * 0.1)}
                    ry={40 + (flameCharacteristics.intensity * 0.2)}
                    fill="#FFFFFF"
                    opacity={0.3 + (flameCharacteristics.intensity * 0.005)}
                  />
                </svg>
              )}

              {/* Unlit state */}
              {!isLit && (
                <div className="absolute inset-0 flex items-center justify-center text-stone-500">
                  <p className="text-sm">Torch unlit</p>
                </div>
              )}
            </div>
          </div>

          {/* Gas and Oxygen Controls */}
          <div className="space-y-6 w-full max-w-md mx-auto">
            {/* Gas Valve Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                  <Volume2 className="w-4 h-4 text-orange-500" />
                  Gas Valve
                </label>
                <span className="text-sm font-bold text-amber-400">{gasFlow.toFixed(1)} PSI</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={gasFlow}
                onChange={handleGasChange}
                className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <p className="text-xs text-stone-400">
                {gasFlow < 3.33 && 'Low flow'}
                {gasFlow >= 3.33 && gasFlow < 6.66 && 'Medium flow'}
                {gasFlow >= 6.66 && 'High flow'}
              </p>
            </div>

            {/* Oxygen Valve Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                  <Wind className="w-4 h-4 text-blue-500" />
                  Oxygen Valve
                </label>
                <span className="text-sm font-bold text-amber-400">{oxygenFlow.toFixed(1)} PSI</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={oxygenFlow}
                onChange={handleOxygenChange}
                className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-xs text-stone-400">
                {oxygenFlow < 5 && 'Low flow'}
                {oxygenFlow >= 5 && oxygenFlow < 10 && 'Medium flow'}
                {oxygenFlow >= 10 && 'High flow'}
              </p>
            </div>
          </div>

          {/* Light/Extinguish Button */}
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLit(prev => !prev);
              }}
              type="button"
              className={`px-8 py-3 rounded-lg font-semibold transition-colors text-sm md:text-base z-10 relative ${
                isLit
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isLit ? '🔴 Extinguish Torch' : '🔥 Light Torch'}
            </button>
          </div>

          {/* Flame Information */}
          <div className="space-y-4 bg-stone-900/50 rounded-lg p-4 border border-stone-700/50">
            <div className="flex items-start gap-3">
              <Flame className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-stone-200">
                  Flame Type: <span className="text-amber-400">{flameCharacteristics.color}</span>
                </p>
                <p className="text-xs text-stone-400">{flameCharacteristics.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-stone-400">Temperature</p>
                <p className="font-semibold text-stone-200">{flameCharacteristics.temperature}</p>
              </div>
              <div>
                <p className="text-stone-400">Shape</p>
                <p className="font-semibold text-stone-200">{flameCharacteristics.shape}</p>
              </div>
            </div>
          </div>

          {/* Safety Information */}
          <div className="space-y-3 bg-stone-900/50 rounded-lg p-4 border border-amber-700/30">
            <p className="text-xs md:text-sm font-semibold text-amber-400 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Safety & Reference
            </p>
            <ul className="text-xs text-stone-300 space-y-1">
              <li>• Minimum 2 PSI oxygen per 1 PSI gas for safe operation</li>
              <li>• Reducing flame: Good for silver colors and metallic effects</li>
              <li>• Neutral flame: Ideal for general glasswork and color development</li>
              <li>• Oxidizing flame: Best for chrome colors and preventing cracking</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
