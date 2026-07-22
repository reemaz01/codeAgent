# SCHEMA.md — CodePilot Agent

*Day 2 deliverable — data model design.*

## Why there's no database

PRD §6.9 and §9 explicitly require **no persistence across sessions** and **no user accounts**. Introducing MongoDB/Postgres here would add real setup time, hosting cost, and a whole migration/connection-management surface for zero functional benefit in v1.0 — this is called out directly as a Day 2 decision point in the Implementation Blueprint. Instead, all state lives in a **server-side in-memory session store**, which is the data model this document specifies.

This is intentionally the equivalent of a "schema" for an in-memory system: the shape of the `SessionState` object, its fields, relationships, and constraints — just held in a `Map` instead of a database.

---

## 1. Core Structure: `SessionState`

```
Map<sessionId: string, SessionState>
```

```javascript
SessionState {
  sessionId: string,          // UUID v4, primary key
  createdAt: timestamp,
  expiresAt: timestamp,       // createdAt + TTL (e.g. 2 hours)

  repo: {
    source: "url" | "zip",
    originalUrl: string | null,
    tempDirPath: string,      // absolute path on server disk
    fileCount: number,
    totalSizeBytes: number
  },

  fileTree: FileTreeNode,     // nested tree, see §2

  analysis: {
    architectureSummary: string,
    detectedFrameworks: string[],   // e.g. ["React", "Express"]
    dependencyGraph: DependencyEdge[],  // see §3
    keyFiles: string[]              // entry points, config files
  } | null,

  task: {
    description: string
  } | null,

  plan: {
    files: PlanFileEntry[],   // see §4
    overallRisk: "low" | "medium" | "high",
    complexityEstimate: string,
    approved: boolean,
    approvedAt: timestamp | null
  } | null,

  generation: {
    changes: FileChange[]     // see §5
  } | null,

  review: {
    confidence: "high" | "medium" | "low",
    issues: ReviewIssue[],
    suggestedTests: string[],
    manualVerificationSteps: string[]
  } | null,

  documentation: {
    commitMessage: string,
    prDescription: string,
    readmeSuggestions: string
  } | null
}
```

## 2. `FileTreeNode`

```javascript
FileTreeNode {
  name: string,
  path: string,               // relative to repo root
  type: "file" | "directory",
  children: FileTreeNode[] | null   // null for files
}
```
**Constraint:** `node_modules`, `.git`, build/dist output, binaries, and lockfile *contents* (name kept, content excluded) are filtered out during tree construction — enforced in the Analysis Service, not stored at all.

## 3. `DependencyEdge`

```javascript
DependencyEdge {
  from: string,   // file path
  to: string      // file path it imports/requires
}
```
File-level only — matches PRD §7's explicit exclusion of function-level call graphs.

## 4. `PlanFileEntry`

```javascript
PlanFileEntry {
  filePath: string,
  changeDescription: string,
  risk: "low" | "medium" | "high",
  executionOrder: number
}
```

## 5. `FileChange`

```javascript
FileChange {
  filePath: string,
  before: string,      // original content (or "" if new file)
  after: string,        // generated content
  explanation: string   // plain-English, shown next to diff
}
```

## 6. `ReviewIssue`

```javascript
ReviewIssue {
  filePath: string,
  severity: "bug" | "edge-case" | "style" | "security",
  description: string
}
```

---

## 7. Validation Against PRD User Journey (9 Steps)

| PRD Step | Field(s) it maps to | Covered? |
|---|---|---|
| 1. Repository input | `repo.*` | ✅ |
| 2. Codebase analysis | `fileTree`, `analysis.*` | ✅ |
| 3. Task input | `task.description` | ✅ |
| 4. Plan generation | `plan.files`, `plan.overallRisk`, `plan.complexityEstimate` | ✅ |
| 5. Plan approval (gate) | `plan.approved`, `plan.approvedAt` | ✅ |
| 6. Code generation & diff view | `generation.changes` | ✅ |
| 7. AI self-review | `review.*` | ✅ |
| 8. Export | Derived on-demand from `generation.changes` (no separate stored field — patch is generated at export time, not persisted) | ✅ |
| 9. Documentation generation | `documentation.*` | ✅ |

Every user story in the PRD's 9-step journey has a corresponding, explicit field. No orphan requirements, no unused schema fields.

## 8. Constraints & Limits (enforced in code, not a DB schema, but functionally equivalent)

- Max ZIP upload size: e.g. 25 MB (configurable constant).
- Max file count per repo: e.g. 500 files (protects LLM context limits — noted in Blueprint Day 3).
- Max total characters read into memory for analysis: capped constant, referenced again on Day 4.
- Session TTL: 2 hours from `createdAt`, after which the `Map` entry and temp directory are deleted by a cleanup interval.
