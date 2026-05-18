'use client';
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Flame, Info, Volume2, Wind } from 'lucide-react';

interface FlameState {
  gasFlow: number; // 0-10 PSI
  oxygenFlow: number; // 0-15 PSI
}

interface FlameCharacteristics {
  type: 'reducing' | 'neutral' | 'oxidizing';
  color: string;
  shape: string;
  intensity: number; // 0-100
  temperature: string;
  description: string;
  hexColor: string;
  outerHexColor: string;
  soundIntensity: number; // 0-100
}

export function FlameEmulator() {
  const [gasFlow, setGasFlow] = useState(5);
  const [oxygenFlow, setOxygenFlow] = useState(10);
  const [isLit, setIsLit] = useState(false);

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

    // Safety check: minimum 2 PSI oxygen per 1 PSI gas
    const safeOxygenRequired = Math.max(2, gasFlow * 2);
    const effectiveOxygen = Math.min(oxygenFlow, 15);
    const effectiveGas = Math.min(gasFlow, 10);

    // Calculate oxygen/fuel ratio
    const ratio = effectiveOxygen / Math.max(effectiveGas, 0.1);

    // Determine flame type and characteristics
    let flameType: 'reducing' | 'neutral' | 'oxidizing';
    let hexColor: string;
    let outerHexColor: string;
    let temperature: string;
    let shape: string;
    let intensity: number;
    let soundIntensity: number;

    if (ratio < 1.5) {
      // Reducing flame (excess fuel)
      flameType = 'reducing';
      hexColor = '#FF4500'; // Orange-red
      outerHexColor = '#FFD700'; // Golden yellow outer envelope
      temperature = '1,100–1,200°C';
      shape = 'Bushy, soft, feathery';
      intensity = 40 + (effectiveGas * 3);
      soundIntensity = 20;
    } else if (ratio < 2.5) {
      // Neutral flame (balanced)
      flameType = 'neutral';
      hexColor = '#4169E1'; // Royal blue
      outerHexColor = '#87CEEB'; // Sky blue outer envelope
      temperature = '1,300–1,400°C';
      shape = 'Smooth cone, pointed tip';
      intensity = 70 + (effectiveGas * 2);
      soundIntensity = 50;
    } else {
      // Oxidizing flame (excess oxygen)
      flameType = 'oxidizing';
      hexColor = '#0047AB'; // Darker blue
      outerHexColor = '#00D9FF'; // Bright cyan outer envelope
      temperature = '1,400–1,500°C';
      shape = 'Jagged, sharp, pointed';
      intensity = 85 + (effectiveOxygen * 1.5);
      soundIntensity = 80;
    }

    // Adjust intensity based on total flow
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

  // Circular slider component
  const CircularSlider = ({
    value,
    onChange,
    min = 0,
    max = 10,
    label,
    unit,
    icon: Icon
  }: {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    label: string;
    unit: string;
    icon: React.ElementType;
  }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const rotation = (percentage / 100) * 270 - 135; // -135 to 135 degrees

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          {/* Circular background */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
            {/* Track background */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
              opacity="0.3"
            />
            {/* Filled track */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={label === 'Gas Flow' ? '#F97316' : '#3B82F6'}
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 314.159} 314.159`}
              opacity="0.8"
              style={{ transition: 'stroke-dasharray 0.1s ease' }}
            />
          </svg>

          {/* Center display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className="w-6 h-6 text-stone-400 mb-1" />
            <p className="text-xl font-bold text-amber-400">{value.toFixed(1)}</p>
            <p className="text-xs text-stone-400">{unit}</p>
          </div>

          {/* Input slider (hidden but functional) */}
          <input
            type="range"
            min={min}
            max={max}
            step="0.1"
            value={value}
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{
              WebkitAppearance: 'slider-vertical',
              writingMode: 'vertical-rl' as any
            }}
          />
        </div>

        {/* Label and value display */}
        <div className="text-center">
          <p className="text-sm font-semibold text-stone-200">{label}</p>
          <p className="text-xs text-stone-400 mt-1">
            {value < min + (max - min) * 0.33 && 'Low'}
            {value >= min + (max - min) * 0.33 && value < min + (max - min) * 0.66 && 'Medium'}
            {value >= min + (max - min) * 0.66 && 'High'}
          </p>
        </div>
      </div>
    );
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
                  {/* Outer flame envelope (glow effect) */}
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
                    // Bushy, soft flame
                    <path
                      d={`M 80 200 Q 50 150 60 80 Q 70 40 100 20 Q 130 40 140 80 Q 150 150 120 200 Z`}
                      fill={flameCharacteristics.hexColor}
                      opacity="0.8"
                    />
                  )}

                  {flameCharacteristics.type === 'neutral' && (
                    // Smooth cone flame
                    <path
                      d={`M 85 200 L 60 100 L 70 50 L 100 10 L 130 50 L 140 100 L 115 200 Z`}
                      fill={flameCharacteristics.hexColor}
                      opacity="0.85"
                    />
                  )}

                  {flameCharacteristics.type === 'oxidizing' && (
                    // Jagged, sharp flame
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

          {/* Flame Information */}
          <div className="bg-stone-900/30 rounded-lg p-4 border border-stone-700/50 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-stone-400 font-semibold">Flame Type</p>
                <p className="text-sm md:text-base font-bold text-amber-400 mt-1">
                  {flameCharacteristics.color}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 font-semibold">Temperature</p>
                <p className="text-sm md:text-base font-bold text-red-400 mt-1">
                  {flameCharacteristics.temperature}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 font-semibold">Shape</p>
                <p className="text-xs md:text-sm text-stone-300 mt-1">
                  {flameCharacteristics.shape}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 font-semibold">Intensity</p>
                <p className="text-xs md:text-sm text-stone-300 mt-1">
                  {flameCharacteristics.intensity.toFixed(0)}%
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-stone-700/50">
              <p className="text-xs text-stone-400 font-semibold mb-2">Description</p>
              <p className="text-xs md:text-sm text-stone-300">
                {flameCharacteristics.description}
              </p>
            </div>
          </div>

          {/* Control Valves */}
          <div className="space-y-6">
            <p className="text-sm font-semibold text-stone-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              Valve Controls (Rotate Counterclockwise to Increase)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
              <CircularSlider
                value={gasFlow}
                onChange={handleGasChange}
                min={0}
                max={10}
                label="Gas Valve"
                unit="PSI"
                icon={Flame}
              />
              <CircularSlider
                value={oxygenFlow}
                onChange={handleOxygenChange}
                min={0}
                max={15}
                label="Oxygen Valve"
                unit="PSI"
                icon={Wind}
              />
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

          {/* Safety and Reference Information */}
          <div className="space-y-3">
            <p className="text-xs md:text-sm font-semibold text-stone-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              Flame Type Reference
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Reducing */}
              <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4">
                <p className="text-xs md:text-sm font-semibold text-orange-300 mb-2">Reducing Flame</p>
                <p className="text-xs text-orange-200 space-y-1">
                  <span className="block">• Gas: 6-8 PSI</span>
                  <span className="block">• Oxygen: 2-4 PSI</span>
                  <span className="block">• Ratio: &lt;1.5:1</span>
                  <span className="block">• Use: Metallic effects, silver migration</span>
                </p>
              </div>

              {/* Neutral */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <p className="text-xs md:text-sm font-semibold text-blue-300 mb-2">Neutral Flame</p>
                <p className="text-xs text-blue-200 space-y-1">
                  <span className="block">• Gas: 5 PSI</span>
                  <span className="block">• Oxygen: 10 PSI</span>
                  <span className="block">• Ratio: 1.5-2.5:1</span>
                  <span className="block">• Use: Standard glassblowing</span>
                </p>
              </div>

              {/* Oxidizing */}
              <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4">
                <p className="text-xs md:text-sm font-semibold text-cyan-300 mb-2">Oxidizing Flame</p>
                <p className="text-xs text-cyan-200 space-y-1">
                  <span className="block">• Gas: 2-3 PSI</span>
                  <span className="block">• Oxygen: 12-15 PSI</span>
                  <span className="block">• Ratio: &gt;2.5:1</span>
                  <span className="block">• Use: Fast heating, chrome safety</span>
                </p>
              </div>
            </div>

            {/* Safety Warning */}
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <p className="text-xs md:text-sm font-semibold text-red-300 mb-2">⚠️ Safety Rule</p>
              <p className="text-xs text-red-200">
                Minimum 2 PSI oxygen per 1 PSI propane. Below this ratio, the torch may backflash or pop. Always maintain safe gas ratios.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
