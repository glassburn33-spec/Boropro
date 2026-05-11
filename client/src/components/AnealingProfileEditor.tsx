/*
Annealing Profile Editor Component
Interactive tool for creating custom borosilicate glass heat treatment profiles
with 4-stage temperature curve visualization and schedule logging
*/

import { useState, useMemo } from 'react';
import { AlertCircle, Download, Save } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { generateKilnLogPDF, pdfToBase64, generateAnealingSchedulePDF } from '@/lib/pdfUtils';
import type { KilnLogPDFData, AnealingSchedulePDFData } from '@/lib/pdfUtils';
import { ColorWheelPicker } from './ColorWheelPicker';
import { ColoredGlassJar } from './ColoredGlassJar';
import { renderColoredJarToCanvas } from '@/lib/jarRenderer';

// Helper function to get color name from hex
function getColorNameFromHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Convert RGB to HSL to get hue
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let hue = 0;
  
  if (max === min) {
    hue = 0;
  } else if (max === rNorm) {
    hue = ((gNorm - bNorm) / (max - min)) * 60;
    if (hue < 0) hue += 360;
  } else if (max === gNorm) {
    hue = ((bNorm - rNorm) / (max - min)) * 60 + 120;
  } else {
    hue = ((rNorm - gNorm) / (max - min)) * 60 + 240;
  }
  
  // Get color name from hue
  if (hue >= 0 && hue < 15) return 'Red';
  if (hue >= 15 && hue < 45) return 'Orange';
  if (hue >= 45 && hue < 65) return 'Yellow';
  if (hue >= 65 && hue < 150) return 'Green';
  if (hue >= 150 && hue < 200) return 'Cyan';
  if (hue >= 200 && hue < 260) return 'Blue';
  if (hue >= 260 && hue < 290) return 'Purple';
  if (hue >= 290 && hue < 330) return 'Magenta';
  return 'Red';
}

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

interface SavedSchedule {
  id: string;
  name: string;
  timestamp: string;
  data: StageInputs;
  notes: string;
  results: string;
  selectedColors: string[];
}

// Helper function to generate plot SVG from schedule data
function generatePlotSVG(scheduleData: StageInputs, scheduleName: string, refLines: ReferenceLines): SVGSVGElement {
  const width = 1000;
  const height = 600;
  const margin = { top: 80, right: 80, bottom: 120, left: 70 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Calculate cumulative times
  const cumulativeTimes = [
    0,
    scheduleData.stage1.duration,
    scheduleData.stage1.duration + scheduleData.stage2.duration,
    scheduleData.stage1.duration + scheduleData.stage2.duration + scheduleData.stage3.duration,
    scheduleData.stage1.duration + scheduleData.stage2.duration + scheduleData.stage3.duration + scheduleData.stage4.duration,
  ];

  // Calculate plot data points
  const plotData = [
    { time: cumulativeTimes[0], temp: scheduleData.stage1.startTemp },
    { time: cumulativeTimes[1], temp: scheduleData.stage1.targetTemp },
    { time: cumulativeTimes[2], temp: scheduleData.stage2.holdTemp },
    { time: cumulativeTimes[3], temp: scheduleData.stage3.endTemp },
    { time: cumulativeTimes[4], temp: scheduleData.stage4.endTemp },
  ];

  const maxTemp = Math.max(scheduleData.stage1.targetTemp, scheduleData.stage2.holdTemp) + 50;
  const maxTime = cumulativeTimes[4];

  const titleFontSize = Math.max(14, Math.min(20, width / 50));
  const labelFontSize = Math.max(10, Math.min(14, width / 80));
  const tickFontSize = Math.max(9, Math.min(12, width / 100));

  const scaleX = (time: number) => (time / maxTime) * plotWidth;
  const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

  const stageColors = ['#dc2626', '#ea580c', '#22c55e', '#3b82f6'];
  const stageNames = ['Rapid reheating', 'Dwell – equalization', 'Slow cooling', 'More rapid cooling'];

  // Build path for temperature curve
  let pathD = `M ${margin.left + scaleX(plotData[0].time)} ${margin.top + scaleY(plotData[0].temp)}`;
  for (let i = 1; i < plotData.length; i++) {
    pathD += ` L ${margin.left + scaleX(plotData[i].time)} ${margin.top + scaleY(plotData[i].temp)}`;
  }

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('style', 'background-color: #1c1917;');

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', width.toString());
  bg.setAttribute('height', height.toString());
  bg.setAttribute('fill', '#1c1917');
  svg.appendChild(bg);

  // Gridlines
  for (let temp = 0; temp <= 500; temp += 100) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', margin.left.toString());
    line.setAttribute('y1', (margin.top + scaleY(temp)).toString());
    line.setAttribute('x2', (margin.left + plotWidth).toString());
    line.setAttribute('y2', (margin.top + scaleY(temp)).toString());
    line.setAttribute('stroke', '#404040');
    line.setAttribute('stroke-dasharray', '4');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }

  // Stage regions
  const regions = [
    { x1: scaleX(cumulativeTimes[0]), x2: scaleX(cumulativeTimes[1]), color: stageColors[0], stage: 1 },
    { x1: scaleX(cumulativeTimes[1]), x2: scaleX(cumulativeTimes[2]), color: stageColors[1], stage: 2 },
    { x1: scaleX(cumulativeTimes[2]), x2: scaleX(cumulativeTimes[3]), color: stageColors[2], stage: 3 },
    { x1: scaleX(cumulativeTimes[3]), x2: scaleX(cumulativeTimes[4]), color: stageColors[3], stage: 4 },
  ];

  regions.forEach((region) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', (margin.left + region.x1).toString());
    rect.setAttribute('y', margin.top.toString());
    rect.setAttribute('width', (region.x2 - region.x1).toString());
    rect.setAttribute('height', plotHeight.toString());
    rect.setAttribute('fill', region.color);
    rect.setAttribute('opacity', '0.2');
    svg.appendChild(rect);
  });

  // Vertical stage separators
  for (let i = 1; i < cumulativeTimes.length - 1; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', (margin.left + scaleX(cumulativeTimes[i])).toString());
    line.setAttribute('y1', margin.top.toString());
    line.setAttribute('x2', (margin.left + scaleX(cumulativeTimes[i])).toString());
    line.setAttribute('y2', (margin.top + plotHeight).toString());
    line.setAttribute('stroke', '#666');
    line.setAttribute('stroke-dasharray', '2');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }

  // Stage labels (circled numbers)
  regions.forEach((region, idx) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', (margin.left + (region.x1 + region.x2) / 2).toString());
    circle.setAttribute('cy', (margin.top - 30).toString());
    circle.setAttribute('r', Math.max(12, titleFontSize - 2).toString());
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', stageColors[idx]);
    circle.setAttribute('stroke-width', '2');
    g.appendChild(circle);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (margin.left + (region.x1 + region.x2) / 2).toString());
    text.setAttribute('y', (margin.top - 22).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', stageColors[idx]);
    text.setAttribute('font-size', (titleFontSize - 4).toString());
    text.setAttribute('font-weight', 'bold');
    text.textContent = (idx + 1).toString();
    g.appendChild(text);
    
    svg.appendChild(g);
  });

  // Reference lines
  const annealingLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  annealingLine.setAttribute('x1', margin.left.toString());
  annealingLine.setAttribute('y1', (margin.top + scaleY(refLines.annealingPoint)).toString());
  annealingLine.setAttribute('x2', (margin.left + plotWidth).toString());
  annealingLine.setAttribute('y2', (margin.top + scaleY(refLines.annealingPoint)).toString());
  annealingLine.setAttribute('stroke', '#60a5fa');
  annealingLine.setAttribute('stroke-dasharray', '4');
  annealingLine.setAttribute('stroke-width', '2');
  svg.appendChild(annealingLine);

  const strainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  strainLine.setAttribute('x1', margin.left.toString());
  strainLine.setAttribute('y1', (margin.top + scaleY(refLines.strainPoint)).toString());
  strainLine.setAttribute('x2', (margin.left + plotWidth).toString());
  strainLine.setAttribute('y2', (margin.top + scaleY(refLines.strainPoint)).toString());
  strainLine.setAttribute('stroke', '#60a5fa');
  strainLine.setAttribute('stroke-dasharray', '4');
  strainLine.setAttribute('stroke-width', '2');
  svg.appendChild(strainLine);

  // Reference line labels
  const labelX = Math.min(margin.left + plotWidth + 8, width - 120);
  const annealingY = Math.max(margin.top + 15, Math.min(margin.top + scaleY(refLines.annealingPoint) + 4, height - 10));
  const strainY = Math.max(margin.top + 15, Math.min(margin.top + scaleY(refLines.strainPoint) + 4, height - 10));
  
  const annealingLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  annealingLabel.setAttribute('x', labelX.toString());
  annealingLabel.setAttribute('y', annealingY.toString());
  annealingLabel.setAttribute('fill', '#fbbf24');
  annealingLabel.setAttribute('font-size', Math.max(8, labelFontSize - 1).toString());
  annealingLabel.textContent = 'Annealing point';
  svg.appendChild(annealingLabel);
  
  const strainLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  strainLabel.setAttribute('x', labelX.toString());
  strainLabel.setAttribute('y', strainY.toString());
  strainLabel.setAttribute('fill', '#fbbf24');
  strainLabel.setAttribute('font-size', Math.max(8, labelFontSize - 1).toString());
  strainLabel.textContent = 'Strain point';
  svg.appendChild(strainLabel);

  // Temperature curve
  const curve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  curve.setAttribute('d', pathD);
  curve.setAttribute('stroke', '#fbbf24');
  curve.setAttribute('stroke-width', '3');
  curve.setAttribute('fill', 'none');
  svg.appendChild(curve);

  // Axes
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', margin.left.toString());
  xAxis.setAttribute('y1', (margin.top + plotHeight).toString());
  xAxis.setAttribute('x2', (margin.left + plotWidth).toString());
  xAxis.setAttribute('y2', (margin.top + plotHeight).toString());
  xAxis.setAttribute('stroke', '#999');
  xAxis.setAttribute('stroke-width', '2');
  svg.appendChild(xAxis);

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', margin.left.toString());
  yAxis.setAttribute('y1', margin.top.toString());
  yAxis.setAttribute('x2', margin.left.toString());
  yAxis.setAttribute('y2', (margin.top + plotHeight).toString());
  yAxis.setAttribute('stroke', '#999');
  yAxis.setAttribute('stroke-width', '2');
  svg.appendChild(yAxis);

  // Axis labels
  const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xLabel.setAttribute('x', (margin.left + plotWidth / 2).toString());
  xLabel.setAttribute('y', (height - 20).toString());
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('fill', '#999');
  xLabel.setAttribute('font-size', labelFontSize.toString());
  xLabel.textContent = 'Time →';
  svg.appendChild(xLabel);

  const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yLabel.setAttribute('x', '15');
  yLabel.setAttribute('y', (margin.top + plotHeight / 2).toString());
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('fill', '#999');
  yLabel.setAttribute('font-size', Math.max(9, labelFontSize - 1).toString());
  yLabel.setAttribute('transform', `rotate(-90 15 ${margin.top + plotHeight / 2})`);
  yLabel.textContent = 'Temp (°C)';
  svg.appendChild(yLabel);

  // Y-axis ticks and labels
  const tempStep = maxTemp > 600 ? 100 : 50;
  for (let i = 0; i <= maxTemp; i += tempStep) {
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', (margin.left - 5).toString());
    tick.setAttribute('y1', (margin.top + scaleY(i)).toString());
    tick.setAttribute('x2', margin.left.toString());
    tick.setAttribute('y2', (margin.top + scaleY(i)).toString());
    tick.setAttribute('stroke', '#999');
    tick.setAttribute('stroke-width', '1');
    svg.appendChild(tick);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', (margin.left - 15).toString());
    label.setAttribute('y', (margin.top + scaleY(i) + 4).toString());
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('fill', '#999');
    label.setAttribute('font-size', tickFontSize.toString());
    label.textContent = `${i}°C`;
    svg.appendChild(label);
  }

  // X-axis time markers
  cumulativeTimes.forEach((time) => {
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', (margin.left + scaleX(time)).toString());
    tick.setAttribute('y1', (margin.top + plotHeight).toString());
    tick.setAttribute('x2', (margin.left + scaleX(time)).toString());
    tick.setAttribute('y2', (margin.top + plotHeight + 5).toString());
    tick.setAttribute('stroke', '#999');
    tick.setAttribute('stroke-width', '1');
    svg.appendChild(tick);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', (margin.left + scaleX(time)).toString());
    label.setAttribute('y', (margin.top + plotHeight + 20).toString());
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#999');
    label.setAttribute('font-size', tickFontSize.toString());
    label.textContent = `${time} min`;
    svg.appendChild(label);
  });

  // Title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', (width / 2).toString());
  title.setAttribute('y', (titleFontSize - 5).toString());
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('fill', '#fbbf24');
  title.setAttribute('font-size', titleFontSize.toString());
  title.setAttribute('font-weight', 'bold');
  title.textContent = scheduleName;
  svg.appendChild(title);

  // Legend
  stageNames.forEach((name, idx) => {
    const legendItemHeight = labelFontSize + 6;
    const legendBoxSize = Math.max(10, labelFontSize - 2);
    const legendStartX = margin.left + 25;
    const legendStartY = margin.top + plotHeight + 35;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', legendStartX.toString());
    rect.setAttribute('y', (legendStartY + idx * legendItemHeight).toString());
    rect.setAttribute('width', legendBoxSize.toString());
    rect.setAttribute('height', legendBoxSize.toString());
    rect.setAttribute('fill', stageColors[idx]);
    rect.setAttribute('opacity', '0.7');
    g.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (legendStartX + 15).toString());
    text.setAttribute('y', (legendStartY + 9 + idx * legendItemHeight).toString());
    text.setAttribute('fill', '#999');
    text.setAttribute('font-size', labelFontSize.toString());
    text.textContent = `${idx + 1} = ${name}`;
    g.appendChild(text);

    svg.appendChild(g);
  });

  return svg;
}

export default function AnealingProfileEditor() {

  
  // tRPC mutation for saving to PDF library
  const saveGeneratedMutation = trpc.pdfLibrary.saveGenerated.useMutation();
  
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

  const [notes, setNotes] = useState('');
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingResults, setEditingResults] = useState('');
  const [editingColors, setEditingColors] = useState<string[]>([]);
  const [colorWheelHue, setColorWheelHue] = useState(0);
  const title = 'Heat Treatment Profile';

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

  // Calculate maxTemp with minimal padding to fit plot better
  const maxTemp = Math.max(inputs.stage1.targetTemp, inputs.stage2.holdTemp) + 20;
  const maxTime = cumulativeTimes[4];

  // SVG Plot Generation
  const plotSvg = useMemo(() => {
    const width = 1000;
    const height = 600;
    // Optimized margins to give more space to the plot
    const margin = { top: 70, right: 60, bottom: 110, left: 70 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Dynamic text sizing based on plot dimensions
    const titleFontSize = Math.max(14, Math.min(20, width / 50));
    const labelFontSize = Math.max(10, Math.min(14, width / 80));
    const tickFontSize = Math.max(9, Math.min(12, width / 100));

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
      <svg width="100%" height="600" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="border border-stone-600 rounded-lg bg-stone-900" style={{ minHeight: '400px' }}>
        {/* Background */}
        <rect width={width} height={height} fill="#1c1917" />

        {/* Gridlines - dynamically scaled */}
        {(() => {
          const tempStep = maxTemp > 600 ? 100 : 50;
          const gridTemps = [];
          for (let i = 0; i <= maxTemp; i += tempStep) {
            gridTemps.push(i);
          }
          return gridTemps.map((temp) => (
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
          ));
        })()}

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
              cy={margin.top - 30}
              r={Math.max(12, titleFontSize - 2)}
              fill="none"
              stroke={stageColors[idx]}
              strokeWidth="2"
            />
            <text
              x={margin.left + (region.x1 + region.x2) / 2}
              y={margin.top - 22}
              textAnchor="middle"
              fill={stageColors[idx]}
              fontSize={titleFontSize - 4}
              fontWeight="bold"
            >
              {idx + 1}
            </text>
          </g>
        ))}

        {/* Reference line labels - positioned to fit in window */}
        {(() => {
          const labelX = Math.min(margin.left + plotWidth + 8, width - 120);
          const annealingY = Math.max(margin.top + 15, Math.min(margin.top + scaleY(referenceLines.annealingPoint) + 4, height - 10));
          const strainY = Math.max(margin.top + 15, Math.min(margin.top + scaleY(referenceLines.strainPoint) + 4, height - 10));
          return (
            <>
              <text x={labelX} y={annealingY} fill="#fbbf24" fontSize={Math.max(8, labelFontSize - 1)}>
                Annealing point
              </text>
              <text x={labelX} y={strainY} fill="#fbbf24" fontSize={Math.max(8, labelFontSize - 1)}>
                Strain point
              </text>
            </>
          );
        })()}

        {/* Axes */}
        <line x1={margin.left} y1={margin.top + plotHeight} x2={margin.left + plotWidth} y2={margin.top + plotHeight} stroke="#999" strokeWidth="2" />
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotHeight} stroke="#999" strokeWidth="2" />

        {/* Axis labels */}
        <text x={margin.left + plotWidth / 2} y={height - 20} textAnchor="middle" fill="#999" fontSize={labelFontSize}>
          Time →
        </text>
        <text x={15} y={margin.top + plotHeight / 2} textAnchor="middle" fill="#999" fontSize={Math.max(9, labelFontSize - 1)} transform={`rotate(-90 15 ${margin.top + plotHeight / 2})`}>
          Temp (°C)
        </text>

        {/* Y-axis ticks and labels - dynamically scaled */}
        {(() => {
          // Calculate optimal temperature step based on plot height
          const tempStep = (() => {
            if (maxTemp > 700) return 100;
            if (maxTemp > 500) return 50;
            if (maxTemp > 300) return 25;
            return 10;
          })();
          
          const tempMarkers: number[] = [];
          for (let i = 0; i <= maxTemp; i += tempStep) {
            tempMarkers.push(i);
          }
          
          // Calculate label spacing to avoid overlaps
          const minLabelSpacing = 35; // minimum pixels between labels
          const filteredMarkers = tempMarkers.filter((temp, idx) => {
            if (idx === 0 || idx === tempMarkers.length - 1) return true; // always show first and last
            const y1 = margin.top + scaleY(temp);
            const y2 = margin.top + scaleY(tempMarkers[idx - 1]);
            return Math.abs(y1 - y2) >= minLabelSpacing;
          });
          
          return filteredMarkers.map((temp) => (
            <g key={`tick-${temp}`}>
              <line x1={margin.left - 5} y1={margin.top + scaleY(temp)} x2={margin.left} y2={margin.top + scaleY(temp)} stroke="#999" strokeWidth="1" />
              <text x={margin.left - 15} y={margin.top + scaleY(temp) + 4} textAnchor="end" fill="#999" fontSize={Math.max(8, tickFontSize - 1)}>
                {temp}°C
              </text>
            </g>
          ));
        })()}

        {/* X-axis time markers */}
        {cumulativeTimes.map((time, idx) => (
          <g key={`time-marker-${idx}`}>
            <line x1={margin.left + scaleX(time)} y1={margin.top + plotHeight} x2={margin.left + scaleX(time)} y2={margin.top + plotHeight + 5} stroke="#999" strokeWidth="1" />
            <text x={margin.left + scaleX(time)} y={margin.top + plotHeight + 20} textAnchor="middle" fill="#999" fontSize={tickFontSize}>
              {time} min
            </text>
          </g>
        ))}

        {/* Title */}
        <text x={width / 2} y={titleFontSize - 5} textAnchor="middle" fill="#fbbf24" fontSize={titleFontSize} fontWeight="bold">
          {title}
        </text>

        {/* Legend */}
        <g>
          {stageNames.map((name, idx) => {
            const legendItemHeight = labelFontSize + 6;
            const legendBoxSize = Math.max(10, labelFontSize - 2);
            const legendStartX = margin.left + 25;
            const legendStartY = margin.top + plotHeight + 35;
            return (
              <g key={`legend-${idx}`}>
                <rect x={legendStartX} y={legendStartY + idx * legendItemHeight} width={legendBoxSize} height={legendBoxSize} fill={stageColors[idx]} opacity="0.7" />
                <text x={legendStartX + 15} y={legendStartY + 9 + idx * legendItemHeight} fill="#999" fontSize={labelFontSize}>
                  {idx + 1} = {name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }, [inputs, referenceLines, cumulativeTimes, plotData, title, maxTemp, maxTime]);

  const handleSaveSchedule = () => {
    if (scheduleName.trim()) {
      const newSchedule = {
        id: Date.now().toString(),
        name: scheduleName,
        timestamp: new Date().toLocaleString(),
        data: inputs,
        notes: notes,
        results: '',
        selectedColors: [],
      };
      
      setSavedSchedules(prev => [...prev, newSchedule]);
      
      setScheduleName('');
      setNotes('');
      setShowSaveDialog(false);
    }
  };

  const handleEditSchedule = (schedule: SavedSchedule) => {
    setEditingScheduleId(schedule.id);
    setEditingNotes(schedule.notes);
    setEditingResults(schedule.results);
    setEditingColors(schedule.selectedColors || []);
  };

  const handleSaveEdit = (id: string) => {
    setSavedSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, notes: editingNotes, results: editingResults, selectedColors: editingColors } : s
    ));
    setEditingScheduleId(null);
    setEditingNotes('');
    setEditingResults('');
  };

  const handleDeleteSchedule = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this schedule? This action cannot be undone.');
    if (!confirmed) return;
    
    setSavedSchedules(prev => prev.filter(s => s.id !== id));
  };



  return (
    <div className="space-y-8 bg-stone-900/50 p-8 rounded-lg border border-stone-700">


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
        <h3 className="text-lg font-bold text-blue-400 mb-4">Reference Lines</h3>
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

      {/* Notes Section */}
      <div className="bg-stone-800/50 border border-stone-600 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-amber-300 mb-4">📝 Materials & Cycle Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Record materials used, glass type, thickness, color, kiln model, observations, or any other relevant details for this annealing cycle..."
          className="w-full bg-stone-700 border border-stone-600 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-500 resize-none h-24"
        />
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
          onClick={async () => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageHeight = pdf.internal.pageSize.getHeight();
            const pageWidth = pdf.internal.pageSize.getWidth();
            let yPosition = 10;

            // Add title
            pdf.setFontSize(16);
            (pdf as any).setFont(undefined, 'bold');
            pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            // Add timestamp
            pdf.setFontSize(10);
            (pdf as any).setFont(undefined, 'normal');
            const timestamp = new Date().toLocaleString();
            pdf.text(`Generated: ${timestamp}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 8;

            // Add separator line
            pdf.setDrawColor(180, 140, 80);
            pdf.line(10, yPosition, pageWidth - 10, yPosition);
            yPosition += 5;

            // Add plot - capture current plot window snapshot
            const svg = document.querySelector('svg');
            if (svg) {
              try {
                // Capture the SVG plot with current heat treatment profile settings
                const canvas = await html2canvas(svg as unknown as HTMLElement, {
                  backgroundColor: '#1c1410',
                  scale: 2,
                  logging: false,
                  useCORS: true,
                  allowTaint: true,
                });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - 20;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                if (yPosition + imgHeight > pageHeight - 20) {
                  pdf.addPage();
                  yPosition = 10;
                }
                
                pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 8;
              } catch (error) {
                console.error('Error converting plot to image:', error);
                // Add fallback text if image capture fails
                pdf.setFontSize(10);
                (pdf as any).setFont(undefined, 'normal');
                pdf.text('Plot image could not be captured. Profile data:', 10, yPosition);
                yPosition += 5;
              }
            }

            // Add materials & notes
            if (notes) {
              if (yPosition + 30 > pageHeight - 10) {
                pdf.addPage();
                yPosition = 10;
              }
              
              pdf.setFontSize(12);
              (pdf as any).setFont(undefined, 'bold');
              pdf.text('Materials & Notes:', 10, yPosition);
              yPosition += 6;
              
              pdf.setFontSize(10);
              (pdf as any).setFont(undefined, 'normal');
              const notesLines = (pdf as any).splitTextToSize(notes, pageWidth - 20);
              (pdf as any).text(notesLines, 10, yPosition);
              yPosition += notesLines.length * 5 + 5;
            }

            // Add results
            const schedule = savedSchedules.find(s => s.data === inputs);
            if (schedule && schedule.results) {
              if (yPosition + 30 > pageHeight - 10) {
                pdf.addPage();
                yPosition = 10;
              }
              
              pdf.setFontSize(12);
              (pdf as any).setFont(undefined, 'bold');
              pdf.text('Results & Observations:', 10, yPosition);
              yPosition += 6;
              
              pdf.setFontSize(10);
              (pdf as any).setFont(undefined, 'normal');
              const resultsLines = (pdf as any).splitTextToSize(schedule.results, pageWidth - 20);
              (pdf as any).text(resultsLines, 10, yPosition);
            }

            // Save PDF and upload to storage
            const pdfBlob = pdf.output('blob');
            const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            
            // Create FormData for upload
            const formData = new FormData();
            formData.append('file', pdfBlob, fileName);
            
            // Upload to storage
            try {
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log('PDF uploaded successfully:', data.url);
                // Show success toast
                alert(`Plot exported successfully! File: ${fileName}`);
              } else {
                console.error('Upload failed:', response.statusText);
                // Fallback to local download
                pdf.save(fileName);
              }
            } catch (error) {
              console.error('Upload error:', error);
              // Fallback to local download
              pdf.save(fileName);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Plot
        </button>
      </div>

      {/* Saved Schedules */}
      <div className="bg-stone-800/50 border border-stone-600 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-amber-300 mb-4">📋 Saved Schedules</h3>
        <div className="bg-amber-900/30 border border-amber-700/50 p-3 rounded mb-4">
          <p className="text-sm text-amber-200">💡 Save your schedules before leaving the page</p>
        </div>
        {savedSchedules.length === 0 ? (
          <p className="text-stone-400">No saved schedules yet. Save your first profile above!</p>
        ) : (
          <div className="space-y-4">
            {savedSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-stone-700/50 border border-stone-600 p-4 rounded-lg">
                {editingScheduleId === schedule.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-amber-300 mb-2">Materials & Notes</label>
                      <textarea
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-amber-300 mb-2">Results & Observations</label>
                      <textarea
                        value={editingResults}
                        onChange={(e) => setEditingResults(e.target.value)}
                        placeholder="Record actual results, color outcomes, any issues encountered, temperature readings, etc."
                        className="w-full bg-stone-800 border border-stone-600 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 resize-none h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-amber-300 mb-3">Glass Colors Used</label>
                      <div className="bg-stone-900/50 border border-stone-700 rounded p-4">
                        <ColorWheelPicker
                          selectedColors={editingColors}
                          onAddColor={(color) => setEditingColors(prev => [...prev, color])}
                          onRemoveColor={(color) => setEditingColors(prev => prev.filter(c => c !== color))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(schedule.id)}
                        className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-semibold text-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingScheduleId(null)}
                        className="px-4 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-amber-300">{schedule.name}</h4>
                        <p className="text-xs text-stone-400">{schedule.timestamp}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={async () => {
                            const pdf = new jsPDF('p', 'mm', 'a4');
                            const pageHeight = pdf.internal.pageSize.getHeight();
                            const pageWidth = pdf.internal.pageSize.getWidth();
                            let yPosition = 10;

                            // Add black background to entire page
                            pdf.setFillColor(0, 0, 0);
                            pdf.rect(0, 0, pageWidth, pageHeight, 'F');

                            // Set text color to yellow for all text
                            pdf.setTextColor(255, 187, 36);

                            // Add title
                            pdf.setFontSize(16);
                            (pdf as any).setFont(undefined, 'bold');
                            pdf.text(schedule.name, pageWidth / 2, yPosition, { align: 'center' });
                            yPosition += 10;

                            // Add timestamp
                            pdf.setFontSize(10);
                            (pdf as any).setFont(undefined, 'normal');
                            pdf.text(`Saved: ${schedule.timestamp}`, pageWidth / 2, yPosition, { align: 'center' });
                            yPosition += 8;

                            // Add separator line in yellow
                            pdf.setDrawColor(255, 187, 36);
                            pdf.line(10, yPosition, pageWidth - 10, yPosition);
                            yPosition += 5;

                            // Generate and capture plot SVG for this schedule
                            try {
                              // Create a temporary SVG element with the schedule data
                              const tempSvgContainer = document.createElement('div');
                              tempSvgContainer.style.position = 'absolute';
                              tempSvgContainer.style.left = '-9999px';
                              tempSvgContainer.style.top = '-9999px';
                              tempSvgContainer.style.width = '800px';
                              tempSvgContainer.style.height = '500px';
                              document.body.appendChild(tempSvgContainer);

                              // Create SVG with schedule data
                              const svgElement = generatePlotSVG(schedule.data, schedule.name, referenceLines);
                              tempSvgContainer.appendChild(svgElement);

                              // Capture the SVG as PNG image
                              const canvas = document.createElement('canvas');
                              const ctx = canvas.getContext('2d');
                              if (!ctx) throw new Error('Could not get canvas context');

                              // Set canvas size for high quality
                              canvas.width = 1600;
                              canvas.height = 960;

                              // Draw background
                              ctx.fillStyle = '#1c1917';
                              ctx.fillRect(0, 0, canvas.width, canvas.height);

                              // Serialize SVG to string and create image
                              const svgString = new XMLSerializer().serializeToString(svgElement);
                              const svg = new Blob([svgString], { type: 'image/svg+xml' });
                              const url = URL.createObjectURL(svg);

                              // Create image from SVG
                              const img = new Image();
                              img.onload = () => {
                                ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
                                URL.revokeObjectURL(url);
                              };
                              img.onerror = () => {
                                console.error('Failed to load SVG image');
                                URL.revokeObjectURL(url);
                              };
                              img.src = url;

                              // Wait for image to load
                              await new Promise(resolve => {
                                img.onload = () => {
                                  ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
                                  URL.revokeObjectURL(url);
                                  resolve(null);
                                };
                              });

                              // Convert canvas to PNG
                              const imgData = canvas.toDataURL('image/png', 0.95);
                              const imgWidth = pageWidth - 20;
                              const imgHeight = (canvas.height * imgWidth) / canvas.width;

                              // Add plot image to PDF
                              if (yPosition + imgHeight > pageHeight - 20) {
                                pdf.addPage();
                                yPosition = 10;
                              }
                              pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
                              yPosition += imgHeight + 8;

                              // Clean up temporary element
                              document.body.removeChild(tempSvgContainer);
                            } catch (error) {
                              console.error('Error capturing plot:', error);
                              // Continue without plot if capture fails
                            }

                            // Add separator before profile data
                            if (yPosition + 30 > pageHeight - 10) {
                              pdf.addPage();
                              // Add black background to new page
                              pdf.setFillColor(0, 0, 0);
                              pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                              yPosition = 10;
                            }
                            pdf.setDrawColor(255, 187, 36);
                            pdf.line(10, yPosition, pageWidth - 10, yPosition);
                            yPosition += 5;

                            // Add profile data
                            pdf.setTextColor(255, 187, 36);
                            pdf.setFontSize(12);
                            (pdf as any).setFont(undefined, 'bold');
                            pdf.text('Profile Configuration:', 10, yPosition);
                            yPosition += 6;

                            pdf.setFontSize(10);
                            (pdf as any).setFont(undefined, 'normal');
                            const profileData = [
                              `Stage 1: ${schedule.data.stage1.startTemp}°C → ${schedule.data.stage1.targetTemp}°C (${schedule.data.stage1.duration} min)`,
                              `Stage 2: Hold ${schedule.data.stage2.holdTemp}°C (${schedule.data.stage2.duration} min)`,
                              `Stage 3: ${schedule.data.stage3.startTemp}°C → ${schedule.data.stage3.endTemp}°C (${schedule.data.stage3.duration} min)`,
                              `Stage 4: ${schedule.data.stage4.startTemp}°C → ${schedule.data.stage4.endTemp}°C (${schedule.data.stage4.duration} min)`,
                              `Annealing Point: ${referenceLines.annealingPoint}°C`,
                              `Strain Point: ${referenceLines.strainPoint}°C`,
                            ];
                            profileData.forEach(line => {
                              pdf.text(line, 10, yPosition);
                              yPosition += 5;
                            });
                            yPosition += 3;

                            // Add materials & notes
                            if (schedule.notes) {
                              if (yPosition + 30 > pageHeight - 10) {
                                pdf.addPage();
                                // Add black background to new page
                                pdf.setFillColor(0, 0, 0);
                                pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                                yPosition = 10;
                              }
                              
                              pdf.setTextColor(255, 187, 36);
                              pdf.setFontSize(12);
                              (pdf as any).setFont(undefined, 'bold');
                              pdf.text('Materials & Notes:', 10, yPosition);
                              yPosition += 6;
                              
                              pdf.setFontSize(10);
                              (pdf as any).setFont(undefined, 'normal');
                              const notesLines = (pdf as any).splitTextToSize(schedule.notes, pageWidth - 20);
                              (pdf as any).text(notesLines, 10, yPosition);
                              yPosition += notesLines.length * 5 + 5;
                            }

                            // Add results
                            if (schedule.results) {
                              if (yPosition + 30 > pageHeight - 10) {
                                pdf.addPage();
                                // Add black background to new page
                                pdf.setFillColor(0, 0, 0);
                                pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                                yPosition = 10;
                              }
                              
                              pdf.setTextColor(255, 187, 36);
                              pdf.setFontSize(12);
                              (pdf as any).setFont(undefined, 'bold');
                              pdf.text('Results & Observations:', 10, yPosition);
                              yPosition += 6;
                              
                              pdf.setFontSize(10);
                              (pdf as any).setFont(undefined, 'normal');
                              const resultsLines = (pdf as any).splitTextToSize(schedule.results, pageWidth - 20);
                              (pdf as any).text(resultsLines, 10, yPosition);
                              yPosition += resultsLines.length * 5 + 10;
                            }

                            // Add colors section on a new page if needed
                            if (schedule.selectedColors && schedule.selectedColors.length > 0) {
                              if (yPosition + 20 > pageHeight - 10) {
                                pdf.addPage();
                                pdf.setFillColor(0, 0, 0);
                                pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                                yPosition = 10;
                              }
                              
                              yPosition += 5; // Add spacing before colors section
                              
                              pdf.setTextColor(255, 187, 36);
                              pdf.setFontSize(12);
                              (pdf as any).setFont(undefined, 'bold');
                              pdf.text('Glass Colors Used:', 10, yPosition);
                              yPosition += 8;
                              
                              pdf.setFontSize(10);
                              (pdf as any).setFont(undefined, 'normal');
                              schedule.selectedColors.forEach((color) => {
                                if (yPosition + 8 > pageHeight - 10) {
                                  pdf.addPage();
                                  pdf.setFillColor(0, 0, 0);
                                  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                                  yPosition = 10;
                                }
                                // Render colored jar icon
                                const jarImageData = renderColoredJarToCanvas(color, 60);
                                pdf.addImage(jarImageData, 'PNG', 12, yPosition - 6, 6, 6);
                                // Add color name text
                                pdf.setTextColor(255, 187, 36);
                                const colorName = getColorNameFromHex(color);
                                pdf.text(colorName, 20, yPosition);
                                yPosition += 8;
                              });
                            }

                            // Download PDF
                            const fileName = `${schedule.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                            pdf.save(fileName);
                          }}
                          className="px-3 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded text-sm font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Export PDF
                        </button>

                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-sm font-semibold"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => {
                            toast.info('Logs feature coming soon');
                          }}
                          className="px-3 py-1 bg-stone-600 hover:bg-stone-500 text-white rounded text-sm font-semibold transition-colors flex items-center gap-1"
                        >
                          {schedule.selectedColors && schedule.selectedColors.length > 0 && (
                            <span className="text-xs">🎨</span>
                          )}
                          Logs
                        </button>
                      </div>
                    </div>
                    {schedule.notes && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-stone-300">Materials & Notes:</p>
                        <p className="text-sm text-stone-300 bg-stone-800/50 p-2 rounded">{schedule.notes}</p>
                      </div>
                    )}
                    {schedule.results && (
                      <div>
                        <p className="text-xs font-semibold text-stone-300">Results:</p>
                        <p className="text-sm text-stone-300 bg-stone-800/50 p-2 rounded">{schedule.results}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed bg-stone-800 border border-stone-600 p-6 rounded-lg shadow-lg z-50" style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px'
        }}>
          <h4 className="text-lg font-bold text-white mb-4">Save Schedule</h4>
          <input
            type="text"
            placeholder="Enter schedule name"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="w-full bg-stone-700 border border-stone-600 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:border-amber-500"
          />
          <div className="flex gap-2 justify-center">
          <button
            onClick={handleSaveSchedule}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setShowSaveDialog(false)}
            className="px-4 py-2 bg-stone-600 hover:bg-stone-500 text-white rounded font-semibold"
          >
            Cancel
          </button>
          </div>
        </div>
      )}

    </div>
  );
}
