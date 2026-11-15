# Module 11 - Deployment guide

## 1. Database - MongoDB Atlas (free)
Create a free cluster, a database user, allow network access (0.0.0.0/0 for a demo), and copy the connection string.

## 2. Backend - Render (Web Service)
- Root directory: `server`
- Build command: `npm install` - Start command: `node server.js`
- Environment variables:
  - `MONGODB_URI` = your Atlas string (append `/bloom` as the db name)
  - `JWT_SECRET` = a long random string
  - `CLIENT_ORIGIN` = `https://aamani2702.github.io` (origin only - no path, no trailing slash; comma-separate to also allow `http://localhost:5173`)
- After the first deploy, seed once from your machine: set `MONGODB_URI` in `server/.env` then run `npm run seed`.

## 3. Frontend - GitHub Pages
Live URL: **https://aamani2702.github.io/full-stack-project/**

- The workflow `.github/workflows/deploy-pages.yml` builds `client/` and deploys `client/dist` on every push to `main`.
- One-time setup in the GitHub repo:
  1. **Settings -> Pages -> Source: GitHub Actions**.
  2. **Settings -> Secrets and variables -> Actions -> Variables** -> add repository variable `VITE_API_URL` = `https://<your-render-app>.onrender.com/api`.
  3. Push to `main` (or re-run the workflow from the Actions tab).
- Production builds use Vite `base: '/full-stack-project/'`; local dev (`npm run dev`) still serves from `/` and proxies `/api` to `localhost:5000`.
- The app uses `HashRouter` (URLs look like `.../full-stack-project/#/shop`), so refreshes and deep links work without server rewrites. (`client/public/_redirects` is only needed for Netlify and is harmless here.)

## 4. Verify
Open https://aamani2702.github.io/full-stack-project/, log in with `demo@bloom.com` / `Demo@1234`, post in the Journal.
