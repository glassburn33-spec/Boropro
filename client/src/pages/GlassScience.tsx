/*
BoroPro - Practical Glass Blower Reference Tool
Design: Studio-focused, minimal reading, maximum usability
Dark theme for studio environment, large touch targets for gloved hands
*/

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "wouter";
import { Home as HomeIcon, Zap, Calculator, Palette, ChevronDown, Menu, X, ZoomIn } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { StudioScienceIcon } from "@/components/icons/StudioScienceIcon";
import { GlassRodsIcon } from "@/components/icons/GlassRodsIcon";
import { CalculatorIcon } from "@/components/icons/CalculatorIcon";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { torchDatabase } from "@/data/torches_expanded";
import { Accordion as CustomAccordion } from "@/components/Accordion";

import { searchContent, SearchResult } from "@/lib/searchIndex";
import { SearchResults } from "@/components/SearchResults";
import { CalculatorTab as ThermalCalculatorTab } from "./CalculatorTab";
import ColorScience from "./ColorScience";

type TabType = "studio" | "scieequip" | "calculator" | "colorscience";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>(tabParam || "studio");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [showDrawer, setShowDrawer] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && (tabParam === "studio" || tabParam === "scieequip" || tabParam === "calculator" || tabParam === "colorscience")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

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
    if (result.type === "schedule") {
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
        <div className="flex items-center h-20 px-4 gap-2 relative">
          {/* Hamburger Menu Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="p-2 hover:bg-stone-800 rounded transition flex-shrink-0 w-12 h-12 flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6 text-yellow-400" />
            </button>
            
            {/* Dropdown Menu */}
            {showDrawer && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-stone-800 border border-amber-700/50 rounded shadow-lg z-1000">
                <button
                  onClick={() => { handleTabChange("studio"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-yellow-400 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Glass-Science
                </button>
                <button
                  onClick={() => { handleTabChange("scieequip"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-yellow-400 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Scie-Equip
                </button>
                <button
                  onClick={() => { handleTabChange("colorscience"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-yellow-400 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Color-Scie
                </button>
                <a
                  href="/tools"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-yellow-400 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  Tools
                </a>

              </div>
            )}
          </div>
          
          {/* Logo on left */}
          <img src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png" alt="BoroPro Logo" className="h-20 w-20 flex-shrink-0 object-contain" />
          
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


      </header>
      
      {/* Close dropdown when clicking outside */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* MAIN CONTENT - Margin accounts for fixed header */}
      <main className="max-w-6xl mx-auto px-4 py-6" style={{ marginTop: '88px' }}>
        {/* TAB CONTENT */}
        {activeTab === "studio" && <StudioTab />}
        {activeTab === "scieequip" && <ScieEquipTab />}
        {activeTab === "calculator" && <ThermalCalculatorTab />}
        {activeTab === "colorscience" && <ColorScience />}
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
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      {/* GLASS SCIENCE TITLE */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">Glass Science</h1>
      </div>

      {/* GLASS SCIENCE HEADER IMAGE */}
      <div className="w-full flex flex-col items-center mb-6">
        <img
          src="/manus-storage/Gemini_Generated_Image_i657vfi657vfi657_70af8fcb.png"
          alt="Borosilicate glass structure showing glass tube with molecular composition of silicon, boron, and oxygen atoms"
          className="w-full max-w-4xl rounded-xl border border-stone-700 shadow-lg"
        />
      </div>

      {/* GLASS SCIENCE HEADER */}
      <div className="border-t border-stone-700 pt-8 mt-8">

        <div className="max-w-2xl mx-auto pb-10 px-2 md:px-4">
          <Accordion type="single" collapsible className="space-y-4">
            {/* SECTION 1: CHEMICAL COMPOSITION */}
            <AccordionItem value="composition">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-3 md:px-6 py-3 md:py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-base md:text-lg font-semibold text-amber-400 break-words">
                  Chemical Composition of Borosilicate Glass
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-3 md:px-6 py-3 md:py-4">
                <div className="space-y-4">
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Borosilicate glass is formulated with significant amounts of silicon dioxide (SiO<sub>2</sub>) as the primary network former and boron trioxide (B<sub>2</sub>O<sub>3</sub>) as a secondary network former. The combination of approximately 80%+ silica with ~13% boric oxide creates a glass matrix with exceptional thermal shock resistance, chemical durability, and low thermal expansion—making it ideal for laboratory glassware and high-temperature applications.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    A typical borosilicate composition contains: Silicon dioxide (SiO<sub>2</sub>): 70-80%, Boron trioxide (B<sub>2</sub>O<sub>3</sub>): 10-15%, Alkali oxides (Na<sub>2</sub>O, K<sub>2</sub>O): 3-5%, Aluminum oxide (Al<sub>2</sub>O<sub>3</sub>): 1-3%. These proportions can vary slightly between manufacturers, but the high silica and boric oxide content remains the defining characteristic that provides borosilicate glass with its superior performance in thermal and chemical environments.
                  </p>
                  <div className="w-full flex justify-center my-6">
                    <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer w-full" onClick={() => setExpandedImage("/manus-storage/chemcompboro_fdd7eb5c.png")}>
                      <img
                        src="/manus-storage/chemcompboro_fdd7eb5c.png"
                        alt="Chemical composition of borosilicate glass showing SiO2 81%, B2O3 13%, Na2O/K2O 4%, Al2O3 2%"
                        className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs italic text-center">
                    DURAN® borosilicate glass 3.3 chemical composition table. The high silica and boric oxide content provides exceptional thermal and chemical resistance.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 2: THERMAL PROPERTIES */}
            <AccordionItem value="thermal">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-3 md:px-6 py-3 md:py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-base md:text-lg font-semibold text-amber-400 break-words">
                  Thermal Properties
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-3 md:px-6 py-3 md:py-4">
                <div className="space-y-4">
                  <p className="text-stone-300 text-xs md:text-sm leading-relaxed break-words">
                    Borosilicate glass exhibits a remarkably low thermal expansion coefficient, which minimizes internal stress development during temperature fluctuations. This property allows the material to endure steep temperature gradients and rapid thermal cycling without fracturing. However, surface defects such as scratches or chips can compromise this thermal resilience by creating stress concentration points.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The <span className="text-amber-300 font-semibold">"Strain point"</span> represents the upper threshold for safe continuous use of borosilicate vessels. Beyond approximately 500°C, residual stresses may become permanent upon cooling, potentially weakening the material's structural integrity over time.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Manufacturing processes employ precision annealing cycles in specialized kilns to systematically relieve internal stresses and achieve uniform material properties throughout each piece of glassware.
                  </p>
                  <div className="w-full flex justify-center my-6">
                    <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer w-full" onClick={() => setExpandedImage("/manus-storage/thermpropboro_81841fb8.png")}>
                      <img
                        src="/manus-storage/thermpropboro_81841fb8.png"
                        alt="Thermal properties of borosilicate glassware including strain point, annealing point, softening point, and thermal conductivity"
                        className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs italic text-center">
                    Typical thermal properties of borosilicate glassware. The low coefficient of linear expansion (32.5 × 10⁻⁷/° C) enables excellent thermal shock resistance.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 3: CRYSTAL STRUCTURE */}
            <AccordionItem value="structure">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-3 md:px-6 py-3 md:py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-base md:text-lg font-semibold text-amber-400 break-words">
                  The Structure of Glass: Why It Behaves the Way It Does
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-3 md:px-6 py-3 md:py-4">
                <div className="space-y-4">
                  {/* CRYSTAL STRUCTURE IMAGE */}
                  <div className="w-full flex flex-col items-center mb-6">
                    <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer w-full" onClick={() => setExpandedImage("/manus-storage/CRYSTALINSTRUCTUR_b19e4d65.png")}>
                      <img
                        src="/manus-storage/CRYSTALINSTRUCTUR_b19e4d65.png"
                        alt="Crystal vs Glass structure comparison: ordered quartz lattice vs disordered silica glass network"
                        className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-stone-500 text-xs italic text-center mt-3 max-w-xl">
                      Atomic structure comparison: crystalline quartz (ordered, periodic lattice) vs. silica glass (disordered, amorphous network). The absence of long-range order in glass is the origin of its unique thermal behavior.
                    </p>
                  </div>

                  {/* SUBSECTION 1 */}
                  <div>
                    <h3 className="text-amber-400 font-bold text-base mb-2">
                      Glass: A Material Between Two Worlds
                    </h3>
                    <div className="text-stone-300 text-sm leading-relaxed space-y-3">
                      <p>
                        Glass exists in a peculiar state of matter, neither purely solid nor liquid. Unlike crystalline solids where atoms arrange in repeating geometric patterns, or liquids where atoms move with complete freedom, glass forms an <span className="text-amber-300 font-semibold">amorphous network</span>. When molten borosilicate cools rapidly, its atomic structure locks into a random, interconnected arrangement before crystallization can occur. This frozen disorder is what defines glass's unique mechanical and thermal character.
                      </p>
                      <p>
                        The consequences of this structure are profound. Crystalline materials exhibit abrupt phase transitions — a single melting temperature where the entire ordered lattice suddenly collapses. Glass shows no such discontinuity. Instead, as temperature increases, the material gradually transitions through progressive stages of softness, with viscosity changing smoothly rather than catastrophically. This continuous transformation occurs because there is no rigid geometric order to suddenly break apart — only an increasingly mobile tangle of atomic bonds.
                      </p>
                    </div>
                  </div>

                  {/* SUBSECTION 2 */}
                  <div className="pt-4 border-t border-stone-700">
                    <h3 className="text-amber-400 font-bold text-base mb-2">
                      The Transformation Zone: Glass Transition Temperature (Tg)
                    </h3>
                    <div className="text-stone-300 text-sm leading-relaxed space-y-3">
                      <p>
                        The <span className="text-amber-300 font-semibold">glass transition temperature (Tg)</span> marks the boundary where glass shifts from a rigid, brittle state to a viscoelastic, increasingly fluid state. For borosilicate glass, this occurs near <span className="text-amber-300 font-semibold">565 °C</span>. Below this threshold, atomic motion is confined to local vibrations — the network structure remains essentially fixed. Above Tg, thermal energy activates larger-scale molecular rearrangements, allowing network segments to gradually slip past one another. The transition is not instantaneous; viscosity decreases continuously as temperature climbs.
                      </p>
                      <p>
                        The glass transition temperature coincides with the <span className="text-amber-300 font-semibold">annealing point</span> — the optimal temperature for stress relief. At this temperature, the network possesses just enough molecular mobility to gradually relax internal tensions accumulated during shaping, while remaining stiff enough to maintain the piece's form without sagging.
                      </p>
                    </div>
                  </div>

                  {/* SUBSECTION 3 */}
                  <div className="pt-4 border-t border-stone-700">
                    <h3 className="text-amber-400 font-bold text-base mb-2">
                      The Freezing Point: Strain Point (~515 °C)
                    </h3>
                    <div className="text-stone-300 text-sm leading-relaxed space-y-3">
                      <p>
                        The <span className="text-amber-300 font-semibold">strain point</span> represents the temperature below which the glass network becomes essentially immobile. Stresses embedded in the structure during cooling or manipulation become permanently locked at this threshold and cannot be relieved through subsequent thermal treatment. This is the critical boundary tracked by the BoroPro calculator: once a piece drops below approximately 515 °C outside a controlled annealing environment, its residual stress profile becomes fixed. Objects that traverse this temperature while experiencing significant internal thermal gradients retain permanent stress concentrations and face increased vulnerability to spontaneous fracture over time.
                      </p>
                    </div>
                  </div>

                  {/* SUBSECTION 4 */}
                  <div className="pt-4 border-t border-stone-700">
                    <h3 className="text-amber-400 font-bold text-base mb-2">
                      The Workable Range: Softening and Manipulation Temperatures
                    </h3>
                    <div className="text-stone-300 text-sm leading-relaxed space-y-3">
                      <p>
                        As heat increases beyond Tg, network viscosity drops steadily. Two temperature zones define the practical working envelope.
                      </p>
                      <p>
                        <span className="text-amber-300 font-semibold">Softening Point (~820 °C for borosilicate):</span> The temperature at which glass becomes pliable enough to flow under its own weight. Viscosity reaches approximately 10⁷·⁶ Pa·s. The network achieves sufficient atomic mobility that significant deformation occurs with minimal external force.
                      </p>
                      <p>
                        <span className="text-amber-300 font-semibold">Manipulation Point (~1050–1100 °C for borosilicate):</span> The temperature at which glass exhibits sufficient fluidity for active shaping operations. Viscosity drops to roughly 10³ Pa·s. Network segments slide readily past one another, enabling pulling, inflation, compression, and joining without crystallization or optical degradation. The Si–O–Si and B–O–B bonds remain intact; thermal motion simply activates rotation and translation within the amorphous structure.
                      </p>
                      <p>
                        <span className="text-amber-300 font-semibold">Why Amorphous Structure Enables Flexibility:</span> The absence of a fixed melting point and the lack of crystallographic planes mean the working range presents a continuous temperature window rather than a narrow target. The random network structure naturally distributes mechanical stress throughout its volume rather than concentrating it at specific weak points, making it inherently resistant to the thermal shock that would fracture a crystalline material.
                      </p>
                    </div>
                  </div>

                  {/* SUBSECTION 5 */}
                  <div className="pt-4 border-t border-stone-700">
                    <h3 className="text-amber-400 font-bold text-base mb-2">
                      Cooling Kinetics and Permanent Stress
                    </h3>
                    <div className="text-stone-300 text-sm leading-relaxed space-y-3">
                      <p>
                        Upon removal from heat, surface regions cool faster than interior zones. While crystalline materials would fracture along predetermined cleavage planes under such differential contraction, glass develops distributed internal tension — the contracting surface is mechanically restrained by the warmer core. If thermal gradients remain significant as the piece traverses the transition zone (515–565 °C), residual stresses become permanently embedded in the network structure at the strain point. These frozen stresses may remain dormant for extended periods before triggering delayed fracture.
                      </p>
                      <p>
                        Geometry fundamentally controls safe cooling rates: thicker cross-sections generate larger temperature differentials across their thickness at equivalent surface cooling speeds. This is why wall thickness and diameter are primary parameters in the working-time calculation. The underlying physics relates how quickly the entire glass mass approaches the strain point under ambient cooling, and whether the resulting internal thermal gradient exceeds the tensile capacity of the borosilicate network structure.
                      </p>
                    </div>
                  </div>

                  <p className="text-stone-500 text-xs italic mt-4">
                    Temperature values cited apply to standard borosilicate compositions (linear expansion coefficient ~33 × 10⁻⁷/°C). Alternative glass families including soda-lime and specialty borosilicate variants exhibit distinct transition temperatures and viscosity behaviors. Combining different glass types in one object is not recommended due to thermal expansion mismatch.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 4: GLASS SCIENCE */}
            <AccordionItem value="annealing">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-3 md:px-6 py-3 md:py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-base md:text-lg font-semibold text-amber-400 break-words">
                  The Science of Glass Annealing
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                <div className="space-y-4">
                  <div className="w-full flex justify-center my-6">
                    <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer w-full" onClick={() => setExpandedImage("/manus-storage/viscosityplot_99c24e57.png")}>
                      <img
                        src="/manus-storage/viscosityplot_99c24e57.png"
                        alt="Viscosity-Temperature profile for common glass types showing critical annealing range"
                        className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Annealing represents a carefully orchestrated thermal treatment where glass transitions gradually from elevated temperature back to ambient conditions. This controlled descent eliminates residual stresses accumulated during fabrication and shaping. Rapid cooling creates a mechanical mismatch: surface regions contract before interior zones, producing permanent tensile stresses at the surface and compressive stresses at the core. These locked-in stresses manifest as spontaneous failure, optical aberrations, or time-delayed fracture that may emerge months or years post-manufacture.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Stress formation in glass directly correlates with the glass transition temperature (Tg) and strain point thresholds. During cooling through the annealing point (roughly 565°C for borosilicate), atomic network mobility diminishes progressively. Asymmetric cooling rates between surface and core induce differential contraction, generating surface tension and interior compression. Once temperature drops below the strain point (approximately 515°C), atomic rearrangement essentially halts, permanently embedding any existing stresses into the network structure.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The annealing point marks the temperature window where internal stresses dissipate through molecular relaxation, typically within 15-minute intervals. At this threshold, sufficient atomic mobility permits network segments to gradually shift toward equilibrium configurations, progressively releasing accumulated tension. The strain point defines the lower limit beyond which stress relief becomes negligible—stresses established below this boundary remain fixed unless the material is reheated to the annealing point. The interval separating these two temperatures constitutes the critical annealing zone, demanding meticulous thermal control to circumvent permanent stress fixation.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Multiple parameters influence annealing duration and thermal scheduling: material composition determines transition temperatures, cross-sectional dimensions and shape govern internal thermal gradients, and descent velocity establishes stress magnitude. Inadequate annealing manifests as thermal shock fracture, stress-induced optical distortion, or dormant fracture from embedded stresses. Industrial protocols optimize thermal schedules to achieve maximum stress elimination within minimal timeframes, reconciling energy efficiency with thorough stress mitigation requirements.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

                {/* SECTION 5: GLASS HEAT TREATMENT */}
            <AccordionItem value="heattreatment">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-3 md:px-6 py-3 md:py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-base md:text-lg font-semibold text-amber-400 break-words">
                  Glass Heat Treatment Profile
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-3 md:px-6 py-3 md:py-4">
                <div className="space-y-4">
                  <div className="w-full flex justify-center my-6">
                    <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer w-full" onClick={() => setExpandedImage("/manus-storage/boroanealprofile_20331f22.png")}>
                      <img
                        src="/manus-storage/boroanealprofile_20331f22.png"
                        alt="Borosilicate Glass Heat Treatment Profile showing four phases of annealing"
                        className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    A thermal treatment schedule, commonly termed a firing protocol or kiln regimen, represents a meticulously engineered temperature-time trajectory that orchestrates glass heating and cooling through stress mitigation. This schedule comprises four sequential stages, each addressing distinct thermal requirements. Schedule design depends on material composition, component dimensions and shape, and permissible residual stress thresholds. Effective thermal protocols circumvent thermal shock damage, crystallization phenomena, and permanent stress entrapment that could precipitate catastrophic failure.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Stage one involves accelerated heating toward temperatures exceeding the annealing threshold. Rapid ascent remains acceptable here since glass rises uniformly from ambient conditions before entering the stress-critical cooling domain. The objective is efficient temperature achievement without generating internal thermal disparities, as glass remains beneath its transformation temperature and cannot yet dissipate accumulated tension. Typical heating velocities span 5–15°C per minute, adjusted for component cross-section.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Stage two involves plateau holding, or saturation, maintaining elevated temperature above the annealing threshold for extended intervals (typically 15–60 minutes based on thickness). This duration facilitates thermal homogenization across the entire component, guaranteeing interior and exterior surfaces attain thermal equilibrium before descent commences. Insufficient plateau duration allows internal temperature asymmetry to persist through the critical cooling phase, generating permanent stress fixation. Plateau temperature typically ranges 20–40°C above the annealing point, balancing stress elimination against energy conservation.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Stage three represents the most demanding phase: controlled descent from above the annealing point through the strain boundary. Descent velocity requires precise regulation to constrain thermal gradients developing between surface and interior zones. Maximum descent rates depend on component geometry (cross-sectional dimension and profile radius dominate), material composition, and acceptable residual stress magnitude. Typical descent spans 1–3°C per minute for substantial components, with accelerated rates (up to 5°C per minute) permissible for thin sections. Viscosity dynamics prove essential: as temperature diminishes, glass viscosity escalates exponentially, progressively restricting the atomic framework's capacity for stress dissipation. Upon reaching the strain threshold, viscosity elevation becomes so pronounced that additional stress relief becomes negligible.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Stage four encompasses accelerated descent below the strain point. Below this threshold, the atomic lattice becomes essentially immobilized and cannot dissipate stresses through molecular rearrangement. Stresses established below the strain point demonstrate temporary characteristics and present diminished delayed-fracture hazard compared to stresses locked during the critical annealing window. Consequently, descent acceleration during this final stage conserves time and energy resources. Descent rates below the strain point can safely reach 10–20°C per minute or exceed without generating permanent stress formation. Frequent protocol errors include excessive descent velocity through the critical annealing window (producing permanent stresses), excessive temperature maintenance (squandering energy and promoting crystallization), or incompatible schedules for specific glass compositions (varying materials possess distinct transition temperatures and demand customized protocols).
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 6: DEVITRIFICATION */}
            <AccordionItem value="devitrification">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-3 md:px-6 py-3 md:py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-base md:text-lg font-semibold text-amber-400 break-words">
                  Devitrification
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-3 md:px-6 py-3 md:py-4">
                <div className="space-y-4">
                  <div className="w-full flex justify-center my-6">
                    <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer w-full" onClick={() => setExpandedImage("/manus-storage/devitrifiedtube_b150dc7c.png")}>
                      <img
                        src="/manus-storage/devitrifiedtube_b150dc7c.png"
                        alt="Devitrified glass tube showing crystalline formation and hazy appearance"
                        className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Crystallization phenomena manifest as diminished optical clarity, with affected glass displaying pale, grey, or opaque surface characteristics often termed "frosted," "dusty," "powdery," or "clouded" by practitioners. This phenomenon emerges on exterior surfaces or within interior matrices, though surface manifestation predominates. Crystalline growth induces volumetric contraction, frequently producing wrinkled topography or fracture patterns; this crystallization-driven fracturing differs from surface degradation from inadequate annealing, thermal stress, or environmental weathering. Crystallization typically occurs unintentionally, though deliberate induction for aesthetic purposes remains possible; surface cleaning cannot eliminate established crystallization.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Crystallization emerges through multiple pathways. When kiln-processed glass maintains temperatures at or near the melting threshold (the point where material transitions to complete fluidity) or remains within the "crystallization susceptibility zone" for extended periods, and/or undergoes gradual cooling, crystal lattices acquire sufficient time for expansion within the matrix. The "crystallization susceptibility zone" or "crystallization temperature window" represents the thermal band where crystallization probability escalates, typically manifesting in conventional glasses between approximately 1300 to 1550°C, though varying compositions establish distinct crystallization windows. Glass lacking thorough pre-firing preparation demonstrates heightened crystallization susceptibility, since residual fingerprints, particulates, and surface impurities function as crystallization nucleation sites.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Glass composition fundamentally influences crystallization susceptibility. Historical glass formulations, characterized by compositional complexity, exhibit reduced crystallization frequency compared to contemporary formulations with simplified component structures. Boron-containing glasses demonstrate enhanced crystallization resistance, whereas calcium-rich formulations cool gradually, expanding crystallization probability windows. Glasses incorporating opalescent modifiers, opaque formulations, and pigmented compositions all demonstrate heightened crystallization propensity. These compositional additions establish "localized crystalline domains" within the matrix where crystallization initiates preferentially.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Despite surface similarities to certain degradation phenomena, including environmental weathering, crystallization constitutes a manufacturing phenomenon rather than deterioration. Glass degradation emerges from chemical exchanges between glass and environmental factors; crystallization, conversely, originates during manufacturing and therefore should not broadly signify "loss of glassy character." Crystallization does not modify the fundamental chemical structure of the glass matrix. Since crystallization represents an intrinsic manufacturing characteristic rather than progressive deterioration, conservation protocols typically do not mandate crystallization removal or remediation in artifact preservation contexts.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* FULL-SCREEN IMAGE MODAL */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
          onKeyDown={(e) => e.key === 'Escape' && setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={expandedImage}
              alt="Expanded view"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-lg transition-colors"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
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
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const accordionItems = [
    {
      id: 'flame-structure',
      title: 'Flame Structure and Combustion Zones',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Understanding flame architecture is fundamental to spectroscopic analysis and glass material characterization. The diagram illustrates a longitudinal cross-section aligned with the analytical beam path. The initial combustion region contains abundant molecular emission products that interfere with absorption measurements, reducing analytical sensitivity. The middle thermal band exhibits high concentrations of atomized species, making it optimal for absorption-based detection. Peak thermal intensity occurs approximately 2–3 cm above the initial combustion zone. As atomic species rise toward the terminal combustion region, declining temperatures promote recombination into molecular compounds.
          </p>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-2xl" onClick={() => setExpandedImage('/manus-storage/flamediagram_78aea61e.png')}>
              <img 
                src="/manus-storage/flamediagram_78aea61e.png" 
                alt="Flame structure showing primary combustion zone, interzonal region, and secondary combustion zone with optical path"
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <p className="text-stone-300 leading-relaxed">
            Flame thermal output directly influences atomization efficiency and is determined by fuel-oxidant composition. Among prevalent fuel-oxidant pairings, air-acetylene and nitrous oxide-acetylene systems dominate analytical applications. Standard operation maintains near-stoichiometric fuel-oxidant proportions; however, fuel-excess configurations enhance analysis of readily oxidizable elements and compounds.
          </p>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/gastables_c580dfb1.png')}>
              <img 
                src="/manus-storage/gastables_c580dfb1.png" 
                alt="Table showing fuels and oxidants used for flame combustion with temperature ranges"
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
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
      ),
    },
    {
      id: 'flame-types',
      title: 'Flame Types: Reducing, Neutral, Oxidizing, and Carburizing',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Flame behavior is fundamentally determined by the proportional balance between fuel and oxidant components, which establishes whether the flame exhibits reducing, neutral, oxidizing, or carburizing properties. Each flame configuration presents unique thermal and chemical characteristics that significantly influence glass manipulation and analytical procedures.
          </p>

          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-yellow-500">
            <h4 className="text-yellow-300 font-bold mb-3">Carburizing Flame</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Carburizing flame characteristics arise from acetylene surplus conditions, identifiable by an intermediate thermal zone positioned between the central cone and outer envelope. This intermediate zone exhibits diminished luminosity and pale coloration relative to the central cone, yet maintains considerably greater brightness than the peripheral envelope. This gentle flame configuration (alternatively termed a reducing flame) proves advantageous for aluminum and aluminum-based alloy joining and for low-temperature soldering operations.
            </p>
            <div className="flex justify-center my-4">
              <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/reductinonflame_e88e8e04.webp')}>
                <img 
                  src="/manus-storage/reductinonflame_e88e8e04.webp" 
                  alt="Carburizing flame showing torch nozzle with bright blue-white inner core transitioning to multicolored flame with magenta, purple, yellow, orange, and rainbow-colored feather extending outward"
                  className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-blue-400">
            <h4 className="text-blue-300 font-bold mb-3">Neutral Flame Image Description</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Neutral flame morphology reveals two distinct thermal stratifications. The central luminous zone emits brilliant white-cyan radiation and occupies minimal distance from the torch aperture. The surrounding thermal mantle displays subdued coloration and reduced radiance intensity. This equilibrium flame configuration enables metallurgically neutral operations, facilitating steel joining, thermal processing, and sectioning without chemical modification. A subtle reducing microzone precedes the central luminous region. Though visually elusive and perceptually challenging, this zone establishes the reducing chemical environment essential for flux-free steel joining operations.
            </p>
            <div className="flex justify-center my-4">
              <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/neutralizingflame_37453d37.webp')}>
                <img 
                  src="/manus-storage/neutralizingflame_37453d37.webp" 
                  alt="Neutral flame showing torch nozzle with bright cyan-white inner core transitioning to multicolored flame with blue, purple, magenta, and rainbow-colored feather extending outward"
                  className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-cyan-400">
            <h4 className="text-cyan-300 font-bold mb-3">Oxidizing Flame Image Description</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Oxidizing flame manifestation occurs through incremental oxygen augmentation beyond the secondary zone elimination threshold. This flame exhibits abbreviated overall extent and intensified sharpness relative to neutral configurations, featuring a diminished and acutely tapered central cone. Thermal intensity marginally surpasses neutral flame output, establishing applicability for ferrous casting joining, copper-based alloy fabrication, zinc-containing alloy operations, and specialized brazing procedures.
            </p>
            <div className="flex justify-center my-4">
              <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/oxydizingflame_8b8072d2.webp')}>
                <img 
                  src="/manus-storage/oxydizingflame_8b8072d2.webp" 
                  alt="Oxidizing flame showing torch nozzle with sharp white-bluish inner core transitioning to multicolored flame with blue, cyan, magenta, orange, and rainbow-colored feather extending outward"
                  className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'flame-annealing',
      title: 'Flame Annealing Technique: Soot Coating Distribution',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Thermal annealing via flame exposure employs a carbon-rich reducing flame to deposit particulate carbon layers on glass surfaces during thermal treatment. This specialized methodology exploits the reducing flame's hydrocarbon-saturated environment to establish a thermal-protective carbon deposit that modulates heat transfer characteristics and surface behavior. Carbon deposit density is finely regulated through manipulation of the oxidant-to-fuel proportional balance.
          </p>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/glassflameanealing_ac208885.png')}>
              <img 
                src="/manus-storage/glassflameanealing_ac208885.png" 
                alt="Glass flame annealing technique showing borosilicate glass piece being heated in a flame with soot coating distribution visible"
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Soot Volume Fraction Measurement Method</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Carbon deposit quantification employs the Beer-Lambert optical principle, which correlates laser-stimulated thermal radiation (LTR) emissions to particulate carbon concentration. A proportional relationship between LTR signal intensity (derived from repetitive sampling) and carbon deposit density is established and applied to convert both instantaneous and temporally-averaged LTR measurements into spatial carbon deposit density distributions. This quantification approach maintains validity across experimental configurations when LTR measurements employ standardized optical apparatus, consistent laser power delivery, and uniform detector sensitivity. This calibration methodology's effectiveness derives from performing quantification on carbon deposits at the precise furnace location under investigation, guaranteeing positional precision and experimental reproducibility.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-2xl" onClick={() => setExpandedImage('/manus-storage/sootplot_e2efdeba.png')}>
              <img 
                src="/manus-storage/sootplot_e2efdeba.png" 
                alt="Soot volume fraction vs O2 in oxidant percentage showing logarithmic relationship with data points ranging from 10^-2 to 10^3 ppb at 25-45% O2 concentrations"
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
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
            The exponential inverse relationship between oxygen availability and carbon deposit density illustrates the exacting precision necessary for thermal flame treatment. Glass workers can modulate fuel-oxidant proportions to establish targeted carbon deposit intensities, substantially affecting surface thermal behavior, heat dissipation patterns, and ultimate thermal treatment outcomes.
            </p>
        </div>
      ),
    },
    {
      id: 'spectroscopy',
      title: 'Spectroscopy Instrumentation for Glass Analysis',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Optical spectroscopic methods form the foundation for compositional characterization and photon-matter interaction analysis in vitreous materials. Three principal optical methodologies dominate contemporary glass characterization: Atomic Absorption Spectroscopy (AAS), UV-Visible Spectroscopy (UV-Vis), and Raman Spectroscopy.
          </p>
          
          <div className="space-y-4">
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-purple-500">
              <h4 className="text-purple-300 font-bold mb-2">Atomic Absorption Spectroscopy (AAS)</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                AAS quantifies photon absorption by isolated atoms in their lowest energy configuration. Sample atomization via thermal flame dissociation generates free atoms that selectively absorb radiation at element-specific wavelengths. This methodology establishes quantitative metal ion concentrations within vitreous matrices, particularly for transition metals including cobalt, chromium, and nickel species.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-blue-500">
              <h4 className="text-blue-300 font-bold mb-2">UV-Visible Spectroscopy (UV-Vis)</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                UV-Vis spectroscopy quantifies photon absorption and transmission across the ultraviolet and visible wavelength regions. This methodology elucidates electronic state transitions within colored metal ion species and proves indispensable for comprehending the chromatic mechanisms whereby transition metal ions generate their distinctive optical signatures within vitreous networks.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-red-500">
              <h4 className="text-red-300 font-bold mb-2">Raman Spectroscopy</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                Raman spectroscopy interrogates molecular and ionic vibrational energy states. Within glass characterization applications, this technique furnishes structural information regarding local coordination geometry surrounding metal ion centers and their immediate chemical environment. When integrated with UV-Vis measurements, Raman data synthesizes a comprehensive compositional and structural profile of the vitreous material.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'temperature',
      title: 'Temperature Measurement: Thermocouples and Pyrometers',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Precision thermal quantification forms the cornerstone of successful flame annealing and glass fabrication operations. Two fundamental measurement methodologies predominate: thermocouple-based contact measurement and radiometric pyrometer-based remote sensing techniques.
          </p>
          
          <div className="space-y-4">
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-yellow-500">
              <h4 className="text-yellow-300 font-bold mb-2">Thermocouples</h4>
              <ul className="text-stone-300 text-sm space-y-2">
                <li>• Operating Principle: Dissimilar metal junction generates thermoelectric potential proportional to thermal gradient</li>
                <li>• Measurement Precision: ±1-2°C achievable with rigorous calibration protocols</li>
                <li>• Operational Envelope: Approximately 0–1200°C for prevalent configurations (K-type, J-type)</li>
                <li>• Benefit: Physical contact enables high-resolution measurement within stable thermal environments</li>
                <li>• Constraint: Temperature measurement ceiling determined by constituent metal fusion temperatures</li>
              </ul>
              <p className="text-stone-300 text-sm leading-relaxed mt-3 text-amber-200 font-semibold">
                Studio Tip: Deploy K-type thermocouple assemblies for flame annealing applications due to superior thermal stability and resistance to oxidative attack in high-temperature combustion environments.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-orange-500">
              <h4 className="text-orange-300 font-bold mb-2">Optical Pyrometers</h4>
              <ul className="text-stone-300 text-sm space-y-2">
                <li>• Operating Principle: Quantifies blackbody thermal radiation flux emitted from heated surfaces</li>
                <li>• Measurement Precision: ±1-3% of absolute reading contingent upon emissivity characterization</li>
                <li>• Operational Envelope: Approximately 500–3000°C (exceeds thermocouple measurement ceiling)</li>
                <li>• Benefit: Remote sensing capability eliminates thermal contact and process interference</li>
                <li>• Geometric Constraint: Most radiometric pyrometers employ fixed optical magnification ratios (e.g., 50:1), necessitating precise positioning relative to measurement target for reliable readings</li>
              </ul>
              <p className="text-stone-300 text-sm leading-relaxed mt-3 text-amber-200 font-semibold">
                Studio Tip: Employ radiometric pyrometry for continuous glass temperature surveillance during fabrication and thermal treatment without process interruption. Establish calibration baseline using independent thermal reference (e.g., thermocouple measurement) prior to operational pyrometry deployment.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'flame-stability',
      title: 'Flame Stability and Blow-off Analysis',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Combustion stability and extinction dynamics represent fundamental constraints in flame management. As reactive mixture velocity at the burner aperture (uR) increases via mass flow regulation, the flame cone geometry elongates and aperture-region expansion becomes evident approaching critical stability boundaries. Flame base detachment did not manifest during baseline experiments; however, elevated flow conditions produced immediate combustion cessation (extinction event). In contrast to air-based combustion systems, flame anchoring deteriorates progressively with increased fuel or oxidant delivery, culminating in complete extinction. This extinction mechanism involves localized reaction quenching and micro-flame extinction, wherein convective mass transport velocity surpasses thermal energy diffusion rate. Sustained chemical reaction requires adequate thermal energy supply to maintain reaction propagation.
          </p>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flame Tip Flickering and Instabilities</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Flame tip oscillation manifested across both fuel-lean (0.4 &lt; φG &lt; 0.7) and fuel-rich (1.4 &lt; φG &lt; 2.0) regimes. This oscillatory behavior correlates with the Damköhler number and mixture Lewis number (LeR) deviation from unity. At microscopic scales, reaction extinction couples with chemical kinetics and intrinsic flame instabilities. At macroscopic scales, flame anchoring stability depends upon strain-rate effects (local curvature) and reactant concentration gradients across the flame front.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/laminarimage_eba8787a.png')}>
              <img 
                src="/manus-storage/laminarimage_eba8787a.png" 
                alt="Structure of a laminar premixed oxy-methane flame at φG = 1.1, showing line-of-sight and Abel-inverted CH* measurements with preheat zone, reaction zone, and downstream burned gas region"
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">CH* Measurement and Flame Structure</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Flame structure characterization of oxy-methane combustion employed CH* radical emission spectroscopy. Photon emission from CH radical species serves as a quantitative proxy for thermal energy release within the reaction zone. Contemporary research employs CH* and OH* radical tracers as reaction zone markers due to their central role in combustion chemistry. Spectroscopic analysis demonstrates that excited CH* emission occupies a narrower spatial domain than OH* species, localizing within the thermal preheating zone immediately preceding maximum temperature attainment. Conversely, OH* radical emission distributes across a broader spatial region, spanning from the thermal preheating zone through the post-combustion gas region.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              Laminar oxy-methane flame architecture comprises three distinct thermal regions: the thermal preheating zone, the exothermic reaction zone, and the post-combustion thermal region. CH* radical emission intensity reaches maximum values within the reaction zone, confirming CH species' utility as thermal energy release quantification markers.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/burnoffplot_58acdceb.png')}>
              <img 
                src="/manus-storage/burnoffplot_58acdceb.png" 
                alt="Flame stabilization curve dividing the attached flame region and blow-off region as a function of reactant velocity and global equivalence ratio"
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flame Stabilization Curve</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              The flame stabilization boundary demarcates the anchored flame operational domain from the extinction threshold region. The anchored flame zone (depicted in green) encompasses operating conditions maintaining stable flame attachment to the burner apparatus. The extinction threshold zone (depicted in red) encompasses conditions where combustion cannot be sustained and flame extinction occurs. Flame tip oscillation manifests at the transitional boundaries separating these operational zones, particularly across fuel-lean (0.4 &lt; φG &lt; 0.7) and fuel-rich (1.4 &lt; φG &lt; 2.0) regimes.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/flametable_332f1ae6.png')}>
              <img 
                src="/manus-storage/flametable_332f1ae6.png" 
                alt="Experimental conditions table showing variables and ranges: uR (8-20 m/s), ReR (962-2506), FrR (57-142), φG (0.5-2.0), and initial conditions (TR = 300 K, P∞ = 1 atm)"
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-2">Experimental Parameters</h4>
            <ul className="text-stone-300 space-y-2 text-sm">
              <li><strong>Reactant Velocity (uR):</strong> 8-20 m/s at nozzle diameter d₀ = 2.0 mm</li>
              <li><strong>Reynolds Number (ReR):</strong> 962-2506, characterizing flow regime</li>
              <li><strong>Froude Number (FrR):</strong> 57-142, relating inertial to gravitational forces</li>
              <li><strong>Global Equivalence Ratio (φG):</strong> 0.5-2.0 in 0.1 steps, from lean to rich conditions</li>
              <li><strong>Initial Conditions:</strong> Temperature TR = 300 K, Pressure P∞ = 1 atm</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'safety',
      title: 'Safety',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fire Triangle</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Combustion initiation requires concurrent presence of three fundamental components: thermal energy, combustible material, and atmospheric oxygen. Elimination of any single component disrupts the combustion process and prevents or terminates fire propagation. Diverse fire suppression technologies and intervention strategies target specific component removal for effective fire mitigation:
            </p>
            <ul className="text-stone-300 space-y-2 text-sm mb-3">
              <li><strong>Aqueous extinguishing agents</strong> reduce thermal energy through evaporative cooling, thereby disrupting the thermal component of the combustion triad.</li>
              <li><strong>Inert gas systems and thermal barriers</strong> function through atmospheric displacement or oxygen concentration reduction below combustion thresholds.</li>
              <li><strong>Chemical inhibitor coatings</strong> interrupt fuel participation by suppressing or decelerating exothermic decomposition pathways.</li>
            </ul>
            <p className="text-stone-300 text-sm leading-relaxed">
              Complementing these suppression methodologies, systematic equipment design and rigorous adherence to operational safety protocols form the foundation for ignition source elimination and fire prevention.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-2xl" onClick={() => setExpandedImage('/manus-storage/triangleflame_6a0855e5.png')}>
              <img 
                src="/manus-storage/triangleflame_6a0855e5.png" 
                alt="Fire Triangle showing the three essential components: Heat (ignition source), Fuel (combustible material), and Oxygen (oxidizing agent). Removing any one element prevents or extinguishes fire."
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fire Tetrahedron</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              The Fire Tetrahedron represents an advanced conceptual framework incorporating a fourth critical parameter—the exothermic chemical reaction—into the foundational triadic combustion model. Analogous to the triadic framework, disruption of any singular component terminates combustion propagation. This expanded mechanistic understanding establishes the theoretical foundation for comprehensive fire safety analysis and intervention strategy development.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-2xl" onClick={() => setExpandedImage('/manus-storage/firetetrahedron_d4f4e5e5.png')}>
              <img 
                src="/manus-storage/firetetrahedron_d4f4e5e5.png" 
                alt="Fire Tetrahedron showing four essential components: Heat (ignition source), Fuel, Oxidising Agent (oxygen), and Chemical Chain Reaction. All four elements must be present for combustion to occur."
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fuels</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Combustible materials encompass any substance capable of undergoing exothermic oxidative reaction. Systematic categorization into solid, liquid, and gaseous phases reflects distinct physicochemical properties and combustion behavior patterns. This taxonomic framework enables systematic understanding of fuel-specific characteristics essential for fire safety engineering and combustion process management. Preceding ignition, fuels undergo diverse thermochemical transformations and phase transitions before participating in combustion reactions.
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h5 className="text-cyan-300 font-semibold mb-2">Gases</h5>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Gaseous fuel species including methane and propane exhibit elevated flammability in vapor phase. Combustion kinetics demonstrate rapid initiation and elevated thermal output. Gaseous flammability parameters define concentration envelopes within atmospheric mixtures permitting ignition and sustained combustion propagation.
                </p>
              </div>
              
              <div>
                <h5 className="text-cyan-300 font-semibold mb-2">Liquids</h5>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Liquid-phase combustible materials encompass petroleum distillates, synthetic hydrocarbons, and specialized industrial solvents. Liquid-phase ignition occurs at lower thermal thresholds than solid-phase materials and frequently generates flammable vapor envelopes forming explosive air-fuel mixtures. Flash-point temperature and spontaneous ignition threshold represent critical thermodynamic parameters governing liquid fuel flammability. Preceding ignition, liquid-phase fuels undergo either reversible vaporization preserving molecular structure or irreversible thermal decomposition followed by vapor evolution.
                </p>
              </div>
              
              <div>
                <h5 className="text-cyan-300 font-semibold mb-2">Solids</h5>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Solid-phase combustible materials span diverse categories including lignocellulosic polymers, cellulose derivatives, synthetic polymers, and composite structures. Thermal response mechanisms vary substantially across material classes. Certain solid materials undergo fusion prior to vapor generation, while others produce combustible vapors directly upon heating. Alternative pathways include direct solid-to-gas phase transition (sublimation) or thermal decomposition (pyrolysis) preceding vapor evolution and subsequent ignition. Solid combustion kinetics depend upon bulk density, residual moisture content, thermal conductivity, and presence of catalytic accelerants.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-2xl" onClick={() => setExpandedImage('/manus-storage/phasetransitions_d4a8bb1b.png')}>
              <img 
                src="/manus-storage/phasetransitions_d4a8bb1b.png" 
                alt="Phase transitions showing solid, liquid, and gas states with processes of sublimation, evaporation, and decomposition. Includes melting and decomposition pathways for different fuel types."
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Heat</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Combustible mixture ignition occurs via multiple thermal pathways. Initiation may result from direct contact with external thermal sources possessing sufficient energy density, or alternatively through spontaneous exothermic reaction upon reaching the substance-specific self-ignition temperature threshold. Ignition energy requirements depend upon molecular composition, vapor concentration, system pressure, and ambient thermal conditions.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'flashback-arresters',
      title: 'Flashback Arresters',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Experimental Setup and Methodology</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Experimental apparatus underwent initial evacuation followed by pressurization with fuel-oxidant mixture generated via dedicated mixing chamber to predetermined pressure levels. Ignition initiation occurred at the pipeline terminus preceding the arrester via thermal wire fusion methodology. Test configurations incorporated sintered metal arrester element exposure to incoming combustion front stress applied from external surfaces (Figure 1a) and internal surfaces (Figure 1b).
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              Sintered metal test elements included grades SIKA-R30, R20, R10, and R3 designations. Grade nomenclature reflects maximum pore aperture dimensions in micrometers. Material mechanical strength correlates inversely with pore diameter. Experimental arrester assembly dimensions: Ø27 × Ø20 × 40 mm, mechanically secured within housing apparatus. Threaded connection interface incorporated 5 mm retention recess, subdivided into 3 mm conical taper (1:10 ratio) and 2 mm beveled edge (30° angle).
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/flashbackcrosssection_d8a17dcd.png')}>
              <img 
                src="/manus-storage/flashbackcrosssection_d8a17dcd.png" 
                alt="Experimental flame arrester cross-section showing stressing of the sintered metal element by the incoming reaction front: (a) from outside; (b) from inside. Shows the housing, sintered metal element (orange), ignition vector, and cross-drilled bores for gas stream direction."
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flame Arrester Design and Assembly</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Conical housing geometry produces asymmetric compression of the sintered metal element upon assembly: external surface compression at one terminus coupled with internal radial expansion at the opposing terminus. This geometric configuration over the 3 mm conical interface establishes a flame-resistant seal between adjoining components. Combustion front propagation through the assembly requires passage through sintered metal pore networks or structural discontinuities potentially generated under extreme mechanical loading conditions.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Experimental Results with Acetylene/Oxygen Mixtures</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Figure 2 presents experimental data from acetylene-oxygen combustion testing. Critical flame-arrest pressure thresholds correlate with fuel-oxidant mixture composition and sintered metal element grade. Test matrix employed SIKA-R30, R10, and R3 element grades. All test configurations maintained constant pipeline length L = 5000 mm upstream of the arrester apparatus.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              Bidirectional stress testing employed SIKA-R3 grade elements subjected to incoming combustion front loading from both external and internal surfaces. At 4.5 bar initial pressure with 42% acetylene-by-volume composition and internal surface stress application, catastrophic element fracture occurred.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-2 md:p-4 relative group cursor-pointer max-w-3xl" onClick={() => setExpandedImage('/manus-storage/flashbackplot_53ebe88b.png')}>
              <img 
                src="/manus-storage/flashbackplot_53ebe88b.png" 
                alt="Limiting pressure for safety against flame transmission for experimental flame arrester with sintered metal elements of quality SIKA-R3, R10 and R30 with flashback in acetylene/oxygen mixtures. Shows pressure (bar) vs. content by volume of acetylene. Pipeline length L = 5000 mm. Includes notes on sintered metal element cracks and stressing from outside and inside."
                className="w-full h-auto object-contain group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fuel Gas Mixture Ratios and Safety Limits</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Comparative analysis across diverse fuel-oxidant systems (acetylene, hydrogen, propane, methane with oxygen) reveals critical pressure thresholds for SIKA-R30 elements exhibiting approximate ratios of 1:2:3:4. Optimal mixture compositions demonstrating minimum critical pressures: 32% acetylene, 14% propane, 28% methane, and 42% hydrogen (all percentages by volume).
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Shock Waves and Pressure Dynamics</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Experimental data analysis indicates that sintered metal barrier performance demonstrates significant pressure threshold elevation attributable to shock wave propagation preceding the combustion front arrival at the arrester element. The underlying physical mechanisms remain speculative based on current experimental evidence.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              Fuel-lean hydrogen-oxygen systems exhibit saturation conditions where shock wave amplification ceases to increase critical pressure thresholds. This phenomenon manifests in short-pipeline configurations (L &lt; 5 m) with hydrogen concentrations below 27% by volume, yielding lower critical pressures compared to equivalent-composition long-pipeline experiments.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              Achievement of reduced critical pressures in lean hydrogen mixtures requires pipeline lengths below 1 m. American testing standards specify L = 1.5 m (5 feet) pipeline length, likely selected because detonation-limit conditions at this length produce substantially greater mechanical loading on sintered elements compared to extended pipelines (L = 4.5 m / 15 feet) under stable detonation conditions.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* EQUIPMENT SCIENCE TITLE */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">Equipment Science</h1>
      </div>

      {/* EQUIPMENT SCIENCE HEADER IMAGE */}
      <div className="w-full flex flex-col items-center mb-6">
        <img
          src="/manus-storage/Gemini_Generated_Image_jjn8znjjn8znjjn8_db02925e.png"
          alt="Equipment Science setup showing flame spectroscopy apparatus with burner and optical system"
          className="w-full max-w-4xl rounded-xl border border-stone-700 shadow-lg"
        />
      </div>

      <CustomAccordion items={accordionItems} allowMultiple={true} />

      {/* Full-screen image modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
          onKeyDown={(e) => e.key === 'Escape' && setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img 
              src={expandedImage} 
              alt="Expanded view"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-full transition-colors"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

