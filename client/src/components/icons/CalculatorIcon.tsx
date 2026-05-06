import React from 'react';

interface CalculatorIconProps {
  className?: string;
  isActive?: boolean;
}

export function CalculatorIcon({ className = "w-6 h-6", isActive = false }: CalculatorIconProps) {
  if (isActive) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Calculator body - brushed silver gradient */}
        <rect x="3" y="8" width="14" height="14" rx="1.5" fill="#e8e8e8" />
        <rect x="3" y="8" width="14" height="14" rx="1.5" fill="none" stroke="#b0b0b0" strokeWidth="0.8" />
        
        {/* Display screen - mint green */}
        <rect x="4.5" y="9" width="11" height="3" rx="0.8" fill="#c8f0e8" />
        <text x="9.5" y="11.5" textAnchor="middle" fill="#2d5f5a" fontSize="2" fontWeight="bold">123</text>
        
        {/* Button grid - 3x3 */}
        {/* Row 1 */}
        <rect x="4" y="13" width="2.8" height="2.5" rx="0.6" fill="#ff6b6b" opacity="0.85" />
        <rect x="7.2" y="13" width="2.8" height="2.5" rx="0.6" fill="#ffd93d" opacity="0.85" />
        <rect x="10.4" y="13" width="2.8" height="2.5" rx="0.6" fill="#6bcf7f" opacity="0.85" />
        
        {/* Row 2 */}
        <rect x="4" y="16" width="2.8" height="2.5" rx="0.6" fill="#4ecdc4" opacity="0.85" />
        <rect x="7.2" y="16" width="2.8" height="2.5" rx="0.6" fill="#6c5ce7" opacity="0.85" />
        <rect x="10.4" y="16" width="2.8" height="2.5" rx="0.6" fill="#a29bfe" opacity="0.85" />
        
        {/* Row 3 - equals key in gold */}
        <rect x="4" y="19" width="2.8" height="2.5" rx="0.6" fill="#ffa500" opacity="0.85" />
        <rect x="7.2" y="19" width="2.8" height="2.5" rx="0.6" fill="#ff7675" opacity="0.85" />
        <rect x="10.4" y="19" width="2.8" height="2.5" rx="0.6" fill="#ffd700" opacity="0.85" />
        
        {/* Button highlights */}
        <rect x="4" y="13" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="7.2" y="13" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="10.4" y="13" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="4" y="16" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="7.2" y="16" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="10.4" y="16" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="4" y="19" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="7.2" y="19" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        <rect x="10.4" y="19" width="2.8" height="0.8" rx="0.4" fill="#ffffff" opacity="0.4" />
        
        {/* Silver cup base for math symbols */}
        <rect x="16.5" y="12" width="4" height="2.5" rx="1" fill="#d3d3d3" />
        <ellipse cx="18.5" cy="12" rx="2" ry="0.8" fill="#e8e8e8" />
        <rect x="16.5" y="12" width="4" height="2.5" rx="1" fill="none" stroke="#a9a9a9" strokeWidth="0.6" />
        <rect x="16.5" y="12" width="4" height="0.8" rx="0.5" fill="#ffffff" opacity="0.6" />
        
        {/* Math symbols rising from cup */}
        {/* Plus - teal */}
        <g transform="translate(17, 9)">
          <line x1="0" y1="-1" x2="0" y2="1" stroke="#20b2aa" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-1" y1="0" x2="1" y2="0" stroke="#20b2aa" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        
        {/* Multiply - orange */}
        <g transform="translate(18.5, 8)">
          <line x1="-0.8" y1="-0.8" x2="0.8" y2="0.8" stroke="#ff8c42" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="0.8" y1="-0.8" x2="-0.8" y2="0.8" stroke="#ff8c42" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        
        {/* Minus - red */}
        <g transform="translate(20, 9)">
          <line x1="-1" y1="0" x2="1" y2="0" stroke="#ff6b6b" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Inactive state - greyscale
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Calculator body */}
      <rect x="3" y="8" width="14" height="14" rx="1.5" fill="#9ca3af" opacity="0.6" />
      <rect x="3" y="8" width="14" height="14" rx="1.5" fill="none" stroke="#6b7280" strokeWidth="0.8" />
      
      {/* Display screen */}
      <rect x="4.5" y="9" width="11" height="3" rx="0.8" fill="#d1d5db" />
      
      {/* Button grid */}
      <rect x="4" y="13" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="7.2" y="13" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="10.4" y="13" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="4" y="16" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="7.2" y="16" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="10.4" y="16" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="4" y="19" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="7.2" y="19" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      <rect x="10.4" y="19" width="2.8" height="2.5" rx="0.6" fill="#9ca3af" opacity="0.6" />
      
      {/* Silver cup base */}
      <rect x="16.5" y="12" width="4" height="2.5" rx="1" fill="#9ca3af" opacity="0.6" />
      <ellipse cx="18.5" cy="12" rx="2" ry="0.8" fill="#d1d5db" opacity="0.5" />
      <rect x="16.5" y="12" width="4" height="2.5" rx="1" fill="none" stroke="#6b7280" strokeWidth="0.6" />
      
      {/* Math symbols */}
      <g transform="translate(17, 9)" stroke="#6b7280" strokeWidth="1" strokeLinecap="round">
        <line x1="0" y1="-1" x2="0" y2="1" />
        <line x1="-1" y1="0" x2="1" y2="0" />
      </g>
      <g transform="translate(18.5, 8)" stroke="#6b7280" strokeWidth="1" strokeLinecap="round">
        <line x1="-0.8" y1="-0.8" x2="0.8" y2="0.8" />
        <line x1="0.8" y1="-0.8" x2="-0.8" y2="0.8" />
      </g>
      <g transform="translate(20, 9)" stroke="#6b7280" strokeWidth="1" strokeLinecap="round">
        <line x1="-1" y1="0" x2="1" y2="0" />
      </g>
    </svg>
  );
}
