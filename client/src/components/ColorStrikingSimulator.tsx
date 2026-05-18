'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Zap, AlertCircle } from 'lucide-react';

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
  const [cycleCount, setCycleCount] = useState(1);

  const selectedColor = colorFamilies.find(c => c.id === selectedColorId)!;
  const selectedPhase = selectedColor.phases[selectedPhaseIndex];

  // Get the color based on cycles
  const getCycleColor = () => {
    const cycleIndex = Math.min(cycleCount - 1, selectedPhase.colorProgression.length - 1);
    return selectedPhase.colorProgression[cycleIndex];
  };

  // Apply flame atmosphere effects
  const getDisplayColor = () => {
    if (selectedColor.id === 'chrome-opal') {
      if (flameAtmosphere === 'reducing') return '#FF0000';
      if (flameAtmosphere === 'oxidizing') return '#A9A9A9';
      return getCycleColor();
    }
    if (flameAtmosphere === 'reducing' && selectedPhaseIndex === selectedColor.phases.length - 1) {
      return '#FFD700';
    }
    return getCycleColor();
  };

  const getAtmosphereLabel = () => {
    if (selectedColor.id === 'chrome-opal') {
      if (flameAtmosphere === 'reducing') return 'Chrome oxide REDUCED to RED (⚠️ DANGER)';
      if (flameAtmosphere === 'oxidizing') return 'Chrome oxidized to GRAY (muddy)';
      return 'Neutral flame - maintains TRUE GREEN';
    }
    if (flameAtmosphere === 'reducing') return 'Adds metallic LUSTER at full strike';
    if (flameAtmosphere === 'oxidizing') return 'Brightens and STABILIZES colors';
    return 'Balanced striking progression';
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
        <p className="text-stone-300 text-xs md:text-sm">Adjust flame atmosphere and heat cycles to see how they affect color development</p>
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

          {/* Main Display Grid */}
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

                  {/* Current Strike Color - AFFECTED BY TOGGLES */}
                  <div>
                    <p className="text-xs text-stone-400 mb-2">Struck Color (Flame + Cycles)</p>
                    <div
                      className="w-full h-32 rounded-lg border-2 border-amber-500 shadow-xl transition-colors"
                      style={{ backgroundColor: getDisplayColor() }}
                    />
                    <p className="text-xs text-amber-300 mt-2 font-semibold">{getAtmosphereLabel()}</p>
                  </div>

                  {/* Cycle Counter - AFFECTS COLOR */}
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
                    <p className="text-xs text-stone-400 mt-2">More cycles = deeper color progression</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="space-y-4">
              {/* Strike Phase Selector */}
              <div>
                <p className="text-xs md:text-sm font-semibold text-stone-200 mb-3">Strike Phase</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedColor.phases.map((phase, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhaseIndex(idx)}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                        selectedPhaseIndex === idx
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

              {/* Flame Atmosphere Selector - AFFECTS COLOR */}
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
                      className={`p-3 rounded-lg border text-xs font-semibold transition-colors ${
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
                <p className="text-xs text-stone-400 mt-2">Watch the color change above ↑</p>
              </div>

              {/* Phase Information */}
              <div className="border-t border-stone-700/50 pt-4">
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
                      <p className="text-xs text-stone-400 font-semibold">Temperature</p>
                      <p className="text-xs md:text-sm text-stone-300 mt-1">{selectedPhase.tempRange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-semibold">Crystal Size</p>
                      <p className="text-xs md:text-sm text-stone-300 mt-1">{selectedPhase.crystalSize}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning for Chrome Opal */}
              {selectedColor.id === 'chrome-opal' && flameAtmosphere !== 'neutral' && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-300">CRITICAL WARNING</p>
                    <p className="text-xs text-red-200 mt-1">Chrome Opal MUST be worked in strict neutral flame only. Reducing or oxidizing flames will cause color shift and potential cracking.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Color Family Notes */}
          <div className="border-t border-stone-700/50 pt-6">
            <div className="bg-stone-900/30 rounded-lg p-4 border border-stone-700/50">
              <p className="text-xs text-stone-400 font-semibold mb-2">NOTES</p>
              <p className="text-xs md:text-sm text-stone-300">{selectedColor.notes}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
