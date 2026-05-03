# Development Plan: Interactive Features for Borosilicate Kiln Research

## Feature 1: Flame-Type Simulator

### Purpose
Interactive visualization showing how neutral, oxidizing, and reducing flames appear and affect specific borosilicate colors in real-time.

### Components
- **Flame visualization canvas**: SVG-based flame animation showing three flame types side-by-side
- **Color selector**: Dropdown to choose a specific Northstar color family
- **Real-time effect display**: Shows how the selected color behaves under each flame type
- **Educational annotations**: Explains the chemistry and visual cues for each flame

### Data Structure
```typescript
interface FlameSimulation {
  flameType: 'neutral' | 'oxidizing' | 'reducing';
  appearance: string; // Visual description
  colorEffects: {
    [colorFamily: string]: {
      visualChange: string;
      metalBehavior: string;
      riskFactors: string[];
    };
  };
}
```

### Implementation Details
- Use CSS animations or SVG paths to simulate flame movement
- Color preview boxes show before/after appearance
- Tooltips explain the chemical process at each step
- Responsive grid layout for mobile viewing

---

## Feature 2: Color-Picker Tool with Combined Scheduling

### Purpose
Allow users to select multiple Northstar colors from their current project, then generate a combined annealing schedule with warnings and recommendations.

### Components
- **Color multi-select interface**: Checkbox list of all Northstar color families
- **Schedule conflict detection**: Identifies incompatible color combinations
- **Combined schedule generator**: Creates a schedule that accommodates all selected colors
- **Warning system**: Flags heat-sensitive colors, reduction-sensitive colors, etc.
- **Export/save functionality**: Download or save the generated schedule

### Data Structure
```typescript
interface ColorSelection {
  selectedColors: string[];
  conflicts: {
    color1: string;
    color2: string;
    issue: string;
  }[];
  recommendedSchedule: {
    annealTemp: number;
    annealTime: number;
    warnings: string[];
    rationale: string;
  };
}
```

### Implementation Details
- Store color metadata (heat sensitivity, reduction behavior, anneal/strain points)
- Algorithm to find optimal anneal temperature that works for all selected colors
- Visual warning badges for each conflict
- Suggested adjustments (e.g., "Lower anneal to 1025°F for heat-sensitive opaques")

---

## Feature 3: Test-Firing Tracker with Historical Comparison

### Purpose
Allow users to log test-firing results, track outcomes over time, and compare data across multiple firings to identify patterns and improve technique.

### Components
- **Firing log form**: Input fields for date, colors used, schedule parameters, kiln notes, outcome
- **Result storage**: Browser localStorage or cloud sync (if upgraded to full-stack)
- **Historical chart**: Time-series visualization showing color outcomes, temperature variations, etc.
- **Comparison view**: Side-by-side analysis of multiple test firings
- **Pattern detection**: Highlights trends (e.g., "Cobalt blues consistently darker when anneal time > 4 hours")

### Data Structure
```typescript
interface TestFiringRecord {
  id: string;
  date: string;
  colorsUsed: string[];
  schedule: {
    annealTemp: number;
    annealTime: number;
    flameType: 'neutral' | 'oxidizing' | 'reducing';
  };
  kiln: {
    model: string;
    calibration: string;
  };
  outcome: {
    colorAccuracy: 'excellent' | 'good' | 'fair' | 'poor';
    notes: string;
    photos?: string[]; // URLs to uploaded images
  };
  metadata: {
    glassThickness: number;
    formType: 'solid' | 'hollow-open' | 'hollow-closed';
    strikeMethod: 'kiln' | 'flame' | 'none';
  };
}
```

### Implementation Details
- Form validation to ensure required fields are filled
- LocalStorage for persistence (survives page refresh)
- Chart.js or Recharts for time-series visualization
- Filter/sort by color, date range, outcome quality
- Export to CSV for external analysis

---

## Integration Strategy

### New Pages/Routes
1. **`/flame-simulator`**: Interactive flame visualization tool
2. **`/color-picker`**: Multi-select color tool with schedule generation
3. **`/firing-tracker`**: Test-firing log and historical analysis

### Navigation Updates
- Add links to new tools in the main header
- Create a "Tools" section in the navigation menu
- Add contextual links from the research sections to relevant tools

### Data Sharing
- Color picker can reference the same color database as the flame simulator
- Firing tracker can suggest schedules based on color picker output
- Flame simulator can show effects of colors logged in the firing tracker

---

## Technical Stack

### Frontend Libraries
- **React hooks**: useState, useEffect, useContext for state management
- **Recharts**: Time-series charts for firing tracker
- **Lucide React**: Icons throughout the interface
- **Tailwind CSS**: Responsive styling
- **LocalStorage API**: Persistent data storage for firing logs

### Data Persistence
- **Phase 1**: Browser localStorage (no backend required)
- **Phase 2 (optional)**: Upgrade to web-db-user for cloud sync and multi-device access

---

## Development Timeline

| Phase | Task | Estimated Time |
|-------|------|-----------------|
| 1 | Flame simulator UI and animations | 2-3 hours |
| 2 | Color picker with conflict detection | 2-3 hours |
| 3 | Firing tracker with localStorage | 2-3 hours |
| 4 | Integration and testing | 1-2 hours |
| 5 | Delivery and documentation | 30 min |

---

## Success Criteria

- Flame simulator accurately represents the three flame types and their effects on colors
- Color picker generates valid schedules and flags all conflicts
- Firing tracker stores and retrieves data reliably
- All features are responsive and work on mobile devices
- Time-series charts load quickly and display data clearly
- Users can export/save their data for external use
