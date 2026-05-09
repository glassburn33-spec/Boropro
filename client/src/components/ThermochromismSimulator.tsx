'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Thermometer, ChevronDown, ChevronUp } from 'lucide-react';
import { DragonTearsBar } from './DragonTearsBar';
import { FeaturedColorBar } from './FeaturedColorBar';
import { allFeaturedColors } from '@/data/glassAlchemyColors';

export function ThermochromismSimulator() {
  const [temperature, setTemperature] = useState(600);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [expandedColors, setExpandedColors] = useState<Set<string>>(new Set(['Dragon Tears v2']));

  const displayTemp = temperatureUnit === 'F' ? Math.round((temperature * 9/5) + 32) : temperature;

  const toggleColorExpanded = (colorName: string) => {
    const newExpanded = new Set(expandedColors);
    if (newExpanded.has(colorName)) {
      newExpanded.delete(colorName);
    } else {
      newExpanded.add(colorName);
    }
    setExpandedColors(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-amber-500 pl-6">
        <h2 className="text-3xl font-bold text-amber-400 mb-2">Interactive Thermochromism Simulator</h2>
        <p className="text-stone-300 text-sm">Explore how temperature affects glass color through chromophore behavior</p>
      </div>

      {/* Main Simulator Card */}
      <Card className="bg-stone-800/50 border border-stone-700/50 p-8">
        <div className="space-y-6">
          {/* Temperature Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                Temperature Control
              </label>
              <div className="flex gap-2">
                <Button
                  variant={temperatureUnit === 'C' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTemperatureUnit('C')}
                  className="w-12"
                >
                  °C
                </Button>
                <Button
                  variant={temperatureUnit === 'F' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTemperatureUnit('F')}
                  className="w-12"
                >
                  °F
                </Button>
              </div>
            </div>

            {/* Temperature Display */}
            <div className="bg-stone-900/50 rounded-lg p-4 text-center">
              <p className="text-5xl font-bold text-amber-400">{displayTemp}°</p>
              <p className="text-sm text-stone-400 mt-2">
                {temperatureUnit === 'C' ? 'Celsius' : 'Fahrenheit'}
              </p>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="20"
              max="1220"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer"
            />

            {/* Temperature Range Labels */}
            <div className="flex justify-between text-xs text-stone-500">
              <span>20°C (Room Temp)</span>
              <span>1220°C (Max Working)</span>
            </div>
          </div>

          {/* Temperature Zone Indicators */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-900/30 rounded p-4 border border-blue-700/50">
              <p className="text-xs text-blue-300 font-semibold">COOL</p>
              <p className="text-xs text-blue-200 mt-1">20-300°C</p>
            </div>
            <div className="bg-amber-900/30 rounded p-4 border border-amber-700/50">
              <p className="text-xs text-amber-300 font-semibold">WORKING</p>
              <p className="text-xs text-amber-200 mt-1">1149-1220°C</p>
            </div>
            <div className="bg-red-900/30 rounded p-4 border border-red-700/50">
              <p className="text-xs text-red-300 font-semibold">ANNEALING</p>
              <p className="text-xs text-red-200 mt-1">566-700°C</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Information Card */}
      <Card className="bg-stone-800/50 border border-stone-700/50 p-6">
        <div className="flex gap-4">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
          <div className="space-y-2 text-sm text-stone-300">
            <p>
              <span className="font-semibold text-amber-400">Thermochromism</span> is the reversible change in color with temperature. In borosilicate glass, metal ion chromophores shift their electronic structure as thermal energy increases, altering the wavelengths of light they absorb.
            </p>
            <p>
              Use the temperature slider to explore how different temperature ranges affect glass color. The working range (1149-1220°C) is where glassblowers typically work, while annealing occurs at much lower temperatures (566-700°C).
            </p>
          </div>
        </div>
      </Card>

      {/* Featured Colors Section */}
      <div className="space-y-4">
        <div className="border-l-4 border-amber-500 pl-6">
          <h3 className="text-2xl font-bold text-amber-400">Featured Glass Alchemy Colors</h3>
          <p className="text-stone-300 text-sm mt-1">Dual-axis color behavior: temperature + flame atmosphere responsiveness</p>
        </div>

        {/* Colors List with Collapsible Sections */}
        <div className="space-y-3">
          {/* Dragon Tears v2 (Legacy Component) */}
          <div className="border border-stone-700/50 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleColorExpanded('Dragon Tears v2')}
              className="w-full px-6 py-4 bg-stone-800/50 hover:bg-stone-800 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500" />
                <span className="font-semibold text-amber-400">Dragon Tears v2</span>
                <span className="text-xs text-stone-400">Glass Alchemy</span>
              </div>
              {expandedColors.has('Dragon Tears v2') ? (
                <ChevronUp className="w-5 h-5 text-stone-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-400" />
              )}
            </button>
            {expandedColors.has('Dragon Tears v2') && (
              <div className="p-6 bg-stone-900/30 border-t border-stone-700/50">
                <DragonTearsBar temperatureC={temperature} />
              </div>
            )}
          </div>

          {/* Other Featured Colors */}
          {allFeaturedColors.map((color) => (
            <div key={color.name} className="border border-stone-700/50 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleColorExpanded(color.name)}
                className="w-full px-6 py-4 bg-stone-800/50 hover:bg-stone-800 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color.atmosphereData.neutral[Math.floor(color.atmosphereData.neutral.length / 2)].rgb }}
                  />
                  <span className="font-semibold text-amber-400">{color.name}</span>
                  <span className="text-xs text-stone-400">{color.manufacturer}</span>
                </div>
                {expandedColors.has(color.name) ? (
                  <ChevronUp className="w-5 h-5 text-stone-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400" />
                )}
              </button>
              {expandedColors.has(color.name) && (
                <div className="p-6 bg-stone-900/30 border-t border-stone-700/50">
                  <FeaturedColorBar color={color} temperatureC={temperature} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Explanation */}
      <Card className="bg-stone-800/50 border border-stone-700/50 p-6">
        <h3 className="text-lg font-semibold text-amber-400 mb-4">How Thermochromism Works</h3>
        <div className="bg-stone-900/40 rounded p-4 text-sm text-stone-300 space-y-3">
          <p>
            <span className="font-semibold text-amber-400">Thermal Energy & Coordination:</span> As temperature increases, thermal energy causes metal ions' coordination geometry to shift. This changes the crystal field splitting energy, which alters the wavelengths of light absorbed by the ion.
          </p>
          <p>
            <span className="font-semibold text-amber-400">Visible Color Change:</span> The result is a visible color change that reflects underlying changes in atomic structure. For example, Fe²⁺ in octahedral coordination appears blue-green, while Fe³⁺ appears amber.
          </p>
          <p>
            <span className="font-semibold text-amber-400">Practical Significance:</span> Understanding thermochromism is essential for predicting glass color stability during kiln firing and annealing. Different chromophores respond differently to temperature changes, affecting final glass appearance.
          </p>
          <p className="text-xs text-stone-400 border-t border-stone-700 pt-3 mt-3">
            All temperature data and annealing schedules based on 33 COE borosilicate specifications from Northstar Glassworks, Gaffer Glass, Trautman Art Glass, and Glass Alchemy.
          </p>
        </div>
      </Card>
    </div>
  );
}
