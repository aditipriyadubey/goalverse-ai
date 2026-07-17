import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="font-scoreboard text-6xl text-penalty-red" aria-hidden="true">
        <svg viewBox="0 0 40 28" className="mx-auto h-20 w-28 fill-penalty-red" aria-hidden="true">
          <rect width="40" height="28" rx="3" />
        </svg>
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-pitch-dark">Offside — page not found</h1>
      <p className="mt-2 text-pitch-dark/80">That route doesn't exist on this pitch.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-pitch bg-fifa-blue px-5 py-2 font-semibold text-field-white"
      >
        Back to the field
      </Link>
    </div>
  );
}
