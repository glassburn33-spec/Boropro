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
    description: "Bright cobalt blue. Can take a lot of heat and can be worked in a wide range of flame settings.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Stay out of reducing flames to prevent dulling or gray streaking.",
    strikingNotes: "Stable color. Not sensitive to flame atmosphere.",
    image: "/manus-storage/northstar_cobalt_001.jpg"
  },
  {
    id: "ns-020",
    name: "Dark Cobalt",
    manufacturer: "Northstar",
    colorCode: "NS-020",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Rich cobalt blue. Second most saturated of Northstar's four cobalt shades. Well suited for thin blown work and cane.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame to prevent dulling or graying.",
    strikingNotes: "Excellent for blown applications.",
    image: "/manus-storage/northstar_dark_cobalt_020.jpg"
  },
  {
    id: "ns-033",
    name: "Turbo Cobalt",
    manufacturer: "Northstar",
    colorCode: "NS-033",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Most saturated cobalt blue on the market. Highly intense color saturation.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Heavily oxidizing flame to prevent graying.",
    strikingNotes: "Requires careful flame control for best results.",
    image: "/manus-storage/northstar_turbo_cobalt_033.jpg"
  },
  {
    id: "ns-019",
    name: "Light Cobalt",
    manufacturer: "Northstar",
    colorCode: "NS-019",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Lightest of the cobalt blues. Versatile and forgiving to work with.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Not sensitive to flame atmosphere.",
    strikingNotes: "Easy to work with for beginners.",
    image: "/manus-storage/northstar_light_cobalt_019.jpg"
  },

  // ============ NORTHSTAR GLASSWORKS - COPPER (RUBY) ============
  {
    id: "ns-114",
    name: "Tan Silver Creek",
    manufacturer: "Northstar",
    colorCode: "NS-114",
    metalComposition: "Silver with Copper",
    colorFamily: "Copper",
    description: "Yellowish cream color. Can yield rich purplish blue and creamy tan tones.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing environment for blues and purples. Reduction produces silvery haze.",
    strikingNotes: "Easy to work, forgiving striking color. Good for blown work and sculpture.",
    image: "/manus-storage/northstar_tan_silver_creek_114.jpg"
  },

  // ============ NORTHSTAR GLASSWORKS - SILVER ============
  {
    id: "ns-121",
    name: "Blue Thunder",
    manufacturer: "Northstar",
    colorCode: "NS-121",
    metalComposition: "Cobalt with Silver",
    colorFamily: "Silver",
    description: "Dark cobalt blue with silver. Yields bright metallic blues in oxidizing flame, bright hazy greens in neutral flame, ash gray in reducing flame.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing for blues, neutral for greens, reducing for gray.",
    strikingNotes: "Excellent for stringer application, blown work, and sculpture.",
    image: "/manus-storage/northstar_blue_thunder_121.jpg"
  },
  {
    id: "ns-124",
    name: "Silver Amethyst",
    manufacturer: "Northstar",
    colorCode: "NS-124",
    metalComposition: "Silver with Cobalt",
    colorFamily: "Silver",
    description: "Dark violet color with silver. Produces vibrant violet with wisps of metallic blue when encased in clear.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Cool oxidizing flame. Kiln strike at 1050°F or gentle bushy neutral flame.",
    strikingNotes: "Best for moderately thick coil-potted blown work and sculptural applications.",
    image: "/manus-storage/northstar_silver_amethyst_124.jpg"
  },

  // ============ GLASS ALCHEMY - COBALT ============
  {
    id: "ga-511",
    name: "Cobalt-1",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-511",
    metalComposition: "Cobalt Oxide (finely milled)",
    colorFamily: "Cobalt",
    description: "Bright cobalt blue. Made from finely milled cobalt mixed using three separate processes for even distribution.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Avoid reduction to prevent dulling.",
    strikingNotes: "Consistent color saturation. Excellent for all applications.",
    image: "/manus-storage/glass_alchemy_cobalt_1_511.jpg"
  },
  {
    id: "ga-515",
    name: "Cobalt-5",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-515",
    metalComposition: "Cobalt Oxide (finely milled)",
    colorFamily: "Cobalt",
    description: "Deep saturated cobalt blue. Premium cobalt formulation with superior color consistency.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame for best results.",
    strikingNotes: "Professional grade cobalt. Ideal for production work.",
    image: "/manus-storage/glass_alchemy_cobalt_5_515.jpg"
  },

  // ============ GLASS ALCHEMY - COPPER ============
  {
    id: "ga-610",
    name: "Copper Red",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-610",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Striking copper-based red. Requires careful temperature control for color development.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Kiln striking recommended for best results.",
    strikingNotes: "Heat-sensitive. Requires kiln annealing at 1225°F for optimal color.",
    image: "/manus-storage/glass_alchemy_copper_red_610.jpg"
  },

  // ============ GLASS ALCHEMY - SILVER ============
  {
    id: "ga-710",
    name: "Silver Blue",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-710",
    metalComposition: "Silver with Cobalt",
    colorFamily: "Silver",
    description: "Striking silver-based blue. Develops metallic luster when properly annealed.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to slightly oxidizing flame.",
    strikingNotes: "Metallic luster develops with proper kiln annealing.",
    image: "/manus-storage/glass_alchemy_silver_blue_710.jpg"
  },

  // ============ TAG (TRAUTMAN ART GLASS) - COBALT ============
  {
    id: "tag-013",
    name: "Blue Blizzard",
    manufacturer: "TAG",
    colorCode: "TAG-013",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Deep cobalt blue with reactive properties. Creates striking effects when worked properly.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Avoid reduction.",
    strikingNotes: "Reactive color. Responds well to temperature changes.",
    image: "/manus-storage/tag_blue_blizzard_013.jpg"
  },
  {
    id: "tag-030",
    name: "Heavy Blue Leprechaun",
    manufacturer: "TAG",
    colorCode: "TAG-030",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Very saturated cobalt blue. Dense and opaque.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame for best saturation.",
    strikingNotes: "Professional-grade cobalt. Excellent for production.",
    image: "/manus-storage/tag_heavy_blue_leprechaun_030.jpg"
  },
  {
    id: "tag-031",
    name: "Blue Stardust",
    manufacturer: "TAG",
    colorCode: "TAG-031",
    metalComposition: "Cobalt Oxide with sparkle",
    colorFamily: "Cobalt",
    description: "Cobalt blue with sparkle effect. Creates shimmering appearance when melted.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to oxidizing flame.",
    strikingNotes: "Sparkle effect best when used in back of flame.",
    image: "/manus-storage/tag_blue_stardust_031.jpg"
  },

  // ============ TAG (TRAUTMAN ART GLASS) - COPPER ============
  {
    id: "tag-015",
    name: "Red Blizzard",
    manufacturer: "TAG",
    colorCode: "TAG-015",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Deep striking red with reactive properties. Develops rich tones when properly annealed.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Kiln striking recommended.",
    strikingNotes: "Reactive copper color. Requires careful temperature management.",
    image: "/manus-storage/tag_red_blizzard_015.jpg"
  },
  {
    id: "tag-001",
    name: "Elvis Red",
    manufacturer: "TAG",
    colorCode: "TAG-001",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Bright striking red. Named for its vibrant appearance.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Kiln strike at 1050°F.",
    strikingNotes: "Heat-sensitive. Requires proper annealing for color development.",
    image: "/manus-storage/tag_elvis_red_001.jpg"
  },

  // ============ TAG (TRAUTMAN ART GLASS) - SILVER ============
  {
    id: "tag-062",
    name: "Blue Slyme",
    manufacturer: "TAG",
    colorCode: "TAG-062",
    metalComposition: "Silver with Cobalt",
    colorFamily: "Silver",
    description: "Reactive silver-based blue. Develops metallic effects when worked in reducing flame.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral flame. Reduction produces metallic effects.",
    strikingNotes: "Striking color. Responds well to flame manipulation.",
    image: "/manus-storage/tag_blue_slyme_062.jpg"
  },
  {
    id: "tag-054",
    name: "Pink Slyme",
    manufacturer: "TAG",
    colorCode: "TAG-054",
    metalComposition: "Silver with Copper",
    colorFamily: "Silver",
    description: "Reactive silver-based pink. Develops from pale pink to deep magenta depending on annealing.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to reducing flame for color development.",
    strikingNotes: "Heavy striking color. Requires careful temperature control.",
    image: "/manus-storage/tag_pink_slyme_054.jpg"
  },
  {
    id: "tag-040",
    name: "Mega Mai Tai",
    manufacturer: "TAG",
    colorCode: "TAG-040",
    metalComposition: "Silver Reactive",
    colorFamily: "Silver",
    description: "Heavy striking silver reactive glass. Formulated by Paul Trautman. Produces complex color effects.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to reducing flame for striking.",
    strikingNotes: "Professional striking color. Excellent for advanced work.",
    image: "/manus-storage/tag_mega_mai_tai_040.jpg"
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
