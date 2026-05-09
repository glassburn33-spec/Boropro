import React from 'react';
import { X } from 'lucide-react';
import { dragonTearsV2, dragonTearsColorBehaviorTable } from '@/data/dragonTearsV2';

interface DragonTearsInfoPanelProps {
  onClose: () => void;
}

export const DragonTearsInfoPanel: React.FC<DragonTearsInfoPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-900/30">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-amber-900/30 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-400">{dragonTearsV2.name}</h2>
            <p className="text-sm text-gray-400 mt-1">by {dragonTearsV2.manufacturer}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Official Product Description */}
          <section>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">Product Description</h3>
            <p className="text-gray-300 italic border-l-4 border-amber-500 pl-4 py-2 bg-gray-800/30 rounded">
              "{dragonTearsV2.productDescription}"
            </p>
          </section>

          {/* Working Tips */}
          <section>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">Working Tips</h3>
            <div className="bg-gray-800/30 rounded p-4 border border-gray-700">
              <p className="text-gray-300 mb-3">
                <span className="font-semibold text-amber-300">Flame Control:</span> {dragonTearsV2.workingTip}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-amber-300">Kiln Behavior:</span> {dragonTearsV2.kilnNote}
              </p>
            </div>
          </section>

          {/* Key Characteristics */}
          <section>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">Key Characteristics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/30 rounded p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Transparency</p>
                <p className="text-amber-300 mt-2">Remains transparent throughout all phases</p>
              </div>
              <div className="bg-gray-800/30 rounded p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Reactivity</p>
                <p className="text-amber-300 mt-2">Highly reactive to both temperature and flame atmosphere</p>
              </div>
              <div className="bg-gray-800/30 rounded p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Silver Effects</p>
                <p className="text-amber-300 mt-2">Develops dramatic silver fuming in reducing conditions</p>
              </div>
              <div className="bg-gray-800/30 rounded p-4 border border-gray-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Base Color</p>
                <p className="text-amber-300 mt-2">Deep cobalt blue remains stable during kiln</p>
              </div>
            </div>
          </section>

          {/* Color Behavior Table */}
          <section>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">Color Behavior Reference Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700">
                    <th className="text-left px-3 py-2 text-amber-400 font-semibold">Phase</th>
                    <th className="text-left px-3 py-2 text-amber-400 font-semibold">Flame Type</th>
                    <th className="text-left px-3 py-2 text-amber-400 font-semibold">Temp Range</th>
                    <th className="text-left px-3 py-2 text-amber-400 font-semibold">Base Hue</th>
                    <th className="text-left px-3 py-2 text-amber-400 font-semibold">Silver Effect</th>
                    <th className="text-left px-3 py-2 text-amber-400 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {dragonTearsColorBehaviorTable.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-700 ${idx % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/20'}`}
                    >
                      <td className="px-3 py-2 text-gray-300">{row.phase}</td>
                      <td className="px-3 py-2 text-gray-300">{row.flameType}</td>
                      <td className="px-3 py-2 text-gray-300">{row.tempRange}</td>
                      <td className="px-3 py-2 text-amber-300 font-medium">{row.baseHue}</td>
                      <td className="px-3 py-2 text-gray-300">{row.silverEffect}</td>
                      <td className="px-3 py-2 text-gray-400 text-xs">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Usage Recommendations */}
          <section>
            <h3 className="text-lg font-semibold text-amber-400 mb-3">Usage Recommendations</h3>
            <div className="space-y-3">
              <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-blue-400">For Stable Color:</span> Work in a neutral flame to maintain the base blue color with minimal silver effects.
                </p>
              </div>
              <div className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-green-400">For Maximum Effects:</span> Use a slightly reducing flame to bring silver effects to the surface and achieve dramatic color shifts.
                </p>
              </div>
              <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-amber-400">For Peak Reactivity:</span> Apply a reducing flame at high working temperatures to achieve full silver fuming and maximum color complexity.
                </p>
              </div>
              <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-red-400">Avoid Over-working:</span> Excessive heat will cause silver effects to burn off and the color to fade toward pale. Long kiln times will darken the effects but leave the base color unchanged.
                </p>
              </div>
            </div>
          </section>

          {/* Data Attribution */}
          <section className="bg-gray-800/30 rounded p-4 border border-gray-700">
            <p className="text-xs text-gray-400">
              <span className="font-semibold">Data Source:</span> Product description and working tips from Glass Alchemy official documentation. Color behavior data compiled from manufacturer specifications and empirical observations of Dragon Tears v2 in various flame conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
