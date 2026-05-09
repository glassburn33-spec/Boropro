import React, { useMemo } from "react";
import { colorantSpectra, interpolateHue } from "@/data/colorantSpectrumDataset";
import { Info } from "lucide-react";

interface ColorSpectrumBarsProps {
  temperatureC: number;
  minTemp: number;
  maxTemp: number;
}

interface TooltipState {
  colorantId: string | null;
  x: number;
  y: number;
}

export const ColorSpectrumBars: React.FC<ColorSpectrumBarsProps> = ({
  temperatureC,
  minTemp,
  maxTemp,
}) => {
  const [expandedColorant, setExpandedColorant] = React.useState<string | null>(null);
  // Generate gradient for each colorant
  const generateGradient = (spectrum: typeof colorantSpectra[0]): string => {
    const gradientStops = spectrum.huePoints
      .map((point: any) => {
        const percentage = ((point.temp - minTemp) / (maxTemp - minTemp)) * 100;
        return `${point.hue} ${percentage}%`;
      })
      .join(", ");

    return `linear-gradient(to right, ${gradientStops})`;
  };

  // Calculate position of current temperature indicator
  const indicatorPosition = useMemo(() => {
    return ((temperatureC - minTemp) / (maxTemp - minTemp)) * 100;
  }, [temperatureC, minTemp, maxTemp]);

  // Get current hue for each colorant
  const currentHues = useMemo(() => {
    return colorantSpectra.map((spectrum: typeof colorantSpectra[0]) => ({
      id: spectrum.id,
      ...interpolateHue(spectrum, temperatureC),
    }));
  }, [temperatureC]);

  return (
    <div className="space-y-6 mt-8 p-6 bg-stone-900 rounded-lg border border-stone-700">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold text-amber-400">
          Color Spectrum by Temperature
        </h3>
        <Info className="w-5 h-5 text-amber-400" />
      </div>

      <p className="text-sm text-stone-400 mb-6">
        Each bar shows how a colorant's hue changes across the temperature range. The white line indicates the current temperature setting.
      </p>

      {/* Spectrum Bars */}
      <div className="space-y-4">
      {colorantSpectra.map((spectrum: typeof colorantSpectra[0]) => {
        const currentHue = currentHues.find((h: any) => h.id === spectrum.id);

          return (
            <div key={spectrum.id} className="space-y-2">
              {/* Label and Current Hue */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="text-sm font-semibold text-stone-200 w-32">
                    {spectrum.name}
                  </span>
                  {spectrum.strikingTemp && (
                    <span className="text-xs bg-amber-900 text-amber-200 px-2 py-1 rounded">
                      Strikes @ {spectrum.strikingTemp}°C
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-8 rounded border border-stone-600"
                    style={{ backgroundColor: currentHue?.hue || "#000000" }}
                    title={currentHue?.description}
                  />
                  <span className="text-xs text-stone-400 w-24 text-right">
                    {currentHue?.description}
                  </span>
                </div>
              </div>

              {/* Gradient Bar */}
              <div 
                className="relative h-12 rounded border border-stone-600 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setExpandedColorant(expandedColorant === spectrum.id ? null : spectrum.id)}
              >
                {/* Gradient Background */}
                <div
                  className="w-full h-full"
                  style={{ background: generateGradient(spectrum) }}
                />

                {/* Temperature Indicator Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                  style={{
                    left: `${indicatorPosition}%`,
                    boxShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
                  }}
                />

                {/* Striking Temperature Marker (if applicable) */}
                {spectrum.strikingTemp && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-500 opacity-60"
                    style={{
                      left: `${((spectrum.strikingTemp - minTemp) / (maxTemp - minTemp)) * 100}%`,
                    }}
                    title={`Striking temperature: ${spectrum.strikingTemp}°C`}
                  />
                )}
              </div>

              {/* Temperature Scale Labels */}
              <div className="flex justify-between text-xs text-stone-500 px-1">
                <span>{minTemp}°C</span>
                <span>{Math.round((minTemp + maxTemp) / 2)}°C</span>
                <span>{maxTemp}°C</span>
              </div>

              {/* Special Behavior Note */}
              {spectrum.specialBehavior && (
                <p className="text-xs text-stone-400 italic pl-1">
                  {spectrum.specialBehavior}
                </p>
              )}

              {/* Expanded Detail Panel */}
              {expandedColorant === spectrum.id && (
                <div className="mt-4 p-4 bg-stone-800 rounded border border-amber-500/30 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-amber-400 font-semibold">Chemistry:</span>
                      <p className="text-stone-300">{spectrum.chemistry}</p>
                    </div>
                    <div>
                      <span className="text-amber-400 font-semibold">Color Family:</span>
                      <p className="text-stone-300 capitalize">{spectrum.family}</p>
                    </div>
                    {spectrum.strikingTemp && (
                      <div>
                        <span className="text-amber-400 font-semibold">Striking Temp:</span>
                        <p className="text-stone-300">{spectrum.strikingTemp}°C</p>
                      </div>
                    )}
                    <div>
                      <span className="text-amber-400 font-semibold">Current Color:</span>
                      <p className="text-stone-300">{currentHue?.description}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-stone-700">
                    <span className="text-amber-400 font-semibold text-sm">Data Source:</span>
                    <p className="text-xs text-stone-400 mt-1">{spectrum.dataSource}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-stone-700 space-y-3">
        <h4 className="text-sm font-semibold text-amber-400">Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-white" />
            <span>Current temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-amber-500 opacity-60" />
            <span>Striking temperature (if applicable)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-900 text-amber-200 px-2 py-1 rounded">
              Strikes @ Temp
            </span>
            <span>Colorant has striking behavior</span>
          </div>
        </div>
      </div>

      {/* Data Source Attribution */}
      <div className="mt-6 pt-6 border-t border-stone-700">
        <p className="text-xs text-stone-500">
          <strong>Data Sources:</strong> All hue values and temperature breakpoints sourced from BoroPro app data:
          glass_colors.ts (manufacturer specifications), colors.ts (metal oxide chemistry), ColorScienceTab.tsx (thermochromism data),
          and ThermochromismSimulator.tsx (temperature ranges). Striking temperatures and special behaviors documented from
          manufacturer recommendations and scientific literature integrated into the app.
        </p>
      </div>
    </div>
  );
};

export default ColorSpectrumBars;
