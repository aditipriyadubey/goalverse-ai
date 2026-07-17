import { GoalCard } from '../components/GoalCard';

export function Home() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-pitch-dark sm:text-4xl">
        Welcome to the pitch.
      </h1>
      <p className="mt-2 max-w-2xl text-pitch-dark/80">
        Every gate, queue, and question is a play the stadium is already thinking through. Pick where you want
        to go — the field will do the rest.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GoalCard
          to="/navigator"
          title="Navigator"
          description={'Ask in plain language — \u201cwhere\u2019s my seat?\u201d, \u201cnearest halal food?\u201d — and get a route.'}
        />
        <GoalCard
          to="/crowd"
          title="Crowd Watch"
          description="Live gate density with card-style alerts and the fastest way around a jam."
        />
        <GoalCard
          to="/planner"
          title="Match Planner"
          description="A personalized match-day timeline built from your seat, transport, and arrival time."
        />
        <GoalCard
          to="/translate"
          title="Multilingual Assistant"
          description="Ask a question in any language and get it translated for staff or fellow fans, auto-detected."
        />
        <GoalCard
          to="/accessibility"
          title="Accessibility"
          description="Step-free routes, quiet zones, medical stations, and display settings that suit you."
        />
        <GoalCard
          to="/eco"
          title="Eco Score"
          description="See the CO₂ you save with greener transport and chase your next Green Goal."
        />
        <GoalCard
          to="/volunteer"
          title="Volunteer Desk"
          description="Log lost & found and incidents, and get an AI summary of what needs attention now."
        />
        <GoalCard
          to="/organizer"
          title="Control Room"
          description="Operational intelligence: peak predictions, staffing suggestions, incident trends."
        />
      </div>
    </div>
  );
}