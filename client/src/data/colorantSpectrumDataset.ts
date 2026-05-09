// Color Spectrum Bars Dataset
// Temperature-responsive hue data for all colorants in BoroPro
// All data sourced from existing app content: glass_colors.ts, colors.ts, ColorScienceTab.tsx, ThermochromismSimulator.tsx

export interface TemperatureHuePoint {
  temp: number; // Temperature in Celsius
  hue: string; // CSS color value (hex or rgb)
  description: string; // Human-readable color name
}

export interface ColorantSpectrum {
  id: string;
  name: string;
  chemistry: string; // Metal oxide formula
  family: string; // Color family
  minTemp: number; // Minimum temperature (°C)
  maxTemp: number; // Maximum temperature (°C)
  huePoints: TemperatureHuePoint[]; // Temperature-hue mapping
  strikingTemp?: number; // Striking temperature if applicable (°C)
  specialBehavior?: string; // Notes on atmosphere sensitivity, fading, etc.
  dataSource: string; // Where this data came from in the app
}

export const colorantSpectra: ColorantSpectrum[] = [
  // ============ COBALT BLUE ============
  {
    id: "cobalt-blue",
    name: "Cobalt Blue",
    chemistry: "CoO / Co₂O₃",
    family: "blues",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#1a3a6e", description: "Deep royal blue" },
      { temp: 300, hue: "#1a3a6e", description: "Deep royal blue" },
      { temp: 566, hue: "#1a3a6e", description: "Deep royal blue (annealing)" },
      { temp: 820, hue: "#1a3a6e", description: "Deep royal blue (softening point)" },
      { temp: 1149, hue: "#2a4a7e", description: "Slight lightening" },
      { temp: 1220, hue: "#3a5a8e", description: "Pale steel blue (working temp)" },
    ],
    specialBehavior: "Stable color. Slight softening and lightening at high temperatures. Not sensitive to flame atmosphere.",
    dataSource: "glass_colors.ts (Northstar/Glass Alchemy/TAG Cobalt), colors.ts (CoO), ThermochromismSimulator.tsx",
  },

  // ============ COPPER RUBY ============
  {
    id: "copper-ruby",
    name: "Copper Ruby",
    chemistry: "Cu₂O (reduction)",
    family: "reds",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#e8f4f8", description: "Pale green/clear" },
      { temp: 300, hue: "#e8f4f8", description: "Pale green/clear" },
      { temp: 454, hue: "#e8f4f8", description: "Pale green/clear (pre-strike)" },
      { temp: 510, hue: "#c41e3a", description: "Deep ruby red (striking begins)" },
      { temp: 566, hue: "#c41e3a", description: "Deep ruby red (annealing)" },
      { temp: 1149, hue: "#b21e2e", description: "Deep ruby (working range)" },
      { temp: 1220, hue: "#b21e2e", description: "Deep ruby (fully struck)" },
    ],
    strikingTemp: 510,
    specialBehavior: "Striking color. Requires reducing atmosphere. Strikes on reheating. Reduction-sensitive.",
    dataSource: "glass_colors.ts (TAG Red Blizzard, Northstar Tan Silver Creek), colors.ts (Cu₂O), ColorScienceTab.tsx",
  },

  // ============ COPPER GREEN ============
  {
    id: "copper-green",
    name: "Copper Green",
    chemistry: "CuO (oxidation)",
    family: "greens",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#20b2aa", description: "Teal/turquoise" },
      { temp: 300, hue: "#20b2aa", description: "Teal/turquoise" },
      { temp: 566, hue: "#20b2aa", description: "Teal/turquoise (annealing)" },
      { temp: 820, hue: "#3d7d6d", description: "Olive-green (softening point)" },
      { temp: 1149, hue: "#556b2f", description: "Brown-green (working)" },
      { temp: 1220, hue: "#6b8e23", description: "Brown-green (high temp)" },
    ],
    specialBehavior: "Atmosphere-sensitive. Oxidation produces green, reduction produces different hues.",
    dataSource: "glass_colors.ts (Glass Alchemy Copper-1, TAG Copper), colors.ts (CuO), ColorScienceTab.tsx",
  },

  // ============ GOLD RUBY ============
  {
    id: "gold-ruby",
    name: "Gold Ruby",
    chemistry: "Au (colloidal)",
    family: "purples",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#fffacd", description: "Pale straw/clear" },
      { temp: 300, hue: "#fffacd", description: "Pale straw/clear" },
      { temp: 454, hue: "#fffacd", description: "Pale straw (pre-strike)" },
      { temp: 482, hue: "#dc143c", description: "Cranberry red (striking begins)" },
      { temp: 510, hue: "#c41e3a", description: "Deep cranberry red (fully struck)" },
      { temp: 566, hue: "#c41e3a", description: "Deep cranberry (annealing)" },
      { temp: 1149, hue: "#8b4545", description: "Faded gray-red (over-strike)" },
      { temp: 1220, hue: "#808080", description: "Gray (burnout)" },
    ],
    strikingTemp: 482,
    specialBehavior: "Striking color. Over-strike fades to gray. Heat-sensitive. Lower annealing temp recommended (1000°F/538°C).",
    dataSource: "colors.ts (Gold compounds - Amber Purple), ColorScienceTab.tsx",
  },

  // ============ SILVER YELLOW ============
  {
    id: "silver-yellow",
    name: "Silver Yellow",
    chemistry: "Ag (nanoparticles)",
    family: "yellows",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#fffacd", description: "Clear/pale yellow" },
      { temp: 300, hue: "#fffacd", description: "Clear/pale yellow" },
      { temp: 454, hue: "#fffacd", description: "Pale yellow (pre-strike)" },
      { temp: 482, hue: "#ffa500", description: "Amber (striking begins)" },
      { temp: 510, hue: "#ff8c00", description: "Deep gold (fully struck)" },
      { temp: 566, hue: "#ff8c00", description: "Deep gold (annealing)" },
      { temp: 1149, hue: "#cc7000", description: "Darkened gold (working)" },
      { temp: 1220, hue: "#b35900", description: "Very dark gold (high temp)" },
    ],
    strikingTemp: 482,
    specialBehavior: "Darkens progressively with heat. Striking color. Requires careful temperature management.",
    dataSource: "colors.ts (Silver compounds), ColorScienceTab.tsx",
  },

  // ============ IRON AMBER ============
  {
    id: "iron-amber",
    name: "Iron Amber",
    chemistry: "Fe₂O₃ / FeO",
    family: "ambers",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#fffacd", description: "Pale yellow-green" },
      { temp: 300, hue: "#fffacd", description: "Pale yellow-green" },
      { temp: 566, hue: "#ffd700", description: "Yellow (annealing)" },
      { temp: 820, hue: "#ffb347", description: "Amber (softening point)" },
      { temp: 1149, hue: "#ff8c00", description: "Deep amber (working)" },
      { temp: 1220, hue: "#8b4513", description: "Brown (high temp, Fe²⁺ oxidation)" },
    ],
    specialBehavior: "Redox state shifts hue. FeO (blue-green) vs Fe₂O₃ (amber/brown). Temperature affects oxidation state.",
    dataSource: "ColorScienceTab.tsx (Iron Fe²⁺/Fe³⁺), Amber Glass section",
  },

  // ============ MANGANESE PURPLE ============
  {
    id: "manganese-purple",
    name: "Manganese Purple",
    chemistry: "MnO₂",
    family: "purples",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#e6d5e8", description: "Pale lavender" },
      { temp: 300, hue: "#e6d5e8", description: "Pale lavender" },
      { temp: 566, hue: "#9370db", description: "Purple (annealing)" },
      { temp: 820, hue: "#8b008b", description: "Deep amethyst (softening)" },
      { temp: 1149, hue: "#8b008b", description: "Deep amethyst (working)" },
      { temp: 1220, hue: "#f0f8ff", description: "Fades to colorless (very high temp)" },
    ],
    specialBehavior: "Fades to colorless at very high temperatures. Also used as decolorizer in ancient glass.",
    dataSource: "ColorScienceTab.tsx (Manganese), Roman glass historical data",
  },

  // ============ CHROMIUM GREEN ============
  {
    id: "chromium-green",
    name: "Chromium Green",
    chemistry: "Cr₂O₃",
    family: "greens",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#50c878", description: "Bright emerald" },
      { temp: 300, hue: "#50c878", description: "Bright emerald" },
      { temp: 566, hue: "#50c878", description: "Emerald (annealing)" },
      { temp: 820, hue: "#228b22", description: "Forest green (softening)" },
      { temp: 1149, hue: "#1a5c1a", description: "Olive/dark green (working)" },
      { temp: 1220, hue: "#0d3d0d", description: "Very dark green (high temp)" },
    ],
    specialBehavior: "Very stable. Darkens at high temperature. Consistent across temperature range.",
    dataSource: "colors.ts (Chromium oxide), ColorScienceTab.tsx",
  },

  // ============ NICKEL GRAY ============
  {
    id: "nickel-gray",
    name: "Nickel Gray",
    chemistry: "NiO",
    family: "grays",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#d3d3d3", description: "Pale gray" },
      { temp: 300, hue: "#d3d3d3", description: "Pale gray" },
      { temp: 566, hue: "#a9a9a9", description: "Gray (annealing)" },
      { temp: 820, hue: "#808080", description: "Medium gray (softening)" },
      { temp: 1149, hue: "#696969", description: "Brown-gray (working)" },
      { temp: 1220, hue: "#5d5d5d", description: "Dark brown-gray (high temp)" },
    ],
    specialBehavior: "Hue depends on base glass chemistry. Moderate temperature sensitivity.",
    dataSource: "ColorScienceTab.tsx (Nickel)",
  },

  // ============ RARE EARTH - NEODYMIUM ============
  {
    id: "neodymium",
    name: "Rare Earth - Neodymium",
    chemistry: "Nd₂O₃",
    family: "exotics",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#c8a2c8", description: "Lavender/violet" },
      { temp: 300, hue: "#c8a2c8", description: "Lavender/violet" },
      { temp: 566, hue: "#c8a2c8", description: "Lavender (annealing)" },
      { temp: 820, hue: "#db7093", description: "Rosy pink (softening)" },
      { temp: 1149, hue: "#ff69b4", description: "Hot pink (working)" },
      { temp: 1220, hue: "#ff1493", description: "Deep pink (high temp)" },
    ],
    specialBehavior: "Alexandrite effect. Shifts under different light types. Rare earth dopant.",
    dataSource: "ColorScienceTab.tsx (Rare Earth - Neodymium)",
  },

  // ============ URANIUM GREEN ============
  {
    id: "uranium-green",
    name: "Uranium Green",
    chemistry: "UO₂",
    family: "greens",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#7fff00", description: "Bright yellow-green" },
      { temp: 300, hue: "#7fff00", description: "Bright yellow-green" },
      { temp: 566, hue: "#7fff00", description: "Yellow-green (annealing)" },
      { temp: 820, hue: "#32cd32", description: "Lime green (softening)" },
      { temp: 1149, hue: "#228b22", description: "Forest green (working)" },
      { temp: 1220, hue: "#1a5c1a", description: "Deep chartreuse (high temp)" },
    ],
    specialBehavior: "Fluorescent under UV. Bright and distinctive. Safety data from app if present.",
    dataSource: "ColorScienceTab.tsx (Uranium)",
  },

  // ============ SILVER EXOTIC (REDUCTION-SENSITIVE) ============
  {
    id: "silver-exotic",
    name: "Silver Exotic",
    chemistry: "Ag (nanoparticles)",
    family: "exotics",
    minTemp: 20,
    maxTemp: 1220,
    huePoints: [
      { temp: 20, hue: "#e8f4f8", description: "Clear/pale" },
      { temp: 300, hue: "#e8f4f8", description: "Clear/pale" },
      { temp: 566, hue: "#b0c4de", description: "Light steel blue (annealing, oxidizing)" },
      { temp: 820, hue: "#4169e1", description: "Royal blue (softening, oxidizing)" },
      { temp: 1149, hue: "#1e90ff", description: "Bright blue (working, oxidizing)" },
      { temp: 1220, hue: "#808080", description: "Gray (high temp, reducing)" },
    ],
    specialBehavior: "Striking color. Reduction-sensitive. Develops iridescent effects in reduction. Atmosphere-dependent.",
    dataSource: "glass_colors.ts (Northstar Blue Thunder, Silver Amethyst), colors.ts (Silver exotic)",
  },
];

// Helper function to interpolate hue between two temperature points
export function interpolateHue(
  spectrum: ColorantSpectrum,
  tempC: number
): { hue: string; description: string } {
  // Clamp temperature to spectrum range
  if (tempC <= spectrum.minTemp) {
    return spectrum.huePoints[0];
  }
  if (tempC >= spectrum.maxTemp) {
    return spectrum.huePoints[spectrum.huePoints.length - 1];
  }

  // Find the two surrounding points
  for (let i = 0; i < spectrum.huePoints.length - 1; i++) {
    const current = spectrum.huePoints[i];
    const next = spectrum.huePoints[i + 1];

    if (tempC >= current.temp && tempC <= next.temp) {
      // Linear interpolation between points
      const ratio = (tempC - current.temp) / (next.temp - current.temp);
      
      // Parse hex colors and interpolate RGB values
      const currentRGB = hexToRgb(current.hue);
      const nextRGB = hexToRgb(next.hue);

      if (currentRGB && nextRGB) {
        const r = Math.round(currentRGB.r + (nextRGB.r - currentRGB.r) * ratio);
        const g = Math.round(currentRGB.g + (nextRGB.g - currentRGB.g) * ratio);
        const b = Math.round(currentRGB.b + (nextRGB.b - currentRGB.b) * ratio);

        return {
          hue: `rgb(${r}, ${g}, ${b})`,
          description: `${current.description} → ${next.description}`,
        };
      }

      // Fallback if hex parsing fails
      return current;
    }
  }

  return spectrum.huePoints[spectrum.huePoints.length - 1];
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper function to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}
