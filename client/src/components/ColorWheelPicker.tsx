/*
Color Wheel Picker Component
Interactive hue selector allowing users to pan through the color spectrum
and save specific colors for schedule documentation
*/

import { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface ColorWheelPickerProps {
  selectedColors: string[];
  onAddColor: (color: string) => void;
  onRemoveColor: (color: string) => void;
}

export function ColorWheelPicker({ selectedColors, onAddColor, onRemoveColor }: ColorWheelPickerProps) {
  const [hue, setHue] = useState(0);
  const wheelRef = useRef<HTMLCanvasElement>(null);

  // Convert HSL to RGB hex
  const hslToHex = (h: number, s: number, l: number): string => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    const toHex = (val: number) => {
      const hex = Math.round((val + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const currentColor = hslToHex(hue, 1, 0.5);
  const colorName = getColorName(hue);

  const handleAddColor = () => {
    if (!selectedColors.includes(currentColor)) {
      onAddColor(currentColor);
    }
  };

  const handleWheelClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = wheelRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    setHue(Math.round(angle));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        {/* Color Wheel Canvas */}
        <div className="relative">
          <canvas
            ref={wheelRef}
            width={250}
            height={250}
            onClick={handleWheelClick}
            className="cursor-crosshair rounded-full border-2 border-stone-600"
            onLoad={() => drawColorWheel(wheelRef.current)}
          />
          {/* Hue indicator */}
          <div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-white border border-stone-900 rounded-full pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) rotate(${hue}deg) translateY(-110px)`,
            }}
          />
        </div>

        {/* Current Color Display */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border-2 border-stone-600"
              style={{ backgroundColor: currentColor }}
            />
            <div>
              <p className="text-sm font-semibold text-stone-300">{colorName}</p>
              <p className="text-xs text-stone-400">{currentColor.toUpperCase()}</p>
              <p className="text-xs text-stone-500">Hue: {hue}°</p>
            </div>
          </div>

          {/* Add Color Button */}
          <button
            onClick={handleAddColor}
            disabled={selectedColors.includes(currentColor)}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-600 text-white rounded font-semibold text-sm transition-colors"
          >
            {selectedColors.includes(currentColor) ? 'Color Added' : 'Save Color'}
          </button>
        </div>
      </div>

      {/* Selected Colors Display */}
      {selectedColors.length > 0 && (
        <div className="bg-stone-800/50 border border-stone-600 rounded p-4">
          <p className="text-sm font-semibold text-amber-300 mb-3">Selected Colors ({selectedColors.length})</p>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((color) => (
              <div
                key={color}
                className="flex items-center gap-2 bg-stone-700 border border-stone-600 rounded px-3 py-2"
              >
                <div
                  className="w-6 h-6 rounded border border-stone-500"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-stone-300">{color.toUpperCase()}</span>
                <button
                  onClick={() => onRemoveColor(color)}
                  className="ml-1 text-stone-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Draw the color wheel on canvas
function drawColorWheel(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 5;

  // Draw color wheel
  for (let angle = 0; angle < 360; angle += 1) {
    const startAngle = (angle - 90) * (Math.PI / 180);
    const endAngle = (angle + 1 - 90) * (Math.PI / 180);

    const hue = angle;
    const saturation = 1;
    const lightness = 0.5;

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness - c / 2;
    let r = 0, g = 0, b = 0;

    if (hue >= 0 && hue < 60) {
      r = c; g = x; b = 0;
    } else if (hue >= 60 && hue < 120) {
      r = x; g = c; b = 0;
    } else if (hue >= 120 && hue < 180) {
      r = 0; g = c; b = x;
    } else if (hue >= 180 && hue < 240) {
      r = 0; g = x; b = c;
    } else if (hue >= 240 && hue < 300) {
      r = x; g = 0; b = c;
    } else if (hue >= 300 && hue < 360) {
      r = c; g = 0; b = x;
    }

    const toRGB = (val: number) => Math.round((val + m) * 255);
    const color = `rgb(${toRGB(r)}, ${toRGB(g)}, ${toRGB(b)})`;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }

  // Draw border
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

// Get color name from hue
function getColorName(hue: number): string {
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
