// Equipment database for glass blowing reference
export interface Equipment {
  id: string;
  name: string;
  type: "kiln" | "torch" | "glass";
  category?: string;
  specs: Record<string, string | number>;
  schedules?: string[]; // IDs of associated schedules
  notes?: string;
  image?: string; // URL to product image
}

export const equipment: Equipment[] = [
  // KILNS
  {
    id: "skutt-1227",
    name: "Skutt KilnMaster 1227",
    type: "kiln",
    category: "Digital",
    specs: {
      "Max Temperature": "2300°F",
      "Interior Volume": "27 cu in",
      "Control Type": "Digital",
      "Heating Elements": "3 zone",
      "Power": "240V",
    },
    notes: "Popular for borosilicate annealing. Excellent temperature control.",
    image: "/manus-storage/skutt_kilnmaster_1227_1f3c63e8.jpg",
  },
  {
    id: "paragon-xpress",
    name: "Paragon Xpress",
    type: "kiln",
    category: "Digital",
    specs: {
      "Max Temperature": "2300°F",
      "Interior Volume": "Compact",
      "Control Type": "Digital",
      "Heating Elements": "2 zone",
      "Power": "240V",
    },
    notes: "Fast heating kiln. Good for quick annealing cycles.",
  },
  {
    id: "paragon-pro",
    name: "Paragon Pro",
    type: "kiln",
    category: "Digital",
    specs: {
      "Max Temperature": "2300°F",
      "Interior Volume": "Large",
      "Control Type": "Digital",
      "Heating Elements": "4 zone",
      "Power": "240V",
    },
    notes: "Professional grade. Best for production work.",
  },
  {
    id: "evenheat-kiln",
    name: "Evenheat Studio Pro",
    type: "kiln",
    category: "Digital",
    specs: {
      "Max Temperature": "2300°F",
      "Interior Volume": "Medium",
      "Control Type": "Digital",
      "Heating Elements": "3 zone",
      "Power": "240V",
    },
    notes: "Reliable mid-range option. Good temperature consistency.",
  },

  // TORCHES - First torch is GTT Lynx (with product image)
  {
    id: "torch-gtt-lynx",
    name: "GTT Lynx (7 Jet)",
    type: "torch",
    category: "Hand Torch",
    specs: {
      "Manufacturer": "GTT Glass Torch Technologies",
      "Max Temperature": "~2600°F",
      "Borosilicate Capacity": "2\" solid maximum",
      "Flame Width": "Pinpoint to 1/4\"",
      "Fuel Consumption": "~1.5 LPM",
    },
    notes: "Perfect for lampworkers who need precision and control. Excellent for both soft and borosilicate glass.",
    image: "/manus-storage/gtt_lynx_torch_4be0fc88.png",
  },
  {
    id: "torch-minor",
    name: "Minor Torch (Single Fuel)",
    type: "torch",
    category: "Flame Type",
    specs: {
      "Fuel Type": "Propane or Natural Gas",
      "Oxygen": "Not required",
      "Flame Size": "Small",
      "Best For": "Detail work, small beads",
      "Temperature": "~2000°F",
    },
    notes: "Produces oxidizing flame. Good for initial heating and detail work.",
  },
  {
    id: "torch-major",
    name: "Major Torch (Dual Fuel)",
    type: "torch",
    category: "Flame Type",
    specs: {
      "Fuel Type": "Propane + Oxygen",
      "Oxygen": "Required",
      "Flame Size": "Large",
      "Best For": "Large pieces, production",
      "Temperature": "~2800°F",
    },
    notes: "Produces neutral to reducing flame. Essential for production work.",
  },
  {
    id: "torch-reduction",
    name: "Reduction Torch (High Fuel)",
    type: "torch",
    category: "Flame Type",
    specs: {
      "Fuel Type": "Propane + Oxygen",
      "Fuel Ratio": "High fuel, lower oxygen",
      "Flame Type": "Reducing",
      "Best For": "Striking colors, reduction effects",
      "Temperature": "~2500°F",
    },
    notes: "Produces strong reducing flame for color development.",
  },
  {
    id: "torch-neutral",
    name: "Neutral Flame Setup",
    type: "torch",
    category: "Flame Type",
    specs: {
      "Fuel Type": "Propane + Oxygen",
      "Fuel Ratio": "Balanced",
      "Flame Type": "Neutral",
      "Best For": "General work, color preservation",
      "Temperature": "~2600°F",
    },
    notes: "Balanced fuel and oxygen. Preserves most colors without striking.",
  },

  // GLASS TYPES
  {
    id: "glass-northstar",
    name: "Northstar Borosilicate",
    type: "glass",
    category: "Borosilicate",
    specs: {
      "Manufacturer": "Northstar Glass",
      "Type": "Borosilicate",
      "Annealing Point": "1020°F",
      "Strain Point": "900°F",
      "Softening Point": "1700°F",
      "CTE": "3.3 x 10⁻⁶/°C",
    },
    notes: "Industry standard for lampworking. Excellent color range.",
  },
  {
    id: "glass-bullseye",
    name: "Bullseye Borosilicate",
    type: "glass",
    category: "Borosilicate",
    specs: {
      "Manufacturer": "Bullseye Glass",
      "Type": "Borosilicate",
      "Annealing Point": "1025°F",
      "Strain Point": "905°F",
      "Softening Point": "1705°F",
      "CTE": "3.25 x 10⁻⁶/°C",
    },
    notes: "Premium borosilicate. Excellent transparency and color consistency.",
  },
  {
    id: "glass-boro-clear",
    name: "Borosilicate Clear",
    type: "glass",
    category: "Borosilicate",
    specs: {
      "Color": "Clear",
      "Annealing": "1020-1050°F",
      "Best For": "Base glass, clear pieces",
      "Thickness Range": "1-6mm",
      "Melting Point": "~2800°F",
    },
    notes: "Universal base glass. Works with all colors.",
  },
  {
    id: "glass-boro-white",
    name: "Borosilicate White",
    type: "glass",
    category: "Borosilicate",
    specs: {
      "Color": "White opaque",
      "Annealing": "1020-1050°F",
      "Best For": "Backgrounds, contrast",
      "Thickness Range": "1-6mm",
      "Melting Point": "~2800°F",
    },
    notes: "Opaque white. Good for backgrounds and contrast work.",
  },
];
