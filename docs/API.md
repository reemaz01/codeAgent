# API.md — CodePilot Agent

*Day 2 deliverable — complete endpoint list for v1.0. No implementation yet, per today's scope. All endpoints are server-side only; the LLM API key never reaches the client.*

**Base URL (local):** `http://localhost:5000/api`
**Session header:** all endpoints except `/health` and repo ingestion expect `x-session-id: <uuid>` once a session exists.

---

## 1. `GET /api/health`

- **Purpose:** Confirm the backend is running and reachable (used by the Day 2 skeleton and ongoing uptime checks).
- **Request:** none.
- **Response 200:**
  ```json
  { "status": "ok" }
  ```
- **Validation:** none.
- **Auth:** none.
- **Error cases:** none expected — if unreachable, the frontend shows a connection error.

---

## 2. `POST /api/repo/from-url`

- **Purpose:** Ingest a public GitHub repository by URL (PRD Step 1).
- **Request:**
  ```json
  { "url": "https://github.com/owner/repo" }
  ```
- **Response 201:**
  ```json
  {
    "sessionId": "uuid",
    "fileTree": { "name": "repo", "type": "directory", "children": [...] },
    "fileCount": 87,
    "totalSizeBytes": 452000
  }
  ```
- **Validation:** must be a well-formed `https://github.com/*` URL; must resolve to a public repo.
- **Auth:** none (public repo access only).
- **Error cases:**
  - `400` — malformed URL
  - `404` — repo not found / private (no access)
  - `413` — repo exceeds size/file-count limit
  - `502` — GitHub unreachable / rate-limited

---

## 3. `POST /api/repo/from-zip`

- **Purpose:** Ingest a codebase via ZIP upload (PRD Step 1, alternative input).
- **Request:** `multipart/form-data`, field name `file`, ZIP archive.
- **Response 201:** same shape as `from-url`.
- **Validation:** valid ZIP structure; zip-slip path sanitization; max size enforced.
- **Auth:** none.
- **Error cases:**
  - `400` — not a valid ZIP / corrupt archive
  - `413` — exceeds max upload size or extracted file count
  - `422` — ZIP contains no recognizable JS/TS project (no `package.json` found)

---

## 4. `POST /api/analysis/:sessionId`

- **Purpose:** Run codebase analysis on the ingested repo (PRD Step 2).
- **Request:** no body — operates on the session's stored file tree.
- **Response 200:**
  ```json
  {
    "architectureSummary": "This is a React + Express MERN app...",
    "detectedFrameworks": ["React", "Express"],
    "dependencyGraph": [{ "from": "src/App.jsx", "to": "src/api/index.js" }],
    "keyFiles": ["package.json", "src/index.js", "server/index.js"]
  }
  ```
- **Validation:** session must exist and have a completed repo ingestion.
- **Auth:** session header required.
- **Error cases:**
  - `404` — session not found / expired
  - `409` — repo ingestion not completed yet
  - `502` — LLM API failure (with one automatic retry on malformed JSON before erroring)

---

## 5. `POST /api/plan/:sessionId`

- **Purpose:** Generate an implementation plan from a natural-language task (PRD Steps 3–4).
- **Request:**
  ```json
  { "task": "Add a dark mode toggle to the settings page" }
  ```
- **Response 200:**
  ```json
  {
    "files": [
      {
        "filePath": "src/context/ThemeContext.jsx",
        "changeDescription": "Create new theme context provider",
        "risk": "low",
        "executionOrder": 1
      }
    ],
    "overallRisk": "low",
    "complexityEstimate": "Small — under 1 hour equivalent"
  }
  ```
- **Validation:** `task` required, non-empty, reasonable length cap (e.g. 500 chars); session must have completed analysis.
- **Auth:** session header required.
- **Error cases:**
  - `400` — missing/empty task
  - `404` — session not found
  - `409` — analysis not completed yet
  - `502` — LLM failure (one retry on malformed JSON)

---

## 6. `POST /api/plan/:sessionId/approve`

- **Purpose:** The mandatory human approval gate (PRD Step 5) — no code generation can happen without this.
- **Request:** empty body.
- **Response 200:**
  ```json
  { "approved": true, "approvedAt": "2026-07-24T10:00:00Z" }
  ```
- **Validation:** a plan must already exist on the session.
- **Auth:** session header required.
- **Error cases:**
  - `404` — session not found
  - `409` — no plan exists yet to approve

---

## 7. `POST /api/generate/:sessionId`

- **Purpose:** Generate code changes for all files in the approved plan (PRD Step 6).
- **Request:** empty body — operates on the approved plan.
- **Response 200:**
  ```json
  {
    "changes": [
      {
        "filePath": "src/context/ThemeContext.jsx",
        "before": "",
        "after": "import { createContext } ...",
        "explanation": "New file creating the theme context and provider."
      }
    ]
  }
  ```
- **Validation:** `plan.approved` must be `true`.
- **Auth:** session header required.
- **Error cases:**
  - `403` — plan not yet approved (approval gate enforced server-side, not just in UI)
  - `404` — session not found
  - `502` — LLM failure (one retry)

---

## 8. `POST /api/review/:sessionId`

- **Purpose:** Run AI self-review on the generated diff (PRD Step 7).
- **Request:** empty body.
- **Response 200:**
  ```json
  {
    "confidence": "high",
    "issues": [
      { "filePath": "src/context/ThemeContext.jsx", "severity": "edge-case", "description": "No fallback if localStorage is unavailable." }
    ],
    "suggestedTests": ["Test that theme persists across reload"],
    "manualVerificationSteps": ["Manually toggle dark mode and confirm all pages update"]
  }
  ```
- **Validation:** generated changes must exist on the session.
- **Auth:** session header required.
- **Error cases:**
  - `404` — session not found
  - `409` — no generated changes to review yet
  - `502` — LLM failure (one retry)

---

## 9. `GET /api/export/:sessionId/patch`

- **Purpose:** Download all changes as a standard `.patch` file (PRD Step 8).
- **Request:** none.
- **Response 200:** `Content-Type: text/x-patch`, file stream/download.
- **Validation:** generated changes must exist.
- **Auth:** session header required.
- **Error cases:**
  - `404` — session not found
  - `409` — no changes generated yet

---

## 10. `GET /api/export/:sessionId/file/:filePath`

- **Purpose:** Copy a single file's updated code directly (PRD Step 8, alternative to full patch).
- **Request:** `filePath` URL-encoded in path.
- **Response 200:** `{ "content": "..." }` (plain updated file content).
- **Validation:** `filePath` must exist in `generation.changes`.
- **Auth:** session header required.
- **Error cases:**
  - `404` — session or file not found

---

## 11. `POST /api/docs/:sessionId`

- **Purpose:** Generate commit message, PR description, and README suggestions (PRD Step 9).
- **Request:** empty body.
- **Response 200:**
  ```json
  {
    "commitMessage": "feat: add dark mode toggle to settings",
    "prDescription": "## Summary\n...",
    "readmeSuggestions": "Add a note under Features: ..."
  }
  ```
- **Validation:** generated changes must exist.
- **Auth:** session header required.
- **Error cases:**
  - `404` — session not found
  - `409` — no changes generated yet
  - `502` — LLM failure (one retry)

---

## Cross-Cutting Error Format

All error responses share one shape so the frontend can render them consistently:

```json
{
  "error": {
    "code": "REPO_NOT_FOUND",
    "message": "We couldn't find a public repository at that URL. Double-check it's public and the URL is correct."
  }
}
```

`message` is always the user-facing, friendly string (per PRD NFR: no raw stack traces). `code` is a stable machine-readable identifier for frontend-specific handling if ever needed.
