import React from 'react';

interface EquipmentIconProps {
  className?: string;
  isActive?: boolean;
}

export function EquipmentIcon({ className = "w-6 h-6", isActive = false }: EquipmentIconProps) {
  if (isActive) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Main cylinder body - stainless steel gradient */}
        <rect x="6" y="6" width="12" height="12" rx="2" fill="#e8e8e8" />
        <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="#a9a9a9" strokeWidth="0.8" />
        
        {/* Vertical shading lines for metallic effect */}
        <line x1="8" y1="6" x2="8" y2="18" stroke="#d3d3d3" strokeWidth="0.5" opacity="0.5" />
        <line x1="12" y1="6" x2="12" y2="18" stroke="#d3d3d3" strokeWidth="0.5" opacity="0.5" />
        <line x1="16" y1="6" x2="16" y2="18" stroke="#d3d3d3" strokeWidth="0.5" opacity="0.5" />
        
        {/* Viewport window - frosted blue-white with glow */}
        <rect x="8" y="8" width="8" height="6" rx="1" fill="#e0f7ff" />
        <rect x="8" y="8" width="8" height="6" rx="1" fill="none" stroke="#7dd3fc" strokeWidth="0.6" />
        
        {/* Vapor wisps inside viewport */}
        <path d="M 9 11 Q 10 10 11 11" fill="none" stroke="#b3e5fc" strokeWidth="0.5" opacity="0.7" />
        <path d="M 12 12 Q 13 11 14 12" fill="none" stroke="#b3e5fc" strokeWidth="0.5" opacity="0.7" />
        
        {/* Top handle ring - silver */}
        <circle cx="12" cy="5.5" r="2.5" fill="none" stroke="#c0c0c0" strokeWidth="1" />
        
        {/* Valve fittings at top - silver T-shapes */}
        <g fill="#c0c0c0">
          {/* Left valve */}
          <rect x="7.5" y="4.5" width="1" height="1.5" rx="0.3" />
          <rect x="7" y="5.2" width="2" height="0.6" rx="0.2" />
          
          {/* Right valve */}
          <rect x="15.5" y="4.5" width="1" height="1.5" rx="0.3" />
          <rect x="15" y="5.2" width="2" height="0.6" rx="0.2" />
        </g>
        
        {/* Pressure gauge - top front */}
        <circle cx="10" cy="6.5" r="1.2" fill="#e0f0ff" />
        <circle cx="10" cy="6.5" r="1.2" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
        <line x1="10" y1="6" x2="10.6" y2="6.8" stroke="#1e3a8a" strokeWidth="0.4" strokeLinecap="round" />
        
        {/* Side handles - curved brackets */}
        <g fill="none" stroke="#c0c0c0" strokeWidth="0.8" strokeLinecap="round">
          {/* Left handle */}
          <path d="M 5.5 9 Q 4.5 9 4.5 12 Q 4.5 15 5.5 15" />
          {/* Right handle */}
          <path d="M 18.5 9 Q 19.5 9 19.5 12 Q 19.5 15 18.5 15" />
        </g>
        
        {/* Four caster wheels */}
        {/* Front left wheel */}
        <circle cx="7.5" cy="19" r="1" fill="none" stroke="#a9a9a9" strokeWidth="0.7" />
        <circle cx="7.5" cy="19" r="0.4" fill="#6b7280" />
        
        {/* Front right wheel */}
        <circle cx="16.5" cy="19" r="1" fill="none" stroke="#a9a9a9" strokeWidth="0.7" />
        <circle cx="16.5" cy="19" r="0.4" fill="#6b7280" />
        
        {/* Back left wheel (side view) */}
        <circle cx="8.5" cy="20" r="0.8" fill="none" stroke="#a9a9a9" strokeWidth="0.6" />
        <circle cx="8.5" cy="20" r="0.3" fill="#6b7280" />
        
        {/* Back right wheel (side view) */}
        <circle cx="15.5" cy="20" r="0.8" fill="none" stroke="#a9a9a9" strokeWidth="0.6" />
        <circle cx="15.5" cy="20" r="0.3" fill="#6b7280" />
      </svg>
    );
  }

  // Inactive state - greyscale
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Main cylinder body */}
      <rect x="6" y="6" width="12" height="12" rx="2" fill="#9ca3af" opacity="0.6" />
      <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="#6b7280" strokeWidth="0.8" />
      
      {/* Vertical shading lines */}
      <line x1="8" y1="6" x2="8" y2="18" stroke="#d1d5db" strokeWidth="0.5" opacity="0.4" />
      <line x1="12" y1="6" x2="12" y2="18" stroke="#d1d5db" strokeWidth="0.5" opacity="0.4" />
      <line x1="16" y1="6" x2="16" y2="18" stroke="#d1d5db" strokeWidth="0.5" opacity="0.4" />
      
      {/* Viewport window */}
      <rect x="8" y="8" width="8" height="6" rx="1" fill="#d1d5db" opacity="0.5" />
      <rect x="8" y="8" width="8" height="6" rx="1" fill="none" stroke="#9ca3af" strokeWidth="0.6" />
      
      {/* Vapor wisps */}
      <path d="M 9 11 Q 10 10 11 11" fill="none" stroke="#9ca3af" strokeWidth="0.4" opacity="0.5" />
      <path d="M 12 12 Q 13 11 14 12" fill="none" stroke="#9ca3af" strokeWidth="0.4" opacity="0.5" />
      
      {/* Top handle ring */}
      <circle cx="12" cy="5.5" r="2.5" fill="none" stroke="#9ca3af" strokeWidth="1" />
      
      {/* Valve fittings */}
      <g fill="#9ca3af" opacity="0.6">
        <rect x="7.5" y="4.5" width="1" height="1.5" rx="0.3" />
        <rect x="7" y="5.2" width="2" height="0.6" rx="0.2" />
        <rect x="15.5" y="4.5" width="1" height="1.5" rx="0.3" />
        <rect x="15" y="5.2" width="2" height="0.6" rx="0.2" />
      </g>
      
      {/* Pressure gauge */}
      <circle cx="10" cy="6.5" r="1.2" fill="#d1d5db" opacity="0.4" />
      <circle cx="10" cy="6.5" r="1.2" fill="none" stroke="#9ca3af" strokeWidth="0.5" />
      <line x1="10" y1="6" x2="10.6" y2="6.8" stroke="#6b7280" strokeWidth="0.4" strokeLinecap="round" />
      
      {/* Side handles */}
      <g fill="none" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round">
        <path d="M 5.5 9 Q 4.5 9 4.5 12 Q 4.5 15 5.5 15" />
        <path d="M 18.5 9 Q 19.5 9 19.5 12 Q 19.5 15 18.5 15" />
      </g>
      
      {/* Wheels */}
      <circle cx="7.5" cy="19" r="1" fill="none" stroke="#9ca3af" strokeWidth="0.7" />
      <circle cx="7.5" cy="19" r="0.4" fill="#6b7280" opacity="0.6" />
      <circle cx="16.5" cy="19" r="1" fill="none" stroke="#9ca3af" strokeWidth="0.7" />
      <circle cx="16.5" cy="19" r="0.4" fill="#6b7280" opacity="0.6" />
      <circle cx="8.5" cy="20" r="0.8" fill="none" stroke="#9ca3af" strokeWidth="0.6" />
      <circle cx="8.5" cy="20" r="0.3" fill="#6b7280" opacity="0.6" />
      <circle cx="15.5" cy="20" r="0.8" fill="none" stroke="#9ca3af" strokeWidth="0.6" />
      <circle cx="15.5" cy="20" r="0.3" fill="#6b7280" opacity="0.6" />
    </svg>
  );
}
