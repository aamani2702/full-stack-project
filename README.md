# 🌿 Bloom & Co. - Full Stack Project

A plant-shop web app built across all 12 curriculum modules: React frontend, Node/Express REST API, MongoDB, JWT auth.

## Run it locally
```bash
# Terminal 1 - API (http://localhost:5000). No database install needed: it uses an in-memory MongoDB and seeds demo data.
cd server && npm install && npm run dev

# Terminal 2 - React app (http://localhost:5173)
cd client && npm install && npm run dev
```
Open **http://localhost:5173**

| Role | Email | Password |
|---|---|---|
| Admin | admin@bloom.com | Admin@123 |
| User | demo@bloom.com | Demo@1234 |

To persist data, set `MONGODB_URI` in `server/.env` (see `.env.example`) and run `npm run seed`.

## Live demo (GitHub Pages)
**https://aamani2702.github.io/full-stack-project/** - the React client is deployed by `.github/workflows/deploy-pages.yml` on every push to `main`; the API runs on Render.

To enable it: repo **Settings -> Pages -> Source: GitHub Actions**, add the repository variable `VITE_API_URL` (your Render API URL ending in `/api`), and set `CLIENT_ORIGIN=https://aamani2702.github.io` on Render. Details in `docs/deployment.md`.

## Module map
| Module | Where |
|---|---|
| 1 Web fundamentals | `static-site/index.html`, `docs/web-workflow-report.md` |
| 2 HTML | `static-site/*.html` (Home, About, Contact, Sign up, Log in) |
| 3 CSS | `static-site/style.css` (flexbox, grid, media queries) |
| 4 JavaScript | `static-site/script.js` (validation, alerts, cookies, localStorage, redirects) |
| 5 DOM | `static-site/tools.html` (to-do list + calculator) |
| 6 Bootstrap | `bootstrap-site/` (open `index.html` in a browser) |
| 7 React basics | `client/src/components`, `pages` (props, forms) |
| 8 React advanced | `client/src/pages/Explore.jsx` (DummyJSON), `Journal.jsx` + `Dashboard.jsx` (CRUD), tests (`npm test`) |
| 9 Databases | `database/schema.sql`, `queries.sql`, `mongodb-collections.md` |
| 10 Backend | `server/server.js`, `server/src/routes` |
| 11 Auth & deploy | `server/src/routes/auth.js`, `middleware/auth.js`, `docs/auth-flow.md`, `docs/deployment.md` |
| 12 Final project | `client/` + `server/` together |

## API
`POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`
`GET/POST /api/products` · `GET/PUT/DELETE /api/products/:id` (writes: admin)
`GET/POST /api/posts` · `PUT/DELETE /api/posts/:id` (owner or admin)

## Deliverables still to produce by hand
Screenshots, Postman screenshots, the PDF report, the live URL and your GitHub repo link.