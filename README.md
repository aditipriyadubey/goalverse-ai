# GoalVerse AI — Stadium Intelligence for FIFA World Cup 2026

---

## What is this project?

GoalVerse AI is a web app that helps everyone at a football stadium — fans, volunteers, and event organizers — navigate, communicate, and stay safe using artificial intelligence.

Think of it as a smart assistant that lives inside your phone, knows where your seat is, tells you which gate is least crowded, translates your question into any language, and keeps volunteers updated on what needs attention right now.

---

## The problem it solves

Large stadiums during a World Cup are chaotic:

- Fans get lost trying to find their seats, food stalls, or medical help
- Language barriers make it hard to ask for help
- Gates get dangerously crowded with no early warning
- Volunteers have no shared view of what incidents are happening
- Organizers can't easily predict where staff should be deployed next

---

## How GoalVerse AI solves it

Each problem above maps to one feature:

| Problem | Feature |
|---|---|
| Getting lost | Smart Navigator — ask in plain English, get turn-by-turn directions |
| Crowded gates | Crowd Watch — live density monitor with colour-coded alerts |
| Match-day planning | Match Planner — personal timeline from arrival to kickoff |
| Language barriers | Multilingual Assistant — type in any language, get an instant translation |
| Accessibility needs | Accessibility Assistant — step-free routes, quiet zones, facility map |
| Environmental impact | Eco Score — tracks CO₂ saved by using greener transport |
| Volunteer coordination | Volunteer Desk — log lost items and incidents; AI writes the briefing |
| Organizer oversight | Control Room — AI insight on peak traffic, staffing, incident trends |

All AI features work without a paid API key. If no `GEMINI_API_KEY` is set, every endpoint falls back to a realistic local mock response so the whole app is still usable end-to-end.

---

## Main features

- **Smart Navigator** — Natural language venue directions powered by Gemini
- **Crowd Watch** — Gate density heatmap with "red/yellow/green card" severity metaphor
- **Match Day Planner** — Personalized timeline (seat + transport + arrival time)
- **Multilingual Assistant** — Auto-detect language, translate free text
- **Accessibility Assistant** — Step-free routing, facility finder, display settings
- **Eco Score** — CO₂ tracking and gamified "Green Goal" progress
- **Volunteer Desk** — Lost & found log, incident reporter, AI operations summary
- **Control Room** — Organizer dashboard with AI peak/staffing predictions

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite via Prisma ORM |
| AI | Google Gemini (gemini-2.0-flash) with mock fallback |
| Testing (client) | Vitest, Testing Library, jest-axe |
| Testing (server) | Vitest |
| PWA | vite-plugin-pwa (service worker, offline shell) |
| Deployment | Vercel (client), Render/Railway/Fly.io (server) |

---

## Folder structure

```
goalverse-ai/
├── client/                  React + TypeScript frontend
│   ├── src/
│   │   ├── components/      Reusable UI (Nav, GoalCard, MatchCard, forms…)
│   │   ├── context/         React contexts (Accessibility, Language)
│   │   ├── hooks/           Custom hooks (useAsyncAction, useDebounce)
│   │   ├── i18n/            UI translations (English, Spanish, French, Arabic, Portuguese, Hindi)
│   │   ├── pages/           Route-level page components
│   │   ├── services/        API client
│   │   ├── tests/           Vitest test files
│   │   └── types/           Shared TypeScript types
│   └── public/              Static assets
│
├── server/                  Express + TypeScript backend
│   ├── src/
│   │   ├── db/              Prisma client singleton
│   │   ├── middleware/       Rate limiting, error handler, security headers
│   │   ├── routes/          One file per feature area
│   │   ├── services/        AI service (Gemini + mock fallback, caching, retries)
│   │   ├── tests/           Server-side Vitest tests
│   │   ├── types/           Zod schemas and shared types
│   │   └── utils/           Prompt sanitisation helper
│   └── prisma/              Schema and seed data
│
├── vercel.json              SPA routing config for Vercel
└── package.json             Monorepo root (npm workspaces)
```

---

## Local setup

**Requirements:** Node.js 18+, npm 8+

```bash
# 1. Install all dependencies
npm install

# 2. Set up environment variables
#    The file is already committed for local use; edit if you add a Gemini key
cp server/.env.example server/.env

# 3. Create and seed the database
npm run db:push --workspace=server
npm run db:seed --workspace=server

# 4. Start both servers
npm run dev
```

- Client: http://localhost:5173
- Server health check: http://localhost:4000/api/health

---

## Deployment

### Client (Vercel)

The React app is a standard Vite SPA. `vercel.json` is already configured. Connect the repo to Vercel and it deploys automatically. Set the **Root Directory** to `client`.

### Server

The Express server needs a host with a **persistent, writable filesystem** because it uses SQLite. Good free options:

- [Render](https://render.com) (free tier with persistent disk)
- [Railway](https://railway.app)
- [Fly.io](https://fly.io)

Set `DATABASE_URL`, `GEMINI_API_KEY`, `CLIENT_ORIGIN`, and `NODE_ENV=production` as environment variables on whichever host you choose.

> **Note:** Vercel serverless functions do not have a persistent filesystem, so the server cannot run on Vercel. Only the client goes there.

---

## AI usage

All AI calls go through `server/src/services/ai.ts`. This one file handles:

- Calling the Gemini API with structured prompts
- Retrying up to 3 times with exponential backoff on failure
- Caching responses for 60 seconds to avoid redundant API calls
- Validating the model's JSON output against a Zod schema
- Falling back to a deterministic local mock if validation fails or no API key is set

Every free-text field from the user is passed through `sanitizePromptInput` (in `server/src/utils/promptSanitizer.ts`) before being included in a prompt. This strips control characters and common prompt-injection phrases.

---

## Accessibility

- Skip-to-main-content link is the first element in the DOM
- Every interactive element has a visible focus ring
- All form inputs use `<label htmlFor>` associations, not just `aria-label`
- Color contrast meets WCAG AA (checked and enforced in the Tailwind palette)
- In-app settings panel: high contrast mode, reduced motion, dark mode, font scaling (85%–150%)
- `prefers-reduced-motion` respected at the CSS level regardless of the in-app toggle
- Screen reader announcements on route changes (WCAG 2.4.3)
- Crowd and incident severity uses the "referee card" colour metaphor — meaningful without colour alone
- All pages tested with `jest-axe` for automated accessibility violations

---

## Security

- **Helmet.js** with a strict Content Security Policy
- **CORS** locked to the configured client origin only
- **Rate limiting**: general limit + a stricter limit on AI endpoints to control cost
- **Zod** validates every request body before it reaches business logic
- **Centralized error handler** — stack traces never reach the client in production
- **Prompt sanitization** — strips control characters and injection phrases from all free-text fields
- No credentials or secrets are committed; `.env` is listed in `.gitignore`

---

## Testing

```bash
npm test                  # runs server tests + client tests
npm run test:server       # server only (Vitest, 40 tests)
npm run test:client       # client only (Vitest + Testing Library, 34 tests)
```

Client tests cover:

- Component rendering and link targets
- Accessibility violations (jest-axe) on every major form and page
- Context behaviour (Accessibility settings, Language switching)
- API client error handling
- Custom hook behaviour (useDebounce)

Server tests cover every route and the AI service mock/live paths.

---

## Future scope

- **Live seat upgrades** — notify fans of available better seats during the match
- **Lost child alert** — faster reunification workflow for families
- **Push notifications** — gate congestion alerts sent to the user's device
- **Offline-first sync** — queue volunteer logs when connectivity drops; sync on reconnect
- **Admin authentication** — proper login for the Organizer dashboard
- **Multi-stadium support** — venue configuration loaded from the database
