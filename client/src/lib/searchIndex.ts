import { glassColors } from "@/data/glass_colors";
import { torchDatabase } from "@/data/torches_expanded";

export interface SearchResult {
  id: string;
  type: "torch" | "kiln" | "color" | "schedule";
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  manufacturer?: string;
  matchedFields: string[];
}

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  // Index torches
  torchDatabase.forEach((torch) => {
    results.push({
      id: `torch-${torch.id}`,
      type: "torch",
      title: torch.name,
      subtitle: torch.brand,
      description: `${torch.fuelType} | ${torch.maxTemp} | ${torch.bestFor.join(", ")}`,
      category: "Equipment",
      manufacturer: torch.brand,
      matchedFields: [],
    });
  });

  // Index kilns (from torchDatabase kilns section if available)
  // Note: Kilns are stored separately in the app, adding placeholder structure
  const kilns = [
    {
      id: "kiln-skutt-1227",
      name: "Skutt KilnMaster 1227",
      manufacturer: "Skutt",
      specs: ["Max: 2300°F", "0.27 cu in", "3 zone", "Digital"],
    },
    {
      id: "kiln-paragon-pro",
      name: "Paragon Pro",
      manufacturer: "Paragon",
      specs: ["Max: 2300°F", "Large", "4 zone", "Digital"],
    },
    {
      id: "kiln-paragon-xpress",
      name: "Paragon Xpress",
      manufacturer: "Paragon",
      specs: ["Max: 2300°F", "Compact", "3 zone", "Digital"],
    },
    {
      id: "kiln-evenheat-studio",
      name: "Evenheat Studio Pro",
      manufacturer: "Evenheat",
      specs: ["Max: 2300°F", "Medium", "2 zone", "Digital"],
    },
  ];

  kilns.forEach((kiln) => {
    results.push({
      id: kiln.id,
      type: "kiln",
      title: kiln.name,
      subtitle: kiln.manufacturer,
      description: kiln.specs.join(" | "),
      category: "Equipment",
      manufacturer: kiln.manufacturer,
      matchedFields: [],
    });
  });

  // Index colors
  glassColors.forEach((color) => {
    results.push({
      id: `color-${color.id}`,
      type: "color",
      title: color.name,
      subtitle: `${color.manufacturer} - ${color.colorCode}`,
      description: `${color.metalComposition} | ${color.description} | Anneal: ${color.annealingTemp}`,
      category: "Colors",
      manufacturer: color.manufacturer,
      matchedFields: [],
    });
  });

  // Index schedules
  const schedules = [
    {
      id: "schedule-hollow-thin",
      name: "Hollow Form (Thin Wall)",
      description: "For thin-walled hollow forms 1-2mm. Hold: 1050°F, Ramp: 100°F/hr",
    },
    {
      id: "schedule-solid-thick",
      name: "Solid Glass (Full Thickness)",
      description: "For solid glass 3-4mm. Hold: 1150°F, Ramp: 50°F/hr",
    },
    {
      id: "schedule-slumping",
      name: "Slumping Schedule",
      description: "For slumped forms. Hold: 1100°F, Ramp: 75°F/hr",
    },
    {
      id: "schedule-heat-sensitive",
      name: "Heat-Sensitive Colors",
      description: "For striking colors. Hold: 950°F, Ramp: 100°F/hr",
    },
  ];

  schedules.forEach((schedule) => {
    results.push({
      id: schedule.id,
      type: "schedule",
      title: schedule.name,
      description: schedule.description,
      category: "Calculator",
      matchedFields: [],
    });
  });

  return results;
}

export function searchContent(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const index = buildSearchIndex();
  const lowerQuery = query.toLowerCase();

  return index
    .map((result) => {
      const matchedFields: string[] = [];
      let matchScore = 0;

      // Search in title
      if (result.title.toLowerCase().includes(lowerQuery)) {
        matchedFields.push("title");
        matchScore += 10;
      }

      // Search in subtitle
      if (result.subtitle?.toLowerCase().includes(lowerQuery)) {
        matchedFields.push("subtitle");
        matchScore += 8;
      }

      // Search in manufacturer
      if (result.manufacturer?.toLowerCase().includes(lowerQuery)) {
        matchedFields.push("manufacturer");
        matchScore += 7;
      }

      // Search in description
      if (result.description?.toLowerCase().includes(lowerQuery)) {
        matchedFields.push("description");
        matchScore += 5;
      }

      // Search in category
      if (result.category?.toLowerCase().includes(lowerQuery)) {
        matchedFields.push("category");
        matchScore += 3;
      }

      return {
        ...result,
        matchedFields,
        matchScore,
      };
    })
    .filter((result) => result.matchedFields.length > 0)
    .sort((a, b) => (b as any).matchScore - (a as any).matchScore)
    .slice(0, 20); // Return top 20 results
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
