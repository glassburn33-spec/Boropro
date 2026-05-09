import React from 'react';

import { ThermochromismSimulator } from '@/components/ThermochromismSimulator';

export default function ColorScienceTab() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 to-stone-900 text-stone-100 p-6 md:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">Color Science</h1>
        <p className="text-lg text-stone-300">
          Understanding how metal ions create color in borosilicate glass through coordination chemistry and optical absorption
        </p>
      </div>

      {/* Metal Ion Color Reference Table - TOP SECTION */}
      <div className="max-w-6xl mx-auto space-y-4 mb-12">
        <h3 className="text-2xl font-bold text-amber-400">Metal Ion Color Reference</h3>
        <p className="text-stone-300">
          A comprehensive reference guide mapping metal ions and their oxidation states to the colors they produce in borosilicate glass:
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
            This reference table shows the relationship between metal ions (left column), their coordination states and oxidation numbers, and the resulting colors they produce in borosilicate glass (right column). Use this guide to predict color outcomes based on metal ion composition and coordination environment.
          </p>
        </div>
      </div>

      {/* Nickel Section */}
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Title */}
        <div className="border-l-4 border-amber-500 pl-6">
          <h2 className="text-3xl font-bold text-amber-400 mb-2">Peculiar Sites, Peculiar Colors: Nickel (Ni²⁺)</h2>
          <p className="text-stone-300 text-sm">The Example of How Local Structure Determines Optical Properties</p>
        </div>

        {/* Main Content */}
        <div className="bg-stone-800/50 backdrop-blur rounded-lg p-8 border border-stone-700/50">
          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              Nickel yields colors ranging from <span className="text-amber-300 font-semibold">brown and yellow</span> in Na-, Li-, or Ca-bearing glasses to <span className="text-purple-300 font-semibold">purple or blue</span> in K-, Rb-, or Cs-bearing glasses or, less commonly, <span className="text-green-300 font-semibold">green or even orange</span> in some alkali-deficient borate and borosilicate glasses. This broad palette of hues in oxide glasses is directly related to the <span className="font-semibold">varying coordination of Ni²⁺</span>.
            </p>

            <p>
              Probably one of the most commonly observed colors, the <span className="text-amber-600 font-semibold">brown</span> arises from continuously decreasing absorption from the purple to the red parts of the visible domain along with the absence of an absorption maximum in the visible domain. That color is indeed very sensitive to local structure as shown by a comparison between the optical absorption spectra of crystalline and glassy CaO·NiO·2SiO₂.
            </p>

            <p>
              In the crystalline form, nickel exhibits the <span className="text-green-300 font-semibold">light green color</span> characteristic of [6]Ni²⁺ (octahedral coordination). In the glassy form, Ni²⁺ occupies a small proportion of tetrahedral sites but is mostly present in <span className="text-amber-500 font-semibold">triangular bipyramids</span> that give rise to the brown color through a broad, asymmetric absorption band around 22,500 cm&minus;¹ (444 nm).
            </p>

            <p>
              Weak and broad absorption bands in the visible and near-infrared correspond to the other electric transitions expected for [5]Ni. The existence of these [5]Ni sites has been confirmed by complementary Ni K-edge extended X-ray absorption fine structure (EXAFS) and X-ray absorption near edge structure (XANES) spectroscopy and neutron diffraction coupled with isotopic substitution.
            </p>

            <p>
              Optical transitions from <span className="text-purple-300 font-semibold">tetrahedral Ni²⁺</span> are present as a minority contribution in most optical absorption spectra of Ni-bearing silicate, aluminosilicate, and borosilicate glasses, with the noticeable exception of low-alkali borate or borosilicate compositions.
            </p>

            <p>
              In glasses containing large alkalis (K, Rb, Cs), [4]Ni²⁺ causes a <span className="text-blue-300 font-semibold">blue/purple coloration</span> through the presence of an intense absorption band located near 16,000 cm⁻¹, in the red region of the visible spectrum, and a transmission window at short wavelengths. This chemical dependence of glass coloration reflects the fundamental relationship between local atomic structure and optical properties.
            </p>
          </div>
        </div>

        {/* Image 1: Nickel Coordination Spectra */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-amber-400">Nickel Coordination Spectra in Borosilicate Glass</h3>
          <p className="text-stone-300">
            This chart shows the optical absorption spectra for three different coordination states of Ni²⁺. Each coordination geometry produces a distinct absorption band at different wavenumbers, directly determining the color observed:
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
              <span className="text-purple-300 font-semibold">[4]Ni (Tetrahedral):</span> Highest energy absorption (~15,000–21,000 cm⁻¹). Produces purple coloration in large-alkali glasses.
            </div>
            <div>
              <span className="text-amber-500 font-semibold">[5]Ni (Penta-coordinated):</span> Intermediate energy (~19,000–25,000 cm⁻¹). Produces brown coloration through broad, shifted peak.
            </div>
            <div>
              <span className="text-green-400 font-semibold">[6]Ni (Octahedral):</span> Lowest energy absorption ({'>'}23,000 cm⁻¹). Produces green coloration with weak absorption in visible range.
            </div>
          </div>
        </div>

        {/* Image 2: Coordination Structure Diagram */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-amber-400">Coordination Geometry and Wavenumber Correlation</h3>
          <p className="text-stone-300">
            This diagram illustrates the three-stage progression of nickel coordination in borosilicate glass, showing how the geometric arrangement of atoms around the central Ni²⁺ ion directly correlates with the wavenumber of light absorption:
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
              <p className="font-semibold text-amber-300 mb-2">Stage 1: Tetrahedral [4]Ni</p>
              <p>Four oxygen atoms arranged in a tetrahedral geometry around Ni²⁺. This compact arrangement results in the highest energy (shortest wavelength) absorption, producing purple/blue colors.</p>
            </div>
            <div>
              <p className="font-semibold text-amber-300 mb-2">Stage 2: Penta-coordinated [5]Ni</p>
              <p>Five oxygen atoms in a triangular bipyramidal arrangement. This intermediate geometry produces the characteristic brown color through absorption around 22,500 cm⁻¹ (444 nm).</p>
            </div>
            <div>
              <p className="font-semibold text-amber-300 mb-2">Stage 3: Octahedral [6]Ni</p>
              <p>Six oxygen atoms in an octahedral geometry. This expanded arrangement results in the lowest energy absorption, producing light green colors characteristic of crystalline nickel compounds.</p>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="border-l-4 border-amber-500 pl-6 py-4">
          <h3 className="text-2xl font-bold text-amber-400 mb-4">Key Insights for Glass Artists</h3>
          <ul className="space-y-3 text-stone-300">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-1">•</span>
              <span><span className="font-semibold">Local structure determines color:</span> The same element (Ni²⁺) produces completely different colors depending on its coordination environment and the glass composition.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-1">•</span>
              <span><span className="font-semibold">Alkali content matters:</span> Large alkali ions (K, Rb, Cs) favor tetrahedral coordination and blue/purple colors, while small alkalis (Na, Li) and alkaline earths (Ca) favor other geometries and brown/yellow colors.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-1">•</span>
              <span><span className="font-semibold">Crystalline vs. glassy:</span> The same chemical composition produces different colors in crystalline and amorphous forms due to different coordination geometries.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-1">•</span>
              <span><span className="font-semibold">Predictability:</span> Understanding coordination chemistry allows prediction of color shifts based on glass composition changes.</span>
            </li>
          </ul>
        </div>

        {/* Redox Equilibria and Glass Coloration */}
        <div className="border-l-4 border-amber-500 pl-6">
          <h2 className="text-3xl font-bold text-amber-400 mb-2">Redox Equilibria and Glass Coloration</h2>
          <p className="text-stone-300 text-sm mb-6">How oxidation states and redox reactions control color formation and permanence in borosilicate glass</p>
        </div>

        {/* Redox Content */}
        <div className="bg-stone-800/50 backdrop-blur rounded-lg p-8 border border-stone-700/50">
          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              The influence of the <span className="font-semibold">redox state</span> on glass color has been extensively investigated. For instance, <span className="text-yellow-300 font-semibold">chromium-bearing glasses</span> show a dramatic change in color from <span className="text-green-300 font-semibold">green to yellow</span> when melting conditions vary from reducing to oxidizing. This color shift is due to the formation of a <span className="text-yellow-400 font-semibold">chromate complex (CrO₄)²⁻</span> that produces a charge-transfer transition from oxygen to chromium located near 28,000 cm⁻¹ in oxidized glasses.
            </p>

            <p>
              The tail of this intense absorption band extends from the ultraviolet into the visible spectrum, superimposing on the Cr³⁺ absorption bands. There is a considerable difference between the molar extinction coefficients of Cr³⁺ and Cr⁶⁺, which are <span className="text-amber-300 font-semibold">18–20 and 4,200 l/(cm/mol)</span>, respectively. As a result, optical spectroscopy measurements of the chromium redox state cannot be made on glasses containing relatively high concentrations of Cr⁶⁺. Wet chemical analysis or other spectroscopic methods must be performed instead.
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
                <p className="font-semibold text-amber-300">Linear Absorbance Spectra of Chromium Oxidation States</p>
                <p>
                  This spectral comparison shows the linear absorbance of Cr³⁺ and (CrO₄)²⁻ in soda-lime-silica (SCN) and sodium borosilicate (SBN and SBNox) glasses. The <span className="text-purple-300 font-semibold">Cr³⁺ absorption peak</span> appears around 15,000 cm⁻¹ (purple region), while the <span className="text-yellow-300 font-semibold">Cr⁶⁺ charge-transfer band</span> dominates near 28,000 cm⁻¹ (ultraviolet-visible boundary). The dramatic difference in peak heights illustrates why Cr⁶⁺ completely masks Cr³⁺ in optical measurements despite their distinct absorption regions.
                </p>
              </div>
            </div>

            <p>
              The interaction between <span className="font-semibold">redox pairs</span> is widely exploited during glass fining. Manganese has traditionally been known as the <span className="text-amber-400 font-semibold">"glassmaker's soap"</span> because, when added to soda-lime-silica glass in the form of an oxide such as MnO₂, it reduces the green color arising from iron impurities by oxidizing Fe²⁺ into Fe³⁺:
            </p>

            <div className="bg-stone-900/50 rounded-lg p-4 border-l-2 border-amber-500 my-4 font-mono text-sm text-amber-200">
              <p>Mn⁴⁺ + 2 Fe²⁺ → Mn²⁺ + 2 Fe³⁺</p>
            </div>

            <p>
              Because only <span className="font-semibold">spin-forbidden transitions</span> are associated with the d⁵ configuration of both Mn²⁺ and Fe³⁺, their low absorption intensities result in <span className="text-stone-400 font-semibold">weakly colored glasses</span>. However, this effect is not permanent. Interaction with sunlight (a process called <span className="text-amber-400 font-semibold">solarization</span>) favors the reverse reactions:
            </p>

            <div className="bg-stone-900/50 rounded-lg p-4 border-l-2 border-amber-500 my-4 font-mono text-sm text-amber-200">
              <p>Mn²⁺ + hν → Mn³⁺ + e⁻</p>
              <p>Fe³⁺ + e⁻ → Fe²⁺</p>
            </div>

            <p>
              As illustrated by old windows and doorknobs that have turned purple over centuries of exposure, this phenomenon is at the origin of the well-known <span className="text-purple-300 font-semibold">purple glass</span>, of which <span className="text-purple-400 font-semibold">desert amethyst glass</span> is a natural variety. This color change demonstrates how redox chemistry and light exposure interact to create dynamic, time-dependent color shifts in glass—a critical consideration for artists working with historically significant or light-sensitive compositions.
            </p>
          </div>
        </div>

        {/* Thermochromism Section */}
        <div className="mt-12 space-y-6">
          <div className="border-l-4 border-amber-500 pl-6">
            <h3 className="text-2xl font-bold text-amber-300 mb-2">Temperature Dependence of Optical Absorption: Thermochromism</h3>
            <p className="text-stone-400 text-sm italic">How heating induces dramatic color changes in transition metal-bearing glasses</p>
          </div>

          <div className="bg-stone-800/50 backdrop-blur rounded-lg p-8 border border-stone-700/50">
            <div className="space-y-6 text-stone-200 leading-relaxed">
              <p>
                Color changes in glasses can be <span className="font-semibold text-amber-300">spectacular upon heating</span>. For example, <span className="text-blue-300 font-semibold">brown nickel-bearing glasses</span> turn <span className="text-green-300 font-semibold">blue or green</span>, while <span className="text-yellow-300 font-semibold">chromium-bearing glasses shift to yellow</span>. This phenomenon, called <span className="font-semibold">thermochromism</span>, arises from temperature-induced changes in the coordination environment and site populations of transition metal ions.
              </p>

              <p>
                Like chemical dependence of glass coloration, there is a marked difference between transition elements depending on whether they occupy <span className="font-semibold">one or several sites</span>. When multiple sites exist, temperature modifies the equilibrium between site populations. When a single site is occupied, the site itself expands with increasing temperature, altering the ligand field and thus the optical absorption spectrum. Because high-temperature optical absorption spectra are difficult to record, most data comes from investigations below the glass transition temperature (Tg). However, important modifications of optical spectra may occur in the molten state, which are not yet fully characterized.
              </p>

              <div className="bg-stone-900/50 rounded-lg p-6 border-l-2 border-blue-500 my-4">
                <p className="font-semibold text-blue-300 mb-3">Coexistence of Well-Defined Sites: Ni²⁺ as a Case Study</p>
                <p className="text-sm text-stone-300 space-y-3">
                  <span className="block">In potassium triborate glass, Ni²⁺ is distributed between 4- and 5-coordination states, similar to most oxide glasses. Major changes occur near Tg, above which the proportion of <span className="text-blue-300 font-semibold">[4]Ni²⁺ increases</span>. This is likely related to temperature-induced coordination changes of boron:</span>
                  <span className="block font-mono text-amber-200 mt-2">Na<sup>CC</sup> + BO₄⁻ ⇌ BO₃ + O<sup>NBO</sup> + Na<sup>NM</sup></span>
                  <span className="block text-xs text-stone-400 mt-1">where Na<sup>CC</sup> = charge-compensating Na, Na<sup>NM</sup> = network-modifying Na, O<sup>NBO</sup> = non-bridging oxygen</span>
                </p>
              </div>

              <p>
                The <span className="text-blue-300 font-semibold">[4]B to [3]B conversion</span> between glass and melt increases alkali activity and provides further charge compensation for <span className="text-blue-300 font-semibold">[4]Ni</span>, inducing the coordination change. In some borate compositions, the [4]Ni/[5]Ni ratio is <span className="font-semibold">not frozen at Tg</span> because these two states are separated by unusually small energy barriers, allowing continued ionic mobility even as the polymeric network becomes rigid.
              </p>

              <p>
                The modification of Ni²⁺ and Co²⁺ speciation at high temperature can be <span className="font-semibold">retained after fast quenching</span>. In Co- and Ni-bearing alkali borosilicate glasses, the 4-coordinated species favored at high temperature are partly retained at room temperature by rapid cooling. This demonstrates the critical importance of <span className="text-amber-300 font-semibold">thermal history on glass structure</span>—a principle that directly impacts how flameworkers must cool their pieces to achieve desired color effects.
              </p>
            </div>
          </div>
        </div>

        {/* Phase Separation Section */}
        <div className="mt-12 space-y-6">
          <div className="border-l-4 border-amber-500 pl-6">
            <h3 className="text-2xl font-bold text-amber-300 mb-2">Phase Separation in Glass Melts: Controlling Immiscibility</h3>
            <p className="text-stone-400 text-sm italic">How borosilicate glass separates into distinct phases and how composition controls this critical phenomenon</p>
          </div>

          <div className="bg-stone-800/50 backdrop-blur rounded-lg p-8 border border-stone-700/50">
            <div className="space-y-6 text-stone-200 leading-relaxed">
              <p>
                In physics and chemistry, the word <span className="font-semibold">"phase"</span> refers to a region of a material that is chemically uniform and physically distinct. <span className="font-semibold">Phase separation</span>, which typically occurs in liquids, is where a homogeneous mixture separates into two or more of these phases. For example, a mixture of water and oil at room temperature will naturally "phase separate" into a distinct phase consisting of pure oil, and another consisting of pure water. We can say that such a mixture is <span className="text-amber-300 font-semibold">"immiscible."</span>
              </p>

              <p>
                The <span className="font-semibold">morphology of this phase separation</span> can vary depending on the relative concentration of both components. If the mixture is predominantly water, the oil phase will take the form of distinct (or <span className="text-cyan-300 font-semibold">"discontinuous"</span>) droplets dispersed throughout an interconnected (or <span className="text-purple-300 font-semibold">"continuous"</span>) water phase. If the mixture is predominantly oil, the opposite will take place. At roughly equal proportions of oil and water, each phase will tend to be <span className="font-semibold">continuous</span>.
              </p>

              <p>
                <span className="font-semibold">Phase separation commonly occurs in glass melts.</span> Borosilicate glass—which contains both silica and borate as network formers—is a well-studied example. Unlike simple immiscible liquids (like water and oil), phases in glass melts are not necessarily chemically pure. Borosilicate glass, for example, will typically undergo phase separation into a <span className="text-blue-300 font-semibold">"borate-rich" phase</span> and a <span className="text-amber-300 font-semibold">"silica-rich" phase</span>, with both phases containing different proportions of each network former.
              </p>

              <p>
                The <span className="font-semibold">morphology of separated phases</span> in glass can vary significantly. While it is possible for droplet-like phases to form via classical nucleation and growth, spontaneous <span className="text-purple-300 font-semibold">"spinodal" phase separation</span> can result in the formation of intertwined tendril-like continuous phases. This phase separation, which occurs at high temperatures in the molten glass, persists and <span className="font-semibold">"freezes in"</span> when the glass is cooled into a solid.
              </p>

              <p>
                If both phases are vitrifiable, they may form glasses after cooling (called a <span className="text-green-300 font-semibold">glass-glass phase separation</span>). However, if one phase is prone to crystallization, the mixture can cool into a <span className="text-amber-400 font-semibold">glass-crystal phase-separated solid</span>. Phase separation in glasses was long seen as undesirable—and for many applications, it still is. The existence of different phases modifies the physico-chemical properties of glass melts, making it difficult to mold and reducing the quality of the final glass.
              </p>

              <p>
                The physics of phase separation in glass-forming materials is complex, and even today the specifics are subject to intense debate. However, glass manufacturers have determined ways of avoiding or minimizing phase separation during glass manufacturing. Typically, this is achieved by <span className="font-semibold">tailoring the composition of glass melts</span>, with phase separation only occurring for specific compositions.
              </p>
            </div>
          </div>

          {/* Ternary Phase Diagram */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-amber-400">Ternary Phase Diagram: Na₂O–B₂O₃–SiO₂ System</h3>
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
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-amber-400">Phase Separation Morphologies: Spinodal vs. Nucleation</h3>
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
          <div className="border-l-4 border-amber-500 pl-6 py-4">
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Controlling Phase Separation</h3>
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
      </div>

      {/* Amber Glass Series Section */}
      <div className="max-w-6xl mx-auto space-y-12 mb-12">
        {/* Title */}
        <div className="border-l-4 border-amber-500 pl-6">
          <h2 className="text-3xl font-bold text-amber-400 mb-2">Iron and Sulfur Coloration: The Amber Glass Series</h2>
          <p className="text-stone-300 text-sm">Compositional Analysis and Visual Spectrum of Soda-Lime Glasses</p>
        </div>

        {/* Main Content */}
        <div className="bg-stone-800/50 backdrop-blur rounded-lg p-8 border border-stone-700/50">
          <div className="space-y-6 text-stone-200 leading-relaxed">
            <p>
              All glasses, even the colorless ones, contain Fe and S. Glass coloration increases from pale-yellow (Amber1) to brown (Amber8). These soda-lime glasses have a similar base glass composition and mostly differ by their sulfur content. The compositions of the commercial glasses were obtained by electron probe microanalysis (EPMA) using a Cameca electron microprobe SX-5 at the CAMPARIS platform (Sorbonne Université, Paris). The following standards were used for quantification: albite (Na), garnet (Mg, Si, Ca), orthoclase (Al, K), baryte (S), hematite (Fe). The acceleration voltage was set to 25 kV, and a defocused beam of 15 µm was used to minimize alkali losses. About 10 analytical points were measured in order to take into account possible heterogeneities of the glasses. The average dispersion of the data was evaluated at 0.1%. The average chemical composition values obtained are presented in the composition table below.
            </p>
          </div>
        </div>

        {/* Composition Table Image */}
        <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
          <img 
            src="/manus-storage/ambertable_15f1d048.png" 
            alt="Chemical compositions of amber glass samples" 
            className="w-full h-auto object-contain"
          />
          <p className="text-stone-400 text-sm mt-4 text-center italic">
            Chemical compositions of the glasses, as measured by electron microprobe and averaged over 10 measurement points. Note the increasing sulfur content (SO₃) correlating with darker amber coloration.
          </p>
        </div>

        {/* Spectrum Image */}
        <div className="bg-stone-900 rounded-lg overflow-hidden border border-stone-700/50 p-4">
          <img 
            src="/manus-storage/amberspectrum_2b59b923.png" 
            alt="Macroscopic picture of amber glass samples" 
            className="w-full h-auto object-contain"
          />
          <p className="text-stone-400 text-sm mt-4 text-center italic">
            Macroscopic picture of amber glass samples. Amber1, the lightest amber glass, appears pale yellow, and Amber8, the darkest, is brown. The progression demonstrates how iron and sulfur content creates a continuous color spectrum from nearly colorless to deep brown.
          </p>
        </div>
      </div>

      {/* Thermochromism Simulator */}
      <div className="max-w-6xl mx-auto mt-12 mb-12">
        <ThermochromismSimulator />
      </div>
    </div>
  );
}
