# Development Rules & Coding Standards
## Academia–Industry Collaboration & Intelligent Career Development Platform

**Document Version:** 1.0
**Status:** Draft
**Companion to:** PRD_Academia_Industry_Platform.md, Architecture_Academia_Industry_Platform.md
**Last Updated:** August 22, 2026

This document is the binding rulebook for anyone (human or AI assistant) writing code in this repository. It exists so the codebase stays consistent regardless of who or what wrote a given file. If a rule here conflicts with a convenience shortcut, the rule wins.

---

## 1. General Principles

1. **Follow the architecture doc.** Folder placement is not optional — a controller never contains a DB query, a route never contains business logic, a page component never calls axios directly. If a new file doesn't obviously belong in an existing folder, ask before inventing a new one.
2. **No logic duplication.** If similar logic is needed in two places, extract it to `utils/`, a `hook`, or a `service` — never copy-paste.
3. **Explicit over clever.** Prefer readable, slightly verbose code over dense one-liners. This codebase will be touched by many contributors and AI agents; optimize for scanability.
4. **Every feature ships with types/validation.** No endpoint accepts unvalidated input. No component renders unvalidated/untyped props without a default or guard.
5. **Small, reviewable units.** One PR = one logical change. No mixing refactors with new features in the same PR.
6. **Never hardcode secrets, URLs, or environment-specific values.** Everything goes through `config/env.js` (backend) or `import.meta.env` (frontend).
7. **No duplicate code, anywhere.** Before writing a function, component, style block, validation rule, or constant, search the codebase for an existing one that already does it. If one exists, reuse or extend it — do not paste a near-copy with a new name. If logic must diverge slightly for a second use case, refactor the original into a shared version with parameters/options rather than forking it.
8. **No duplicate or unused imports.** Every file imports each module/symbol exactly once, only what it actually uses, and nothing it doesn't (no leftover imports after refactors). Imports are grouped and ordered consistently: (1) external packages, (2) internal absolute/aliased imports, (3) relative imports — each group separated by a blank line, alphabetized within the group. Lint rules (`eslint-plugin-import`, `no-duplicate-imports`, `no-unused-vars`) enforce this automatically and must pass before merge — a PR with lint warnings for duplicate/unused imports does not get approved.

---

## 2. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase | `OpportunityCard.jsx` |
| React hooks | camelCase, `use` prefix | `useSkillProfile.js` |
| Pages | PascalCase + `Page` suffix | `SkillGapPage.jsx` |
| CSS/Tailwind utility files | kebab-case | `tailwind.config.js` |
| Backend files (routes/controllers/services/models) | camelCase + `.role.js` suffix | `opportunity.controller.js` |
| Mongoose models | PascalCase + `.model.js` | `SkillProfile.model.js` |
| Functions | camelCase, verb-first | `calculateCompatibilityScore()` |
| Constants | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE_MB` |
| Env variables | UPPER_SNAKE_CASE | `JWT_ACCESS_SECRET` |
| MongoDB collections | plural, lowercase | `students`, `opportunities` |
| Git branches | `type/short-description` | `feature/skill-gap-analysis`, `fix/resume-upload-crash` |
| API routes | kebab-case, plural nouns | `/api/opportunities`, `/api/skill-profiles` |

No abbreviations that aren't obvious (`compScore` ❌ → `compatibilityScore` ✅). Booleans are prefixed `is`/`has`/`can` (`isVerified`, `hasAppliedAlready`).

---

## 3. Frontend Rules (React + Vite)

### 3.1 Component Rules
- A `page` component only composes other components and wires up data via hooks — it must not contain business logic, direct API calls, or complex conditionals beyond simple render branching.
- A `component` must be reusable and receive all data via props. No component reaches into global state directly unless it is explicitly a layout/shell component (`Navbar`, `Sidebar`).
- Keep components under ~200 lines. If it grows past that, split into subcomponents.
- Every component that renders a list must handle three states explicitly: **loading, empty, error** — never assume data is always present.
- No inline styles. Use TailwindCSS utility classes; shared repeated style patterns get extracted into a component, not a CSS class dump.
- All components must strictly use the global semantic color system defined in DESIGN_SYSTEM.md. Hardcoded hex colors or bespoke colors not present in the design system are prohibited.

### 3.2 Data Fetching Rules
- All server communication goes through `api/*Api.js` — never call `axios`/`fetch` directly inside a component or page.
- All data-fetching logic used by more than one component goes into a `hooks/use*.js` hook — pages/components call the hook, never the raw API module directly (the hook wraps it with loading/error/caching state).
- Use React Query (or RTK Query) for all server-state; do not manually manage `useEffect` + `useState` for API calls.

### 3.3 State Management Rules
- Only truly global concerns live in the Redux/Zustand store: auth session, active role, theme, app-wide notifications.
- Anything fetched from the server is **not** duplicated into global state — it lives in the query cache (React Query), with the store only holding IDs/references if needed.
- Form state stays local to the form component unless it's a genuine multi-step wizard, in which case use a scoped Context for that flow only.

### 3.4 Routing Rules
- Every protected route is wrapped in `PrivateRoute`, and every role-specific route is additionally wrapped in `RoleBasedRoute`.
- Route paths always start with the role segment for role-specific pages (`/student/...`, `/industry/...`).
- All page components are lazy-loaded (`React.lazy` + `Suspense`) — no eager imports of page components in `AppRoutes.jsx`.

### 3.5 Explainability UI Rule (product-specific)
- Any UI element that shows an AI-generated score (compatibility %, readiness score, match %) **must** render alongside a "Why?" affordance that opens the explanation from `MatchExplanation.jsx`. A raw score with no explanation is not allowed to ship, per the PRD's explainability requirement (FR-7.1).

### 3.6 Accessibility & Responsiveness
- All interactive elements must be keyboard-navigable and carry appropriate ARIA labels.
- Mobile-first layout using Tailwind breakpoints; every page must be verified at 375px, 768px, and 1440px widths before merge.

---

## 4. Backend Rules (Express, MVC)

### 4.1 Layer Boundaries (strict)
| Layer | Allowed to do | Forbidden from doing |
|---|---|---|
| Routes | Attach middleware, map to controller method | Any logic, any DB/service call |
| Controllers | Parse `req`, call **one** service method, format response | DB queries, AI calls, multi-step orchestration |
| Services | Business logic, orchestration, calling models/AI/other services | Touching `req`/`res` objects |
| Models | Schema, indexes, static query helpers | Business rules, cross-entity orchestration |
| Middlewares | Auth, validation, rate limiting, logging | Business logic specific to one feature |

A controller method should be short enough to read in one glance: validate → call service → respond. If a controller is doing more than that, the extra logic belongs in a service.

### 4.2 Response & Error Conventions
- Every successful response uses `utils/apiResponse.js`: `{ success: true, data, meta? }`.
- Every error is thrown as `utils/apiError.js` and caught by `errorHandler.middleware.js` — controllers never manually `res.status(500).json(...)`.
- Every controller is wrapped in `asyncHandler` — no bare `try/catch` boilerplate repeated per controller.
- Standard HTTP status usage: `400` validation, `401` unauthenticated, `403` unauthorized/RBAC, `404` not found, `409` conflict, `422` business-rule violation, `500` unexpected.

### 4.3 Validation Rules
- Every route that accepts a body/query/params must have a corresponding schema in `validators/` (Joi or Zod) run through `validate.middleware.js` before it reaches the controller.
- Never trust client-supplied IDs for authorization decisions — always re-derive "does this user own/have access to this resource" from `req.user` server-side, never from a client-passed flag.

### 4.4 Database & Model Rules
- No business logic inside Mongoose schema methods beyond simple derived getters. Multi-step logic belongs in a service.
- Every model that's queried by a non-`_id` field in a hot path must have an explicit index.
- Soft-delete (`status: 'deleted'` / `deletedAt`) is used instead of hard delete for any entity tied to audit/compliance needs (applications, verifications, assessments).
- Schema changes that affect existing documents require a migration script under `backend/migrations/`.

### 4.5 AI Layer Rules
- All LLM/embedding calls go through `ai/llmClient.js` / `ai/embeddingClient.js` — never call a third-party AI SDK directly from a service.
- Every prompt lives in `ai/prompts/` as its own template file — no inline prompt strings scattered across services.
- Every AI-generated output that is shown to a user as a **score or recommendation** must be paired with the structured data that justifies it (matched skills, gaps, evidence) — the AI layer returns both the result and its reasoning, never just a bare number.
- AI calls must have a timeout and a defined fallback (cached previous result, or a clear "temporarily unavailable" state) — a feature must never hard-fail the whole request because the AI layer is slow/down.
- RAG queries must only retrieve from the platform's verified data (profiles, postings, courses) — never let the LLM answer career/skill questions purely from unconstrained internal knowledge for platform-specific facts (FR references, specific job matches, etc.).

### 4.6 Background Jobs Rules
- Anything that doesn't need to block the HTTP response (matching recompute, resume parsing, forecast refresh, notification dispatch) runs as a BullMQ job, not inline in the request handler.
- Every job has a defined retry policy and a dead-letter/failure log — silent job failures are not acceptable.

---

## 5. Security Rules

1. **Auth**: JWT access tokens are short-lived (≤ 15 min); refresh tokens are httpOnly, secure cookies. No tokens in localStorage.
2. **RBAC**: Every non-public route declares its allowed roles explicitly via `rbac.middleware.js` — there is no "implicitly open" route.
3. **File uploads**: All uploads (resumes, certificates, project files) go through `upload.middleware.js`, which enforces file-type allowlists, size limits, and virus/malware scanning before storage.
4. **Secrets**: No API keys, DB URIs, or JWT secrets are ever committed. `.env` is git-ignored; `.env.example` documents required keys with placeholder values.
5. **Rate limiting**: All public/auth endpoints and AI-invoking endpoints (assessment submission, resume analysis, mock interview) have rate limits to prevent abuse and cost overrun.
6. **PII handling**: Any field classified as PII (contact info, government IDs if collected, academic records) is only returned in API responses to roles explicitly authorized to see it — this is enforced in the service layer, not left to the frontend to hide.
7. **Audit logging**: Verification actions, score overrides, and admin actions are written to `AuditLog` — this is not optional for these action types.
8. **Dependency hygiene**: No new dependency is added without checking for known vulnerabilities (`npm audit`) and confirming it's actively maintained.

---

## 6. Git & Workflow Rules

### 6.1 Branching
- `main` — always deployable.
- `develop` — integration branch.
- `feature/*`, `fix/*`, `chore/*`, `refactor/*` — branch off `develop`.

### 6.2 Commit Messages (Conventional Commits)
```
<type>(<scope>): <short description>

feat(student): add what-if career simulator UI
fix(backend/matching): correct weighting for assessment score
refactor(frontend/api): centralize opportunity API calls
docs: update architecture doc with jobs queue detail
```
Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `style`.

### 6.3 Pull Requests
- PR description must state: what changed, why, and how it was tested.
- No PR merges without at least one review approval.
- No PR merges with failing CI (lint, tests, build).
- PRs touching the AI layer must include example input/output in the description for reviewer sanity-checking.

### 6.4 Code Review Checklist (reviewer must confirm before approving)
- [ ] File is in the correct architectural layer/folder.
- [ ] No duplicated logic/component/style that already exists elsewhere in the codebase.
- [ ] No duplicate or unused imports; import order follows convention (external → internal → relative).
- [ ] No direct DB/API calls outside their designated layer.
- [ ] Inputs validated (backend) / loading-empty-error states handled (frontend).
- [ ] No secrets or hardcoded environment values.
- [ ] AI-driven scores/recommendations include an explanation payload.
- [ ] Tests added/updated for new logic.
- [ ] No console.log left in production code paths (use the logger).

---

## 7. Testing Rules

| Layer | Requirement |
|---|---|
| Services (backend) | Unit tests for all business logic, especially `matching.service.js`, `skillGap.service.js`, `explanation.service.js` |
| Controllers | Integration tests hitting real routes with a test DB, covering success + validation-error + auth-error paths |
| Models | Schema validation tests for required fields and constraints |
| Frontend hooks | Test loading/success/error states with mocked API responses |
| Frontend components | Render tests for empty/loading/error states, plus key interaction tests (e.g., applying to an opportunity) |
| AI layer | Contract tests using recorded/mocked LLM responses — real LLM calls are not part of the standard test suite (too slow/costly/non-deterministic) |

Minimum coverage target: 80% on `services/` and `controllers/`, 70% on frontend `hooks/` and `components/`.

---

## 8. Documentation Rules

- Every new service function has a JSDoc block: purpose, params, return shape.
- Every new API route is documented (OpenAPI/Swagger annotation or a maintained `API.md`) before merge — undocumented endpoints are not acceptable for release.
- Any new environment variable is added to `.env.example` with a comment explaining what it's for.
- Significant architectural decisions (new service, new external dependency, schema change affecting multiple modules) get a short ADR (Architecture Decision Record) in `docs/adr/`.

---

## 9. Product-Specific Guardrails

These rules exist because of commitments made in the PRD and must not be silently dropped during implementation:

1. **Never label a behavioral assessment result as a diagnosis.** Copy and UI must present it as a tendency/indicator, per PRD §33 / Section 9 (Privacy & Trust Principles).
2. **Never present Placement Readiness Score or compatibility % without the "guidance, not guarantee" framing** in the UI copy.
3. **Always visually distinguish claimed vs. verified skills** everywhere a skill appears (passport, profile, recruiter search results).
4. **Every recommendation must be explainable.** If a new recommendation type is added (e.g., a new mentor-matching algorithm) and it cannot produce a "why" explanation, it does not ship until it can.
5. **Respect student-controlled visibility settings** on every new surface that displays profile/passport data — a new feature does not get to bypass existing consent settings.

---

## 10. When Rules Conflict or Are Unclear

If a contributor (human or AI) is unsure whether a change complies with these rules, the default behavior is:
1. Check the Architecture doc for the intended layer/pattern.
2. Check this Rules doc for an explicit convention.
3. If still unclear, flag it in the PR description or ask before proceeding — do not guess silently on security, privacy, or explainability-related decisions.
