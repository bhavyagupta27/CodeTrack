# CodeTrack

Placement preparation dashboard with a static HTML/CSS/JS frontend and Express + MongoDB backend.

## Run locally

### Backend
```bash
cd Backend
npm install
copy .env.example .env
npm start
```

Set `MONGO_URI` in `.env`.

### Frontend
Open `Frontend/index.html` with VS Code Live Server.

Demo login: `admin@gmail.com` / `123456` **only if that user exists in your database**.

## Render deployment

### Backend
- New Web Service
- Root Directory: `Backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Add `MONGO_URI` as an Environment Variable
- Do not upload `.env`

### Frontend
- New Static Site
- Root Directory: `Frontend`
- Build Command: leave blank
- Publish Directory: `.`
- Update `API_BASE` in `js/login.js` and `js/dashboard.js` to your deployed backend URL.

## Security
`.env` is intentionally excluded from this ZIP. Never commit database credentials to GitHub.
