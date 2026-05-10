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

    // Load the glass jar image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/manus-storage/glassjar_e8338f0f.png';

    img.onload = () => {
      // Draw the original image
      ctx.drawImage(img, 0, 0, size, size);

      // Create a circular mask for the jar (approximate center and radius)
      // The jar is roughly in the center of the image
      const centerX = size / 2;
      const centerY = size / 2.2; // Slightly higher than center
      const radius = size / 3.5; // Radius of the jar

      // Apply color overlay to the jar area
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
    };

    img.onerror = () => {
      // Fallback: draw a simple colored circle if image fails to load
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2);
      ctx.fill();
    };
  }, [color, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: size,
        borderRadius: '4px',
        display: 'block',
      }}
    />
  );
};
