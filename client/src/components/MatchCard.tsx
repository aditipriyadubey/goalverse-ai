
import { memo } from 'react';

interface MatchCardProps {
  level: 'green' | 'yellow' | 'orange' | 'red';
  title: string;
  children?: React.ReactNode;
}

const LEVEL_STYLES: Record<MatchCardProps['level'], { bg: string; label: string; text: string }> = {
  green: { bg: 'bg-pitch-light', label: 'Flowing well', text: 'text-pitch-dark' },
  yellow: { bg: 'bg-trophy-gold', label: 'Yellow card — building up', text: 'text-pitch-dark' },
  // bg-cheer-orangeDark (not bg-cheer-orange) is required here: field-white
  // text on the base orange is 2.79:1 and fails WCAG AA (needs 4.5:1); the
  // "Dark" variant is 4.75:1. See tailwind.config.js for the contrast note.
  orange: { bg: 'bg-cheer-orangeDark', label: 'Orange card — congested', text: 'text-field-white' },
  red: { bg: 'bg-penalty-red', label: 'Red card — overloaded', text: 'text-field-white' },
};

/**
 * Crowd density and incident severity are communicated with the referee's
 * card metaphor from the brief — instantly legible to anyone who follows
 * football, regardless of language.
 *
 * Wrapped in React.memo: CrowdHeatmapPage renders one of these per gate on
 * a 30s poll interval, and only the polled gate's own props actually change.
 */
function MatchCardImpl({ level, title, children }: MatchCardProps) {
  const style = LEVEL_STYLES[level];
  return (
    <div
      role="status"
      className={`rounded-pitch border-2 border-pitch-dark/10 p-4 shadow-md ${style.bg} ${style.text}`}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`inline-block h-4 w-3 rounded-sm ${level === 'green' ? 'bg-pitch-dark/20' : 'bg-pitch-dark/25'}`}
        />
        <p className="text-xs font-semibold uppercase tracking-wide">{style.label}</p>
      </div>
      <p className="mt-1 font-scoreboard text-lg">{title}</p>
      {children}
    </div>
  );
}

export const MatchCard = memo(MatchCardImpl);