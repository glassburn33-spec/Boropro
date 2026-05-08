import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ChromophoreSpectrum {
  name: string;
  formula: string;
  minTemp: number;
  maxTemp: number;
  colors: { temp: number; color: string; hex: string; description: string }[];
}

const chromophores: Record<string, ChromophoreSpectrum> = {
  fe2_fe3: {
    name: 'Iron (Fe2+/Fe3+)',
    formula: 'Fe2+ <-> Fe3+',
    minTemp: 20,
    maxTemp: 1200,
    colors: [
      { temp: 20, color: 'Blue-Green', hex: '#0ea5e9', description: 'Fe2+ dominant (octahedral)' },
      { temp: 300, color: 'Blue', hex: '#3b82f6', description: 'Fe2+ with slight oxidation' },
      { temp: 600, color: 'Green', hex: '#10b981', description: 'Mixed Fe2+/Fe3+' },
      { temp: 900, color: 'Yellow-Green', hex: '#84cc16', description: 'Fe3+ increasing' },
      { temp: 1200, color: 'Amber', hex: '#f59e0b', description: 'Fe3+ dominant' },
    ],
  },
  cobalt: {
    name: 'Cobalt (Co2+)',
    formula: 'Co2+',
    minTemp: 20,
    maxTemp: 1200,
    colors: [
      { temp: 20, color: 'Deep Blue', hex: '#1e40af', description: 'Octahedral coordination' },
      { temp: 400, color: 'Bright Blue', hex: '#2563eb', description: 'Stable octahedral' },
      { temp: 800, color: 'Purple-Blue', hex: '#7c3aed', description: 'Coordination shift' },
      { temp: 1200, color: 'Purple', hex: '#a855f7', description: 'Tetrahedral coordination' },
    ],
  },
  nickel: {
    name: 'Nickel (Ni2+)',
    formula: 'Ni2+',
    minTemp: 20,
    maxTemp: 1200,
    colors: [
      { temp: 20, color: 'Brown', hex: '#92400e', description: '[5]Ni (penta-coordinated)' },
      { temp: 400, color: 'Brown-Yellow', hex: '#b45309', description: 'Stable brown' },
      { temp: 700, color: 'Yellow-Green', hex: '#84cc16', description: 'Coordination transition' },
      { temp: 1000, color: 'Green', hex: '#10b981', description: '[6]Ni (octahedral)' },
      { temp: 1200, color: 'Light Green', hex: '#6ee7b7', description: 'Octahedral dominant' },
    ],
  },
  chromium: {
    name: 'Chromium (Cr3+)',
    formula: 'Cr3+',
    minTemp: 20,
    maxTemp: 1200,
    colors: [
      { temp: 20, color: 'Green', hex: '#059669', description: 'Octahedral coordination' },
      { temp: 400, color: 'Bright Green', hex: '#10b981', description: 'Stable octahedral' },
      { temp: 800, color: 'Yellow-Green', hex: '#84cc16', description: 'Slight coordination shift' },
      { temp: 1200, color: 'Yellow', hex: '#eab308', description: 'Distorted octahedral' },
    ],
  },
  manganese: {
    name: 'Manganese (Mn2+/Mn3+)',
    formula: 'Mn2+ <-> Mn3+',
    minTemp: 20,
    maxTemp: 1200,
    colors: [
      { temp: 20, color: 'Pink', hex: '#ec4899', description: 'Mn2+ dominant' },
      { temp: 400, color: 'Purple', hex: '#d946ef', description: 'Mixed Mn2+/Mn3+' },
      { temp: 800, color: 'Brown', hex: '#92400e', description: 'Mn3+ increasing' },
      { temp: 1200, color: 'Dark Brown', hex: '#78350f', description: 'Mn3+ dominant' },
    ],
  },
};

export function ThermochromismSimulator() {
  const [selectedChromophore, setSelectedChromophore] = useState('fe2_fe3');
  const [temperature, setTemperature] = useState(600);
  const [animating, setAnimating] = useState(false);

  const chromophore = chromophores[selectedChromophore];
  const colorData = chromophore.colors;
  
  const getColorAtTemp = (temp: number) => {
    for (let i = 0; i < colorData.length - 1; i++) {
      const current = colorData[i];
      const next = colorData[i + 1];
      if (temp >= current.temp && temp <= next.temp) {
        return {
          color: current.color,
          hex: current.hex,
          description: current.description,
        };
      }
    }
    return {
      color: colorData[colorData.length - 1].color,
      hex: colorData[colorData.length - 1].hex,
      description: colorData[colorData.length - 1].description,
    };
  };

  const currentColor = getColorAtTemp(temperature);

  const handleAnimate = () => {
    setAnimating(true);
    let currentTemp = chromophore.minTemp;
    const interval = setInterval(() => {
      currentTemp += 20;
      if (currentTemp > chromophore.maxTemp) {
        clearInterval(interval);
        setAnimating(false);
        setTemperature(chromophore.minTemp);
      } else {
        setTemperature(currentTemp);
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-amber-500 pl-6">
        <h2 className="text-3xl font-bold text-amber-400 mb-2">Interactive Thermochromism Simulator</h2>
        <p className="text-stone-300 text-sm">Explore how temperature changes affect metal ion coordination and glass color</p>
      </div>

      <Card className="bg-stone-800/50 backdrop-blur rounded-lg p-8 border border-stone-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-stone-300">Color Display</h3>
              <div
                className="w-full h-48 rounded-lg border-2 border-stone-600 shadow-lg transition-colors duration-500"
                style={{
                  backgroundColor: currentColor.hex,
                  boxShadow: `0 0 30px ${currentColor.hex}40`,
                }}
              />
              <div className="bg-stone-900/60 rounded p-4 space-y-2">
                <p className="text-stone-400 text-sm">Current Color</p>
                <p className="text-2xl font-bold text-stone-100">{currentColor.color}</p>
                <p className="text-xs text-stone-400">{currentColor.description}</p>
                <p className="text-xs text-stone-500 font-mono">{currentColor.hex}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-stone-300">Select Chromophore</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(chromophores).map(([key, chrom]) => (
                  <Button
                    key={key}
                    onClick={() => setSelectedChromophore(key)}
                    className={`text-xs py-2 ${
                      selectedChromophore === key
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
                    }`}
                  >
                    {chrom.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-stone-300">Temperature Control</h3>
              <div className="bg-stone-900/60 rounded p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400 text-sm">Temperature</span>
                  <span className="text-2xl font-bold text-amber-400">{temperature}°C</span>
                </div>
                <Slider
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  min={chromophore.minTemp}
                  max={chromophore.maxTemp}
                  step={10}
                  disabled={animating}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-stone-500">
                  <span>{chromophore.minTemp}°C</span>
                  <span>{chromophore.maxTemp}°C</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAnimate}
              disabled={animating}
              className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3"
            >
              {animating ? '⏳ Heating...' : '🔥 Animate Heating'}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-stone-800/30 border border-stone-700/50 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-400">About {chromophore.name}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-stone-900/40 rounded p-3">
              <p className="text-stone-400 text-xs">Chemical Formula</p>
              <p className="text-stone-200 font-mono font-bold">{chromophore.formula}</p>
            </div>
            <div className="bg-stone-900/40 rounded p-3">
              <p className="text-stone-400 text-xs">Temperature Range</p>
              <p className="text-stone-200 font-bold">{chromophore.minTemp}–{chromophore.maxTemp}°C</p>
            </div>
          </div>
          <div className="bg-stone-900/40 rounded p-4 text-sm text-stone-300 space-y-2">
            <p className="font-semibold text-amber-400">How It Works:</p>
            <p>
              As temperature increases, thermal energy causes the metal ion's coordination geometry to shift. This changes the crystal field splitting energy, which alters the wavelengths of light absorbed by the ion. The result is a visible color change that reflects underlying changes in atomic structure.
            </p>
            <p className="text-xs text-stone-400 mt-2">
              This phenomenon is called thermochromism and is essential for understanding glass color stability during kiln firing and annealing.
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-stone-800/50 border border-stone-700/50 p-6">
        <h3 className="text-lg font-semibold text-amber-400 mb-4">Color Progression with Temperature</h3>
        <div className="space-y-3">
          {colorData.map((data, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-20 text-right">
                <p className="text-sm font-bold text-stone-300">{data.temp}°C</p>
              </div>
              <div
                className="h-12 rounded flex-1 border border-stone-600 shadow-md"
                style={{ backgroundColor: data.hex }}
              />
              <div className="w-32">
                <p className="text-sm font-semibold text-stone-200">{data.color}</p>
                <p className="text-xs text-stone-400">{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
