// Annealing schedules for quick reference
export interface ScheduleStep {
  name: string;
  temperature: number;
  hold: number; // minutes
  rampRate: number; // degrees per hour
}

export interface Schedule {
  id: string;
  name: string;
  glassType: string;
  thickness: string; // "1mm", "2mm", "3mm", etc.
  form: "solid" | "hollow";
  steps: ScheduleStep[];
  estimatedTime: string;
  notes?: string;
}

export const schedules: Schedule[] = [
  // BOROSILICATE - 1MM (THIN WALL / HOLLOW)
  {
    id: "boro-1mm-hollow",
    name: "Borosilicate 1mm Hollow",
    glassType: "Borosilicate",
    thickness: "1mm",
    form: "hollow",
    steps: [
      {
        name: "Anneal",
        temperature: 1020,
        hold: 15,
        rampRate: 5,
      },
      {
        name: "Cool to Strain Point",
        temperature: 900,
        hold: 0,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "2-3 hours",
    notes: "Thin wall work. Shorter hold time. Faster cooling acceptable.",
  },

  // BOROSILICATE - 2MM (STANDARD)
  {
    id: "boro-2mm-solid",
    name: "Borosilicate 2mm Solid",
    glassType: "Borosilicate",
    thickness: "2mm",
    form: "solid",
    steps: [
      {
        name: "Anneal",
        temperature: 1035,
        hold: 25,
        rampRate: 3,
      },
      {
        name: "Cool to Strain Point",
        temperature: 900,
        hold: 0,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "3-4 hours",
    notes: "Standard thickness. Most common annealing schedule.",
  },

  // BOROSILICATE - 3MM (THICK)
  {
    id: "boro-3mm-solid",
    name: "Borosilicate 3mm Solid",
    glassType: "Borosilicate",
    thickness: "3mm",
    form: "solid",
    steps: [
      {
        name: "Anneal",
        temperature: 1050,
        hold: 30,
        rampRate: 3,
      },
      {
        name: "Cool to Strain Point",
        temperature: 900,
        hold: 0,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "4-5 hours",
    notes: "Thicker pieces. Longer hold time. Slower cooling required.",
  },

  // BOROSILICATE - 4MM+ (VERY THICK)
  {
    id: "boro-4mm-solid",
    name: "Borosilicate 4mm+ Solid",
    glassType: "Borosilicate",
    thickness: "4mm+",
    form: "solid",
    steps: [
      {
        name: "Anneal",
        temperature: 1050,
        hold: 45,
        rampRate: 2,
      },
      {
        name: "Cool to Strain Point",
        temperature: 900,
        hold: 0,
        rampRate: 1.5,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 0.5,
      },
    ],
    estimatedTime: "6-8 hours",
    notes: "Very thick pieces. Slow heating and cooling critical.",
  },

  // SLUMPING SCHEDULES
  {
    id: "slump-1mm",
    name: "Slumping 1mm Glass",
    glassType: "Borosilicate",
    thickness: "1mm",
    form: "solid",
    steps: [
      {
        name: "Heat to Slump Temp",
        temperature: 1100,
        hold: 10,
        rampRate: 5,
      },
      {
        name: "Cool to Anneal",
        temperature: 1035,
        hold: 20,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "2-3 hours",
    notes: "Slumping thin glass. Watch closely to prevent over-slumping.",
  },

  {
    id: "slump-2mm",
    name: "Slumping 2mm Glass",
    glassType: "Borosilicate",
    thickness: "2mm",
    form: "solid",
    steps: [
      {
        name: "Heat to Slump Temp",
        temperature: 1150,
        hold: 15,
        rampRate: 4,
      },
      {
        name: "Cool to Anneal",
        temperature: 1035,
        hold: 25,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "3-4 hours",
    notes: "Standard slumping schedule.",
  },

  {
    id: "slump-3mm",
    name: "Slumping 3mm Glass",
    glassType: "Borosilicate",
    thickness: "3mm",
    form: "solid",
    steps: [
      {
        name: "Heat to Slump Temp",
        temperature: 1200,
        hold: 20,
        rampRate: 3,
      },
      {
        name: "Cool to Anneal",
        temperature: 1050,
        hold: 30,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "4-5 hours",
    notes: "Thicker glass slumping. Slower heating for even slump.",
  },

  // HEAT-SENSITIVE COLORS
  {
    id: "boro-heat-sensitive",
    name: "Heat-Sensitive Opaque Colors",
    glassType: "Borosilicate",
    thickness: "2mm",
    form: "solid",
    steps: [
      {
        name: "Anneal (Lower)",
        temperature: 1000,
        hold: 20,
        rampRate: 3,
      },
      {
        name: "Cool to Strain Point",
        temperature: 900,
        hold: 0,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "3-4 hours",
    notes: "For heat-sensitive opaque colors. Lower anneal temp prevents color shift.",
  },

  // REDUCTION COLORS
  {
    id: "boro-reduction-colors",
    name: "Reduction Colors (Striking)",
    glassType: "Borosilicate",
    thickness: "2mm",
    form: "solid",
    steps: [
      {
        name: "Anneal",
        temperature: 1035,
        hold: 25,
        rampRate: 3,
      },
      {
        name: "Cool to Strain Point",
        temperature: 900,
        hold: 0,
        rampRate: 2,
      },
      {
        name: "Cool to Room Temp",
        temperature: 200,
        hold: 0,
        rampRate: 1,
      },
    ],
    estimatedTime: "3-4 hours",
    notes: "For reduction colors (silver exotics, copper ruby). Standard schedule works.",
  },
];
