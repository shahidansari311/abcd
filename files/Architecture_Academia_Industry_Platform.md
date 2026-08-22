# Technical Architecture Document
## Academia–Industry Collaboration & Intelligent Career Development Platform

**Document Version:** 1.0
**Status:** Draft
**Companion to:** PRD_Academia_Industry_Platform.md
**Last Updated:** August 22, 2026

---

## 1. Tech Stack Overview

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router, Redux Toolkit / Zustand, Axios, TailwindCSS |
| Backend | Node.js + Express (MVC pattern) |
| Database | MongoDB (primary), Redis (caching/queues), Vector DB (Pinecone/Weaviate/pgvector) for embeddings |
| AI Layer | LLM API (Anthropic/OpenAI), Embedding service, RAG pipeline |
| Auth | JWT + Refresh tokens, RBAC middleware |
| File Storage | S3-compatible object storage (resumes, certificates, project files) |
| Queue/Jobs | BullMQ (Redis-backed) for async tasks (resume parsing, matching recompute, notifications) |
| Real-time | Socket.IO (chat, mentorship sessions, notifications) |
| Infra | Docker, CI/CD (GitHub Actions), Nginx reverse proxy |

---

## 2. High-Level System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                 │
│   Student App | Industry App | Academician App | Institution │
└───────────────────────────┬────────────────────────────────┘
                             │ REST/JSON (Axios) + WebSocket
┌───────────────────────────▼────────────────────────────────┐
│                     API GATEWAY / Express App                │
│         Auth Middleware → RBAC → Rate Limiter → Routes       │
└───────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼─────────────────────┐
        ▼                    ▼                     ▼
┌───────────────┐   ┌─────────────────┐   ┌──────────────────┐
│  Controllers   │   │    Services      │   │   AI/ML Service   │
│  (MVC layer)   │──▶│ (business logic) │──▶│  (LLM, embeddings,│
│                │   │                  │   │   RAG, matching)  │
└───────┬────────┘   └────────┬─────────┘   └─────────┬────────┘
        │                     │                        │
        ▼                     ▼                        ▼
┌───────────────┐   ┌─────────────────┐   ┌──────────────────┐
│    Models       │   │  Redis (cache/  │   │   Vector Database  │
│  (Mongoose/ORM) │   │   queues)       │   │   (embeddings)     │
└───────┬────────┘   └─────────────────┘   └──────────────────┘
        ▼
┌───────────────┐
│   MongoDB       │
└───────────────┘
```

---

## 3. Frontend Architecture (React + Vite)

### 3.1 Principles
- **Feature-first + role-based structure**: since the platform serves 4 distinct roles (Student, Industry, Academician, Institution), pages and components are grouped by role/domain, with a shared `common/` layer for cross-cutting UI.
- **Pages** are route-level containers (composition only); **Components** are reusable, presentation/logic units.
- **Hooks** encapsulate data-fetching and stateful logic, keeping pages/components thin.
- **API layer** is centralized — no direct axios calls inside components/pages.
- State: local/server state via React Query (or RTK Query); global/cross-cutting state (auth, theme, notifications) via Redux Toolkit or Zustand.

### 3.2 Folder Structure

```text
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx              # Top-level route definitions
│   │   ├── PrivateRoute.jsx           # Auth guard
│   │   └── RoleBasedRoute.jsx         # RBAC route guard
│   │
│   ├── pages/                          # Route-level containers only
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   │
│   │   ├── student/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AssessmentPage.jsx
│   │   │   ├── SkillProfilePage.jsx
│   │   │   ├── SkillGapPage.jsx
│   │   │   ├── CareerRoadmapPage.jsx
│   │   │   ├── WhatIfSimulatorPage.jsx
│   │   │   ├── OpportunitiesPage.jsx      # Jobs/Internships listing
│   │   │   ├── OpportunityDetailPage.jsx
│   │   │   ├── ApplicationsTrackerPage.jsx
│   │   │   ├── SkillPassportPage.jsx
│   │   │   ├── MockInterviewPage.jsx
│   │   │   ├── ResumeAnalyzerPage.jsx
│   │   │   ├── MentorshipPage.jsx
│   │   │   ├── ChallengesPage.jsx
│   │   │   └── CommunityPage.jsx
│   │   │
│   │   ├── industry/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── OrganizationProfilePage.jsx
│   │   │   ├── PostOpportunityPage.jsx        # Job/Internship/Challenge form
│   │   │   ├── ManagePostingsPage.jsx
│   │   │   ├── CandidateSearchPage.jsx
│   │   │   ├── CandidateDetailPage.jsx
│   │   │   ├── RecruitmentPipelinePage.jsx
│   │   │   ├── ChallengeEvaluationPage.jsx
│   │   │   ├── SkillVerificationPage.jsx
│   │   │   └── AnalyticsPage.jsx
│   │   │
│   │   ├── academician/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── OpportunityDiscoveryPage.jsx   # FDP/consultancy/research
│   │   │   ├── CollaborationHubPage.jsx
│   │   │   └── PortfolioPage.jsx
│   │   │
│   │   ├── institution/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── StudentOverviewPage.jsx
│   │   │   ├── DepartmentHeatmapPage.jsx
│   │   │   ├── PlacementAnalyticsPage.jsx
│   │   │   ├── IndustryPartnersPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   │
│   │   ├── shared/
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── UnauthorizedPage.jsx
│   │   │   └── NotificationsPage.jsx
│   │   │
│   │   └── landing/
│   │       ├── HomePage.jsx
│   │       └── AboutPage.jsx
│   │
│   ├── components/                     # Reusable, presentation + logic units
│   │   ├── common/                     # Buttons, inputs, modals, cards, etc.
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── ScoreBar.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── assessment/
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── AssessmentTimer.jsx
│   │   │   └── ResultSummary.jsx
│   │   │
│   │   ├── skill/
│   │   │   ├── SkillProfileChart.jsx
│   │   │   ├── SkillGapTable.jsx
│   │   │   ├── SkillGraphView.jsx
│   │   │   └── SkillBadge.jsx
│   │   │
│   │   ├── opportunity/
│   │   │   ├── OpportunityCard.jsx
│   │   │   ├── CompatibilityScore.jsx
│   │   │   ├── MatchExplanation.jsx       # "Why am I seeing this?"
│   │   │   └── ApplicationStatusTracker.jsx
│   │   │
│   │   ├── passport/
│   │   │   ├── PassportSkillItem.jsx
│   │   │   └── EvidenceBadge.jsx
│   │   │
│   │   ├── mentorship/
│   │   │   ├── MentorCard.jsx
│   │   │   └── SessionScheduler.jsx
│   │   │
│   │   ├── interview/
│   │   │   ├── InterviewQuestionCard.jsx
│   │   │   └── FeedbackPanel.jsx
│   │   │
│   │   └── charts/
│   │       ├── HeatmapChart.jsx
│   │       ├── TrendChart.jsx
│   │       └── RadarChart.jsx
│   │
│   ├── hooks/                          # Data-fetching & stateful logic
│   │   ├── useAuth.js
│   │   ├── useAssessment.js
│   │   ├── useSkillProfile.js
│   │   ├── useOpportunities.js
│   │   ├── useApplications.js
│   │   ├── useMentorship.js
│   │   └── useDebounce.js
│   │
│   ├── api/                            # Centralized API layer
│   │   ├── axiosClient.js              # Base instance + interceptors
│   │   ├── authApi.js
│   │   ├── studentApi.js
│   │   ├── industryApi.js
│   │   ├── academicianApi.js
│   │   ├── institutionApi.js
│   │   ├── opportunityApi.js
│   │   ├── skillApi.js
│   │   └── aiApi.js                    # Simulator, resume analysis, interview
│   │
│   ├── store/                          # Global state (Redux Toolkit / Zustand)
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── notificationSlice.js
│   │   └── uiSlice.js
│   │
│   ├── context/
│   │   └── ThemeContext.jsx
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── roleHelpers.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   └── styles/
│       ├── index.css
│       └── tailwind.config.js
│
├── .env
├── vite.config.js
├── package.json
└── index.html
```

### 3.3 Routing Convention
- Route guards: `PrivateRoute` (must be authenticated) wraps `RoleBasedRoute` (must have allowed role), which renders the page.
- Route paths are role-prefixed, e.g. `/student/dashboard`, `/industry/postings`, `/institution/analytics`.
- Lazy-loading via `React.lazy` + `Suspense` for all page-level components to keep bundle size low.

### 3.4 State Management Convention
| State type | Tool |
|---|---|
| Server/data state (API responses, caching, pagination) | React Query / RTK Query |
| Global app state (auth session, active role, theme) | Redux Toolkit slice / Zustand store |
| Local component/UI state | `useState` / `useReducer` |
| Cross-component ephemeral state (form wizards) | Context, scoped to the flow only |

---

## 4. Backend Architecture (Express — MVC Pattern)

### 4.1 Principles
- Strict **Model–View–Controller** separation, adapted for a JSON API (no server-rendered views — "View" is the JSON response shape, defined via serializers/DTOs).
- **Routes** map HTTP verbs/paths to controller methods only — no business logic in routes.
- **Controllers** handle request/response cycle (parse input, call service, format output) — no direct DB queries in controllers.
- **Services** contain business logic and orchestration (including AI/matching calls) — reusable across controllers and background jobs.
- **Models** define schema/data access only (Mongoose models + static/query helpers).
- **Middlewares** handle cross-cutting concerns: auth, RBAC, validation, error handling, rate limiting.

### 4.2 Folder Structure

```text
backend/
├── src/
│   ├── server.js                      # Entry point — starts HTTP server
│   ├── app.js                         # Express app config (middlewares, routes mount)
│   │
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   ├── redis.js                   # Redis connection
│   │   ├── env.js                     # Env variable validation/export
│   │   ├── vectorDb.js                # Vector DB client config
│   │   └── logger.js                  # Winston/Pino logger config
│   │
│   ├── routes/                        # Route definitions (no logic)
│   │   ├── index.js                   # Aggregates & mounts all routers
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── industry.routes.js
│   │   ├── academician.routes.js
│   │   ├── institution.routes.js
│   │   ├── assessment.routes.js
│   │   ├── skill.routes.js
│   │   ├── opportunity.routes.js      # Jobs/Internships/Challenges
│   │   ├── application.routes.js
│   │   ├── mentorship.routes.js
│   │   ├── interview.routes.js        # AI mock interview
│   │   ├── resume.routes.js           # AI resume intelligence
│   │   ├── passport.routes.js         # Digital Skill Passport
│   │   ├── verification.routes.js     # Credential verification
│   │   ├── analytics.routes.js
│   │   └── notification.routes.js
│   │
│   ├── controllers/                   # Request/response handling only
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── industry.controller.js
│   │   ├── academician.controller.js
│   │   ├── institution.controller.js
│   │   ├── assessment.controller.js
│   │   ├── skill.controller.js
│   │   ├── opportunity.controller.js
│   │   ├── application.controller.js
│   │   ├── mentorship.controller.js
│   │   ├── interview.controller.js
│   │   ├── resume.controller.js
│   │   ├── passport.controller.js
│   │   ├── verification.controller.js
│   │   └── analytics.controller.js
│   │
│   ├── services/                      # Business logic, orchestration, AI calls
│   │   ├── auth.service.js
│   │   ├── student.service.js
│   │   ├── industry.service.js
│   │   ├── assessment.service.js
│   │   ├── skillProfile.service.js
│   │   ├── skillGap.service.js
│   │   ├── careerRoadmap.service.js
│   │   ├── whatIfSimulator.service.js
│   │   ├── matching.service.js        # Rule-based + embedding + weighted scoring
│   │   ├── explanation.service.js     # Generates "why recommended" text
│   │   ├── opportunity.service.js
│   │   ├── application.service.js
│   │   ├── mentorship.service.js
│   │   ├── interview.service.js       # LLM-driven mock interview logic
│   │   ├── resumeAnalysis.service.js
│   │   ├── passport.service.js
│   │   ├── verification.service.js    # Trusted-issuer / fraud checks
│   │   ├── analytics.service.js
│   │   ├── heatmap.service.js
│   │   ├── forecasting.service.js
│   │   └── notification.service.js
│   │
│   ├── ai/                            # AI/ML integration layer
│   │   ├── llmClient.js               # LLM API wrapper
│   │   ├── embeddingClient.js         # Embedding generation
│   │   ├── ragPipeline.js             # Retrieval-augmented generation flow
│   │   ├── skillExtraction.ai.js      # Project/resume → skill extraction
│   │   ├── interviewGenerator.ai.js
│   │   └── prompts/
│   │       ├── skillExtraction.prompt.js
│   │       ├── explanation.prompt.js
│   │       ├── interview.prompt.js
│   │       └── roadmap.prompt.js
│   │
│   ├── models/                        # Mongoose schemas — data access only
│   │   ├── User.model.js              # Base user (discriminator for roles)
│   │   ├── Student.model.js
│   │   ├── Industry.model.js
│   │   ├── Academician.model.js
│   │   ├── Institution.model.js
│   │   ├── SkillProfile.model.js
│   │   ├── SkillGraphNode.model.js
│   │   ├── Assessment.model.js
│   │   ├── AssessmentResult.model.js
│   │   ├── Opportunity.model.js       # Job/Internship/Challenge (discriminated)
│   │   ├── Application.model.js
│   │   ├── Project.model.js
│   │   ├── Certification.model.js
│   │   ├── SkillPassport.model.js
│   │   ├── Verification.model.js
│   │   ├── Mentorship.model.js
│   │   ├── MentorSession.model.js
│   │   ├── InterviewSession.model.js
│   │   ├── Notification.model.js
│   │   └── AuditLog.model.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js         # JWT verification
│   │   ├── rbac.middleware.js         # Role-based access control
│   │   ├── validate.middleware.js     # Request schema validation (Joi/Zod)
│   │   ├── errorHandler.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   ├── upload.middleware.js       # Multer/S3 upload handling
│   │   └── auditLogger.middleware.js
│   │
│   ├── validators/                    # Request schemas (Joi/Zod)
│   │   ├── auth.validator.js
│   │   ├── assessment.validator.js
│   │   ├── opportunity.validator.js
│   │   └── application.validator.js
│   │
│   ├── jobs/                          # Background/async jobs (BullMQ)
│   │   ├── queues/
│   │   │   ├── matchingQueue.js
│   │   │   ├── resumeParseQueue.js
│   │   │   └── notificationQueue.js
│   │   └── workers/
│   │       ├── matchingRecompute.worker.js
│   │       ├── resumeParse.worker.js
│   │       ├── forecastRefresh.worker.js
│   │       └── notification.worker.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js             # Standardized response wrapper
│   │   ├── apiError.js                # Custom error class
│   │   ├── asyncHandler.js            # try/catch wrapper for controllers
│   │   ├── pagination.js
│   │   └── constants.js
│   │
│   └── sockets/
│       ├── socketServer.js
│       ├── notification.socket.js
│       └── mentorship.socket.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── .env
├── package.json
└── Dockerfile
```

### 4.3 Request Lifecycle (Example: "Get matched opportunities for a student")

```text
GET /api/student/opportunities/matches
   ↓
routes/opportunity.routes.js
   ↓
middlewares: auth.middleware → rbac.middleware(role: student) → rateLimiter
   ↓
controllers/opportunity.controller.js  (getMatches)
   ↓
services/matching.service.js
   ├─→ models/SkillProfile.model.js      (fetch student skill profile)
   ├─→ models/Opportunity.model.js       (fetch active postings)
   ├─→ ai/embeddingClient.js             (semantic similarity)
   └─→ services/explanation.service.js   (generate "why recommended")
   ↓
controllers formats response via utils/apiResponse.js
   ↓
JSON response → Frontend (api/opportunityApi.js → useOpportunities hook)
```

### 4.4 Layer Responsibilities Summary

| Layer | Responsibility | Must NOT contain |
|---|---|---|
| Routes | Map endpoint → controller + attach middlewares | Business logic, DB queries |
| Controllers | Parse request, call service, shape response | DB queries, AI calls, complex logic |
| Services | Business logic, orchestration, AI/matching calls | Express req/res objects |
| Models | Schema definition, query helpers, indexes | Business/orchestration logic |
| Middlewares | Auth, validation, RBAC, error handling | Business logic |
| AI layer | LLM/embedding calls, prompt templates | Direct DB access (goes through services) |

---

## 5. Cross-Cutting Concerns

### 5.1 Authentication & RBAC
- JWT access token (short-lived) + refresh token (httpOnly cookie).
- `rbac.middleware.js` checks `req.user.role` against an `allowedRoles` array passed per route.
- Roles: `student`, `industry`, `academician`, `institution_admin`, `recruiter`, `mentor`, `super_admin`.

### 5.2 Error Handling
- All controllers wrapped in `asyncHandler` to funnel errors to `errorHandler.middleware.js`.
- Standardized error shape: `{ success: false, message, code, details }`.

### 5.3 API Response Convention
```json
{
  "success": true,
  "data": { },
  "meta": { "page": 1, "totalPages": 5 }
}
```

### 5.4 Background Jobs
- Skill profile recompute, matching score refresh, resume parsing, and forecast refresh run as async BullMQ jobs, not inline in the request cycle, to keep API latency low.

### 5.5 Environment Config
- `config/env.js` validates required env vars at boot (fail fast) using Zod/Joi schema — DB URIs, JWT secrets, LLM API keys, S3 credentials, Redis URL.

---

## 6. Suggested Core Data Entities (High-Level)

| Entity | Key Fields |
|---|---|
| User | role, email, passwordHash, status |
| Student | skillProfileRef, resumeUrl, projects[], certifications[], readinessScore |
| SkillProfile | skills[{name, score, confidence, evidence[]}] |
| Opportunity | type (job/internship/challenge), requiredSkills[], preferredSkills[], eligibility, postedBy |
| Application | studentId, opportunityId, status, compatibilityScore, explanation |
| SkillPassport | studentId, verifiedSkills[], evidenceLinks[] |
| Verification | targetSkill, verifiedBy, method, date |
| MentorSession | mentorId, studentId, scheduledAt, status |
| InterviewSession | studentId, targetRole, questions[], feedback |
| Institution | departments[], dashboardMetrics |

---

## 7. Notes for Implementation
- Keep `services/matching.service.js` and `services/explanation.service.js` decoupled — matching computes scores, explanation independently converts the score breakdown into human-readable text, so explanations stay consistent even if the scoring algorithm changes.
- All AI-layer calls (`ai/`) should go through the `services/` layer, never called directly from controllers, so business rules (e.g., caching, fallback on LLM failure) stay centralized.
- Frontend `api/` modules should mirror backend `routes/` naming 1:1 to make endpoint tracing trivial across the stack.
