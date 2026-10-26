# FitSync

FitSync is a fitness tracker for logging meals and body weight, calculating daily calorie needs, and asking an AI coach for advice. It ships as a Next.js web app and an Expo mobile app that share the same API and accounts.

Live site: https://fitsyncfix.vercel.app

## Features

- Nutrition log with calories, protein, carbs, and fat per meal (breakfast, lunch, dinner, snack), plus a list of common foods for quick entry
- Weight log and a target weight goal on the progress page
- BMR and TDEE calculated from your profile (Mifflin-St Jeor equation with an activity multiplier), recalculated when you log a new weight
- Dashboard summary of the day's intake, recent weights, and goal progress
- AI coach chat backed by Google Gemini
- iOS and Android app in `mobile/` with the same screens: dashboard, nutrition, progress, coach, and profile

The database schema has tables for workouts and exercises, and the dashboard shows a "Workouts This Week" count, but there is no workout logging UI or API yet, so that count stays at zero unless rows are added to the database directly.

## Tech stack

- Web: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS
- API: Next.js route handlers, Prisma 5, PostgreSQL
- Auth: NextAuth.js with email and password (bcrypt), JWT bearer tokens for the mobile app
- AI: Google Gemini via `@google/generative-ai`
- Mobile: Expo, React Native, React Navigation, `expo-secure-store`

## Getting started

Prerequisites: Node.js 20 and a PostgreSQL database.

Create `.env.local` in the repo root with these variables (there is no `.env.example`):

- `DATABASE_URL`: Postgres connection string
- `DIRECT_DATABASE_URL`: direct (non-pooled) Postgres connection string, used by Prisma migrations
- `NEXTAUTH_SECRET`: secret for signing sessions and mobile tokens
- `NEXTAUTH_URL`: base URL of the app, for example `http://localhost:3000`
- `GEMINI_API_KEY`: Google Gemini API key for the coach

Install, set up the database, and run the web app:

```
npm install
npm run db:push
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm run db:migrate`, `npm run db:studio`.

To run the mobile app:

```
cd mobile
npm install
npx expo start
```

The mobile app talks to `https://fitsyncfix.vercel.app` by default. To point it at a local server, set `EXPO_PUBLIC_API_URL`, for example `EXPO_PUBLIC_API_URL=http://192.168.1.10:3000 npx expo start`.

There are no automated tests. CI (`.github/workflows/ci.yml`) runs `npm run build` for the web app, and `npm run typecheck` plus `npx expo export` for the mobile app.

## How it works

- `app/` holds the web pages (`dashboard`, `nutrition`, `progress`, `profile`, `chat`, `sign-in`, `sign-up`) and the API under `app/api/` (`nutrition`, `weight`, `profile`, `summary`, `chat`, `auth`).
- `middleware.ts` requires a session for the dashboard, nutrition, progress, profile, and chat pages.
- `lib/session.ts` resolves the current user from either a NextAuth session cookie (web) or a `Bearer` token (mobile). The mobile app gets its token from `app/api/mobile/login` and stores it with `expo-secure-store`.
- `lib/fitness.ts` contains the BMR/TDEE math and food presets. `lib/weight.ts` syncs the latest logged weight back to the user profile and target weight goal.
- `lib/gemini.ts` wraps the Gemini chat calls used by `app/api/chat`.
- `prisma/schema.prisma` defines the data model.

## Project structure

```
app/         Next.js pages and API routes
components/  Shared React components and the chat UI
lib/         Auth, database client, fitness math, Gemini client
prisma/      Prisma schema
mobile/      Expo app (see mobile/README.md)
```

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `npm run lint`, `npm run typecheck`, and `npm run build` in the root, and `npm run typecheck` in `mobile/` if you changed the app.

## License

MIT. See [LICENSE](LICENSE).
