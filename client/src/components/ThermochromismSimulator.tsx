'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Thermometer, ChevronDown } from 'lucide-react';
import { DragonTearsBar } from './DragonTearsBar';
import { FeaturedColorBar } from './FeaturedColorBar';
import { allFeaturedColors } from '@/data/glassAlchemyColors';

export function ThermochromismSimulator() {
  const [temperature, setTemperature] = useState(600);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const displayTemp = temperatureUnit === 'F' ? Math.round((temperature * 9/5) + 32) : temperature;

  // Create color options array with Dragon Tears v2 first
  const colorOptions = [
    { name: 'Dragon Tears v2', manufacturer: 'Glass Alchemy', isDragonTears: true },
    ...allFeaturedColors
  ];

  const selectedColor = colorOptions[selectedColorIndex];
  const isSelectedDragonTears = selectedColor.isDragonTears;

  // Get the color swatch for the dropdown button
  const getColorSwatch = () => {
    if (isSelectedDragonTears) {
      return 'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500';
    }
    const color = selectedColor as any;
    const midIndex = Math.floor(color.atmosphereData.neutral.length / 2);
    return color.atmosphereData.neutral[midIndex].rgb;
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
          {/* Temperature Control and Color Selector */}
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

            {/* Color Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowColorDropdown(!showColorDropdown)}
                className="w-full px-4 py-3 bg-stone-900/50 hover:bg-stone-900 border border-stone-700/50 rounded-lg flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={isSelectedDragonTears ? { backgroundImage: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153), rgb(239, 68, 68))' } : { backgroundColor: getColorSwatch() }}
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-amber-400">{selectedColor.name}</p>
                    <p className="text-xs text-stone-400">{selectedColor.manufacturer}</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${showColorDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showColorDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-stone-900 border border-stone-700/50 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColorIndex(index);
                        setShowColorDropdown(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-stone-800 transition-colors text-left border-b border-stone-700/30 last:border-b-0 ${
                        selectedColorIndex === index ? 'bg-stone-800' : ''
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={color.isDragonTears ? { backgroundImage: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153), rgb(239, 68, 68))' } : { backgroundColor: (color as any).atmosphereData.neutral[Math.floor((color as any).atmosphereData.neutral.length / 2)].rgb }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-amber-400">{color.name}</p>
                        <p className="text-xs text-stone-400">{color.manufacturer}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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

          {/* Selected Color Display */}
          <div className="border-t border-stone-700/50 pt-6">
            <div className="border border-stone-700/50 rounded-lg overflow-hidden">
              <div className="p-6 bg-stone-900/30">
                {isSelectedDragonTears ? (
                  <DragonTearsBar temperatureC={temperature} />
                ) : (
                  <FeaturedColorBar color={selectedColor as any} temperatureC={temperature} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
