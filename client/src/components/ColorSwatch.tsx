import React from 'react';

interface ColorSwatchProps {
  color: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * ColorSwatch Component
 * Displays a visual color sample with optional label
 * 
 * @param color - CSS color value (hex, rgb, or named color)
 * @param name - Color name to display
 * @param size - Size of swatch: 'sm' (40px), 'md' (60px), 'lg' (80px)
 * @param showLabel - Whether to show the color name label
 * @param className - Additional CSS classes
 */
export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  name,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-lg border-2 border-stone-600 shadow-lg transition-transform hover:scale-105 cursor-pointer`}
        style={{ backgroundColor: color }}
        title={`${name}: ${color}`}
      />
      {showLabel && (
        <p className={`${labelSizeClasses[size]} text-stone-300 text-center font-medium`}>
          {name}
        </p>
      )}
    </div>
  );
};

interface ColorSwatchRowProps {
  colors: Array<{ color: string; name: string }>;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

/**
 * ColorSwatchRow Component
 * Displays multiple color swatches in a horizontal row
 */
export const ColorSwatchRow: React.FC<ColorSwatchRowProps> = ({
  colors,
  size = 'md',
  showLabels = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
      {colors.map((item, index) => (
        <ColorSwatch
          key={index}
          color={item.color}
          name={item.name}
          size={size}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
};

interface InlineColorSwatchProps {
  color: string;
  name: string;
}

/**
 * InlineColorSwatch Component
 * Small color swatch for inline use within text
 */
export const InlineColorSwatch: React.FC<InlineColorSwatchProps> = ({
  color,
  name,
}) => {
  return (
    <span
      className="inline-block w-4 h-4 rounded border border-stone-500 align-middle ml-1 mr-1"
      style={{ backgroundColor: color }}
      title={name}
    />
  );
};
