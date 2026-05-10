/*
 * Scie-Equip Page
 * Scientific Equipment and Instrumentation for Glass Blowing
 */

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function ScieEquip() {
  const [showDrawer, setShowDrawer] = useState(false);

  const accordionItems = [
    {
      id: 'flame-structure',
      title: '🔥 Flame Structure and Combustion Zones',
      content: (
        <div className="space-y-6">
          <p className="text-stone-300 leading-relaxed">
            Understanding flame architecture is fundamental to spectroscopic analysis and glass material characterization. The diagram illustrates a longitudinal cross-section aligned with the analytical beam path. The initial combustion region contains abundant molecular emission products that interfere with absorption measurements, reducing analytical sensitivity. The middle thermal band exhibits high concentrations of atomized species, making it optimal for absorption-based detection. Peak thermal intensity occurs approximately 2–3 cm above the initial combustion zone. As atomic species rise toward the terminal combustion region, declining temperatures promote recombination into molecular compounds.
          </p>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/flamediagram_78aea61e.png" 
              alt="Flame structure showing primary combustion zone, interzonal region, and secondary combustion zone with optical path"
              className="w-full max-w-2xl rounded-lg border border-stone-600"
            />
          </div>
          
          <p className="text-stone-300 leading-relaxed">
            Flame thermal output directly influences atomization efficiency and is determined by fuel-oxidant composition. Among prevalent fuel-oxidant pairings, air-acetylene and nitrous oxide-acetylene systems dominate analytical applications. Standard operation maintains near-stoichiometric fuel-oxidant proportions; however, fuel-excess configurations enhance analysis of readily oxidizable elements and compounds.
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
            Flame behavior is fundamentally determined by the proportional balance between fuel and oxidant components, which establishes whether the flame exhibits reducing, neutral, oxidizing, or carburizing properties. Each flame configuration presents unique thermal and chemical characteristics that significantly influence glass manipulation and analytical procedures.
          </p>

          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-yellow-500">
            <h4 className="text-yellow-300 font-bold mb-3">Carburizing Flame</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Carburizing flame characteristics arise from acetylene surplus conditions, identifiable by an intermediate thermal zone positioned between the central cone and outer envelope. This intermediate zone exhibits diminished luminosity and pale coloration relative to the central cone, yet maintains considerably greater brightness than the peripheral envelope. This gentle flame configuration (alternatively termed a reducing flame) proves advantageous for aluminum and aluminum-based alloy joining and for low-temperature soldering operations.
            </p>
            <div className="flex justify-center my-4">
              <img 
                src="/manus-storage/reductinonflame_e88e8e04.webp" 
                alt="Carburizing flame showing torch nozzle with bright blue-white inner core transitioning to multicolored flame with magenta, purple, yellow, orange, and rainbow-colored feather extending outward"
                className="w-full max-w-3xl rounded-lg border border-stone-600"
              />
            </div>
          </div>

          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-blue-400">
            <h4 className="text-blue-300 font-bold mb-3">Neutral Flame Image Description</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Neutral flame morphology reveals two distinct thermal stratifications. The central luminous zone emits brilliant white-cyan radiation and occupies minimal distance from the torch aperture. The surrounding thermal mantle displays subdued coloration and reduced radiance intensity. This equilibrium flame configuration enables metallurgically neutral operations, facilitating steel joining, thermal processing, and sectioning without chemical modification. A subtle reducing microzone precedes the central luminous region. Though visually elusive and perceptually challenging, this zone establishes the reducing chemical environment essential for flux-free steel joining operations.
            </p>
            <div className="flex justify-center my-4">
              <img 
                src="/manus-storage/neutralizingflame_37453d37.webp" 
                alt="Neutral flame showing torch nozzle with bright cyan-white inner core transitioning to multicolored flame with blue, purple, magenta, and rainbow-colored feather extending outward"
                className="w-full max-w-3xl rounded-lg border border-stone-600"
              />
            </div>
          </div>

          <div className="bg-stone-800/50 p-4 rounded border-l-4 border-cyan-400">
            <h4 className="text-cyan-300 font-bold mb-3">Oxidizing Flame Image Description</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              Oxidizing flame manifestation occurs through incremental oxygen augmentation beyond the secondary zone elimination threshold. This flame exhibits abbreviated overall extent and intensified sharpness relative to neutral configurations, featuring a diminished and acutely tapered central cone. Thermal intensity marginally surpasses neutral flame output, establishing applicability for ferrous casting joining, copper-based alloy fabrication, zinc-containing alloy operations, and specialized brazing procedures.
            </p>
            <div className="flex justify-center my-4">
              <img 
                src="/manus-storage/oxydizingflame_8b8072d2.webp" 
                alt="Oxidizing flame showing torch nozzle with sharp white-bluish inner core transitioning to multicolored flame with blue, cyan, magenta, orange, and rainbow-colored feather extending outward"
                className="w-full max-w-3xl rounded-lg border border-stone-600"
              />
            </div>
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
            Thermal annealing via flame exposure employs a carbon-rich reducing flame to deposit particulate carbon layers on glass surfaces during thermal treatment. This specialized methodology exploits the reducing flame's hydrocarbon-saturated environment to establish a thermal-protective carbon deposit that modulates heat transfer characteristics and surface behavior. Carbon deposit density is finely regulated through manipulation of the oxidant-to-fuel proportional balance.
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
              Carbon deposit quantification employs the Beer-Lambert optical principle, which correlates laser-stimulated thermal radiation (LTR) emissions to particulate carbon concentration. A proportional relationship between LTR signal intensity (derived from repetitive sampling) and carbon deposit density is established and applied to convert both instantaneous and temporally-averaged LTR measurements into spatial carbon deposit density distributions. This quantification approach maintains validity across experimental configurations when LTR measurements employ standardized optical apparatus, consistent laser power delivery, and uniform detector sensitivity. This calibration methodology's effectiveness derives from performing quantification on carbon deposits at the precise furnace location under investigation, guaranteeing positional precision and experimental reproducibility.
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
            The exponential inverse relationship between oxygen availability and carbon deposit density illustrates the exacting precision necessary for thermal flame treatment. Glass workers can modulate fuel-oxidant proportions to establish targeted carbon deposit intensities, substantially affecting surface thermal behavior, heat dissipation patterns, and ultimate thermal treatment outcomes.
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
      title: '📊 Temperature Measurement: Thermocouples and Pyrometers',
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
      title: '🌡️ Flame Stability and Blow-off Analysis',
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
            <img 
              src="/manus-storage/laminarimage_eba8787a.png" 
              alt="Structure of a laminar premixed oxy-methane flame at φG = 1.1, showing line-of-sight and Abel-inverted CH* measurements with preheat zone, reaction zone, and downstream burned gas region"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
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
            <img 
              src="/manus-storage/burnoffplot_58acdceb.png" 
              alt="Flame stabilization curve dividing the attached flame region and blow-off region as a function of reactant velocity and global equivalence ratio"
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flame Stabilization Curve</h4>
            <p className="text-stone-300 text-sm leading-relaxed mb-3">
              The flame stabilization boundary demarcates the anchored flame operational domain from the extinction threshold region. The anchored flame zone (depicted in green) encompasses operating conditions maintaining stable flame attachment to the burner apparatus. The extinction threshold zone (depicted in red) encompasses conditions where combustion cannot be sustained and flame extinction occurs. Flame tip oscillation manifests at the transitional boundaries separating these operational zones, particularly across fuel-lean (0.4 &lt; φG &lt; 0.7) and fuel-rich (1.4 &lt; φG &lt; 2.0) regimes.
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
            <img 
              src="/manus-storage/triangleflame_6a0855e5.png" 
              alt="Fire Triangle showing the three essential components: Heat (ignition source), Fuel (combustible material), and Oxygen (oxidizing agent). Removing any one element prevents or extinguishes fire."
              className="w-full max-w-2xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Fire Tetrahedron</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              The Fire Tetrahedron represents an advanced conceptual framework incorporating a fourth critical parameter—the exothermic chemical reaction—into the foundational triadic combustion model. Analogous to the triadic framework, disruption of any singular component terminates combustion propagation. This expanded mechanistic understanding establishes the theoretical foundation for comprehensive fire safety analysis and intervention strategy development.
            </p>
          </div>
          
          <div className="flex justify-center my-6">
            <img 
              src="/manus-storage/firetetrahedron_d4f4e5e5.png" 
              alt="Fire Tetrahedron showing four essential components: Heat (ignition source), Fuel, Oxidising Agent (oxygen), and Chemical Chain Reaction. All four elements must be present for combustion to occur."
              className="w-full max-w-3xl rounded-lg border border-stone-600"
            />
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded border border-stone-600">
            <h4 className="text-amber-300 font-bold mb-3">Flashback Arresters</h4>
            <p className="text-stone-300 text-sm leading-relaxed">
              Flashback arresters are critical safety devices that prevent flame propagation back through fuel and oxidant supply lines. These devices employ mechanical or chemical mechanisms to interrupt flame propagation and protect equipment and personnel from dangerous backflash events.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* FIXED HEADER */}
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
                <a
                  href="/flame-simulator"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  Glass-Science
                </a>
                <a
                  href="/references"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  References
                </a>
              </div>
            )}
          </div>
          
          {/* Logo on left */}
          <a href="/" className="flex-shrink-0">
            <img src="/manus-storage/ChatGPTImageMay5,2026,10_33_46PM_dee2f726.png" alt="BoroPro Logo" className="h-28 w-28 object-contain" />
          </a>
          
          {/* Header title */}
          <div className="flex-1 ml-4">
            <h1 className="text-2xl font-bold text-amber-400">Scie-Equip</h1>
            <p className="text-stone-400 text-sm">Scientific Equipment & Instrumentation</p>
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

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-6" style={{ marginTop: '120px' }}>
        <Accordion type="single" collapsible>
          {accordionItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg px-6 py-4 text-left data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
                <h2 className="text-lg font-semibold text-amber-400">
                  {item.title}
                </h2>
              </AccordionTrigger>
              <AccordionContent className="bg-stone-800 border border-stone-700 border-t-0 rounded-b-lg px-6 py-4">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  );
}
