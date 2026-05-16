import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FlameEffect {
  colorFamily: string;
  metalComposition: string;
  description: string;
  neutral: {
    appearance: string;
    metalBehavior: string;
    risk: string;
    hexColor: string;
  };
  oxidizing: {
    appearance: string;
    metalBehavior: string;
    risk: string;
    hexColor: string;
  };
  reducing: {
    appearance: string;
    metalBehavior: string;
    risk: string;
    hexColor: string;
  };
}

interface ColorFamilyListProps {
  colorFamilies: FlameEffect[];
}

export function ColorFamilyList({ colorFamilies }: ColorFamilyListProps) {
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);

  const toggleFamily = (colorFamily: string) => {
    setExpandedFamily(expandedFamily === colorFamily ? null : colorFamily);
  };

  return (
    <div className="space-y-3">
      {colorFamilies.map((effect) => (
        <div key={effect.colorFamily} className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
          {/* Header - Always Visible */}
          <button
            onClick={() => toggleFamily(effect.colorFamily)}
            className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
          >
            <div className="text-left flex-1 min-w-0">
              <h3 className="font-bold text-white text-base md:text-lg break-words">{effect.colorFamily}</h3>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-amber-500 transition-transform flex-shrink-0 ml-4 ${
                expandedFamily === effect.colorFamily ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Expanded Content */}
          {expandedFamily === effect.colorFamily && (
            <div className="px-4 md:px-6 py-4 md:py-6 border-t border-white/10 space-y-4 md:space-y-6 bg-white/2">
              {/* Chemical Composition */}
              <div>
                <span className="font-bold text-white block mb-2">Chemical Composition:</span>
                <p className="text-sm text-stone-300">{effect.metalComposition}</p>
              </div>

              {/* Description */}
              <div>
                <span className="font-bold text-white block mb-2">Overview:</span>
                <p className="text-sm text-stone-300">{effect.description}</p>
              </div>

              {/* Flame Effects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {/* Reducing Flame */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4">
                  <div className="mb-3 p-3 rounded-lg bg-gradient-to-b from-blue-400/20 to-blue-600/20 border border-blue-500/30">
                    <span className="font-mono text-xs font-bold uppercase text-blue-400">Reducing Flame</span>
                    <p className="text-xs text-blue-200 mt-1">🔥 Excess fuel</p>
                  </div>
                  {/* Color Swatch */}
                  <div className="mb-3 rounded-lg border-2 border-white/20 overflow-hidden">
                    <div
                      className="w-full h-20"
                      style={{ backgroundColor: effect.reducing.hexColor }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-white text-xs block mb-1">Appearance:</span>
                      <span className="text-xs text-stone-300">{effect.reducing.appearance}</span>
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block mb-1">Metal Behavior:</span>
                      <span className="text-xs text-stone-300">{effect.reducing.metalBehavior}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="font-bold text-amber-500 text-xs block mb-1">Risk:</span>
                      <span className="text-xs text-stone-300">{effect.reducing.risk}</span>
                    </div>
                  </div>
                </div>

                {/* Neutral Flame */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4">
                  <div className="mb-3 p-3 rounded-lg bg-gradient-to-b from-orange-400/20 to-orange-600/20 border border-orange-500/30">
                    <span className="font-mono text-xs font-bold uppercase text-orange-400">Neutral Flame</span>
                    <p className="text-xs text-orange-200 mt-1">🔥 Balanced fuel & oxygen</p>
                  </div>
                  {/* Color Swatch */}
                  <div className="mb-3 rounded-lg border-2 border-white/20 overflow-hidden">
                    <div
                      className="w-full h-20"
                      style={{ backgroundColor: effect.neutral.hexColor }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-white text-xs block mb-1">Appearance:</span>
                      <span className="text-xs text-stone-300">{effect.neutral.appearance}</span>
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block mb-1">Metal Behavior:</span>
                      <span className="text-xs text-stone-300">{effect.neutral.metalBehavior}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="font-bold text-amber-500 text-xs block mb-1">Risk:</span>
                      <span className="text-xs text-stone-300">{effect.neutral.risk}</span>
                    </div>
                  </div>
                </div>

                {/* Oxidizing Flame */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 md:p-4">
                  <div className="mb-3 p-3 rounded-lg bg-gradient-to-b from-red-400/20 to-red-600/20 border border-red-500/30">
                    <span className="font-mono text-xs font-bold uppercase text-red-400">Oxidizing Flame</span>
                    <p className="text-xs text-red-200 mt-1">🔥 Excess oxygen</p>
                  </div>
                  {/* Color Swatch */}
                  <div className="mb-3 rounded-lg border-2 border-white/20 overflow-hidden">
                    <div
                      className="w-full h-20"
                      style={{ backgroundColor: effect.oxidizing.hexColor }}
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-white text-xs block mb-1">Appearance:</span>
                      <span className="text-xs text-stone-300">{effect.oxidizing.appearance}</span>
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block mb-1">Metal Behavior:</span>
                      <span className="text-xs text-stone-300">{effect.oxidizing.metalBehavior}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="font-bold text-amber-500 text-xs block mb-1">Risk:</span>
                      <span className="text-xs text-stone-300">{effect.oxidizing.risk}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
