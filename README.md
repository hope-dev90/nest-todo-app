# Taskify Frontend

React frontend for the Taskify notes + agenda app. Connects to the NestJS backend.

## Tech stack
- React 18 + React Router v6
- Axios (API calls with JWT interceptors)
- date-fns (date formatting)
- Clash Display + Satoshi fonts (Google Fonts)

## Project structure

```
src/
├── context/
│   ├── AuthContext.js      # Global auth state + login/register/logout
│   └── ToastContext.js     # Toast notifications
├── services/
│   └── api.js              # All axios calls to NestJS API
├── components/
│   ├── layout/
│   │   ├── AppLayout.js    # Sidebar + topbar wrapper
│   │   └── Sidebar.js      # Navigation sidebar
│   └── ui/
│       ├── NoteModal.js    # Create/edit note modal
│       ├── MiniCalendar.js # Mini calendar widget
│       └── ProtectedRoute.js
├── pages/
│   ├── Login.js
│   ├── Register.js
│   ├── ForgotPassword.js
│   ├── Dashboard.js        # Overview with stats + recent notes
│   ├── Notes.js            # Full notes grid with search
│   └── Agenda.js           # Calendar + timeline view
├── App.js                  # Routes
├── index.js
└── index.css               # Full design system
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure backend URL
cp .env.example .env
# Edit .env → set REACT_APP_API_URL=http://localhost:3000

# 3. Run dev server
npm start

# 4. Build for production
npm run build
```

## NestJS backend expectations

The frontend expects these endpoints:

| Method | Path                    | Auth     | Description          |
|--------|-------------------------|----------|----------------------|
| POST   | /auth/register          | Public   | { name, email, password } → { access_token, user } |
| POST   | /auth/login             | Public   | { email, password } → { access_token, user } |
| POST   | /auth/forgot-password   | Public   | { email } |
| GET    | /notes?search=          | JWT      | Returns Note[] |
| POST   | /notes                  | JWT      | Creates note |
| PATCH  | /notes/:id              | JWT      | Updates note |
| DELETE | /notes/:id              | JWT      | Deletes note |

## Auth flow

1. Register/Login → backend returns `{ access_token, user }`
2. Token stored in `localStorage` as `token`
3. Every API request gets `Authorization: Bearer <token>` header automatically
4. On 401 response → auto-logout + redirect to `/login`

## Pages

- `/login` — Sign in
- `/register` — Create account  
- `/forgot-password` — Request password reset email
- `/dashboard` — Overview: stats, recent notes, mini calendar, today's agenda
- `/notes` — Full notes page: search, create, edit, delete, pin
- `/agenda` — Calendar view with day-by-day timeline
