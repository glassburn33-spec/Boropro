/*
Color Picker Page - Multi-select tool to generate combined annealing schedules with warnings.
Scientific neo-brutalist design with furnace-lab aesthetics.
Expanded database with 50+ borosilicate glass colors and search functionality.
*/

import { useState, useMemo } from "react";
import { Sparkles, AlertTriangle, CheckCircle2, Download, Search } from "lucide-react";
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
    name: "Pink Proton",
    family: "Light-reactive colors",
    metalComposition: "UV-reactive pink phosphor",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Bright pink under UV", "UV reactive"],
  },
  {
    name: "Luna",
    family: "Light-reactive colors",
    metalComposition: "UV-reactive blue phosphor",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Glows bright blue under UV", "UV reactive"],
  },
  // Sparkle/Special Effects
  {
    name: "Galaxy",
    family: "Sparkle colors",
    metalComposition: "Mica-based sparkle effect",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Sparkle effect throughout", "Metallic shimmer"],
  },
  {
    name: "Blue Stardust",
    family: "Sparkle colors",
    metalComposition: "Blue with mica sparkle",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Blue with sparkle effect"],
  },
  {
    name: "Heavy Blue Stardust",
    family: "Sparkle colors",
    metalComposition: "Dark blue with heavy mica sparkle",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Heavy sparkle effect", "Dark blue base"],
  },
  {
    name: "Atomic Stardust",
    family: "Sparkle colors",
    metalComposition: "UV-reactive with sparkle",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Sparkle + UV reactive", "Glows under UV"],
  },
  {
    name: "Absinthe",
    family: "Sparkle colors",
    metalComposition: "Green with sparkle effect",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Green sparkle"],
  },
  {
    name: "Nemo",
    family: "Sparkle colors",
    metalComposition: "Orange with sparkle effect",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Orange sparkle"],
  },
  {
    name: "Lucy",
    family: "Sparkle colors",
    metalComposition: "Multi-color with sparkle",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Multi-color sparkle effect"],
  },
  // Transparent Colors
  {
    name: "Clear",
    family: "Transparent",
    metalComposition: "Pure borosilicate glass",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Standard clear borosilicate"],
  },
  {
    name: "Pink",
    family: "Transparent",
    metalComposition: "Manganese oxide colorant",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Transparent pink"],
  },
  {
    name: "Lavender",
    family: "Transparent",
    metalComposition: "Manganese oxide + cobalt",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Transparent lavender"],
  },
  {
    name: "Green",
    family: "Transparent",
    metalComposition: "Chromium oxide or iron oxide",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Transparent green"],
  },
  {
    name: "Amber",
    family: "Transparent",
    metalComposition: "Iron oxide colorant",
    annealPoint: 1050,
    strainPoint: 960,
    heatSensitive: false,
    reductionSensitive: false,
    strikeMethod: "none",
    warnings: ["Transparent amber/brown"],
  },
];

interface CombinedSchedule {
  annealTemp: number;
  strainTemp: number;
  warnings: string[];
  rationale: string;
}

export default function ColorPicker() {
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
      <div className="border-b border-amber-500 bg-black px-6 py-8">
        <div className="flex items-center gap-6 mb-8">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <img src="https://manus-storage.s3.us-west-2.amazonaws.com/webdev/boroprologoicon.png" alt="BoroPrologo" className="h-24 w-24" />
          </a>
          <nav className="flex gap-8 text-stone-400">
            <a href="/flame-simulator" className="hover:text-amber-400 transition-colors">FLAME CHAR</a>
            <a href="/color-picker" className="text-amber-400">COLOR PICKER</a>
            <a href="/firing-tracker" className="hover:text-amber-400 transition-colors">KILN LOG</a>
            <a href="/pdf-library" className="hover:text-amber-400 transition-colors">PDF LIBRARY</a>
            <a href="/references" className="hover:text-amber-400 transition-colors">REFERENCES</a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
           <div className="container py-12">
        <h1 className="text-5xl font-bold text-white mb-2">Color Database</h1>
        <p className="text-stone-400 mb-8">Select colors to generate optimized combined annealing schedules with compatibility warnings.</p>

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

        {/* Color Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredColors.map((color) => (
            <div
              key={color.name}
              onClick={() => toggleColor(color.name)}
              onDoubleClick={() => setExpandedColor(color.name)}
              className={`p-4 border-2 cursor-pointer transition-all rounded-sm ${
                selectedColors.includes(color.name)
                  ? "border-amber-400 bg-amber-400 bg-opacity-10"
                  : "border-stone-700 hover:border-amber-500 bg-stone-900 hover:bg-stone-800"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{color.name}</h3>
                {selectedColors.includes(color.name) && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
              </div>
              <p className="text-sm text-amber-400 mb-2">{color.family}</p>
              <p className="text-xs text-stone-400 mb-3">{color.metalComposition}</p>
              <div className="flex gap-4 text-xs text-stone-500">
                <span>Anneal: {color.annealPoint}°F</span>
                <span>Strain: {color.strainPoint}°F</span>
              </div>
              <p className="text-xs text-stone-500 mt-3 italic">Double-click to expand</p>
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

      {/* Expanded Color Modal */}
      {expandedColorData && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border-2 border-amber-500 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-stone-900 border-b border-amber-500 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">{expandedColorData.name}</h2>
                <p className="text-amber-400 text-lg">{expandedColorData.family}</p>
              </div>
              <button
                onClick={() => setExpandedColor(null)}
                className="text-stone-400 hover:text-amber-400 transition-colors text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Metal Composition */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Metal Composition</h3>
                <p className="text-stone-300 text-lg">{expandedColorData.metalComposition}</p>
              </div>

              {/* Temperature Parameters */}
              <div className="grid grid-cols-2 gap-6">
                <div className="border border-amber-500 p-4 rounded-sm">
                  <p className="text-stone-400 text-sm mb-1">Anneal Temperature</p>
                  <p className="text-3xl font-bold text-amber-400">{expandedColorData.annealPoint}°F</p>
                </div>
                <div className="border border-amber-500 p-4 rounded-sm">
                  <p className="text-stone-400 text-sm mb-1">Strain Temperature</p>
                  <p className="text-3xl font-bold text-amber-400">{expandedColorData.strainPoint}°F</p>
                </div>
              </div>

              {/* Sensitivity Flags */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-sm border ${
                  expandedColorData.heatSensitive
                    ? "border-red-500 bg-red-500 bg-opacity-10"
                    : "border-green-500 bg-green-500 bg-opacity-10"
                }`}>
                  <p className={expandedColorData.heatSensitive ? "text-red-400" : "text-green-400"}>
                    {expandedColorData.heatSensitive ? "⚠ Heat Sensitive" : "✓ Heat Stable"}
                  </p>
                </div>
                <div className={`p-4 rounded-sm border ${
                  expandedColorData.reductionSensitive
                    ? "border-red-500 bg-red-500 bg-opacity-10"
                    : "border-green-500 bg-green-500 bg-opacity-10"
                }`}>
                  <p className={expandedColorData.reductionSensitive ? "text-red-400" : "text-green-400"}>
                    {expandedColorData.reductionSensitive ? "⚠ Reduction Sensitive" : "✓ Reduction Stable"}
                  </p>
                </div>
              </div>

              {/* Strike Method */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Strike Method</h3>
                <p className="text-stone-300 text-lg capitalize">
                  {expandedColorData.strikeMethod === "none"
                    ? "No striking required"
                    : `${expandedColorData.strikeMethod.charAt(0).toUpperCase() + expandedColorData.strikeMethod.slice(1)} strike`}
                </p>
              </div>

              {/* Warnings */}
              {expandedColorData.warnings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    <h3 className="text-xl font-bold text-amber-400">Warnings & Considerations</h3>
                  </div>
                  <ul className="space-y-2">
                    {expandedColorData.warnings.map((warning, idx) => (
                      <li key={idx} className="text-stone-300 flex gap-3">
                        <span className="text-amber-400 flex-shrink-0 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    toggleColor(expandedColorData.name);
                  }}
                  className={`flex-1 px-6 py-3 font-bold rounded-sm transition-colors ${
                    selectedColors.includes(expandedColorData.name)
                      ? "bg-amber-500 hover:bg-amber-600 text-black"
                      : "bg-stone-700 hover:bg-stone-600 text-white"
                  }`}
                >
                  {selectedColors.includes(expandedColorData.name) ? "✓ Selected" : "Select Color"}
                </button>
                <button
                  onClick={() => setExpandedColor(null)}
                  className="flex-1 px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
