/*
BoroPro - Practical Glass Blower Reference Tool
Design: Studio-focused, minimal reading, maximum usability
Dark theme for studio environment, large touch targets for gloved hands
*/

import { useState, useEffect, useRef } from "react";
import { Home as HomeIcon, Zap, Calculator, Palette, ChevronDown, Menu, X } from "lucide-react";
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
import ColorScienceTab from "./ColorScienceTab";

type TabType = "studio" | "equipment" | "scieequip" | "calculator" | "colors" | "colorscience";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("studio");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [pendingExpandedColor, setPendingExpandedColor] = useState<typeof glassColors[0] | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

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

  const [headerImage, setHeaderImage] = useState<string>("/manus-storage/Gemini_Generated_Image_xdojvrxdojvrxdoj_491ab419.png");

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
      <header className="fixed top-0 left-0 right-0 z-30 bg-stone-900 border-b border-amber-700/30 shadow-lg">
        {/* ROW 1: Hamburger Menu, Logo and Header Image */}
        <div className="flex items-center h-28 px-4 gap-2 relative">
          {/* Hamburger Menu Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="p-2 hover:bg-stone-800 rounded transition flex-shrink-0 w-12 h-12 flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6 text-stone-300" />
            </button>
            
            {/* Dropdown Menu */}
            {showDrawer && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-stone-800 border border-amber-700/50 rounded shadow-lg z-1000">
                <button
                  onClick={() => { handleTabChange("studio"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Glass-Science
                </button>
                <button
                  onClick={() => { handleTabChange("equipment"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Equipment
                </button>
                <button
                  onClick={() => { handleTabChange("scieequip"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Scie-Equip
                </button>
                <button
                  onClick={() => { handleTabChange("calculator"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Calculator
                </button>
                <button
                  onClick={() => { handleTabChange("colors"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Color
                </button>
                <button
                  onClick={() => { handleTabChange("colorscience"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Color-Scie
                </button>
              </div>
            )}
          </div>
          
          {/* Logo on left */}
          <img src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png" alt="BoroPro Logo" className="h-28 w-28 flex-shrink-0 object-contain" />
          
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

        {/* ROW 2: Search Bar Only - No Navigation Tabs */}
        <div className="bg-stone-900 border-t border-amber-700/30 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="flex gap-2">
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
          </div>
        </div>
      </header>
      
      {/* Close dropdown when clicking outside */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* MAIN CONTENT - Margin accounts for fixed header (logo row + search row) */}
      <main className="max-w-6xl mx-auto px-4 py-6" style={{ marginTop: '140px' }}>
        {/* TAB CONTENT */}
        {activeTab === "studio" && <StudioTab />}
        {activeTab === "equipment" && <EquipmentTab />}
        {activeTab === "scieequip" && <ScieEquipTab />}
        {activeTab === "calculator" && <ThermalCalculatorTab />}
        {activeTab === "colors" && <ColorsTab pendingExpandedColor={pendingExpandedColor} setPendingExpandedColor={setPendingExpandedColor} />}
        {activeTab === "colorscience" && <ColorScienceTab />}
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


function DrawerNavItem({
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all ${
        active
          ? "bg-amber-900/30 border-l-2 border-amber-400 text-amber-400"
          : "text-stone-300 hover:bg-stone-800"
      }`}
    >
      <div className="w-5 h-5 flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function QuickActionCard({
  icon,
  label,
  active,
  onClick,
  backgroundImage,
  scaled = false,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  backgroundImage?: string;
  scaled?: boolean;
}) {
  if (backgroundImage) {
    const height = scaled ? 'h-8' : 'h-32';
    const ringClass = active ? "ring-2 ring-amber-400" : "";
    return (
      <button
        onClick={onClick}
        className={`relative w-full ${height} rounded-2xl overflow-hidden transition-all transform hover:scale-105 flex items-center justify-center ${
          active ? `${ringClass} shadow-lg` : "shadow-md hover:shadow-lg"
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

function ScieEquipTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-amber-400">Scientific Equipment & Instrumentation</h2>
      
      {/* Flame Structure Section */}
      <div className="space-y-6 bg-stone-900/50 p-6 rounded-lg border border-stone-700">
        <h3 className="text-lg font-bold text-amber-300">Flame Structure and Combustion Zones</h3>
        
        <p className="text-stone-300 leading-relaxed">
          The flame structure is critical for atomic absorption spectroscopy and glass analysis. Figure 1 shows a cross-section through the flame, down the source radiation's optical path. The primary combustion zone usually is rich in gas combustion products that emit radiation, limiting its usefulness for atomic absorption. The interzonal region generally is rich in free atoms and provides the best location for measuring atomic absorption. The hottest part of the flame typically is 2–3 cm above the primary combustion zone. As atoms approach the flame's secondary combustion zone, the decrease in temperature allows for formation of stable molecular species.
        </p>
        
        {/* Flame Diagram */}
        <div className="flex justify-center my-6">
          <img 
            src="/manus-storage/flamediagram_78aea61e.png" 
            alt="Flame structure showing primary combustion zone, interzonal region, and secondary combustion zone with optical path"
            className="w-full max-w-2xl rounded-lg border border-stone-600"
          />
        </div>
        
        <p className="text-stone-300 leading-relaxed">
          The flame's temperature, which affects the efficiency of atomization, depends on the fuel–oxidant mixture. Of the common combinations, the air–acetylene and the nitrous oxide–acetylene flames are the most popular. Normally the fuel and oxidant are mixed in an approximately stoichiometric ratio; however, a fuel-rich mixture may be necessary for easily oxidized analytes.
        </p>
        
        {/* Fuels and Oxidants Table */}
        <div className="flex justify-center my-6">
          <img 
            src="/manus-storage/gastables_c580dfb1.png" 
            alt="Table showing fuels and oxidants used for flame combustion with temperature ranges"
            className="w-full max-w-3xl rounded-lg border border-stone-600"
          />
        </div>
        
        <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
          <h4 className="text-amber-300 font-bold mb-2">Key Temperature Ranges:</h4>
          <ul className="text-stone-300 space-y-2 text-sm">
            <li><strong>Natural gas + Air:</strong> 1700–1900°C</li>
            <li><strong>Hydrogen + Air:</strong> 2100–2400°C</li>
            <li><strong>Acetylene + Nitrous oxide:</strong> 2600–2800°C (most popular for high-temperature analysis)</li>
            <li><strong>Acetylene + Oxygen:</strong> 3050–3150°C (highest temperature, used for refractory materials)</li>
          </ul>
        </div>
      </div>
      
      {/* Flame Types Section */}
      <div className="space-y-6 bg-stone-900/50 p-6 rounded-lg border border-stone-700">
        <h3 className="text-lg font-bold text-amber-300">Flame Types: Reducing, Neutral, and Oxidizing</h3>
        
        <p className="text-stone-300 leading-relaxed">
          The chemical composition of a flame depends on the ratio of fuel to oxidant, which determines whether the flame is reducing, neutral, or oxidizing. Each flame type has distinct characteristics and effects on glass working and analysis.
        </p>
        
        {/* Flame Types Diagram */}
        <div className="flex justify-center my-6">
          <img 
            src="/manus-storage/reducingoxyflametypes_9cf3f07b.png" 
            alt="Bunsen burner flame analysis showing reducing flame (yellow), neutral flame (blue), and oxidizing flame (pale blue) with inner cone and feather characteristics"
            className="w-full max-w-2xl rounded-lg border border-stone-600"
          />
        </div>
        
        <div className="space-y-4">
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-orange-500">
            <h4 className="text-orange-300 font-bold mb-2">Reducing Flame (Left)</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              The reducing flame has low oxygen and an excess of acetylene. It displays a secondary feather extending from the inner cone, caused by excess acetylene in the flame mixture. This alters the chemical composition by reducing iron oxide (reducing effect) and adding carbon (carburizing effect). The flame has a yellow or yellowish color due to carbon or hydrocarbons.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-blue-400">
            <h4 className="text-blue-300 font-bold mb-2">Neutral Flame (Center)</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              The neutral flame is produced when the amount of oxygen is precisely enough for complete burning, and neither oxidation nor reduction occurs. The flame is considered neutral because it neither significantly adds nor subtracts any elements from the work. A flame with good balance of oxygen is clear blue and is ideal for most glass working applications.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-cyan-400">
            <h4 className="text-cyan-300 font-bold mb-2">Oxidizing Flame (Right)</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              The oxidizing flame is produced with an excessive amount of oxygen. As oxygen increases, the flame shortens, its color darkens, and it hisses and roars. Since it oxidizes the metal's surface, this flame has a harmful effect on the properties of ferrous alloys. With some exceptions (e.g., platinum soldering in jewelry), the oxidizing flame is usually undesirable for welding and glass working.
            </p>
          </div>
        </div>
      </div>
      
      {/* Flame Annealing Technique Section */}
      <div className="space-y-6 bg-stone-900/50 p-6 rounded-lg border border-stone-700">
        <h3 className="text-lg font-bold text-amber-300">Flame Annealing Technique: Soot Coating Distribution</h3>
        
        <p className="text-stone-300 leading-relaxed">
          Flame annealing is a specialized reducing flame technique that distributes a soot coating on the glass surface at annealing temperature. This process leverages the reducing flame's carbon-rich composition to create a protective soot layer that affects thermal properties and surface characteristics. The soot volume fraction is precisely controlled by adjusting the oxidant-to-fuel ratio in the flame mixture.
        </p>
        
        <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
          <h4 className="text-amber-300 font-bold mb-3">Soot Volume Fraction Measurement Method</h4>
          <p className="text-stone-300 text-sm leading-relaxed mb-3">
            The soot volume fraction is calculated using Beer-Lambert law, which relates the laser-induced incandescence (LII) signal to soot concentration. A ratio between the LII signal (averaged from multiple measurements) and the soot volume fraction is calculated and used to translate both single-shot and averaged LII images to two-dimensional soot volume fraction images. This method is valid across all cases provided that LII signals are measured using identical optical equipment, laser energy, and camera settings. The strength of this semi-simultaneous extinction calibration method is that calibration is performed on soot at exactly the same location in the furnace, ensuring spatial accuracy and reproducibility.
          </p>
        </div>
        
        {/* Soot Volume Fraction Plot */}
        <div className="flex justify-center my-6">
          <img 
            src="/manus-storage/sootplot_21f01739.png" 
            alt="Soot volume fraction vs O2 in oxidant percentage showing logarithmic relationship with data points ranging from 10^-2 to 10^3 ppb at 25-45% O2 concentrations"
            className="w-full max-w-2xl rounded-lg border border-stone-600"
          />
        </div>
        
        <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
          <h4 className="text-amber-300 font-bold mb-2">Key Observations from Soot Generation Plot:</h4>
          <ul className="text-stone-300 space-y-2 text-sm">
            <li><strong>Low O₂ Concentration (25%):</strong> Produces highest soot volume fractions (~10^-2 ppb), indicating strong reducing conditions</li>
            <li><strong>Intermediate O₂ (30-35%):</strong> Moderate soot generation (10^-1 to 10^0 ppb) with controlled reducing effect</li>
            <li><strong>Higher O₂ (40-45%):</strong> Dramatically reduced soot formation (10^1 to 10^3 ppb), approaching neutral flame conditions</li>
            <li><strong>Stoichiometric Ratio:</strong> Critical transition point where reducing flame characteristics diminish and oxidizing effects begin</li>
          </ul>
        </div>
        
        <p className="text-stone-300 text-sm leading-relaxed">
          The logarithmic relationship between oxygen concentration and soot volume fraction demonstrates the precise control required for flame annealing. Studio practitioners can adjust fuel-oxidant ratios to achieve desired soot coating densities, directly influencing glass surface properties, thermal distribution, and final annealing quality.
        </p>
      </div>
      
      {/* Flame Annealing Application Guide */}
      <div className="space-y-6 bg-stone-900/50 p-6 rounded-lg border border-stone-700">
        <h3 className="text-lg font-bold text-amber-300">Flame Annealing Application: Studio Technique Guide</h3>
        
        {/* Studio Technique Image */}
        <div className="flex justify-center my-6">
          <img 
            src="/manus-storage/glassflameanealing_dfa61208.png" 
            alt="Glass flame annealing technique showing torch application with soot coating on borosilicate glass piece in studio setting"
            className="w-full max-w-2xl rounded-lg border border-stone-600"
          />
        </div>
        
        <div className="space-y-4">
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-amber-500">
            <h4 className="text-amber-300 font-bold mb-2">Section 1: What Flame Annealing Actually Does</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Flame annealing does not anneal glass any more than bench cooling does. However, it is genuinely useful for production items and smaller pieces where kiln access is limited or timing is impractical.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-amber-500">
            <h4 className="text-amber-300 font-bold mb-2">Section 2: The Core Principle — Even Temperature Throughout</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Annealing is about allowing the thickest and thinnest parts of the glass to cool at an even temperature all the way through. Varying thicknesses and temperatures across a piece create stress, which causes cracking. When flame annealing, keep a mental map of which areas of your piece hold the most heat, moderate heat, or none — then bring each zone up or down to the annealing temperature of approximately 1050°F.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-amber-500">
            <h4 className="text-amber-300 font-bold mb-2">Section 3: Technique</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Use a bushy, propane-heavy flame. Start with the piece far back in the flame and slowly work it closer. When running more propane than oxygen, the flame deposits soot on any glass that has not reached annealing temperature — soot burns off at around 1000°F, making it a reliable visual indicator. Keep a small amount of oxygen in the mix to help propel the soot onto the glass surface.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Leave the soot layer on the piece. It reduces cracking risk, especially if the piece will not go directly into a kiln. The soot burns off on its own during kilning, or can be removed by bringing the piece back up to temperature in the flame.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed text-orange-300 font-semibold">
              Note: Running near-pure propane can dirty and wear out torch ports — keep them clean.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-red-500">
            <h4 className="text-red-300 font-bold mb-2">Section 4: Limitations and Honest Warnings</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Nothing replaces a kiln. True flame annealing — cooling a piece slowly enough to eliminate internal stress — is theoretically possible with a flame but practically very unlikely to succeed. The kiln exists to cool glass as slowly and evenly as possible without adding stress.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              For large or functional pieces that will regularly contact heat, flame annealing is hard, expensive, and impractical. If a sold piece cracks due to improper flame annealing, the consequences range from unsatisfied customers to lost consignment or wholesale contracts.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-green-500">
            <h4 className="text-green-300 font-bold mb-2">Section 5: When to Use It</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Flame annealing is best used as a bridge technique — most effective for small production items, with kilning to follow as soon as possible. It is not a substitute for proper kiln annealing on work that matters.
            </p>
          </div>
        </div>
      </div>
      
      {/* Spectroscopy Instrumentation Section */}
      <div className="space-y-6 bg-stone-900/50 p-6 rounded-lg border border-stone-700">
        <h3 className="text-lg font-bold text-amber-300">Spectroscopy Instrumentation for Glass Analysis</h3>
        
        <p className="text-stone-300 leading-relaxed">
          Spectroscopy is the primary analytical technique for characterizing borosilicate glass composition, identifying metal ion dopants, and measuring optical properties. Different spectroscopic methods probe different aspects of glass structure and chemistry, from elemental composition to local coordination geometry.
        </p>
        
        <div className="space-y-4">
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-blue-400">
            <h4 className="text-blue-300 font-bold mb-2">Atomic Absorption Spectroscopy (AAS)</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              AAS measures the absorption of light by free metal atoms in the ground state. The flame (or graphite furnace) atomizes the sample, and a hollow cathode lamp provides resonance radiation at the absorption wavelength of the target element. This technique is quantitative and highly selective, making it ideal for measuring trace metal concentrations in glass melts and finished products.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed text-amber-200 font-semibold">
              Studio Application: Verify chromium, cobalt, or nickel concentration in colored glass batches to ensure consistent hue and saturation.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-purple-400">
            <h4 className="text-purple-300 font-bold mb-2">UV-Visible (UV-Vis) Absorption Spectroscopy</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              UV-Vis spectroscopy measures how light is absorbed across the ultraviolet and visible spectrum (200–800 nm). For glass, this reveals electronic transitions of metal ions and provides information about coordination state, oxidation state, and local environment. The absorption spectrum is a fingerprint of the glass composition and thermal history.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              Key insight: The same metal ion (e.g., Ni²⁺) produces different absorption bands depending on its coordination geometry (tetrahedral, octahedral, square planar). Comparing experimental spectra to reference databases allows identification of coordination states and prediction of color shifts with temperature.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed text-amber-200 font-semibold">
              Studio Application: Measure color stability across temperature ranges; detect unwanted iron contamination (Fe²⁺ and Fe³⁺ have distinct absorption profiles).
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-green-400">
            <h4 className="text-green-300 font-bold mb-2">Raman Spectroscopy</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              Raman spectroscopy probes vibrational modes of the glass network itself — the Si–O–Si, B–O–B, and B–O–Si bonds. Unlike IR spectroscopy, Raman is sensitive to symmetric stretching modes and provides direct information about network connectivity and local structure. For borosilicate glass, Raman spectra reveal the ratio of tetrahedral to trigonal boron, which directly affects mechanical and thermal properties.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              The Raman shift (measured in cm⁻¹) identifies specific bond types: Si–O stretches appear around 800–1200 cm⁻¹, B–O stretches around 700–1000 cm⁻¹, and defect modes (non-bridging oxygens) at lower frequencies. Changes in peak position and intensity reflect changes in glass composition or thermal history.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed text-amber-200 font-semibold">
              Studio Application: Detect phase separation or crystallization by monitoring changes in network structure; verify batch consistency by comparing Raman spectra of new glass to reference standards.
            </p>
          </div>
        </div>
      </div>
      
      {/* Temperature Measurement Section */}
      <div className="space-y-6 bg-stone-900/50 p-6 rounded-lg border border-stone-700">
        <h3 className="text-lg font-bold text-amber-300">Temperature Measurement: Thermocouples and Pyrometers</h3>
        
        <p className="text-stone-300 leading-relaxed">
          Accurate temperature measurement is essential for controlling kiln ramp rates, dwell times, and cooling schedules. Two primary technologies dominate glass studio practice: thermocouples (contact-based, low cost, reliable) and optical pyrometers (non-contact, fast response, ideal for moving pieces or high-temperature zones).
        </p>
        
        <div className="space-y-4">
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-orange-400">
            <h4 className="text-orange-300 font-bold mb-2">Thermocouples: The Studio Standard</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              A thermocouple is a pair of dissimilar metals joined at one end. When the junction is heated, a small voltage (millivolts) is generated proportional to temperature. This voltage is measured by a controller or data logger and converted to temperature using a calibration curve. Thermocouples are inexpensive, durable, and accurate to ±1–2°C when properly calibrated.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              <strong>Common thermocouple types for glass studios:</strong>
            </p>
            <ul className="text-stone-300 space-y-1 text-sm ml-4">
              <li>• <strong>Type K (Chromel-Alumel):</strong> −200 to +1372°C, most common, good accuracy, inexpensive</li>
              <li>• <strong>Type R (Platinum-Platinum/Rhodium):</strong> 0 to +1768°C, high accuracy, expensive, used for precision work</li>
              <li>• <strong>Type S (Platinum-Platinum/Rhodium):</strong> 0 to +1768°C, similar to Type R, slightly different sensitivity</li>
            </ul>
            <p className="text-stone-300 text-sm leading-relaxed mt-3 text-amber-200 font-semibold">
              Studio Tip: Type K thermocouples are adequate for most kiln monitoring. Place the junction in a ceramic protection tube at the geometric center of the kiln chamber for representative temperature readings. Avoid contact with kiln walls or heating elements, which can cause localized heating errors.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-red-400">
            <h4 className="text-red-300 font-bold mb-2">Optical Pyrometers: Non-Contact Measurement</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              An optical pyrometer measures the intensity of thermal radiation emitted by a hot object. The instrument focuses infrared light from the target onto a detector and converts the signal to temperature using the Stefan-Boltzmann law and Planck's radiation law. Optical pyrometers are non-contact, making them ideal for measuring moving pieces, high-temperature zones, or situations where a thermocouple cannot be placed.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              <strong>Key considerations:</strong>
            </p>
            <ul className="text-stone-300 space-y-1 text-sm ml-4">
              <li>• <strong>Emissivity:</strong> Glass emissivity varies with wavelength and temperature. Borosilicate glass has emissivity around 0.85–0.95 in the infrared. Pyrometers typically assume emissivity = 1 (blackbody), so readings may be 20–50°C high for glass. Calibration against a thermocouple is essential.</li>
              <li>• <strong>Field of View:</strong> Narrow field of view (small target area) reduces measurement error from surrounding cooler surfaces. For kiln monitoring, use a pyrometer with at least 12:1 distance-to-spot ratio.</li>
              <li>• <strong>Response Time:</strong> Optical pyrometers respond in milliseconds, making them ideal for tracking rapid temperature changes during ramps.</li>
            </ul>
            <p className="text-stone-300 text-sm leading-relaxed mt-3 text-amber-200 font-semibold">
              Studio Tip: For borosilicate glass, set pyrometer emissivity to 0.90 and verify against a thermocouple reading at 1000°C. Adjust emissivity if readings differ by more than 10°C.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-cyan-400">
            <h4 className="text-cyan-300 font-bold mb-2">Thermal Imaging: Spatial Temperature Distribution</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              Thermal imaging cameras (infrared cameras) capture the temperature distribution across an entire surface in real time. Each pixel represents a temperature value, displayed as a color-coded image. For kiln monitoring, thermal imaging reveals hot spots, dead zones, and temperature gradients that single-point thermocouples cannot detect.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-2">
              Thermal imaging is particularly valuable for diagnosing kiln performance issues: uneven heating suggests element failure or refractory damage; rapid cooling in one zone indicates air leakage; and temperature stratification (hotter at top, cooler at bottom) reveals convection patterns and can inform piece placement strategies.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed text-amber-200 font-semibold">
              Studio Application: Use thermal imaging during the first kiln run after repairs or refractory replacement to verify even heating and identify problem areas before production work begins.
            </p>
          </div>
        </div>
        
        <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
          <h4 className="text-amber-300 font-bold mb-3">Recommended Temperature Measurement Strategy</h4>
          <p className="text-stone-300 text-sm leading-relaxed mb-3">
            For production work, combine thermocouple and pyrometer measurements: use thermocouples for continuous kiln monitoring and controller feedback (they are reliable and inexpensive), and use optical pyrometers or thermal imaging to verify piece temperature and detect spatial gradients. This dual approach provides both accuracy and diagnostic capability.
          </p>
          <p className="text-stone-300 text-sm leading-relaxed">
            Calibrate all instruments annually against a reference standard. For thermocouples, use an ice bath (0°C) and boiling water (100°C) as quick checks; for pyrometers, compare readings against a calibrated thermocouple at multiple temperatures between 600–1200°C.
          </p>
        </div>
      </div>
      
      <p className="text-stone-400 text-sm">Scientific equipment and instrumentation for borosilicate glass research and analysis.</p>
    </div>
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
