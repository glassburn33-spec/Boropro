/*
Color Picker Page - Multi-select tool to generate combined annealing schedules with warnings.
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useMemo } from "react";
import { Sparkles, AlertTriangle, CheckCircle2, Download } from "lucide-react";
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
];

interface CombinedSchedule {
  annealTemp: number;
  strainTemp: number;
  warnings: string[];
  rationale: string;
}

export default function ColorPicker() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

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
${combinedSchedule.rationale}

Generated from Borosilicate Kiln Research Platform
`;

    navigator.clipboard.writeText(text);
    alert("Schedule copied to clipboard!");
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
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Simulator
            </a>
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-amber-500">
              Color Picker
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Firing Tracker
            </a>
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              PDF Library
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Interactive tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              Color Picker & Schedule Generator
            </h1>
            <p className="text-lg leading-8 text-stone-300 max-w-3xl">
              Select multiple Northstar colors from your project. The tool generates a combined annealing schedule that accommodates all colors and flags any conflicts or special handling requirements.
            </p>
          </div>
        </section>

        {/* Color Selection */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-8">Select Your Colors</h2>
            <div className="grid md:grid-cols-4 gap-3">
              {northstarColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`px-4 py-3 rounded-lg font-mono text-xs font-bold uppercase transition-all text-left ${
                    selectedColors.includes(color.name)
                      ? "bg-amber-600 text-white border border-amber-500"
                      : "border border-white/20 text-stone-400 hover:border-amber-500 hover:text-amber-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.name)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    <span>{color.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Color Details */}
        {selectedColors.length > 0 && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-8">Selected Colors Details</h2>
              <div className="space-y-4">
                {northstarColors
                  .filter((c) => selectedColors.includes(c.name))
                  .map((color) => (
                    <div key={color.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Color</span>
                          <span className="text-lg font-bold text-white">{color.name}</span>
                          <span className="text-xs text-stone-400 block mt-1">{color.family}</span>
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Metal Composition</span>
                          <span className="text-sm text-stone-300">{color.metalComposition}</span>
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Strike Method</span>
                          <span className="text-sm text-stone-300 capitalize">{color.strikeMethod}</span>
                        </div>
                      </div>
                      {color.warnings.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Warnings</span>
                          <ul className="space-y-1">
                            {color.warnings.map((w, idx) => (
                              <li key={idx} className="text-xs text-stone-300 flex gap-2">
                                <span className="text-amber-500">•</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Combined Schedule */}
        {combinedSchedule && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-8">Generated Combined Schedule</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Anneal Temperature</span>
                    <span className="text-3xl font-bold text-white">{combinedSchedule.annealTemp}°F</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Strain Temperature</span>
                    <span className="text-3xl font-bold text-white">{combinedSchedule.strainTemp}°F</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Cooling Rate</span>
                    <span className="text-3xl font-bold text-white">300°F/hr</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Colors</span>
                    <span className="text-3xl font-bold text-white">{selectedColors.length}</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <p className="text-sm text-stone-300 mb-6">{combinedSchedule.rationale}</p>

                  {combinedSchedule.warnings.length > 0 && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 mb-6">
                      <div className="flex gap-3">
                        <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-mono text-xs font-bold uppercase text-amber-500 mb-3">Important Warnings</h3>
                          <ul className="space-y-2">
                            {combinedSchedule.warnings.map((w, idx) => (
                              <li key={idx} className="text-xs text-stone-300">
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleExport}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors"
                    >
                      <Download size={16} /> Copy Schedule
                    </button>
                    <button
                      onClick={() => {
                        if (!combinedSchedule) return;
                        const pdfData: SchedulePDFData = {
                          title: `Schedule for ${selectedColors.join(", ")}`,
                          colors: selectedColors,
                          annealTemp: combinedSchedule.annealTemp,
                          strainTemp: combinedSchedule.strainTemp,
                          coolingRate: 300,
                          warnings: combinedSchedule.warnings,
                          rationale: combinedSchedule.rationale,
                          generatedDate: new Date().toLocaleDateString(),
                        };
                        const doc = generateSchedulePDF(pdfData);
                        downloadPDF(doc, `boro-schedule-${Date.now()}.pdf`);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 hover:bg-amber-500/20 text-amber-500 font-mono text-xs font-bold uppercase transition-colors"
                    >
                      <Download size={16} /> Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {selectedColors.length === 0 && (
          <section className="py-16">
            <div className="container max-w-6xl">
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <Sparkles size={32} className="text-stone-500 mx-auto mb-4" />
                <p className="text-stone-400">Select colors above to generate a combined annealing schedule.</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-stone-950/50 py-8">
        <div className="container max-w-6xl">
          <p className="text-xs text-stone-500 text-center">
            Color Picker Tool · Part of the Borosilicate Kiln Research Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
