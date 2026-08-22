# Product Requirements Document (PRD)
## Academia–Industry Collaboration & Intelligent Career Development Platform

**Document Version:** 1.0
**Status:** Draft
**Owner:** Product Team
**Last Updated:** August 22, 2026

---

## 1. Executive Summary

The Academia–Industry Collaboration Platform is a unified, AI-powered ecosystem that connects **students, industries, academicians, and educational institutions** to close the persistent gap between academic learning and industry requirements.

Unlike traditional placement portals that answer only "which jobs are available," this platform answers a deeper question:

> **"What can I become, what am I missing, how do I become eligible, and which opportunities are the best match for me?"**

The platform combines skill assessment, AI-driven skill profiling, career simulation, explainable job/internship matching, verified digital credentials, and institutional analytics into one continuous, closed-loop system that benefits every stakeholder in the employability lifecycle.

---

## 2. Problem Statement

| Stakeholder | Core Pain Point |
|---|---|
| Students | Don't know what skills they have, what's missing, or how to close the gap for a specific career |
| Industries | Struggle to find candidates with verifiable, precisely-matched skill sets |
| Academicians | Limited visibility into internships, FDPs, consultancy, and research collaboration opportunities |
| Institutions | Lack real-time, data-driven insight into student readiness and evolving industry skill demand |

Existing placement portals are transactional (list a job → apply → interview) and do not provide skill intelligence, gap analysis, or explainability — leaving all four stakeholder groups making high-stakes decisions with incomplete information.

---

## 3. Goals & Objectives

### 3.1 Product Goals
1. Provide every student with a living, evidence-based skill profile and a personalized, continuously-updating career roadmap.
2. Give industries an explainable, skill-based candidate discovery and recruitment pipeline (not resume keyword matching).
3. Give academicians a discovery layer for industry engagement (FDPs, consultancy, research, guest lectures).
4. Give institutions a real-time skill intelligence dashboard to make curriculum and training decisions.
5. Create a continuous feedback loop where industry demand shapes learning content, which shapes student readiness, which shapes placement outcomes.

### 3.2 Success Metrics (KPIs)

| Metric | Target (Year 1 post-launch) |
|---|---|
| Student profile completion rate | ≥ 75% |
| Avg. skill-gap-to-learning-module conversion | ≥ 40% |
| Internship/job application-to-shortlist rate | ≥ 25% (vs. industry baseline ~8–12%) |
| Placement Readiness Score improvement (per student, per semester) | ≥ 15 points |
| Industry partner retention (YoY) | ≥ 80% |
| Faculty industry-engagement participation | ≥ 30% of registered faculty |
| Recommendation explanation click-through / trust rating | ≥ 4/5 avg. user rating |

---

## 4. Target Users & Personas

### 4.1 Student — "Ananya, 3rd-year CSE student"
Wants to know if she's ready for a Full Stack role, what's missing, and how to close the gap without generic advice.

### 4.2 Industry Recruiter — "Rahul, Talent Acquisition Lead"
Wants to post a role once and get a ranked, skill-verified shortlist instead of manually screening hundreds of resumes.

### 4.3 Academician — "Dr. Mehta, Associate Professor"
Wants to find industry-sponsored research, FDPs, and consultancy work aligned to her expertise without cold-emailing companies.

### 4.4 Institution Admin — "Placement Cell Head"
Wants a single dashboard showing placement readiness, department skill gaps, and industry demand trends to justify curriculum changes to the academic council.

---

## 5. Scope

### 5.1 In Scope (Platform-wide)
- Multi-role registration and RBAC (Student, Industry, Academician, Institution Admin, Recruiter, Mentor)
- Skill assessment engine (technical, aptitude, soft skill, behavioral)
- AI skill profiling and Skill Knowledge Graph
- Skill gap analysis and personalized learning roadmap
- Explainable job/internship/challenge matching engine
- Internship and placement lifecycle management
- Digital Skill Passport with verified credentials
- Institutional and industry analytics dashboards
- Mentorship marketplace
- AI mock interview and resume intelligence
- Industry Challenge Marketplace
- Faculty–Industry Collaboration Hub
- Security, privacy, and consent-based data sharing

### 5.2 Out of Scope (Phase 1)
- Payroll/HRMS integration for hired candidates
- Full LMS course authoring (platform will link to/recommend external and partner courses, not author full curricula)
- Native mobile apps (Phase 1 is responsive web; mobile apps considered Phase 3)
- Blockchain-based credentialing (verification will use a trusted-issuer model first; blockchain evaluated as a future enhancement)

---

## 6. Feature Requirements by Module

### 6.1 Skill Assessment System
**Priority: P0 (MVP)**

- FR-1.1: System shall support timed and untimed assessments across Technical, Aptitude, Soft Skill, and Behavioral dimensions.
- FR-1.2: System shall generate a structured, percentage-based Skill Profile per student upon assessment completion.
- FR-1.3: Behavioral assessment results shall be presented as tendencies/indicators, not clinical or psychological diagnoses, with disclaimers.
- FR-1.4: Assessments shall be configurable/extensible by institutions and industries (custom question banks).
- FR-1.5: Students shall be able to retake assessments on a cooldown cycle to reflect skill growth.

### 6.2 AI-Based Skill Profiling
**Priority: P0 (MVP)**

- FR-2.1: System shall aggregate signals from assessments, resume, projects, certifications, GitHub activity, courses, internships, and academic records into a unified skill graph per student.
- FR-2.2: Each skill node shall carry a confidence score derived from the strength/recency of supporting evidence.
- FR-2.3: Profile shall update automatically when new evidence (project, certificate, challenge result) is added.

### 6.3 Skill Gap Analysis
**Priority: P0 (MVP)**

- FR-3.1: System shall compare a student's current skill profile against a target role, company, or industry-defined competency framework.
- FR-3.2: Output shall show per-skill current vs. required level and a clear gap indicator.
- FR-3.3: System shall generate an actionable roadmap directly from identified gaps (see 6.4).

### 6.4 AI Career Roadmap
**Priority: P0 (MVP)**

- FR-4.1: System shall generate a sequential, personalized roadmap (learn → build → verify → apply) toward a chosen target role.
- FR-4.2: Roadmap shall dynamically re-calculate as the student's skills, projects, and assessments change.

### 6.5 Intelligent Job & Internship Matching
**Priority: P0 (MVP)**

- FR-5.1: Industries shall define required skills, preferred skills, qualifications, experience, location, compensation, and assessment requirements per posting.
- FR-5.2: Matching engine shall compute a weighted compatibility score (technical skills, project experience, education, career interest, soft skills, assessment performance).
- FR-5.3: Every recommendation shall include a human-readable explanation (which skills matched, which are missing, and remediation suggestions) — see 6.7.
- FR-5.4: Students shall be able to filter/sort opportunities by compatibility score, location, stipend/salary, and type.

### 6.6 "What-If" Career Simulator
**Priority: P1 (Fast-follow — key differentiator)**

- FR-6.1: Students shall be able to simulate the impact of acquiring a new skill on eligible jobs, internships, and compatibility scores.
- FR-6.2: Students shall be able to simulate switching target career paths and see the resulting skill delta and roadmap.
- FR-6.3: Simulator output shall include missing skills, an estimated learning roadmap, and relevant projects/opportunities.

### 6.7 Explainable Recommendations
**Priority: P0 (MVP — cross-cutting requirement)**

- FR-7.1: Every AI-driven recommendation (job, internship, mentor, course, teammate) shall answer "Why am I seeing this?" with specific, itemized reasons.
- FR-7.2: Explanations shall reference concrete evidence (skills matched/missing, project relevance, assessment scores) rather than generic text.

### 6.8 Industry Skill Heatmap & Demand Forecasting
**Priority: P1**

- FR-8.1: System shall aggregate skill requirements across all active postings to produce a real-time demand heatmap.
- FR-8.2: System shall analyze historical posting data to identify trending (↑) and declining (↓) skills.
- FR-8.3: Institutions shall receive periodic alerts on significant shifts in demand relevant to their departments.

### 6.9 AI Project-to-Skill Mapping
**Priority: P1**

- FR-9.1: System shall analyze free-text project descriptions (and optionally linked repositories) and extract associated skills.
- FR-9.2: Extracted skills shall automatically feed into the student's skill profile as evidence.

### 6.10 Digital Skill Passport
**Priority: P0 (MVP)**

- FR-10.1: Every student shall have a portable, shareable Skill Passport listing verified skills, certifications, projects, internships, assessments, and achievements.
- FR-10.2: Each skill entry shall display attached evidence types (project, challenge, assessment, certificate).
- FR-10.3: Students shall control visibility/sharing permissions for their passport (see Section 9, Privacy).

### 6.11 Industry-Verified Skills
**Priority: P1**

- FR-11.1: Industries shall be able to formally verify a specific skill for a student after assessment, internship, project, or challenge completion.
- FR-11.2: Verified skills shall display the verifying organization, method, and date.

### 6.12 AI Resume Intelligence
**Priority: P1**

- FR-12.1: System shall analyze a student's resume against a target job description and produce a match percentage.
- FR-12.2: System shall identify missing skills/keywords, weak project descriptions, and inconsistencies, with improvement suggestions.

### 6.13 AI Mock Interview
**Priority: P1**

- FR-13.1: System shall generate technical, HR, and project-specific interview questions based on the student's target role and portfolio.
- FR-13.2: System shall provide structured feedback on technical correctness, communication, structure, and completeness after each session.

### 6.14 Industry Challenge Marketplace
**Priority: P1**

- FR-14.1: Industries shall be able to publish real-world challenges with defined evaluation criteria.
- FR-14.2: Students shall be able to submit solutions; industries shall be able to evaluate, shortlist, and directly convert top performers into interview/internship pipelines.

### 6.15 Internship Lifecycle Management
**Priority: P0 (MVP)**

- FR-15.1: System shall support the full internship lifecycle: discovery → eligibility check → application → selection → document verification → progress/task tracking → mentor feedback → completion certificate → portfolio update.

### 6.16 Placement Lifecycle Management
**Priority: P0 (MVP)**

- FR-16.1: System shall support: job posting → eligibility filtering → AI skill matching → shortlisting → assessment → interview → selection → offer → analytics.
- FR-16.2: Students shall have a single dashboard showing real-time status of all applications.

### 6.17 Faculty–Industry Collaboration Hub
**Priority: P1**

- FR-17.1: Academicians shall discover FDPs, industrial training, consultancy, sponsored research, and guest lecture opportunities.
- FR-17.2: Industries shall be able to search/match faculty by expertise for research or training needs.

### 6.18 Industry Mentorship Marketplace
**Priority: P1**

- FR-18.1: Industry professionals shall register as mentors with defined domains/availability.
- FR-18.2: Students shall browse, filter, request, and schedule mentorship sessions linked to their career roadmap.

### 6.19 Industry–Academia Live Project Hub
**Priority: P2**

- FR-19.1: Industries shall publish real-world problems for joint student/faculty teams.
- FR-19.2: Successful projects shall be able to generate certifications, internship offers, or research/consultancy outcomes.

### 6.20 Institutional & Departmental Dashboards
**Priority: P0 (MVP)**

- FR-20.1: Institutions shall access aggregate metrics: placement readiness, internship participation, certifications, average skill score, active industry partners.
- FR-20.2: Institutions shall access a department-wise / batch-wise skill heatmap.

### 6.21 Placement Readiness Score
**Priority: P1**

- FR-21.1: System shall compute a composite Placement Readiness Score per student from technical skills, projects, communication, aptitude, interview performance, and industry exposure.
- FR-21.2: Score shall be labeled explicitly as a guidance metric, not a guaranteed placement probability.

### 6.22 Intelligent Team Formation
**Priority: P2**

- FR-22.1: For hackathons/live projects, system shall recommend teams optimized for complementary skill coverage rather than similarity.

### 6.23 Recruiter Candidate Discovery
**Priority: P1**

- FR-23.1: Recruiters shall search candidates using structured skill thresholds (e.g., React > 75%) instead of keyword resume search.
- FR-23.2: Results shall be ranked by compatibility score.

### 6.24 Fraud & Credential Verification
**Priority: P0 (MVP — trust-critical)**

- FR-24.1: System shall flag suspicious or unverifiable certificates, skills, and claims using trusted-issuer cross-checks and institutional records.
- FR-24.2: System shall visibly distinguish "claimed" vs. "verified" skills everywhere in the UI.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | Role-based access control; encrypted data at rest and in transit; secure authentication (MFA support); secure file uploads with virus/malware scanning; audit logging on all sensitive actions |
| **Privacy** | Consent-based data sharing; students control profile/passport visibility per viewer type (recruiter, mentor, public) |
| **Scalability** | Architecture must support horizontal scaling to accommodate institution-wide rollouts (tens of thousands of concurrent student users during placement season) |
| **Availability** | 99.5% uptime target for core matching and application workflows |
| **Performance** | Skill match computation and dashboard queries should return in < 2s for standard result sets |
| **Auditability** | All credential verifications and score computations must be traceable to source evidence |
| **Accessibility** | WCAG 2.1 AA compliance for core student and institution-facing flows |
| **Data Validation** | All uploaded documents/assessment inputs validated and sanitized server-side |
| **Rate Limiting** | APIs protected against abuse (assessment submission, resume upload, matching queries) |

---

## 8. AI/System Architecture Requirements

- **NLP/LLM Layer**: Resume analysis, job description understanding, skill extraction, interview question generation, and explanation generation.
- **Embedding Model**: Semantic similarity computation across student profiles, job descriptions, skills, and learning resources.
- **Vector Database**: Semantic retrieval for jobs, internships, skills, courses, certifications, and mentorship matches.
- **Retrieval-Augmented Generation (RAG)**: Career guidance and recommendations must be grounded in the platform's verified knowledge base (student profile + jobs + skills + courses), not the LLM's unconstrained internal knowledge, to reduce hallucination risk in career/education guidance.
- **Matching Engine**: Hybrid approach combining:
  - Rule-based hard-constraint filtering (degree, branch, eligibility, location)
  - Embedding-based skill similarity
  - Weighted multi-factor scoring
  - Feedback-based ranking that learns from application/selection/rejection outcomes over time
- **Skill Knowledge Graph**: Core data structure representing relationships across Skills → Roles → Jobs → Courses → Projects → Companies → Certifications, used to power roadmap and simulator features.
- **Digital Career Twin** (Phase 2+): A continuously updated representation of each student's skills, goals, gaps, and progress that powers "what should I do next" guidance across the platform.

---

## 9. Privacy & Trust Principles

1. Students own and control their data; visibility settings must be explicit and auditable (e.g., "visible to recruiters," "visible to mentors only," "private").
2. AI-generated behavioral assessments must never be presented as clinical/psychological diagnoses.
3. Placement Readiness Scores and compatibility percentages must always be labeled as guidance, not guarantees.
4. Verified vs. self-reported skills must be visually distinguishable everywhere they appear.
5. All AI recommendations must be explainable — no black-box scoring shown to end users without justification.

---

## 10. Release Plan / Phasing

### Phase 1 — MVP (Core Loop)
Goal: Prove the core "Assess → Profile → Gap → Match → Apply" loop for students and industries.
- Multi-role auth & RBAC
- Skill assessment engine
- AI skill profiling (assessment + resume + certifications)
- Skill gap analysis vs. target role
- Explainable job/internship matching
- Internship & placement lifecycle tracking
- Digital Skill Passport (basic)
- Institutional dashboard (core metrics)
- Credential verification (basic — trusted issuer checks)

### Phase 2 — Differentiation
Goal: Deploy the standout AI features that differentiate from LinkedIn/Internshala-style portals.
- What-If Career Simulator
- AI Project-to-Skill Mapping
- Industry Skill Heatmap & Demand Forecasting
- AI Mock Interview
- AI Resume Intelligence
- Industry Challenge Marketplace
- Placement Readiness Score
- Recruiter skill-based candidate search

### Phase 3 — Ecosystem Expansion
Goal: Deepen faculty/institution engagement and community features.
- Faculty–Industry Collaboration Hub
- Industry Mentorship Marketplace
- Industry–Academia Live Project Hub
- Intelligent Team Formation
- Digital Career Twin
- Department-level forecasting & curriculum recommendation loop
- Native mobile apps

---

## 11. Assumptions & Dependencies

- Institutions will provide or integrate existing student academic records (SIS integration) for verification purposes.
- Industry partners are willing to define structured skill requirements (not just free-text job descriptions) for matching to work well.
- A baseline set of trusted certificate issuers/partners is available at launch for credential verification.
- Sufficient historical job/internship posting volume is needed before demand forecasting produces reliable trend signals — this feature may show "insufficient data" states early on.

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Cold-start problem: few postings/students at launch reduces match quality | High | Seed with pilot institutions + pilot industry partners before general rollout; manually curate initial skill/role taxonomies |
| Over-reliance on AI scores creates false confidence in students | Medium | Explicit "guidance, not guarantee" labeling; explanations required on every score |
| Credential fraud undermines trust layer | High | Trusted-issuer verification model; visible claimed-vs-verified distinction; audit logs |
| Behavioral assessment misused/misinterpreted as psychological diagnosis | High | Legal/UX review of assessment language; explicit disclaimers; no clinical terminology |
| Data privacy concerns from students/institutions | High | Consent-based sharing controls; encryption; RBAC; regular security audits |
| Faculty/industry adoption lag due to habit (email-based coordination) | Medium | Onboarding incentives, dedicated hub UX, integration with existing institutional workflows |

---

## 13. Open Questions

1. Will the platform integrate directly with institutional Student Information Systems (SIS) for academic record verification, or rely on manual upload initially?
2. What is the initial set of "trusted issuers" for the credential verification layer (industry partners, certification bodies, institutions)?
3. Should the Digital Career Twin (Phase 3) be a student-facing feature from day one, or purely an internal system representation?
4. What pricing/business model applies per stakeholder (institution subscription, industry job-posting fees, freemium for students)?
5. What is the minimum data volume required before Skill Demand Forecasting is enabled for a given institution/region?

---

## 14. Appendix: Feature Priority Summary

| Priority | Features |
|---|---|
| **P0 (MVP)** | Assessment engine, AI skill profiling, skill gap analysis, career roadmap, explainable job/internship matching, internship & placement lifecycle, Digital Skill Passport, institutional dashboard, credential verification |
| **P1 (Fast-follow)** | What-If Simulator, Skill Heatmap & Forecasting, Project-to-Skill Mapping, Industry-Verified Skills, Resume Intelligence, Mock Interview, Challenge Marketplace, Placement Readiness Score, Faculty-Industry Hub, Mentorship Marketplace, Recruiter Discovery |
| **P2 (Ecosystem)** | Live Project Hub, Intelligent Team Formation, Digital Career Twin |

