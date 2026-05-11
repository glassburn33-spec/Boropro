# BoroPro - App Redesign
## From Educational Guide to Practical Studio Reference Tool

---

## NEW APP PURPOSE

**BoroPro** is a quick-reference tool for independent glass blowers to look up equipment-specific techniques, material specifications, and real-time decision-making while actively working in the studio.

**NOT** an educational guide or research platform.
**YES** a working reference tool.

---

## CORE MODULES (Simplified)

### 1. **Equipment Reference**
- Kiln models (Skutt, Paragon, etc.) with specific ramp-down schedules
- Torch types (minor, major, reduction, etc.) with flame characteristics
- Glass types (Northstar, Bullseye, etc.) with material specs
- Quick lookup by equipment name

### 2. **Quick Schedules**
- Pre-calculated annealing schedules by glass thickness
- Slumping temperatures by glass type and thickness
- Color-specific adjustments (heat-sensitive, reduction, etc.)
- Copy/paste ready format

### 3. **Material Database**
- Glass color specs (Northstar colors with metal compositions)
- Compatible color combinations (what works together)
- Incompatible combinations (what to avoid)
- Search by color name

### 4. **Technique Checklist**
- Flame annealing steps for thin-wall work
- Reduction flame procedure
- Oxidizing flame procedure
- Neutral flame procedure
- Step-by-step checklists

### 5. **My Projects**
- Save current project specs (glass types, colors, thickness)
- Auto-generate schedule for saved project
- Quick access to frequently used combinations
- Notes on what worked/didn't work

### 6. **Quick Calculators**
- Annealing time calculator (by glass thickness)
- Cooling rate calculator
- Effective thickness calculator (hollow vs. solid)
- Temperature converter (F to C)

---

## USER INTERFACE DESIGN

### Navigation
- **Bottom tab bar** (mobile-first design)
  - 🔍 Equipment
  - 📋 Schedules
  - 🎨 Colors
  - ✓ Checklists
  - 💾 My Projects

### Each Module
- **Search/Filter** at top (quick lookup)
- **Results** in card format (scannable)
- **Copy button** (copy to clipboard)
- **Favorite button** (save for quick access)
- **Notes** (add personal notes)

### Design Philosophy
- **Minimal text** - Use tables, icons, numbers
- **High contrast** - Easy to read in bright studio lighting
- **Large touch targets** - Easy to tap with gloved hands
- **Dark theme** - Less eye strain in studio
- **Offline-first** - Works without internet

---

## DATA STRUCTURE

### Equipment Database
```
{
  id: "skutt-1227",
  name: "Skutt KilnMaster 1227",
  type: "kiln",
  specs: {
    maxTemp: 2300,
    capacity: "27 cu in",
    controlType: "digital"
  },
  schedules: [
    {
      glassType: "borosilicate",
      thickness: "3mm",
      steps: [
        { temp: 1050, hold: 30, rampRate: 3 },
        { temp: 200, hold: 0, rampRate: 1 }
      ]
    }
  ]
}
```

### Color Database
```
{
  id: "ns-cobalt-blue",
  name: "Cobalt Blue",
  manufacturer: "Northstar",
  metalComposition: "Cobalt oxide (CoO)",
  annealing: { minTemp: 1020, maxTemp: 1050 },
  compatibility: ["silver-exotic", "copper-ruby"],
  incompatibility: ["heat-sensitive-opaque"],
  notes: "Stable color, good for reduction"
}
```

### Schedule Database
```
{
  id: "schedule-boro-3mm",
  glassType: "borosilicate",
  thickness: "3mm",
  form: "solid",
  steps: [
    { name: "Anneal", temp: 1050, hold: 30, rampRate: 3 },
    { name: "Cool to Strain Point", temp: 900, rampRate: 2 },
    { name: "Cool to Room Temp", temp: 200, rampRate: 1 }
  ],
  estimatedTime: "4-6 hours"
}
```

---

## PAGES/SCREENS

### 1. Equipment Reference
- **Search bar** at top
- **Filter by type** (kiln, torch, glass)
- **Cards** showing:
  - Equipment name
  - Key specs
  - Favorite button
  - View details button

**Details page:**
- Full specs
- Available schedules
- Recommended settings
- Notes from other users (optional)

### 2. Quick Schedules
- **Filter by:**
  - Glass type (Northstar, Bullseye, etc.)
  - Thickness (1mm, 2mm, 3mm, etc.)
  - Form (solid, hollow)
  - Kiln model
- **Schedule cards** showing:
  - Glass type + thickness
  - Annealing temp
  - Hold time
  - Ramp rates
  - **Copy button** (copy all steps)
  - **Favorite button**

### 3. Material Database
- **Search by color name**
- **Filter by:**
  - Manufacturer (Northstar, Bullseye, etc.)
  - Color family (blues, reds, etc.)
  - Properties (heat-sensitive, reduction, etc.)
- **Color cards** showing:
  - Color name
  - Metal composition
  - Annealing range
  - Compatibility
  - **Copy specs button**

### 4. Technique Checklists
- **Flame Annealing**
  - ☐ Step 1: Prepare workspace
  - ☐ Step 2: Set up torch
  - ☐ Step 3: Adjust flame to neutral
  - ☐ Step 4: Begin annealing
  - (etc.)
- **Reduction Flame**
  - ☐ Step 1: Adjust torch...
  - (etc.)
- **Oxidizing Flame**
  - ☐ Step 1: Adjust torch...
  - (etc.)

### 5. My Projects
- **Create new project**
  - Project name
  - Glass types (multi-select)
  - Colors (multi-select)
  - Thickness
  - Kiln model
  - Notes
- **Project cards** showing:
  - Project name
  - Glass types
  - Auto-generated schedule
  - Last modified date
  - **View schedule button**
  - **Edit button**
  - **Delete button**

### 6. Quick Calculators
- **Annealing Time Calculator**
  - Input: Glass thickness
  - Output: Estimated time
- **Cooling Rate Calculator**
  - Input: Glass thickness, kiln type
  - Output: Recommended cooling rate
- **Effective Thickness Calculator**
  - Input: Wall thickness, form (hollow/solid)
  - Output: Effective thickness for annealing
- **Temperature Converter**
  - Input: Fahrenheit or Celsius
  - Output: Converted temperature

---

## CORE FEATURES

### Must-Have
- ✅ Equipment lookup (kiln, torch, glass)
- ✅ Schedule lookup by thickness
- ✅ Color compatibility checker
- ✅ Quick copy-to-clipboard
- ✅ Favorites/bookmarks
- ✅ Offline access
- ✅ Dark theme
- ✅ Mobile-optimized

### Nice-to-Have
- 📱 My Projects (save custom combinations)
- 📊 Quick calculators
- ✓ Checklists
- 📝 Personal notes
- 🔄 Sync across devices (requires backend)
- 📤 Export schedule as PDF
- 🔔 Reminders (requires backend)

---

## DATA SOURCES

### Equipment Specs
- Skutt kiln manuals
- Paragon kiln manuals
- Torch manufacturer specs
- Glass manufacturer datasheets

### Schedules
- Northstar Glass annealing charts
- Bullseye Glass schedules
- Industry standard practices
- User-contributed data (optional)

### Colors
- Northstar color catalog
- Bullseye color catalog
- Metal composition data
- Compatibility matrix

---

## DESIGN PRINCIPLES

1. **Scannable** - Users should find info in 3 seconds
2. **Copy-friendly** - Easy to copy specs to clipboard
3. **Offline-first** - Works without internet
4. **Glove-friendly** - Large touch targets
5. **Studio-appropriate** - Dark theme, high contrast
6. **Minimal reading** - Tables > paragraphs
7. **Action-oriented** - Every screen has a clear action
8. **Customizable** - Users can save favorites and notes

---

## TECHNICAL STACK

- **Frontend:** React 19 + Tailwind CSS
- **Storage:** LocalStorage (offline-first)
- **Data:** JSON database (embedded in app)
- **Deployment:** Static web app (no backend needed initially)
- **Mobile:** Capacitor for Android/iOS

---

## NEXT STEPS

1. **Create equipment database** (kiln models, torch types, glass types)
2. **Create schedule database** (pre-calculated by thickness)
3. **Create color database** (Northstar + Bullseye colors)
4. **Build UI components** (search, filter, cards, copy buttons)
5. **Implement pages** (Equipment, Schedules, Colors, Checklists, Projects)
6. **Test with glass blowers** (get feedback on usability)
7. **Optimize for mobile** (ensure glove-friendly)
8. **Deploy to Play Store**

---

## SUCCESS METRICS

- Users can find a schedule in < 10 seconds
- Users can copy specs without friction
- App works offline
- Users save frequently-used combinations
- Users refer to app while actively working
- App reduces time spent searching for specs
