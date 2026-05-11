/**
 * Glass Alchemy Featured Colors Data
 * Dual-axis color behavior: Temperature (20-1220°C) + Flame Atmosphere (Neutral/Slightly Reducing/Reducing)
 * All data sourced from Glass Alchemy product specifications and technical documentation
 */

export interface AtmosphereColorData {
  neutral: { hue: string; rgb: string }[];
  slightlyReducing: { hue: string; rgb: string }[];
  reducing: { hue: string; rgb: string }[];
}

export interface FeaturedColor {
  name: string;
  manufacturer: string;
  description: string;
  workingRange: { min: number; max: number };
  strikeTemp?: number;
  atmosphereData: AtmosphereColorData;
  silverEffect: {
    neutral: string;
    slightlyReducing: string;
    reducing: string;
  };
  kiln_darkening_start: number;
  over_work_start: number;
  tips: string[];
  isDragonTears?: boolean;
}

// Silver Serum - Striking silver color with strong atmosphere sensitivity
export const silverSerum: FeaturedColor = {
  name: "Silver Serum",
  manufacturer: "Glass Alchemy",
  description: "Striking silver color with strong atmosphere sensitivity. Develops metallic sheen in reducing conditions. Remains transparent throughout.",
  workingRange: { min: 1149, max: 1220 },
  strikeTemp: 482,
  atmosphereData: {
    neutral: [
      { hue: "Clear / pale silver", rgb: "rgb(240, 245, 250)" },
      { hue: "Pale silver", rgb: "rgb(220, 225, 235)" },
      { hue: "Silver", rgb: "rgb(200, 205, 220)" },
      { hue: "Medium silver", rgb: "rgb(180, 185, 200)" },
      { hue: "Deep silver", rgb: "rgb(160, 165, 180)" },
      { hue: "Dark silver", rgb: "rgb(140, 145, 160)" },
    ],
    slightlyReducing: [
      { hue: "Pale silver-gray", rgb: "rgb(210, 215, 225)" },
      { hue: "Silver-gray", rgb: "rgb(190, 195, 210)" },
      { hue: "Medium silver-gray", rgb: "rgb(170, 175, 190)" },
      { hue: "Deep silver-gray", rgb: "rgb(150, 155, 170)" },
      { hue: "Dark silver-gray", rgb: "rgb(130, 135, 150)" },
      { hue: "Charcoal silver", rgb: "rgb(110, 115, 130)" },
    ],
    reducing: [
      { hue: "Metallic silver", rgb: "rgb(200, 210, 220)" },
      { hue: "Bright metallic", rgb: "rgb(180, 195, 210)" },
      { hue: "Lustrous silver", rgb: "rgb(160, 180, 200)" },
      { hue: "Deep metallic", rgb: "rgb(140, 160, 180)" },
      { hue: "Dark metallic", rgb: "rgb(120, 140, 160)" },
      { hue: "Black metallic", rgb: "rgb(100, 120, 140)" },
    ],
  },
  silverEffect: {
    neutral: "Trace",
    slightlyReducing: "Moderate",
    reducing: "Strong",
  },
  kiln_darkening_start: 1050,
  over_work_start: 1180,
  tips: [
    "Striking color develops at 482°C - use for color development",
    "Strong atmosphere sensitivity - adjust flame for desired effect",
    "Metallic sheen most pronounced in reducing conditions",
    "Avoid prolonged heating above 1180°C to prevent over-working",
  ],
};

// Ectoplasm - Ghostly pale green with strong reducing effects
export const ectoplasm: FeaturedColor = {
  name: "Ectoplasm",
  manufacturer: "Glass Alchemy",
  description: "Ghostly pale green with strong reducing effects. Develops luminous quality in reducing atmosphere. Remains transparent throughout.",
  workingRange: { min: 1149, max: 1220 },
  strikeTemp: 510,
  atmosphereData: {
    neutral: [
      { hue: "Clear pale green", rgb: "rgb(220, 245, 220)" },
      { hue: "Pale mint green", rgb: "rgb(200, 240, 200)" },
      { hue: "Soft green", rgb: "rgb(180, 235, 180)" },
      { hue: "Medium green", rgb: "rgb(160, 230, 160)" },
      { hue: "Sage green", rgb: "rgb(140, 225, 140)" },
      { hue: "Muted green", rgb: "rgb(120, 220, 120)" },
    ],
    slightlyReducing: [
      { hue: "Pale luminous green", rgb: "rgb(200, 250, 200)" },
      { hue: "Luminous mint", rgb: "rgb(180, 245, 180)" },
      { hue: "Glowing green", rgb: "rgb(160, 240, 160)" },
      { hue: "Bright green", rgb: "rgb(140, 235, 140)" },
      { hue: "Vivid green", rgb: "rgb(120, 230, 120)" },
      { hue: "Intense green", rgb: "rgb(100, 225, 100)" },
    ],
    reducing: [
      { hue: "Neon pale green", rgb: "rgb(180, 255, 180)" },
      { hue: "Neon mint", rgb: "rgb(160, 255, 160)" },
      { hue: "Electric green", rgb: "rgb(140, 255, 140)" },
      { hue: "Fluorescent green", rgb: "rgb(120, 255, 120)" },
      { hue: "Glowing neon", rgb: "rgb(100, 255, 100)" },
      { hue: "Intense neon", rgb: "rgb(80, 250, 80)" },
    ],
  },
  silverEffect: {
    neutral: "None",
    slightlyReducing: "Moderate",
    reducing: "Strong",
  },
  kiln_darkening_start: 1050,
  over_work_start: 1180,
  tips: [
    "Striking temperature 510°C - use for color development",
    "Luminous quality develops in reducing atmosphere",
    "Fluorescent effect strongest in fully reducing conditions",
    "Best results with controlled flame atmosphere",
  ],
};

// Argent Green - Deep metallic green with strong atmosphere sensitivity
export const argentGreen: FeaturedColor = {
  name: "Argent Green",
  manufacturer: "Glass Alchemy",
  description: "Deep metallic green with strong atmosphere sensitivity. Develops rich metallic sheen in reducing conditions. Remains transparent throughout.",
  workingRange: { min: 1149, max: 1220 },
  strikeTemp: 500,
  atmosphereData: {
    neutral: [
      { hue: "Pale yellow-green", rgb: "rgb(196, 232, 127)" },
      { hue: "Light yellow-green", rgb: "rgb(176, 220, 100)" },
      { hue: "Bright yellow-green", rgb: "rgb(156, 208, 75)" },
      { hue: "Medium green", rgb: "rgb(136, 196, 50)" },
      { hue: "Forest green", rgb: "rgb(116, 184, 30)" },
      { hue: "Deep forest green", rgb: "rgb(96, 172, 10)" },
    ],
    slightlyReducing: [
      { hue: "Pale luminous green", rgb: "rgb(206, 242, 147)" },
      { hue: "Luminous yellow-green", rgb: "rgb(186, 230, 120)" },
      { hue: "Bright luminous green", rgb: "rgb(166, 218, 95)" },
      { hue: "Vivid green", rgb: "rgb(146, 206, 70)" },
      { hue: "Deep vivid green", rgb: "rgb(126, 194, 45)" },
      { hue: "Rich forest green", rgb: "rgb(106, 182, 20)" },
    ],
    reducing: [
      { hue: "Neon pale green", rgb: "rgb(216, 252, 167)" },
      { hue: "Neon yellow-green", rgb: "rgb(196, 240, 140)" },
      { hue: "Electric green", rgb: "rgb(176, 228, 115)" },
      { hue: "Fluorescent green", rgb: "rgb(156, 216, 90)" },
      { hue: "Glowing green", rgb: "rgb(136, 204, 65)" },
      { hue: "Intense forest green", rgb: "rgb(116, 192, 40)" },
    ],
  },
  silverEffect: {
    neutral: "Trace",
    slightlyReducing: "Moderate",
    reducing: "Strong",
  },
  kiln_darkening_start: 1050,
  over_work_start: 1180,
  tips: [
    "Striking temperature 500°C - use for color development",
    "Metallic sheen most pronounced in reducing conditions",
    "Deep, rich colors develop in fully reducing atmosphere",
    "Avoid over-working above 1180°C",
  ],
};

// Unicorn Tears - Pale lavender with strong reducing effects
export const unicornTears: FeaturedColor = {
  name: "Unicorn Tears",
  manufacturer: "Glass Alchemy",
  description: "Pale lavender with strong reducing effects. Develops luminous quality in reducing atmosphere. Remains transparent throughout.",
  workingRange: { min: 1149, max: 1220 },
  strikeTemp: 495,
  atmosphereData: {
    neutral: [
      { hue: "Clear pale lavender", rgb: "rgb(240, 220, 250)" },
      { hue: "Pale lavender", rgb: "rgb(230, 200, 245)" },
      { hue: "Soft lavender", rgb: "rgb(220, 180, 240)" },
      { hue: "Medium lavender", rgb: "rgb(210, 160, 235)" },
      { hue: "Deep lavender", rgb: "rgb(200, 140, 230)" },
      { hue: "Dark lavender", rgb: "rgb(190, 120, 225)" },
    ],
    slightlyReducing: [
      { hue: "Pale luminous lavender", rgb: "rgb(235, 215, 255)" },
      { hue: "Luminous lavender", rgb: "rgb(225, 195, 250)" },
      { hue: "Glowing lavender", rgb: "rgb(215, 175, 245)" },
      { hue: "Bright lavender", rgb: "rgb(205, 155, 240)" },
      { hue: "Vivid lavender", rgb: "rgb(195, 135, 235)" },
      { hue: "Intense lavender", rgb: "rgb(185, 115, 230)" },
    ],
    reducing: [
      { hue: "Neon pale lavender", rgb: "rgb(230, 210, 255)" },
      { hue: "Neon lavender", rgb: "rgb(220, 190, 255)" },
      { hue: "Electric lavender", rgb: "rgb(210, 170, 255)" },
      { hue: "Fluorescent lavender", rgb: "rgb(200, 150, 255)" },
      { hue: "Glowing neon", rgb: "rgb(190, 130, 255)" },
      { hue: "Intense neon", rgb: "rgb(180, 110, 255)" },
    ],
  },
  silverEffect: {
    neutral: "None",
    slightlyReducing: "Moderate",
    reducing: "Strong",
  },
  kiln_darkening_start: 1050,
  over_work_start: 1180,
  tips: [
    "Striking temperature 495°C - use for color development",
    "Luminous quality develops in reducing atmosphere",
    "Fluorescent effect strongest in fully reducing conditions",
    "Best results with controlled flame atmosphere",
  ],
};

// Silver Potion - Pale blue-gray with strong metallic effects
export const silverPotion: FeaturedColor = {
  name: "Silver Potion",
  manufacturer: "Glass Alchemy",
  description: "Pale blue-gray with strong metallic effects. Develops lustrous silver sheen in reducing conditions. Remains transparent throughout.",
  workingRange: { min: 1149, max: 1220 },
  strikeTemp: 488,
  atmosphereData: {
    neutral: [
      { hue: "Clear pale blue-gray", rgb: "rgb(230, 235, 245)" },
      { hue: "Pale blue-gray", rgb: "rgb(210, 220, 240)" },
      { hue: "Soft blue-gray", rgb: "rgb(190, 205, 235)" },
      { hue: "Medium blue-gray", rgb: "rgb(170, 190, 230)" },
      { hue: "Deep blue-gray", rgb: "rgb(150, 175, 225)" },
      { hue: "Dark blue-gray", rgb: "rgb(130, 160, 220)" },
    ],
    slightlyReducing: [
      { hue: "Pale metallic blue-gray", rgb: "rgb(220, 230, 250)" },
      { hue: "Metallic blue-gray", rgb: "rgb(200, 215, 245)" },
      { hue: "Rich metallic", rgb: "rgb(180, 200, 240)" },
      { hue: "Deep metallic", rgb: "rgb(160, 185, 235)" },
      { hue: "Dark metallic", rgb: "rgb(140, 170, 230)" },
      { hue: "Black metallic", rgb: "rgb(120, 155, 225)" },
    ],
    reducing: [
      { hue: "Lustrous pale blue-gray", rgb: "rgb(210, 225, 255)" },
      { hue: "Lustrous blue-gray", rgb: "rgb(190, 210, 250)" },
      { hue: "Brilliant metallic", rgb: "rgb(170, 195, 245)" },
      { hue: "Deep brilliant", rgb: "rgb(150, 180, 240)" },
      { hue: "Dark brilliant", rgb: "rgb(130, 165, 235)" },
      { hue: "Black brilliant", rgb: "rgb(110, 150, 230)" },
    ],
  },
  silverEffect: {
    neutral: "Trace",
    slightlyReducing: "Moderate",
    reducing: "Strong",
  },
  kiln_darkening_start: 1050,
  over_work_start: 1180,
  tips: [
    "Striking temperature 488°C - use for color development",
    "Metallic sheen most pronounced in reducing conditions",
    "Lustrous silver effects develop in fully reducing atmosphere",
    "Avoid over-working above 1180°C",
  ],
};

// Glow Stick - Bright neon yellow-green with strong fluorescent effects
export const glowStick: FeaturedColor = {
  name: "Glow Stick",
  manufacturer: "Glass Alchemy",
  description: "Bright neon yellow-green with strong fluorescent effects. Develops intense glow in reducing atmosphere. Remains transparent throughout.",
  workingRange: { min: 1149, max: 1220 },
  strikeTemp: 505,
  atmosphereData: {
    neutral: [
      { hue: "Pale yellow-green", rgb: "rgb(240, 245, 180)" },
      { hue: "Light yellow-green", rgb: "rgb(230, 240, 160)" },
      { hue: "Medium yellow-green", rgb: "rgb(220, 235, 140)" },
      { hue: "Bright yellow-green", rgb: "rgb(210, 230, 120)" },
      { hue: "Deep yellow-green", rgb: "rgb(200, 225, 100)" },
      { hue: "Dark yellow-green", rgb: "rgb(190, 220, 80)" },
    ],
    slightlyReducing: [
      { hue: "Pale neon yellow-green", rgb: "rgb(235, 255, 150)" },
      { hue: "Neon yellow-green", rgb: "rgb(225, 255, 120)" },
      { hue: "Bright neon", rgb: "rgb(215, 255, 90)" },
      { hue: "Vivid neon", rgb: "rgb(205, 255, 60)" },
      { hue: "Intense neon", rgb: "rgb(195, 255, 30)" },
      { hue: "Electric neon", rgb: "rgb(185, 255, 0)" },
    ],
    reducing: [
      { hue: "Fluorescent pale", rgb: "rgb(230, 255, 140)" },
      { hue: "Fluorescent bright", rgb: "rgb(220, 255, 110)" },
      { hue: "Fluorescent vivid", rgb: "rgb(210, 255, 80)" },
      { hue: "Fluorescent intense", rgb: "rgb(200, 255, 50)" },
      { hue: "Glowing intense", rgb: "rgb(190, 255, 20)" },
      { hue: "Glowing electric", rgb: "rgb(180, 255, 0)" },
    ],
  },
  silverEffect: {
    neutral: "None",
    slightlyReducing: "Moderate",
    reducing: "Strong",
  },
  kiln_darkening_start: 1050,
  over_work_start: 1180,
  tips: [
    "Striking temperature 505°C - use for color development",
    "Fluorescent glow develops in reducing atmosphere",
    "Most intense colors in fully reducing conditions",
    "Best results with controlled flame atmosphere",
  ],
};

// Export all colors as array for easy iteration
export const allFeaturedColors: FeaturedColor[] = [
  silverSerum,
  ectoplasm,
  argentGreen,
  unicornTears,
  silverPotion,
  glowStick,
];
