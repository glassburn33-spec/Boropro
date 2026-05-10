/*
Flame Characterization Page - Interactive visualization of neutral, oxidizing, and reducing flames
and their effects on borosilicate colors. Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useMemo } from "react";
import { Flame, Info, ArrowRight, ChevronDown } from "lucide-react";
import { ThermochromismSimulator } from "@/components/ThermochromismSimulator";

interface FlameEffect {
  colorFamily: string;
  neutral: {
    appearance: string;
    metalBehavior: string;
    risk: string;
  };
  oxidizing: {
    appearance: string;
    metalBehavior: string;
    risk: string;
  };
  reducing: {
    appearance: string;
    metalBehavior: string;
    risk: string;
  };
}

const flameEffects: FlameEffect[] = [
  {
    colorFamily: "Cobalt blues",
    neutral: {
      appearance: "Bright, stable blue hue",
      metalBehavior: "Cobalt oxide preserved in oxide form",
      risk: "None; neutral is safe default",
    },
    oxidizing: {
      appearance: "Bright, vibrant blue; no graying",
      metalBehavior: "Cobalt stays oxidized; prevents reduction graying",
      risk: "None; oxidizing is ideal for cobalt",
    },
    reducing: {
      appearance: "Dull, grayish-blue; muddy tone",
      metalBehavior: "Reduction removes oxygen; cobalt darkens and grays",
      risk: "High; avoid reducing flame for cobalt blues",
    },
  },
  {
    colorFamily: "Copper rubies",
    neutral: {
      appearance: "Clear to light ruby red",
      metalBehavior: "Copper oxide in stable state; ready for striking",
      risk: "None; neutral preserves color",
    },
    oxidizing: {
      appearance: "Bright ruby; prevents red streaking",
      metalBehavior: "Oxidizing flame prevents metallic copper surface",
      risk: "None; oxidizing maintains ruby clarity",
    },
    reducing: {
      appearance: "Milky red or opaque; metallic sheen",
      metalBehavior: "Reduction creates metallic copper layer; can muddy color",
      risk: "High; over-reduction produces muddy, opaque tones",
    },
  },
  {
    colorFamily: "Silver/exotic colors",
    neutral: {
      appearance: "Clear base; ready for striking",
      metalBehavior: "Silver oxide stable; awaiting thermal cycling",
      risk: "None; neutral is safe for setup",
    },
    oxidizing: {
      appearance: "Bright, clear; prevents premature striking",
      metalBehavior: "Oxidizing prevents unintended metallic effects",
      risk: "None; oxidizing preserves clear state",
    },
    reducing: {
      appearance: "Metallic sheen develops; color shifts",
      metalBehavior: "Slight reduction creates bright metallics; prolonged reduces to earth tones",
      risk: "Medium; requires careful timing to avoid over-striking",
    },
  },
  {
    colorFamily: "Amber purple family",
    neutral: {
      appearance: "Purple hue stable",
      metalBehavior: "Copper + chromium oxides balanced",
      risk: "None; neutral is safe",
    },
    oxidizing: {
      appearance: "Vibrant purple; no amber shift",
      metalBehavior: "Oxidizing maintains purple; prevents amber reduction",
      risk: "None; oxidizing is ideal for purple effect",
    },
    reducing: {
      appearance: "Shift toward opaque amber/milky sea-green",
      metalBehavior: "Reduction shifts color family; copper reduces to metallic tones",
      risk: "High; reduction fundamentally changes intended color",
    },
  },
];

const flameDescriptions = {
  reducing: {
    glassProperties: "Reducing flame creates metallic effects and can shift color families. Causes color darkening, graying, and opacity changes. Use with caution for intentional color modification.",
  },
  neutral: {
    glassProperties: "Neutral flame preserves glass color stability and prevents unwanted chemical modifications. Ideal for maintaining true color representation and working with sensitive color families.",
  },
  oxidizing: {
    glassProperties: "Oxidizing flame prevents metallic surface effects and maintains bright, vibrant colors. Prevents reduction graying and keeps colors clear without muddy tones.",
  },
};

export default function FlameChemistryCharacterization() {
  const [selectedColor, setSelectedColor] = useState("Cobalt blues");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const selectedEffects = useMemo(() => {
    return flameEffects.find((e) => e.colorFamily === selectedColor);
  }, [selectedColor]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-24 w-24 object-contain" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-amber-500">
              Flame Char
            </a>
            <a href="/calculator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Log
            </a>
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Header Image */}
        <section className="border-b border-white/10">
          <img src="/manus-storage/flamecharheader_b78de537.webp" alt="Flame Characterization Header" className="w-full h-auto object-cover" />
        </section>

        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-4">
              Flame Characterization
            </h1>
          </div>
        </section>

        {/* Collapsible Sections */}
        <section className="border-b border-white/10 py-8">
          <div className="container max-w-6xl space-y-4">
            {/* Section 1: Flame Types */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => toggleSection("flameTypes")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <h2 className="text-2xl font-bold text-white">The Three Flame Types</h2>
                <ChevronDown
                  className={`w-6 h-6 text-amber-500 transition-transform ${
                    expandedSection === "flameTypes" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === "flameTypes" && (
                <div className="px-6 py-6 border-t border-white/10 space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {(Object.entries(flameDescriptions) as [string, typeof flameDescriptions.neutral][]).map(([flameType, desc]) => (
                      <div key={flameType} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 capitalize">
                          {flameType} Flame
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-bold text-white block mb-1">Glass Properties:</span>
                            <span className="text-stone-300">{desc.glassProperties}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Select Color Family */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => toggleSection("colorFamily")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <h2 className="text-2xl font-bold text-white">Select a Color Family</h2>
                <ChevronDown
                  className={`w-6 h-6 text-amber-500 transition-transform ${
                    expandedSection === "colorFamily" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === "colorFamily" && (
                <div className="px-6 py-6 border-t border-white/10 space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {flameEffects.map((effect) => (
                      <button
                        key={effect.colorFamily}
                        onClick={() => setSelectedColor(effect.colorFamily)}
                        className={`px-4 py-3 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                          selectedColor === effect.colorFamily
                            ? "bg-amber-600 text-white border border-amber-500"
                            : "border border-white/20 text-stone-400 hover:border-amber-500 hover:text-amber-500"
                        }`}
                      >
                        {effect.colorFamily}
                      </button>
                    ))}
                  </div>

                  {/* Flame Effects Comparison */}
                  {selectedEffects && (
                    <div className="mt-8">
                      <h3 className="text-2xl font-bold text-white mb-8">{selectedEffects.colorFamily} Under Different Flames</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Neutral */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                          <div className="mb-4 p-4 rounded-lg bg-gradient-to-b from-orange-400/20 to-orange-600/20 border border-orange-500/30">
                            <span className="font-mono text-xs font-bold uppercase text-orange-400">Neutral Flame</span>
                            <p className="text-sm text-orange-200 mt-2">🔥 Balanced fuel & oxygen</p>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <span className="font-bold text-white block mb-1">Appearance:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.neutral.appearance}</span>
                            </div>
                            <div>
                              <span className="font-bold text-white block mb-1">Metal Behavior:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.neutral.metalBehavior}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                              <span className="font-bold text-amber-500 block mb-1">Risk Assessment:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.neutral.risk}</span>
                            </div>
                          </div>
                        </div>

                        {/* Oxidizing */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                          <div className="mb-4 p-4 rounded-lg bg-gradient-to-b from-blue-400/20 to-blue-600/20 border border-blue-500/30">
                            <span className="font-mono text-xs font-bold uppercase text-blue-400">Oxidizing Flame</span>
                            <p className="text-sm text-blue-200 mt-2">🔵 Excess oxygen</p>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <span className="font-bold text-white block mb-1">Appearance:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.oxidizing.appearance}</span>
                            </div>
                            <div>
                              <span className="font-bold text-white block mb-1">Metal Behavior:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.oxidizing.metalBehavior}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                              <span className="font-bold text-blue-500 block mb-1">Risk Assessment:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.oxidizing.risk}</span>
                            </div>
                          </div>
                        </div>

                        {/* Reducing */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                          <div className="mb-4 p-4 rounded-lg bg-gradient-to-b from-red-400/20 to-red-600/20 border border-red-500/30">
                            <span className="font-mono text-xs font-bold uppercase text-red-400">Reducing Flame</span>
                            <p className="text-sm text-red-200 mt-2">🟠 Oxygen deficient</p>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <span className="font-bold text-white block mb-1">Appearance:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.reducing.appearance}</span>
                            </div>
                            <div>
                              <span className="font-bold text-white block mb-1">Metal Behavior:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.reducing.metalBehavior}</span>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                              <span className="font-bold text-red-500 block mb-1">Risk Assessment:</span>
                              <span className="text-sm text-stone-300">{selectedEffects.reducing.risk}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Interactive Thermochromism Simulator */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => toggleSection("thermochromism")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <h2 className="text-2xl font-bold text-white">Interactive Thermochromism Simulator</h2>
                <ChevronDown
                  className={`w-6 h-6 text-amber-500 transition-transform ${
                    expandedSection === "thermochromism" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === "thermochromism" && (
                <div className="px-6 py-6 border-t border-white/10 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                    <ThermochromismSimulator />
                  </div>
                  <div className="rounded-2xl border border-stone-700/50 bg-stone-800/50 p-6">
                    <div className="space-y-2 text-sm text-stone-300">
                      <p>
                        <span className="font-semibold text-amber-400">Thermochromism</span> is the reversible change in color with temperature. In borosilicate glass, metal ion chromophores shift their electronic structure as thermal energy increases, altering the wavelengths of light they absorb.
                      </p>
                      <p>
                        Use the temperature slider to explore how different temperature ranges affect glass color. The working range (1149-1220°C) is where glassblowers typically work, while annealing occurs at much lower temperatures (566-700°C).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-stone-950/50 py-8">
        <div className="container max-w-6xl">
          <p className="text-xs text-stone-500 text-center">
            Flame Simulator Tool · Part of the Borosilicate Kiln Research Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
