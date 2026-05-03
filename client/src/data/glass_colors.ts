// Glass color database with specifications from Northstar Glassworks, Glass Alchemy, and TAG (Trautman Art Glass)
// Includes cobalt, copper, and silver-based compositions with annealing properties

export interface GlassColor {
  id: string;
  name: string;
  manufacturer: "Northstar" | "Glass Alchemy" | "TAG";
  colorCode: string;
  metalComposition: string;
  colorFamily: "Cobalt" | "Copper" | "Silver";
  description: string;
  annealingTemp: string;
  workingTemp: string;
  flameRecommendation: string;
  strikingNotes: string;
  image?: string;
}

export const glassColors: GlassColor[] = [
  // ============ NORTHSTAR GLASSWORKS - COBALT ============
  {
    id: "ns-001",
    name: "Cobalt",
    manufacturer: "Northstar",
    colorCode: "NS-001",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Bright cobalt blue by Northstar Glassworks. Can take a lot of heat and can be worked in a wide range of flame settings.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Stay out of reducing flames to prevent dulling or gray streaking.",
    strikingNotes: "Stable color. Not sensitive to flame atmosphere."
  },
  {
    id: "ns-020",
    name: "Dark Cobalt",
    manufacturer: "Northstar",
    colorCode: "NS-020",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Rich cobalt blue by Northstar Glassworks. Second most saturated of Northstar's four cobalt shades. Well suited for thin blown work and cane.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame to prevent dulling or graying.",
    strikingNotes: "Excellent for blown applications."
  },
  {
    id: "ns-033",
    name: "Turbo Cobalt",
    manufacturer: "Northstar",
    colorCode: "NS-033",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Most saturated cobalt blue on the market by Northstar Glassworks. Highly intense color saturation.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Heavily oxidizing flame to prevent graying.",
    strikingNotes: "Requires careful flame control for best results."
  },
  {
    id: "ns-019",
    name: "Light Cobalt",
    manufacturer: "Northstar",
    colorCode: "NS-019",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Lightest of the cobalt blues by Northstar Glassworks. Versatile and forgiving to work with.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Not sensitive to flame atmosphere.",
    strikingNotes: "Easy to work with for beginners."
  },

  // ============ NORTHSTAR GLASSWORKS - COPPER (RUBY) ============
  {
    id: "ns-114",
    name: "Tan Silver Creek",
    manufacturer: "Northstar",
    colorCode: "NS-114",
    metalComposition: "Silver with Copper",
    colorFamily: "Copper",
    description: "Yellowish cream color by Northstar Glassworks. Can yield rich purplish blue and creamy tan tones.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing environment for blues and purples. Reduction produces silvery haze.",
    strikingNotes: "Easy to work, forgiving striking color. Good for blown work and sculpture."
  },

  // ============ NORTHSTAR GLASSWORKS - SILVER ============
  {
    id: "ns-121",
    name: "Blue Thunder",
    manufacturer: "Northstar",
    colorCode: "NS-121",
    metalComposition: "Cobalt with Silver",
    colorFamily: "Silver",
    description: "Dark cobalt blue with silver by Northstar Glassworks. Yields bright metallic blues in oxidizing flame, bright hazy greens in neutral flame, ash gray in reducing flame.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing for blues, neutral for greens, reducing for gray.",
    strikingNotes: "Excellent for stringer application, blown work, and sculpture."
  },
  {
    id: "ns-124",
    name: "Silver Amethyst",
    manufacturer: "Northstar",
    colorCode: "NS-124",
    metalComposition: "Silver with Cobalt",
    colorFamily: "Silver",
    description: "Dark violet color with silver by Northstar Glassworks. Produces vibrant violet with wisps of metallic blue when encased in clear.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Cool oxidizing flame. Kiln strike at 1050°F or gentle bushy neutral flame.",
    strikingNotes: "Best for moderately thick coil-potted blown work and sculptural applications."
  },

  // ============ GLASS ALCHEMY - COBALT ============
  {
    id: "ga-511",
    name: "Cobalt-1",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-511",
    metalComposition: "Cobalt Oxide (finely milled)",
    colorFamily: "Cobalt",
    description: "Bright cobalt blue by Glass Alchemy. Made from finely milled cobalt mixed using three separate processes for even distribution.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Avoid reduction to prevent dulling.",
    strikingNotes: "Consistent color saturation. Excellent for all applications."
  },
  {
    id: "ga-515",
    name: "Cobalt-5",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-515",
    metalComposition: "Cobalt Oxide (finely milled)",
    colorFamily: "Cobalt",
    description: "Deep saturated cobalt blue by Glass Alchemy. Premium cobalt formulation with superior color consistency.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame for best results.",
    strikingNotes: "Professional grade cobalt. Ideal for production work."
  },

  // ============ GLASS ALCHEMY - COPPER ============
  {
    id: "ga-610",
    name: "Copper Red",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-610",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Striking copper-based red by Glass Alchemy. Requires careful temperature control for color development.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Kiln striking recommended for best results.",
    strikingNotes: "Heat-sensitive. Requires kiln annealing at 1225°F for optimal color."
  },

  // ============ GLASS ALCHEMY - SILVER ============
  {
    id: "ga-710",
    name: "Silver Blue",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-710",
    metalComposition: "Silver with Cobalt",
    colorFamily: "Silver",
    description: "Striking silver-based blue by Glass Alchemy. Develops metallic luster when properly annealed.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to slightly oxidizing flame.",
    strikingNotes: "Metallic luster develops with proper kiln annealing."
  },

  // ============ TAG (TRAUTMAN ART GLASS) - COBALT ============
  {
    id: "tag-013",
    name: "Blue Blizzard",
    manufacturer: "TAG",
    colorCode: "TAG-013",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Deep cobalt blue with reactive properties by TAG (Trautman Art Glass). Creates striking effects when worked properly.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Avoid reduction.",
    strikingNotes: "Reactive color. Responds well to temperature changes."
  },
  {
    id: "tag-030",
    name: "Heavy Blue Leprechaun",
    manufacturer: "TAG",
    colorCode: "TAG-030",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Very saturated cobalt blue by TAG (Trautman Art Glass). Dense and opaque.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame for best saturation.",
    strikingNotes: "Professional-grade cobalt. Excellent for production."
  },
  {
    id: "tag-031",
    name: "Blue Stardust",
    manufacturer: "TAG",
    colorCode: "TAG-031",
    metalComposition: "Cobalt Oxide with sparkle",
    colorFamily: "Cobalt",
    description: "Cobalt blue with sparkle effect by TAG (Trautman Art Glass). Creates shimmering appearance when melted.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to oxidizing flame.",
    strikingNotes: "Sparkle effect best when used in back of flame."
  },

  // ============ TAG (TRAUTMAN ART GLASS) - COPPER ============
  {
    id: "tag-015",
    name: "Red Blizzard",
    manufacturer: "TAG",
    colorCode: "TAG-015",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Deep striking red with reactive properties by TAG (Trautman Art Glass). Develops rich tones when properly annealed.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Kiln striking recommended.",
    strikingNotes: "Reactive copper color. Requires careful temperature management."
  },
  {
    id: "tag-001",
    name: "Elvis Red",
    manufacturer: "TAG",
    colorCode: "TAG-001",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Bright striking red by TAG (Trautman Art Glass). Named for its vibrant appearance.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Kiln strike at 1050°F.",
    strikingNotes: "Heat-sensitive. Requires proper annealing for color development."
  },

  // ============ TAG (TRAUTMAN ART GLASS) - SILVER ============
  {
    id: "tag-062",
    name: "Blue Slyme",
    manufacturer: "TAG",
    colorCode: "TAG-062",
    metalComposition: "Silver with Cobalt",
    colorFamily: "Silver",
    description: "Reactive silver-based blue by TAG (Trautman Art Glass). Develops metallic effects when worked in reducing flame.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral flame. Reduction produces metallic effects.",
    strikingNotes: "Striking color. Responds well to flame manipulation."
  },
  {
    id: "tag-054",
    name: "Pink Slyme",
    manufacturer: "TAG",
    colorCode: "TAG-054",
    metalComposition: "Silver with Copper",
    colorFamily: "Silver",
    description: "Reactive silver-based pink by TAG (Trautman Art Glass). Develops from pale pink to deep magenta depending on annealing.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to reducing flame for color development.",
    strikingNotes: "Heavy striking color. Requires careful temperature control."
  },
  {
    id: "tag-040",
    name: "Mega Mai Tai",
    manufacturer: "TAG",
    colorCode: "TAG-040",
    metalComposition: "Silver Reactive",
    colorFamily: "Silver",
    description: "Heavy striking silver reactive glass by TAG (Trautman Art Glass). Formulated by Paul Trautman. Produces complex color effects.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to reducing flame for striking.",
    strikingNotes: "Professional striking color. Excellent for advanced work."
  }
];

// Helper function to get colors by manufacturer
export function getColorsByManufacturer(manufacturer: "Northstar" | "Glass Alchemy" | "TAG") {
  return glassColors.filter(color => color.manufacturer === manufacturer);
}

// Helper function to get colors by metal composition
export function getColorsByComposition(composition: "Cobalt" | "Copper" | "Silver") {
  return glassColors.filter(color => color.colorFamily === composition);
}

// Helper function to get all manufacturers
export function getManufacturers() {
  return Array.from(new Set(glassColors.map(color => color.manufacturer)));
}

// Helper function to get all compositions
export function getCompositions() {
  return Array.from(new Set(glassColors.map(color => color.colorFamily)));
}
