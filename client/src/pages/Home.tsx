/*
Design philosophy reminder for this file: Scientific Neo-Brutalism blended with furnace-lab instrumentation.
Use asymmetric research slabs, kiln-console labels, temperature rulers, glass-swatch accents, and controlled thermal motion.
When adding UI choices, ask: does this reinforce or dilute the studio-lab evidence dashboard?
*/

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BookOpenCheck,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  Download,
  Flame,
  Gauge,
  Link as LinkIcon,
  Microscope,
  Printer,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Thermometer,
  XCircle,
  Droplet,
  Zap,
} from "lucide-react";

const heroImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/boro_kiln_hero-U6h9yrjg76VvioCvYM78oq.webp";
const curveImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/annealing_curve_visual-7wF7u77k9u6bCc6kdFT9U4.webp";
const colorImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/color_chemistry_samples-34MyKCgBYQyWxfhNBfjt9z.webp";
const appImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/app_landscape_panel-8LdEbFZnqfPHjbnLNSEUDG.webp";

const sourceLinks = [
  { id: 1, label: "Northstar annealing chart", url: "https://northstarglass.com/annealing/" },
  { id: 2, label: "Kiln Helper App Store", url: "https://apps.apple.com/us/app/kiln-helper/id1506041444" },
  { id: 3, label: "TAP Kiln Control Mobile", url: "https://play.google.com/store/apps/details?id=com.sdsindustries.TAPMobile" },
  { id: 4, label: "Northstar reduction guide", url: "https://northstarglass.com/reduction/" },
  { id: 5, label: "My Glass Cookbook kiln designer", url: "https://kiln.myglasscookbook.com/" },
  { id: 6, label: "KilnTrack", url: "https://kilntrack.com/" },
  { id: 7, label: "Skutt KilnLink", url: "https://skutt.com/kilnlink-page/" },
  { id: 8, label: "Northstar heat-sensitive colors", url: "https://northstarglass.com/heat-sensitive-colors/" },
  { id: 9, label: "Glasma annealing calculator", url: "https://glasma.com/annealing-calculator/" },
  { id: 10, label: "Northstar quick guide", url: "https://northstarglass.com/quick-guide/" },
  { id: 11, label: "Super Global Calculator", url: "https://superglobalcalculator.com/calculators/glass-blowing/annealing-schedule/" },
  { id: 12, label: "Bullseye Glass slumping schedules", url: "https://www.bullseyeglass.com/" },
  { id: 13, label: "Double Helix reduction color theory", url: "https://doublehelixglassworks.com/" },
];

const appLandscape = [
  {
    name: "Kiln Helper",
    category: "Fused-glass logbook",
    fit: 42,
    schedule: 70,
    monitoring: 45,
    education: 28,
    color: 18,
    verdict: "Useful for fused-glass records, templates, photos, and sharing; not a boro-specific annealing tutor.",
    source: 2,
  },
  {
    name: "TAP Mobile",
    category: "Controller remote",
    fit: 38,
    schedule: 82,
    monitoring: 88,
    education: 18,
    color: 8,
    verdict: "Strong if the shop owns compatible TAP hardware; public listing does not present color-aware boro instruction.",
    source: 3,
  },
  {
    name: "My Glass Cookbook",
    category: "Fusing schedule designer",
    fit: 36,
    schedule: 85,
    monitoring: 34,
    education: 44,
    color: 12,
    verdict: "Excellent pattern for guided schedule generation, but focused on Bullseye/Oceanside/Wissmach fusing profiles.",
    source: 5,
  },
  {
    name: "KilnTrack",
    category: "Studio management",
    fit: 48,
    schedule: 76,
    monitoring: 35,
    education: 34,
    color: 30,
    verdict: "Broad notebook, schedules, logs, costs, and exports; not a dedicated borosilicate ramp-down curriculum.",
    source: 6,
  },
  {
    name: "Skutt KilnLink",
    category: "Cloud monitoring",
    fit: 31,
    schedule: 47,
    monitoring: 90,
    education: 12,
    color: 5,
    verdict: "Good infrastructure for kiln status, firing history, diagnostics, and alerts; more monitoring than teaching.",
    source: 7,
  },
  {
    name: "Super Global Calculator",
    category: "Annealing calculator",
    fit: 63,
    schedule: 88,
    monitoring: 8,
    education: 54,
    color: 16,
    verdict: "Closest true boro annealing calculator found, but general-purpose and not metal/color-family aware.",
    source: 11,
  },
  {
    name: "Glasma calculator",
    category: "General annealing theory",
    fit: 44,
    schedule: 62,
    monitoring: 5,
    education: 55,
    color: 10,
    verdict: "Good thickness and stress-release framing; public page is not boro lampworking-specific.",
    source: 9,
  },
];

const evidenceScores = [
  { axis: "Boro-specific schedules", current: 44, desired: 95 },
  { axis: "Ramp-down education", current: 38, desired: 92 },
  { axis: "Color-family warnings", current: 16, desired: 96 },
  { axis: "Metal/reduction guidance", current: 12, desired: 94 },
  { axis: "Controller/log integration", current: 58, desired: 82 },
  { axis: "Export/share workflow", current: 64, desired: 88 },
];

const colorFamilies = [
  {
    family: "Cobalt blues",
    chemistry: "Cobalt oxide (CoO, Co₂O₃)",
    risk: "Reduction may dull or gray-streak color",
    kilnNote: "Schedule usually driven by thickness; flame atmosphere is the bigger warning.",
    accent: "#3d6fff",
    source: 4,
  },
  {
    family: "Copper rubies",
    chemistry: "Copper oxide (CuO, Cu₂O) with striking nucleation",
    risk: "Over-reduction can push milky red behavior",
    kilnNote: "Some ruby colors are designed for kiln strike at 1125-1150°F for 60+ minutes.",
    accent: "#d83d36",
    source: 10,
  },
  {
    family: "Silver/exotic colors",
    chemistry: "Silver, gold, and/or copper dissolved in glass matrix",
    risk: "Slight reduction creates metallic hues; prolonged reduction yields earth tones",
    kilnNote: "Requires reset/cool/warm cycle control; may need color-specific experiments.",
    accent: "#50a36a",
    source: 10,
  },
  {
    family: "Amber purple family",
    chemistry: "Copper oxide + chromium oxide striking system",
    risk: "Oxidizing flame supports purples; reduction shifts toward amber/opaque effects",
    kilnNote: "Kiln strike at 1125-1150°F for 60 minutes; oxidizing kiln atmosphere essential.",
    accent: "#a45bd6",
    source: 10,
  },
  {
    family: "Heat-sensitive opaques",
    chemistry: "Tin oxide, titanium oxide, or other opacifiers",
    risk: "Aggressive heat can boil or scar the surface",
    kilnNote: "Teach slow warm-up and gentle flame before kiln schedule choices.",
    accent: "#f2b84b",
    source: 8,
  },
  {
    family: "Lower anneal/strain colors",
    chemistry: "Forest Green, Moss, Blue Spruce (lower transition points)",
    risk: "Anneal/strain points may be 100°F lower than clear/standard colors",
    kilnNote: "A boro app should flag schedule exceptions before firing.",
    accent: "#2dbb9d",
    source: 1,
  },
];

const featureGaps = [
  { feature: "Boro 33-expansion schedule model", available: 2, need: 5 },
  { feature: "Closed-form/effective-thickness logic", available: 1, need: 5 },
  { feature: "Metallic color anneal adjustments", available: 1, need: 5 },
  { feature: "Reduction and flame-chemistry lessons", available: 1, need: 5 },
  { feature: "Color-family searchable database", available: 1, need: 5 },
  { feature: "Exportable schedules and studio notes", available: 4, need: 5 },
];

const scheduleStages = [
  { stage: "Anneal soak", temp: 1050, note: "Clear borosilicate annealing point in Northstar chart.", color: "#f2a63a" },
  { stage: "A/T - 125°F", temp: 925, note: "First below-strain soak becomes more important as thickness increases.", color: "#f6c46d" },
  { stage: "A/T - 200°F", temp: 850, note: "Northstar chart includes a 25% anneal-time soak.", color: "#8dd8ff" },
  { stage: "A/T - 350°F", temp: 700, note: "Additional controlled step helps staged stress release.", color: "#7fbfff" },
  { stage: "A/T - 550°F", temp: 500, note: "Final scheduled soak before cooler descent.", color: "#5c9dff" },
];

const formTypes = [
  {
    type: "Solid form",
    description: "Solid glass mass (sculpture, bead, solid rod)",
    effectiveThickness: "Thickest section governs schedule",
    annealingNote: "Heat must penetrate entire mass; longest cooling times",
    example: "2-inch solid bead: use 8-hour anneal soak",
  },
  {
    type: "Hollow form (open)",
    description: "Hollow with opening (vase, bowl, open vessel)",
    effectiveThickness: "Use actual wall thickness; heat escapes through opening",
    annealingNote: "Faster cooling than closed forms; opening allows air circulation",
    example: "0.5-inch wall open bowl: use 2-hour anneal soak",
  },
  {
    type: "Hollow form (closed)",
    description: "Sealed hollow form (closed sculpture, sealed bubble)",
    effectiveThickness: "Double the wall thickness; interior air traps heat",
    annealingNote: "Interior air pocket acts as insulator; requires longer cooling",
    example: "0.5-inch wall closed form: treat as 1-inch solid (4-hour anneal soak)",
  },
];

const slumpingSchedules = [
  {
    thickness: "Thin (< 3mm)",
    rampUp: "400°F/hour to 1225°F",
    hold: "15-30 minutes",
    coolDown: "Slow ramp to room temp",
    notes: "Faster process; risk of thermal shock if cooled too quickly",
  },
  {
    thickness: "Medium (3-6mm)",
    rampUp: "300°F/hour to 1225°F",
    hold: "30-45 minutes",
    coolDown: "Moderate ramp; avoid rapid cooling",
    notes: "Balanced heating; standard slumping range",
  },
  {
    thickness: "Thick (6mm+)",
    rampUp: "200°F/hour to 1225°F",
    hold: "45-60 minutes",
    coolDown: "Slow ramp down to prevent stress",
    notes: "Slow heating prevents bubbles and devitrification; longest hold times",
  },
];

const flameTypes = [
  {
    name: "Neutral flame",
    appearance: "Even balance of fuel and oxygen; smooth, pointed cone",
    effect: "Preserves metal colors; prevents dulling or graying",
    use: "General working, color preservation, initial gathering",
    metalBehavior: "Keeps metals in oxide form (Ag₂O, CuO)",
  },
  {
    name: "Oxidizing flame",
    appearance: "Hollow areas inside flame; shorter, bluer flame",
    effect: "Burns off surface metals; prevents metallic sheen; brightens colors",
    use: "Cobalt blues, oranges, rubies, heat-sensitive colors",
    metalBehavior: "Oxidizes metals; prevents reduction; maintains vibrant colors",
  },
  {
    name: "Reducing flame",
    appearance: "Stretched, elongated flame with candle-like appearance",
    effect: "Creates metallic sheens; develops striking colors; can muddy if overdone",
    use: "Striking colors, exotics, color development, reduction colors",
    metalBehavior: "Removes oxygen from metal oxides; creates metallic crystals",
  },
];

const strikingProcess = [
  {
    step: "Reset",
    description: "Heat above striking temperature to dissolve metal crystals; glass becomes clear",
    temperature: "Above 1400°F (depends on color)",
    duration: "Until glass is transparent",
    note: "Erases thermal history; allows controlled crystal growth",
  },
  {
    step: "Cool",
    description: "Allow glass to cool; cooling time affects final color",
    temperature: "Room temperature or to visual cues",
    duration: "Shorter = lighter pastels; longer = darker colors",
    note: "Critical step for repeatable color outcomes",
  },
  {
    step: "Warm",
    description: "Gently reheat in neutral flame; metal crystals reform and grow",
    temperature: "Cooler than reset; faint orange glow",
    duration: "45-60 seconds; can repeat for deeper colors",
    note: "Longer warming = lighter pastels; excessive = opaque tones",
  },
];

function sourceRef(id: number) {
  return sourceLinks.find((source) => source.id === id);
}

function Citation({ id }: { id: number }) {
  const source = sourceRef(id);
  if (!source) return null;
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-block ml-1 text-amber-500 hover:text-amber-400 transition-colors">
      [{id}]
    </a>
  );
}

function formatHours(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours % 1 === 0) return `${hours.toFixed(0)} hr`;
  return `${hours.toFixed(1)} hr`;
}

function buildSchedule(thickness: number, closedForm: boolean, metallic: boolean) {
  const effectiveThickness = closedForm ? thickness * 2 : thickness;
  const annealHours = Math.max(0.25, effectiveThickness / 0.25);
  const firstSoak = effectiveThickness <= 0.25 ? annealHours * 0.5 : annealHours;
  const standardSoak = annealHours * 0.25;
  const topTemp = metallic ? 1075 : 1050;
  return {
    effectiveThickness,
    annealHours,
    topTemp,
    total: annealHours + firstSoak + standardSoak * 3,
    rows: [
      { segment: "Anneal soak", temp: topTemp, hold: annealHours, rationale: "Base soak: 1 hour per 0.25 inch effective thickness." },
      { segment: "A/T minus 125°F", temp: topTemp - 125, hold: firstSoak, rationale: effectiveThickness <= 0.25 ? "50% of anneal time for 0.25 inch or thinner." : "100% of anneal time above 0.25 inch." },
      { segment: "A/T minus 200°F", temp: topTemp - 200, hold: standardSoak, rationale: "25% of anneal time." },
      { segment: "A/T minus 350°F", temp: topTemp - 350, hold: standardSoak, rationale: "25% of anneal time." },
      { segment: "A/T minus 550°F", temp: topTemp - 550, hold: standardSoak, rationale: "Final soak before free cooling to room temperature." },
    ],
  };
}

function Finding({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="text-amber-500">{icon}</div>
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-stone-300">{text}</p>
    </div>
  );
}

export default function Home() {
  const [thickness, setThickness] = useState(0.5);
  const [closedForm, setClosedForm] = useState(false);
  const [metallic, setMetallic] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedFlame, setSelectedFlame] = useState(0);

  const schedule = useMemo(() => buildSchedule(thickness, closedForm, metallic), [thickness, closedForm, metallic]);

  const handleShare = () => {
    const text = `Borosilicate Kiln Annealing Research Report\n\nEffective thickness: ${schedule.effectiveThickness.toFixed(2)} inches\nAnneal time: ${formatHours(schedule.annealHours)}\nTotal schedule: ${formatHours(schedule.total)}\n\nView full report: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert("Report copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-amber-500 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-500">◆</span>
            </div>
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">BORO KILN EVIDENCE CONSOLE</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#landscape" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">LANDSCAPE</a>
            <a href="#schedule" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">SCHEDULE</a>
            <a href="#color" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">COLOR</a>
            <a href="#sources" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">SOURCES</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-white/10">
          <img src={heroImage} alt="Borosilicate kiln annealing research" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="relative bg-gradient-to-b from-stone-950/80 to-stone-950 py-20">
            <div className="container max-w-5xl">
              <div className="mb-5 flex items-center gap-2">
                <Microscope size={16} className="text-amber-500" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Research answer</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight text-white mb-7">Is there already an app for boro kiln annealing and color-aware ramp-down training?</h1>
              <p className="text-lg md:text-xl leading-8 text-stone-200 max-w-3xl mb-8">
                <strong>Short answer:</strong> partially, but not completely. Existing tools cover fused-glass schedule logging, kiln-controller monitoring, and general annealing calculation. I did <strong>not</strong> find a dedicated app that teaches borosilicate glassblowers how kiln ramp-down, wall thickness, closed forms, metallic colors, reduction chemistry, and kiln/flame striking interact in one guided workflow.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#schedule" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-sm font-bold uppercase transition-colors">
                  <Calculator size={18} /> Try schedule explorer
                </a>
                <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:border-amber-500 text-stone-300 hover:text-amber-500 font-mono text-sm font-bold uppercase transition-colors">
                  <Share2 size={18} /> Copy/share report
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Research Synthesis */}
        <section className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <BrainCircuit size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Research synthesis</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">What exists, and where the gap remains</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              The market already contains strong fragments: apps for <strong>project logging</strong>, apps for <strong>remote kiln control</strong>, calculators for <strong>general annealing</strong>, and manufacturer pages with <strong>color-family warnings</strong>. The missing product is a boro-specific learning system that turns those fragments into a safe, teachable ramp-down workflow for lampworkers and sculptural borosilicate artists.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <Finding icon={<CheckCircle2 />} title="Closest app category found" text="KilnTrack and Kiln Helper are strong documentation tools, while TAP Mobile and Skutt KilnLink support controller monitoring. None appears to be a dedicated boro color-aware annealing tutor." />
              <Finding icon={<CheckCircle2 />} title="Closest calculator found" text="Super Global Calculator explicitly supports borosilicate annealing inputs, but its public model is general-purpose and does not incorporate boro color families or metal/reduction technique." />
              <Finding icon={<AlertTriangle />} title="Most important educational gap" text="Northstar's technical pages show that annealing, flame atmosphere, striking, reduction, and heat sensitivity must be taught together rather than as separate studio myths." />
              <Finding icon={<AlertTriangle />} title="Practical warning" text="Any app should be positioned as educational planning support, not a substitute for manufacturer instructions, kiln calibration, testing, or professional judgment for high-value work." />
            </div>
          </div>
        </section>

        {/* Hollow vs. Solid Form Annealing */}
        <section className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <Droplet size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Form geometry</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Hollow vs. solid form: effective thickness and cooling</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              The annealing schedule depends not just on wall thickness, but on whether heat must penetrate a solid mass or whether interior air spaces trap heat. Closed hollow forms require doubled effective thickness calculations because the sealed interior acts as a thermal insulator.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {formTypes.map((form, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-500 mb-3">{form.type}</h3>
                  <p className="text-sm text-stone-300 mb-4">{form.description}</p>
                  <div className="space-y-3 text-xs text-stone-400">
                    <div>
                      <span className="font-bold text-white">Effective thickness:</span> {form.effectiveThickness}
                    </div>
                    <div>
                      <span className="font-bold text-white">Annealing note:</span> {form.annealingNote}
                    </div>
                    <div>
                      <span className="font-bold text-amber-500">Example:</span> {form.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Slumping Techniques */}
        <section className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <Thermometer size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Slumping & fusion</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Slumping schedules: thickness-dependent ramp rates</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              Slumping temperatures range from 1200°F (draping) to 1300°F (fire polish). The key variable is ramp rate: thin glass can tolerate 400°F/hour, while thick glass (6mm+) requires 200°F/hour to prevent bubbles and devitrification.
            </p>
            <div className="space-y-4">
              {slumpingSchedules.map((sched, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Thickness</span>
                      <p className="text-sm text-white mt-1">{sched.thickness}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Ramp up</span>
                      <p className="text-sm text-white mt-1">{sched.rampUp}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Hold</span>
                      <p className="text-sm text-white mt-1">{sched.hold}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Cool down</span>
                      <p className="text-sm text-white mt-1">{sched.coolDown}</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 mt-4 pt-4 border-t border-white/10">{sched.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Landscape */}
        <section id="landscape" className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">App landscape</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Existing tools solve adjacent jobs, not the full boro lesson</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              The scoring below is a qualitative fit assessment based on public descriptions. It is not a product endorsement; it shows why the answer is "yes, adjacent apps exist" and "no, the exact app you described does not appear to be common or complete."
            </p>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-3 text-left font-mono font-bold uppercase text-amber-500">Tool</th>
                    <th className="px-4 py-3 text-left font-mono font-bold uppercase text-amber-500">Schedule</th>
                    <th className="px-4 py-3 text-left font-mono font-bold uppercase text-amber-500">Monitor</th>
                    <th className="px-4 py-3 text-left font-mono font-bold uppercase text-amber-500">Educate</th>
                    <th className="px-4 py-3 text-left font-mono font-bold uppercase text-amber-500">Color</th>
                    <th className="px-4 py-3 text-left font-mono font-bold uppercase text-amber-500">Fit</th>
                  </tr>
                </thead>
                <tbody>
                  {appLandscape.map((app, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-mono font-bold">{app.name}</td>
                      <td className="px-4 py-3 text-stone-300">{app.schedule}%</td>
                      <td className="px-4 py-3 text-stone-300">{app.monitoring}%</td>
                      <td className="px-4 py-3 text-stone-300">{app.education}%</td>
                      <td className="px-4 py-3 text-stone-300">{app.color}%</td>
                      <td className="px-4 py-3">
                        <div className="w-12 h-6 rounded-full bg-white/10 relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600 to-amber-500" style={{ width: `${app.fit}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Metal Compositions & Color Chemistry */}
        <section id="color" className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Color & metals</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Why a boro app needs a color-aware knowledge base</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              Color outcomes are not governed by kiln schedule alone. Reduction, oxidation, heat sensitivity, striking behavior, and metal chemistry matter. A useful product should ask what colors are present before recommending a schedule or lesson path. Northstar's color families reveal the metal bases and flame requirements for each.
            </p>
            <div className="space-y-4">
              {colorFamilies.map((family, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: family.accent }} />
                    <div className="flex-1">
                      <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white mb-2">{family.family}</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-amber-500 font-bold">Chemistry:</span> <span className="text-stone-300">{family.chemistry}</span>
                        </div>
                        <div>
                          <span className="text-amber-500 font-bold">Risk:</span> <span className="text-stone-300">{family.risk}</span>
                        </div>
                        <div>
                          <span className="text-amber-500 font-bold">App implication:</span> <span className="text-stone-300">{family.kilnNote}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flame Chemistry */}
        <section className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <Flame size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Flame chemistry</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Neutral, oxidizing, and reducing flames: effects on color and metallics</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              The flame atmosphere directly controls how metals behave inside the glass. A neutral flame preserves colors; oxidizing flames brighten and prevent graying; reducing flames create metallic sheens and develop striking colors. Understanding these three flame types is essential for color-aware annealing education.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {flameTypes.map((flame, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-500 mb-4">{flame.name}</h3>
                  <div className="space-y-3 text-xs text-stone-300">
                    <div>
                      <span className="font-bold text-white block mb-1">Appearance:</span>
                      {flame.appearance}
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-1">Effect:</span>
                      {flame.effect}
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-1">Use case:</span>
                      {flame.use}
                    </div>
                    <div>
                      <span className="font-bold text-white block mb-1">Metal behavior:</span>
                      {flame.metalBehavior}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Striking Color Process */}
        <section className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Striking colors</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Reset, cool, warm: the three-step striking process</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              Striking colors contain metals (silver, gold, copper) dissolved in the glass. The striking process involves three critical steps: reset (erase thermal history), cool (allow crystal nucleation), and warm (grow metal crystals). Timing and temperature control determine final color.
            </p>
            <div className="space-y-4">
              {strikingProcess.map((proc, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Step {idx + 1}</span>
                      <p className="text-sm text-white mt-1 font-bold">{proc.step}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Temperature</span>
                      <p className="text-sm text-white mt-1">{proc.temperature}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Duration</span>
                      <p className="text-sm text-white mt-1">{proc.duration}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold uppercase text-amber-500">Key note</span>
                      <p className="text-sm text-white mt-1">{proc.note}</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-300 mt-4 pt-4 border-t border-white/10">{proc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Explorer */}
        <section id="schedule" className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <Thermometer size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Interactive schedule explorer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Model the Northstar-style ramp-down structure</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              This calculator is an educational visualization of the researched chart, not a firing guarantee. It uses the published rule of <strong>1 hour per 0.25 inch</strong>, doubles wall thickness when "closed form" is enabled, and optionally raises the top anneal point by 25°F for metallic-color exploration. Always verify against your glass manufacturer, kiln calibration, piece geometry, and test firings.
              <Citation id={1} />
            </p>

            <div className="mb-12 overflow-hidden rounded-2xl border border-white/10">
              <img src={curveImage} alt="Technical annealing curve visualization" className="h-72 w-full object-cover opacity-85" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="space-y-8">
                {/* Controls */}
                <div className="space-y-6">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
                      Effective wall/thickest section input
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.05"
                        value={thickness}
                        onChange={(e) => setThickness(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="font-mono text-lg font-bold text-white min-w-20">{thickness.toFixed(2)} in</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setClosedForm(!closedForm)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors ${
                        closedForm
                          ? "bg-amber-600 text-white"
                          : "border border-white/20 text-stone-400 hover:border-amber-500 hover:text-amber-500"
                      }`}
                    >
                      Closed form
                    </button>
                    <button
                      onClick={() => setMetallic(!metallic)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors ${
                        metallic
                          ? "bg-amber-600 text-white"
                          : "border border-white/20 text-stone-400 hover:border-amber-500 hover:text-amber-500"
                      }`}
                    >
                      Metallic colors
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-white/20 text-stone-400 hover:border-amber-500 hover:text-amber-500 font-mono text-xs font-bold uppercase transition-colors">
                      Print
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                  <div>
                    <span className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Effective thickness</span>
                    <span className="block text-2xl font-bold text-white">{schedule.effectiveThickness.toFixed(2)}</span>
                    <span className="block text-xs text-stone-400">inches</span>
                  </div>
                  <div>
                    <span className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Base anneal soak</span>
                    <span className="block text-2xl font-bold text-white">{formatHours(schedule.annealHours)}</span>
                    <span className="block text-xs text-stone-400">at {schedule.topTemp}°F</span>
                  </div>
                  <div>
                    <span className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Scheduled hold time</span>
                    <span className="block text-2xl font-bold text-white">{formatHours(schedule.total)}</span>
                    <span className="block text-xs text-stone-400">total with soaks</span>
                  </div>
                  <div>
                    <span className="block font-mono text-xs font-bold uppercase text-amber-500 mb-2">Cooling rate</span>
                    <span className="block text-2xl font-bold text-white">300°F/hr</span>
                    <span className="block text-xs text-stone-400">minimum</span>
                  </div>
                </div>

                {/* Schedule Table */}
                <div className="pt-8 border-t border-white/10 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-3 py-2 text-left font-mono font-bold uppercase text-amber-500">Segment</th>
                        <th className="px-3 py-2 text-left font-mono font-bold uppercase text-amber-500">Temperature</th>
                        <th className="px-3 py-2 text-left font-mono font-bold uppercase text-amber-500">Hold</th>
                        <th className="px-3 py-2 text-left font-mono font-bold uppercase text-amber-500">Rationale</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="px-3 py-2 font-mono text-white font-bold">{row.segment}</td>
                          <td className="px-3 py-2 text-stone-300">{row.temp}°F</td>
                          <td className="px-3 py-2 text-stone-300">{formatHours(row.hold)}</td>
                          <td className="px-3 py-2 text-stone-400 text-xs">{row.rationale}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Opportunity */}
        <section className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <BookOpenCheck size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Product opportunity</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">If you built one, it should not be "just a calculator"</h2>
            <p className="text-lg leading-8 text-stone-300 mb-12">
              The strongest opportunity is a boro-specific educational companion: part kiln schedule planner, part color database, part firing notebook, and part apprentice-style lesson system. The gaps in current tools are clear.
            </p>
            <div className="space-y-4">
              {featureGaps.map((gap, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">{gap.feature}</h3>
                    <span className="text-xs text-stone-400">
                      {gap.available}/5 coverage
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full ${i < gap.available ? "bg-amber-600" : "bg-white/10"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sources */}
        <section id="sources" className="border-b border-white/10 py-20">
          <div className="container max-w-5xl">
            <div className="mb-5 flex items-center gap-2">
              <LinkIcon size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Sources</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">Research trail</h2>
            <div className="space-y-3">
              {sourceLinks.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-amber-500">[{source.id}]</span>
                  <span className="ml-2 text-sm text-white hover:underline">{source.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Note */}
        <section className="py-20">
          <div className="container max-w-5xl">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8">
              <div className="flex gap-4">
                <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-500 mb-3">Studio safety note</h3>
                  <p className="text-sm leading-relaxed text-stone-300">
                    This page summarizes public sources for research and product-planning purposes. Annealing schedules must be validated against actual glass composition, color manufacturer guidance, kiln calibration, work geometry, and test firings. Do not treat an educational visualization as a safety device or as a guarantee for valuable work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-stone-950/50 py-8">
        <div className="container max-w-5xl">
          <p className="text-xs text-stone-500 text-center">
            Borosilicate Kiln Annealing Research © 2026 · Evidence-based educational resource · Not a substitute for manufacturer guidance
          </p>
        </div>
      </footer>
    </div>
  );
}
