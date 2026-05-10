/*
Schedule Plot Viewer - Displays temperature profile plot for saved schedules
Reuses the same plot visualization as the Annealing Profile Editor
*/

import { useEffect, useRef } from 'react';

interface SchedulePlotViewerProps {
  temperatures: number[];
  times: number[];
  filename: string;
  annealingPoint?: number;
  strainPoint?: number;
}

export function SchedulePlotViewer({
  temperatures,
  times,
  filename,
  annealingPoint = 565,
  strainPoint = 510,
}: SchedulePlotViewerProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgContainerRef.current || temperatures.length === 0) return;

    // Generate plot SVG
    const svg = generateTemperaturePlotSVG(
      temperatures,
      times,
      filename,
      { annealingPoint, strainPoint }
    );

    // Clear previous content
    svgContainerRef.current.innerHTML = '';
    svgContainerRef.current.appendChild(svg);
  }, [temperatures, times, filename, annealingPoint, strainPoint]);

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
  const tickFontSize = Math.max(9, Math.min(12, width / 100));

  const scaleX = (time: number) => (time / maxTime) * plotWidth;
  const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

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

    // Y-axis labels
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', (margin.left - 10).toString());
    label.setAttribute('y', (margin.top + scaleY(temp) + 4).toString());
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('fill', '#999');
    label.setAttribute('font-size', tickFontSize.toString());
    label.textContent = temp.toString();
    svg.appendChild(label);
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

  // Axis labels
  const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xLabel.setAttribute('x', (margin.left + plotWidth / 2).toString());
  xLabel.setAttribute('y', (height - 20).toString());
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('fill', '#999');
  xLabel.setAttribute('font-size', labelFontSize.toString());
  xLabel.textContent = 'Time (hours) →';
  svg.appendChild(xLabel);

  const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yLabel.setAttribute('x', '20');
  yLabel.setAttribute('y', (margin.top + plotHeight / 2).toString());
  yLabel.setAttribute('text-anchor', 'middle');
  yLabel.setAttribute('fill', '#999');
  yLabel.setAttribute('font-size', labelFontSize.toString());
  yLabel.setAttribute('transform', `rotate(-90 20 ${margin.top + plotHeight / 2})`);
  yLabel.textContent = 'Temp (°F)';
  svg.appendChild(yLabel);

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

  // X-axis labels
  for (let i = 0; i <= maxTime; i += Math.max(1, Math.floor(maxTime / 5))) {
    const xPos = margin.left + scaleX(i);
    if (xPos < margin.left + plotWidth) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', xPos.toString());
      label.setAttribute('y', (margin.top + plotHeight + 20).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#999');
      label.setAttribute('font-size', tickFontSize.toString());
      label.textContent = i.toString();
      svg.appendChild(label);
    }
  }

  return svg;
}

// Helper function to create empty SVG
function createEmptySVG(width: number, height: number): SVGSVGElement {
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

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', (width / 2).toString());
  text.setAttribute('y', (height / 2).toString());
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('fill', '#999');
  text.setAttribute('font-size', '16');
  text.textContent = 'No data available';
  svg.appendChild(text);

  return svg;
}
