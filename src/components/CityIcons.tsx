import React from 'react';

interface CityIconProps {
  city: string;
  className?: string;
  accentColor?: string;
}

export function CityIcon({ city, className = "", accentColor = "#42b8a2" }: CityIconProps) {
  const main = "currentColor";
  const fillAccent = `${accentColor}25`; // ~15% opacity for fill

  switch (city) {
    case 'Mumbai': // Gateway of India
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M3 22h18 M4 22V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14 M5 6v-2h2v2 M17 6v-2h2v2 M4 12h4 M16 12h4 M4 16h4 M16 16h4" />
          <path stroke={accentColor} fill={fillAccent} d="M8 22v-8a4 4 0 0 1 8 0v8" />
        </svg>
      );
    case 'Delhi': // India Gate
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M3 22h18 M6 22V8l6-3 6 3v14 M6 10h12 M6 14h3 M15 14h3" />
          <path stroke={accentColor} fill={fillAccent} d="M9 22v-6a3 3 0 0 1 6 0v6" />
        </svg>
      );
    case 'Hyderabad': // Charminar
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M2 22h20 M5 22V4 M19 22V4 M4 4h2 M18 4h2 M6 12h12 M6 6h12 M8 6v6 M16 6v6" />
          <path stroke={accentColor} fill={fillAccent} d="M8 22v-5a4 4 0 0 1 8 0v5" />
        </svg>
      );
    case 'Bangalore': // Vidhana Soudha
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M2 22h20 M4 22v-6h16v6 M6 16v-5 M18 16v-5 M10 16v-5 M14 16v-5 M9 6h6" />
          <path stroke={accentColor} fill={fillAccent} d="M8 11V9a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case 'Kolkata': // Victoria Memorial
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M2 22h20 M4 22v-5h16v5 M12 2v2 M6 17v-4 M18 17v-4 M9 17v-4 M15 17v-4" />
          <path stroke={accentColor} fill={fillAccent} d="M8 13V8a4 4 0 0 1 8 0v5" />
        </svg>
      );
    case 'Pune': // Shaniwar Wada
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M2 22h20 M4 22v-8 M20 22v-8 M4 14l2-2v4 M20 14l-2-2v4 M6 16v6 M18 16v6 M6 16h12 M6 12h12" />
          <path stroke={accentColor} fill={fillAccent} d="M10 22v-4a2 2 0 0 1 4 0v4Z" />
        </svg>
      );
    case 'Chandigarh': // Open Hand
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M8 22v-6 M16 22v-6 M6 22h12" />
          <path stroke={accentColor} fill={fillAccent} d="M12 16c-3 0-4-3-4-5 0-1.5 1-2.5 2-3V6a2 2 0 0 1 4 0v2c1 0 2 1 2 2.5 0 2-1 5-4 5Z" />
        </svg>
      );
    case 'Ahmedabad': // Mosque/Dome
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
           <path stroke={main} d="M2 22h20 M4 22v-6h16v6 M12 8V4 M10 4h4 M7 16v-4 M17 16v-4" />
           <path stroke={accentColor} fill={fillAccent} d="M8 16V12a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case 'Navi Mumbai': // Typical CIDCO building / Exhibition Center
      return (
         <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M2 22h20 M4 22v-8h16v8 M6 14l6-4 6 4" />
          <path stroke={accentColor} fill={fillAccent} d="M10 22v-5h4v5" />
        </svg>
      );
    case 'Chennai': // Valluvar Kottam
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
           <path stroke={main} d="M2 22h20 M6 22v-4h12v4 M12 6V3 M10 3h4 M6 18l1-4 M18 18l-1-4 M5 22a1 1 0 1 0 2 0 M17 22a1 1 0 1 0 2 0" />
           <path stroke={accentColor} fill={fillAccent} d="M8 14l4-8 4 8H8Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className={className} strokeLinecap="round" strokeLinejoin="round">
          <path stroke={main} d="M2 22h20M6 22V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
          <path stroke={accentColor} fill={fillAccent} d="M10 22v-6h4v6M8 12h8" />
        </svg>
      );
  }
}
