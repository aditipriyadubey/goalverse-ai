import { memo } from 'react';
import { Link } from 'react-router-dom';

interface GoalCardProps {
  to: string;
  title: string;
  description: string;
}

/**
 * Each feature is presented as a "goal" a fan can walk toward — the
 * navigation metaphor named in the product brief. Rendered as a real
 * link (not a div+onClick) so it's reachable and operable by keyboard
 * and announced correctly by screen readers.
 *
 * Wrapped in React.memo: the Home page renders 8 of these from a static
 * list, and none of their props change after mount, so re-renders of the
 * parent (e.g. language switching) shouldn't re-render every card's DOM.
 */
function GoalCardImpl({ to, title, description }: GoalCardProps) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-2 rounded-pitch border-2 border-field-white/70 bg-pitch-dark/90 p-5 text-field-white shadow-lg transition-transform hover:-translate-y-1 hover:border-trophy-gold focus-visible:-translate-y-1"
    >
      <span className="font-scoreboard text-lg uppercase tracking-wide text-trophy-gold">{title}</span>
      <span className="text-sm text-field-white/85">{description}</span>
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 h-2 w-2 rounded-full bg-cheer-orange opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}

export const GoalCard = memo(GoalCardImpl);