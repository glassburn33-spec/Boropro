/*
BoroPro - Practical Glass Blower Reference Tool
Design: Studio-focused, minimal reading, maximum usability
Dark theme for studio environment, large touch targets for gloved hands
*/

import { useState, useEffect, useRef } from "react";
import { Home as HomeIcon, Zap, Calculator, Palette, ChevronDown, Menu, X } from "lucide-react";
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
import ColorScienceTab from "./ColorScienceTab";

type TabType = "studio" | "scieequip" | "calculator" | "colorscience";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("studio");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
                  onClick={() => { handleTabChange("scieequip"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Scie-Equip
                </button>
                <button
                  onClick={() => { handleTabChange("colorscience"); setShowDrawer(false); }}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition"
                >
                  Color-Scie
                </button>
                <a
                  href="/references"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  Tools
                </a>
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


      </header>
      
      {/* Close dropdown when clicking outside */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* MAIN CONTENT - Margin accounts for fixed header */}
      <main className="max-w-6xl mx-auto px-4 py-6" style={{ marginTop: '120px' }}>
        {/* TAB CONTENT */}
        {activeTab === "studio" && <StudioTab />}
        {activeTab === "scieequip" && <ScieEquipTab />}
        {activeTab === "calculator" && <ThermalCalculatorTab />}
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
      {/* GLASS SCIENCE HEADER AND STRUCTURE IMAGE */}
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
          <Accordion type="single" collapsible>
            {/* SECTION 1: CHEMICAL COMPOSITION */}
            <AccordionItem value="composition">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-6 py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-lg font-semibold text-amber-400">
                  Chemical Composition of Borosilicate Glass
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                <div className="space-y-4">
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Borosilicate glass is made of high proportions of silicon dioxide (SiO<sub>2</sub>) and boron trioxide (B<sub>2</sub>O<sub>3</sub>). It is above all the boric oxide content of roughly 13% and the silica proportion of over 80% in the glass matrix that leads to its high resistance to water, chemicals, and drug substances.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    DURAN® borosilicate glass 3.3 has the following chemical composition (per cent weight by weight): Silicon dioxide (SiO<sub>2</sub>): 81%, Boron trioxide (B<sub>2</sub>O<sub>3</sub>): 13%, Sodium oxide (Na<sub>2</sub>O) and potassium oxide (K<sub>2</sub>O): 4%, Aluminum oxide (Al<sub>2</sub>O<sub>3</sub>): 2%
                  </p>
                  <div className="w-full flex justify-center my-6">
                    <img
                      src="/manus-storage/chemcompboro_fdd7eb5c.png"
                      alt="Chemical composition of borosilicate glass showing SiO2 81%, B2O3 13%, Na2O/K2O 4%, Al2O3 2%"
                      className="w-full max-w-2xl rounded-lg border border-stone-600 shadow-lg"
                    />
                  </div>
                  <p className="text-stone-500 text-xs italic text-center">
                    DURAN® borosilicate glass 3.3 chemical composition table. The high silica and boric oxide content provides exceptional thermal and chemical resistance.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 2: THERMAL PROPERTIES */}
            <AccordionItem value="thermal">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-6 py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-lg font-semibold text-amber-400">
                  Thermal Properties
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                <div className="space-y-4">
                  <p className="text-stone-300 text-sm leading-relaxed">
                    As the co-efficient of thermal expansion of borosilicate glass is low, the thermal stresses under a given temperature gradient are consequently low and the glass can withstand higher temperature gradients and also sudden temperature changes/thermal shocks. Minute scratching of glass surface can however reduce its thermal resistance.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    In general, the <span className="text-amber-300 font-semibold">"Strain point"</span> should be regarded as the maximum safe operating temperature of borosilicate glassware. When heated above 500° C the glass may acquire permanent stresses on cooling.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    All borosilicate labware is annealed in modern Lehr ovens under strictly controlled conditions to ensure minimal residual stress in the products.
                  </p>
                  <div className="w-full flex justify-center my-6">
                    <img
                      src="/manus-storage/thermpropboro_81841fb8.png"
                      alt="Thermal properties of borosilicate glassware including strain point, annealing point, softening point, and thermal conductivity"
                      className="w-full max-w-2xl rounded-lg border border-stone-600 shadow-lg"
                    />
                  </div>
                  <p className="text-stone-500 text-xs italic text-center">
                    Typical thermal properties of borosilicate glassware. The low coefficient of linear expansion (32.5 × 10⁻⁷/° C) enables excellent thermal shock resistance.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 3: STRUCTURE OF GLASS */}
            <AccordionItem value="structure">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-6 py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-lg font-semibold text-amber-400">
                  The Structure of Glass: Why It Behaves the Way It Does
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                <div className="space-y-4">
                  {/* CRYSTAL STRUCTURE IMAGE */}
                  <div className="w-full flex flex-col items-center mb-6">
                    <img
                      src="/manus-storage/CRYSTALINSTRUCTUR_b19e4d65.png"
                      alt="Crystal vs Glass structure comparison: ordered quartz lattice vs disordered silica glass network"
                      className="w-full max-w-2xl rounded-xl border border-stone-700 shadow-lg"
                    />
                    <p className="text-stone-500 text-xs italic text-center mt-3 max-w-xl">
                      Atomic structure comparison: crystalline quartz (ordered, periodic lattice) vs. silica glass (disordered, amorphous network). The absence of long-range order in glass is the origin of its unique thermal behavior.
                    </p>
                  </div>

                  {/* SUBSECTION 1 */}
                  <div>
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
                  <div className="pt-4 border-t border-stone-700">
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
                  <div className="pt-4 border-t border-stone-700">
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
                  <div className="pt-4 border-t border-stone-700">
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
                  <div className="pt-4 border-t border-stone-700">
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
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 4: SCIENCE OF GLASS ANNEALING */}
            <AccordionItem value="annealing">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-6 py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-lg font-semibold text-amber-400">
                  The Science of Glass Annealing
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                <div className="space-y-4">
                  <div className="w-full flex justify-center my-6">
                    <img
                      src="/manus-storage/viscosityplot_99c24e57.png"
                      alt="Viscosity-Temperature profile for common glass types showing critical annealing range"
                      className="w-full max-w-2xl rounded-lg border border-stone-600 shadow-lg"
                    />
                  </div>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Annealing is the process of slowly cooling glass from an elevated temperature to room temperature in a controlled manner. This process relieves internal stresses that develop during the formation and shaping of glass. When glass is heated above its annealing point and then cooled too quickly, the outer surface contracts faster than the interior, creating permanent internal stresses. These stresses can cause spontaneous breakage, optical distortion, or delayed fracture that may occur days, weeks, or even years after the piece is created.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The physics of internal stress in glass is fundamentally related to the glass transition temperature (Tg) and the strain point. As glass cools through the annealing point (approximately 565°C for borosilicate glass), the atomic network begins to slow its molecular motion. If the surface and interior cool at different rates, differential contraction creates tensile stress in the surface and compressive stress in the interior. These stresses become permanently "frozen" into the glass structure once it cools below the strain point (approximately 515°C for borosilicate glass), where atomic motion effectively ceases on any practical timescale.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The annealing point is the temperature at which internal thermal stresses can be relieved by viscous relaxation within approximately 15 minutes. At this temperature, the glass is still fluid enough that molecular segments can rearrange to a lower-energy state, gradually dissipating accumulated stresses. The strain point is the lower boundary below which stress relief becomes practically impossible — stresses locked into the glass at this threshold are permanent unless the piece is reheated above the annealing point. The temperature range between the annealing point and strain point is therefore the critical annealing range, where slow, controlled cooling is essential to prevent permanent stress formation.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Variables that affect the required annealing time and temperature profile include glass composition (different glass types have different transition temperatures), piece thickness and geometry (thicker pieces require slower cooling to prevent internal temperature gradients), and the cooling rate (faster cooling creates larger temperature gradients and higher stresses). Improper annealing can result in spontaneous breakage due to thermal shock, optical distortion from stress-induced birefringence, or delayed fracture from latent internal stresses. Industrial annealing schedules are carefully calculated to minimize stresses in the shortest time possible, balancing energy consumption against the need for complete stress relief.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 5: GLASS HEAT TREATMENT PROFILE */}
            <AccordionItem value="heattreatment">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-6 py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-lg font-semibold text-amber-400">
                  Glass Heat Treatment Profile
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                <div className="space-y-4">
                  <div className="w-full flex justify-center my-6">
                    <img
                      src="/manus-storage/boroanealprofile_20331f22.png"
                      alt="Borosilicate Glass Heat Treatment Profile showing four phases of annealing"
                      className="w-full max-w-2xl rounded-lg border border-stone-600 shadow-lg"
                    />
                  </div>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    A glass heat treatment profile, also called a firing schedule or kiln schedule, is a precisely controlled temperature-time curve that guides the heating and cooling of glass through the annealing process. The profile consists of four distinct phases, each with specific thermal objectives. The profile is determined by the glass composition, the thickness and geometry of the piece, and the maximum allowable residual stress in the final product. Proper heat treatment profiles prevent thermal shock, devitrification, and the formation of permanent internal stresses that could cause delayed fracture.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The first phase is rapid reheating to a temperature above the annealing point. Speed is acceptable during this phase because the glass is being brought up uniformly from room temperature before entering the stress-sensitive cooling range. The goal is to reach the target temperature efficiently without creating internal gradients, since the glass is still below its glass transition temperature and cannot yet relieve stresses. Heating rates during this phase are typically 5–15°C per minute, depending on piece thickness.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The second phase is the dwell or soak, where the glass is held at a temperature above the annealing point for a period of time (typically 15–60 minutes depending on thickness). This allows thermal equalization throughout the entire piece, ensuring that the interior and exterior reach the same temperature before cooling begins. Without adequate dwell time, internal temperature gradients would persist into the critical cooling phase, creating permanent stresses. The dwell temperature is typically chosen to be 20–40°C above the annealing point to ensure efficient stress relief while minimizing energy consumption.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The third and most critical phase is slow cooling from above the annealing point down through the strain point. During this phase, the cooling rate must be carefully controlled to limit the temperature gradient that develops between the surface and interior of the piece. The maximum allowable cooling rate is determined by the piece geometry (thickness and outer radius are the primary factors), the glass composition, and the acceptable residual stress level. Cooling rates during this phase are typically 1–3°C per minute for thick pieces, with faster rates (up to 5°C per minute) acceptable for thin pieces. The role of viscosity during this phase is critical: as temperature drops, the glass viscosity increases exponentially, and the ability of the atomic network to relieve stress through viscous flow decreases. By the time the glass reaches the strain point, the viscosity has increased so much that further stress relief becomes negligible.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The fourth and final phase is more rapid cooling below the strain point. Once the glass has cooled below the strain point, the atomic network is effectively frozen and cannot relieve stresses through viscous flow. Stresses formed below the strain point are temporary in nature and pose lower risk of delayed fracture compared to stresses formed in the critical annealing range. Therefore, cooling can be accelerated in this final phase to save time and energy. Cooling rates below the strain point can be 10–20°C per minute or faster without risk of creating permanent stresses. Common mistakes in heat treatment include cooling too quickly through the critical annealing range (creating permanent stresses), holding at too high a temperature for too long (wasting energy and risking devitrification), or using inappropriate profiles for the glass type (different glasses have different transition temperatures and require different schedules).
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* SECTION 6: DEVITRIFICATION */}
            <AccordionItem value="devitrification">
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-6 py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-lg font-semibold text-amber-400">
                  Devitrification
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                <div className="space-y-4">
                  <div className="w-full flex justify-center my-6">
                    <img
                      src="/manus-storage/devitrifiedtube_b150dc7c.png"
                      alt="Devitrified glass tube showing crystalline formation and hazy appearance"
                      className="w-full max-w-2xl rounded-lg border border-stone-600 shadow-lg"
                    />
                  </div>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Devitrification results in a loss of translucency, and devitrified glass is often described as having a white or grey, "hazy," "scummy," "chalky," or "misty" appearance combined with a roughened surface texture (nicknamed "devit" by glass artists). Devitrification can occur both on the surface of glass or internally, though it is most commonly seen on the surface. The crystal formation causes contraction of the glass, and a crinkled surface appearance or cracking can occur as a result; this crystallization-induced cracking is separate from deterioration that produces crizzling made by poor annealing or thermal shock or due to glass weathering. Devitrification is often accidental, but can also be purposefully induced for artistic effect; it cannot be removed by washing the glass.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Devitrification can occur in a number of different ways. When glass that is kiln fired is kept at the liquidus temperature (the temperature above which a material is completely liquid) or in the "devitrification zone" for a sufficient amount of time, and/or cooled too slowly, crystal structures can have time to grow within the glass. The "devitrification zone" or "devitrification range" is the temperature range at which devitrification becomes more likely and typically occurs in most glasses at approximately 1300 to 1550°C, although glass with different compositions may have different devitrification zones. Glass that has not been properly cleaned before firing is also more prone to devitrification, as fingerprints, dust, and other contaminants on the glass surface can act as nucleation centers for crystalline growth.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    The composition of the glass affects the crystallization probability. Devitrification may be less common in ancient glass, which typically has complex compositions, than in modern glasses, with simpler compositions. Glass that contains boron is more resistant to devitrification, while glass with an excess of lime (calcium) cools more slowly, resulting in an increased opportunity for the development of devitrification. Glass with opalizing agents, opaque glass, and colored glass all are also more likely to devitrify. These additives create "microcrystalline areas" in the glass where devitrification can more easily occur.
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Though devitrification can appear similar to certain types of glass degradation, like weathering, or can be mistaken as a type of glass degradation itself, devitrification is not a deterioration process. Glass deterioration occurs because of a chemical interaction between glass and its environment; devitrification, however, occurs during the creation of the glass, and therefore should not be used in a general sense to mean "loss of vitreous nature." Devitrification does not result in a change to the overall chemical composition of the glass. Because it is a feature of the "original" state of the glass and is not in itself degradation, devitrification is not typically seen as needing to be treated or removed in the conservation of glass objects.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* KEY INSIGHT CALLOUT */}
      <div className="bg-stone-800/50 border-l-4 border-amber-600 p-5 rounded-lg" style={{background: "linear-gradient(135deg, rgba(30, 25, 15, 0.8) 0%, rgba(40, 35, 20, 0.6) 100%)", backdropFilter: "blur(10px)"}}>
        <p className="text-stone-300 text-sm leading-relaxed">
          <span className="text-amber-300 font-bold">The goal of industrial annealing is to minimize stresses in the glass article in the shortest time possible</span> — because annealing means heating, heating means energy consumption, and energy consumption means cost. Every minute saved in the kiln matters.
        </p>
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
  const accordionItems = [
    {
      id: 'flame-structure',
      title: '🔥 Flame Structure and Combustion Zones',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            The flame structure is critical for atomic absorption spectroscopy and glass analysis. Figure 1 shows a cross-section through the flame, down the source radiation's optical path. The primary combustion zone usually is rich in gas combustion products that emit radiation, limiting its usefulness for atomic absorption. The interzonal region generally is rich in free atoms and provides the best location for measuring atomic absorption. The hottest part of the flame typically is 2–3 cm above the primary combustion zone. As atoms approach the flame's secondary combustion zone, the decrease in temperature allows for formation of stable molecular species.
          </p>
          
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
      ),
    },
    {
      id: 'flame-types',
      title: '🌡️ Flame Types: Reducing, Neutral, Oxidizing, and Carburizing',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            The chemical composition of a flame depends on the ratio of fuel to oxidant, which determines whether the flame is reducing, neutral, oxidizing, or carburizing. Each flame type has distinct characteristics and effects on glass working and analysis.
          </p>
          
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
                Two distinct zones may be seen in the neutral flame. The inner core of the flame has a bright white-bluish light and extends only a short distance from the tip. Around this inner cone is the flame envelope which is darker and less intensely blue. This flame is metallurgically neutral, and is used for welding, heating and cutting of steel. There is also a transparent reducing zone in front of the white inner cone. It is difficult to distinguish but it is the main factor for welding steel without a fluxing agent.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-cyan-400">
              <h4 className="text-cyan-300 font-bold mb-2">Oxidizing Flame (Right)</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                By increasing the oxygen flow slightly beyond the point where the secondary zone disappears one will obtain an oxidizing flame (with excess oxygen). The flame will be shorter and sharper than the neutral flame, with a shorter, more pointed inner cone. This flame is slightly hotter than the neutral flame, and is used for welding cast iron, brass, bronze and zinc alloys, and for some brazing alloys.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-yellow-500">
              <h4 className="text-yellow-300 font-bold mb-2">Carburizing Flame</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                The carburizing flame has an excess of acetylene, and is recognized by a secondary flame zone between the inner cone and the flame envelope. This zone is less bright and whiter in colour than the inner cone, but is considerably brighter than the flame envelope. This soft flame (also called a reducing flame) is used for welding of aluminium and aluminium alloys, and for soft soldering.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/neutralizingflame_745acb3c.webp" 
              alt="Neutral flame showing torch nozzle with bright cyan-white inner core transitioning to multicolored flame with blue, purple, magenta, and rainbow-colored feather extending outward"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-blue-400">
            <h4 className="text-blue-300 font-bold mb-2">Neutral Flame Image Description</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Two distinct zones may be seen in the neutral flame. The inner core of the flame has a bright white-bluish light and extends only a short distance from the tip. Around this inner cone is the flame envelope which is darker and less intensely blue. This flame is metallurgically neutral, and is used for welding, heating and cutting of steel. There is also a transparent reducing zone in front of the white inner cone. It is difficult to distinguish but it is the main factor for welding steel without a fluxing agent.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/oxydizingflame_065fda8f.webp" 
              alt="Oxidizing flame showing torch nozzle with sharp white-bluish inner core transitioning to multicolored flame with blue, cyan, magenta, orange, and rainbow-colored feather extending outward"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-cyan-400">
            <h4 className="text-cyan-300 font-bold mb-2">Oxidizing Flame Image Description</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              By increasing the oxygen flow slightly beyond the point where the secondary zone disappears one will obtain an oxidizing flame (with excess oxygen). The flame will be shorter and sharper than the neutral flame, with a shorter, more pointed inner cone. This flame is slightly hotter than the neutral flame, and is used for welding cast iron, brass, bronze and zinc alloys, and for some brazing alloys.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/neutralizingflame_88598926.webp" 
              alt="Carburizing flame showing torch nozzle with bright blue-white inner core transitioning to multicolored flame with magenta, purple, yellow, orange, and rainbow-colored feather extending outward"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'flame-annealing',
      title: '💨 Flame Annealing Technique: Soot Coating Distribution',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Flame annealing is a specialized reducing flame technique that distributes a soot coating on the glass surface at annealing temperature. This process leverages the reducing flame's carbon-rich composition to create a protective soot layer that affects thermal properties and surface characteristics. The soot volume fraction is precisely controlled by adjusting the oxidant-to-fuel ratio in the flame mixture.
          </p>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/glassflameanealing_ac208885.png" 
              alt="Glass flame annealing technique showing borosilicate glass piece being heated in a flame with soot coating distribution visible"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Soot Volume Fraction Measurement Method</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              The soot volume fraction is calculated using Beer-Lambert law, which relates the laser-induced incandescence (LII) signal to soot concentration. A ratio between the LII signal (averaged from multiple measurements) and the soot volume fraction is calculated and used to translate both single-shot and averaged LII images to two-dimensional soot volume fraction images. This method is valid across all cases provided that LII signals are measured using identical optical equipment, laser energy, and camera settings. The strength of this semi-simultaneous extinction calibration method is that calibration is performed on soot at exactly the same location in the furnace, ensuring spatial accuracy and reproducibility.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/sootplot_e2efdeba.png" 
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
      ),
    },
    {
      id: 'spectroscopy',
      title: '🔬 Spectroscopy Instrumentation for Glass Analysis',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Spectroscopy is essential for analyzing glass composition and understanding how light interacts with colored glass. Three main spectroscopic techniques are used in glass analysis: Atomic Absorption Spectroscopy (AAS), UV-Visible Spectroscopy (UV-Vis), and Raman Spectroscopy.
          </p>
          
          <div className="space-y-4">
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-purple-500">
              <h4 className="text-purple-300 font-bold mb-2">Atomic Absorption Spectroscopy (AAS)</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                AAS measures the absorption of light by free atoms in the ground state. When a sample is atomized in a flame, the atoms absorb light at characteristic wavelengths. This technique is used to determine the concentration of specific metal ions in glass samples, such as cobalt, chromium, or nickel.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-blue-500">
              <h4 className="text-blue-300 font-bold mb-2">UV-Visible Spectroscopy (UV-Vis)</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                UV-Vis spectroscopy measures the absorption and transmission of light across the ultraviolet and visible spectrum. This technique reveals the electronic transitions of colored ions and is crucial for understanding how different metal ions produce their characteristic colors in glass.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-red-500">
              <h4 className="text-red-300 font-bold mb-2">Raman Spectroscopy</h4>
              <p className="text-stone-300 text-sm leading-relaxed">
                Raman spectroscopy measures the vibrational modes of molecules and ions. In glass analysis, it provides information about the local structure around metal ions and the coordination environment, complementing UV-Vis data to give a complete picture of glass composition.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'temperature',
      title: '📊 Temperature Measurement: Thermocouples and Pyrometers',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Accurate temperature measurement is critical for flame annealing and glass working. Two primary methods are used: thermocouples for direct contact measurement and optical pyrometers for non-contact measurement.
          </p>
          
          <div className="space-y-4">
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-yellow-500">
              <h4 className="text-yellow-300 font-bold mb-2">Thermocouples</h4>
              <ul className="text-stone-300 text-sm space-y-2">
                <li>• Principle: Two different metals joined together produce a voltage proportional to temperature difference</li>
                <li>• Accuracy: ±1-2°C with proper calibration</li>
                <li>• Range: Typically 0–1200°C for common types (K-type, J-type)</li>
                <li>• Advantage: Direct contact allows precise measurement in controlled environments</li>
                <li>• Limitation: Cannot measure temperatures above the melting point of the thermocouple materials</li>
              </ul>
              <p className="text-stone-300 text-sm leading-relaxed mt-3 text-amber-200 font-semibold">
                Studio Tip: Use K-type thermocouples for flame annealing work as they handle high temperatures and oxidizing atmospheres well.
              </p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border-l-4 border-orange-500">
              <h4 className="text-orange-300 font-bold mb-2">Optical Pyrometers</h4>
              <ul className="text-stone-300 text-sm space-y-2">
                <li>• Principle: Measures the thermal radiation emitted by hot objects</li>
                <li>• Accuracy: ±1-3% of reading depending on emissivity calibration</li>
                <li>• Range: Typically 500–3000°C (extends beyond thermocouple range)</li>
                <li>• Advantage: Non-contact measurement, no disturbance to the work</li>
                <li>• Distance: Most optical pyrometers have a fixed distance-to-spot ratio (e.g., 50:1), meaning you must be at a specific distance from the target for accurate readings.</li>
              </ul>
              <p className="text-stone-300 text-sm leading-relaxed mt-3 text-amber-200 font-semibold">
                Studio Tip: Use optical pyrometers to monitor glass temperature during working or annealing without interrupting the process. Always calibrate against a known temperature source (e.g., a thermocouple reading) before relying on pyrometer data.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'flame-stability',
      title: '🌡️ Flame Stability and Blow-off Analysis',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Understanding flame stability and blow-off phenomena is critical for controlling combustion processes. With increasing velocity of the reactive mixture at a nozzle exit (uR) by controlling a mass flow controller (MFC), the conical flame length becomes longer and sometimes flame tip opening is observed near the blow-off region. The lift-off phenomenon did not occur during the experiments, but at higher flow rates, the flame was directly extinguished (blow-off). Compared with other types of combustion using air, the flame base is lifted off and then finally blown out by increasing the fuel jet or supplying air velocity. This blow out of lifted flames is known to be caused by local extinction and flame-let quenching, which means that the velocity of mass convection exceeds thermal energy propagation. In other words, the chemical reaction is sustainable if thermal energy is sufficiently supplied.
          </p>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flame Tip Flickering and Instabilities</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Flame tip flickering was observed in both lean (0.4 &lt; φG &lt; 0.7) and rich (1.4 &lt; φG &lt; 2.0) conditions. This flickering is known to depend on the Lewis number of the reactive mixture (LeR), because LeR is far from unity. From a local point of view, local extinction is related to the chemical reaction rate and preferential instability which is one of the intrinsic instabilities. From a global point of view, flame extinction is related to the flame stretch (strain rate or curvature) and the reactant concentration (gradient).
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/laminarimage_eba8787a.png" 
              alt="Structure of a laminar premixed oxy-methane flame at φG = 1.1, showing line-of-sight and Abel-inverted CH* measurements with preheat zone, reaction zone, and downstream burned gas region"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">CH* Measurement and Flame Structure</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              To observe the flame structure of oxy-methane combustion, CH* measurement was used. Light emission from CH radicals is known to be a marker of the heat release rate in a reaction zone. In previous works, CH* and OH* are used as indicators of reaction zone because they play an important role in the process of chemical reaction. Donbar et al. observed that in CH and OH PLIF (planar laser induced fluorescence) measurements, the excited CH* layer was thinner than that of OH* and distributed in the preheat zone just before the peak temperature. On the other hand, the excited OH* layer was much broader than that of CH* and widely distributed from the preheat zone to the downstream burned gas region.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              The structure of a laminar premixed oxy-methane flame consists of the preheat zone, the reaction zone, and the downstream burned gas region. The intensity of the CH* was maximized in the reaction zone, confirming the role of CH radicals as heat release rate markers.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/burnoffplot_58acdceb.png" 
              alt="Flame stabilization curve dividing the attached flame region and blow-off region as a function of reactant velocity and global equivalence ratio"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flame Stabilization Curve</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              The flame stabilization curve divides the attached flame region from the blow-off region. The attached flame region (shown in green) represents conditions where the flame remains stable and attached to the burner. The blow-off region (shown in red) indicates conditions where the flame cannot sustain combustion and is extinguished. Flame tip flickering occurs at the boundaries of these regions, particularly in lean (0.4 &lt; φG &lt; 0.7) and rich (1.4 &lt; φG &lt; 2.0) conditions.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/flametable_332f1ae6.png" 
              alt="Experimental conditions table showing variables and ranges: uR (8-20 m/s), ReR (962-2506), FrR (57-142), φG (0.5-2.0), and initial conditions (TR = 300 K, P∞ = 1 atm)"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
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
      title: '🛡️ Safety',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fire Triangle</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              A fire can arise when the 3 components of the Fire Triangle - heat, fuel, and oxygen - are present simultaneously. Removing any of these elements can prevent or extinguish a fire. Various fire extinguisher types and fire suppression methods are designed to eliminate these elements to effectively combat fires:
            </p>
            <ul className="text-stone-300 space-y-2 text-sm mb-3">
              <li><strong>Water extinguishers</strong> cool the fire, thus, removing the heat element from the Fire Triangle.</li>
              <li><strong>Carbon dioxide extinguishers and fire blankets</strong> work by displacing or removing the oxygen element from the Fire Triangle.</li>
              <li><strong>Flame-retardant materials</strong> act on the fuel element by slowing down or inhibiting the combustion process.</li>
            </ul>
            <p className="text-stone-300 text-sm leading-relaxed">
              In addition to these fire suppression methods, proper design and adherence to process safety protocols are essential for eliminating ignition sources and preventing fires (Bosch, 2005).
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/triangleflame_6a0855e5.png" 
              alt="Fire Triangle showing the three essential components: Heat (ignition source), Fuel (combustible material), and Oxygen (oxidizing agent). Removing any one element prevents or extinguishes fire."
              className="w-full max-w-2xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fire Tetrahedron</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              The Fire Tetrahedron is an expanded model that incorporates a fourth element, the chemical reaction, into the traditional Fire Triangle. Just like the Fire Triangle, the removal of any one of these elements results in the extinguishment of the fire. This understanding provides a foundation for us to delve into the explanation of various aspects of fire safety (Perry, 1997).
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/firetetrahedron_d4f4e5e5.png" 
              alt="Fire Tetrahedron showing four essential components: Heat (ignition source), Fuel, Oxidising Agent (oxygen), and Chemical Chain Reaction. All four elements must be present for combustion to occur."
              className="w-full max-w-2xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fuels</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Any material that can undergo combustion is considered a fuel. Fuels can be classified into solids, liquids, or gases, each with unique properties and behaviours during combustion. This classification system provides a valuable framework for understanding the distinct characteristics and behaviours of different fuel types, crucial information in the realm of fire safety and combustion. Before ignition, fuels may undergo diverse chemical or state changes before becoming active participants in a fire.
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h5 className="text-cyan-300 font-semibold mb-2">Gases</h5>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Gaseous fuels, such as natural gas and propane, are highly flammable in their vapour form. Their combustion is characterised by rapid ignition and high flame temperatures. The flammability of gases is characterised by flammability limits - concentrations in air within which they can ignite and sustain combustion.
                </p>
              </div>
              
              <div>
                <h5 className="text-cyan-300 font-semibold mb-2">Liquids</h5>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Liquid fuels include substances like gasoline, diesel, and various industrial chemicals. Liquids ignite more readily than solids and often produce flammable vapours that can form explosive mixtures with air. Flashpoint and autoignition temperature are critical characteristics influencing the flammability of liquid fuels. Prior to the ignition, liquids can evaporate while retaining their chemical composition or undergo decomposition and subsequent evaporation.
                </p>
              </div>
              
              <div>
                <h5 className="text-cyan-300 font-semibold mb-2">Solids</h5>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Solids encompass a wide range of materials, including wood, paper, fabrics, and plastics. Different types of solids respond differently to heat. Some solids melt before forming fuel vapour, while others produce vapour directly upon heating. Some solids may undergo direct sublimation into gases or follow a path of decomposition (pyrolysis) before evolving into vapours, followed by their ignition. Other solids melt before forming fuel vapour, either maintaining their original chemical composition or decomposing, which adds another layer of complexity. The rate of combustion in solids depends on factors such as density, moisture content, and the presence of accelerants.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/phasetransitions_d4a8bb1b.png" 
              alt="Phase transitions showing solid, liquid, and gas states with processes of sublimation, evaporation, and decomposition. Includes melting and decomposition pathways for different fuel types."
              className="w-full max-w-2xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Heat</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              The ignition of a flammable mixture can occur through various means. It may result from the flammable mixture encountering an external ignition source with sufficient energy or when the gas reaches an autoignition temperature, igniting without the need for an external source. The energy required for ignition depends on factors such as substance, concentration, pressure, and temperature.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'flashback-arresters',
      title: '🛡️ Flashback Arresters',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Experimental Setup and Methodology</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              The pipeline and flame arrester were evacuated and then filled with the fuel gas/oxygen mixture produced in a mixing vessel up to the various experimental pressures. The mixture was ignited at the end of the pipeline attached ahead of the arrester by means of a melting metal wire. Experiments were carried out in which the sintered metal flame arrester element was stressed from the outside (Figure 1a) and from the inside (Figure 1b) by the incoming reaction front.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              Sintered metal elements of quality SIKA-R30, R20, R10 and R3 were used. The numbers in the quality marks give the maximum width of the gaps in the pores of the sintered metal in micrometers. The strength of the material increases with decreasing pore size. The experimental flame arrester had dimensions of Ø27 × Ø20 × 40 mm and could be fixed in the housing. The screwed connection part had a 5 mm deep recess to fix the arrester element, 3 mm of which had a conical taper of 1:10 and 2 mm had a bevel-edge of 30°.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/flashbackcrosssection_d8a17dcd.png" 
              alt="Experimental flame arrester cross-section showing stressing of the sintered metal element by the incoming reaction front: (a) from outside; (b) from inside. Shows the housing, sintered metal element (orange), ignition vector, and cross-drilled bores for gas stream direction."
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flame Arrester Design and Assembly</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              The cone-shaped surface on the housing parts is shaped in such a way that, when the device is assembled, the sintered metal element is compressed from the outside at one end and widened out from within at the other end. Thus, over the 3 mm long cone-shaped surface, a connection is produced that is safe against flame transmission between the components. Any flame transmission is only possible via the pores of the sintered metal element or via cracks in the sintered metal element which might be formed as a result of severe stresses.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Experimental Results with Acetylene/Oxygen Mixtures</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              The diagram in Figure 2 gives results obtained with the experimental flame arrester and with acetylene/oxygen mixtures. The limiting pressure for safety against flame transmission for sintered metal elements is shown in relation to the composition of the acetylene/oxygen mixture. The parameter is the quality of the sintered metal. Elements of quality SIKA-R30, R10 and R3 were used. The length of the pipeline attached ahead of the unit was L = 5000 mm for all experiments.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              Experiments were carried out with the experimental flame arrester and arrester elements of quality SIKA-R3 in which the arrester element was stressed by the incoming reaction front not only from the outside but also from the inside. In these experiments, with an initial pressure of 4.5 bar, a mixture of 42% by volume of acetylene and a stressing of the arrester element from inside by the incoming reaction front, break up of the arrester element occurred.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/flashbackplot_53ebe88b.png" 
              alt="Limiting pressure for safety against flame transmission for experimental flame arrester with sintered metal elements of quality SIKA-R3, R10 and R30 with flashback in acetylene/oxygen mixtures. Shows pressure (bar) vs. content by volume of acetylene. Pipeline length L = 5000 mm. Includes notes on sintered metal element cracks and stressing from outside and inside."
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fuel Gas Mixture Ratios and Safety Limits</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              With fuel gas/oxygen mixtures incorporating the fuel gases acetylene, hydrogen, propane and methane, the lowest limiting pressures for safety against flame transmission for sintered metal elements of quality SIKA-R30 are in a ratio of approximately 1:2:3:4. These occur at mixtures of 32% acetylene by volume, 14% propane by volume, 28% methane by volume and 42% hydrogen by volume.
            </p>
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Shock Waves and Pressure Dynamics</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              On the basis of the discussion of the experimental results, it is possible to conclude that, in the case of barrier layers made of sintered metal, the limiting pressure for safety against flame transmission increases quite considerably due to shock waves arriving at the arrester element ahead of the reaction front. The particular processes in operation here can only be a matter of conjecture at the present time.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              With below-stoichiometric hydrogen/oxygen mixtures, this state of affairs, where the limiting pressure can no longer be increased by incoming shock waves, occurs in those mixtures where the limiting pressure is still relatively low being increased by incoming shock waves. This is why lower limiting pressures are achieved in experiments with short pipeline lengths and mixtures with less than 27% hydrogen by volume than in the case of experiments with longer pipelines (L = 5 m) and the same mixture compositions.
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              However, in order to achieve lower limiting pressures for these mixtures than for experiments with long pipelines and mixtures at about 42% hydrogen by volume, the length of the pipeline selected must be less than 1 m. The length L = 1.5 m (5 feet) for the pipeline required for tests given in the American testing rules has probably been selected because, in tests with this pipe length and conditions at the detonation limit, the mechanical stress on the sintered metal element is considerably greater than in tests with a longer pipeline of 4.5 m (15 feet) and stable detonations at stationary conditions.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <CustomAccordion items={accordionItems} allowMultiple={true} />
    </div>
  );
}

