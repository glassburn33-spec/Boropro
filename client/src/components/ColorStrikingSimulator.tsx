'use client';
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, Flame, Zap, Info } from 'lucide-react';

interface StrikingPhase {
  name: string;
  tempRange: string;
  crystalSize: string;
  colorProgression: string[];
  description: string;
}

interface ColorFamily {
  id: string;
  name: string;
  manufacturer: string;
  baseColor: string;
  strikeTemp: string;
  flamePreference: string;
  phases: StrikingPhase[];
  notes: string;
}

const colorFamilies: ColorFamily[] = [
  {
    id: 'amazon-night',
    name: 'Amazon Night #987',
    manufacturer: 'Glass Alchemy',
    baseColor: '#1a3a2a',
    strikeTemp: '1,075–1,125°F',
    flamePreference: 'Neutral (reduce at end for luster)',
    phases: [
      {
        name: 'Early Strike',
        tempRange: '1,075°F',
        crystalSize: 'Tiny',
        colorProgression: ['#FFD700', '#FFA500', '#FF8C00'],
        description: 'Smallest crystals form first; warm yellows and oranges appear'
      },
      {
        name: 'Mid Strike',
        tempRange: '1,090°F',
        crystalSize: 'Small-Medium',
        colorProgression: ['#FF6347', '#DC143C', '#8B0000'],
        description: 'Crystal growth continues; reds and deep reds develop'
      },
      {
        name: 'Deep Strike',
        tempRange: '1,100°F',
        crystalSize: 'Medium-Large',
        colorProgression: ['#9932CC', '#8A2BE2', '#4B0082'],
        description: 'Purples and violets emerge as crystals grow larger'
      },
      {
        name: 'Full Strike',
        tempRange: '1,110–1,125°F',
        crystalSize: 'Large',
        colorProgression: ['#0047AB', '#00008B', '#191970'],
        description: 'Maximum crystal size; deep blues and greens achieved'
      }
    ],
    notes: 'Industry-standard neutral flame test rod; pre-seeded nuclei allow reliable striking'
  },
  {
    id: 'triple-passion',
    name: 'Triple Passion #786',
    manufacturer: 'Glass Alchemy',
    baseColor: '#D4A574',
    strikeTemp: '1,075–1,100°F',
    flamePreference: 'Neutral to slightly oxidizing',
    phases: [
      {
        name: 'Yellow Strike',
        tempRange: '1,075°F',
        crystalSize: 'Tiny',
        colorProgression: ['#FFFF00', '#FFD700', '#FFA500'],
        description: 'Bright yellows appear first; easy to control'
      },
      {
        name: 'Amber Transition',
        tempRange: '1,085°F',
        crystalSize: 'Small',
        colorProgression: ['#FF8C00', '#FF6347', '#DC143C'],
        description: 'Warm amber tones develop with continued heating'
      },
      {
        name: 'Purple Strike',
        tempRange: '1,095°F',
        crystalSize: 'Medium',
        colorProgression: ['#9932CC', '#8A2BE2', '#6A0DAD'],
        description: 'Rich purples emerge; popular color in lampworking'
      },
      {
        name: 'Blue Overlay',
        tempRange: '1,100°F+',
        crystalSize: 'Large',
        colorProgression: ['#4169E1', '#0047AB', '#00008B'],
        description: 'Extended striking produces blue overlay effect'
      }
    ],
    notes: 'One of the most popular color-change colors; easy-striking for beginners'
  },
  {
    id: 'red-elvis',
    name: 'Red Elvis',
    manufacturer: 'Glass Alchemy',
    baseColor: '#8B4513',
    strikeTemp: '1,050–1,075°F (self-striking)',
    flamePreference: 'Neutral to oxidizing',
    phases: [
      {
        name: 'Self-Strike Start',
        tempRange: '1,050°F',
        crystalSize: 'Small',
        colorProgression: ['#FF4500', '#FF6347', '#DC143C'],
        description: 'Strikes automatically as glass cools; no extra work needed'
      },
      {
        name: 'Ruby Red',
        tempRange: '1,060°F',
        crystalSize: 'Medium',
        colorProgression: ['#DC143C', '#C41E3A', '#8B0000'],
        description: 'Deep ruby red develops; excellent for thin stringers'
      },
      {
        name: 'Dark Red',
        tempRange: '1,075°F+',
        crystalSize: 'Large',
        colorProgression: ['#8B0000', '#660000', '#330000'],
        description: 'Extended kiln striking deepens to near-black saturation'
      }
    ],
    notes: 'Self-striking copper color; kiln-strike preferred for even chromophore formation'
  },
  {
    id: 'chrome-opal',
    name: 'Chrome Opal',
    manufacturer: 'Glass Alchemy',
    baseColor: '#90EE90',
    strikeTemp: 'No striking (WYSIWYG)',
    flamePreference: 'STRICT Neutral (non-negotiable)',
    phases: [
      {
        name: 'Neutral Flame',
        tempRange: '1,050–1,100°F',
        crystalSize: 'N/A',
        colorProgression: ['#90EE90', '#7CFC00', '#32CD32'],
        description: 'Maintains true green in neutral flame'
      },
      {
        name: 'Reducing Flame (DANGER)',
        tempRange: '1,050°F+',
        crystalSize: 'N/A',
        colorProgression: ['#FF0000', '#DC143C', '#8B0000'],
        description: 'Chrome green TURNS RED in reducing atmosphere; can crack'
      },
      {
        name: 'Oxidizing Flame',
        tempRange: '1,050°F+',
        crystalSize: 'N/A',
        colorProgression: ['#DCDCDC', '#A9A9A9', '#696969'],
        description: 'Oxidizing flame causes muddy, washed-out appearance'
      }
    ],
    notes: 'CRITICAL: Must work in strict neutral flame only. Chrome colors are extremely flame-sensitive.'
  },
  {
    id: 'chameleon',
    name: 'Chameleon #5486 (Peacock)',
    manufacturer: 'Glass Alchemy',
    baseColor: '#008080',
    strikeTemp: '1,075°F (silver migration)',
    flamePreference: 'Neutral',
    phases: [
      {
        name: 'Base Peacock',
        tempRange: 'Room Temp',
        crystalSize: 'N/A',
        colorProgression: ['#008080', '#20B2AA', '#5F9EA0'],
        description: 'Dense opaque peacock blue base; pre-seeded nuclei'
      },
      {
        name: 'Silver Migration',
        tempRange: '1,075°F+',
        crystalSize: 'Variable',
        colorProgression: ['#FFD700', '#FFA500', '#FF8C00'],
        description: 'Silver migrates to surface during working; creates bursts and hazes'
      },
      {
        name: 'Layered Effects',
        tempRange: '1,100°F+',
        crystalSize: 'Medium-Large',
        colorProgression: ['#9932CC', '#4169E1', '#00CED1'],
        description: 'Multiple heat cycles build on previous color history'
      }
    ],
    notes: 'Pre-seeded nuclei mean color does not fully unstrike; each heat cycle builds on previous work'
  }
];

export function ColorStrikingSimulator() {
  const [selectedColorId, setSelectedColorId] = useState('amazon-night');
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [flameAtmosphere, setFlameAtmosphere] = useState<'neutral' | 'oxidizing' | 'reducing'>('neutral');
  const [showCrystalGrowth, setShowCrystalGrowth] = useState(true);
  const [cycleCount, setCycleCount] = useState(1);

  const selectedColor = colorFamilies.find(c => c.id === selectedColorId)!;
  const selectedPhase = selectedColor.phases[selectedPhaseIndex];

  // Calculate visual representation of crystal growth
  const crystalGrowthPercentage = ((selectedPhaseIndex + 1) / selectedColor.phases.length) * 100;

  // Determine color output based on flame atmosphere
  const getColorOutput = () => {
    if (selectedColor.id === 'chrome-opal') {
      if (flameAtmosphere === 'reducing') return '#FF0000';
      if (flameAtmosphere === 'oxidizing') return '#A9A9A9';
      return selectedPhase.colorProgression[1];
    }
    if (flameAtmosphere === 'reducing' && selectedPhaseIndex === selectedColor.phases.length - 1) {
      return '#FFD700'; // Metallic luster effect
    }
    return selectedPhase.colorProgression[Math.min(cycleCount - 1, selectedPhase.colorProgression.length - 1)];
  };

  const flameColor = {
    neutral: '#FFB347',
    oxidizing: '#87CEEB',
    reducing: '#FF6347'
  }[flameAtmosphere];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-amber-500 pl-4 md:pl-6">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-2">Color Striking Simulator</h2>
        <p className="text-stone-300 text-xs md:text-sm">Explore crystal growth, flame atmosphere effects, and striking progression for sensitive colors</p>
      </div>

      {/* Main Simulator Card */}
      <Card className="bg-stone-800/50 border border-stone-700/50 p-4 md:p-8">
        <div className="space-y-6">
          {/* Color Family Selector */}
          <div className="space-y-3">
            <label className="text-xs md:text-sm font-semibold text-stone-200">Select Color Family</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {colorFamilies.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    setSelectedColorId(color.id);
                    setSelectedPhaseIndex(0);
                    setCycleCount(1);
                  }}
                  className={`p-3 rounded-lg border transition-colors text-left text-xs md:text-sm ${
                    selectedColorId === color.id
                      ? 'bg-amber-700/30 border-amber-500 text-amber-300'
                      : 'bg-stone-900/30 border-stone-700/50 text-stone-300 hover:bg-stone-800/30'
                  }`}
                >
                  <p className="font-semibold">{color.name}</p>
                  <p className="text-xs text-stone-400">{color.manufacturer}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Preview and Strike Cycle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Color Preview */}
            <div className="space-y-4">
              <div className="border border-stone-700/50 rounded-lg overflow-hidden bg-stone-900/30 p-6">
                <div className="space-y-4">
                  {/* Base Color */}
                  <div>
                    <p className="text-xs text-stone-400 mb-2">Base Color (Rod)</p>
                    <div
                      className="w-full h-16 rounded-lg border border-stone-600 shadow-lg"
                      style={{ backgroundColor: selectedColor.baseColor }}
                    />
                  </div>

                  {/* Current Strike Color */}
                  <div>
                    <p className="text-xs text-stone-400 mb-2">Current Strike Color</p>
                    <div
                      className="w-full h-24 rounded-lg border-2 border-amber-500 shadow-lg transition-colors duration-300"
                      style={{ backgroundColor: getColorOutput() }}
                    />
                  </div>

                  {/* Crystal Growth Visualization */}
                  {showCrystalGrowth && (
                    <div>
                      <p className="text-xs text-stone-400 mb-2">Crystal Growth Progress</p>
                      <div className="bg-stone-900/50 rounded-lg p-3 border border-stone-700/50">
                        <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 via-red-500 to-blue-500 h-full transition-all duration-500"
                            style={{ width: `${crystalGrowthPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-stone-400 mt-2 text-center">
                          {selectedPhase.crystalSize} crystals
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Strike Cycle and Controls */}
            <div className="space-y-4">
              {/* Strike Phase Selector */}
              <div>
                <p className="text-xs md:text-sm font-semibold text-stone-200 mb-3">Strike Cycle Progression</p>
                <div className="space-y-2">
                  {selectedColor.phases.map((phase, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedPhaseIndex(index);
                        setCycleCount(1);
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition-colors text-xs md:text-sm ${
                        selectedPhaseIndex === index
                          ? 'bg-blue-700/30 border-blue-500 text-blue-300'
                          : 'bg-stone-900/30 border-stone-700/50 text-stone-300 hover:bg-stone-800/30'
                      }`}
                    >
                      <p className="font-semibold">{phase.name}</p>
                      <p className="text-xs text-stone-400">{phase.tempRange}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flame Atmosphere Selector */}
              <div>
                <p className="text-xs md:text-sm font-semibold text-stone-200 mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Flame Atmosphere
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['neutral', 'oxidizing', 'reducing'] as const).map((atm) => (
                    <button
                      key={atm}
                      onClick={() => setFlameAtmosphere(atm)}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                        flameAtmosphere === atm
                          ? 'bg-opacity-30 border-opacity-100'
                          : 'bg-stone-900/30 border-stone-700/50 text-stone-400 hover:bg-stone-800/30'
                      }`}
                      style={
                        flameAtmosphere === atm
                          ? {
                              backgroundColor: `${flameColor}30`,
                              borderColor: flameColor,
                              color: flameColor
                            }
                          : {}
                      }
                    >
                      {atm.charAt(0).toUpperCase() + atm.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cycle Counter */}
              <div>
                <p className="text-xs md:text-sm font-semibold text-stone-200 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Heat/Cool Cycles
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCycleCount(Math.max(1, cycleCount - 1))}
                    className="text-xs"
                  >
                    −
                  </Button>
                  <div className="flex-1 bg-stone-900/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-amber-400">{cycleCount}</p>
                    <p className="text-xs text-stone-400">cycles</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCycleCount(cycleCount + 1)}
                    className="text-xs"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Information */}
          <div className="border-t border-stone-700/50 pt-6">
            <div className="bg-stone-900/30 rounded-lg p-4 border border-stone-700/50 space-y-3">
              <div>
                <p className="text-xs text-stone-400 font-semibold">CURRENT PHASE</p>
                <p className="text-sm md:text-base font-bold text-amber-400 mt-1">{selectedPhase.name}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 font-semibold">DESCRIPTION</p>
                <p className="text-xs md:text-sm text-stone-300 mt-1">{selectedPhase.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-stone-700/50">
                <div>
                  <p className="text-xs text-stone-400 font-semibold">Temperature Range</p>
                  <p className="text-xs md:text-sm text-stone-300 mt-1">{selectedPhase.tempRange}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-semibold">Crystal Size</p>
                  <p className="text-xs md:text-sm text-stone-300 mt-1">{selectedPhase.crystalSize}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Color-Specific Notes */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 space-y-2">
            <p className="text-xs md:text-sm font-semibold text-blue-300 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Color Notes
            </p>
            <p className="text-xs md:text-sm text-blue-200">{selectedColor.notes}</p>
            <p className="text-xs text-blue-300 pt-2">
              <span className="font-semibold">Optimal Flame:</span> {selectedColor.flamePreference}
            </p>
          </div>

          {/* Flame Atmosphere Effects Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
              <p className="text-xs md:text-sm font-semibold text-amber-300 mb-2">Neutral Flame</p>
              <p className="text-xs text-amber-200">Balanced oxygen/fuel ratio. Safest for most colors; maintains vibrancy and prevents chrome cracking.</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <p className="text-xs md:text-sm font-semibold text-blue-300 mb-2">Oxidizing Flame</p>
              <p className="text-xs text-blue-200">Excess oxygen; cooler than neutral. Good for ruby striking; prevents metallic deposit; suppresses silver reduction.</p>
            </div>
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <p className="text-xs md:text-sm font-semibold text-red-300 mb-2">Reducing Flame</p>
              <p className="text-xs text-red-200">Excess fuel; hotter than neutral. Strips oxygen; creates metallic effects and luster; can muddy colors if overused.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
