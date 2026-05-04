/*
BoroPro - Practical Glass Blower Reference Tool
Design: Studio-focused, minimal reading, maximum usability
Dark theme for studio environment, large touch targets for gloved hands
*/

import { useState, useEffect } from "react";
import { Home as HomeIcon, Zap, Calculator, Palette, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { torchDatabase } from "@/data/torches_expanded";
import { glassColors, getColorsByManufacturer, getManufacturers } from "@/data/glass_colors";
import { searchContent, SearchResult } from "@/lib/searchIndex";
import { SearchResults } from "@/components/SearchResults";
import { CalculatorTab as ThermalCalculatorTab } from "./CalculatorTab";

type TabType = "studio" | "equipment" | "calculator" | "colors";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("studio");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleTabChange = (tab: TabType) => {
    try {
      setActiveTab(tab);
    } catch (error) {
      console.error("Error changing tab:", error);
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      const results = searchContent(value);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } else if (e.key === "Escape") {
      setShowSearchResults(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // Navigate to appropriate tab based on result type
    if (result.type === "torch" || result.type === "kiln") {
      setActiveTab("equipment");
    } else if (result.type === "color") {
      setActiveTab("colors");
    } else if (result.type === "schedule") {
      setActiveTab("calculator");
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          "input[placeholder*='Search']"
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      } else if (e.key === "Escape") {
        setShowSearchResults(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [headerImage, setHeaderImage] = useState<string>("/manus-storage/Gemini_Generated_Image_c4yvpac4yvpac4yv(1)_6eb6caaf.png");

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setHeaderImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* UNIFIED FIXED HEADER BLOCK */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-900 border-b border-amber-700/30">
        {/* ROW 1: Logo and Header Image */}
        <div className="flex items-center h-48 px-4">
          {/* Logo on left */}
          <img src="/manus-storage/Boroprologo_c1368bc1.png" alt="BoroPro Logo" className="h-48 w-48 flex-shrink-0" />
          
          {/* Header image placeholder on right */}
          <div className="flex-1 h-full flex items-center justify-center bg-stone-800 border border-dashed border-amber-700/50 ml-4 relative overflow-hidden">
            {headerImage ? (
              <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-stone-700/50 transition">
                <span className="text-stone-400 text-sm">Click to add header image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderImageUpload}
                  className="hidden"
                />
              </label>
            )}
            {headerImage && (
              <button
                onClick={() => setHeaderImage("")}
                className="absolute top-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-stone-300 px-2 py-1 text-xs rounded"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: Navigation Tabs and Search - Embedded in Fixed Header */}
        <div className="bg-stone-900 border-t border-amber-700/30 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Search equipment, schedules, colors... (Cmd+K)"
                className="bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 h-9 flex-1"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={handleSearch}
              />
              <Button
                onClick={() => {
                  if (searchQuery.trim()) {
                    const results = searchContent(searchQuery);
                    setSearchResults(results);
                    setShowSearchResults(true);
                  }
                }}
                className="bg-amber-700 hover:bg-amber-600 text-white px-4 h-9"
              >
                Search
              </Button>
            </div>
            
            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <QuickActionCard
                icon={<HomeIcon className="w-5 h-5" />}
                label="Studio"
                active={activeTab === "studio"}
                onClick={() => handleTabChange("studio")}
              />
              <QuickActionCard
                icon={<Zap className="w-5 h-5" />}
                label="Equipment"
                active={activeTab === "equipment"}
                onClick={() => handleTabChange("equipment")}
              />
              <QuickActionCard
                icon={<Calculator className="w-5 h-5" />}
                label="Calculator"
                active={activeTab === "calculator"}
                onClick={() => handleTabChange("calculator")}
              />
              <QuickActionCard
                icon={<Palette className="w-5 h-5" />}
                label="Colors"
                active={activeTab === "colors"}
                onClick={() => handleTabChange("colors")}
              />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - Margin accounts for fixed header (logo row + nav row) */}
      <main className="max-w-6xl mx-auto px-4 py-6" style={{ marginTop: '280px' }}>
        {/* TAB CONTENT */}
        {activeTab === "studio" && <StudioTab />}
        {activeTab === "equipment" && <EquipmentTab />}
        {activeTab === "calculator" && <ThermalCalculatorTab />}
        {activeTab === "colors" && <ColorsTab />}
      </main>

      {/* GLOBAL SEARCH RESULTS */}
      {showSearchResults && (
        <SearchResults
          results={searchResults}
          query={searchQuery}
          onClose={() => setShowSearchResults(false)}
          onSelectResult={handleSelectResult}
        />
      )}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-amber-700/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-2">
          <NavButton
            icon={<HomeIcon className="w-5 h-5" />}
            label="Studio"
            active={activeTab === "studio"}
            onClick={() => handleTabChange("studio")}
          />
          <NavButton
            icon={<Zap className="w-5 h-5" />}
            label="Equipment"
            active={activeTab === "equipment"}
            onClick={() => handleTabChange("equipment")}
          />
          <NavButton
            icon={<Calculator className="w-5 h-5" />}
            label="Calculator"
            active={activeTab === "calculator"}
            onClick={() => handleTabChange("calculator")}
          />
          <NavButton
            icon={<Palette className="w-5 h-5" />}
            label="Colors"
            active={activeTab === "colors"}
            onClick={() => handleTabChange("colors")}
          />
        </div>
      </nav>
    </div>
  );
}

// ============ STUDIO TAB ============
function StudioTab() {
  return (
    <div className="space-y-6">
      {/* LOGO & TITLE */}
      <div className="text-center py-8">
        <img src="/manus-storage/Boroprologo_c1368bc1.png" alt="BoroPro Logo" className="h-96 w-96 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">BoroPro</h1>
        <p className="text-sm text-amber-400">Professional Glass Blower Reference Tool</p>
      </div>

      {/* DESCRIPTION */}
      <Card className="bg-stone-800 border-stone-700 p-6">
        <h2 className="text-lg font-bold text-amber-300 mb-3">About BoroPro</h2>
        <p className="text-sm text-stone-300 leading-relaxed mb-4">
          BoroPro is a professional reference tool designed specifically for borosilicate glass blowers. 
          Whether you're working with torches, kilns, or specialized glass materials, BoroPro provides 
          instant access to equipment specifications, annealing schedules, color references, and real-time 
          calculators—all optimized for studio use with gloved hands and minimal screen time.
        </p>
      </Card>

      {/* FEATURES */}
      <div>
        <h2 className="text-lg font-bold text-amber-300 mb-3">Key Features</h2>
        <div className="space-y-2">
          <FeatureCard
            title="Equipment Reference"
            description="Complete specs for 29+ kilns and torches from GTT, Bethlehem, Nortel, and more. Includes photos, max temperatures, fuel consumption, and professional notes."
          />
          <FeatureCard
            title="Annealing Calculator"
            description="Real-time calculations for hold temperatures (1050-1200°F), ramp-down rates, cooling schedules, and total cycle times based on glass thickness and form type."
          />
          <FeatureCard
            title="Pre-Calculated Schedules"
            description="6 proven annealing schedules for hollow forms, solid glass, slumping, and heat-sensitive colors. Copy-to-clipboard for quick reference."
          />
          <FeatureCard
            title="Color Reference Database"
            description="Northstar and Bullseye color families with metal compositions, annealing temperatures, and compatibility notes for striking and reduction work."
          />
          <FeatureCard
            title="Quick Tools"
            description="Temperature converter (°F ↔ °C), annealing time estimator, effective thickness calculator, and cooling rate guide."
          />
          <FeatureCard
            title="Studio-Optimized Design"
            description="Dark theme for studio environments, large touch targets for gloved hands, minimal text, and instant copy-to-clipboard on all specs."
          />
        </div>
      </div>

      {/* QUICK START */}
      <Card className="bg-amber-900/20 border-amber-700/50 p-4">
        <h3 className="text-sm font-bold text-amber-300 mb-2">Quick Start</h3>
        <ul className="text-xs text-stone-300 space-y-1">
          <li>• <strong>Equipment:</strong> Find torch/kiln specs and photos</li>
          <li>• <strong>Calculator:</strong> Input thickness and form type for custom schedules</li>
          <li>• <strong>Colors:</strong> Reference color families and metal compositions</li>
          <li>• <strong>Copy Specs:</strong> All cards have copy buttons for quick reference</li>
        </ul>
      </Card>

      {/* FOOTER NOTE */}
      <p className="text-xs text-stone-500 text-center">
        BoroPro v1.0 • Built for glass blowers, by glass enthusiasts
      </p>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-stone-800 border-stone-700 p-3">
      <h3 className="text-sm font-bold text-amber-300 mb-1">{title}</h3>
      <p className="text-xs text-stone-400">{description}</p>
    </Card>
  );
}

// ============ EQUIPMENT TAB ============
function EquipmentTab() {
  const [torchManufacturerFilter, setTorchManufacturerFilter] = useState<string>("all");

  const filteredTorches = torchDatabase.filter((torch) => {
    return torchManufacturerFilter === "all" || torch.brand === torchManufacturerFilter;
  });

  const torchManufacturers = Array.from(new Set(torchDatabase.map((t) => t.brand))).sort();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-amber-400">Equipment Reference</h2>

      {/* KILNS */}
      <div>
        <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-3">Kilns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <EquipmentCard
            name="Skutt KilnMaster 1227"
            specs={["Max: 2300°F", "27 cu in", "3 zone", "Digital"]}
            notes="Popular for boro. Excellent control."
            image="/manus-storage/skutt_kilnmaster_1227_1f3c63e8.jpg"
          />
          <EquipmentCard
            name="Paragon Pro"
            specs={["Max: 2300°F", "Large", "4 zone", "Digital"]}
            notes="Professional grade. Best for production."
          />
          <EquipmentCard
            name="Paragon Xpress"
            specs={["Max: 2300°F", "Compact", "2 zone", "Digital"]}
            notes="Fast heating. Quick cycles."
          />
          <EquipmentCard
            name="Evenheat Studio Pro"
            specs={["Max: 2300°F", "Medium", "3 zone", "Digital"]}
            notes="Reliable. Good consistency."
          />
        </div>
      </div>

      {/* TORCHES - EXPANDED DATABASE */}
      <div>
        <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-3">Torches ({filteredTorches.length})</h3>

        {/* MANUFACTURER FILTER */}
        <div className="mb-4">
          <label className="text-xs font-bold text-stone-300 uppercase mb-2 block">Manufacturer</label>
          <select
            value={torchManufacturerFilter}
            onChange={(e) => setTorchManufacturerFilter(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 text-white text-sm px-3 py-2 rounded cursor-pointer hover:bg-stone-700 transition-colors"
          >
            <option value="all">All Manufacturers</option>
            {torchManufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </div>

        {/* TORCH CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTorches.map((torch) => (
            <TorchCard key={torch.id} torch={torch} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ CALCULATOR TAB (with Schedules at bottom) ============
function CalculatorTab() {
  const [formType, setFormType] = useState<"solid" | "hollow">("solid");
  const [solidThickness, setSolidThickness] = useState<number>(2);
  const [hollowThickness, setHollowThickness] = useState<number>(1);

  // Use the appropriate thickness based on form type
  const thickness = formType === "solid" ? solidThickness : hollowThickness;

  // Calculate hold temperature based on thickness (1050-1200°F range)
  const calculateHoldTemp = (): number => {
    const minTemp = 1050;
    const maxTemp = 1200;
    const minThickness = 0.5;
    const maxThickness = 4;
    const normalized = Math.min(Math.max((thickness - minThickness) / (maxThickness - minThickness), 0), 1);
    return Math.round(minTemp + normalized * (maxTemp - minTemp));
  };

  const holdTemp = calculateHoldTemp();
  const holdTime = thickness <= 1 ? 15 : thickness <= 2 ? 20 : thickness <= 3 ? 25 : 30;
  const rampDownRate = thickness <= 1 ? 2 : thickness <= 2 ? 3 : thickness <= 3 ? 4 : 5;
  const rampDownTime = Math.round((holdTemp - 200) / rampDownRate);
  const totalCycleTime = holdTime + rampDownTime;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-amber-400">Calculator</h2>

      {/* ANNEALING SCHEDULE CALCULATOR */}
      <Card className="bg-stone-800 border-stone-700 p-4">
        <h3 className="text-lg font-bold text-amber-300 mb-4">Annealing Schedule Calculator</h3>

        <div className="space-y-4">
          {/* Form Type */}
          <div>
            <label className="text-xs font-bold text-stone-300 uppercase">Form Type</label>
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => setFormType("solid")}
                className={`flex-1 ${
                  formType === "solid"
                    ? "bg-amber-600 hover:bg-amber-500"
                    : "bg-stone-700 hover:bg-stone-600"
                } text-white text-xs`}
              >
                Solid (Full Thickness)
              </Button>
              <Button
                onClick={() => setFormType("hollow")}
                className={`flex-1 ${
                  formType === "hollow"
                    ? "bg-amber-600 hover:bg-amber-500"
                    : "bg-stone-700 hover:bg-stone-600"
                } text-white text-xs`}
              >
                Hollow (Thin Wall)
              </Button>
            </div>
          </div>

          {/* Thickness Input - Separate sliders for solid and hollow */}
          {formType === "solid" && (
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase">Solid Glass Thickness: {solidThickness}mm</label>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={solidThickness}
                onChange={(e) => setSolidThickness(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          )}
          {formType === "hollow" && (
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase">Hollow Wall Thickness: {hollowThickness}mm</label>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={hollowThickness}
                onChange={(e) => setHollowThickness(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          )}

          {/* RESULTS */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-stone-700">
            <ResultItem label="Hold Temperature" value={`${holdTemp}°F`} />
            <ResultItem label="Hold Time" value={`${holdTime} min`} />
            <ResultItem label="Ramp-Down Rate" value={`${rampDownRate}°F/hr`} />
            <ResultItem label="Ramp-Down Time" value={`${rampDownTime} hrs`} />
            <ResultItem label="Cool Rate" value="2°F/hr" />
            <ResultItem label="Total Cycle" value={`${Math.ceil(totalCycleTime / 60)}-${Math.ceil(totalCycleTime / 60) + 1} hrs`} />
          </div>
        </div>
      </Card>

      {/* OTHER CALCULATORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CalculatorCard
          title="Temperature Converter"
          input="1050"
          output="566°C"
          description="°F to °C"
        />
        <CalculatorCard
          title="Annealing Time"
          input="2mm solid"
          output="3-4 hours"
          description="Based on thickness"
        />
        <CalculatorCard
          title="Cooling Rate Guide"
          input="Reference"
          output="1-2°F/hr"
          description="Thin to thick glass"
        />
        <CalculatorCard
          title="Effective Thickness"
          input="Solid 2mm"
          output="2mm"
          description="Form-adjusted"
        />
      </div>

      {/* SCHEDULES SECTION */}
      <div className="pt-4">
        <h3 className="text-lg font-bold text-amber-300 mb-4">Pre-Calculated Schedules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScheduleCard
            name="Boro 1mm Hollow"
            temps="1020°F anneal"
            time="2-3 hrs"
            details={["15 min hold", "Anneal: 5°F/hr", "Cool: 2°F/hr", "Thin wall"]}
          />
          <ScheduleCard
            name="Boro 2mm Solid"
            temps="1035°F anneal"
            time="3-4 hrs"
            details={["20 min hold", "Anneal: 3°F/hr", "Cool: 2°F/hr", "Standard"]}
          />
          <ScheduleCard
            name="Boro 3mm Solid"
            temps="1050°F anneal"
            time="4-5 hrs"
            details={["25 min hold", "Anneal: 2°F/hr", "Cool: 1.5°F/hr", "Thick"]}
          />
          <ScheduleCard
            name="Boro 4mm+ Solid"
            temps="1050°F anneal"
            time="6-8 hrs"
            details={["30 min hold", "Anneal: 1.5°F/hr", "Cool: 1°F/hr", "Very thick"]}
          />
          <ScheduleCard
            name="Slump 2mm"
            temps="1150°F slump"
            time="3-4 hrs"
            details={["Slump temp", "Cool: 1°F/hr", "Mold dependent", "Fusing"]}
          />
          <ScheduleCard
            name="Heat-Sensitive"
            temps="1000°F anneal"
            time="3-4 hrs"
            details={["15 min hold", "Anneal: 5°F/hr", "Cool: 2°F/hr", "Opaques only"]}
          />
        </div>
      </div>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-900 p-2 rounded text-center">
      <div className="text-xs text-stone-400">{label}</div>
      <div className="text-lg font-bold text-amber-300">{value}</div>
    </div>
  );
}

function CalculatorCard({
  title,
  input,
  output,
  description,
}: {
  title: string;
  input: string;
  output: string;
  description: string;
}) {
  return (
    <Card className="bg-stone-800 border-stone-700 p-3">
      <h4 className="font-bold text-amber-300 text-sm mb-2">{title}</h4>
      <div className="text-xs text-stone-400 mb-2">
        <div>Input: {input}</div>
        <div>Output: {output}</div>
      </div>
      <p className="text-xs text-stone-300">{description}</p>
    </Card>
  );
}

// ============ COLORS TAB ============
function ColorsTab() {

  // STATE: Search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ---- SEARCH HANDLER ----
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // ---- FILTER LOGIC ----
  // Filter colors by search query across all text fields
  const q = searchQuery.toLowerCase().trim();
  const filtered = !q
    ? glassColors
    : glassColors.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.colorCode.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.strikingNotes.toLowerCase().includes(q) ||
          c.flameRecommendation.toLowerCase().includes(q) ||
          c.colorFamily.toLowerCase().includes(q) ||
          c.manufacturer.toLowerCase().includes(q)
      );

  // ---- GET ALL MANUFACTURERS FROM FILTERED RESULTS ----
  const allManufacturers = Array.from(
    new Set(filtered.map((c) => c.manufacturer))
  ).sort();

  // ---- GROUP FILTERED COLORS BY MANUFACTURER THEN FAMILY ----
  const grouped: Record<string, Record<string, typeof glassColors>> = {};
  for (const mfg of allManufacturers) {
    const mfgColors = filtered.filter((c) => c.manufacturer === mfg);
    if (mfgColors.length === 0) continue;
    grouped[mfg] = {};
    const families = Array.from(new Set(mfgColors.map((c) => c.colorFamily))).sort();
    for (const family of families) {
      grouped[mfg][family] = mfgColors.filter((c) => c.colorFamily === family);
    }
  }

  return (
    <div className="space-y-6 pb-8">

      {/* PAGE TITLE */}
      <h2 className="text-xl font-bold text-amber-400">Color Reference</h2>

      {/* ---- GLOBAL SEARCH BAR ---- */}
      <div>
        <label className="text-xs font-bold text-stone-300 uppercase mb-2 block">
          Search Colors
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name, code, description, notes..."
          className="w-full bg-stone-800 border-2 border-stone-600 text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-stone-500 transition-all"
        />
      </div>



      {/* ---- RESULT COUNT ---- */}
      <p className="text-xs text-stone-500">
        {filtered.length} color{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ---- MANUFACTURER SECTIONS ---- */}
      <div className="space-y-10">
        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-stone-500 text-sm pt-8">
            No colors match your search.
          </p>
        )}

        {Object.entries(grouped).map(([mfg, families]) => (
          <div key={mfg} className="space-y-4">

            {/* MANUFACTURER HEADER */}
            <div className="border-b border-amber-700/30 pb-3">
              <h3 className="text-lg font-bold text-amber-300">{mfg}</h3>
              <p className="text-xs text-stone-400 mt-1">
                {Object.values(families).flat().length} color
                {Object.values(families).flat().length !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* COLOR FAMILIES */}
            <div className="space-y-6">
              {Object.entries(families).map(([family, colors]) => (
                <div key={`${mfg}-${family}`} className="space-y-3">

                  {/* FAMILY HEADING */}
                  <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wide">
                    {family} Based
                  </h4>

                  {/* COLOR CARDS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {colors.map((color) => (
                      <GlassColorCard key={color.id} color={color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GlassColorCard({ color }: { color: typeof glassColors[0] }) {
  return (
    <div className="bg-stone-800 border border-stone-600 rounded-lg p-4 space-y-2 hover:border-amber-600 transition-all">

      {/* COLOR IMAGE */}
      {color.image && (
        <div className="w-full h-32 rounded overflow-hidden">
          <img
            src={color.image}
            alt={color.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>
      )}

      {/* COLOR NAME + CODE */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-white leading-tight">{color.name}</p>
        <span className="text-xs font-mono text-amber-400 whitespace-nowrap">{color.colorCode}</span>
      </div>

      {/* FAMILY BADGE */}
      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-stone-700 text-stone-300">
        {color.colorFamily}
      </span>

      {/* DESCRIPTION */}
      <p className="text-xs text-stone-400 leading-relaxed">{color.description}</p>

      {/* SPECS */}
      <div className="text-xs text-stone-500 space-y-0.5 pt-1 border-t border-stone-700">
        <p><span className="text-stone-400 font-medium">Anneal:</span> {color.annealingTemp}</p>
        <p><span className="text-stone-400 font-medium">Working:</span> {color.workingTemp}</p>
        <p><span className="text-stone-400 font-medium">Flame:</span> {color.flameRecommendation}</p>
        <p><span className="text-stone-400 font-medium">Notes:</span> {color.strikingNotes}</p>
      </div>
    </div>
  );
}

function ColorCard({
  name,
  specs,
  notes,
}: {
  name: string;
  specs: string[];
  notes: string;
}) {
  const handleCopy = () => {
    const text = `${name}\n${specs.join("\n")}\n${notes}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-stone-800 border-stone-700 p-3">
      <h4 className="font-bold text-amber-300 text-sm mb-2">{name}</h4>
      <div className="text-xs text-stone-400 space-y-1 mb-2">
        {specs.map((spec, i) => (
          <div key={i}>• {spec}</div>
        ))}
      </div>
      <p className="text-xs text-stone-300 mb-2">{notes}</p>
      <Button
        onClick={handleCopy}
        size="sm"
        className="w-full bg-amber-700 hover:bg-amber-600 text-white text-xs"
      >
        Copy Specs
      </Button>
    </Card>
  );
}

// ============ EQUIPMENT CARD ============
function EquipmentCard({
  name,
  specs,
  notes,
  image,
}: {
  name: string;
  specs: string[];
  notes: string;
  image?: string;
}) {
  const handleCopy = () => {
    const text = `${name}\n${specs.join("\n")}\n${notes}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-stone-800 border-stone-700 p-3 overflow-hidden">
      {image && (
        <div className="mb-2 -mx-3 -mt-3 bg-stone-900 p-2">
          <img src={image} alt={name} className="w-full h-48 object-cover object-center rounded" style={{ objectFit: 'cover', objectPosition: 'center' }} />
        </div>
      )}
      <h4 className="font-bold text-amber-300 text-sm mb-2">{name}</h4>
      <div className="text-xs text-stone-400 space-y-1 mb-2">
        {specs.map((spec, i) => (
          <div key={i}>• {spec}</div>
        ))}
      </div>
      <p className="text-xs text-stone-300 mb-2">{notes}</p>
      <Button
        onClick={handleCopy}
        size="sm"
        className="w-full bg-amber-700 hover:bg-amber-600 text-white text-xs"
      >
        Copy Specs
      </Button>
    </Card>
  );
}

// ============ TORCH CARD ============
function TorchCard({ torch }: { torch: (typeof torchDatabase)[0] }) {
  const handleCopy = () => {
    const text = `${torch.name} (${torch.brand})\nType: ${torch.type}\nMax Temp: ${torch.maxTemp}\nFlame Width: ${torch.flameWidth}\nBoro Capacity: ${torch.boroCapacity}\nFuel: ${torch.fuelConsumption}\nO2: ${torch.oxygenConsumption}\n${torch.notes}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-stone-800 border-stone-700 p-3 overflow-hidden">
      {torch.image && (
        <div className="mb-2 -mx-3 -mt-3 bg-stone-900 p-2">
          <img src={torch.image} alt={torch.name} className="w-full h-48 object-cover object-center rounded" style={{ objectFit: 'cover', objectPosition: 'center' }} />
        </div>
      )}
      <h4 className="font-bold text-amber-300 text-sm mb-1">{torch.name}</h4>
      <p className="text-xs text-stone-400 mb-2">{torch.brand}</p>
      <div className="text-xs text-stone-400 space-y-1 mb-2">
        <div>• Max: {torch.maxTemp}</div>
        <div>• Boro: {torch.boroCapacity}</div>
        <div>• Flame: {torch.flameWidth}</div>
        <div>• Fuel: {torch.fuelConsumption}</div>
      </div>
      <p className="text-xs text-stone-300 mb-2">{torch.notes}</p>
      <Button
        onClick={handleCopy}
        size="sm"
        className="w-full bg-amber-700 hover:bg-amber-600 text-white text-xs"
      >
        Copy Specs
      </Button>
    </Card>
  );
}

// ============ SCHEDULE CARD ============
function ScheduleCard({
  name,
  temps,
  time,
  details,
}: {
  name: string;
  temps: string;
  time: string;
  details: string[];
}) {
  const handleCopy = () => {
    const text = `${name}\n${temps}\n${time}\n${details.join("\n")}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-stone-800 border-stone-700 p-3">
      <h4 className="font-bold text-amber-300 text-sm mb-1">{name}</h4>
      <div className="text-xs text-amber-400 mb-2">{temps} • {time}</div>
      <div className="text-xs text-stone-400 space-y-1 mb-2">
        {details.map((detail, i) => (
          <div key={i}>• {detail}</div>
        ))}
      </div>
      <Button
        onClick={handleCopy}
        size="sm"
        className="w-full bg-amber-700 hover:bg-amber-600 text-white text-xs"
      >
        Copy Schedule
      </Button>
    </Card>
  );
}

// ============ UI COMPONENTS ============
function QuickActionCard({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded border-2 transition-all ${
        active
          ? "bg-amber-900/30 border-amber-500 text-amber-400"
          : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600"
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded transition-all ${
        active
          ? "bg-amber-900/30 text-amber-400 border-b-2 border-amber-500"
          : "text-stone-400 hover:text-stone-300"
      }`}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}
