import React, { useEffect, useRef } from 'react';

interface ColoredGlassJarProps {
  color: string; // hex color code
  size?: number; // size in pixels
}

export const ColoredGlassJar: React.FC<ColoredGlassJarProps> = ({ color, size = 60 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw spherical jar with color
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2.5;

    // Create radial gradient for 3D sphere effect
    const gradient = ctx.createRadialGradient(
      centerX - radius / 3,
      centerY - radius / 3,
      0,
      centerX,
      centerY,
      radius
    );

    // Parse hex color to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Create gradient stops with color variations for 3D effect
    gradient.addColorStop(0, `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)}, 0.9)`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.85)`);
    gradient.addColorStop(1, `rgba(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)}, 0.8)`);

    // Draw main sphere
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add highlight for glass shine
    const highlightGradient = ctx.createRadialGradient(
      centerX - radius / 2.5,
      centerY - radius / 2.5,
      0,
      centerX,
      centerY,
      radius / 1.5
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 2, 0, Math.PI * 2);
    ctx.fill();

    // Add subtle shadow for depth
    ctx.strokeStyle = `rgba(0, 0, 0, 0.3)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

  }, [color, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        display: 'block',
        imageRendering: 'crisp-edges',
      }}
    />
  );
};
