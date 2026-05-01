import React from "react";

interface DgionLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const DgionLogo: React.FC<DgionLogoProps> = ({ 
  className = "", 
  size = 40,
  color = "#837FFB"
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer futuristic ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        stroke={color} 
        strokeWidth="2" 
        strokeDasharray="10 5"
        className="animate-[spin_10s_linear_infinite]"
      />
      
      {/* Core "D" shape formed by architecture lines */}
      <path 
        d="M30 25V75H50C63.8071 75 75 63.8071 75 50C75 36.1929 63.8071 25 50 25H30Z" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Internal "G" curve / data line */}
      <path 
        d="M50 40C50 40 60 40 60 50C60 60 50 60 50 60H40" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Floating data points */}
      <circle cx="50" cy="50" r="4" fill="white" className="animate-pulse" />
      <circle cx="75" cy="50" r="2" fill={color} />
      <circle cx="30" cy="25" r="2" fill={color} />
      <circle cx="30" cy="75" r="2" fill={color} />
    </svg>
  );
};
