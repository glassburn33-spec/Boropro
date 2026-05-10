/*
Color Wheel Picker Component
Interactive hue selector allowing users to pan through the color spectrum
and save specific colors for schedule documentation
*/

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ColorWheelPickerProps {
  selectedColors: string[];
  onAddColor: (color: string) => void;
  onRemoveColor: (color: string) => void;
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

// Get color name from hex color
function getColorNameFromHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let hueVal = 0;
  
  if (max === min) {
    hueVal = 0;
  } else if (max === rNorm) {
    hueVal = ((gNorm - bNorm) / (max - min)) * 60;
    if (hueVal < 0) hueVal += 360;
  } else if (max === gNorm) {
    hueVal = ((bNorm - rNorm) / (max - min)) * 60 + 120;
  } else {
    hueVal = ((rNorm - gNorm) / (max - min)) * 60 + 240;
  }
  
  return getColorName(hueVal);
}

export function ColorWheelPicker({ selectedColors, onAddColor, onRemoveColor }: ColorWheelPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [lightness, setLightness] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const wheelRef = useRef<HTMLCanvasElement>(null);

  // Draw the color wheel on canvas with full spectrum
  useEffect(() => {
    drawColorWheel(wheelRef.current);
  }, []);

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

  const currentColor = hslToHex(hue, saturation, lightness);
  const colorName = getColorName(hue);

  const handleAddColor = () => {
    if (!selectedColors.includes(currentColor)) {
      onAddColor(currentColor);
    }
  };

  const updateColorFromPosition = (clientX: number, clientY: number) => {
    const canvas = wheelRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;

    // Calculate distance from center (for saturation)
    const maxRadius = canvas.width / 2 - 5;
    const distance = Math.sqrt(x * x + y * y);
    const newSaturation = Math.min(distance / maxRadius, 1);

    // Calculate angle (for hue)
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    const newHue = Math.round(angle);

    // Lightness varies based on saturation: more saturated = lighter, less saturated = darker
    // This creates a more natural color wheel feel
    const newLightness = 0.3 + (newSaturation * 0.4);

    setHue(newHue);
    setSaturation(newSaturation);
    setLightness(newLightness);
  };

  const handleWheelMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    document.body.style.overflow = 'hidden';
    updateColorFromPosition(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateColorFromPosition(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.overflow = '';
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    document.body.style.overflow = 'hidden';
    if (e.touches.length > 0) {
      updateColorFromPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (e.touches.length > 0) {
      updateColorFromPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.body.style.overflow = '';
  };

  // Add event listeners for mouse and touch
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        {/* Color Wheel Canvas */}
        <div className="relative">
          <canvas
            ref={wheelRef}
            width={300}
            height={300}
            onMouseDown={handleWheelMouseDown}
            onTouchStart={handleTouchStart}
            className={`rounded-full border-2 border-stone-500 shadow-lg transition-all ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          />
          {/* Position indicator */}
          <div
            className="absolute w-4 h-4 bg-white border-2 border-stone-900 rounded-full pointer-events-none shadow-md transition-all"
            style={{
              left: `calc(50% + ${(saturation * 135 * Math.cos((hue - 90) * (Math.PI / 180)))}px)`,
              top: `calc(50% + ${(saturation * 135 * Math.sin((hue - 90) * (Math.PI / 180)))}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Current Color Display */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded border-2 border-stone-600 shadow-md transition-colors duration-100"
              style={{ backgroundColor: currentColor }}
            />
            <div>
              <p className="text-sm font-semibold text-stone-300">{colorName}</p>
              <p className="text-xs text-stone-400">{currentColor.toUpperCase()}</p>
              <p className="text-xs text-stone-500">H: {hue}° S: {Math.round(saturation * 100)}%</p>
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
                <span className="text-xs text-stone-300">{getColorNameFromHex(color)}</span>
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

// Draw the color wheel on canvas with full spectrum
function drawColorWheel(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = canvas.width / 2 - 5;

  // Draw color wheel with radial gradient for full spectrum
  for (let angle = 0; angle < 360; angle += 0.5) {
    const startAngle = (angle - 90) * (Math.PI / 180);
    const endAngle = (angle + 0.5 - 90) * (Math.PI / 180);

    // Create gradient from center (white/desaturated) to edge (full saturation)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    
    const hue = angle;
    
    // White at center (no saturation)
    gradient.addColorStop(0, 'hsl(' + hue + ', 0%, 100%)');
    
    // Transition through colors with varying lightness
    gradient.addColorStop(0.3, 'hsl(' + hue + ', 50%, 60%)');
    gradient.addColorStop(0.7, 'hsl(' + hue + ', 100%, 50%)');
    
    // Darker shade at the very edge for definition
    gradient.addColorStop(1, 'hsl(' + hue + ', 100%, 40%)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, maxRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }

  // Draw outer border
  ctx.strokeStyle = '#a8a29e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw inner circle border for definition
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 0.7, 0, 2 * Math.PI);
  ctx.stroke();
}
