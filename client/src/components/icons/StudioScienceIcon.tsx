import React from 'react';

interface StudioScienceIconProps {
  className?: string;
  isActive?: boolean;
}

export function StudioScienceIcon({ className = "w-6 h-6", isActive = false }: StudioScienceIconProps) {
  if (isActive) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Housing ring - silver-blue */}
        <circle cx="12" cy="11" r="8" stroke="#a8d5ff" strokeWidth="1.5" fill="none" />
        
        {/* Fan blades - 6 swept blades */}
        <g fill="none" stroke="#a8d5ff" strokeWidth="1.2" strokeLinecap="round">
          {/* Blade 1 */}
          <path d="M 12 4 Q 14 7 14 11" />
          {/* Blade 2 */}
          <path d="M 15 6 Q 16 8.5 15.5 11.5" />
          {/* Blade 3 */}
          <path d="M 15 16 Q 14 13.5 12 12" />
          {/* Blade 4 */}
          <path d="M 12 18 Q 10 15 10 11" />
          {/* Blade 5 */}
          <path d="M 9 16 Q 8 13.5 8.5 10.5" />
          {/* Blade 6 */}
          <path d="M 9 6 Q 8 8.5 9 11.5" />
        </g>
        
        {/* Center hub - amber/orange with cyan ring */}
        <circle cx="12" cy="11" r="2.5" fill="#ffa500" />
        <circle cx="12" cy="11" r="3.5" stroke="#00d9ff" strokeWidth="0.8" fill="none" />
        
        {/* Airflow arrows - left side */}
        <g fill="none" stroke="#a8d5ff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          {/* Arrow 1 */}
          <path d="M 3 9 L 5 9 M 4 8 L 3 9 L 4 10" />
          {/* Arrow 2 */}
          <path d="M 3 11 L 5 11 M 4 10 L 3 11 L 4 12" />
          {/* Arrow 3 */}
          <path d="M 3 13 L 5 13 M 4 12 L 3 13 L 4 14" />
        </g>
        
        {/* Cart base - two lines with circles */}
        <line x1="8" y1="19" x2="16" y2="19" stroke="#a8d5ff" strokeWidth="1" />
        <circle cx="9" cy="20" r="0.8" fill="#a8d5ff" />
        <circle cx="15" cy="20" r="0.8" fill="#a8d5ff" />
      </svg>
    );
  }

  // Inactive state - muted grey
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Housing ring */}
      <circle cx="12" cy="11" r="8" stroke="#6b7280" strokeWidth="1.5" fill="none" />
      
      {/* Fan blades */}
      <g fill="none" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round">
        <path d="M 12 4 Q 14 7 14 11" />
        <path d="M 15 6 Q 16 8.5 15.5 11.5" />
        <path d="M 15 16 Q 14 13.5 12 12" />
        <path d="M 12 18 Q 10 15 10 11" />
        <path d="M 9 16 Q 8 13.5 8.5 10.5" />
        <path d="M 9 6 Q 8 8.5 9 11.5" />
      </g>
      
      {/* Center hub */}
      <circle cx="12" cy="11" r="2.5" fill="#6b7280" />
      <circle cx="12" cy="11" r="3.5" stroke="#6b7280" strokeWidth="0.8" fill="none" />
      
      {/* Airflow arrows */}
      <g fill="none" stroke="#6b7280" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 3 9 L 5 9 M 4 8 L 3 9 L 4 10" />
        <path d="M 3 11 L 5 11 M 4 10 L 3 11 L 4 12" />
        <path d="M 3 13 L 5 13 M 4 12 L 3 13 L 4 14" />
      </g>
      
      {/* Cart base */}
      <line x1="8" y1="19" x2="16" y2="19" stroke="#6b7280" strokeWidth="1" />
      <circle cx="9" cy="20" r="0.8" fill="#6b7280" />
      <circle cx="15" cy="20" r="0.8" fill="#6b7280" />
    </svg>
  );
}
