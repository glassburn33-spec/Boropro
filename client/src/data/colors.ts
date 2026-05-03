// Glass color database with specifications and compatibility
export interface Color {
  id: string;
  name: string;
  manufacturer: string;
  metalComposition: string;
  annealingRange: {
    min: number;
    max: number;
  };
  family: string; // "blues", "reds", "purples", "yellows", etc.
  properties: string[]; // "heat-sensitive", "reduction", "striking", etc.
  compatible: string[]; // Color IDs that work well together
  incompatible: string[]; // Color IDs to avoid mixing
  notes?: string;
}

export const colors: Color[] = [
  // NORTHSTAR - BLUES
  {
    id: "ns-cobalt-blue",
    name: "Cobalt Blue",
    manufacturer: "Northstar",
    metalComposition: "Cobalt Oxide (CoO)",
    annealingRange: { min: 1020, max: 1050 },
    family: "blues",
    properties: ["stable", "reduction-compatible"],
    compatible: ["ns-clear", "ns-white", "ns-silver-exotic"],
    incompatible: [],
    notes: "Stable color. Works well with reduction for deeper tones.",
  },
  {
    id: "ns-sky-blue",
    name: "Sky Blue",
    manufacturer: "Northstar",
    metalComposition: "Cobalt Oxide",
    annealingRange: { min: 1020, max: 1050 },
    family: "blues",
    properties: ["stable"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: [],
    notes: "Light, stable blue. Good for backgrounds.",
  },

  // NORTHSTAR - REDS
  {
    id: "ns-copper-ruby",
    name: "Copper Ruby",
    manufacturer: "Northstar",
    metalComposition: "Copper Oxide (CuO)",
    annealingRange: { min: 1020, max: 1050 },
    family: "reds",
    properties: ["striking", "reduction-sensitive"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: ["ns-heat-sensitive-opaque"],
    notes: "Striking color. Develops deeper red in reducing flame. Avoid heat-sensitive colors.",
  },
  {
    id: "ns-ruby-red",
    name: "Ruby Red",
    manufacturer: "Northstar",
    metalComposition: "Copper compounds",
    annealingRange: { min: 1020, max: 1050 },
    family: "reds",
    properties: ["striking", "reduction-sensitive"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: ["ns-heat-sensitive-opaque"],
    notes: "Deep red. Striking color. Reduction enhances color.",
  },

  // NORTHSTAR - PURPLES
  {
    id: "ns-amber-purple",
    name: "Amber Purple",
    manufacturer: "Northstar",
    metalComposition: "Gold compounds",
    annealingRange: { min: 1000, max: 1040 },
    family: "purples",
    properties: ["heat-sensitive", "striking"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: ["ns-copper-ruby"],
    notes: "Heat-sensitive. Lower anneal temp (1000°F). Striking color.",
  },
  {
    id: "ns-purple",
    name: "Purple",
    manufacturer: "Northstar",
    metalComposition: "Cobalt + other oxides",
    annealingRange: { min: 1020, max: 1050 },
    family: "purples",
    properties: ["stable"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: [],
    notes: "Stable purple. Standard annealing.",
  },

  // NORTHSTAR - YELLOWS & ORANGES
  {
    id: "ns-yellow",
    name: "Yellow",
    manufacturer: "Northstar",
    metalComposition: "Cadmium compounds",
    annealingRange: { min: 1000, max: 1040 },
    family: "yellows",
    properties: ["heat-sensitive"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: ["ns-copper-ruby"],
    notes: "Heat-sensitive. Use lower anneal temp (1000°F).",
  },
  {
    id: "ns-orange",
    name: "Orange",
    manufacturer: "Northstar",
    metalComposition: "Cadmium compounds",
    annealingRange: { min: 1000, max: 1040 },
    family: "oranges",
    properties: ["heat-sensitive"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: ["ns-copper-ruby"],
    notes: "Heat-sensitive. Lower anneal temp required.",
  },

  // NORTHSTAR - GREENS
  {
    id: "ns-green",
    name: "Green",
    manufacturer: "Northstar",
    metalComposition: "Chromium oxide",
    annealingRange: { min: 1020, max: 1050 },
    family: "greens",
    properties: ["stable"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: [],
    notes: "Stable green. Standard annealing.",
  },
  {
    id: "ns-emerald-green",
    name: "Emerald Green",
    manufacturer: "Northstar",
    metalComposition: "Chromium oxide",
    annealingRange: { min: 1020, max: 1050 },
    family: "greens",
    properties: ["stable"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: [],
    notes: "Deep, stable green.",
  },

  // NORTHSTAR - SILVER EXOTICS
  {
    id: "ns-silver-exotic",
    name: "Silver Exotic",
    manufacturer: "Northstar",
    metalComposition: "Silver compounds",
    annealingRange: { min: 1020, max: 1050 },
    family: "exotics",
    properties: ["striking", "reduction-sensitive"],
    compatible: ["ns-clear", "ns-cobalt-blue"],
    incompatible: ["ns-heat-sensitive-opaque"],
    notes: "Striking color. Develops iridescent effects in reduction.",
  },
  {
    id: "ns-silver-blue",
    name: "Silver Blue",
    manufacturer: "Northstar",
    metalComposition: "Silver + cobalt",
    annealingRange: { min: 1020, max: 1050 },
    family: "exotics",
    properties: ["striking", "reduction-sensitive"],
    compatible: ["ns-clear", "ns-white"],
    incompatible: [],
    notes: "Striking blue with silver effects.",
  },

  // NORTHSTAR - HEAT-SENSITIVE OPAQUES
  {
    id: "ns-heat-sensitive-opaque",
    name: "Heat-Sensitive Opaque",
    manufacturer: "Northstar",
    metalComposition: "Various",
    annealingRange: { min: 990, max: 1020 },
    family: "opaques",
    properties: ["heat-sensitive", "opaque"],
    compatible: ["ns-clear"],
    incompatible: ["ns-copper-ruby", "ns-amber-purple", "ns-yellow"],
    notes: "Very heat-sensitive. Use lowest anneal temp (990°F). Avoid with striking colors.",
  },

  // BULLSEYE COLORS
  {
    id: "be-cobalt-blue",
    name: "Cobalt Blue",
    manufacturer: "Bullseye",
    metalComposition: "Cobalt Oxide",
    annealingRange: { min: 1025, max: 1055 },
    family: "blues",
    properties: ["stable"],
    compatible: ["be-clear", "be-white"],
    incompatible: [],
    notes: "Bullseye version. Slightly higher anneal point than Northstar.",
  },
  {
    id: "be-copper-red",
    name: "Copper Red",
    manufacturer: "Bullseye",
    metalComposition: "Copper Oxide",
    annealingRange: { min: 1025, max: 1055 },
    family: "reds",
    properties: ["striking", "reduction-sensitive"],
    compatible: ["be-clear", "be-white"],
    incompatible: [],
    notes: "Bullseye red. Reduction-sensitive.",
  },

  // CLEAR & WHITE
  {
    id: "ns-clear",
    name: "Clear (Northstar)",
    manufacturer: "Northstar",
    metalComposition: "None",
    annealingRange: { min: 1020, max: 1050 },
    family: "clear",
    properties: ["universal", "stable"],
    compatible: [
      "ns-cobalt-blue",
      "ns-copper-ruby",
      "ns-amber-purple",
      "ns-yellow",
      "ns-green",
      "ns-silver-exotic",
    ],
    incompatible: [],
    notes: "Universal base glass. Works with all colors.",
  },
  {
    id: "ns-white",
    name: "White (Northstar)",
    manufacturer: "Northstar",
    metalComposition: "None",
    annealingRange: { min: 1020, max: 1050 },
    family: "white",
    properties: ["opaque", "stable"],
    compatible: [
      "ns-cobalt-blue",
      "ns-copper-ruby",
      "ns-amber-purple",
      "ns-yellow",
      "ns-green",
    ],
    incompatible: [],
    notes: "Opaque white. Good for backgrounds and contrast.",
  },
  {
    id: "be-clear",
    name: "Clear (Bullseye)",
    manufacturer: "Bullseye",
    metalComposition: "None",
    annealingRange: { min: 1025, max: 1055 },
    family: "clear",
    properties: ["universal", "stable"],
    compatible: ["be-cobalt-blue", "be-copper-red"],
    incompatible: [],
    notes: "Bullseye clear. Slightly higher anneal point.",
  },
  {
    id: "be-white",
    name: "White (Bullseye)",
    manufacturer: "Bullseye",
    metalComposition: "None",
    annealingRange: { min: 1025, max: 1055 },
    family: "white",
    properties: ["opaque", "stable"],
    compatible: ["be-cobalt-blue", "be-copper-red"],
    incompatible: [],
    notes: "Bullseye white.",
  },
];
