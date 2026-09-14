// src/components/common/FarmLogo.tsx
// Exact vector implementation of the user-provided circular farm emblem logo

import React from "react";

interface FarmLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
  textClassName?: string;
  subtext?: string;
  variant?: "full" | "icon-only";
}

const sizeMap = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-24 h-24",
};

export const FarmLogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="FarmIntel Logo Emblem"
    >
      {/* Outer Decorative Concentric Top-Left Arc */}
      <path
        d="M 120 235 A 185 185 0 0 1 242 25"
        stroke="#166534"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Inner Decorative Concentric Top-Left Arc */}
      <path
        d="M 136 235 A 168 168 0 0 1 238 42"
        stroke="#166534"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Right Circular Perimeter Arc */}
      <path
        d="M 256 42 A 168 168 0 0 1 418 245"
        stroke="#15803d"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Horizon Line & Agricultural Field Base */}
      {/* Upper Swath (Agricultural Green) */}
      <path
        d="M 118 245 C 175 232 255 240 405 285 A 168 168 0 0 1 360 348 C 285 285 205 255 122 252 Z"
        fill="#16a34a"
      />

      {/* Separator Path / Furrow Curve (Crisp White Divider) */}
      <path
        d="M 120 248 C 200 252 280 282 360 348 L 350 354 C 275 288 198 258 120 254 Z"
        fill="#ffffff"
      />

      {/* Lower Swath (Deep Forest Emerald Green) */}
      <path
        d="M 122 252 C 198 258 275 288 350 354 A 168 168 0 0 1 250 378 A 168 168 0 0 1 122 252 Z"
        fill="#14532d"
      />

      {/* Left Deciduous Trees */}
      <line x1="175" y1="218" x2="175" y2="236" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
      <circle cx="175" cy="214" r="11" fill="#14532d" />
      <line x1="193" y1="222" x2="193" y2="238" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="193" cy="218" r="9" fill="#14532d" />

      {/* Right Poplar / Cypress Trees */}
      <line x1="355" y1="242" x2="355" y2="265" stroke="#166534" strokeWidth="3.5" strokeLinecap="round" />
      <path
        d="M 355 212 C 365 224 365 240 355 244 C 345 240 345 224 355 212 Z"
        fill="#166534"
      />
      <line x1="375" y1="248" x2="375" y2="270" stroke="#166534" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M 375 220 C 384 230 384 244 375 248 C 366 244 366 230 375 220 Z"
        fill="#166534"
      />
    </svg>
  );
};

export const FarmLogo: React.FC<FarmLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  textClassName = "",
  subtext,
  variant = "full",
}) => {
  const iconSizeClass = sizeMap[size] || sizeMap.md;

  if (variant === "icon-only" || !showText) {
    return <FarmLogoIcon className={`${iconSizeClass} ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center space-x-3 ${className}`}>
      <div className="relative p-1 rounded-2xl bg-white shadow-xs border border-stone-200/80 hover:shadow-md transition-shadow">
        <FarmLogoIcon className={iconSizeClass} />
      </div>
      <div>
        <div className={`flex items-center space-x-1.5 font-bold tracking-tight text-stone-900 font-serif ${textClassName}`}>
          <span className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Farm<span className="text-emerald-700">Intel</span>
          </span>
        </div>
        {subtext && <p className="text-[11px] text-stone-500 -mt-0.5 leading-tight">{subtext}</p>}
      </div>
    </div>
  );
};

export default FarmLogo;
