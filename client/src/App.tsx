import { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { LanguageProvider } from './context/LanguageContext';
import { ScoreboardHeader } from './components/ScoreboardHeader';
import { Nav } from './components/Nav';
import { SkipLink } from './components/SkipLink';
import { PitchBackground } from './components/PitchBackground';
import { CornerFlag } from './components/CornerFlag';

// Code-split every route: only the page the fan is actually looking at
// ships to the browser, keeping first load lean.
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Navigator = lazy(() => import('./pages/Navigator').then((m) => ({ default: m.NavigatorPage })));
const CrowdHeatmap = lazy(() => import('./pages/CrowdHeatmap').then((m) => ({ default: m.CrowdHeatmapPage })));
const MatchPlanner = lazy(() => import('./pages/MatchPlanner').then((m) => ({ default: m.MatchPlannerPage })));
const Translate = lazy(() => import('./pages/Translate').then((m) => ({ default: m.TranslatePage })));
const AccessibilityPage = lazy(() =>
  import('./pages/AccessibilityPage').then((m) => ({ default: m.AccessibilityPage })),
);
const EcoScore = lazy(() => import('./pages/EcoScore').then((m) => ({ default: m.EcoScorePage })));
const VolunteerDashboard = lazy(() =>
  import('./pages/VolunteerDashboard').then((m) => ({ default: m.VolunteerDashboardPage })),
);
const OrganizerDashboard = lazy(() =>
  import('./pages/OrganizerDashboard').then((m) => ({ default: m.OrganizerDashboardPage })),
);
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function PageFallback() {
  return (
    <div role="status" aria-live="polite" className="p-8 text-center text-pitch-dark">
      Loading…
    </div>
  );
}

/**
 * Moves keyboard/screen-reader focus to the main region on every route
 * change and announces the new location via a visually-hidden live region.
 * Without this, an SPA route change is silent and invisible to anyone not
 * looking at the screen — the URL changes but focus stays wherever it was
 * (or resets to <body>), which fails WCAG 2.4.3 (Focus Order) in practice.
 */
function useRouteChangeAnnouncement(mainRef: React.RefObject<HTMLElement>) {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [location.pathname, mainRef]);
}

function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  useRouteChangeAnnouncement(mainRef);

  return (
    <div className="relative min-h-screen">
      <ScoreboardHeader />
      <Nav />
      <div className="relative overflow-hidden">
        <PitchBackground className="opacity-[0.08]" />
        <CornerFlag position="top-left" />
        <CornerFlag position="top-right" />
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6"
        >
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/navigator" element={<Navigator />} />
              <Route path="/crowd" element={<CrowdHeatmap />} />
              <Route path="/planner" element={<MatchPlanner />} />
              <Route path="/translate" element={<Translate />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/eco" element={<EcoScore />} />
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <CornerFlag position="bottom-left" />
        <CornerFlag position="bottom-right" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <SkipLink />
        <AppShell />
      </LanguageProvider>
    </AccessibilityProvider>
  );
}