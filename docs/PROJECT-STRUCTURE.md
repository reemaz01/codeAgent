# PROJECT-STRUCTURE.md — codeAgent

*Originally a Day 2 deliverable; updated Day 3 to reflect actual implementation status. This is the map Days 3–10 place new code into; no restructuring should happen without a strong reason.*

## Implementation Status (updated Day 3)

✅ **Built and verified:** `server/src/store/sessionStore.js`, `server/src/utils/fileTree.js`, `server/src/services/ingestionService.js`, `server/src/routes/repo.js`, `client/src/api/index.js`, `client/src/context/SessionContext.jsx`, `client/src/components/RepoInput.jsx`

⬜ **Still planned (Day 4+):** everything under `server/src/services/` except `ingestionService.js`, all remaining `routes/*.js` files, all remaining `client/src/components/*` screens, `llmClient.js`

---

## 1. Full Structure

```
codeAgent/
├── README.md                      # Project name, description, live URLs, setup steps
├── NAMING.md                      # Chosen project name + short rationale
├── ARCHITECTURE.md                # This Day 2 deliverable set
├── SCHEMA.md
├── API.md
├── UI-WIREFRAMES.md
├── PROJECT-STRUCTURE.md
├── .gitignore                     # node_modules, .env, temp session dirs, build output
│
├── client/                        # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js           # API client — all fetch calls to backend, base URL from env var
│   │   ├── components/
│   │   │   ├── StepIndicator.jsx  # Persistent 1-9 progress shell
│   │   │   ├── RepoInput/         # Screen 1
│   │   │   ├── AnalysisView/      # Screen 2
│   │   │   ├── TaskInput/         # Screen 3
│   │   │   ├── PlanReview/        # Screen 4
│   │   │   ├── DiffViewer/        # Screen 5
│   │   │   ├── SelfReview/        # Screen 6
│   │   │   ├── ExportPanel/       # Screen 7
│   │   │   └── DocsPanel/         # Screen 8
│   │   ├── context/
│   │   │   └── SessionContext.jsx # Holds sessionId + all step state client-side
│   │   ├── App.jsx                # Top-level shell, renders StepIndicator + current step
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env                       # VITE_API_BASE_URL (gitignored)
│   ├── package.json
│   └── vite.config.js
│
├── server/                        # Node + Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── health.js          # GET /api/health
│   │   │   ├── repo.js            # POST /api/repo/from-url, /from-zip
│   │   │   ├── analysis.js        # POST /api/analysis/:sessionId
│   │   │   ├── plan.js            # POST /api/plan/:sessionId, /approve
│   │   │   ├── generate.js        # POST /api/generate/:sessionId
│   │   │   ├── review.js          # POST /api/review/:sessionId
│   │   │   ├── export.js          # GET /api/export/:sessionId/*
│   │   │   └── docs.js            # POST /api/docs/:sessionId
│   │   ├── services/
│   │   │   ├── llmClient.js       # Single wrapper around @anthropic-ai/sdk — all prompts go through here
│   │   │   ├── ingestionService.js  # git clone (simple-git) / zip extract (multer + adm-zip)
│   │   │   ├── analysisService.js   # file tree walk, framework detection, dep graph, calls llmClient
│   │   │   ├── planningService.js   # builds plan prompt, calls llmClient
│   │   │   ├── generationService.js # builds codegen prompt, calls llmClient, computes diffs (diff lib)
│   │   │   ├── reviewService.js     # builds self-review prompt, calls llmClient
│   │   │   └── docsService.js       # builds docs-generation prompt, calls llmClient
│   │   ├── store/
│   │   │   └── sessionStore.js    # In-memory Map<sessionId, SessionState> + TTL cleanup interval
│   │   ├── utils/
│   │   │   ├── fileTree.js        # Shared tree-building/filtering logic
│   │   │   └── errors.js          # Shared error response formatter (matches API.md error shape)
│   │   └── app.js                 # Express app setup: CORS, JSON body parsing, route mounting
│   ├── .env                       # ANTHROPIC_API_KEY, PORT, CORS_ORIGIN (gitignored)
│   ├── index.js                   # Server entrypoint — imports app.js, starts listener
│   └── package.json
│
└── docs/                          # Supporting capstone artifacts (not app code)
    ├── PRD.docx
    ├── Implementation_Blueprint.docx
    ├── Pitch_Deck.pptx
    ├── DEMO_REPOS.md              # Added Day 9 — locked demo repos for presentation
    └── project-log.md             # Daily progress log, updated end of each day
```

---

## 2. Rationale

**Why `services/` is split one-file-per-pipeline-stage:**
Each of the 5 AI-driven or IO-heavy operations (ingestion, analysis, planning, generation, review, docs) gets its own service file, matching PRD NFR "Maintainability — modular codebase (separate analysis, planning, generation, validation, and docs modules)" almost verbatim. This also means each future day (3 through 8) touches exactly one or two new service files, keeping daily work well-isolated and reducing merge/context confusion between fresh AI conversations.

**Why `llmClient.js` is a single shared file, not one-per-service:**
All 5 AI-driven services call through one wrapper. This keeps prompt-formatting conventions, retry logic (one retry on malformed JSON, per Blueprint), and error handling consistent in exactly one place — a bug fix or prompting tweak here fixes all 5 pipelines at once instead of five separate copies drifting out of sync.

**Why `store/sessionStore.js` is isolated from `routes/`:**
Session state is a cross-cutting concern touched by nearly every route. Isolating it means the in-memory `Map` and its TTL/cleanup logic have one clear owner, and if a future version swaps this for a real database (PRD §10 future enhancement), only this one file changes — no route files need touching.

**Why `client/src/context/SessionContext.jsx` exists:**
The frontend needs to carry the `sessionId` and accumulated step data (analysis result, plan, diffs, etc.) across all 9 screens without prop-drilling through the whole component tree. A single React Context matches the PRD's "single guided session" model — no routing library needed since this isn't a multi-page app.

**Why routes are split one-file-per-resource:**
Mirrors the API.md endpoint groupings exactly (`repo.js` owns both ingestion endpoints, `plan.js` owns both plan-generation and plan-approval, etc.) — anyone opening `routes/` can immediately map each file to a PRD step without cross-referencing.

**Where future code will live:**
- New AI pipeline steps → new file in `services/`, wired into a route in `routes/`.
- New UI screens → new folder in `components/`.
- Any future persistence layer → replaces `store/sessionStore.js` internals only; its external interface (`get`, `set`, `delete` by sessionId) stays the same so nothing else needs to change.

---

## 3. What Stays Fixed From Here Forward

Per the Day 2 Implementation Blueprint handoff note: **Day 3 builds directly on `server/src/services/llmClient.js` and this route/folder structure** — it should not be restructured without a documented reason. This file is that documented structure; Days 3–10 should extend it, not redesign it.
