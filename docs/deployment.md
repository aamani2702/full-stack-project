# Module 11 - Deployment guide

## 1. Database - MongoDB Atlas (free)
Create a free cluster, a database user, allow network access (0.0.0.0/0 for a demo), and copy the connection string.

## 2. Backend - Render (Web Service)
- Root directory: `server`
- Build command: `npm install` - Start command: `node server.js`
- Environment variables:
  - `MONGODB_URI` = your Atlas string (append `/bloom` as the db name)
  - `JWT_SECRET` = a long random string
  - `CLIENT_ORIGIN` = your Netlify URL (no trailing slash)
- After the first deploy, seed once from your machine: set `MONGODB_URI` in `server/.env` then run `npm run seed`.

## 3. Frontend - Netlify
- Base directory: `client`, build command: `npm run build`, publish directory: `client/dist`
- Environment variable: `VITE_API_URL` = `https://<your-render-app>.onrender.com/api`
- `client/public/_redirects` already makes React Router work on refresh.

## 4. Verify
Open the Netlify URL, log in with `demo@bloom.com` / `Demo@1234`, post in the Journal.
