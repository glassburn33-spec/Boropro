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
    strikingNotes: "Stable color. Not sensitive to flame atmosphere.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/northstar_cobalt_ns001-YANxGrjSb6eHVKz6bCnByv.webp"
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
    strikingNotes: "Excellent for blown applications.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/northstar_cobalt_ns020-UpmWmAmExPki6gsJCWB7kX.webp"
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
    strikingNotes: "Requires careful flame control for best results.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/northstar_turbo_cobalt_ns033-h3GiQ6b5T9uRNRm3rQ33CZ.webp"
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
    strikingNotes: "Easy to work with for beginners.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/northstar_light_cobalt_ns019-HjPzddTiWQa8tmP9JpNyeY.webp"
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
    strikingNotes: "Easy to work, forgiving striking color. Good for blown work and sculpture.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/northstar_copper_ns030-GgKnGzoiZN4J9Yi7ZiZE79.webp"
  },

  // ============ NORTHSTAR GLASSWORKS - SILVER ============
  {
    id: "ns-050",
    name: "Blue Thunder",
    manufacturer: "Northstar",
    colorCode: "NS-050",
    metalComposition: "Cobalt with Silver",
    colorFamily: "Silver",
    description: "Dark cobalt blue with silver by Northstar Glassworks. Yields bright metallic blues in oxidizing flame, bright hazy greens in neutral flame, ash gray in reducing flame.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/northstar_silver_ns050-VPr6M5KPdMUBkbRMNw7cBw.webp",
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
    strikingNotes: "Best for moderately thick coil-potted blown work and sculptural applications.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/northstar_silver_amethyst_ns124-Xv3PTq3MjXPn4B9L89yeDj.webp"
  },

  // ============ GLASS ALCHEMY - COBALT ============
  {
    id: "ca-001",
    name: "Cobalt-1",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-001",
    metalComposition: "Cobalt Oxide (finely milled)",
    colorFamily: "Cobalt",
    description: "Bright cobalt blue by Glass Alchemy. Made from finely milled cobalt mixed using three separate processes for superior distribution.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame. Avoid reduction to prevent dulling.",
    strikingNotes: "Consistent color saturation. Professional grade cobalt.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/glassalchemy_cobalt_ca001-Qfk7e7MiyfJSN5dBirsUcU.webp"
  },
  {
    id: "ca-005",
    name: "Cobalt-5",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-005",
    metalComposition: "Cobalt Oxide (finely milled)",
    colorFamily: "Cobalt",
    description: "Deep saturated Cobalt blue by Glass Alchemy. Premium cobalt formulation with superior color consistency.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame for best results.",
    strikingNotes: "Professional grade cobalt. Ideal for production work.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/glassalchemy_cobalt_ca005-UTQkDbb8Ce6ufm6HmsBaVg.webp"
  },

  // ============ GLASS ALCHEMY - COPPER ============
  {
    id: "ca-010",
    name: "Copper-1",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-010",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Warm copper orange color by Glass Alchemy. Versatile for flame work and sculpture.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to oxidizing flame.",
    strikingNotes: "Stable color. Easy to work with.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/glassalchemy_copper_ca010-gDpr9Rn5a9z59AXUR6JPMZ.webp"
  },

  // ============ GLASS ALCHEMY - SILVER ============
  {
    id: "ca-020",
    name: "Silver-1",
    manufacturer: "Glass Alchemy",
    colorCode: "GA-020",
    metalComposition: "Silver",
    colorFamily: "Silver",
    description: "Clear borosilicate glass with silver striking properties by Glass Alchemy. Produces metallic effects in reducing flame.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Reducing flame for silver effects.",
    strikingNotes: "Requires reduction to develop color. Striking glass.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/glassalchemy_silver_ca020-ceSvKf2jTqxp5Jyj4FXfwp.webp"
  },

  // ============ TAG (TRAUTMAN ART GLASS) - COBALT ============
  {
    id: "tag-001",
    name: "Cobalt",
    manufacturer: "TAG",
    colorCode: "TAG-Cobalt",
    metalComposition: "Cobalt Oxide",
    colorFamily: "Cobalt",
    description: "Rich cobalt blue by Trautman Art Glass (TAG). Borosilicate 33 COE glass.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Oxidizing flame recommended.",
    strikingNotes: "Stable color. Professional quality.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_cobalt_tc001-FhdnSiMH7ZfS9zCtj8uWMw.webp"
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
    strikingNotes: "Professional-grade cobalt. Excellent for production.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_heavy_blue_leprechaun_tag030-V4KCkpthgwVwtghZ6fHMTf.webp"
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
    strikingNotes: "Sparkle effect best when used in back of flame.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_blue_stardust_tag031-QJivgibx3igswi82qmNRm2.webp"
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
    strikingNotes: "Reactive copper color. Requires careful temperature management.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_red_blizzard_tag015-JfMeXDvBBNP6phKotZn7a7.webp"
  },
  {
    id: "tag-010",
    name: "Copper",
    manufacturer: "TAG",
    colorCode: "TAG-Copper",
    metalComposition: "Copper Oxide",
    colorFamily: "Copper",
    description: "Warm copper orange-red color by Trautman Art Glass (TAG). Made in the USA.",
    annealingTemp: "1050°F",
    workingTemp: "2228°F",
    flameRecommendation: "Neutral to oxidizing flame.",
    strikingNotes: "Stable and forgiving.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_copper_tc010-7stfN279QXwFqYdVuHKCWV.webp"
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
    strikingNotes: "Striking color. Responds well to flame manipulation.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_blue_slyme_tag062-GVf8H7rcSS4vTuoVtzbB9U.webp"
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
    strikingNotes: "Heavy striking color. Requires careful temperature control.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_pink_slyme_tag054-WDAcnMVwN38tC3xQQYfyvv.webp"
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
    strikingNotes: "Professional striking color. Excellent for advanced work.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/tag_mega_mai_tai_tag040-6xAvEfvr99k2T8DU73z2Cb.webp"
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
