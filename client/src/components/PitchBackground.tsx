/**
 * The signature visual element of GoalVerse AI: a full football pitch
 * rendered as a quiet SVG backdrop. Line markings (halfway line, center
 * circle, penalty arcs) give every page the unmistakable feeling of
 * standing on the field, without competing with foreground content.
 */
export function PitchBackground({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <rect x="0" y="0" width="400" height="260" fill="#1B7A3D" />
      {/* Mowed-stripe texture */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={i * 40} y="0" width="20" height="260" fill="#ffffff" opacity="0.035" />
      ))}
      <rect x="10" y="10" width="380" height="240" fill="none" stroke="#F7FAF5" strokeOpacity="0.55" strokeWidth="2" />
      <line x1="200" y1="10" x2="200" y2="250" stroke="#F7FAF5" strokeOpacity="0.55" strokeWidth="2" />
      <circle cx="200" cy="130" r="34" fill="none" stroke="#F7FAF5" strokeOpacity="0.55" strokeWidth="2" />
      <circle cx="200" cy="130" r="2.5" fill="#F7FAF5" fillOpacity="0.55" />
      {/* Left penalty box + arc */}
      <rect x="10" y="70" width="55" height="120" fill="none" stroke="#F7FAF5" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M65 95 A 34 34 0 0 1 65 165" fill="none" stroke="#F7FAF5" strokeOpacity="0.55" strokeWidth="2" />
      {/* Right penalty box + arc */}
      <rect x="335" y="70" width="55" height="120" fill="none" stroke="#F7FAF5" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M335 95 A 34 34 0 0 0 335 165" fill="none" stroke="#F7FAF5" strokeOpacity="0.55" strokeWidth="2" />
    </svg>
  );
}
