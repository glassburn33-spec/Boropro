/*
BoroPro - Practical Glass Blower Reference Tool
Design: Studio-focused, minimal reading, maximum usability
Dark theme for studio environment, large touch targets for gloved hands
*/

import { useState, useEffect, useRef } from "react";
import { Home as HomeIcon, Zap, Calculator, Palette, ChevronDown } from "lucide-react";
import { StudioScienceIcon } from "@/components/icons/StudioScienceIcon";
import { GlassRodsIcon } from "@/components/icons/GlassRodsIcon";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";
import { EquipmentIcon } from "@/components/icons/EquipmentIcon";
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
  const [pendingExpandedColor, setPendingExpandedColor] = useState<typeof glassColors[0] | null>(null);

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
      // Find the color object and set it as pending for expanded view
      const color = glassColors.find(c => c.id === result.id || c.name.toLowerCase() === result.title.toLowerCase());
      if (color) {
        setPendingExpandedColor(color);
      }
      setActiveTab("colors");
      setShowSearchResults(false);
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
        <div className="flex items-center h-56 px-4">
          {/* Logo on left */}
          <img src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png" alt="BoroPro Logo" className="h-48 w-48 flex-shrink-0 object-contain" />
          
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
                icon={<StudioScienceIcon className="w-5 h-5" isActive={activeTab === "studio"} />}
                label="Studio Science"
                active={activeTab === "studio"}
                onClick={() => handleTabChange("studio")}
                backgroundImage="/manus-storage/Gemini_Generated_Image_k4ln75k4ln75k4ln_cdf9d451.png"
              />
              <QuickActionCard
                icon={<EquipmentIcon className="w-5 h-5" isActive={activeTab === "equipment"} />}
                label="Equipment"
                active={activeTab === "equipment"}
                onClick={() => handleTabChange("equipment")}
                backgroundImage="/manus-storage/dewericon_d850a6d4.png"
              />
              <QuickActionCard
                icon={<CalculatorIcon className="w-5 h-5" isActive={activeTab === "calculator"} />}
                label="Calculator"
                active={activeTab === "calculator"}
                onClick={() => handleTabChange("calculator")}
                backgroundImage="/manus-storage/calculatericon_1aa1ae9f.png"
              />
              <QuickActionCard
                icon={<GlassRodsIcon className="w-5 h-5" isActive={activeTab === "colors"} />}
                label="Colors"
                active={activeTab === "colors"}
                onClick={() => handleTabChange("colors")}
                backgroundImage="/manus-storage/coloricon_250e618e.png"
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
        {activeTab === "colors" && <ColorsTab pendingExpandedColor={pendingExpandedColor} setPendingExpandedColor={setPendingExpandedColor} />}
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
    </div>
  );
}

// ============ STUDIO TAB ============
function StudioTab() {
  return (
    <div className="space-y-6">
      {/* LOGO & TITLE */}
      <div className="text-center py-8">
        <img src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png" alt="BoroPro Logo" className="h-96 w-96 mx-auto mb-4 object-contain" />
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

      {/* GLASS SCIENCE SECTION */}
      <div className="border-t border-stone-700 pt-8 mt-8">
        <div className="w-full flex flex-col items-center mb-6">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663623640040/ko6JvUbynpgrMrJ75UzZgS/glass-structure-comparison-ZqjkF7jkXYuAaH7xeFCr6V.webp"
            alt="Atomic structure comparison: crystalline quartz vs silica glass"
            className="w-full max-w-2xl rounded-xl border border-stone-700 shadow-lg"
          />
          <p className="text-stone-500 text-xs italic text-center mt-3 max-w-xl">
            Atomic structure comparison: crystalline quartz (ordered, periodic lattice) vs. silica glass (disordered, amorphous network). The absence of long-range order in glass is the origin of its unique thermal behavior.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4 pb-10 px-2">
          <h2 className="text-xl font-bold text-amber-400 mb-4">
            The Structure of Glass: Why It Behaves the Way It Does
          </h2>

          {/* SUBSECTION 1 */}
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-5">
            <h3 className="text-amber-400 font-bold text-base mb-2">
              Glass Is Not a Solid in the Classical Sense
            </h3>
            <div className="text-stone-300 text-sm leading-relaxed space-y-3">
              <p>
                Most materials are either crystalline solids — in which atoms are arranged in a repeating, periodic lattice — or liquids, in which atoms move freely with no fixed arrangement. Glass occupies a unique intermediate state called an <span className="text-amber-300 font-semibold">amorphous solid</span> or a <span className="text-amber-300 font-semibold">supercooled liquid</span>. When molten silica (or borosilicate glass) cools, its atoms do not have time to organize into the ordered crystal structure that quartz would form. Instead, they freeze into a disordered, network-like arrangement — random and tangled, but rigid.
              </p>
              <p>
                This disordered network is the fundamental reason glass behaves so differently from crystalline materials. Crystals have a sharp melting point at which the entire lattice collapses at once. Glass has no such point. Instead, it passes through a continuous range of viscosity states as temperature rises — from rigid solid, to increasingly pliable, to fully fluid — because there is no ordered structure to abruptly break down.
              </p>
            </div>
          </div>

          {/* SUBSECTION 2 */}
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-5">
            <h3 className="text-amber-400 font-bold text-base mb-2">
              From Rigid to Pliable: The Glass Transition Temperature (Tg)
            </h3>
            <div className="text-stone-300 text-sm leading-relaxed space-y-3">
              <p>
                The <span className="text-amber-300 font-semibold">glass transition temperature (Tg)</span> is the temperature at which glass changes from a brittle, glassy state into a rubbery, supercooled liquid state. For borosilicate glass, Tg is approximately <span className="text-amber-300 font-semibold">565 °C</span>. Below this temperature the atomic network is locked — atoms vibrate in place but cannot rearrange. Above Tg, enough thermal energy exists to allow segments of the network to begin slowly shifting relative to one another. The glass does not instantly become soft; it becomes progressively less viscous as temperature rises.
              </p>
              <p>
                This is why the glass transition temperature is also the <span className="text-amber-300 font-semibold">annealing point</span> — the temperature at which internal stresses introduced during working can be relieved as the network very slowly rearranges to a lower-energy state, without the glass being so fluid that it deforms under its own weight.
              </p>
            </div>
          </div>

          {/* SUBSECTION 3 */}
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-5">
            <h3 className="text-amber-400 font-bold text-base mb-2">
              The Lower Boundary: Strain Point (~515 °C)
            </h3>
            <div className="text-stone-300 text-sm leading-relaxed space-y-3">
              <p>
                The <span className="text-amber-300 font-semibold">strain point</span> is the temperature below which the atomic network is effectively frozen on any practical timescale. Below this temperature, stresses locked into the glass during rapid cooling or working cannot be relieved — they are permanently fixed in the structure. This is the critical lower threshold that the BoroPro calculator tracks: once a piece of glass cools below 515 °C outside the kiln, its internal stress state is set, and no amount of subsequent slow cooling will change it. Pieces that pass through this threshold with high thermal gradients across their cross-section carry permanent internal stress and are at elevated risk of delayed fracture.
              </p>
            </div>
          </div>

          {/* SUBSECTION 4 */}
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-5">
            <h3 className="text-amber-400 font-bold text-base mb-2">
              Where the Artist Works: Softening and Working Temperatures
            </h3>
            <div className="text-stone-300 text-sm leading-relaxed space-y-3">
              <p>
                As temperature continues to rise above Tg, the viscosity of the glass network drops progressively. Two key points define the working range.
              </p>
              <p>
                <span className="text-amber-300 font-semibold">Softening Point (~820 °C for borosilicate):</span> The temperature at which glass is soft enough to deform measurably under its own weight. At this point viscosity has dropped to approximately 10⁷·⁶ Pa·s. The atomic network is mobile enough that large-scale shape changes occur with modest applied force.
              </p>
              <p>
                <span className="text-amber-300 font-semibold">Working Point (~1050–1100 °C for borosilicate):</span> The temperature at which glass flows freely enough for most flameworking operations. Viscosity is approximately 10³ Pa·s. The network segments are sliding past one another with relative ease. At this viscosity glass can be pulled, blown, pressed, and joined. The key physical phenomenon is that the Si–O–Si and B–O–B network bonds are not breaking — they are thermally activated to rotate and slide within the disordered network. This is what allows glass to be shaped without the piece ever crystallizing or losing its optical clarity.
              </p>
              <p>
                <span className="text-amber-300 font-semibold">Why the Working Range Is Forgiving:</span> Because glass has no fixed melting point and no abrupt structural transition in the working range, the artist has a window — not a single temperature — in which to work. The disordered structure is inherently forgiving of temperature gradients that would cause a crystal to crack or shatter along cleavage planes. The network distributes stress over a continuous, directionless tangle rather than concentrating it at crystallographic defect sites.
              </p>
            </div>
          </div>

          {/* SUBSECTION 5 */}
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-5">
            <h3 className="text-amber-400 font-bold text-base mb-2">
              Why Cooling Rate Determines Survival
            </h3>
            <div className="text-stone-300 text-sm leading-relaxed space-y-3">
              <p>
                When a shaped piece leaves the flame or kiln, its surface cools faster than its interior. In a crystalline material, differential contraction would cause cracking along crystal planes. In glass, the same differential contraction produces internal stress — the surface wants to contract but is constrained by the still-warm interior. If the temperature gradient across the cross-section is large enough when the piece passes through the glass transition range (515–565 °C), those stresses become permanently frozen into the network at the strain point, and the piece carries a latent fracture risk that may not manifest for days, weeks, or years.
              </p>
              <p>
                The maximum safe cooling rate is directly controlled by the cross-sectional geometry: thicker pieces build larger temperature gradients across their wall at any given surface cooling rate, which is why wall thickness and outer radius are the primary inputs to the working-time calculation. The physics the calculator encodes is exactly this relationship — how quickly the glass body as a whole approaches the strain point under natural convection cooling, and whether the thermal gradient that develops in doing so exceeds the tensile strength of the borosilicate network.
              </p>
            </div>
          </div>

          <p className="text-stone-500 text-xs italic mt-4">
            All temperature values referenced above are for Pyrex-type borosilicate glass (33 × 10⁻⁷/°C expansion coefficient). Soda-lime, soft glass, and other borosilicate formulations have different transition temperatures and viscosity profiles. Never mix glass types in a single piece.
          </p>
        </div>
      </div>

      {/* GLASS ANNEALING SCIENCE SECTION */}
      <div className="border-t border-stone-700 pt-8 mt-8">
        <h2 className="text-2xl font-bold text-center text-amber-300 mb-6" style={{fontFamily: "'Playfair Display', 'Cormorant Garamond', serif"}}>The Science of Glass Annealing</h2>
        
        <div className="max-w-5xl mx-auto">
          {/* TWO-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* LEFT COLUMN: IMAGE */}
            <div className="flex flex-col items-center justify-start">
              <div className="relative">
                <img
                  src="/manus-storage/Gemini_Generated_Image_rw8zeprw8zeprw8z(2)_e00e161e.png"
                  alt="Viscosity-Temperature profile for common glass types"
                  className="w-full max-w-sm rounded-lg border-2 border-amber-600 shadow-2xl" 
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(200, 134, 10, 0.3))",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(200, 134, 10, 0.1)"
                  }}
                />
              </div>
              <p className="text-center text-stone-400 text-xs mt-4 max-w-sm italic">
                Viscosity–Temperature profile for common glass types. Blue band = critical annealing range.
              </p>
            </div>

            {/* RIGHT COLUMN: CONTENT */}
            <div className="space-y-6" style={{fontFamily: "'IBM Plex Mono', 'Source Sans Pro', sans-serif"}}>
              {/* SUBSECTION 1: ANNEALING POINT */}
              <div className="bg-stone-900/50 border-l-4 border-amber-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 30, 20, 0.6) 100%)", backdropFilter: "blur(10px)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-amber-600/30 border border-amber-600 rounded-full text-amber-300 text-xs font-bold">Annealing Point</span>
                  <span className="text-amber-400 font-bold">η = 10<sup>12.4</sup> Pa·s</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed">
                  At this temperature, internal thermal stresses in the glass are relieved by viscous relaxation within <span className="text-amber-300 font-bold">15 minutes</span>. To relieve a glass product of internal stresses, it must be heated to just above the annealing point and subsequently cooled down slowly.
                </p>
              </div>

              {/* GLOWING DIVIDER */}
              <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent" style={{boxShadow: "0 0 10px rgba(200, 134, 10, 0.5)"}}></div>

              {/* SUBSECTION 2: STRAIN POINT */}
              <div className="bg-stone-900/50 border-l-4 border-amber-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 30, 20, 0.6) 100%)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-amber-600/30 border border-amber-600 rounded-full text-amber-300 text-xs font-bold">Strain Point</span>
                  <span className="text-amber-400 font-bold">η = 10<sup>13.5</sup> Pa·s</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed space-y-2">
                  <span>Below this temperature, relieving internal stresses is practically impossible. At the strain point itself, stress relief may take up to <span className="text-amber-300 font-bold">15 hours</span>. Between the annealing point and strain point, glass must be cooled gradually, slowly, and uniformly to avoid internal stress formation caused by temperature gradients.</span>
                  <br/>
                  <span>Stresses acquired during cooling above the strain point are <span className="text-amber-300 font-bold">permanent stresses</span> unless annealed. Stresses acquired during cooling below the strain point are <span className="text-amber-300 font-bold">temporary stresses</span> but can still cause failure under thermal shock. The goal of annealing is to relieve the permanent stresses created by fast cooling that occurred during the forming process. To avoid permanent stress creation, cooling must be slow within the temperature and viscosity range between the annealing point and the strain point.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLASS HEAT TREATMENT PROFILE SECTION */}
      <div className="border-t border-stone-700 pt-8 mt-8">
        <h2 className="text-2xl font-bold text-center text-amber-300 mb-6" style={{fontFamily: "'Playfair Display', 'Cormorant Garamond', serif"}}>Glass Heat Treatment Profile</h2>
        
        <div className="max-w-5xl mx-auto">
          {/* TWO-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* LEFT COLUMN: IMAGE */}
            <div className="flex flex-col items-center justify-start">
              <div className="relative">
                <img
                  src="/manus-storage/aneelprof_bb8c9ac3.png"
                  alt="Borosilicate Glass Heat Treatment Profile — four phases from rapid reheat through controlled slow cooling"
                  className="w-full max-w-sm rounded-lg" 
                />
              </div>
              <p className="text-center text-stone-400 text-xs mt-4 max-w-sm italic">
                Borosilicate Glass Heat Treatment Profile — four phases from rapid reheat through controlled slow cooling to below the strain point.
              </p>
            </div>

            {/* RIGHT COLUMN: CONTENT */}
            <div className="space-y-6" style={{fontFamily: "'IBM Plex Mono', 'Source Sans Pro', sans-serif"}}>
              {/* PHASE 1: RAPID REHEATING */}
              <div className="bg-stone-900/50 border-l-4 border-red-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 30, 20, 0.6) 100%)", backdropFilter: "blur(10px)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-red-600/30 border border-red-600 rounded-full text-red-300 text-xs font-bold">Phase 1 — Rapid Reheating</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed">
                  The glass article is rapidly reheated to a temperature above the annealing point (T &gt; T<sub>anneal</sub>). Speed here is acceptable because the glass is being brought up uniformly before stress-sensitive cooling begins.
                </p>
              </div>

              {/* PHASE 2: DWELL */}
              <div className="bg-stone-900/50 border-l-4 border-orange-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 30, 20, 0.6) 100%)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-orange-600/30 border border-orange-600 rounded-full text-orange-300 text-xs font-bold">Phase 2 — Dwell</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed">
                  The glass holds at temperature to allow equalization of heat throughout the entire article. This soak ensures no internal temperature gradients exist before the critical cooling phase begins.
                </p>
              </div>

              {/* PHASE 3: SLOW COOLING */}
              <div className="bg-stone-900/50 border-l-4 border-green-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 30, 20, 0.6) 100%)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-green-600/30 border border-green-600 rounded-full text-green-300 text-xs font-bold">Phase 3 — Slow Cooling</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed space-y-2">
                  <span>The glass is cooled slowly and uniformly from above the annealing point down through the strain point. This is the most critical phase. Internal temperature gradients develop depending on <span className="text-amber-300 font-bold">cooling rate</span> and the thermal equalization capacity of the glass. These gradients lead directly to <span className="text-amber-300 font-bold">internal stress</span>. The stress in the glass can be calculated from the cooling rate, the properties of the glass, and the shape of the article. The optimal <span className="text-amber-300 font-bold">cooling rate</span> can be calculated for a maximum allowable <span className="text-amber-300 font-bold">residual stress</span> in the final glass article.</span>
                </p>
              </div>

              {/* PHASE 4: MORE RAPID COOLING */}
              <div className="bg-stone-900/50 border-l-4 border-blue-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(40, 30, 20, 0.6) 100%)"}}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-600/30 border border-blue-600 rounded-full text-blue-300 text-xs font-bold">Phase 4 — More Rapid Cooling</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Once the glass has passed below the <span className="text-amber-300 font-bold">strain point</span>, cooling can be accelerated. Stresses formed below the strain point are temporary and lower risk, so energy and time can be saved in this final phase.
                </p>
              </div>
            </div>
          </div>

          {/* KEY INSIGHT CALLOUT */}
          <div className="bg-stone-800/50 border-l-4 border-amber-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(30, 25, 15, 0.8) 0%, rgba(40, 35, 20, 0.6) 100%)", backdropFilter: "blur(10px)"}}>
            <p className="text-stone-300 text-sm leading-relaxed">
              <span className="text-amber-300 font-bold">The goal of industrial annealing is to minimize stresses in the glass article in the shortest time possible</span> — because annealing means heating, heating means energy consumption, and energy consumption means cost. Every minute saved in the kiln matters.
            </p>
          </div>
        </div>
      </div>

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
function ColorsTab({ pendingExpandedColor, setPendingExpandedColor }: { pendingExpandedColor: typeof glassColors[0] | null; setPendingExpandedColor: (color: typeof glassColors[0] | null) => void }) {
  // STATE: Search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // STATE: Expanded color overlay
  const [expandedColor, setExpandedColor] = useState<typeof glassColors[0] | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<number>(0);
  
  // Handle Escape key to close expanded overlay
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeExpanded();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Consume pending expanded color from search
  useEffect(() => {
    if (pendingExpandedColor) {
      openExpanded(pendingExpandedColor);
      setPendingExpandedColor(null);
    }
  }, [pendingExpandedColor]);
  
  // Open expanded color card
  function openExpanded(color: typeof glassColors[0]) {
    scrollPosRef.current = listRef.current?.scrollTop ?? window.scrollY;
    setExpandedColor(color);
  }
  
  // Close expanded color card
  function closeExpanded() {
    setExpandedColor(null);
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = scrollPosRef.current;
      } else {
        window.scrollTo(0, scrollPosRef.current);
      }
    });
  };

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
    <div className="space-y-6 pb-8" ref={listRef}>

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
                      <GlassColorCard key={color.id} color={color} onExpand={openExpanded} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* EXPANDED OVERLAY */}
      {expandedColor && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
            onClick={closeExpanded}
          />

          {/* Expanded card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative bg-stone-900 border border-stone-600 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

              {/* Close button */}
              <button
                onClick={closeExpanded}
                className="absolute top-3 right-3 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold z-10"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Full-size color swatch */}
              {expandedColor.image && (
                <div
                  className="w-full h-48 rounded-t-2xl object-cover"
                  style={{
                    backgroundImage: `url(${expandedColor.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}

              {/* Detail fields */}
              <div className="p-5 space-y-3">

                {/* Name */}
                <h2 className="text-xl font-bold text-white">
                  {expandedColor.name}
                </h2>

                {/* Manufacturer */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 uppercase tracking-wide w-20">Manufacturer</span>
                  <span className="text-sm font-mono text-stone-200 bg-stone-800 px-2 py-1 rounded">
                    {expandedColor.manufacturer}
                  </span>
                </div>

                {/* Color Code */}
                {expandedColor.colorCode && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 uppercase tracking-wide w-20">Code</span>
                    <span className="text-sm font-mono text-stone-200 bg-stone-800 px-2 py-1 rounded">
                      {expandedColor.colorCode}
                    </span>
                  </div>
                )}

                {/* Color Family */}
                {expandedColor.colorFamily && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 uppercase tracking-wide w-20">Family</span>
                    <span className="text-sm font-mono text-stone-200 bg-stone-800 px-2 py-1 rounded">
                      {expandedColor.colorFamily}
                    </span>
                  </div>
                )}

                {/* Metal Composition */}
                {expandedColor.metalComposition && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Metal Composition</p>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {expandedColor.metalComposition}
                    </p>
                  </div>
                )}

                {/* Description */}
                {expandedColor.description && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {expandedColor.description}
                    </p>
                  </div>
                )}

                {/* Annealing Temperature */}
                {expandedColor.annealingTemp && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Annealing Temperature</p>
                    <p className="text-sm text-stone-300">{expandedColor.annealingTemp}</p>
                  </div>
                )}

                {/* Working Temperature */}
                {expandedColor.workingTemp && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Working Temperature</p>
                    <p className="text-sm text-stone-300">{expandedColor.workingTemp}</p>
                  </div>
                )}

                {/* Flame Recommendation */}
                {expandedColor.flameRecommendation && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Flame Recommendation</p>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {expandedColor.flameRecommendation}
                    </p>
                  </div>
                )}

                {/* Striking Notes */}
                {expandedColor.strikingNotes && (
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Striking Notes</p>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {expandedColor.strikingNotes}
                    </p>
                  </div>
                )}

                {/* Close button at bottom */}
                <button
                  onClick={closeExpanded}
                  className="w-full mt-4 py-2 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300 text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GlassColorCard({ color, onExpand }: { color: typeof glassColors[0]; onExpand: (color: typeof glassColors[0]) => void }) {
  return (
    <div 
      onClick={() => onExpand(color)}
      className="bg-stone-800 border border-stone-600 rounded-lg p-4 space-y-2 hover:border-amber-600 transition-all cursor-pointer hover:ring-2 hover:ring-amber-400"
    >

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
  backgroundImage,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  backgroundImage?: string;
}) {
  if (backgroundImage) {
    return (
      <button
        onClick={onClick}
        className={`relative w-full h-32 rounded-2xl overflow-hidden transition-all transform hover:scale-105 flex items-center justify-center ${
          active ? "ring-4 ring-amber-400 shadow-lg" : "shadow-md hover:shadow-lg"
        }`}
        style={{
          backgroundColor: '#000000',
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '4px',
            opacity: active ? 1 : 0.45,
            transition: 'opacity 200ms ease-in-out',
          }}
        />
      </button>
    );
  }
  
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
