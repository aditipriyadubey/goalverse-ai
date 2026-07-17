import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const LINKS = [
  { to: '/', key: 'navHome' },
  { to: '/navigator', key: 'navNavigator' },
  { to: '/crowd', key: 'navCrowd' },
  { to: '/planner', key: 'navPlanner' },
  { to: '/translate', key: 'navTranslate' },
  { to: '/accessibility', key: 'navAccessibility' },
  { to: '/eco', key: 'navEco' },
  { to: '/volunteer', key: 'navVolunteer' },
  { to: '/organizer', key: 'navOrganizer' },
] as const;

export function Nav() {
  const { t } = useLanguage();
  return (
    <nav aria-label="Primary" className="relative z-10 border-b border-pitch-dark/10 bg-field-white">
      <ul className="mx-auto flex max-w-5xl flex-wrap gap-1 overflow-x-auto px-2 py-2 sm:px-6">
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block whitespace-nowrap rounded-pitch px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-fifa-blue text-field-white'
                    : 'text-pitch-dark hover:bg-pitch/10'
                }`
              }
            >
              {t(link.key)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}