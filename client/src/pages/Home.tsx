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
    chemistry: "Cobalt colorants",
    risk: "Reduction may dull or gray-streak color",
    kilnNote: "Schedule usually driven by thickness; flame atmosphere is the bigger warning.",
    accent: "#3d6fff",
    source: 4,
  },
  {
    family: "Copper rubies",
    chemistry: "Copper-bearing striking colors",
    risk: "Over-reduction can push milky red behavior",
    kilnNote: "Some ruby colors are designed for kiln strike or flame strike, depending on product.",
    accent: "#d83d36",
    source: 10,
  },
  {
    family: "Silver/exotic colors",
    chemistry: "Silver-base/exotic striking systems",
    risk: "Slight reduction can create metallic hues; prolonged reduction can move toward earth tones or fogging",
    kilnNote: "May require color-specific experiments and saved firing records.",
    accent: "#50a36a",
    source: 10,
  },
  {
    family: "Amber purple family",
    chemistry: "Striking/reduction-sensitive family",
    risk: "Oxidizing flame supports purples; reduction can shift toward amber/opaque sea-green effects",
    kilnNote: "Useful app feature: intentional effect selector with warnings.",
    accent: "#a45bd6",
    source: 10,
  },
  {
    family: "Heat-sensitive opaques",
    chemistry: "Low-boiling-point oxide systems",
    risk: "Aggressive heat can boil or scar the surface",
    kilnNote: "Teach slow warm-up and gentle flame before kiln schedule choices.",
    accent: "#f2b84b",
    source: 8,
  },
  {
    family: "Lower anneal/strain colors",
    chemistry: "Examples cited by Northstar include Forest Green, Moss, Blue Spruce",
    risk: "Anneal/strain points may be about 100°F lower than clear/standard colors",
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

function sourceRef(id: number) {
  return sourceLinks.find((source) => source.id === id);
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
      { segment: "A/T minus 550°F", temp: topTemp - 550, hold: standardSoak, rationale: "25% of anneal time." },
    ],
  };
}

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(appLandscape[5]);
  const [thickness, setThickness] = useState(0.5);
  const [closedForm, setClosedForm] = useState(false);
  const [metallic, setMetallic] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(colorFamilies[2]);

  const categories = ["All", ...Array.from(new Set(appLandscape.map((item) => item.category)))];
  const filteredApps = filter === "All" ? appLandscape : appLandscape.filter((item) => item.category === filter);
  const schedule = useMemo(() => buildSchedule(thickness, closedForm, metallic), [thickness, closedForm, metallic]);

  const curveData = schedule.rows.map((row, index) => ({
    step: index + 1,
    label: row.segment,
    temperature: row.temp,
    hold: Number(row.hold.toFixed(2)),
  }));

  const fitChart = appLandscape.map((app) => ({ name: app.name.replace("Super Global ", "SG "), fit: app.fit, color: app.color }));

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "Borosilicate Kiln App Research", url }).catch(() => undefined);
    } else {
      navigator.clipboard?.writeText(url);
      window.alert("Page link copied to clipboard.");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="hero-shell relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Borosilicate kiln studio with colored rods" className="h-full w-full object-cover opacity-62" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,12,.94),rgba(8,10,12,.76)_44%,rgba(8,10,12,.34))]" />
          <div className="temperature-grid" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-5 py-5 md:px-10">
          <a href="#top" className="brand-mark" aria-label="Borosilicate kiln research home">
            <span className="brand-orb" />
            <span>Boro Kiln Evidence Console</span>
          </a>
          <div className="hidden gap-3 lg:flex">
            {["Landscape", "Schedule", "Color", "Sources"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-chip">
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div id="top" className="relative z-10 container grid min-h-[760px] items-end gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_.9fr]">
          <div className="max-w-5xl">
            <div className="console-label mb-5"><Microscope size={16} /> Research answer</div>
            <h1 className="hero-title">Is there already an app for boro kiln annealing and color-aware ramp-down training?</h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-stone-200 md:text-2xl">
              <strong>Short answer:</strong> partially, but not completely. Existing tools cover fused-glass schedule logging, kiln-controller monitoring, and general annealing calculation. I did <strong>not</strong> find a dedicated app that teaches borosilicate glassblowers how kiln ramp-down, wall thickness, closed forms, metallic colors, reduction chemistry, and kiln/flame striking interact in one guided workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#schedule" className="action-button primary"><Calculator size={18} /> Try schedule explorer</a>
              <button onClick={handleShare} className="action-button secondary"><Share2 size={18} /> Copy/share report</button>
            </div>
          </div>

          <aside className="evidence-card glass-card">
            <div className="console-label"><Thermometer size={16} /> Key technical anchor</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric value="1050°F" label="clear boro annealing temperature" />
              <Metric value="960°F" label="clear boro strain temperature" />
              <Metric value="1 hr" label="per 0.25 in thickness" />
              <Metric value="+25°F" label="possible metallic-color adjustment" />
            </div>
            <p className="mt-5 text-sm leading-6 text-stone-300">
              Northstar’s chart also notes that closed forms should be treated as doubled wall thickness, some colors require schedule changes, and certain green/blue colors may sit roughly 100°F lower than standard clear-boro assumptions.
              <Citation id={1} />
            </p>
          </aside>
        </div>
      </section>

      <section className="section-slab border-t border-white/10 bg-[#101010] py-16">
        <div className="container grid gap-8 lg:grid-cols-[.78fr_1.22fr]">
          <div className="sticky-panel">
            <div className="console-label"><BrainCircuit size={16} /> Research synthesis</div>
            <h2 className="section-title mt-5">What exists, and where the gap remains</h2>
            <p className="research-copy mt-5">
              The market already contains strong fragments: apps for <strong>project logging</strong>, apps for <strong>remote kiln control</strong>, calculators for <strong>general annealing</strong>, and manufacturer pages with <strong>color-family warnings</strong>. The missing product is a boro-specific learning system that turns those fragments into a safe, teachable ramp-down workflow for lampworkers and sculptural borosilicate artists.
            </p>
          </div>
          <div className="findings-grid">
            <Finding icon={<CheckCircle2 />} title="Closest app category found" text="KilnTrack and Kiln Helper are strong documentation tools, while TAP Mobile and Skutt KilnLink support controller monitoring. None appears to be a dedicated boro color-aware annealing tutor." />
            <Finding icon={<Calculator />} title="Closest calculator found" text="Super Global Calculator explicitly supports borosilicate annealing inputs, but its public model is general-purpose and does not incorporate boro color families or metal/reduction technique." />
            <Finding icon={<Flame />} title="Most important educational gap" text="Northstar’s technical pages show that annealing, flame atmosphere, striking, reduction, and heat sensitivity must be taught together rather than as separate studio myths." />
            <Finding icon={<AlertTriangle />} title="Practical warning" text="Any app should be positioned as educational planning support, not a substitute for manufacturer instructions, kiln calibration, testing, or professional judgment for high-value work." />
          </div>
        </div>
      </section>

      <section id="landscape" className="section-slab py-20">
        <div className="container">
          <div className="mb-8 grid gap-7 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <div className="console-label"><SlidersHorizontal size={16} /> App landscape</div>
              <h2 className="section-title mt-5">Existing tools solve adjacent jobs, not the full boro lesson.</h2>
            </div>
            <p className="research-copy self-end">
              The scoring below is a qualitative fit assessment based on public descriptions. It is not a product endorsement; it shows why the answer is “yes, adjacent apps exist” and “no, the exact app you described does not appear to be common or complete.”
            </p>
          </div>

          <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-black/30">
            <img src={appImage} alt="Abstract kiln-app comparison interface" className="h-72 w-full object-cover opacity-90" />
          </div>

          <div className="grid gap-8 xl:grid-cols-[.72fr_1.28fr]">
            <div className="glass-card p-5">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button key={category} onClick={() => setFilter(category)} className={`filter-chip ${filter === category ? "active" : ""}`}>
                    {category}
                  </button>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {filteredApps.map((app) => (
                  <button key={app.name} onClick={() => setSelectedApp(app)} className={`app-row ${selectedApp.name === app.name ? "active" : ""}`}>
                    <span>
                      <strong>{app.name}</strong>
                      <small>{app.category}</small>
                    </span>
                    <span className="fit-meter">{app.fit}% fit</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 md:p-7">
              <div className="grid gap-8 lg:grid-cols-[1fr_.95fr]">
                <div>
                  <div className="console-label"><Gauge size={16} /> Selected tool</div>
                  <h3 className="mt-4 text-3xl font-black text-stone-50">{selectedApp.name}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[.24em] text-amber-300">{selectedApp.category}</p>
                  <p className="mt-5 text-lg leading-8 text-stone-300">{selectedApp.verdict}</p>
                  <a href={sourceRef(selectedApp.source)?.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 underline-offset-4 hover:underline">
                    <LinkIcon size={15} /> View source: {sourceRef(selectedApp.source)?.label}
                  </a>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: "Schedule", value: selectedApp.schedule },
                      { metric: "Monitoring", value: selectedApp.monitoring },
                      { metric: "Education", value: selectedApp.education },
                      { metric: "Color", value: selectedApp.color },
                      { metric: "Boro fit", value: selectedApp.fit },
                    ]}>
                      <PolarGrid stroke="rgba(255,255,255,.18)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "#e9ddc9", fontSize: 11 }} />
                      <Radar name="Score" dataKey="value" stroke="#f1a33a" fill="#f1a33a" fillOpacity={0.35} />
                      <Tooltip contentStyle={{ background: "#121212", border: "1px solid rgba(255,255,255,.18)", color: "#fff" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 chart-card">
            <div className="chart-heading">
              <h3>Qualitative boro-training fit by tool</h3>
              <span>0 = unrelated, 100 = close to requested app</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fitChart} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <CartesianGrid stroke="rgba(255,255,255,.09)" vertical={false} />
                  <XAxis dataKey="name" angle={-18} textAnchor="end" interval={0} tick={{ fill: "#d8ccba", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#d8ccba", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,.16)", color: "#fff" }} />
                  <Bar dataKey="fit" radius={[10, 10, 0, 0]}>
                    {fitChart.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color > 20 ? "#f1a33a" : "#6ea8ff"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="section-slab bg-[#0d1112] py-20">
        <div className="container grid gap-9 xl:grid-cols-[.92fr_1.08fr]">
          <div>
            <div className="console-label"><Thermometer size={16} /> Interactive schedule explorer</div>
            <h2 className="section-title mt-5">Model the Northstar-style ramp-down structure.</h2>
            <p className="research-copy mt-5">
              This calculator is an educational visualization of the researched chart, not a firing guarantee. It uses the published rule of <strong>1 hour per 0.25 inch</strong>, doubles wall thickness when “closed form” is enabled, and optionally raises the top anneal point by 25°F for metallic-color exploration. Always verify against your glass manufacturer, kiln calibration, piece geometry, and test firings.
              <Citation id={1} />
            </p>
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/10">
              <img src={curveImage} alt="Technical annealing curve visualization" className="h-72 w-full object-cover opacity-85" />
            </div>
          </div>

          <div className="glass-card p-5 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="control-block md:col-span-2">
                <span>Effective wall/thickest section input</span>
                <strong>{thickness.toFixed(2)} in</strong>
                <input min="0.125" max="2" step="0.125" type="range" value={thickness} onChange={(event) => setThickness(Number(event.target.value))} />
              </label>
              <Toggle enabled={closedForm} onClick={() => setClosedForm(!closedForm)} title="Closed form" text="Treat wall thickness as doubled" />
              <Toggle enabled={metallic} onClick={() => setMetallic(!metallic)} title="Metallic colors" text="Show +25°F exploratory top soak" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Metric value={`${schedule.effectiveThickness.toFixed(2)} in`} label="effective thickness" />
              <Metric value={formatHours(schedule.annealHours)} label="base anneal soak" />
              <Metric value={formatHours(schedule.total)} label="scheduled hold time" />
            </div>

            <div className="mt-8 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curveData} margin={{ top: 10, right: 18, left: -12, bottom: 10 }}>
                  <CartesianGrid stroke="rgba(255,255,255,.09)" />
                  <XAxis dataKey="step" tick={{ fill: "#d8ccba", fontSize: 12 }} />
                  <YAxis domain={[450, 1100]} tick={{ fill: "#d8ccba", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,.16)", color: "#fff" }} formatter={(value, name) => [name === "temperature" ? `${value}°F` : `${value} hr`, name]} />
                  <Line type="monotone" dataKey="temperature" stroke="#f1a33a" strokeWidth={3} dot={{ r: 5, fill: "#f1a33a" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="schedule-table">
                <thead>
                  <tr><th>Segment</th><th>Temp</th><th>Hold</th><th>Reason</th></tr>
                </thead>
                <tbody>
                  {schedule.rows.map((row) => (
                    <tr key={row.segment}>
                      <td>{row.segment}</td>
                      <td>{row.temp}°F</td>
                      <td>{formatHours(row.hold)}</td>
                      <td>{row.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="color" className="section-slab py-20">
        <div className="container grid gap-9 xl:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="console-label"><Sparkles size={16} /> Color and metals</div>
            <h2 className="section-title mt-5">Why a boro app needs a color-aware knowledge base.</h2>
            <p className="research-copy mt-5">
              Northstar’s guidance shows that color outcomes are not governed by kiln schedule alone. Reduction, oxidation, heat sensitivity, striking behavior, and metal chemistry matter. A useful product should ask what colors are present before recommending a schedule or lesson path.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {colorFamilies.map((family) => (
                <button key={family.family} onClick={() => setSelectedFamily(family)} className={`family-chip ${selectedFamily.family === family.family ? "active" : ""}`} style={{ ["--chip" as string]: family.accent }}>
                  <span className="swatch" />
                  <strong>{family.family}</strong>
                </button>
              ))}
            </div>

            <div className="mt-8 color-detail">
              <div className="console-label"><Flame size={16} /> Selected color-family note</div>
              <h3>{selectedFamily.family}</h3>
              <p><strong>Chemistry lens:</strong> {selectedFamily.chemistry}</p>
              <p><strong>Main risk:</strong> {selectedFamily.risk}</p>
              <p><strong>App implication:</strong> {selectedFamily.kilnNote}</p>
              <a href={sourceRef(selectedFamily.source)?.url} target="_blank" rel="noreferrer"><LinkIcon size={15} /> Source: {sourceRef(selectedFamily.source)?.label}</a>
            </div>
          </div>

          <div className="space-y-7">
            <div className="overflow-hidden rounded-[2rem] border border-white/10">
              <img src={colorImage} alt="Borosilicate color sample marbles and rods" className="h-[420px] w-full object-cover" />
            </div>
            <div className="chart-card">
              <div className="chart-heading">
                <h3>Current tool coverage vs. desired boro-learning app</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evidenceScores} margin={{ top: 10, right: 20, left: -18, bottom: 55 }}>
                    <defs>
                      <linearGradient id="current" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6ea8ff" stopOpacity={0.55}/>
                        <stop offset="95%" stopColor="#6ea8ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="desired" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f1a33a" stopOpacity={0.55}/>
                        <stop offset="95%" stopColor="#f1a33a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,.08)" />
                    <XAxis dataKey="axis" angle={-22} textAnchor="end" interval={0} tick={{ fill: "#d8ccba", fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#d8ccba", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,.16)", color: "#fff" }} />
                    <Area type="monotone" dataKey="desired" stroke="#f1a33a" fill="url(#desired)" strokeWidth={2} />
                    <Area type="monotone" dataKey="current" stroke="#6ea8ff" fill="url(#current)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-slab bg-[#11100e] py-20">
        <div className="container grid gap-9 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <div className="console-label"><BookOpenCheck size={16} /> Product opportunity</div>
            <h2 className="section-title mt-5">If you built one, it should not be “just a calculator.”</h2>
            <p className="research-copy mt-5">
              The strongest opportunity is a boro-specific educational companion: part kiln schedule planner, part color database, part firing notebook, and part apprentice-style lesson system.
            </p>
          </div>
          <div className="gap-table">
            {featureGaps.map((gap) => (
              <div className="gap-row" key={gap.feature}>
                <div>
                  <strong>{gap.feature}</strong>
                  <span>Existing public-tool coverage: {gap.available}/5 · Desired: {gap.need}/5</span>
                </div>
                <div className="bar-track" aria-hidden="true">
                  <i style={{ width: `${gap.available * 20}%` }} />
                  <b style={{ width: `${gap.need * 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sources" className="section-slab py-20">
        <div className="container">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="console-label"><LinkIcon size={16} /> Sources</div>
              <h2 className="section-title mt-5">Research trail</h2>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="action-button secondary"><Printer size={17} /> Print</button>
              <button onClick={handleShare} className="action-button secondary"><Download size={17} /> Save/share</button>
            </div>
          </div>
          <div className="source-grid">
            {sourceLinks.map((source) => (
              <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="source-card">
                <span>[{source.id}]</span>
                <strong>{source.label}</strong>
                <small>{source.url.replace("https://", "")}</small>
              </a>
            ))}
          </div>
          <div className="mt-10 rounded-[2rem] border border-amber-300/25 bg-amber-300/8 p-6 text-stone-200">
            <div className="mb-3 flex items-center gap-2 font-black text-amber-200"><AlertTriangle size={18} /> Studio safety note</div>
            <p className="leading-7">
              This page summarizes public sources for research and product-planning purposes. Annealing schedules must be validated against actual glass composition, color manufacturer guidance, kiln calibration, work geometry, and test firings. Do not treat an educational visualization as a safety device or as a guarantee for valuable work.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric-tile">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Finding({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="finding-card">
      <div>{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Toggle({ enabled, onClick, title, text }: { enabled: boolean; onClick: () => void; title: string; text: string }) {
  return (
    <button onClick={onClick} className={`toggle-card ${enabled ? "active" : ""}`}>
      {enabled ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
      <span><strong>{title}</strong><small>{text}</small></span>
    </button>
  );
}

function Citation({ id }: { id: number }) {
  const source = sourceRef(id);
  if (!source) return null;
  return (
    <a href={source.url} target="_blank" rel="noreferrer" className="citation" aria-label={`Source ${id}: ${source.label}`}>
      [{id}]
    </a>
  );
}
