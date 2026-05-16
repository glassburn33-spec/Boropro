import React from 'react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Accordion } from '@/components/Accordion';
import { ColorSwatch, ColorSwatchRow, InlineColorSwatch } from '@/components/ColorSwatch';


export default function ColorScienceTab() {
  const [showDrawer, setShowDrawer] = useState(false);
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
            <div className="bg-stone-800/30 rounded-lg p-6 space-y-6 text-sm text-stone-300">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <ColorSwatch color="#4B5563" name="Indigo" size="md" showLabel={false} />
                  <div>
                    <span className="text-purple-300 font-semibold">[4]Ni (Four-coordinate):</span> Maximum energy transitions (~15,000–21,000 cm⁻¹). Generates indigo coloration in large-alkali-containing glasses.
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ColorSwatch color="#8B6F47" name="Brown" size="md" showLabel={false} />
                  <div>
                    <span className="text-amber-500 font-semibold">[5]Ni (Five-coordinate):</span> Intermediate energy transitions (~19,000–25,000 cm⁻¹). Generates brown coloration via broad, displaced absorption feature.
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ColorSwatch color="#5FA87C" name="Green" size="md" showLabel={false} />
                  <div>
                    <span className="text-green-400 font-semibold">[6]Ni (Six-coordinate):</span> Minimum energy transitions ({'>'}23,000 cm⁻¹). Generates green coloration with attenuated visible-region absorption.
                  </div>
                </div>
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
              <div className="bg-stone-800/30 rounded-lg p-4 text-sm text-stone-300 space-y-4">
                <p className="font-semibold text-amber-300">Comparative Absorbance Profiles: Chromium Oxidation State Differentiation</p>
                <div className="flex gap-6 justify-center py-4">
                  <div className="flex flex-col items-center gap-2">
                    <ColorSwatch color="#7030A0" name="Cr(III)" size="md" showLabel={false} />
                    <p className="text-xs text-stone-400">Purple (Cr³⁺)</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ColorSwatch color="#FFD700" name="Cr(VI)" size="md" showLabel={false} />
                    <p className="text-xs text-stone-400">Yellow (Cr⁶⁺)</p>
                  </div>
                </div>
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
              Thermal energy induces <span className="font-semibold text-amber-300">dramatic chromatic transformations</span> in glass matrices. Representative examples include:
            </p>
            <div className="flex gap-6 justify-center py-4 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <ColorSwatch color="#D4A574" name="Tan" size="md" showLabel={false} />
                <p className="text-xs text-stone-400">Tan (Cool)</p>
              </div>
              <div className="text-stone-400 flex items-center">→</div>
              <div className="flex flex-col items-center gap-2">
                <ColorSwatch color="#00CED1" name="Cyan" size="md" showLabel={false} />
                <p className="text-xs text-stone-400">Cyan (Hot)</p>
              </div>
            </div>
            <p>
              This reversible phenomenon, designated <span className="font-semibold">thermochromic behavior</span>, originates from thermally-activated modifications in metal ion coordination geometry and relative site occupancy distributions.
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
            <p className="font-semibold text-amber-300">Systematic examination of iron-sulfur chromophore systems and their spectroscopic signatures across the amber glass continuum</p>
          </div>

          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              Iron and sulfur constituents appear universally in vitreous matrices, even nominally colorless formulations. Chromatic intensity escalates progressively from pale-golden (Amber1) through deep-brown (Amber8) tonalities. These soda-lime vitreous systems maintain equivalent base-composition matrices while exhibiting systematic sulfur-content variation. Quantitative elemental composition determination employed wavelength-dispersive X-ray fluorescence spectroscopy utilizing multi-standard calibration protocols. Reference materials encompassed sodium-rich feldspars, magnesium-silicate garnets, potassium-bearing feldspathic phases, sulfate minerals, and iron-oxide standards. Analytical parameters included 25 kV accelerating potential and 15 µm beam defocusing to suppress volatile-element migration. Multiple measurement locations (approximately 10 per specimen) accommodated compositional heterogeneity assessment. Analytical precision achieved ±0.1% relative dispersion. Comprehensive elemental quantification results appear tabulated below.
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
              Spectrophotometric absorption measurements characterizing the iron-sulfur chromophoric system across the amber glass series (Amber1–Amber8), performed at ambient temperature following ultraviolet-edge background subtraction. Successive spectra display 2 cm<sup>−1</sup> absorbance offset increments, progressing from lowest-concentration (Amber1, baseline) through highest-concentration (Amber8, apex) formulations for visual discrimination.
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
              Spectroscopic evolution of Amber8 formulation across thermal gradient (293 K ambient through 40 K cryogenic conditions), with color-coded temperature progression (red=warm, blue=cold). Magnified inset examination of the 34,000 cm<sup>−1</sup> absorption maximum demonstrates band-sharpening and hypsochromic (higher-wavenumber) shifting upon thermal contraction. Temperature-dependent spectroscopic behavior illuminates the chromophore's electronic-state dynamics and matrix-mediated thermal responsiveness.
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
              Colorimetric coordinate mapping of all eight amber formulations derived from spectroscopic data, computed using D65 standard illuminant and 2° observer geometry. Experimental chromaticity values for the complete amber series demonstrate exceptional concordance with Beer-Lambert-law predictions extrapolated from Amber8 measurements. This alignment substantiates monochromatic origin (single chromophoric species) with concentration-dependent absorption intensity governing perceived coloration magnitude.
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
  ];

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
                <a
                  href="/explore?tab=studio"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  Glass-Science
                </a>
                <a
                  href="/explore?tab=scieequip"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  Scie-Equip
                </a>
                <a
                  href="/explore?tab=colorscience"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  Color-Scie
                </a>
                <a
                  href="/tools"
                  onClick={() => setShowDrawer(false)}
                  className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-amber-400 transition block"
                >
                  Tools
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
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">Color Science</h1>
        </div>

        {/* Accordion Sections */}
        <div>
          <Accordion items={accordionItems} allowMultiple={true} />
        </div>
      </main>
    </div>
  );
}
