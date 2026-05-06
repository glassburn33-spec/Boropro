import React from 'react';

interface GlassRodsIconProps {
  className?: string;
  isActive?: boolean;
}

export function GlassRodsIcon({ className = "w-6 h-6", isActive = false }: GlassRodsIconProps) {
  if (isActive) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Glass rods fanned diagonally */}
        {/* Deep red rod */}
        <rect x="4" y="6" width="2.5" height="14" rx="1.2" fill="#8b0000" opacity="0.9" />
        <rect x="4" y="6" width="2.5" height="14" rx="1.2" fill="none" stroke="#ff6b6b" strokeWidth="0.5" opacity="0.6" />
        
        {/* Red rod */}
        <rect x="6" y="5" width="2.5" height="14" rx="1.2" fill="#dc143c" opacity="0.9" />
        <rect x="6" y="5" width="2.5" height="14" rx="1.2" fill="none" stroke="#ff8787" strokeWidth="0.5" opacity="0.6" />
        
        {/* Orange rod */}
        <rect x="8" y="4" width="2.5" height="14" rx="1.2" fill="#ff6347" opacity="0.9" />
        <rect x="8" y="4" width="2.5" height="14" rx="1.2" fill="none" stroke="#ffb366" strokeWidth="0.5" opacity="0.6" />
        
        {/* Yellow-orange rod */}
        <rect x="10" y="3" width="2.5" height="14" rx="1.2" fill="#ffa500" opacity="0.9" />
        <rect x="10" y="3" width="2.5" height="14" rx="1.2" fill="none" stroke="#ffc966" strokeWidth="0.5" opacity="0.6" />
        
        {/* Yellow rod */}
        <rect x="12" y="2" width="2.5" height="14" rx="1.2" fill="#ffd700" opacity="0.9" />
        <rect x="12" y="2" width="2.5" height="14" rx="1.2" fill="none" stroke="#ffeb99" strokeWidth="0.5" opacity="0.6" />
        
        {/* Yellow-green rod */}
        <rect x="14" y="3" width="2.5" height="14" rx="1.2" fill="#adff2f" opacity="0.9" />
        <rect x="14" y="3" width="2.5" height="14" rx="1.2" fill="none" stroke="#d4ff66" strokeWidth="0.5" opacity="0.6" />
        
        {/* Green rod */}
        <rect x="16" y="4" width="2.5" height="14" rx="1.2" fill="#32cd32" opacity="0.9" />
        <rect x="16" y="4" width="2.5" height="14" rx="1.2" fill="none" stroke="#66ff66" strokeWidth="0.5" opacity="0.6" />
        
        {/* Teal rod */}
        <rect x="18" y="5" width="2.5" height="14" rx="1.2" fill="#20b2aa" opacity="0.9" />
        <rect x="18" y="5" width="2.5" height="14" rx="1.2" fill="none" stroke="#66e6e0" strokeWidth="0.5" opacity="0.6" />
        
        {/* Blue rod */}
        <rect x="20" y="6" width="2.5" height="14" rx="1.2" fill="#1e90ff" opacity="0.9" />
        <rect x="20" y="6" width="2.5" height="14" rx="1.2" fill="none" stroke="#66b3ff" strokeWidth="0.5" opacity="0.6" />
        
        {/* Silver metallic band in center */}
        <rect x="6" y="10.5" width="12" height="3" rx="1.5" fill="#d3d3d3" />
        <rect x="6" y="10.5" width="12" height="1.2" rx="1.5" fill="#ffffff" opacity="0.7" />
        <rect x="6" y="10.5" width="12" height="3" rx="1.5" fill="none" stroke="#a9a9a9" strokeWidth="0.5" />
      </svg>
    );
  }

  // Inactive state - greyscale
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Glass rods in greyscale */}
      <rect x="4" y="6" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="6" y="5" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="8" y="4" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="10" y="3" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="12" y="2" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="14" y="3" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="16" y="4" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="18" y="5" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      <rect x="20" y="6" width="2.5" height="14" rx="1.2" fill="#6b7280" opacity="0.7" />
      
      {/* Silver band */}
      <rect x="6" y="10.5" width="12" height="3" rx="1.5" fill="#9ca3af" />
      <rect x="6" y="10.5" width="12" height="1.2" rx="1.5" fill="#d1d5db" opacity="0.6" />
      <rect x="6" y="10.5" width="12" height="3" rx="1.5" fill="none" stroke="#6b7280" strokeWidth="0.5" />
    </svg>
  );
}
