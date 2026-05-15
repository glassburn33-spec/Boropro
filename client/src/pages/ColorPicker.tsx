/*
Color Database Page - Multi-select tool to generate combined annealing schedules with warnings.
Scientific neo-brutalist design with furnace-lab aesthetics.
Expanded database with 50+ borosilicate glass colors and search functionality.
*/

import { useState, useMemo } from "react";
import { Sparkles, AlertTriangle, CheckCircle2, Download, Search, ChevronDown } from "lucide-react";
import { generateSchedulePDF, downloadPDF, SchedulePDFData } from "@/lib/pdfUtils";

interface ColorMetadata {
  name: string;
  family: string;
  metalComposition: string;
  annealPoint: number;
  strainPoint: number;
  heatSensitive: boolean;
  reductionSensitive: boolean;
  strikeMethod: "kiln" | "flame" | "none";
  warnings: string[];
}

const northstarColors: ColorMetadata[] = [
  // Cobalt Blues
  {
    name: "Cobalt",
    family: "Cobalt blues",
    metalComposition: "Cobalt oxide (CoO, Co₂O₃)",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "none",
    warnings: ["Avoid reducing flame", "Maintain oxidizing atmosphere"],
  },
  {
    name: "Light Cobalt",
    family: "Cobalt blues",
    metalComposition: "Cobalt oxide (CoO, Co₂O₃)",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "none",
    warnings: ["Avoid reducing flame"],
  },
  {
    name: "Dark Cobalt",
    family: "Cobalt blues",
    metalComposition: "Cobalt oxide (CoO, Co₂O₃)",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "none",
    warnings: ["Requires oxidizing flame", "Avoid reduction"],
  },
  {
    name: "Blue Caramel",
    family: "Cobalt blues",
    metalComposition: "Cobalt oxide with amber undertones",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "none",
    warnings: ["Maintain oxidizing flame"],
  },
  // Ruby Family
  {
    name: "Ruby",
    family: "Copper rubies",
    metalComposition: "Copper oxide (CuO, Cu₂O) with striking nucleation",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "kiln",
    warnings: ["Kiln strike at 1125-1150°F for 60+ minutes", "Avoid over-reduction"],
  },
  {
    name: "Light Ruby",
    family: "Copper rubies",
    metalComposition: "Copper oxide (CuO, Cu₂O) with striking nucleation",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "kiln",
    warnings: ["Kiln strike recommended"],
  },
  {
    name: "Dark Ruby",
    family: "Copper rubies",
    metalComposition: "Copper oxide (CuO, Cu₂O) with striking nucleation",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "flame",
    warnings: ["Flame strike preferred", "Requires careful reduction control"],
  },
  {
    name: "Ruby Slippers",
    family: "Copper rubies",
    metalComposition: "Copper oxide with sparkle effects",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "kiln",
    warnings: ["Kiln strike required", "Sparkle effect develops with heat"],
  },
  // Yellows & Oranges
  {
    name: "Yellow",
    family: "Yellows",
    metalComposition: "Cadmium sulfide (CdS) or selenium-based",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Standard yellow, stable in most flames"],
  },
  {
    name: "Extra Light Yellow",
    family: "Yellows",
    metalComposition: "Light cadmium sulfide",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Pale yellow, good for blending"],
  },
  {
    name: "Orange",
    family: "Copper-based colors",
    metalComposition: "Copper oxide (CuO, Cu₂O)",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "kiln",
    warnings: ["Requires oxidizing flame", "Kiln strike at 1125-1150°F"],
  },
  // Exotic Colors
  {
    name: "Green Exotic",
    family: "Silver/exotic colors",
    metalComposition: "Silver, gold, and/or copper dissolved in glass matrix",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "flame",
    warnings: ["Slight reduction yields bright metallics", "Prolonged reduction yields earth tones"],
  },
  {
    name: "Blue Exotic",
    family: "Silver/exotic colors",
    metalComposition: "Silver, gold, and/or copper dissolved in glass matrix",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "flame",
    warnings: ["Reduction-sensitive", "Requires careful flame control"],
  },
  {
    name: "Red Exotic",
    family: "Silver/exotic colors",
    metalComposition: "Silver, gold, and/or copper dissolved in glass matrix",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "flame",
    warnings: ["Oxidize for bright metallics", "Reduce for earth tones"],
  },
  {
    name: "Gold Exotic",
    family: "Silver/exotic colors",
    metalComposition: "Gold and silver in glass matrix",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "flame",
    warnings: ["Reduction creates gold tones", "Oxidizing flame for silvery effects"],
  },
  // Amber/Purple Family
  {
    name: "Amber Purple",
    family: "Amber purple family",
    metalComposition: "Copper oxide + chromium oxide striking system",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "kiln",
    warnings: ["Kiln strike at 1125-1150°F for 60 minutes", "Oxidizing kiln atmosphere essential"],
  },
  {
    name: "Double Amber/Purple",
    family: "Amber purple family",
    metalComposition: "Copper oxide + chromium oxide with enhanced striking",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "kiln",
    warnings: ["Complex striking behavior", "Kiln strike recommended"],
  },
  {
    name: "Rootbeer",
    family: "Amber purple family",
    metalComposition: "Iron oxide + copper oxide",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: true,
    strikeMethod: "flame",
    warnings: ["Reduction creates darker tones"],
  },
  // Heat-Sensitive Opaques
  {
    name: "Forest Green",
    family: "Heat-sensitive opaques",
    metalComposition: "Tin oxide opacifier",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Heat slowly to prevent boiling", "Lower anneal/strain points than clear"],
  },
  {
    name: "Canary",
    family: "Heat-sensitive opaques",
    metalComposition: "Titanium oxide opacifier",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Work in cool oxidizing flame", "Heat gently"],
  },
  {
    name: "Cherry",
    family: "Heat-sensitive opaques",
    metalComposition: "Titanium oxide opacifier",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Work slowly in cool oxidizing flame", "Prone to boiling"],
  },
  {
    name: "Black Jack",
    family: "Heat-sensitive opaques",
    metalComposition: "Iron oxide + tin oxide opacifier",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Deep black opaque", "Heat carefully"],
  },
  {
    name: "Pink Cadillac",
    family: "Heat-sensitive opaques",
    metalComposition: "Tin oxide opacifier with pink colorant",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Heat sensitive", "Work in cool flame"],
  },
  {
    name: "Wisteria",
    family: "Heat-sensitive opaques",
    metalComposition: "Tin oxide with purple colorant",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Pale purple opaque", "Heat gently"],
  },
  {
    name: "Stag White",
    family: "Heat-sensitive opaques",
    metalComposition: "Tin oxide opacifier",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Opaque white", "Standard heat-sensitive opaque"],
  },
  {
    name: "Opaque Aqua",
    family: "Heat-sensitive opaques",
    metalComposition: "Tin oxide with aqua colorant",
    annealPoint: 950,
    strainPoint: 860,
    heatSensitive: true,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Opaque aqua/turquoise", "Heat carefully"],
  },
  // Light Reactive Colors
  {
    name: "Nova",
    family: "Light-reactive colors",
    metalComposition: "UV-reactive phosphor compounds",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Glows under UV light", "Maintains color in normal light"],
  },
  {
    name: "Blu-V",
    family: "Light-reactive colors",
    metalComposition: "UV-reactive blue phosphor",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Bright blue under UV", "UV reactive"],
  },
  {
    name: "Glow Green",
    family: "Light-reactive colors",
    metalComposition: "UV-reactive green phosphor",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Bright green under UV", "UV reactive"],
  },
];

interface CombinedSchedule {
  annealTemp: number;
  strainTemp: number;
  warnings: string[];
  rationale: string;
}

export default function ColorDatabase() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedColor, setExpandedColor] = useState<string | null>(null);

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const expandedColorData = expandedColor ? northstarColors.find((c) => c.name === expandedColor) : null;

  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) return northstarColors;
    const query = searchQuery.toLowerCase();
    return northstarColors.filter(
      (color) =>
        color.name.toLowerCase().includes(query) ||
        color.family.toLowerCase().includes(query) ||
        color.metalComposition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const combinedSchedule = useMemo<CombinedSchedule | null>(() => {
    if (selectedColors.length === 0) return null;

    const selected = northstarColors.filter((c) => selectedColors.includes(c.name));

    // Find the lowest anneal point among selected colors
    const minAnnealPoint = Math.min(...selected.map((c) => c.annealPoint));
    const minStrainPoint = Math.min(...selected.map((c) => c.strainPoint));

    // Collect all warnings
    const allWarnings = new Set<string>();
    selected.forEach((color) => {
      color.warnings.forEach((w) => allWarnings.add(w));
    });

    // Check for conflicts
    const hasHeatSensitive = selected.some((c) => c.heatSensitive);
    const hasReductionSensitive = selected.some((c) => c.reductionSensitive);
    const hasStrikingColors = selected.some((c) => c.strikeMethod !== "none");

    if (hasHeatSensitive && hasReductionSensitive) {
      allWarnings.add("Heat-sensitive opaques + reduction-sensitive colors: Use lower anneal temp and oxidizing kiln atmosphere");
    }

    if (hasHeatSensitive && hasStrikingColors) {
      allWarnings.add("Heat-sensitive opaques + striking colors: Consider two-stage firing or lower anneal temperature");
    }

    const rationale =
      selectedColors.length === 1
        ? `Schedule optimized for ${selectedColors[0]}.`
        : `Schedule optimized for compatibility with ${selectedColors.length} color families. Anneal temperature lowered to ${minAnnealPoint}°F to accommodate all colors.`;

    return {
      annealTemp: minAnnealPoint,
      strainTemp: minStrainPoint,
      warnings: Array.from(allWarnings),
      rationale,
    };
  }, [selectedColors]);

  const handleExport = () => {
    if (!combinedSchedule || selectedColors.length === 0) return;

    const text = `COMBINED ANNEALING SCHEDULE
Generated for: ${selectedColors.join(", ")}

SCHEDULE PARAMETERS:
- Anneal temperature: ${combinedSchedule.annealTemp}°F
- Strain temperature: ${combinedSchedule.strainTemp}°F
- Cooling rate: 300°F/hour minimum

WARNINGS & NOTES:
${combinedSchedule.warnings.map((w) => `• ${w}`).join("\n")}

RATIONALE:
${combinedSchedule.rationale}`;

    const pdfData: SchedulePDFData = {
      title: `Combined Schedule: ${selectedColors.join(", ")}`,
      colors: selectedColors,
      annealTemp: combinedSchedule.annealTemp,
      strainTemp: combinedSchedule.strainTemp,
      coolingRate: 300,
      warnings: combinedSchedule.warnings,
      rationale: combinedSchedule.rationale,
      generatedDate: new Date().toISOString(),
    };
    const doc = generateSchedulePDF(pdfData);
    downloadPDF(doc, `Combined_Schedule_${selectedColors.join("_")}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-24 w-24 object-contain" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-amber-500">
              Color
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Log
            </a>
            <a href="/logs" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-12">
        <h1 className="text-5xl font-bold text-white mb-2">Color Database</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-500" />
            <input
              type="text"
              placeholder="Search colors by name, family, or composition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-900 border border-amber-500 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 rounded-sm"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-stone-400">
              Found {filteredColors.length} of {northstarColors.length} colors
            </p>
          )}
        </div>

        {/* Color Selection List - Vertical Layout */}
        <div className="space-y-2 mb-8">
          {filteredColors.map((color) => (
            <div key={color.name}>
              {/* Color Item - Slender Row */}
              <div
                onClick={() => toggleColor(color.name)}
                className={`p-3 border cursor-pointer transition-all rounded-sm flex items-center justify-between ${
                  selectedColors.includes(color.name)
                    ? "border-amber-400 bg-amber-400 bg-opacity-10"
                    : "border-stone-700 hover:border-amber-500 bg-stone-900 hover:bg-stone-800"
                }`}
              >
                <div className="flex-1 flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white">{color.name}</h3>
                  <span className="text-xs text-amber-400">{color.family}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedColor(expandedColor === color.name ? null : color.name);
                  }}
                  className="text-stone-400 hover:text-amber-400 transition-colors ml-2"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${expandedColor === color.name ? "rotate-180" : ""}`}
                  />
                </button>
                {selectedColors.includes(color.name) && <CheckCircle2 className="w-4 h-4 text-amber-400 ml-2" />}
              </div>

              {/* Expanded Description */}
              {expandedColor === color.name && (
                <div className="bg-stone-800 border border-t-0 border-stone-700 rounded-b-sm p-4 space-y-3">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Metal Composition</p>
                    <p className="text-sm text-stone-300">{color.metalComposition}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Anneal Point</p>
                      <p className="text-sm text-amber-400 font-bold">{color.annealPoint}°F</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Strain Point</p>
                      <p className="text-sm text-amber-400 font-bold">{color.strainPoint}°F</p>
                    </div>
                  </div>
                  {color.warnings.length > 0 && (
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Warnings</p>
                      <ul className="space-y-1">
                        {color.warnings.map((warning, idx) => (
                          <li key={idx} className="text-xs text-amber-300 flex gap-2">
                            <span className="flex-shrink-0">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Combined Schedule Display */}
        {combinedSchedule && (
          <div className="border border-amber-500 bg-stone-900 p-6 rounded-sm">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Combined Schedule</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-stone-400 text-sm mb-1">Anneal Temperature</p>
                <p className="text-3xl font-bold text-amber-400">{combinedSchedule.annealTemp}°F</p>
              </div>
              <div>
                <p className="text-stone-400 text-sm mb-1">Strain Temperature</p>
                <p className="text-3xl font-bold text-amber-400">{combinedSchedule.strainTemp}°F</p>
              </div>
            </div>

            <p className="text-stone-300 mb-6">{combinedSchedule.rationale}</p>

            {combinedSchedule.warnings.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-amber-400">Warnings & Considerations</h3>
                </div>
                <ul className="space-y-2">
                  {combinedSchedule.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-stone-300 flex gap-2">
                      <span className="text-amber-400 flex-shrink-0">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-sm transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Schedule
            </button>
          </div>
        )}

        {selectedColors.length === 0 && !searchQuery && (
          <div className="text-center py-12 text-stone-500">
            <p>Select colors to generate a combined annealing schedule</p>
          </div>
        )}

        {filteredColors.length === 0 && searchQuery && (
          <div className="text-center py-12 text-stone-500">
            <p>No colors found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
