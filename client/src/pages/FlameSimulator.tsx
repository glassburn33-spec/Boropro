/*
Flame Characterization Page - Interactive visualization of neutral, oxidizing, and reducing flames
and their effects on borosilicate colors. Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useMemo } from "react";
import { Flame, Info, ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { ThermochromismSimulator } from "@/components/ThermochromismSimulator";
import { ColorFamilyList } from "@/components/ColorFamilyList";
import { ColorStrikingSimulator } from "@/components/ColorStrikingSimulator";

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

const flameEffects: FlameEffect[] = [
  {
    colorFamily: "Cobalt blues",
    metalComposition: "Cobalt Oxide (CoO, Co₂O₃)",
    description: "Bright, stable cobalt blue. Highly sensitive to reducing flames, which cause graying and dulling. Oxidizing and neutral flames preserve vibrant color.",
    neutral: {
      appearance: "Bright, stable blue hue",
      metalBehavior: "Cobalt oxide preserved in oxide form",
      risk: "None; neutral is safe default",
      hexColor: "#0052CC",
    },
    oxidizing: {
      appearance: "Bright, vibrant blue; no graying",
      metalBehavior: "Cobalt stays oxidized; prevents reduction graying",
      risk: "None; oxidizing is ideal for cobalt",
      hexColor: "#0047B2",
    },
    reducing: {
      appearance: "Dull, grayish-blue; muddy tone",
      metalBehavior: "Reduction removes oxygen; cobalt darkens and grays",
      risk: "High; avoid reducing flame for cobalt blues",
      hexColor: "#4A5F7F",
    },
  },
  {
    colorFamily: "Copper rubies",
    metalComposition: "Copper Oxide (CuO, Cu₂O)",
    description: "Deep red color with striking nucleation. Requires careful flame control to maintain clarity. Reducing flames create metallic effects and opacity.",
    neutral: {
      appearance: "Clear to light ruby red",
      metalBehavior: "Copper oxide in stable state; ready for striking",
      risk: "None; neutral preserves color",
      hexColor: "#CC2D2D",
    },
    oxidizing: {
      appearance: "Bright ruby; prevents red streaking",
      metalBehavior: "Oxidizing flame prevents metallic copper surface",
      risk: "None; oxidizing maintains ruby clarity",
      hexColor: "#E63946",
    },
    reducing: {
      appearance: "Milky red or opaque; metallic sheen",
      metalBehavior: "Reduction creates metallic copper layer; can muddy color",
      risk: "High; over-reduction produces muddy, opaque tones",
      hexColor: "#8B3A3A",
    },
  },
  {
    colorFamily: "Silver/exotic colors",
    metalComposition: "Silver, Gold, and/or Copper in glass matrix",
    description: "Highly reactive colors that develop metallic effects and color shifts based on flame atmosphere. Slight reduction creates bright metallics; prolonged reduction yields earth tones.",
    neutral: {
      appearance: "Clear base; ready for striking",
      metalBehavior: "Silver oxide stable; awaiting thermal cycling",
      risk: "None; neutral is safe for setup",
      hexColor: "#E8E8E8",
    },
    oxidizing: {
      appearance: "Bright, clear; prevents premature striking",
      metalBehavior: "Oxidizing prevents unintended metallic effects",
      risk: "None; oxidizing preserves clear state",
      hexColor: "#F5F5F5",
    },
    reducing: {
      appearance: "Metallic sheen develops; color shifts to gold/green/earth tones",
      metalBehavior: "Slight reduction creates bright metallics; prolonged reduces to earth tones",
      risk: "Medium; requires careful timing to avoid over-striking",
      hexColor: "#D4AF37",
    },
  },
  {
    colorFamily: "Amber purple family",
    metalComposition: "Silver + Copper + Chromium striking system (silver precipitation)",
    description: "Complex striking color with silver metal precipitation. MUST work in sharp oxidizing flame. Requires aggressive heating to burn off metallic haze. Never use reducing flame. Developed at Pepperdine University by Suellen Fowler.",
    neutral: {
      appearance: "Opacifies to milky yellow; color fails",
      metalBehavior: "If flame not sharp enough, silver haze thickens and turns matte gray",
      risk: "High; neutral flame insufficient - must use sharp oxidizing",
      hexColor: "#D4AF37",
    },
    oxidizing: {
      appearance: "Vibrant purple; sharp oxidizing flame required",
      metalBehavior: "Sharp oxidizing flame burns off silver haze; reveals true purple",
      risk: "Low; oxidizing is the ONLY correct flame type",
      hexColor: "#A855F7",
    },
    reducing: {
      appearance: "COLOR FAILURE; never use reducing flame",
      metalBehavior: "Reduction causes complete color failure; opacifies incorrectly",
      risk: "CRITICAL; reducing flame is strictly prohibited",
      hexColor: "#4A4A4A",
    },
  },
  {
    colorFamily: "Cadmium yellows",
    metalComposition: "Cadmium Sulfide (CdS) or Cadmium Selenide-based colorants",
    description: "Striking transparent yellows with moderate flame sensitivity. Cadmium colors are NOT atmospheric reactive but are heat-sensitive. Must be worked in cool, gentle flames to prevent boiling.",
    neutral: {
      appearance: "Begins to darken; semi-opaque amber",
      metalBehavior: "Cadmium oxide begins to darken with neutral heat",
      risk: "Medium; requires gentle heating to prevent boiling",
      hexColor: "#FFA500",
    },
    oxidizing: {
      appearance: "Transparent golden yellow; bright and clear",
      metalBehavior: "Oxidizing flame preserves bright yellow; prevents darkening",
      risk: "Low; oxidizing is ideal for cadmium yellows",
      hexColor: "#FFD700",
    },
    reducing: {
      appearance: "Darkens to amber/brown; becomes more opaque",
      metalBehavior: "Reduction continues darkening; cadmium becomes opaque",
      risk: "Medium; darkening occurs but no graying like cobalt",
      hexColor: "#CC8800",
    },
  },
  {
    colorFamily: "Heat-sensitive opaques",
    metalComposition: "Cadmium-based opaque with Tin Oxide opacifier",
    description: "Vibrant opaque colors like Poppy orange. Hardly sensitive to flame chemistry but HIGHLY sensitive to excessive heat. Must work in soft, cool flames and heat slowly to prevent boiling and surface scarring.",
    neutral: {
      appearance: "Deep Halloween orange; stable and opaque",
      metalBehavior: "Stable opaque; minimal flame chemistry effect",
      risk: "Medium; heat-sensitive, must work slowly",
      hexColor: "#FF6600",
    },
    oxidizing: {
      appearance: "Bright, vibrant orange; stable and clear",
      metalBehavior: "Oxidizing flame prevents boiling; color remains stable",
      risk: "Low; oxidizing is ideal for heat-sensitive opaques",
      hexColor: "#FF6600",
    },
    reducing: {
      appearance: "Remains stable orange; no significant change",
      metalBehavior: "Flame chemistry has minimal effect; heat is the limiting factor",
      risk: "Medium; heat-sensitive, must work slowly regardless of flame type",
      hexColor: "#FF6600",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="container flex items-center justify-between py-3 md:py-4 px-3 md:px-0">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-16 md:h-24 w-16 md:w-24 object-contain" />
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-amber-500">
              Flame Char
            </a>
            <a href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=25&length=25&width=25" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Editor
            </a>
            <a href="/logs" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-stone-800 rounded transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-amber-400" />
            ) : (
              <Menu className="w-6 h-6 text-amber-400" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-2 px-4 py-3 bg-stone-800 border-t border-amber-700/30 max-h-[calc(100vh-120px)] overflow-y-auto">
            <a
              href="/color-picker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Color
            </a>
            <a
              href="/flame-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-500/40 hover:bg-amber-500/50 text-amber-300 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Flame Char
            </a>
            <a
              href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=25&length=25&width=25"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Reheat Calc
            </a>
            <a
              href="/firing-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Kiln Editor
            </a>
            <a
              href="/logs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Log
            </a>
            <a
              href="/references"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              References
            </a>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-8 md:py-16 px-4 md:px-0">
          <div className="container">
            <h1 className="text-2xl md:text-5xl font-bold text-yellow-400 mb-2 break-words">Flame Characterization</h1>
          </div>
        </section>

        {/* Header Image */}
        <section className="border-b border-white/10">
          <img src="/manus-storage/flamecharheader_b78de537.webp" alt="Flame Characterization Header" className="w-full h-auto object-cover" />
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
                <h2 className="text-2xl font-bold text-yellow-400">The Three Flame Types</h2>
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

            {/* Section 2: Color Families */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => toggleSection("colorFamily")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <h2 className="text-2xl font-bold text-yellow-400">Color Families</h2>
                <ChevronDown
                  className={`w-6 h-6 text-amber-500 transition-transform ${
                    expandedSection === "colorFamily" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === "colorFamily" && (
                <div className="px-6 py-6 border-t border-white/10">
                  <ColorFamilyList colorFamilies={flameEffects} />
                </div>
              )}
            </div>

            {/* Section 3: Interactive Thermochromism Simulator */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => toggleSection("thermochromism")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <h2 className="text-2xl font-bold text-yellow-400">Thermochromism</h2>
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

            {/* Section 4: Color Striking Simulator */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
              <button
                onClick={() => toggleSection("colorStriking")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <h2 className="text-2xl font-bold text-yellow-400">Color Striking</h2>
                <ChevronDown
                  className={`w-6 h-6 text-amber-500 transition-transform ${
                    expandedSection === "colorStriking" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSection === "colorStriking" && (
                <div className="px-6 py-6 border-t border-white/10 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                    <ColorStrikingSimulator />
                  </div>
                  <div className="rounded-2xl border border-stone-700/50 bg-stone-800/50 p-6">
                    <div className="space-y-2 text-sm text-stone-300">
                      <p>
                        <span className="font-semibold text-amber-400">Color Striking</span> is the controlled development of color in sensitive glasses through precise temperature cycling and flame atmosphere control. Different crystal sizes produce different colors — smaller crystals reflect warm tones (yellow, orange), while larger crystals reflect cool tones (blue, green).
                      </p>
                      <p>
                        Use the simulator to explore how heat/cool cycles, flame atmosphere, and temperature ranges affect color development. Each color family has unique striking characteristics based on its metallic colorants and nucleation behavior.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
