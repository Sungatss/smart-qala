import React from 'react';

interface SemeyBridgeLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Semey Suspension Bridge (Семей аспалы көпірі) brand logo icon.
 * Features the two suspension pylons, the catenary main cables,
 * vertical suspenders, bridge roadway, and river waves beneath.
 */
export function SemeyBridgeLogo({
  size = 20,
  className = '',
  ...props
}: SemeyBridgeLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Bridge Roadway Deck */}
      <line x1="1.5" y1="16" x2="22.5" y2="16" strokeWidth="2.2" />

      {/* Main Suspension Cables */}
      <path d="M 2 13.5 Q 4.5 8 7 5" strokeWidth="1.8" />
      <path d="M 7 5 Q 12 13.5 17 5" strokeWidth="1.8" />
      <path d="M 17 5 Q 19.5 8 22 13.5" strokeWidth="1.8" />

      {/* Left Pylon Tower */}
      <line x1="7" y1="4" x2="7" y2="17" strokeWidth="2.2" />
      <line x1="5.5" y1="10" x2="8.5" y2="10" strokeWidth="1.8" />

      {/* Right Pylon Tower */}
      <line x1="17" y1="4" x2="17" y2="17" strokeWidth="2.2" />
      <line x1="15.5" y1="10" x2="18.5" y2="10" strokeWidth="1.8" />

      {/* Vertical Suspender Hangers */}
      <line x1="4.5" y1="10" x2="4.5" y2="16" strokeWidth="1.2" />
      <line x1="9.5" y1="9.5" x2="9.5" y2="16" strokeWidth="1.2" />
      <line x1="12" y1="11.5" x2="12" y2="16" strokeWidth="1.2" />
      <line x1="14.5" y1="9.5" x2="14.5" y2="16" strokeWidth="1.2" />
      <line x1="19.5" y1="10" x2="19.5" y2="16" strokeWidth="1.2" />

      {/* River Irtysh Water Waves */}
      <path d="M 3 19.5 Q 6 18.5 9 19.5 T 15 19.5 T 21 19.5" strokeWidth="1.4" opacity="0.75" />
    </svg>
  );
}

export default SemeyBridgeLogo;
