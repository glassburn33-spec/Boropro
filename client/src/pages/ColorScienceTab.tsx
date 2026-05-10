import React from 'react';
import { Accordion } from '@/components/Accordion';
import { ThermochromismSimulator } from '@/components/ThermochromismSimulator';

export default function ColorScienceTab() {
  const accordionItems = [
    {
      id: 'metal-ion-reference',
      title: '1. Metal Ion Color Reference',
      content: (
        <div className="space-y-4">
          <p className="text-stone-300">
            A systematic catalog correlating transition metal cations, their electronic configurations, and the chromatic manifestations they generate within borosilicate glass matrices:
          </p>
          <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
            <img 
              src="/manus-storage/colorcompoundstaBLE_dca7207b.png" 
              alt="Metal Ion Color Reference" 
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="bg-stone-800/30 rounded-lg p-6 text-sm text-stone-300">
            <p>
              This reference catalog presents the correlation between transition metal cations (left), their coordination environments and valence states, and the corresponding chromatic properties within borosilicate glass systems (right). Utilize this reference to anticipate color manifestations based on metal ion speciation and local coordination geometry.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'peculiar-nickel',
      title: '2. Peculiar Sites, Peculiar Colors: Nickel (Ni²⁺)',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/30 rounded-lg p-6 text-sm text-stone-300 mb-4">
            <p className="font-semibold text-amber-300 mb-2">Coordination Geometry as the Primary Determinant of Chromatic Response</p>
          </div>

          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              Nickel(II) species demonstrates remarkable polychromatic behavior spanning <span className="text-amber-300 font-semibold">tan and golden hues</span> in sodium-, lithium-, and calcium-rich glass matrices, transitioning to <span className="text-purple-300 font-semibold">mauve and deep blue</span> in potassium-, rubidium-, and cesium-dominant systems, or alternatively <span className="text-green-300 font-semibold">jade and rust-orange</span> in alkali-deficient borate and borosilicate compositions. This extensive polychromatic manifestation within silicate networks originates from <span className="font-semibold">polymorphic coordination environments surrounding Ni(II)</span>.
            </p>

            <p>
              The ubiquitous <span className="text-amber-600 font-semibold">brown</span> hue emerges from continuous absorption attenuation extending across the ultraviolet-to-infrared boundary without discrete spectral absorption features within the visible domain. This chromatic manifestation exhibits pronounced environmental sensitivity, demonstrated through spectroscopic comparison of optical absorption profiles between ordered crystalline and disordered amorphous CaO·NiO·2SiO₂ structures.
            </p>

            <p>
              Ordered crystalline nickel displays <span className="text-green-300 font-semibold">light green</span> hue characteristic of [6]Ni(II) (six-coordinate octahedral arrangement). In amorphous systems, Ni(II) occupies subordinate tetrahedral sites yet predominantly resides in <span className="text-amber-500 font-semibold">five-coordinate trigonal bipyramidal</span> configuration, generating brown coloration via broad, irregular absorption positioned near 22,500 cm⁻¹ (444 nm).
            </p>

            <p>
              Weak and diffuse absorption features distributed throughout visible and near-infrared wavelengths correspond to ancillary electronic transitions associated with [5]Ni geometry. Five-coordinate nickel site presence has been substantiated via complementary Ni K-edge extended X-ray absorption fine structure (EXAFS), X-ray absorption near edge structure (XANES) spectroscopy, and neutron diffraction combined with isotopic substitution techniques.
            </p>

            <p>
              Electronic transitions from <span className="text-purple-300 font-semibold">four-coordinate Ni(II)</span> manifest as subordinate spectral components in optical absorption measurements of nickel-doped silicate, aluminosilicate, and borosilicate glasses, with notable exception in low-alkali borate and borosilicate systems where tetrahedral coordination predominates.
            </p>

            <p>
              Glass compositions containing bulky alkali species (K, Rb, Cs) demonstrate [4]Ni(II)-mediated <span className="text-blue-300 font-semibold">indigo/mauve coloration</span> arising from intense absorption positioned approximately 16,000 cm⁻¹ (red-region wavelengths) combined with high transmission at shorter wavelengths. This composition-sensitive chromatic manifestation illustrates the intrinsic relationship between local atomic coordination architecture and macroscopic optical behavior.
            </p>
          </div>

          {/* Nickel Coordination Spectra */}
          <div className="space-y-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400">Nickel Coordination Spectra in Borosilicate Glass</h4>
            <p className="text-stone-300">
              This spectroscopic dataset presents optical absorption profiles corresponding to three distinct Ni(II) coordination configurations. Each geometric arrangement generates characteristic absorption features at specific wavenumber positions, directly controlling the resulting chromatic manifestation:
            </p>
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/nickelsprectra_2ffd56de.png" 
                alt="Nickel Coordination Spectra" 
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="bg-stone-800/30 rounded-lg p-6 space-y-3 text-sm text-stone-300">
              <div>
                <span className="text-purple-300 font-semibold">[4]Ni (Four-coordinate):</span> Maximum energy transitions (~15,000–21,000 cm⁻¹). Generates indigo coloration in large-alkali-containing glasses.
              </div>
              <div>
                <span className="text-amber-500 font-semibold">[5]Ni (Five-coordinate):</span> Intermediate energy transitions (~19,000–25,000 cm⁻¹). Generates brown coloration via broad, displaced absorption feature.
              </div>
              <div>
                <span className="text-green-400 font-semibold">[6]Ni (Six-coordinate):</span> Minimum energy transitions ({'>'}23,000 cm⁻¹). Generates green coloration with attenuated visible-region absorption.
              </div>
            </div>
          </div>

          {/* Coordination Geometry */}
          <div className="space-y-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400">Coordination Geometry and Wavenumber Correlation</h4>
            <p className="text-stone-300">
              This schematic depicts the three-step sequence of Ni(II) coordination evolution within borosilicate matrices, demonstrating the correlation between atomic arrangement geometry surrounding the central Ni(II) species and corresponding light absorption wavenumber positions:
            </p>
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/colorspectrumplot_34c8ce0a.png" 
                alt="Nickel Coordination Geometry" 
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="bg-stone-800/30 rounded-lg p-6 space-y-4 text-sm text-stone-300">
              <div>
                <p className="font-semibold text-amber-300 mb-2">Configuration 1: Four-Coordinate [4]Ni</p>
                <p>Tetrahedral oxygen coordination surrounding Ni(II). This condensed arrangement generates maximum-energy (minimum-wavelength) absorption transitions, producing indigo/blue chromatic manifestations.</p>
              </div>
              <div>
                <p className="font-semibold text-amber-300 mb-2">Configuration 2: Five-Coordinate [5]Ni</p>
                <p>Trigonal bipyramidal oxygen coordination geometry. This intermediate arrangement generates the characteristic brown hue via absorption centered near 22,500 cm⁻¹ (444 nm).</p>
              </div>
              <div>
                <p className="font-semibold text-amber-300 mb-2">Configuration 3: Six-Coordinate [6]Ni</p>
                <p>Octahedral oxygen coordination arrangement. This expanded geometry generates minimum-energy absorption transitions, producing pale green chromatic properties characteristic of ordered nickel compounds.</p>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="border-l-4 border-amber-500 pl-6 py-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400 mb-4">Key Insights for Glass Artists</h4>
            <ul className="space-y-3 text-stone-300">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Coordination geometry governs chromatic output:</span> Identical metal species (Ni(II)) generates disparate chromatic manifestations contingent upon local coordination environment and parent glass composition.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Alkali cation influence:</span> Bulky alkali cations (K, Rb, Cs) promote four-coordinate geometry and indigo/blue chromatic response, whereas compact alkalis (Na, Li) and alkaline-earth cations (Ca) facilitate alternative geometries and tan/amber chromatic manifestations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Phase-dependent chromatic behavior:</span> Identical chemical composition exhibits disparate chromatic properties in ordered crystalline versus disordered amorphous phases due to distinct coordination geometries.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Rational color prediction:</span> Systematic understanding of coordination chemistry principles enables anticipation of chromatic shifts resulting from compositional modifications.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'redox-equilibria',
      title: '3. Redox Equilibria and Glass Coloration',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/30 rounded-lg p-6 text-sm text-stone-300 mb-4">
            <p className="font-semibold text-amber-300">Oxidation-reduction equilibria as fundamental drivers of chromatic manifestation and color stability in borosilicate matrices</p>
          </div>

          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              Oxidation-reduction state profoundly influences glass coloration, exemplified through chromium-doped systems. <span className="text-yellow-300 font-semibold">Chromium-containing glasses</span> exhibit striking chromatic transitions spanning <span className="text-green-300 font-semibold">green through yellow</span> as furnace atmospheres shift from reductive to oxidative regimes. This chromatic manifestation originates from <span className="text-yellow-400 font-semibold">chromate anion formation (CrO₄)²⁻</span>, which mediates oxygen-to-chromium charge-transfer electronic transitions positioned approximately 28,000 cm⁻¹ within oxidatively-treated glass matrices.
            </p>

            <p>
              This intense absorption feature exhibits spectral tail extension spanning ultraviolet-to-visible wavelengths, overlapping with Cr³⁺ absorption signatures. Substantial disparities exist between molar extinction coefficients: Cr³⁺ exhibits <span className="text-amber-300 font-semibold">18–20 l/(cm/mol)</span> while Cr⁶⁺ demonstrates <span className="text-amber-300 font-semibold">4,200 l/(cm/mol)</span>. Consequently, optical spectroscopy cannot reliably quantify chromium redox speciation in glasses containing elevated Cr⁶⁺ concentrations. Alternative methodologies including wet-chemical titration and complementary spectroscopic techniques become necessary.
            </p>

            {/* Chromium Absorption Spectra Image */}
            <div className="my-8 space-y-4">
              <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
                <img 
                  src="/manus-storage/Gemini_Generated_Image_4idm924idm924idm_16acde46.png" 
                  alt="Chromium Absorption Spectra" 
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="bg-stone-800/30 rounded-lg p-4 text-sm text-stone-300 space-y-3">
                <p className="font-semibold text-amber-300">Comparative Absorbance Profiles: Chromium Oxidation State Differentiation</p>
                <p>
                  This dataset presents linear absorbance characteristics of Cr(III) and Cr(VI) species across soda-lime-silica (SLS) and sodium borosilicate (NBS) glass matrices. The <span className="text-purple-300 font-semibold">Cr(III) absorption maximum</span> manifests near 15,000 cm⁻¹ (purple spectral region), whereas the <span className="text-yellow-300 font-semibold">Cr(VI) oxygen-transfer band</span> emerges approximately 28,000 cm⁻¹ (near-ultraviolet boundary). The substantial differential in peak magnitudes demonstrates Cr(VI) spectroscopic dominance, effectively suppressing Cr(III) detection in optical analysis despite spatially-separated absorption features.
                </p>
              </div>
            </div>

            <p>
              Redox pair interactions constitute fundamental strategies in glass fining operations. Manganese historically earned designation as <span className="text-amber-400 font-semibold">"the glassmaker's detergent"</span> due to its capacity, when incorporated as manganese dioxide (MnO₂) into soda-lime-silica matrices, to suppress iron-induced greenish coloration through selective oxidation of ferrous (Fe²⁺) to ferric (Fe³⁺) species:
            </p>

            <div className="bg-stone-900/50 rounded-lg p-4 border-l-2 border-amber-500 my-4 font-mono text-sm text-amber-200">
              <p>Mn⁴⁺ + 2 Fe²⁺ → Mn²⁺ + 2 Fe³⁺</p>
            </div>

            <p>
              Exclusively <span className="font-semibold">spin-restricted electronic transitions</span> characterize the d⁵ electron configuration present in both Mn²⁺ and Fe³⁺, yielding attenuated absorption intensities and consequently <span className="text-stone-400 font-semibold">minimally-colored glass products</span>. Nevertheless, this chromatic suppression exhibits temporal instability. Prolonged solar radiation exposure (designated <span className="text-amber-400 font-semibold">photochemical reduction</span>) catalyzes reverse redox transformations:
            </p>

            <div className="bg-stone-900/50 rounded-lg p-4 border-l-2 border-amber-500 my-4 font-mono text-sm text-amber-200">
              <p>Mn²⁺ + hν → Mn³⁺ + e⁻</p>
              <p>Fe³⁺ + e⁻ → Fe²⁺</p>
            </div>

            <p>
              Historical glass artifacts—ancient windows and architectural elements—demonstrate this phenomenon through progressive purple coloration development across centuries of solar exposure, exemplifying the <span className="text-purple-300 font-semibold">solarization-induced purple hue</span>, of which <span className="text-purple-400 font-semibold">naturally-occurring amethyst-colored desert glass</span> represents an environmental analog. This chromatic evolution illustrates the intricate interplay between redox chemistry and photochemical processes, generating time-dependent color evolution in glass—a paramount consideration for practitioners engaged with historically-significant or photosensitive glass compositions.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'thermochromism',
      title: '4. Temperature Dependence of Optical Absorption: Thermochromism',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/30 rounded-lg p-6 text-sm text-stone-300 mb-4">
            <p className="font-semibold text-amber-300">Thermal excitation as a mechanism for reversible chromatic transformation in transition metal-doped glass systems</p>
          </div>

          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              Thermal energy induces <span className="font-semibold text-amber-300">dramatic chromatic transformations</span> in glass matrices. Representative examples include <span className="text-blue-300 font-semibold">tan-colored nickel-doped glasses</span> transitioning to <span className="text-green-300 font-semibold">cyan or emerald</span>, and <span className="text-yellow-300 font-semibold">chromium-doped glasses exhibiting yellow coloration</span>. This reversible phenomenon, designated <span className="font-semibold">thermochromic behavior</span>, originates from thermally-activated modifications in metal ion coordination geometry and relative site occupancy distributions.
            </p>

            <p>
              Analogous to composition-dependent coloration mechanisms, transition metal behavior exhibits substantial variation contingent upon <span className="font-semibold">single-site versus multi-site occupancy</span>. Multi-site systems experience temperature-modulated equilibrium redistribution among coordination sites. Single-site systems undergo thermal expansion of the coordination polyhedron, modifying ligand field strength and consequently optical absorption characteristics. High-temperature spectroscopic measurements present experimental challenges, necessitating reliance upon sub-Tg investigations. Nevertheless, significant spectroscopic modifications potentially occur within molten-state regimes, remaining incompletely characterized in contemporary literature.
            </p>

            <div className="bg-stone-900/50 rounded-lg p-6 border-l-2 border-blue-500 my-4">
              <p className="font-semibold text-blue-300 mb-3">Multi-Site Coordination Dynamics: Nickel(II) as Exemplar System</p>
              <p className="text-sm text-stone-300 space-y-3">
                <span className="block">Within potassium tetraborate matrices, Ni(II) species distribute across tetrahedral and pentacoordinate configurations, mirroring behavior observed in most oxide glass systems. Substantial compositional shifts manifest proximal to Tg, whereupon <span className="text-blue-300 font-semibold">[4]Ni(II) abundance escalates</span>. This phenomenon correlates with thermally-activated boron coordination reorganization:</span>
                <span className="block font-mono text-amber-200 mt-2">Na<sup>CC</sup> + BO₄⁻ ⇌ BO₃ + O<sup>NBO</sup> + Na<sup>NM</sup></span>
                <span className="block text-xs text-stone-400 mt-1">where Na<sup>CC</sup> = charge-compensating Na, Na<sup>NM</sup> = network-modifying Na, O<sup>NBO</sup> = non-bridging oxygen</span>
              </p>
            </div>

            <p>
              This <span className="text-blue-300 font-semibold">four-coordinate to three-coordinate boron interconversion</span> between glassy and molten phases amplifies alkali cation activity and furnishes supplementary charge-compensating capacity for <span className="text-blue-300 font-semibold">[4]Ni(II)</span>, facilitating coordination reorganization. Certain borate compositions exhibit <span className="font-semibold">kinetically-unfrozen [4]Ni(II)/[5]Ni(II) ratios at Tg</span> due to minimal energetic separation between these coordination states, permitting sustained ionic rearrangement despite network rigidification.
            </p>

            <p>
              Elevated-temperature Ni(II) and Co(II) speciation modifications demonstrate <span className="font-semibold">kinetic trapping via rapid thermal quenching</span>. Within cobalt- and nickel-doped alkali borosilicate matrices, high-temperature-favored tetrahedral species undergo partial retention at ambient temperatures following accelerated cooling protocols. This phenomenon underscores the paramount significance of <span className="text-amber-300 font-semibold">thermal treatment protocols on resulting glass microstructure</span>—a fundamental principle governing how glassblowers must engineer cooling regimens to achieve targeted chromatic outcomes.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'phase-separation',
      title: '5. Phase Separation in Glass Melts: Controlling Immiscibility',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/30 rounded-lg p-6 text-sm text-stone-300 mb-4">
            <p className="font-semibold text-amber-300">Compositional phase demixing mechanisms in borosilicate systems and strategies for engineering homogeneous glass matrices</p>
          </div>

          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              In materials science, a <span className="font-semibold">"phase"</span> designates a region exhibiting chemical homogeneity and physical distinctness. <span className="font-semibold">Phase demixing</span>, prevalent in liquid systems, describes the spontaneous partitioning of initially-homogeneous mixtures into multiple chemically-distinct regions. Classical exemplars include aqueous-organic biphasic systems at ambient conditions, wherein separate oil-dominated and water-dominated phases emerge. Such systems exhibit <span className="text-amber-300 font-semibold">"mutual insolubility."</span>
            </p>

            <p>
              The <span className="font-semibold">spatial architecture of demixed phases</span> exhibits composition-dependent variation. In water-dominant systems, organic components adopt <span className="text-cyan-300 font-semibold">"isolated"</span> morphologies dispersed throughout an encompassing <span className="text-purple-300 font-semibold">"interconnected"</span> aqueous matrix. Organic-dominant systems exhibit inverse topology. Equimolar compositions generate <span className="font-semibold">bicontinuous architectures</span> wherein both phases establish three-dimensional connectivity.
            </p>

            <p>
              <span className="font-semibold">Compositional demixing manifests ubiquitously in molten glass systems.</span> Borosilicate formulations—incorporating both silica and borate network-forming oxides—exemplify extensively-characterized demixing behavior. Distinctly from simple biphasic liquids (aqueous-organic systems), glass-melt phases rarely achieve chemical purity. Borosilicate systems characteristically partition into <span className="text-blue-300 font-semibold">"borate-enriched domains"</span> and <span className="text-amber-300 font-semibold">"silica-enriched domains"</span>, each retaining heterogeneous distributions of both network formers.
            </p>

            <p>
              The <span className="font-semibold">topological organization of demixed phases</span> within glass exhibits substantial morphological heterogeneity. Conventional nucleation-growth mechanisms generate discrete <span className="text-cyan-300 font-semibold">"droplet-like"</span> phase architectures, whereas spontaneous <span className="text-purple-300 font-semibold">"spinodal decomposition"</span> generates interconnected, filament-like phase networks. Demixing phenomena originating at elevated molten-state temperatures undergo <span className="font-semibold">"kinetic fixation"</span> upon vitrification into solid-state glass.
            </p>

            <p>
              When both demixed phases exhibit glass-forming propensity, cooling generates <span className="text-green-300 font-semibold">glass-glass phase-separated solids</span>. Conversely, crystallization-prone phases generate <span className="text-amber-400 font-semibold">glass-crystal phase-separated composites</span>. Historically, phase separation received negative characterization—and for numerous applications, remains problematic. Multi-phase architectures substantially alter molten-glass physico-chemical parameters, complicating rheological control and compromising final-product optical homogeneity and mechanical integrity.
            </p>

            <p>
              Phase-separation thermodynamics and kinetics in glass-forming systems remain theoretically sophisticated, with contemporary research continuing to refine mechanistic understanding. Nevertheless, industrial practitioners have successfully developed compositional engineering strategies for suppressing or attenuating demixing phenomena. Optimization typically involves <span className="font-semibold">systematic compositional design of melt formulations</span>, wherein demixing manifests exclusively within circumscribed compositional windows.
            </p>
          </div>

          {/* Ternary Phase Diagram */}
          <div className="space-y-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400">Ternary Phase Diagram: Na₂O–B₂O₃–SiO₂ System</h4>
            <p className="text-stone-300">
              This ternary phase diagram shows the immiscibility region (green boundary) where phase separation will occur in the Na₂O–B₂O₃–SiO₂ glass system. Pyrex and Vycor compositions are marked, showing how they sit relative to the immiscibility boundary. Compositions within the immiscibility region undergo phase separation; those outside remain homogeneous.
            </p>
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/phasediagram_0401fabd.png" 
                alt="Ternary Phase Diagram Na2O-B2O3-SiO2" 
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="bg-stone-800/30 rounded-lg p-6 space-y-4 text-sm text-stone-300">
              <div>
                <p className="font-semibold text-amber-300 mb-2">Understanding the Diagram</p>
                <p>Each corner of the triangle represents 100% of one oxide component. The immiscibility region (shown in green) indicates compositions where phase separation will spontaneously occur. Pyrex (high SiO₂) sits outside this region, making it a stable homogeneous glass. Vycor (intermediate composition) sits within or near the boundary, making it susceptible to phase separation.</p>
              </div>
              <div>
                <p className="font-semibold text-amber-300 mb-2">Practical Implications</p>
                <p>Glass manufacturers use this diagram to design compositions that avoid unwanted phase separation. By understanding where the immiscibility boundary lies, they can formulate glasses with desired properties while maintaining homogeneity and optical clarity.</p>
              </div>
            </div>
          </div>

          {/* Phase Morphology Comparison */}
          <div className="space-y-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400">Phase Separation Morphologies: Spinodal vs. Nucleation</h4>
            <p className="text-stone-300">
              Two distinct mechanisms produce different phase morphologies in glass melts. Understanding these mechanisms helps explain how cooling rates and composition affect the final glass structure and properties.
            </p>
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/phaseseperatrion_4f039bd5.png" 
                alt="Phase Separation Morphologies" 
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="bg-stone-800/30 rounded-lg p-6 space-y-4 text-sm text-stone-300">
              <div>
                <p className="font-semibold text-purple-300 mb-2">Left: Spinodal Decomposition (Tendril Morphology)</p>
                <p>In spinodal decomposition, both phases form simultaneously as intertwined, continuous networks. This occurs when the glass composition is deep within the immiscibility region. The resulting morphology resembles interconnected tendrils or channels, creating a bicontinuous structure. This mechanism is driven by thermodynamic instability and produces rapid phase separation.</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-300 mb-2">Right: Nucleation and Growth (Droplet Morphology)</p>
                <p>In classical nucleation and growth, one phase forms as discrete droplets within a continuous matrix of the other phase. This occurs when the composition is near the immiscibility boundary. The process is slower than spinodal decomposition and produces a more dispersed, particulate structure. Droplet size and distribution depend on cooling rate and composition.</p>
              </div>
              <div>
                <p className="font-semibold text-amber-300 mb-2">Implications for Glass Properties</p>
                <p>Spinodal morphology (continuous phases) typically produces glasses with lower density and higher porosity, useful for applications like Vycor porous glass. Nucleation morphology (droplets) can be controlled to produce specific optical and mechanical properties. Both mechanisms are "frozen in" during cooling, making thermal history critical to final glass structure.</p>
              </div>
            </div>
          </div>

          {/* Control Methods */}
          <div className="border-l-4 border-amber-500 pl-6 py-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400 mb-4">Controlling Phase Separation</h4>
            <ul className="space-y-3 text-stone-300">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Composition tailoring:</span> Carefully selecting the proportions of Na₂O, B₂O₃, and SiO₂ to avoid or minimize the immiscibility region.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Glass modifiers:</span> Adding specific oxides to shift the phase boundary and control phase separation behavior.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Heat treatment:</span> Controlling cooling rates and annealing schedules to freeze in desired phase morphologies or promote phase homogenization.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-bold mt-1">•</span>
                <span><span className="font-semibold">Thermal history:</span> Understanding how different cooling rates produce spinodal vs. nucleation morphologies, enabling control of final glass properties.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'amber-glass',
      title: '6. Iron and Sulfur Coloration: The Amber Glass Series',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/30 rounded-lg p-6 text-sm text-stone-300 mb-4">
            <p className="font-semibold text-amber-300">Compositional Analysis and Visual Spectrum of Soda-Lime Glasses</p>
          </div>

          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              All glasses, even the colorless ones, contain Fe and S. Glass coloration increases from pale-yellow (Amber1) to brown (Amber8). These soda-lime glasses have a similar base glass composition and mostly differ by their sulfur content. The compositions of the commercial glasses were obtained by electron probe microanalysis (EPMA) using a Cameca electron microprobe SX-5 at the CAMPARIS platform (Sorbonne Université, Paris). The following standards were used for quantification: albite (Na), garnet (Mg, Si, Ca), orthoclase (Al, K), baryte (S), hematite (Fe). The acceleration voltage was set to 25 kV, and a defocused beam of 15 µm was used to minimize alkali losses. About 10 analytical points were measured in order to take into account possible heterogeneities of the glasses. The average dispersion of the data was evaluated at 0.1%. The average chemical composition values obtained are presented in the composition table below.
            </p>
          </div>

          {/* Composition Table Image */}
          <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
            <img 
              src="/manus-storage/ambertable_15f1d048.png" 
              alt="Chemical compositions of amber glass samples" 
              className="w-full h-auto object-contain"
            />
            <p className="text-stone-400 text-sm mt-4 text-center italic">
              Chemical compositions of the glasses, as measured by electron microprobe and averaged over 10 measurement points. Note the increasing sulfur content (SO₃) correlating with darker coloration.
            </p>
          </div>

          {/* Spectrum Image */}
          <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4 mt-4">
            <img 
              src="/manus-storage/amberspectrum_2b59b923.png" 
              alt="Macroscopic picture of amber glass samples" 
              className="w-full h-auto object-contain"
            />
            <p className="text-stone-400 text-sm mt-4 text-center italic">
              Macroscopic picture of amber glass samples. Amber1, the lightest amber glass, appears pale yellow, and Amber8, the darkest, is brown. The progression demonstrates how iron and sulfur content creates a continuous color spectrum from nearly colorless to deep brown.
            </p>
          </div>

          {/* Optical Absorption Spectra - All Amber Glasses */}
          <div className="space-y-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400">Optical Absorption Spectra of Amber Glasses</h4>
            <p className="text-stone-300">
              Optical absorption spectra characterizing the amber chromophore in the amber glasses investigated (Amber1 to Amber8), as measured at room temperature after subtraction of the ultraviolet (UV)-edge contribution. An absorbance interval of 2 cm<sup>−1</sup> separates each glass from bottom (Amber1) to top (Amber8) for clarity reasons.
            </p>
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/amberwavelengthplot_91469176.png" 
                alt="Optical absorption spectra of amber glasses Amber1 to Amber8" 
                className="w-full h-auto object-contain"
              />
              <p className="text-stone-400 text-sm mt-4 text-center italic">
                Linear absorbance (cm<sup>−1</sup>) plotted against wavenumber (cm<sup>−1</sup>) and wavelength (nm), showing the systematic increase in absorption intensity with increasing sulfur content from Amber1 (lightest) to Amber8 (darkest).
              </p>
            </div>
          </div>

          {/* Temperature-Dependent Absorption Spectra - Amber8 */}
          <div className="space-y-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400">Temperature Dependence of Optical Absorption: Amber8</h4>
            <p className="text-stone-300">
              Evolution of optical absorption spectra of Amber8 glass from room temperature (red, 293 K) to 40 K (blue). The inset is a zoom on the 34,000 cm<sup>−1</sup> band, showing that the band becomes sharper and shifts slightly toward higher wavenumbers as temperature decreases. This temperature-dependent behavior reveals the dynamic nature of the chromophore's electronic structure and its sensitivity to thermal effects on the glass matrix.
            </p>
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/amber8lwavelenght_d9db5741.png" 
                alt="Temperature-dependent optical absorption spectra of Amber8 glass" 
                className="w-full h-auto object-contain"
              />
              <p className="text-stone-400 text-sm mt-4 text-center italic">
                Linear absorbance (cm<sup>−1</sup>) plotted against wavenumber (cm<sup>−1</sup>) and wavelength (nm) at multiple temperatures from 40 K to 293 K. The color gradient from blue (cold) to red (warm) illustrates how thermal energy affects the optical absorption characteristics of the amber chromophore, with the inset highlighting the 34,000 cm<sup>−1</sup> band narrowing at lower temperatures.
              </p>
            </div>
          </div>

          {/* Beer-Lambert Chromaticity Diagram */}
          <div className="space-y-4 mt-6 pt-6 border-t border-stone-700/30">
            <h4 className="text-xl font-bold text-amber-400">Chromaticity Analysis: Beer-Lambert Behavior</h4>
            <p className="text-stone-300">
              Chromaticity diagram showing chromatic coordinates of the eight amber glasses obtained from their optical spectra and calculated with the illuminant D65 and standard observer 2°. The experimental data obtained for all Amber glasses investigated in this study are in perfect agreement with the position of the Beer-Lambert trend line extrapolated from Amber8 glass. This demonstrates that glass color is caused by the same chromophore, the concentration of which governs the intensity of this coloration.
            </p>
            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/beerlambertcurve_fac44eaf.png" 
                alt="CIE chromaticity diagram showing Beer-Lambert curve for amber glasses" 
                className="w-full h-auto object-contain"
              />
              <p className="text-stone-400 text-sm mt-4 text-center italic">
                CIE chromaticity diagram with D65 illuminant and 2° standard observer showing the Beer-Lambert trend line (dotted curve) and the positions of all eight amber glass samples. The linear relationship between chromophore concentration and color shift demonstrates the Beer-Lambert law's applicability to glass coloration.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'history-color',
      title: '7. History of Color',
      content: (
        <div className="space-y-6">
          <div className="bg-stone-800/30 rounded-lg p-6 text-sm text-stone-300 mb-4">
            <p className="font-semibold text-amber-300">Archaeological Evidence of Glass Coloration Through the Ages</p>
          </div>

          <div className="space-y-6 text-stone-300 leading-relaxed">
            <p>
              The archaeological assemblage discussed here belongs to the Roman and Protobyzantine periods (1st to 5th century AD) and was excavated in Ancient Messene (Peloponnese, Greece). Ancient Messene is an important ancient city in terms of its size, form and state of preservation, representing one of the biggest restoration projects in Greece today. When Pausanias visited Ancient Messene in the 2nd century AD, it was a prosperous political and cultural centre. From AD 212–394 the archaeological record is short of historical information, indicative of the decline of the city. The latest layers of destruction and abandonment of most of the city's buildings followed the collapse of the Roman Empire and are dated at about AD 360/70. However, towards the end of the 4th century AD, a thriving Protobyzantine settlement was established in the area of the Asklepeion and remained active until the end of the 6th century AD.
            </p>

            <p>
              The collection includes glass objects such as vessel fragments, window panes, stirring rods, and glass test pieces. Several coloured translucent and opaque mosaic tesserae were uncovered at the temple of Isis and Serapes and were likely part of the walls' decoration. The table below presents the studied Roman glass fragments, including their colour and oxide composition (wt%) as determined by SEM measurements. The data reveals the sophisticated understanding of glass coloration that Roman glassmakers possessed, with deliberate use of transition metals (Cu, Fe, Mn, Sb) to achieve specific colors ranging from deep blues and greens to yellows, oranges, browns, and purples.
            </p>

            <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
              <img 
                src="/manus-storage/colorhistorytable_72ac83b4.png" 
                alt="Roman glass fragments composition and color analysis" 
                className="w-full h-auto object-contain"
              />
              <p className="text-stone-400 text-sm mt-4 text-center italic">
                List of studied Roman glass fragments including their colour and oxide composition (wt%) as determined by SEM measurements (op. – opaque, tr. – transparent). The data spans multiple color categories: Blue, Green to Yellow, Brown, and Purple, demonstrating the diverse palette of colors Roman glassmakers could achieve through controlled use of transition metal oxides and opacifying agents.
              </p>
            </div>

            <div className="bg-stone-800/30 rounded-lg p-6 border border-stone-700/30">
              <h4 className="text-lg font-semibold text-amber-300 mb-3">Key Observations from Roman Glass Analysis</h4>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-3">•</span>
                  <span><strong>Copper oxides (CuO):</strong> Primary colorant for blues and greens, with concentrations ranging from 0.18 to 3.93 wt%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-3">•</span>
                  <span><strong>Iron oxides (Fe₂O₃):</strong> Used for yellows and browns, with systematic variation in oxidation state controlling color</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-3">•</span>
                  <span><strong>Manganese (MnO):</strong> Employed as both a colorant and decolorizer, with concentrations up to 3.52 wt%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-3">•</span>
                  <span><strong>Antimony (Sb₂O₃):</strong> Used as an opacifying agent, particularly in blue and purple glasses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-3">•</span>
                  <span><strong>Lead (PbO):</strong> Present in select samples, likely for increased brilliance and workability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'thermochromism-simulator',
      title: '8. Interactive Thermochromism Simulator',
      content: (
        <div className="space-y-4">
          <p className="text-stone-300">
            Explore how temperature affects glass color through chromophore behavior. Adjust the temperature slider and flame atmosphere to see real-time color changes across different glass alchemy colors.
          </p>
          <ThermochromismSimulator />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 to-stone-900 text-stone-100 p-6 md:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">Color Science</h1>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-6xl mx-auto">
        <Accordion items={accordionItems} allowMultiple={true} />
      </div>
    </div>
  );
}
