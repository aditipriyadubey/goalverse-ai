import { useAccessibility } from '../context/AccessibilityContext';

export function AccessibilityPanel() {
  const {
    highContrast,
    reducedMotion,
    darkMode,
    fontScale,
    toggleHighContrast,
    toggleReducedMotion,
    toggleDarkMode,
    increaseFontScale,
    decreaseFontScale,
    resetFontScale,
  } = useAccessibility();

  return (
    <section
      aria-labelledby="a11y-panel-heading"
      className="hc-invert rounded-pitch border-2 border-fifa-blue/30 bg-field-white p-5 shadow-md"
    >
      <h2 id="a11y-panel-heading" className="font-scoreboard text-lg uppercase text-fifa-blue">
        Accessibility settings
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-3 rounded-pitch border border-pitch/20 p-3">
          <span>High contrast mode</span>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={toggleHighContrast}
            aria-describedby="hc-desc"
          />
        </label>
        <p id="hc-desc" className="sr-only">
          Switches the whole app to a pure black background with yellow text and links.
        </p>

        <label className="flex items-center justify-between gap-3 rounded-pitch border border-pitch/20 p-3">
          <span>Reduce motion</span>
          <input type="checkbox" checked={reducedMotion} onChange={toggleReducedMotion} />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-pitch border border-pitch/20 p-3">
          <span>Dark mode</span>
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        </label>

        <div className="flex items-center justify-between gap-3 rounded-pitch border border-pitch/20 p-3">
          <span id="font-scale-label">Text size ({Math.round(fontScale * 100)}%)</span>
          <div className="flex items-center gap-2" role="group" aria-labelledby="font-scale-label">
            <button
              type="button"
              onClick={decreaseFontScale}
              className="rounded-pitch border border-fifa-blue px-2 py-1 text-sm font-semibold"
              aria-label="Decrease text size"
            >
              A−
            </button>
            <button
              type="button"
              onClick={resetFontScale}
              className="rounded-pitch border border-fifa-blue px-2 py-1 text-xs font-semibold"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={increaseFontScale}
              className="rounded-pitch border border-fifa-blue px-2 py-1 text-sm font-semibold"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
