/*
Annealing Profile Editor Component
Interactive tool for creating custom borosilicate glass heat treatment profiles
with 4-stage temperature curve visualization and schedule logging
*/

import { useState, useMemo } from 'react';
import { AlertCircle, Download, Save } from 'lucide-react';

interface StageInputs {
  stage1: {
    startTemp: number;
    targetTemp: number;
    duration: number;
  };
  stage2: {
    holdTemp: number;
    duration: number;
  };
  stage3: {
    startTemp: number;
    endTemp: number;
    duration: number;
  };
  stage4: {
    startTemp: number;
    endTemp: number;
    duration: number;
  };
}

interface ReferenceLines {
  annealingPoint: number;
  strainPoint: number;
}

export default function AnealingProfileEditor() {
  const [title, setTitle] = useState('Borosilicate Glass Heat Treatment Profile');
  
  const [inputs, setInputs] = useState<StageInputs>({
    stage1: { startTemp: 20, targetTemp: 620, duration: 30 },
    stage2: { holdTemp: 620, duration: 20 },
    stage3: { startTemp: 620, endTemp: 480, duration: 60 },
    stage4: { startTemp: 480, endTemp: 20, duration: 45 },
  });

  const [referenceLines, setReferenceLines] = useState<ReferenceLines>({
    annealingPoint: 565,
    strainPoint: 510,
  });

  const [savedSchedules, setSavedSchedules] = useState<Array<{ name: string; timestamp: string; data: StageInputs }>>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [scheduleName, setScheduleName] = useState('');

  // Auto-populate stage 3 start temp from stage 2 hold temp
  const handleStage2Change = (field: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      stage2: { ...prev.stage2, [field]: value },
      stage3: { ...prev.stage3, startTemp: field === 'holdTemp' ? value : prev.stage3.startTemp }
    }));
  };

  // Auto-populate stage 4 start temp from stage 3 end temp
  const handleStage3Change = (field: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      stage3: { ...prev.stage3, [field]: value },
      stage4: { ...prev.stage4, startTemp: field === 'endTemp' ? value : prev.stage4.startTemp }
    }));
  };

  // Validation: Stage 1 target must exceed annealing point
  const stage1Warning = inputs.stage1.targetTemp <= referenceLines.annealingPoint;

  // Calculate cumulative times for x-axis
  const cumulativeTimes = useMemo(() => {
    return [
      0,
      inputs.stage1.duration,
      inputs.stage1.duration + inputs.stage2.duration,
      inputs.stage1.duration + inputs.stage2.duration + inputs.stage3.duration,
      inputs.stage1.duration + inputs.stage2.duration + inputs.stage3.duration + inputs.stage4.duration,
    ];
  }, [inputs]);

  // Generate plot data points
  const plotData = useMemo(() => {
    const points = [
      { time: cumulativeTimes[0], temp: inputs.stage1.startTemp, stage: 1 },
      { time: cumulativeTimes[1], temp: inputs.stage1.targetTemp, stage: 2 },
      { time: cumulativeTimes[2], temp: inputs.stage2.holdTemp, stage: 2 },
      { time: cumulativeTimes[3], temp: inputs.stage3.endTemp, stage: 3 },
      { time: cumulativeTimes[4], temp: inputs.stage4.endTemp, stage: 4 },
    ];
    return points;
  }, [inputs, cumulativeTimes]);

  const maxTemp = Math.max(inputs.stage1.targetTemp, inputs.stage2.holdTemp) + 50;
  const maxTime = cumulativeTimes[4];

  // SVG Plot Generation
  const plotSvg = useMemo(() => {
    const width = 800;
    const height = 500;
    const margin = { top: 60, right: 100, bottom: 60, left: 80 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const scaleX = (time: number) => (time / maxTime) * plotWidth;
    const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

    const stageColors = ['#dc2626', '#ea580c', '#22c55e', '#3b82f6'];
    const stageNames = ['Rapid reheating', 'Dwell – equalization', 'Slow cooling', 'More rapid cooling'];

    // Generate filled regions for each stage
    const regions = [
      {
        x1: scaleX(cumulativeTimes[0]),
        x2: scaleX(cumulativeTimes[1]),
        color: stageColors[0],
        stage: 1,
      },
      {
        x1: scaleX(cumulativeTimes[1]),
        x2: scaleX(cumulativeTimes[2]),
        color: stageColors[1],
        stage: 2,
      },
      {
        x1: scaleX(cumulativeTimes[2]),
        x2: scaleX(cumulativeTimes[3]),
        color: stageColors[2],
        stage: 3,
      },
      {
        x1: scaleX(cumulativeTimes[3]),
        x2: scaleX(cumulativeTimes[4]),
        color: stageColors[3],
        stage: 4,
      },
    ];

    // Build path for temperature curve
    let pathD = `M ${margin.left + scaleX(plotData[0].time)} ${margin.top + scaleY(plotData[0].temp)}`;
    for (let i = 1; i < plotData.length; i++) {
      pathD += ` L ${margin.left + scaleX(plotData[i].time)} ${margin.top + scaleY(plotData[i].temp)}`;
    }

    return (
      <svg width={width} height={height} className="w-full border border-stone-600 rounded-lg bg-stone-900">
        {/* Background */}
        <rect width={width} height={height} fill="#1c1917" />

        {/* Gridlines */}
        {[0, 100, 200, 300, 400, 500].map((temp) => (
          <line
            key={`grid-y-${temp}`}
            x1={margin.left}
            y1={margin.top + scaleY(temp)}
            x2={margin.left + plotWidth}
            y2={margin.top + scaleY(temp)}
            stroke="#404040"
            strokeDasharray="4"
            strokeWidth="1"
          />
        ))}

        {/* Stage regions */}
        {regions.map((region) => (
          <rect
            key={`region-${region.stage}`}
            x={margin.left + region.x1}
            y={margin.top}
            width={region.x2 - region.x1}
            height={plotHeight}
            fill={region.color}
            opacity="0.2"
          />
        ))}

        {/* Reference lines */}
        <line
          x1={margin.left}
          y1={margin.top + scaleY(referenceLines.annealingPoint)}
          x2={margin.left + plotWidth}
          y2={margin.top + scaleY(referenceLines.annealingPoint)}
          stroke="#60a5fa"
          strokeDasharray="4"
          strokeWidth="2"
        />
        <line
          x1={margin.left}
          y1={margin.top + scaleY(referenceLines.strainPoint)}
          x2={margin.left + plotWidth}
          y2={margin.top + scaleY(referenceLines.strainPoint)}
          stroke="#60a5fa"
          strokeDasharray="4"
          strokeWidth="2"
        />

        {/* Temperature curve */}
        <path d={pathD} stroke="#fbbf24" strokeWidth="3" fill="none" />

        {/* Vertical stage separators */}
        {cumulativeTimes.slice(1, -1).map((time) => (
          <line
            key={`separator-${time}`}
            x1={margin.left + scaleX(time)}
            y1={margin.top}
            x2={margin.left + scaleX(time)}
            y2={margin.top + plotHeight}
            stroke="#666"
            strokeDasharray="2"
            strokeWidth="1"
          />
        ))}

        {/* Stage labels (circled numbers) */}
        {regions.map((region, idx) => (
          <g key={`label-${idx}`}>
            <circle
              cx={margin.left + (region.x1 + region.x2) / 2}
              cy={margin.top - 20}
              r="16"
              fill="none"
              stroke={stageColors[idx]}
              strokeWidth="2"
            />
            <text
              x={margin.left + (region.x1 + region.x2) / 2}
              y={margin.top - 14}
              textAnchor="middle"
              fill={stageColors[idx]}
              fontSize="14"
              fontWeight="bold"
            >
              {idx + 1}
            </text>
          </g>
        ))}

        {/* Reference line labels */}
        <text x={margin.left + plotWidth + 10} y={margin.top + scaleY(referenceLines.annealingPoint) + 4} fill="#60a5fa" fontSize="12">
          Annealing point
        </text>
        <text x={margin.left + plotWidth + 10} y={margin.top + scaleY(referenceLines.strainPoint) + 4} fill="#60a5fa" fontSize="12">
          Strain point
        </text>

        {/* Axes */}
        <line x1={margin.left} y1={margin.top + plotHeight} x2={margin.left + plotWidth} y2={margin.top + plotHeight} stroke="#999" strokeWidth="2" />
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotHeight} stroke="#999" strokeWidth="2" />

        {/* Axis labels */}
        <text x={margin.left + plotWidth / 2} y={height - 10} textAnchor="middle" fill="#999" fontSize="12">
          Time →
        </text>
        <text x={20} y={margin.top + plotHeight / 2} textAnchor="middle" fill="#999" fontSize="12" transform={`rotate(-90 20 ${margin.top + plotHeight / 2})`}>
          Temperature (°C)
        </text>

        {/* Y-axis ticks and labels */}
        {[0, 100, 200, 300, 400, 500, 600].map((temp) => (
          <g key={`tick-${temp}`}>
            <line x1={margin.left - 5} y1={margin.top + scaleY(temp)} x2={margin.left} y2={margin.top + scaleY(temp)} stroke="#999" strokeWidth="1" />
            <text x={margin.left - 10} y={margin.top + scaleY(temp) + 4} textAnchor="end" fill="#999" fontSize="11">
              {temp}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g>
          {stageNames.map((name, idx) => (
            <g key={`legend-${idx}`}>
              <rect x={margin.left + 20} y={height - 40 + idx * 18} width={12} height={12} fill={stageColors[idx]} opacity="0.7" />
              <text x={margin.left + 38} y={height - 32 + idx * 18} fill="#999" fontSize="11">
                {idx + 1} = {name}
              </text>
            </g>
          ))}
        </g>

        {/* Title */}
        <text x={width / 2} y={30} textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">
          {title}
        </text>
      </svg>
    );
  }, [inputs, referenceLines, cumulativeTimes, plotData, title, maxTemp, maxTime]);

  const handleSaveSchedule = () => {
    if (scheduleName.trim()) {
      setSavedSchedules(prev => [...prev, {
        name: scheduleName,
        timestamp: new Date().toLocaleString(),
        data: inputs,
      }]);
      setScheduleName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="space-y-8 bg-stone-900/50 p-8 rounded-lg border border-stone-700">
      {/* Title Editor */}
      <div>
        <label className="block text-sm font-semibold text-amber-300 mb-2">Profile Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-stone-800 border border-stone-600 rounded px-4 py-2 text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Stage 1: Rapid Reheating */}
      <div className="bg-red-900/20 border border-red-700/50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-red-400 mb-4">Stage 1: Rapid Reheating to T {'>'}  T_anneal</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-stone-300 mb-2">Start Temperature (°C)</label>
            <input
              type="number"
              value={inputs.stage1.startTemp}
              onChange={(e) => setInputs(prev => ({ ...prev, stage1: { ...prev.stage1, startTemp: Number(e.target.value) } }))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">Target Temperature (°C)</label>
            <input
              type="number"
              value={inputs.stage1.targetTemp}
              onChange={(e) => setInputs(prev => ({ ...prev, stage1: { ...prev.stage1, targetTemp: Number(e.target.value) } }))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={inputs.stage1.duration}
              onChange={(e) => setInputs(prev => ({ ...prev, stage1: { ...prev.stage1, duration: Number(e.target.value) } }))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
        {stage1Warning && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Target temperature must exceed annealing point ({referenceLines.annealingPoint}°C)</span>
          </div>
        )}
      </div>

      {/* Stage 2: Dwell */}
      <div className="bg-orange-900/20 border border-orange-700/50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-orange-400 mb-4">Stage 2: Dwell – Equalization of Temperature</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-stone-300 mb-2">Hold Temperature (°C)</label>
            <input
              type="number"
              value={inputs.stage2.holdTemp}
              onChange={(e) => handleStage2Change('holdTemp', Number(e.target.value))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={inputs.stage2.duration}
              onChange={(e) => handleStage2Change('duration', Number(e.target.value))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Stage 3: Slow Cooling */}
      <div className="bg-green-900/20 border border-green-700/50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-green-400 mb-4">Stage 3: Slow Cooling</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-stone-300 mb-2">Start Temperature (°C)</label>
            <input
              type="number"
              value={inputs.stage3.startTemp}
              disabled
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-stone-500 cursor-not-allowed"
              title="Auto-populated from Stage 2 hold temperature"
            />
            <p className="text-xs text-stone-500 mt-1">Auto-populated</p>
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">End Temperature (°C)</label>
            <input
              type="number"
              value={inputs.stage3.endTemp}
              onChange={(e) => handleStage3Change('endTemp', Number(e.target.value))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={inputs.stage3.duration}
              onChange={(e) => handleStage3Change('duration', Number(e.target.value))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Stage 4: More Rapid Cooling */}
      <div className="bg-blue-900/20 border border-blue-700/50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-400 mb-4">Stage 4: More Rapid Cooling</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-stone-300 mb-2">Start Temperature (°C)</label>
            <input
              type="number"
              value={inputs.stage4.startTemp}
              disabled
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-stone-500 cursor-not-allowed"
              title="Auto-populated from Stage 3 end temperature"
            />
            <p className="text-xs text-stone-500 mt-1">Auto-populated</p>
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">End Temperature (°C)</label>
            <input
              type="number"
              value={inputs.stage4.endTemp}
              onChange={(e) => setInputs(prev => ({ ...prev, stage4: { ...prev.stage4, endTemp: Number(e.target.value) } }))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={inputs.stage4.duration}
              onChange={(e) => setInputs(prev => ({ ...prev, stage4: { ...prev.stage4, duration: Number(e.target.value) } }))}
              className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Reference Lines */}
      <div className="bg-stone-800/50 border border-stone-600 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-300 mb-4">Reference Lines</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-stone-300 mb-2">Annealing Point (°C)</label>
            <input
              type="number"
              value={referenceLines.annealingPoint}
              onChange={(e) => setReferenceLines(prev => ({ ...prev, annealingPoint: Number(e.target.value) }))}
              className="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-300 mb-2">Strain Point (°C)</label>
            <input
              type="number"
              value={referenceLines.strainPoint}
              onChange={(e) => setReferenceLines(prev => ({ ...prev, strainPoint: Number(e.target.value) }))}
              className="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Plot */}
      <div className="flex justify-center">
        {plotSvg}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Schedule
        </button>
        <button
          onClick={() => {
            const svg = document.querySelector('svg');
            if (svg) {
              const link = document.createElement('a');
              link.href = 'data:image/svg+xml;base64,' + btoa(svg.outerHTML);
              link.download = `${title.replace(/\s+/g, '_')}.svg`;
              link.click();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Plot
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="bg-stone-800 border border-stone-600 p-6 rounded-lg">
          <h4 className="text-lg font-bold text-white mb-4">Save Schedule</h4>
          <input
            type="text"
            placeholder="Enter schedule name"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:border-amber-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveSchedule}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Saved Schedules */}
      {savedSchedules.length > 0 && (
        <div className="bg-stone-800/50 border border-stone-600 p-6 rounded-lg">
          <h4 className="text-lg font-bold text-amber-300 mb-4">Saved Schedules</h4>
          <div className="space-y-2">
            {savedSchedules.map((schedule, idx) => (
              <div key={idx} className="flex justify-between items-center bg-stone-700/50 p-3 rounded">
                <div>
                  <p className="text-white font-semibold">{schedule.name}</p>
                  <p className="text-xs text-stone-400">{schedule.timestamp}</p>
                </div>
                <button
                  onClick={() => setInputs(schedule.data)}
                  className="px-3 py-1 bg-stone-600 hover:bg-stone-500 text-white text-sm rounded transition-colors"
                >
                  Load
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
