/**
 * Dragon Tears v2 by Glass Alchemy
 * Highly reactive borosilicate with dual-axis color behavior
 * driven by both temperature and flame atmosphere
 */

export type FlameAtmosphere = 'neutral' | 'slightly-reducing' | 'reducing';

export interface DragonTearsPhase {
  temperature: number; // Celsius
  tempRange: string;
  baseHue: string;
  silverEffect: 'None' | 'Trace' | 'Moderate' | 'Strong' | 'Full';
  transparent: boolean;
  notes: string;
}

export interface DragonTearsAtmosphereData {
  atmosphere: FlameAtmosphere;
  displayName: string;
  description: string;
  phases: DragonTearsPhase[];
  gradient: {
    colors: string[]; // RGB hex colors from cold to hot
    stops: number[]; // Percentage stops for gradient
  };
}

export const dragonTearsV2: {
  name: string;
  manufacturer: string;
  shortDescription: string;
  productDescription: string;
  workingTip: string;
  kilnNote: string;
  atmospheres: Record<FlameAtmosphere, DragonTearsAtmosphereData>;
} = {
  name: 'Dragon Tears v2',
  manufacturer: 'Glass Alchemy',
  shortDescription: 'Highly reactive borosilicate. Color and silver effects vary by flame atmosphere and temperature. Remains transparent throughout.',
  productDescription: 'If you like Dragon Tears, but wish it was more reactive, then v2 is for you!! This color is more playful, while remaining transparent once worked.',
  workingTip: 'Work in a neutral flame and use a slightly reducing flame to bring the silver effects to the surface.',
  kilnNote: 'Long kiln times will darken the effects, the base color will stay the same.',
  
  atmospheres: {
    neutral: {
      atmosphere: 'neutral',
      displayName: 'Neutral Flame',
      description: 'Balanced oxidizing/reducing conditions. Stable base color with minimal silver effects.',
      phases: [
        {
          temperature: 20,
          tempRange: 'Room temp',
          baseHue: 'Deep cobalt blue',
          silverEffect: 'None',
          transparent: true,
          notes: 'Rod state; no reactivity yet'
        },
        {
          temperature: 300,
          tempRange: 'Low working',
          baseHue: 'Soft sky blue',
          silverEffect: 'Trace',
          transparent: true,
          notes: 'Color begins to shimmer open up'
        },
        {
          temperature: 700,
          tempRange: 'Mid working',
          baseHue: 'Teal / blue-green',
          silverEffect: 'Trace',
          transparent: true,
          notes: 'Base color stable; effects emerging'
        },
        {
          temperature: 900,
          tempRange: 'High working',
          baseHue: 'Blue-green',
          silverEffect: 'Moderate',
          transparent: true,
          notes: 'Approaching peak reactivity'
        },
        {
          temperature: 1000,
          tempRange: 'Over-work zone',
          baseHue: 'Pale teal',
          silverEffect: 'Moderate',
          transparent: true,
          notes: 'Avoid excessive heating'
        }
      ],
      gradient: {
        colors: [
          '#001a4d', // Deep cobalt blue (20°C)
          '#1a5c8f', // Soft sky blue (300°C)
          '#2d8fa8', // Teal (700°C)
          '#3fa8a8', // Blue-green (900°C)
          '#7fbfbf'  // Pale teal (1000°C+)
        ],
        stops: [0, 25, 50, 75, 100]
      }
    },
    
    'slightly-reducing': {
      atmosphere: 'slightly-reducing',
      displayName: 'Slightly Reducing',
      description: 'Mild reducing conditions. Silver effects begin to surface; more dramatic color shifts.',
      phases: [
        {
          temperature: 20,
          tempRange: 'Room temp',
          baseHue: 'Deep cobalt blue',
          silverEffect: 'None',
          transparent: true,
          notes: 'Rod state; no reactivity yet'
        },
        {
          temperature: 300,
          tempRange: 'Low working',
          baseHue: 'Soft sky blue',
          silverEffect: 'Trace',
          transparent: true,
          notes: 'Color begins to shimmer'
        },
        {
          temperature: 700,
          tempRange: 'Mid working',
          baseHue: 'Teal',
          silverEffect: 'Moderate',
          transparent: true,
          notes: 'Silver begins surfacing'
        },
        {
          temperature: 850,
          tempRange: 'Mid-high working',
          baseHue: 'Lime green',
          silverEffect: 'Strong',
          transparent: true,
          notes: 'Primary reactive window; most dramatic shift'
        },
        {
          temperature: 950,
          tempRange: 'High working',
          baseHue: 'Gold amber',
          silverEffect: 'Strong',
          transparent: true,
          notes: 'Maximum color complexity achieved'
        },
        {
          temperature: 1050,
          tempRange: 'Over-work zone',
          baseHue: 'Silver-washed amber',
          silverEffect: 'Moderate',
          transparent: true,
          notes: 'Silver effects begin to fade'
        }
      ],
      gradient: {
        colors: [
          '#001a4d', // Deep cobalt blue (20°C)
          '#1a5c8f', // Soft sky blue (300°C)
          '#2d8fa8', // Teal (700°C)
          '#4db84d', // Lime green (850°C)
          '#d4a574', // Gold amber (950°C)
          '#c9b59a'  // Silver-washed amber (1050°C+)
        ],
        stops: [0, 15, 35, 60, 80, 100]
      }
    },
    
    reducing: {
      atmosphere: 'reducing',
      displayName: 'Reducing',
      description: 'Strong reducing conditions. Maximum silver fuming and dramatic color transformation.',
      phases: [
        {
          temperature: 20,
          tempRange: 'Room temp',
          baseHue: 'Deep cobalt blue',
          silverEffect: 'None',
          transparent: true,
          notes: 'Rod state; no reactivity yet'
        },
        {
          temperature: 300,
          tempRange: 'Low working',
          baseHue: 'Teal',
          silverEffect: 'Trace',
          transparent: true,
          notes: 'Color begins to shift'
        },
        {
          temperature: 700,
          tempRange: 'Mid working',
          baseHue: 'Vivid lime green',
          silverEffect: 'Strong',
          transparent: true,
          notes: 'Dramatic color shift'
        },
        {
          temperature: 850,
          tempRange: 'Mid-high working',
          baseHue: 'Warm gold',
          silverEffect: 'Strong',
          transparent: true,
          notes: 'Primary reactive window'
        },
        {
          temperature: 950,
          tempRange: 'High working',
          baseHue: 'Silver-gold',
          silverEffect: 'Full',
          transparent: true,
          notes: 'Maximum silver fuming visible'
        },
        {
          temperature: 1050,
          tempRange: 'Over-work zone',
          baseHue: 'Faded pale',
          silverEffect: 'Moderate',
          transparent: true,
          notes: 'Silver burns off; avoid excessive heat'
        }
      ],
      gradient: {
        colors: [
          '#001a4d', // Deep cobalt blue (20°C)
          '#2d8fa8', // Teal (300°C)
          '#4db84d', // Vivid lime green (700°C)
          '#d4a040', // Warm gold (850°C)
          '#e8d4a8', // Silver-gold (950°C)
          '#e8e0d4'  // Faded pale (1050°C+)
        ],
        stops: [0, 15, 40, 65, 85, 100]
      }
    }
  }
};

// Color behavior reference table for info panel
export const dragonTearsColorBehaviorTable = [
  {
    phase: 'Cold / Unworked',
    flameType: 'None',
    tempRange: 'Room temp',
    baseHue: 'Deep cobalt blue',
    silverEffect: 'None visible',
    transparent: 'Yes',
    notes: 'Rod state; no reactivity yet'
  },
  {
    phase: 'Initial heat',
    flameType: 'Neutral',
    tempRange: 'Low working',
    baseHue: 'Soft sky blue',
    silverEffect: 'Trace silver',
    transparent: 'Yes',
    notes: 'Color begins to shimmer open up'
  },
  {
    phase: 'Working',
    flameType: 'Neutral flame',
    tempRange: 'Mid working',
    baseHue: 'Teal / blue-green',
    silverEffect: 'Silver begins surfacing',
    transparent: 'Yes',
    notes: 'Base color stable; effects emerging'
  },
  {
    phase: 'Reactive pull',
    flameType: 'Slightly reducing',
    tempRange: 'Mid-high working',
    baseHue: 'Teal to lime green',
    silverEffect: 'Strong silver surface',
    transparent: 'Yes',
    notes: 'Primary reactive window; most dramatic shift'
  },
  {
    phase: 'Peak reaction',
    flameType: 'Reducing',
    tempRange: 'High working',
    baseHue: 'Lime green / gold amber',
    silverEffect: 'Full silver fuming visible',
    transparent: 'Yes',
    notes: 'Maximum color complexity achieved'
  },
  {
    phase: 'Extended kiln',
    flameType: 'Post-flame / kiln',
    tempRange: 'Annealing range',
    baseHue: 'Base blue unchanged',
    silverEffect: 'Effects darken / deepen',
    transparent: 'Yes',
    notes: 'Long kiln times darken silver; base unaffected'
  },
  {
    phase: 'Over-worked',
    flameType: 'Any / excess heat',
    tempRange: 'Above working',
    baseHue: 'Fades toward pale',
    silverEffect: 'Silver burns off',
    transparent: 'Yes',
    notes: 'Loss of reactive effects; avoid'
  }
];
