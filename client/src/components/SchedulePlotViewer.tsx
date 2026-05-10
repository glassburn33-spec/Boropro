/*
Schedule Plot Viewer - Displays temperature profile plot for saved schedules
Reuses the same plot visualization as the Annealing Profile Editor
*/

import { useEffect, useRef, useState } from 'react';
import type { ScheduleMetadata } from '@shared/scheduleTypes';

interface SchedulePlotViewerProps {
  temperatures?: number[];
  times?: number[];
  filename: string;
  annealingPoint?: number;
  strainPoint?: number;
  jsonMetadata?: string; // Base64 encoded JSON metadata
}

export function SchedulePlotViewer({
  temperatures: initialTemperatures,
  times: initialTimes,
  filename,
  annealingPoint = 565,
  strainPoint = 510,
  jsonMetadata,
}: SchedulePlotViewerProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgContainerRef.current) return;

    let temperatures = initialTemperatures || [];
    let times = initialTimes || [];
    let actualAnnealingPoint = annealingPoint;
    let actualStrainPoint = strainPoint;

    // Parse JSON metadata if provided
    if (jsonMetadata) {
      try {
        const jsonString = atob(jsonMetadata);
        const metadata: ScheduleMetadata = JSON.parse(jsonString);
        temperatures = metadata.temperatures || [];
        times = metadata.times || [];
        actualAnnealingPoint = metadata.annealingPoint || annealingPoint;
        actualStrainPoint = metadata.strainPoint || strainPoint;
        setError(null);
      } catch (error) {
        console.error('Failed to parse JSON metadata:', error);
        setError('Failed to parse schedule metadata');
        return;
      }
    }

    if (temperatures.length === 0) {
      setError('No temperature data available');
      return;
    }

    // Generate plot SVG
    const svg = generateTemperaturePlotSVG(
      temperatures,
      times,
      filename,
      { annealingPoint: actualAnnealingPoint, strainPoint: actualStrainPoint }
    );

    // Clear previous content
    svgContainerRef.current.innerHTML = '';
    svgContainerRef.current.appendChild(svg);
  }, [initialTemperatures, initialTimes, filename, annealingPoint, strainPoint, jsonMetadata]);

  if (error) {
    return (
      <div className="w-full bg-stone-900 rounded-lg border border-stone-700 p-4">
        <h3 className="text-amber-400 font-semibold mb-4">Temperature Profile</h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-900 rounded-lg border border-stone-700 p-4">
      <h3 className="text-amber-400 font-semibold mb-4">Temperature Profile</h3>
      <div
        ref={svgContainerRef}
        className="w-full flex justify-center overflow-auto"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}

// Helper function to generate temperature plot SVG
function generateTemperaturePlotSVG(
  temperatures: number[],
  times: number[],
  scheduleName: string,
  refLines: { annealingPoint: number; strainPoint: number }
): SVGSVGElement {
  const width = 1000;
  const height = 600;
  const margin = { top: 80, right: 80, bottom: 120, left: 70 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Prepare plot data from temperatures and times
  const plotData = temperatures.map((temp, idx) => ({
    time: times[idx] || 0,
    temp: temp,
  }));

  if (plotData.length === 0) {
    return createEmptySVG(width, height);
  }

  const maxTemp = Math.max(...temperatures) + 50;
  const maxTime = Math.max(...times);

  const titleFontSize = Math.max(14, Math.min(20, width / 50));
  const labelFontSize = Math.max(10, Math.min(14, width / 80));

  const scaleX = (time: number) => (time / maxTime) * plotWidth;
  const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('style', 'background-color: #1c1917;');

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', width.toString());
  bg.setAttribute('height', height.toString());
  bg.setAttribute('fill', '#1c1917');
  svg.appendChild(bg);

  // Gridlines
  for (let temp = 0; temp <= Math.ceil(maxTemp / 100) * 100; temp += 100) {
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

  // Temperature curve
  let pathD = `M ${margin.left + scaleX(plotData[0].time)} ${margin.top + scaleY(plotData[0].temp)}`;
  for (let i = 1; i < plotData.length; i++) {
    pathD += ` L ${margin.left + scaleX(plotData[i].time)} ${margin.top + scaleY(plotData[i].temp)}`;
  }

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

  // Title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', (width / 2).toString());
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('fill', '#fbbf24');
  title.setAttribute('font-size', titleFontSize.toString());
  title.setAttribute('font-weight', 'bold');
  title.textContent = scheduleName;
  svg.appendChild(title);

  // X-axis label
  const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xLabel.setAttribute('x', (margin.left + plotWidth / 2).toString());
  xLabel.setAttribute('y', (height - 20).toString());
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('fill', '#999');
  xLabel.setAttribute('font-size', labelFontSize.toString());
  xLabel.textContent = 'Time (hours)';
  svg.appendChild(xLabel);

  // Y-axis label
  const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yLabel.setAttribute('x', '20');
  yLabel.setAttribute('y', (margin.top + plotHeight / 2).toString());
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('fill', '#999');
  yLabel.setAttribute('font-size', labelFontSize.toString());
  yLabel.setAttribute('transform', `rotate(-90, 20, ${margin.top + plotHeight / 2})`);
  yLabel.textContent = 'Temperature (°C)';
  svg.appendChild(yLabel);

  return svg;
}

function createEmptySVG(width: number, height: number): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('style', 'background-color: #1c1917;');
  return svg;
}
