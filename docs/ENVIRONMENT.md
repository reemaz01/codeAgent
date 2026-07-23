# ENVIRONMENT.md — codeAgent

*All environment variables, tools, and configuration in one place.*

## Environment Variables

### `server/.env` (gitignored — never committed)

| Variable | Purpose | Example |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API key — used server-side only by `llmClient.js` (built Day 4+) | `sk-ant-...` |
| `PORT` | Port the Express server listens on | `5000` |

### `client/.env` (gitignored — not yet created, needed once deployed)

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL the frontend calls for the backend API. Defaults to `http://localhost:5000/api` in code if unset — only needs setting for production/deployed builds. | `https://codeagent-api.onrender.com/api` |

## Runtime Versions (confirmed working, Day 2)

- Node.js: v22.14.0
- npm: v11.4.1

## Key npm Packages

### Backend (`server/package.json`)
| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `cors` | Allows the frontend origin to call the backend |
| `dotenv` | Loads `.env` variables |
| `@anthropic-ai/sdk` | Claude API client (used from Day 4 onward) |
| `simple-git` | Programmatic `git clone` for GitHub URL ingestion |
| `multer` | Handles ZIP file uploads (multipart/form-data) |
| `adm-zip` | Extracts uploaded ZIP contents |
| `uuid` | Generates session IDs |
| `nodemon` (dev) | Auto-restarts server on file changes |

### Frontend (`client/package.json`)
| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI framework |
| `vite` | Dev server + build tool |

## Session Storage

No database. In-memory `Map<sessionId, SessionState>` in `server/src/store/sessionStore.js`, with a 2-hour TTL and cleanup interval every 30 minutes. See `docs/SCHEMA.md` for the full shape.

## Hosting Targets (planned, not yet deployed)

- **Frontend:** Vercel (free tier)
- **Backend:** Render (free tier)

Deployment happens per the Blueprint schedule — early skeleton deploy was planned for Day 2 but deferred; should happen no later than Day 5–6 to catch config issues early, well before Day 10.

## IDE Setup

- VS Code, no required extensions beyond what ships by default (though Prettier and an ESLint extension are recommended — `eslint.config.js` is already present in `client/`).
