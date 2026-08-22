# Development Roadmap — 5 Phases
## Academia–Industry Collaboration & Intelligent Career Development Platform

**Companion to:** PRD_Academia_Industry_Platform.md, Architecture_Academia_Industry_Platform.md, RULES_Academia_Industry_Platform.md
**Last Updated:** August 22, 2026

This document consolidates all five development phases into a single roadmap. Each phase builds on the deliverables of the previous one — see each phase's "Dependencies for Next Phase" note.

| Phase | Focus |
|---|---|
| [Phase 1](#phase-1-foundation--core-setup) | Foundation & Core Setup |
| [Phase 2](#phase-2-skill-assessment--intelligence-core) | Skill Assessment & Intelligence Core |
| [Phase 3](#phase-3-opportunity-matching--lifecycle-management) | Opportunity Matching & Lifecycle Management |
| [Phase 4](#phase-4-ai-differentiators) | AI Differentiators |
| [Phase 5](#phase-5-ecosystem--collaboration-expansion) | Ecosystem & Collaboration Expansion |

---

## Phase 1: Foundation & Core Setup


### Goal
Stand up the project skeleton, authentication, role-based access, and basic profile management for all four roles (Student, Industry, Academician, Institution). No AI/matching features yet — this phase proves the platform works end-to-end at an infrastructure level.

### Why This Phase First
Every other phase depends on: users being able to register/log in as the correct role, RBAC being enforced, and each role having a profile to attach data to (skills, postings, dashboards, etc.).

---

### Features Included (PRD Mapping)
- Multi-role registration and authentication
- Role-based access control (RBAC)
- Basic profile creation per role (Student, Industry, Academician, Institution)
- Institution/Industry verification workflow (manual admin approval at this stage)
- File upload infrastructure (resume, logo, certificates — storage only, no AI parsing yet)
- Notification infrastructure (in-app, basic email)

### Out of Scope for This Phase
- Skill assessment engine
- Any AI/LLM/embedding features
- Matching, recommendations, dashboards with real analytics

---

### Backend Deliverables

#### Setup
- Express app skeleton per Architecture doc (`app.js`, `server.js`, `config/`)
- MongoDB + Redis connection setup
- Environment variable validation (`config/env.js`)
- Logger, error handler, async handler utilities
- Docker + docker-compose for local dev (API + Mongo + Redis)
- CI pipeline: lint, test, build on PR

#### Models
- `User.model.js` (base, with role discriminator)
- `Student.model.js`, `Industry.model.js`, `Academician.model.js`, `Institution.model.js`
- `Notification.model.js`
- `AuditLog.model.js`

#### Routes / Controllers / Services
- `auth.routes.js` — register, login, refresh token, logout, forgot/reset password
- `student.routes.js`, `industry.routes.js`, `academician.routes.js`, `institution.routes.js` — profile CRUD only
- `verification.routes.js` — admin approval flow for Industry/Institution accounts (manual review queue)
- `notification.routes.js` — fetch/mark-read

#### Middlewares
- `auth.middleware.js` (JWT verification)
- `rbac.middleware.js`
- `validate.middleware.js` with Joi/Zod schemas for register/login/profile
- `upload.middleware.js` (S3-compatible storage, file-type/size validation, malware scan hook)
- `rateLimiter.middleware.js` on auth endpoints

---

### Frontend Deliverables

#### Setup
- Vite + React project scaffolded per Architecture folder structure
- TailwindCSS configured
- Axios client with interceptors (`api/axiosClient.js`)
- Redux Toolkit/Zustand store: `authSlice`, `uiSlice`, `notificationSlice`
- Routing skeleton: `AppRoutes.jsx`, `PrivateRoute.jsx`, `RoleBasedRoute.jsx`

#### Pages
- `auth/LoginPage.jsx`, `RegisterPage.jsx`, `ForgotPasswordPage.jsx`
- `student/ProfilePage.jsx` (basic profile form only)
- `industry/OrganizationProfilePage.jsx`
- `academician/ProfilePage.jsx`
- `institution/DashboardPage.jsx` (placeholder shell, no real metrics yet)
- `shared/NotFoundPage.jsx`, `UnauthorizedPage.jsx`
- `landing/HomePage.jsx`

#### Components
- `layout/Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx`, `DashboardLayout.jsx`
- `common/Button.jsx`, `Modal.jsx`, `Card.jsx`, `Loader.jsx`, `EmptyState.jsx`

---

### Exit Criteria (Definition of Done for Phase 1)
- [ ] A user can register as any of the 4 roles and log in.
- [ ] JWT auth + refresh token flow works; RBAC blocks cross-role access to protected routes.
- [ ] Industry/Institution accounts require admin approval before becoming active.
- [ ] Each role has a working profile page (create/edit/view).
- [ ] File upload works for at least one document type (resume) with validation and secure storage.
- [ ] Basic in-app notifications render.
- [ ] CI passes lint + tests on every PR; Docker Compose brings up the full stack locally in one command.

### Dependencies for Next Phase
Phase 2 (Skill Assessment & Profiling) requires: authenticated Student accounts, `Student.model.js`, and the upload pipeline (for resume-based profiling) already in place — all delivered here.
-e 
---

## Phase 2: Skill Assessment & Intelligence Core


### Goal
Build the core skill intelligence loop: **Assess → AI Skill Profile → Skill Gap Analysis → Career Roadmap**. By the end of this phase, a student can take an assessment, get a structured skill profile, compare it to a target role, and see a generated roadmap — the heart of the product's value proposition.

### Why This Phase Second
This is the platform's central differentiator and every downstream feature (matching, passport, readiness score, simulator) consumes the Skill Profile and Skill Graph built here.

---

### Features Included (PRD Mapping)
- Skill Assessment System (Technical, Aptitude, Soft Skill, Behavioral) — §4 / FR-1.x
- AI-Based Skill Profiling — §5 / FR-2.x
- Skill Gap Analysis — §6 / FR-3.x
- AI Career Roadmap — §7 / FR-4.x
- Skill Knowledge Graph (foundational version) — §36
- AI layer bootstrap: LLM client, embedding client, RAG pipeline skeleton — §8

### Out of Scope for This Phase
- Job/internship matching (Phase 3)
- What-If Simulator, Resume Intelligence, Mock Interview (Phase 4)
- Passport verification and industry sign-off (Phase 3)

---

### Backend Deliverables

#### AI Layer (new in this phase)
- `ai/llmClient.js`, `ai/embeddingClient.js`
- `ai/ragPipeline.js` (skeleton — retrieval against skills/roles knowledge base)
- `ai/prompts/roadmap.prompt.js`
- Vector DB connection (`config/vectorDb.js`) and initial skill/role embedding seed data

#### Models
- `SkillProfile.model.js`
- `SkillGraphNode.model.js`
- `Assessment.model.js`, `AssessmentResult.model.js`

#### Routes / Controllers / Services
- `assessment.routes.js` — list assessments, start, submit, get result
- `skill.routes.js` — get skill profile, get skill gap vs. target role, get roadmap
- `services/assessment.service.js` — scoring logic per dimension
- `services/skillProfile.service.js` — aggregates assessment + resume + certifications into profile
- `services/skillGap.service.js` — compares profile vs. target role requirements
- `services/careerRoadmap.service.js` — generates sequential roadmap from gaps
- Background job: `jobs/workers/skillProfileRecompute.worker.js` (recompute profile when new evidence added)

#### Data Seeding
- Seed a baseline set of roles with required-skill definitions (e.g., Full Stack Developer, Data Engineer) to enable gap analysis before industry postings exist.

---

### Frontend Deliverables

#### Pages
- `student/AssessmentPage.jsx`
- `student/SkillProfilePage.jsx`
- `student/SkillGapPage.jsx`
- `student/CareerRoadmapPage.jsx`

#### Components
- `assessment/QuestionCard.jsx`, `AssessmentTimer.jsx`, `ResultSummary.jsx`
- `skill/SkillProfileChart.jsx`, `SkillGapTable.jsx`, `SkillGraphView.jsx`, `SkillBadge.jsx`

#### Hooks / API
- `hooks/useAssessment.js`, `hooks/useSkillProfile.js`
- `api/skillApi.js`

#### UX Requirement (per RULES §9)
- Behavioral assessment results must display with explicit "tendency indicator, not a diagnosis" framing — copy reviewed before release.

---

### Exit Criteria (Definition of Done for Phase 2)
- [ ] Student can complete a Technical + Aptitude + Soft Skill + Behavioral assessment.
- [ ] System generates a structured Skill Profile with per-skill percentage scores.
- [ ] Student can select a target role and see a Skill Gap table (current vs. required, gap flagged).
- [ ] System generates a sequential Career Roadmap from the identified gaps.
- [ ] Skill Profile recomputes automatically when new evidence (e.g., a certification upload) is added.
- [ ] Behavioral assessment UI carries the required non-diagnostic disclaimer.
- [ ] AI layer (LLM + embedding + vector DB) is operational and used for roadmap generation.

### Dependencies for Next Phase
Phase 3 (Matching & Opportunity Lifecycle) requires: a populated `SkillProfile` per student and the embedding/vector infrastructure built here to compute compatibility scores against postings.
-e 
---

## Phase 3: Opportunity Matching & Lifecycle Management


### Goal
Enable Industries to post opportunities, enable Students to discover explainable, ranked matches, and support the full internship/placement lifecycle from application to offer. Ship the Digital Skill Passport with basic (self-reported) evidence. This phase completes the platform's MVP core loop.

### Why This Phase Third
This is where the Skill Profile built in Phase 2 becomes actionable — matched against real opportunities — and where Industry users get their first real value from the platform.

---

### Features Included (PRD Mapping)
- Intelligent Job & Internship Matching — §8 / FR-5.x
- Explainable Recommendations ("Why am I seeing this?") — §28 / FR-7.x
- Internship Lifecycle Management — §19 / FR-15.x
- Placement Lifecycle Management — §20 / FR-16.x
- Digital Skill Passport (basic, self-reported evidence) — §13 / FR-10.x
- Fraud & Credential Verification (basic trusted-issuer checks) — §32 / FR-24.x
- Institutional Dashboard (core metrics) — §24 / FR-20.x

### Out of Scope for This Phase
- What-If Simulator, Resume Intelligence, Mock Interview (Phase 4)
- Industry-Verified Skills sign-off flow, Challenge Marketplace (Phase 4)
- Mentorship, Faculty Hub, Live Project Hub, Team Formation (Phase 5)

---

### Backend Deliverables

#### Models
- `Opportunity.model.js` (discriminated: job / internship)
- `Application.model.js`
- `SkillPassport.model.js`
- `Verification.model.js` (basic trusted-issuer check)

#### Routes / Controllers / Services
- `opportunity.routes.js` — CRUD for postings (industry), search/list/detail (student)
- `application.routes.js` — apply, withdraw, status tracking, industry-side shortlist/reject/offer actions
- `passport.routes.js` — view/share passport
- `verification.routes.js` (extended) — flag/verify certificates against trusted issuers
- `analytics.routes.js` (institution core metrics only)
- `services/matching.service.js` — rule-based hard filters + embedding similarity + weighted scoring (per Architecture §8)
- `services/explanation.service.js` — converts score breakdown into human-readable reasons
- `services/opportunity.service.js`, `services/application.service.js`, `services/passport.service.js`
- `services/analytics.service.js` — institution dashboard aggregates
- Background jobs: `jobs/workers/matchingRecompute.worker.js` (recompute matches when profile or postings change)

---

### Frontend Deliverables

#### Pages
- `industry/PostOpportunityPage.jsx`, `ManagePostingsPage.jsx`, `RecruitmentPipelinePage.jsx`
- `student/OpportunitiesPage.jsx`, `OpportunityDetailPage.jsx`, `ApplicationsTrackerPage.jsx`, `SkillPassportPage.jsx`
- `institution/DashboardPage.jsx` (now with real metrics), `PlacementAnalyticsPage.jsx`

#### Components
- `opportunity/OpportunityCard.jsx`, `CompatibilityScore.jsx`, `MatchExplanation.jsx`, `ApplicationStatusTracker.jsx`
- `passport/PassportSkillItem.jsx`, `EvidenceBadge.jsx`
- `charts/TrendChart.jsx` (for institution dashboard)

#### Hooks / API
- `hooks/useOpportunities.js`, `hooks/useApplications.js`
- `api/opportunityApi.js`

#### UX Requirement (per RULES §3.5 / §9)
- Every compatibility score must render with a "Why?" affordance backed by `MatchExplanation.jsx` — no bare percentages.
- Claimed vs. verified skills must be visually distinct on the Passport page.

---

### Exit Criteria (Definition of Done for Phase 3)
- [ ] Industry can post a job/internship with required/preferred skills, eligibility, and compensation.
- [ ] Student sees a ranked, explainable list of matched opportunities with compatibility scores.
- [ ] Student can apply; Industry can view applicants ranked by compatibility and move them through shortlist → interview → offer.
- [ ] Student has a single dashboard tracking all application statuses in real time.
- [ ] Digital Skill Passport displays skills with evidence type, distinguishing self-reported vs. verified.
- [ ] Institution dashboard shows real aggregate metrics (placement readiness, applications, active postings).
- [ ] Basic credential verification flags unverifiable certificates against a trusted-issuer list.

### Dependencies for Next Phase
Phase 4 (AI Differentiators) requires: the matching engine and explanation service built here (extended by the What-If Simulator), and the Opportunity/Application models (extended for Challenges).
-e 
---

## Phase 4: AI Differentiators


### Goal
Ship the features that differentiate this platform from LinkedIn/Internshala-style portals: the What-If Career Simulator, AI Resume Intelligence, AI Mock Interview, Project-to-Skill Mapping, Industry Skill Heatmap & Forecasting, Industry Challenge Marketplace, Placement Readiness Score, and Recruiter Skill-Based Search.

### Why This Phase Fourth
These features build directly on the matching engine, skill graph, and explanation service delivered in Phases 2–3. They are high-value but not required for the platform to function end-to-end, so they follow the core loop rather than blocking it.

---

### Features Included (PRD Mapping)
- "What If?" Career Simulator — §9 / FR-6.x
- Industry Skill Heatmap — §10
- Skill Demand Forecasting — §11 / FR-8.x
- AI Project-to-Skill Mapping — §12 / FR-9.x
- Industry-Verified Skills (formal sign-off flow) — §14 / FR-11.x
- AI Resume Intelligence — §15 / FR-12.x
- AI Mock Interview — §16 / FR-13.x
- Industry Challenge Marketplace — §17 / FR-14.x
- Placement Readiness Score — §26 / FR-21.x
- Recruiter Candidate Discovery (skill-threshold search) — §31 / FR-23.x

### Out of Scope for This Phase
- Faculty–Industry Collaboration Hub, Mentorship Marketplace, Live Project Hub, Intelligent Team Formation, Digital Career Twin (Phase 5)

---

### Backend Deliverables

#### AI Layer (extended)
- `ai/skillExtraction.ai.js` — project/resume text → skill extraction
- `ai/interviewGenerator.ai.js`
- `ai/prompts/skillExtraction.prompt.js`, `interview.prompt.js`, `explanation.prompt.js` (extended for simulator)

#### Models
- `Project.model.js`, `Certification.model.js` (extended with AI-extracted skill tags)
- `InterviewSession.model.js`
- Extend `Opportunity.model.js` to support `type: challenge`
- Extend `Verification.model.js` for formal Industry-Verified Skills sign-off

#### Routes / Controllers / Services
- `resume.routes.js` — AI resume analysis vs. target job description
- `interview.routes.js` — generate questions, submit answers, get feedback
- `services/whatIfSimulator.service.js` — skill-add and role-switch simulation
- `services/heatmap.service.js`, `services/forecasting.service.js`
- `services/resumeAnalysis.service.js`, `services/interview.service.js`
- Extend `opportunity.service.js` for Challenge posting/evaluation flow
- Extend `verification.service.js` for industry sign-off (post-assessment/internship/challenge)
- Background jobs: `jobs/workers/forecastRefresh.worker.js` (periodic recompute of demand trends)

---

### Frontend Deliverables

#### Pages
- `student/WhatIfSimulatorPage.jsx`
- `student/ResumeAnalyzerPage.jsx`
- `student/MockInterviewPage.jsx`
- `student/ChallengesPage.jsx`
- `industry/ChallengeEvaluationPage.jsx`
- `industry/CandidateSearchPage.jsx`, `CandidateDetailPage.jsx`
- `industry/SkillVerificationPage.jsx`
- `industry/AnalyticsPage.jsx` (heatmap/forecasting views)
- `institution/DepartmentHeatmapPage.jsx`

#### Components
- `interview/InterviewQuestionCard.jsx`, `FeedbackPanel.jsx`
- `charts/HeatmapChart.jsx`, `RadarChart.jsx`

#### Hooks / API
- `api/aiApi.js` (simulator, resume analysis, interview)

#### UX Requirement (per RULES §9)
- Placement Readiness Score must always render with "guidance, not guarantee" framing in the UI copy.
- Every simulator output must show missing skills + roadmap + relevant opportunities, not just a number.

---

### Exit Criteria (Definition of Done for Phase 4)
- [ ] Student can run a What-If simulation (add a skill, or switch target role) and see updated eligibility/compatibility.
- [ ] Student can upload a resume and get a match % against a target job with specific improvement suggestions.
- [ ] Student can complete an AI mock interview and receive structured feedback.
- [ ] Industry can post and evaluate Challenges, and shortlist top performers into the pipeline.
- [ ] Industry can formally verify a student's skill post-assessment/internship/challenge.
- [ ] Institution/Industry can view a live skill demand heatmap and trending/declining skill forecasts.
- [ ] Student has a computed Placement Readiness Score with the required "guidance" disclaimer.
- [ ] Recruiters can search candidates using skill thresholds and get ranked results.

### Dependencies for Next Phase
Phase 5 (Ecosystem & Collaboration) requires: the Verification and Skill Graph infrastructure from Phases 2–4 to power Faculty–Industry matching, mentorship, and the Digital Career Twin.
-e 
---

## Phase 5: Ecosystem & Collaboration Expansion


### Goal
Deepen engagement beyond the student-industry core loop: connect Academicians to industry opportunities, launch the Mentorship Marketplace, enable joint Industry–Academia Live Projects, add AI Team Formation for hackathons/projects, and introduce the Digital Career Twin as the platform's long-term continuous-guidance layer.

### Why This Phase Last
These features depend on a mature Skill Graph, Verification system, and matching engine (Phases 2–4) and extend the platform's value to Academicians and Institutions at a deeper level once the core Student–Industry loop is proven and adopted.

---

### Features Included (PRD Mapping)
- Faculty–Industry Collaboration Hub — §21 / FR-17.x
- Industry Mentorship Marketplace — §22 / FR-18.x
- Industry–Academia Live Project Hub — §23 / FR-19.x
- Intelligent Team Formation — §30 / FR-22.x
- Digital Career Twin — §37
- Collaborative Skill Development (student communities) — §29
- Deepened Institutional analytics: department comparisons, FDP tracking, curriculum-alignment insights — §24, §25

### Out of Scope
- Native mobile apps (evaluate as a subsequent phase based on adoption data)
- Blockchain-based credentialing (future enhancement, not committed in this roadmap)

---

### Backend Deliverables

#### Models
- `Mentorship.model.js`, `MentorSession.model.js`
- `LiveProject.model.js` (industry-posted, team-based)
- `Team.model.js` (for hackathons/live projects)
- `CareerTwin.model.js` (aggregated, continuously updated snapshot per student)
- `Community.model.js` (skill-based groups)

#### Routes / Controllers / Services
- `mentorship.routes.js` — mentor registration, browse/filter, request, schedule
- New: `liveProject.routes.js`, `team.routes.js`, `careerTwin.routes.js`, `community.routes.js`
- `services/mentorship.service.js`
- `services/teamFormation.service.js` — complementary-skill optimization (not similarity matching)
- `services/careerTwin.service.js` — aggregates all student activity into a continuously updated profile
- Extend `academician.service.js` for opportunity discovery matching (FDP/consultancy/research vs. faculty expertise)
- Extend `analytics.service.js` for department-wise comparisons and FDP participation tracking

#### Real-Time Layer
- `sockets/mentorship.socket.js` — session scheduling notifications, live chat during sessions
- `sockets/notification.socket.js` — extended for team formation and live project updates

---

### Frontend Deliverables

#### Pages
- `academician/OpportunityDiscoveryPage.jsx`, `CollaborationHubPage.jsx`, `PortfolioPage.jsx`
- `student/MentorshipPage.jsx`, `CommunityPage.jsx`
- New: Live Project pages (browse, team formation, submission) for both Student and Industry roles
- `institution/IndustryPartnersPage.jsx`, `ReportsPage.jsx` (extended for FDP/curriculum insights)

#### Components
- `mentorship/MentorCard.jsx`, `SessionScheduler.jsx`
- New: `TeamFormationPanel.jsx`, `LiveProjectCard.jsx`, `CareerTwinSummary.jsx`

#### Hooks / API
- `hooks/useMentorship.js`
- New: `api/mentorshipApi` extensions, `liveProjectApi.js`, `careerTwinApi.js`

---

### Exit Criteria (Definition of Done for Phase 5)
- [ ] Academicians can discover FDP/consultancy/research opportunities matched to their expertise.
- [ ] Industry can search and connect with faculty by expertise for training/research needs.
- [ ] Mentors can register, and students can browse/request/schedule sessions linked to their career roadmap.
- [ ] Industry can post Live Projects; students/faculty can form teams and submit joint work.
- [ ] Team formation recommends complementary (not similar) skill coverage for hackathons/projects.
- [ ] Every student has a Digital Career Twin that updates automatically as they complete activities and answers "what should I do next."
- [ ] Institutions can view department-wise comparisons, FDP participation, and curriculum-alignment insights.
- [ ] Skill-based student communities are live and support collaboration/resource sharing.

### Post-Phase-5 Considerations
- Evaluate native mobile app development based on web adoption metrics.
- Evaluate blockchain-based credentialing as a trust-layer enhancement.
- Establish a continuous curriculum-feedback loop between Institution dashboards and Academic Council review cycles (business/process work, not purely technical).
-e 
---

