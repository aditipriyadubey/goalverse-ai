interface CornerFlagProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const POSITION_CLASSES: Record<CornerFlagProps['position'], string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0 -scale-x-100',
  'bottom-left': 'bottom-0 left-0 -scale-y-100',
  'bottom-right': 'bottom-0 right-0 -scale-x-100 -scale-y-100',
};

/** Purely decorative corner-flag motif that frames the pitch layout. */
export function CornerFlag({ position, className = '' }: CornerFlagProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 60 60"
      className={`pointer-events-none absolute h-14 w-14 opacity-90 ${POSITION_CLASSES[position]} ${className}`}
    >
      <path d="M4 56 L4 4" stroke="#F7FAF5" strokeWidth="3" strokeLinecap="round" />
      <path d="M4 8 L28 16 L4 24 Z" fill="#F0722E" />
      <circle cx="4" cy="56" r="14" fill="none" stroke="#F7FAF5" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}
