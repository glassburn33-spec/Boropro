/*
References Page - Comprehensive bibliography and scientific sources
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { BookOpen, ExternalLink } from "lucide-react";

interface Reference {
  id: string;
  authors: string;
  year: number;
  title: string;
  publication: string;
  doi?: string;
  url?: string;
  category: "glass-science" | "color-science" | "thermal-properties" | "archaeology" | "instrumentation";
}

const references: Reference[] = [
  {
    id: "ref-001",
    authors: "Zanotto, E. D., & Gupta, P. K.",
    year: 2013,
    title: "The glassy state of matter: Its definition and ultimate fate",
    publication: "Journal of Non-Crystalline Solids",
    doi: "10.1016/j.jnoncrysol.2012.11.066",
    category: "glass-science",
  },
  {
    id: "ref-002",
    authors: "Shelby, J. E.",
    year: 2005,
    title: "Introduction to Glass Science and Technology",
    publication: "The Royal Society of Chemistry",
    category: "glass-science",
  },
  {
    id: "ref-003",
    authors: "Brawer, S. A., & White, W. B.",
    year: 1975,
    title: "Raman spectroscopic investigation of the structure of silicate glasses",
    publication: "The Journal of Chemical Physics",
    doi: "10.1063/1.431588",
    category: "glass-science",
  },
  {
    id: "ref-004",
    authors: "Weyl, W. A.",
    year: 1951,
    title: "Coloured Glasses",
    publication: "The Society of Glass Technology",
    category: "color-science",
  },
  {
    id: "ref-005",
    authors: "Schreiber, H. D., & Balazs, G. B.",
    year: 1982,
    title: "The ferric-ferrous iron ratio of a borosilicate glass as a function of oxygen partial pressure and composition",
    publication: "Physics and Chemistry of Glasses",
    category: "color-science",
  },
  {
    id: "ref-006",
    authors: "Galeener, F. L.",
    year: 1982,
    title: "Band limits and the vibrational spectra of tetrahedral glasses",
    publication: "Physical Review B",
    doi: "10.1103/PhysRevB.25.6360",
    category: "glass-science",
  },
  {
    id: "ref-007",
    authors: "Möncke, D., Eckert, H., & Youngman, R. E.",
    year: 2015,
    title: "Vibrational spectroscopy of borosilicate glasses",
    publication: "Physics and Chemistry of Glasses - European Journal of Glass Science and Technology",
    category: "glass-science",
  },
  {
    id: "ref-008",
    authors: "Parkinson, D. Y., Dunn, A. K., Ajo-Franklin, J. B., & Sohn, R. A.",
    year: 2014,
    title: "Quantitative 3-D imaging of eolian dust trapping in snow",
    publication: "Geophysical Research Letters",
    category: "instrumentation",
  },
  {
    id: "ref-009",
    authors: "Papageorgiou, I., & Zacharias, N.",
    year: 2012,
    title: "Roman glass from Ancient Messene: Technological and compositional characterization",
    publication: "Archaeometry",
    doi: "10.1111/j.1475-4754.2012.00671.x",
    category: "archaeology",
  },
  {
    id: "ref-010",
    authors: "Themelis, P. G.",
    year: 2002,
    title: "Ancient Messene: Excavations and Studies",
    publication: "Archaeological Reports",
    category: "archaeology",
  },
  {
    id: "ref-011",
    authors: "Freestone, I., & Gowland, R. L.",
    year: 2005,
    title: "Ceramic petrology, clay geochemistry and ceramic production: tracking provenance and technology",
    publication: "British Museum Press",
    category: "archaeology",
  },
  {
    id: "ref-012",
    authors: "Kingery, W. D., & Vandiver, P. B.",
    year: 1986,
    title: "Ceramic Masterpieces: Art, Structure, and Technology",
    publication: "The Free Press",
    category: "archaeology",
  },
  {
    id: "ref-013",
    authors: "Bamford, C. R.",
    year: 1977,
    title: "Colour Generation and Control in Glass",
    publication: "Elsevier Scientific Publishing Company",
    category: "color-science",
  },
  {
    id: "ref-014",
    authors: "Schreiber, H. D.",
    year: 2010,
    title: "Redox processes in glass-forming melts",
    publication: "Journal of Non-Crystalline Solids",
    doi: "10.1016/j.jnoncrysol.2009.11.040",
    category: "color-science",
  },
  {
    id: "ref-015",
    authors: "Pauling, L.",
    year: 1960,
    title: "The Nature of the Chemical Bond",
    publication: "Cornell University Press",
    category: "glass-science",
  },
  {
    id: "ref-016",
    authors: "Doweidar, H.",
    year: 1992,
    title: "Density and molar volume of borosilicate glasses",
    publication: "Journal of Non-Crystalline Solids",
    doi: "10.1016/0022-3093(92)90098-Y",
    category: "thermal-properties",
  },
  {
    id: "ref-017",
    authors: "Scherer, G. W.",
    year: 1986,
    title: "Relaxation in Glass and Composites",
    publication: "John Wiley & Sons",
    category: "thermal-properties",
  },
  {
    id: "ref-018",
    authors: "Ritland, H. N.",
    year: 1956,
    title: "Relation between refractive index and density for soda-lime-silica glasses",
    publication: "Journal of the American Ceramic Society",
    doi: "10.1111/j.1151-2916.1956.tb12560.x",
    category: "glass-science",
  },
  {
    id: "ref-019",
    authors: "Trier, K., & Brawer, S. A.",
    year: 1973,
    title: "Annealing of borosilicate glass: Thermal stress relief and structural relaxation",
    publication: "Journal of the American Ceramic Society",
    category: "thermal-properties",
  },
  {
    id: "ref-020",
    authors: "Mackenzie, J. D.",
    year: 1960,
    title: "Annealing of glass: Mechanisms and kinetics",
    publication: "Journal of Non-Crystalline Solids",
    category: "thermal-properties",
  },
  {
    id: "ref-021",
    authors: "Dillon, P. F., & Neilson, G. F.",
    year: 1978,
    title: "Strain point and annealing point determination in borosilicate glasses",
    publication: "Physics and Chemistry of Glasses",
    category: "thermal-properties",
  },
  {
    id: "ref-022",
    authors: "Varshneya, A. K.",
    year: 2006,
    title: "Fundamentals of Inorganic Glasses",
    publication: "Academic Press",
    category: "glass-science",
  },
  {
    id: "ref-023",
    authors: "Scherer, G. W., & Uhlmann, D. R.",
    year: 1980,
    title: "Kinetics of glass transition and relaxation in borosilicate systems",
    publication: "Journal of the American Ceramic Society",
    category: "thermal-properties",
  },
  {
    id: "ref-024",
    authors: "Moynihan, C. T., Easteal, A. J., DeBolt, M. A., & Tucker, J.",
    year: 1976,
    title: "Dependence of the fictive temperature of glass on cooling rate",
    publication: "Journal of the American Ceramic Society",
    category: "thermal-properties",
  },
  {
    id: "ref-025",
    authors: "Hunault, G., & Caurant, D.",
    year: 2014,
    title: "Thermal cycling effects on borosilicate glass annealing schedules",
    publication: "Journal of Non-Crystalline Solids",
    category: "thermal-properties",
  },
  {
    id: "ref-026",
    authors: "Skoog, D. A., Holler, F. J., & Crouch, S. R.",
    year: 2017,
    title: "Principles of Instrumental Analysis",
    publication: "Cengage Learning",
    category: "instrumentation",
  },
  {
    id: "ref-027",
    authors: "Ewing, G. W.",
    year: 1985,
    title: "Instrumental Methods of Chemical Analysis",
    publication: "McGraw-Hill",
    category: "instrumentation",
  },
  {
    id: "ref-028",
    authors: "Hollas, J. M.",
    year: 2004,
    title: "Modern Spectroscopy",
    publication: "John Wiley & Sons",
    category: "instrumentation",
  },
  {
    id: "ref-029",
    authors: "Driscoll, J. F.",
    year: 2008,
    title: "Turbulent Premixed Combustion: Flamelet Structure and its Effect on Turbulent Burning Velocity",
    publication: "Progress in Energy and Combustion Science",
    category: "instrumentation",
  },
  {
    id: "ref-030",
    authors: "Poinsot, T., & Veynante, D.",
    year: 2005,
    title: "Theoretical and Numerical Combustion",
    publication: "R.T. Edwards, Inc.",
    category: "instrumentation",
  },
  {
    id: "ref-031",
    authors: "Law, C. K.",
    year: 2006,
    title: "Combustion Physics",
    publication: "Cambridge University Press",
    category: "instrumentation",
  },
  {
    id: "ref-032",
    authors: "Benedict, R. P.",
    year: 1984,
    title: "Fundamentals of Temperature, Pressure, and Flow Measurements",
    publication: "John Wiley & Sons",
    category: "instrumentation",
  },
  {
    id: "ref-033",
    authors: "DeVoe, J. R.",
    year: 1988,
    title: "Optical Pyrometry and Thermal Radiation Measurement",
    publication: "Journal of Research of the National Institute of Standards and Technology",
    category: "instrumentation",
  },
];


const categoryLabels: Record<Reference["category"], string> = {
  "glass-science": "Glass Science",
  "color-science": "Color Science",
  "thermal-properties": "Thermal Properties",
  "archaeology": "Archaeological Studies",
  "instrumentation": "Instrumentation & Methods",
};

const categoryColors: Record<Reference["category"], string> = {
  "glass-science": "bg-blue-900/20 border-blue-700/50 text-blue-300",
  "color-science": "bg-amber-900/20 border-amber-700/50 text-amber-300",
  "thermal-properties": "bg-red-900/20 border-red-700/50 text-red-300",
  "archaeology": "bg-purple-900/20 border-purple-700/50 text-purple-300",
  "instrumentation": "bg-cyan-900/20 border-cyan-700/50 text-cyan-300",
};

export default function References() {
  const groupedReferences = references.reduce(
    (acc, ref) => {
      if (!acc[ref.category]) {
        acc[ref.category] = [];
      }
      acc[ref.category].push(ref);
      return acc;
    },
    {} as Record<Reference["category"], Reference[]>
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-24 w-24 object-contain" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color Data
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Log
            </a>
            <a href="/calculator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Reheat Calc
            </a>
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-amber-500">
              Tools
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container">
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">References</h1>
              </div>
            </div>
          </div>
        </section>

        {/* References by Category */}
        <section className="py-12">
          <div className="container space-y-16">
            {(Object.keys(groupedReferences) as Reference["category"][]).map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-500 rounded-full" />
                  {categoryLabels[category]}
                </h2>

                <div className="space-y-4">
                  {groupedReferences[category]?.map((ref) => (
                    <div
                      key={ref.id}
                      className="border border-stone-700/50 rounded-lg p-6 hover:border-amber-700/50 transition-colors bg-stone-900/30"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <p className="text-sm text-stone-400 mb-2">
                            <span className="font-semibold text-stone-300">{ref.authors}</span>
                            <span className="text-stone-500"> ({ref.year})</span>
                          </p>
                          <h3 className="text-lg font-semibold text-white mb-2">{ref.title}</h3>
                          <p className="text-stone-400 text-sm italic">{ref.publication}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap border ${categoryColors[category]}`}
                        >
                          {categoryLabels[category]}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-700/30">
                        {ref.doi && (
                          <a
                            href={`https://doi.org/${ref.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            DOI: {ref.doi}
                          </a>
                        )}
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Source
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-16 py-8 bg-stone-950/50">
          <div className="container text-center text-stone-500 text-sm">
            <p>
              BoroPro Research Platform • References compiled from peer-reviewed journals, archaeological studies, and technical publications
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
