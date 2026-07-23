Implementation Blueprint

**codeAgent (formerly "CodePilot Agent") — Days 2--10 Build Plan**

*This is the single source of truth for the remaining 9 build days. Each
day is self-contained: if you start a fresh AI conversation on any given
day, paste that day's section plus the PRD, and the assistant should be
able to continue building without re-planning the architecture.*

*Budget assumption: 4--6 hours/day. Tech stack (MERN + LLM provider) is
finalized on Day 2 and then referenced by name for the rest of the plan
— use whatever you actually pick; this blueprint uses the placeholder
\[LLM_API\] and \[DEPLOY_TARGET\] until then.*

—

## 📌 Status Log (maintained daily — read this first)

| Day | Status | Notes |
|---|---|---|
| 2 | ✅ Complete | Stack finalized: React+Vite / Node+Express / no DB (in-memory session store) / no auth / Claude via `@anthropic-ai/sdk` / Vercel+Render hosting. Project named **codeAgent**. Repo scaffolded, health-check connectivity verified. Full system design docs produced (ARCHITECTURE, SCHEMA, API, UI-WIREFRAMES, PROJECT-STRUCTURE, NAMING). |
| 3 | ✅ Complete | Repository ingestion (GitHub URL + ZIP upload) built and verified end-to-end, backend and frontend. See "Actuals" note in the Day 3 section below for deviations and lessons learned. |
| 4 | ⬜ Not started | Up next: Codebase Analysis Engine. |
| 5–10 | ⬜ Not started | No changes to plan. |

**Carry-over item:** Skeleton deployment (Vercel + Render) has not happened yet, though it was loosely anticipated around Day 2. Recommend deploying no later than Day 5–6 to catch hosting/config issues with time to spare — this is a scheduling note, not a scope change.

Roadmap at a Glance

  —————————————————————————-
  **Day**   **Focus**               **Key Deliverables**
  ——— ———————-- ——————————————
  2         Architecture, Tech      Finalize stack, LLM provider, repo
            Stack & Setup           scaffolding, project name, environment
                                    setup

  3         Repository Ingestion    GitHub URL fetch/clone, ZIP upload, file
                                    tree extraction, validation

  4         Codebase Analysis       Framework detection, import parsing,
            Engine                  dependency graph, architecture summary

  5         Task Input & Plan       Task input UI, LLM prompt pipeline for
            Generation              implementation plans, plan display

  6         Approval Gate & Code    Approval UX, LLM code-generation pipeline,
            Generation              diff computation

  7         Diff Viewer & AI        Side-by-side diff viewer UI,
            Self-Review             self-review/validation pipeline,
                                    confidence scoring

  8         Export & Documentation  Patch file export, copy-code, commit
            Generation              message/PR/README generation

  9         End-to-End Testing &    Full flow QA across multiple repos, UI
            Polish                  polish, error handling, edge cases

  10        Deployment & Demo Prep  Production deployment, final smoke tests,
                                    pitch deck rehearsal,
                                    screenshots/recording
  —————————————————————————-

Day 2: Architecture, Tech Stack & Setup

*Today has no coding of features yet — it's about locking every
remaining open decision (stack, LLM provider, project name, repo
structure) so Days 3--10 can move fast without re-deciding anything.*

**🎯 Objective**

Finalize the technical architecture and stand up a working, deployable
skeleton (empty but running frontend + backend) connected to the chosen
LLM API.

**📖 What You'll Learn**

-   How to structure a MERN app for an AI-agent workflow (clear
    separation between analysis, planning, generation, validation, and
    docs modules).

-   How to securely call an LLM API from a backend (never from the
    client).

-   How to set up a project for continuous, incremental feature
    delivery.

**🛠 Features to Build**

-   Decide and document: project name, LLM provider (e.g. Claude API via
    Anthropic SDK), hosting/deploy targets for frontend and backend.

-   Scaffolded MERN project: React (Vite) frontend, Node/Express
    backend, MongoDB only if session persistence is later needed (likely
    NOT needed given no-persistence v1.0 — confirm today whether you
    need a DB at all, or if in-memory session state is sufficient).

-   Working '/health' backend endpoint and a placeholder frontend
    page, both deployed to a temporary URL to prove the pipeline
    end-to-end this early.

**📝 Step-by-Step Implementation Plan**

**1. Finalize decisions**

1.  Pick the project name (update PRD/blueprint references as needed —
    keep a NAMING.md note).

2.  Pick the LLM provider/model (e.g. Claude Sonnet via Anthropic API)
    and confirm you have API access.

3.  Decide hosting: e.g. frontend on a static host, backend on a
    Node-friendly host. No paid tools unless you explicitly want them.

4.  Decide: do you need a database at all for v1.0? Given the
    no-persistence requirement, likely NOT — use in-memory/server-side
    session objects keyed by a session ID instead of MongoDB, to save
    real setup time. Confirm this call explicitly today.

**2. Scaffold the repository**

5.  Create a monorepo with /client (React + Vite) and /server (Node +
    Express) folders.

6.  Initialize git, add a root README.md with project name and one-line
    description.

7.  Add .gitignore covering node_modules, .env, build artifacts, and any
    temp clone/upload directories.

**3. Backend skeleton**

8.  Express app with CORS configured for the frontend origin.

9.  Environment variable loading (dotenv) for the LLM API key — never
    hardcode it, never expose it to the client.

10. A GET /api/health route returning { status: 'ok' }.

11. A minimal LLM client wrapper module
    (server/src/services/llmClient.js) that sends a test prompt and
    returns the response, to prove connectivity.

**4. Frontend skeleton**

12. React app with routing/layout shell: a single-page app with a step
    indicator (steps 1-9 from the PRD) even if most steps are
    placeholders today.

13. A basic API client module (client/src/api/index.js) pointing at the
    backend base URL via an environment variable.

14. One working screen that calls /api/health and displays the result,
    to prove frontend-backend connectivity.

**5. Deploy the skeleton early**

15. Deploy backend and frontend to your chosen (free) hosting targets
    now — not on Day 10 — so you catch deployment/config issues
    while the app is still simple.

16. Confirm the deployed frontend can successfully call the deployed
    backend's /api/health endpoint.

**📂 Files & Folders to Create/Modify**

-   /README.md — project name, description, setup instructions

-   /client/ — React (Vite) app

-   /server/ — Node/Express app

-   /server/src/services/llmClient.js — LLM API wrapper

-   /server/src/routes/health.js

-   /server/.env (gitignored) — LLM API key, port, CORS origin

-   /NAMING.md — chosen project name and short rationale

**🔗 APIs, Libraries & Tools to Integrate**

-   Chosen LLM API (e.g. Anthropic Claude API) — server-side only

-   dotenv for environment variables

-   cors for Express

-   Hosting/deploy target for frontend (e.g. static hosting) and backend
    (e.g. Node hosting) — pick free-tier options

**🧪 Testing Tasks**

-   Verify /api/health responds correctly locally and on the deployed
    URL.

-   Verify the LLM client wrapper successfully returns a response to a
    test prompt (log it, don't build UI for it yet).

-   Verify frontend can call backend across environments (local → local,
    deployed → deployed) without CORS errors.

**🐞 Common Issues & Debugging Tips**

-   CORS errors: double-check the exact deployed frontend origin is in
    the backend's CORS allow-list (no trailing slash mismatches).

-   Env vars not loading on the host: most platforms need you to set env
    vars in their dashboard, not just in a local .env file.

-   LLM API key errors: confirm the key has the right permissions/model
    access before assuming your code is broken.

**✅ End-of-Day Checklist**

-   Project name, LLM provider, and hosting targets are decided and
    written down.

-   Monorepo scaffolded with /client and /server.

-   Backend /api/health works locally and deployed.

-   Frontend can call backend successfully, locally and deployed.

-   LLM client wrapper proven to work with a simple test call.

-   Everything committed to git with a clear initial commit.

**📸 Expected Project State & Screenshots to Capture**

-   Terminal showing successful local dev servers running (client +
    server).

-   Browser screenshot of the deployed frontend showing a successful
    /api/health response.

-   Screenshot/log of a successful test LLM API call.

**➡️ Handoff Notes for Next Day**

-   Record the final tech stack, LLM provider/model name, and both
    deployed URLs at the top of README.md — Day 3 assumes these are
    fixed.

-   Day 3 will build directly on server/src/services/llmClient.js and
    the existing route/folder structure — do not restructure it
    without reason.

-   If DB was skipped in favor of in-memory session state, note the
    session strategy (e.g. session ID in a cookie/header, server-side
    in-memory map) clearly — Day 3 needs it for repo ingestion.

> **✅ Actuals (Day 3, completed):** Built exactly as planned below — `sessionStore.js`, `fileTree.js`, `ingestionService.js`, `repo.js` routes on the backend; `api/index.js`, `SessionContext.jsx`, `RepoInput.jsx`, updated `App.jsx` on the frontend. Verified via direct API tests (PowerShell/curl) and a full browser UI test, including a real multi-folder repo. Two environment issues came up and were resolved: a corrupted `node_modules` install (fixed via clean reinstall) and a missing `client/src` folder between sessions (recreated from known-good Day 2 code). Neither required a design change. Full write-up in `docs/DAY3-SUMMARY.md`.

Day 3: Repository Ingestion (GitHub URL & ZIP Upload)

*Builds directly on the Day 2 skeleton. By end of today, a user can
submit a public GitHub URL or ZIP and see the raw file tree back in the
UI — no AI involved yet.*

**🎯 Objective**

Implement Step 1 of the PRD's user journey: accept a public GitHub repo
URL or ZIP upload, fetch/extract it server-side, and return a validated
file tree to the frontend.

**📖 What You'll Learn**

-   How to clone/fetch a public GitHub repo server-side (via git clone
    or the GitHub REST API).

-   How to safely handle uploaded ZIP files (extraction, path traversal
    protection, size limits).

-   How to model a project's file tree for later AI analysis.

**🛠 Features to Build**

-   Repo URL input form with validation (must be a public GitHub URL).

-   ZIP file upload as an alternative input, with drag-and-drop if time
    allows.

-   Backend fetch/clone pipeline that produces a working local copy of
    the project tied to a session ID.

-   File tree extraction, filtered to relevant files (exclude
    node_modules, build output, binaries, lockfiles content, etc.).

-   Basic size/file-count limit enforcement with a friendly error if
    exceeded.

**📝 Step-by-Step Implementation Plan**

**1. Session strategy**

17. Generate a session ID server-side on first request (e.g. UUID),
    return it to the frontend, and use it as the key for that session's
    cloned/extracted files on disk (temp directory) and any in-memory
    metadata.

18. Set up a scheduled/best-effort cleanup of temp session directories
    (e.g. delete after N hours or on server restart) to avoid disk bloat
    — simple is fine for v1.0.

**2. GitHub URL ingestion**

19. POST /api/repo/from-url { url } — validate it's a well-formed
    public GitHub URL.

20. Use \`git clone \--depth 1 \<url\> \<tempDir\>\` (shallow clone, no
    history) server-side, or the GitHub API's tarball/zipball endpoint
    if you prefer avoiding a git binary dependency.

21. Handle errors: repo not found, private repo (no access), invalid
    URL, network failure — return clear error messages the frontend
    can display.

**3. ZIP ingestion**

22. POST /api/repo/from-zip (multipart upload) — accept a ZIP, extract
    to the session's temp directory.

23. Sanitize extraction: reject/strip any paths attempting to escape the
    target directory (zip-slip protection).

24. Enforce a max ZIP size and max extracted file count.

**4. File tree building**

25. Walk the extracted/cloned directory, excluding node_modules, .git,
    dist/build folders, images/binaries, and lockfiles.

26. Build a nested JSON tree structure (folders + files) to return to
    the frontend.

27. Cap total files/characters read into memory to protect later LLM
    context limits — note this limit now so Day 4 can rely on it.

**5. Frontend UI for Step 1**

28. Toggle between 'GitHub URL' and 'Upload ZIP' input modes.

29. Loading state while cloning/extracting (this can take a few
    seconds).

30. On success, render the file tree in a simple collapsible tree view
    component and store the session ID in frontend state for later
    steps.

31. Clear, friendly error states for invalid URL, private repo,
    oversized repo, etc.

**📂 Files & Folders to Create/Modify**

-   /server/src/routes/repo.js — from-url and from-zip endpoints

-   /server/src/services/repoFetcher.js — clone/extract logic

-   /server/src/services/fileTree.js — tree-building + filtering logic

-   /server/src/middleware/session.js — session ID generation/lookup

-   /server/tmp/ (gitignored) — per-session cloned/extracted repos

-   /client/src/components/RepoInput.jsx

-   /client/src/components/FileTreeView.jsx

-   /client/src/state/sessionStore.js (or context) — holds session
    ID + file tree

**🔗 APIs, Libraries & Tools to Integrate**

-   simple-git (npm) or native git clone via child_process, OR GitHub
    REST API tarball endpoint

-   multer (npm) for handling ZIP uploads

-   adm-zip or unzipper (npm) for ZIP extraction

-   uuid (npm) for session IDs

**🧪 Testing Tasks**

-   Test with a small public repo (works end to end).

-   Test with an invalid URL (clear error, no crash).

-   Test with a private repo URL (clear 'not accessible' error, not a
    generic 500).

-   Test ZIP upload with a normal project ZIP.

-   Test ZIP upload with a maliciously crafted path (zip-slip) if you
    can construct one — confirm it's rejected.

-   Test an oversized repo/ZIP hits the limit gracefully.

**🐞 Common Issues & Debugging Tips**

-   git clone failing on the host: some hosts restrict
    shell/child_process access — have the GitHub tarball API as a
    fallback if so.

-   Uploaded file not appearing correctly: confirm multer's storage
    config (memory vs disk) matches how your extraction code expects to
    receive it.

-   File tree too large for later steps: tune your exclusion list and
    size caps now rather than in Day 4 under time pressure.

**✅ End-of-Day Checklist**

-   User can submit a public GitHub URL and see a real file tree
    returned.

-   User can upload a ZIP and see a real file tree returned.

-   Invalid/private/oversized inputs show friendly errors, not crashes.

-   Session ID correctly ties a user's session to their extracted files
    on the backend.

-   Exclusion filtering (node_modules, .git, build output) confirmed
    working.

**📸 Expected Project State & Screenshots to Capture**

-   UI showing the GitHub URL input and resulting file tree.

-   UI showing the ZIP upload flow and resulting file tree.

-   UI showing a friendly error state (e.g. invalid URL).

**➡️ Handoff Notes for Next Day**

-   Day 4 will read files directly from the session's temp directory on
    disk using the file tree from today — confirm the directory path
    convention (e.g. server/tmp/\<sessionId\>/) is documented.

-   Note the current file/size exclusion rules in README.md's
    'Analysis Constraints' section — Day 4 builds directly on top of
    these.

-   If you deferred anything (e.g. drag-and-drop ZIP, progress bar for
    large repos), note it as a nice-to-have for Day 9 polish.

Day 4: Codebase Analysis Engine

*Builds on Day 3's file tree and session storage. Today produces the
architecture summary and dependency graph that later steps (planning,
generation) will feed to the LLM as context.*

**🎯 Objective**

Implement Step 2 of the PRD's user journey: lightweight semantic
analysis producing framework detection, a file-level dependency graph,
and an LLM-generated architecture summary.

**📖 What You'll Learn**

-   How to detect frameworks/libraries from package.json and code
    patterns without deep static analysis.

-   How to parse import/require statements to build a lightweight
    dependency graph.

-   How to structure codebase context effectively for an LLM prompt
    (summarization over raw dumping).

**🛠 Features to Build**

-   Framework/library detection (React, Express, Next.js, etc.) from
    package.json and file patterns.

-   File-level dependency graph: which files import/require which other
    files.

-   Identification of 'key files' (entry points, main config, routers,
    main components).

-   LLM-generated architecture summary in plain English, using the
    extracted structural data as context (not raw file dumps).

-   Frontend screen displaying the analysis results clearly (framework
    badges, key files, summary, simple dependency visualization).

**📝 Step-by-Step Implementation Plan**

**1. Framework & dependency detection**

32. Parse package.json (dependencies/devDependencies) to list installed
    libraries.

33. Apply simple heuristics to flag frameworks in use (e.g. presence of
    'react' + 'react-dom' → React app; 'express' → Express
    backend; 'next' → Next.js).

34. Identify likely entry points (e.g. index.js, main.jsx, server.js,
    app.js) using common naming conventions and package.json's
    'main'/'scripts'.

**2. Import/require parsing**

35. For each JS/TS/JSX/TSX file (within your size/count limits from Day
    3), extract import/require statements using a lightweight parser
    (regex-based is acceptable for v1.0 given the 'lightweight semantic
    analysis' scope — or use a fast AST parser like \@babel/parser if
    time allows for more accuracy).

36. Resolve relative imports to actual file paths to build edges in a
    dependency graph: { file: \[importedFile1, importedFile2, \...\] }.

37. Store this graph structure in the session's server-side state
    alongside the file tree.

**3. Architecture summary generation**

38. Build a compact, structured context object: framework list, key
    files, dependency graph summary (not every edge — aggregate stats
    plus key relationships), folder structure overview.

39. Send this structured context (not raw file contents) to the LLM with
    a prompt asking for a concise architecture summary: purpose,
    structure, tech stack, notable patterns.

40. Cache the result in the session so it isn't regenerated
    unnecessarily.

**4. Frontend analysis screen**

41. Display detected frameworks as badges/tags.

42. Display the LLM-generated architecture summary as readable prose.

43. Display key files in a highlighted list.

44. Optional (if time allows): a simple visual of the dependency graph
    (even a basic list of 'File X imports: Y, Z' is enough for v1.0
    — don't over-invest in a fancy graph visualization).

**📂 Files & Folders to Create/Modify**

-   /server/src/services/frameworkDetector.js

-   /server/src/services/dependencyGraph.js

-   /server/src/services/architectureSummary.js — LLM prompt + call

-   /server/src/routes/analysis.js — POST /api/analyze/:sessionId

-   /client/src/components/AnalysisSummary.jsx

-   /client/src/components/DependencyOverview.jsx

**🔗 APIs, Libraries & Tools to Integrate**

-   \@babel/parser or a regex-based import extractor (choose based on
    time budget)

-   \[LLM_API\] for architecture summary generation

**🧪 Testing Tasks**

-   Test analysis on a small React app, a small Express API, and a
    full-stack MERN repo — confirm framework detection is correct for
    each.

-   Confirm the dependency graph correctly reflects real import
    relationships for a known small repo.

-   Confirm the architecture summary reads coherently and isn't generic
    boilerplate.

-   Test with a repo that has an unusual structure (e.g. monorepo) —
    confirm graceful degradation, not a crash.

**🐞 Common Issues & Debugging Tips**

-   Import resolution failing for aliased imports (e.g.
    '@/components/X'): document this as a known limitation rather than
    trying to fully solve path aliasing today.

-   LLM summary too generic: tighten the prompt with the actual
    structured data (framework list, key file names) rather than vague
    instructions.

-   Analysis taking too long on medium repos: confirm your Day 3
    file/size limits are actually being enforced.

**✅ End-of-Day Checklist**

-   Framework detection works correctly on 2-3 different real repos.

-   Dependency graph correctly built and stored in session state.

-   Architecture summary is coherent and specific to the analyzed repo,
    not generic.

-   Analysis results screen displays clearly in the UI.

**📸 Expected Project State & Screenshots to Capture**

-   Analysis screen showing framework badges, key files, and
    architecture summary for a real test repo.

-   (Optional) dependency overview view.

**➡️ Handoff Notes for Next Day**

-   The structured analysis context object (frameworks, key files,
    dependency graph, summary) is now the primary input Day 5's
    plan-generation prompt will use — document its exact shape in a
    short comment at the top of architectureSummary.js.

-   Note any repos that broke analysis today so Day 5--6 testing can
    avoid or specifically retest them.

Day 5: Task Input & Plan Generation

*Builds on Day 4's analysis context. Today implements Steps 3-4 of the
PRD's user journey: task input and AI-generated implementation plan.*

**🎯 Objective**

Let the user describe a task in plain English and have the agent produce
a structured, trustworthy implementation plan (affected files, changes,
risks, complexity, execution order).

**📖 What You'll Learn**

-   How to design a structured-output LLM prompt (asking for JSON) so
    the plan can be reliably rendered in the UI.

-   How to combine multiple context sources (architecture summary, file
    tree, dependency graph, relevant file contents) into one effective
    prompt without exceeding context limits.

-   How to handle imperfect/ambiguous natural language task input
    gracefully.

**🛠 Features to Build**

-   Task input UI with a text area and a few example task prompts for
    inspiration.

-   Backend plan-generation pipeline: select relevant files (using the
    dependency graph + task keywords), assemble context, call the LLM
    for a structured plan.

-   Structured plan output: affected files list, per-file change
    description, risks, complexity estimate (Low/Medium/High), suggested
    execution order.

-   Plan displayed in a clear, structured UI (not a wall of text).

-   Ability to edit the task description and regenerate the plan before
    approving.

**📝 Step-by-Step Implementation Plan**

**1. Task input UI**

45. Text area for the task description, with 2-3 clickable example
    prompts (e.g. 'Add dark mode', 'Add input validation to the
    signup form').

46. Submit button that sends the task + session ID to the backend.

**2. Relevant file selection**

47. Use simple heuristics to narrow down which files are likely relevant
    to the task: keyword matching against file/folder names, plus the
    dependency graph's key files, rather than sending the entire repo
    to the LLM.

48. Cap the number/size of file contents included in the prompt context
    to stay within LLM context limits — prioritize key files and files
    most likely relevant.

**3. Plan-generation prompt**

49. Design a prompt that includes: architecture summary, relevant file
    list with short excerpts, the user's task description, and explicit
    instructions to return structured JSON with fields: affectedFiles
    (array of {path, reason, changeDescription}), risks (array of
    strings), complexity ('Low'\|'Medium'\|'High'), executionOrder
    (ordered array of file paths).

50. Parse and validate the JSON response server-side; handle malformed
    responses with a retry or clear error.

**4. Plan display UI**

51. Render the plan as: a list of affected files (each with its
    reason/description), a risks section, a complexity badge, and the
    suggested order of operations.

52. Add 'Refine task & regenerate' and 'Approve plan' actions
    (approval itself becomes fully functional on Day 6, but the button
    and state should exist now).

**📂 Files & Folders to Create/Modify**

-   /server/src/services/relevantFileSelector.js

-   /server/src/services/planGenerator.js — LLM prompt + JSON
    parsing/validation

-   /server/src/routes/plan.js — POST /api/plan/:sessionId

-   /client/src/components/TaskInput.jsx

-   /client/src/components/PlanView.jsx

**🔗 APIs, Libraries & Tools to Integrate**

-   \[LLM_API\] with structured/JSON output instructions

**🧪 Testing Tasks**

-   Test with a clear, well-scoped task (e.g. 'add a loading spinner to
    the login button') — confirm the plan is specific and sensible.

-   Test with a vague task (e.g. 'improve the app') — confirm the
    agent still returns something structured and reasonably useful, not
    a crash.

-   Test JSON parsing resilience: intentionally inspect a few raw LLM
    responses to confirm your parsing handles minor formatting variance.

-   Test on repos of different frameworks (React-only vs full MERN) to
    confirm relevant file selection is reasonably accurate in each.

**🐞 Common Issues & Debugging Tips**

-   LLM not returning valid JSON: add explicit 'respond with ONLY valid
    JSON, no prose or markdown fences' instructions, and strip code
    fences defensively before parsing.

-   Plan referencing files that don't exist in the repo: cross-validate
    affectedFiles paths against the real file tree and filter/flag
    mismatches.

-   Context too large / API errors: trim relevant file excerpts further,
    or summarize long files instead of including them in full.

**✅ End-of-Day Checklist**

-   User can enter a task and receive a structured plan reliably (test
    at least 5 different tasks across 2+ repos).

-   Plan UI clearly shows affected files, risks, complexity, and
    execution order.

-   Malformed LLM output is handled gracefully, not with a raw
    crash/error page.

-   Refine & regenerate flow works.

**📸 Expected Project State & Screenshots to Capture**

-   Task input screen with example prompts.

-   Generated plan screen for at least one real example task.

**➡️ Handoff Notes for Next Day**

-   Day 6 will trigger code generation immediately after the user clicks
    'Approve Plan' using this exact plan JSON structure as input —
    keep the field names stable or update this document.

-   Note the current relevant-file-selection heuristic's known weak
    spots (e.g. it may miss deeply nested files) so Day 6--7 testing
    accounts for it.

Day 6: Approval Gate & Code Generation

*Builds on Day 5's plan output. Today implements Steps 5-6 of the
PRD's user journey: the mandatory approval gate and the actual
code-generation pipeline that produces diffs.*

**🎯 Objective**

Make the approval gate fully functional and implement the LLM-driven
code generation pipeline that produces before/after content for each
affected file.

**📖 What You'll Learn**

-   How to design a hard approval gate in a multi-step UI flow (no way
    to skip ahead).

-   How to prompt an LLM to generate full-file or targeted-patch code
    changes reliably.

-   How to compute a diff between original and generated file content
    server-side.

**🛠 Features to Build**

-   Functional 'Approve Plan' gate: code generation cannot start until
    the user explicitly approves.

-   Code-generation pipeline: for each affected file in the approved
    plan, generate updated file content (or new file content, for new
    files) using the LLM, informed by the plan's per-file change
    description and the original file content.

-   Diff computation between original and generated content for each
    file.

-   Per-file explanation of what changed and why, generated alongside
    the code.

**📝 Step-by-Step Implementation Plan**

**1. Approval gate logic**

53. Store plan approval state in the session (e.g. session.planApproved
    = true after the user clicks Approve).

54. Guard the code-generation endpoint: reject requests if the
    session's plan hasn't been approved.

55. Frontend: disable/hide the 'proceed to diff view' UI until
    approval is confirmed by the backend.

**2. Code generation pipeline**

56. For each file in the plan's executionOrder: fetch original content
    (if the file exists) from the session's cloned/extracted directory.

57. Build a per-file prompt including: the overall task, this file's
    specific planned change description, the original file content, and
    relevant surrounding context (e.g. related imported files if short
    enough).

58. Instruct the LLM to return the full updated file content (simplest
    and most reliable for v1.0, versus asking for a raw patch format)
    plus a short explanation of the change.

59. For new files, generate content from scratch based on the plan's
    description and surrounding code conventions.

**3. Diff computation**

60. Use a diffing library server-side to compute a structured diff
    (added/removed/unchanged lines) between original and generated
    content for each file.

61. Store per-file: original content, new content, structured diff, and
    the explanation text.

**4. Progress UI**

62. Since generating multiple files can take a while, show a per-file
    progress indicator (e.g. 'Generating auth.js\... done',
    'Generating login.jsx\... in progress').

63. Handle partial failures gracefully: if one file's generation fails,
    show that clearly rather than failing the entire batch silently.

**📂 Files & Folders to Create/Modify**

-   /server/src/services/codeGenerator.js — per-file LLM generation

-   /server/src/services/diffEngine.js — diff computation

-   /server/src/routes/generate.js — POST /api/generate/:sessionId
    (requires approval)

-   /client/src/components/ApprovalGate.jsx

-   /client/src/components/GenerationProgress.jsx

**🔗 APIs, Libraries & Tools to Integrate**

-   \[LLM_API\] for per-file code generation

-   diff or jsdiff (npm) for computing structured diffs

**🧪 Testing Tasks**

-   Test the approval gate: confirm the generate endpoint truly rejects
    unapproved sessions (not just hidden in the UI).

-   Test code generation on a simple, well-scoped task and confirm
    generated code is syntactically plausible JS/TS.

-   Test on a plan involving 3+ files and confirm all are generated with
    reasonable consistency.

-   Test a new-file scenario (plan includes a file that doesn't exist
    yet).

-   Test partial failure handling (e.g. simulate one file's generation
    throwing an error).

**🐞 Common Issues & Debugging Tips**

-   Generated code breaking syntax/formatting conventions of the
    original file: include a short snippet of the file's existing
    style/conventions in the prompt.

-   Generation timing out on many files: consider generating files
    sequentially with progress updates rather than one giant parallel
    batch, to keep the UX responsive and debuggable.

-   Diff output looking noisy (e.g. whole file marked changed due to
    whitespace): normalize line endings/trailing whitespace before
    diffing.

**✅ End-of-Day Checklist**

-   Approval gate is enforced server-side, not just in the UI.

-   Code generation successfully produces updated content + diff +
    explanation for every file in a test plan.

-   Progress indicators work during multi-file generation.

-   Partial failures are handled without crashing the whole session.

**📸 Expected Project State & Screenshots to Capture**

-   Approval gate screen (pre-approval state).

-   Generation progress UI mid-run.

-   Raw generated diff data for at least one file (even before the
    polished viewer exists — that's Day 7).

**➡️ Handoff Notes for Next Day**

-   The per-file diff/explanation data structure produced today is
    exactly what Day 7's diff viewer UI will render — document its
    shape (path, originalContent, newContent, diff, explanation)
    clearly.

-   Note generation reliability issues (if any) so Day 7's self-review
    step and Day 9's QA specifically retest them.

Day 7: Diff Viewer & AI Self-Review

*Builds on Day 6's generated diffs. Today implements Step 6's polished
UI and Step 7 of the PRD's user journey: the side-by-side diff viewer
and the AI self-review/validation pipeline.*

**🎯 Objective**

Build a polished, professional side-by-side diff viewer and implement
the LLM-driven self-review that flags risks, assigns confidence, and
suggests tests — all without executing any code.

**📖 What You'll Learn**

-   How to build or integrate a syntax-highlighted, side-by-side diff
    viewer component.

-   How to prompt an LLM to critically review its own generated output
    (self-review pattern).

-   How to communicate AI confidence/uncertainty clearly in a UI without
    undermining user trust.

**🛠 Features to Build**

-   Side-by-side (or toggleable side-by-side/unified) diff viewer per
    file, with syntax highlighting and added/removed line styling.

-   Per-file plain-English explanation shown alongside its diff.

-   AI self-review pass: bugs/edge cases, style/security concerns,
    compatibility risks, per change or for the change set as a whole.

-   Confidence level (High/Medium/Low) displayed prominently.

-   Suggested unit tests (as code/text) and suggested manual
    verification steps, clearly labeled as not executed.

**📝 Step-by-Step Implementation Plan**

**1. Diff viewer component**

64. Integrate a diff-viewing library (e.g. react-diff-viewer-continued
    or similar) or build a simple custom side-by-side renderer from the
    structured diff data computed on Day 6.

65. Add syntax highlighting appropriate to JS/TS/JSX/TSX.

66. Add a file selector/tabs so the user can move between multiple
    changed files.

67. Display each file's explanation text near its diff.

**2. Self-review pipeline**

68. Build a prompt that gives the LLM the full set of generated diffs
    (or summarizes them if too large) and the original task, and asks it
    to critically review its own work: potential bugs, edge cases,
    style/security issues, and compatibility concerns.

69. Ask explicitly for a confidence rating (High/Medium/Low) with a
    short justification.

70. Ask for suggested unit tests (as code, in the project's apparent
    testing convention/style if detectable) and a short list of manual
    verification steps for the human to perform.

71. Parse this into a structured response similar to the plan-generation
    approach on Day 5 (structured JSON output).

**3. Self-review UI**

72. Dedicated 'Review' panel/tab: confidence badge, risks list,
    suggested tests (code block), manual verification checklist.

73. Make clear in the UI copy that suggested tests/checks are
    AI-generated suggestions, not executed or verified automatically —
    sets correct user expectations.

**📂 Files & Folders to Create/Modify**

-   /server/src/services/selfReview.js — LLM self-review prompt +
    parsing

-   /server/src/routes/review.js — POST /api/review/:sessionId

-   /client/src/components/DiffViewer.jsx

-   /client/src/components/ReviewPanel.jsx

**🔗 APIs, Libraries & Tools to Integrate**

-   react-diff-viewer-continued (or equivalent) npm package, or a custom
    diff renderer built on Day 6's structured diff data

-   A syntax highlighter (e.g. prismjs or highlight.js) if not bundled
    with the diff viewer

-   \[LLM_API\] for self-review generation

**🧪 Testing Tasks**

-   Visually confirm the diff viewer renders correctly for additions,
    deletions, and modifications across multiple files.

-   Confirm the self-review output is specific to the actual generated
    diff, not generic boilerplate text.

-   Confirm confidence levels vary sensibly (e.g. a risky change gets
    Medium/Low, a trivial change gets High) across a couple of different
    test tasks.

-   Confirm suggested tests are syntactically plausible code in the
    right testing style/framework if one is detectable in the repo.

**🐞 Common Issues & Debugging Tips**

-   Diff viewer misrendering large files: consider truncating/collapsing
    very long unchanged sections for readability.

-   Self-review too generic: feed it the actual diff content (not just
    file names) and the original task description explicitly.

-   Confidence always defaulting to the same value: tighten the prompt
    with clear criteria for each level (e.g. High = small, isolated,
    low-risk change; Low = touches core logic or many files).

**✅ End-of-Day Checklist**

-   Diff viewer looks polished and is easy to read across at least 3
    different real generated diffs.

-   Self-review output is specific, well-formatted, and appears reliably
    for every generation.

-   Confidence badge and suggested tests/checks display clearly in the
    UI.

-   UI copy makes clear this is AI-suggested review, not executed
    validation.

**📸 Expected Project State & Screenshots to Capture**

-   Full diff viewer screen with a real multi-file example.

-   Review panel showing confidence badge, risks, and suggested tests
    for the same example.

**➡️ Handoff Notes for Next Day**

-   The diff viewer and review panel are now feature-complete for the
    'core AI loop' (analyze → plan → approve → generate → review). Day
    8 adds export and documentation generation on top of this same
    session data — no changes to the generation/review data structures
    should be needed.

-   Note any visual polish items you deferred (e.g. collapsing large
    unchanged diff regions) for Day 9.

Day 8: Export & Documentation Generation

*Builds on Day 6-7's generated diffs and review data. Today implements
Steps 8-9 of the PRD's user journey — the final pieces of the core
workflow.*

**🎯 Objective**

Let the user export their changes as a .patch file or copy code
directly, and have the agent auto-generate a commit message, PR
description, implementation summary, and doc update suggestions.

**📖 What You'll Learn**

-   How to generate a valid, standard Git patch file format from
    structured diff data.

-   How to prompt an LLM effectively for structured technical writing
    (commit messages, PR descriptions) that follows real-world
    conventions.

**🛠 Features to Build**

-   'Download .patch' action producing a valid unified diff /
    git-apply-compatible patch file covering all changed files.

-   'Copy code' action per file in the diff viewer.

-   LLM-generated commit message (conventional commit style).

-   LLM-generated PR description (summary, list of changes, testing
    notes).

-   LLM-generated implementation summary (what was done and why, in
    plain English).

-   LLM-generated suggested README/documentation updates where relevant
    to the task.

**📝 Step-by-Step Implementation Plan**

**1. Patch file generation**

74. Convert the session's structured per-file diffs into a standard
    unified diff format (most diff libraries can output this directly,
    or construct it manually per file using the '\-\-- a/path' / '+++
    b/path' / '@@ \... @@' conventions).

75. Concatenate all per-file patches into a single .patch file for
    download.

76. Add a backend endpoint that streams/returns this file with
    appropriate headers for download.

77. Sanity-check: the generated patch should be structurally valid
    enough to apply with \`git apply\` on the original repo — test
    this manually against your test repos.

**2. Copy-code action**

78. Add a 'Copy' button per file in the diff viewer that copies the
    full new file content to the clipboard.

**3. Documentation generation pipeline**

79. Build a prompt using the task description, plan, and
    diffs/explanations to generate: a conventional commit message, a PR
    description (summary/changes/testing notes sections), and a
    plain-English implementation summary.

80. Separately (or in the same call, structured), ask the LLM to suggest
    specific README/doc updates if the task warrants them (e.g. new
    feature, new setup step) — it's fine for this to say 'no
    documentation changes needed' when appropriate.

81. Parse into a structured response and render each artifact in its own
    clearly labeled section with its own 'Copy' button.

**4. Documentation/export UI**

82. Final 'Export & Docs' screen bringing together: patch download
    button, per-file copy buttons (recap), commit message, PR
    description, implementation summary, and doc update suggestions —
    each individually copyable.

83. This is effectively the last screen of the user journey — make it
    feel like a satisfying, complete conclusion to the session.

**📂 Files & Folders to Create/Modify**

-   /server/src/services/patchGenerator.js

-   /server/src/services/docGenerator.js — LLM prompt + parsing for
    commit/PR/summary/docs

-   /server/src/routes/export.js — GET /api/export/patch/:sessionId,
    POST /api/export/docs/:sessionId

-   /client/src/components/ExportPanel.jsx

-   /client/src/components/DocArtifacts.jsx

**🔗 APIs, Libraries & Tools to Integrate**

-   \[LLM_API\] for documentation generation

-   Same diffing library from Day 6 (for unified diff / patch
    formatting, if it supports this output mode)

**🧪 Testing Tasks**

-   Generate a patch file for a real test session and confirm it applies
    cleanly with \`git apply patchfile.patch\` against a fresh clone of
    the same original repo.

-   Confirm copy-code buttons correctly copy full, accurate file
    content.

-   Confirm commit message follows conventional commit format and
    accurately reflects the change.

-   Confirm PR description and implementation summary are specific to
    the actual task/diff, not generic.

-   Test a task where no doc updates are warranted — confirm the agent
    says so rather than inventing irrelevant suggestions.

**🐞 Common Issues & Debugging Tips**

-   Patch fails to apply with git apply: check line-ending consistency
    (CRLF vs LF) and that file paths in the patch header exactly match
    the repo's relative paths.

-   Generated docs referencing details not actually in the diff: tighten
    the prompt to explicitly ground statements in the provided diff/plan
    content only.

**✅ End-of-Day Checklist**

-   Patch file downloads and applies cleanly against a real test repo.

-   Copy-code works correctly for every changed file.

-   Commit message, PR description, implementation summary, and doc
    suggestions all generate reliably and read as specific, not generic.

-   Export & Docs screen feels like a complete, polished conclusion to
    the flow.

**📸 Expected Project State & Screenshots to Capture**

-   Export & Docs screen showing all generated artifacts for one real
    test session.

-   Terminal screenshot showing a successful \`git apply\` of a
    downloaded patch file.

**➡️ Handoff Notes for Next Day**

-   The full 9-step core user journey (PRD Section 5) is now
    functionally complete end to end. Day 9 is dedicated entirely to
    testing, edge cases, and UI/UX polish across the whole flow — no
    new core features should be needed.

-   Compile a running list of every rough edge, bug, or 'good enough
    for now' shortcut taken across Days 3--8 — hand this list
    directly into Day 9 as the polish backlog.

Day 9: End-to-End Testing & Polish

*No new core features today. This is dedicated to hardening the full Day
3--8 flow, fixing bugs, and making the product feel production-quality,
using the polish backlog handed off from Day 8.*

**🎯 Objective**

Take the functionally-complete product from Day 8 and make it reliable
and polished: full end-to-end testing across multiple real repos/tasks,
error handling, UI/UX refinement, and bug fixes.

**📖 What You'll Learn**

-   How to systematically test a multi-step AI workflow for reliability,
    not just happy-path correctness.

-   How to prioritize a polish backlog under time pressure (what
    actually matters for a demo vs. what doesn't).

**🛠 Features to Build**

-   No new features — focus entirely on reliability, error handling,
    and UI/UX quality of the existing 9-step flow.

-   Confirmed demo-ready set of 2-3 test repositories + tasks that
    reliably work well, to use on Day 10.

**📝 Step-by-Step Implementation Plan**

**1. Full end-to-end test passes**

84. Run the complete 9-step flow at least 3 times, each with a different
    real public JS/TS repo and a different task, from repo input through
    to export.

85. Log every bug, rough edge, confusing UI moment, or slow step you hit
    during these runs.

**2. Fix the polish backlog**

86. Work through the backlog compiled on Day 8 plus today's new
    findings, prioritized by: (1) anything that breaks the core
    flow, (2) anything that would look bad in a live demo, (3)
    nice-to-haves, in that order.

87. Improve loading states and progress indicators for every async step
    (analysis, plan generation, code generation, review, doc generation)
    so the user always knows what's happening.

88. Improve error messages across the app to be specific and friendly,
    not raw stack traces or generic 'Something went wrong'.

**3. UI/UX pass**

89. Review visual consistency: spacing, typography, color usage, and the
    step-indicator/progress UI across all 9 steps.

90. Confirm responsive behavior on at least one smaller screen width.

91. Add small delight touches if time allows (e.g. subtle transitions
    between steps, a clear 'session complete' state at the end).

**4. Select and lock demo repos**

92. Pick 2--3 public repositories + task pairings that you've now
    verified work reliably and look impressive — these become your
    official Day 10 demo set. Write them down.

93. Do a final full run-through of each locked demo repo/task pairing
    back to back, timing how long each step takes, to know what to
    expect live.

**📂 Files & Folders to Create/Modify**

-   No new files expected — modifications across existing /client and
    /server components based on the polish backlog.

-   /DEMO_REPOS.md — the locked list of 2--3 demo repo URLs + task
    prompts, with notes on timing/behavior.

**🔗 APIs, Libraries & Tools to Integrate**

-   None new — today is about hardening existing integrations, not
    adding new ones.

**🧪 Testing Tasks**

-   3+ full end-to-end runs across different repos/tasks, all fully
    completed through export.

-   Explicit test of error paths: invalid URL, private repo, oversized
    repo, a vague/ambiguous task, a malformed LLM response (if
    reproducible).

-   Confirm no console errors/warnings appear during a clean full run.

-   Confirm the locked demo repos/tasks work reliably back to back at
    least twice each.

**🐞 Common Issues & Debugging Tips**

-   If a specific repo structure reliably breaks something, decide: fix
    it if time allows, or explicitly exclude it from your demo set and
    note the limitation — don't let one edge case eat your remaining
    time budget.

-   If LLM responses are occasionally inconsistent, add a defensive
    retry (one retry, not an infinite loop) on JSON parsing failures
    rather than trying to make prompts perfectly deterministic.

**✅ End-of-Day Checklist**

-   3+ full end-to-end runs completed successfully across different
    repos/tasks.

-   Polish backlog from Day 8 addressed, prioritized by demo impact.

-   Error handling is friendly and specific across the whole flow.

-   Loading/progress states exist for every async step.

-   2--3 demo repos/tasks are locked, documented, and verified reliable.

**📸 Expected Project State & Screenshots to Capture**

-   Before/after comparison of at least one meaningfully improved UI
    screen.

-   Full clean run-through screenshots of your final locked demo
    repo/task, one per step (can double as pitch deck material).

**➡️ Handoff Notes for Next Day**

-   The product is now feature-complete and polished. Day 10 is
    deployment hardening + demo/presentation prep only — avoid new
    feature work on Day 10 unless something is actually broken.

-   Hand off DEMO_REPOS.md directly into Day 10's demo rehearsal step.

Day 10: Deployment & Demo Prep

*Final day. The product should already work well locally and on your Day
2 staging deployment. Today is about production hardening, a final
deploy, and preparing to present.*

**🎯 Objective**

Ship the final, production-deployed v1.0 at a stable public URL, verify
it thoroughly, and prepare all materials needed to present and demo it
confidently to the AB Talks cohort.

**📖 What You'll Learn**

-   How to do a final production deployment checklist for a full-stack
    AI app (env vars, CORS, API keys, build steps).

-   How to prepare and rehearse a live technical demo so it's resilient
    to real-world hiccups.

**🛠 Features to Build**

-   No new product features — final deployment, verification, and
    presentation preparation only.

**📝 Step-by-Step Implementation Plan**

**1. Final production deployment**

94. Do a final deploy of both frontend and backend to your chosen
    hosting targets (the same ones set up on Day 2, now carrying the
    full feature set).

95. Double-check all environment variables (LLM API key, CORS origin,
    any config) are correctly set on the production host, not just
    locally.

96. Confirm the production frontend correctly points at the production
    backend URL (not localhost).

**2. Production smoke test**

97. Run your full 9-step flow at least twice on the live production URL
    using your locked demo repos from Day 9.

98. Specifically test from a fresh browser session/incognito window to
    catch any environment- or cache-related issues.

99. Confirm patch download and copy-code work correctly in production
    (not just locally).

**3. Documentation finalization**

100. Finalize README.md: project name, description, live URL,
     screenshots, setup instructions for running locally, and a short
     'how it works' section.

101. Make sure the repository is clean (no committed .env, no stray
     debug code, no console.log spam).

**4. Demo & presentation rehearsal**

102. Rehearse a live run-through of the product end to end using your
     locked demo repos, timing yourself.

103. Prepare a fallback: a recorded screen capture of a full successful
     run, in case live demo internet/API issues occur during
     presentation.

104. Review the Pitch Deck (delivered alongside this blueprint) and
     rehearse presenting it alongside the live/recorded demo.

105. Prepare answers for likely questions: 'Why no execution-based
     validation?', 'Why no GitHub write access?', 'What would you
     build next?' — these map directly to the PRD's Out of Scope and
     Future Enhancements sections.

**📂 Files & Folders to Create/Modify**

-   /README.md — finalized

-   No new source files expected today.

**🔗 APIs, Libraries & Tools to Integrate**

-   Final production configuration of your chosen hosting platforms for
    frontend and backend (from Day 2).

**🧪 Testing Tasks**

-   Two full clean end-to-end runs on the live production URL from a
    fresh browser session.

-   Confirm no broken links, console errors, or CORS issues in
    production.

-   Confirm patch file download and git apply work against
    production-generated output.

**🐞 Common Issues & Debugging Tips**

-   Production-only bugs are almost always environment/config related
    (missing env var, wrong CORS origin, wrong API base URL) — check
    those first before assuming a code bug.

-   If a demo repo behaves differently in production than local (e.g.
    due to timeouts on a free hosting tier), have your recorded backup
    ready and don't burn presentation time debugging live.

**✅ End-of-Day Checklist**

-   Live production URL is stable and fully functional end to end.

-   README.md is complete and professional.

-   Locked demo repos verified working in production, twice.

-   Backup recorded demo video exists in case of live issues.

-   Pitch deck reviewed and rehearsed alongside the live/recorded demo.

**📸 Expected Project State & Screenshots to Capture**

-   Full screenshot set of a clean production run-through, step by step
    (for both the README and possible pitch deck use).

-   Screenshot of the final README.md.

-   Screenshot/confirmation of the live deployed URL loading correctly.

**➡️ Handoff Notes for Next Day**

-   This is the final day — handoff is to your live presentation, not
    another build day. Keep DEMO_REPOS.md, the recorded backup video,
    and the Pitch Deck together as your presentation kit.

-   Future Enhancements section of the PRD is your ready-made answer for
    any 'what's next' questions.
