# Aura Hospital — Frontend

Public hospital website and admin dashboard for Aura Hospital. The app loads page content from the backend API and lets staff manage that content, appointments, and doctor schedules after signing in.

## Stack

- React 19 and TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- Framer Motion and Lucide icons
- Poppins (`@fontsource/poppins`)

## Requirements

- Node.js 20 or newer
- The backend API running and reachable (see `backend/README.md`)

## Setup

From this folder:

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server starts at [http://localhost:5173](http://localhost:5173).

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the API, including the `/api` prefix |

Local example (already in `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

The app throws on startup if `VITE_API_URL` is missing. Image paths returned by the API are resolved against that URL’s origin (`src/lib/api.ts`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check, then build for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

Production builds are a static SPA. `vercel.json` rewrites every path to `index.html` so client-side routes work on Vercel.

## Public routes

| Path | Page |
| --- | --- |
| `/` | Home (hero, help, about, services, testimonials, why choose us, lab tests, doctors, articles) |
| `/about` | About |
| `/contact` | Contact form and hospital info |
| `/faq` | FAQs |
| `/book-appointment` | Book, look up, and cancel an appointment |
| `/services/:slug` | Service details |
| `/doctors/:doctorSlug` | Doctor profile |
| `/articles/:articleSlug` | Article |

Public data is fetched in `src/lib/api.ts`. Successful responses use `{ success, data }`.

## Admin

Sign-in is at `/admin/login`. The seeded admin email is `admin@aurahospital.com`. The password is the value of `ADMIN_SEED_PASSWORD` on the backend.

After login, the JWT is stored in `localStorage` as `adminToken` and sent as `Authorization: Bearer …` from `src/admin/services/adminApi.ts`. Routes under `/admin` (except login) are wrapped in `ProtectedAdminRoute`.

| Path | Manages |
| --- | --- |
| `/admin` | Dashboard |
| `/admin/profile` | Signed-in admin |
| `/admin/appointments` | Appointments |
| `/admin/doctor-schedules` | Weekly hours, breaks, and unavailability |
| `/admin/services` | Services |
| `/admin/doctors` | Doctors |
| `/admin/articles` | Articles |
| `/admin/faqs` | FAQs |
| `/admin/testimonials` | Testimonials |
| `/admin/help-cards` | Help cards |
| `/admin/why-choose-us` | Why choose us items |
| `/admin/lab-tests` | Lab tests |
| `/admin/site-settings` | Hospital name, contact, hours, map |
| `/admin/about` | About page content |
| `/admin/social-media` | Social links |
| `/admin/footer-columns` and `/admin/footer-links` | Footer |
| `/admin/navbar-columns` and `/admin/navbar-links` | Navbar |

## Layout

```text
src/
  pages/          Public pages
  components/     Public sections (home, about, contact, doctor, service)
  lib/api.ts      Public API client
  types/api.ts    Shared response types
  admin/
    pages/        Admin screens
    components/   Layout, auth guard, shared UI
    services/     Authenticated API client
```
