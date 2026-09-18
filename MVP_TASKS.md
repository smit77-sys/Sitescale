# SiteScale — MVP Implementation Backlog (MVP_TASKS.md)

**Status:** Approved for Hackathon MVP Implementation  
**Companion Documents:** [PRD.md](file:///F:/SiteScale/PRD.md), [TRD.md](file:///F:/SiteScale/TRD.md), [DESIGN.md](file:///F:/SiteScale/DESIGN.md), [DECISIONS.md](file:///F:/SiteScale/DECISIONS.md), [BENCHMARK_SPEC.md](file:///F:/SiteScale/BENCHMARK_SPEC.md)

---

## 1. Backlog Overview & Delivery Milestones

This document establishes the ordered development backlog for SiteScale. Tasks are sequenced to guarantee an operational **first vertical slice** before expanding the reference dataset across all six applications and three workload levels.

```text
Milestone 1: First Vertical Slice (End-to-End)
  ├── 1 Ref App (Ghost) + 1 Workload (Moderate)
  ├── URL Profiler (Static) + Baseline Recommender
  └── Minimal UI (DESIGN.md Tokens) ──> Proves the Core Architecture
          │
Milestone 2: Dataset Expansion & Sizing Engine
  ├── 6 Ref Apps × 3 Workloads (54 Tested Tier Runs)
  ├── Storage Calculator (OS + Seed + 6-Mo Growth + Headroom)
  └── Reliable PostgreSQL Job Queue
          │
Milestone 3: UI Polish, Security Hardening & Model Evaluation
  ├── Full DESIGN.md Component System (Amber ≤ 3%, Pill CTAs)
  ├── SSRF Defense-in-Depth Suite
  ├── Offline ML Regressor vs. Baseline Evaluation (GroupKFold)
  └── Browser LocalStorage Estimate History
          │
Milestone 4: Verification, Demo Rehearsal & Release
  └── End-to-End Smoke Tests, Failure Recovery, Presentation Playbook
```

---

## 2. Milestone 1: First Vertical Slice (Critical Path)

*Goal: Deploy one reference app, benchmark it on candidate tiers, analyze one test URL, calculate a baseline recommendation, and render the explained result in the React UI.*

### Task 1.1: Project Scaffolding & Database Migrations
* **Deliverable:** Monorepo directory structure, FastAPI app skeleton, SQLAlchemy 2.x models, and initial Alembic migration.
* **Dependencies:** None.
* **Acceptance Criteria:**
  * Schema reflects [TRD Section 5](file:///F:/SiteScale/TRD.md#L77-L95): `analyses`, `site_profiles`, `jobs`, `reference_apps`, `benchmark_runs`, `engine_versions`.
  * Migrations apply cleanly to PostgreSQL: `alembic upgrade head`.
  * Core seed script populates default candidate tiers (`small`, `medium`, `large`) and versioned workload presets.
* **Rough Effort:** 3 hours.

### Task 1.2: Benchmark Runner Harness & First Reference App (Ghost CMS)
* **Deliverable:** Docker Compose manifest, k6 load script, and metric collection script for Ghost CMS (`ghost:5.82.4-alpine` + `mysql:8.0.36`).
* **Dependencies:** Task 1.1.
* **Acceptance Criteria:**
  * Enforces cgroup limits for `small` tier (1 vCPU, 2048 MB RAM) on target stack.
  * Loads deterministic seed data (250 posts, 1,000 comments).
  * Executes k6 moderate workload (25 req/s, 95/5 read/write journey, 2-min warm-up, 10-min steady-state).
  * Captures achieved req/s, p95 latency, error rate, peak CPU/RAM, and storage delta.
  * Inserts valid JSON record into `benchmark_runs` database table.
* **Rough Effort:** 4 hours.

### Task 1.3: Baseline Recommendation Engine & Storage Formula
* **Deliverable:** Python module `engine/baseline.py` implementing category/workload lookup and storage calculation.
* **Dependencies:** Task 1.1, Task 1.2.
* **Acceptance Criteria:**
  * Queries `benchmark_runs` for closest matching category and workload.
  * Identifies smallest passing tier satisfying SLO ($p95 \le 500\text{ ms}$, error rate $< 1.0\%$).
  * Implements storage formula from [DECISIONS Section 2.3](file:///F:/SiteScale/DECISIONS.md#L59-L87): $\text{OS (8GB)} + \text{Vol} + \text{Data}\times(1.15)^6$, rounded to discrete tiers (`10, 25, 50, 100, 250 GB`).
  * Generates structured explanation with assumptions and comparable app IDs.
  * Unit tests cover exact match, boundary fallback, and `out_of_coverage` scenarios.
* **Rough Effort:** 3 hours.

### Task 1.4: Asynchronous PostgreSQL Worker & Bounded URL Profiler
* **Deliverable:** Background worker process polling `jobs` table with `FOR UPDATE SKIP LOCKED` and extracting static HTML features.
* **Dependencies:** Task 1.1.
* **Acceptance Criteria:**
  * Validates URL: allows only `http`/`https`, blocks private IPs, loopback, and metadata addresses.
  * Bounded extraction: max 3 pages, 5 redirects, 10 MB total download, 30s timeout.
  * Extracts page title, transfer bytes, image count/bytes, script count/bytes, form count, login form presence, and meta tags.
  * Handles unreachable/blocked sites gracefully by marking profile `failed` and enabling fallback recommendation with `limited` evidence.
* **Rough Effort:** 4 hours.

### Task 1.5: FastAPI Core Sizing Endpoints
* **Deliverable:** REST API endpoints with Pydantic request/response schemas.
* **Dependencies:** Tasks 1.1, 1.3, 1.4.
* **Acceptance Criteria:**
  * `POST /api/v1/analyses`: Enqueues analysis job, returns `202 Accepted` with UUID.
  * `GET /api/v1/analyses/{id}`: Returns current status (`queued`, `profiling`, `recommending`, `completed`, `failed`) and full recommendation when ready.
  * `GET /api/v1/config`: Returns workload presets, category definitions, and candidate tiers.
  * Validated via automated API tests.
* **Rough Effort:** 3 hours.

### Task 1.6: Minimal React UI Following DESIGN.md Tokens
* **Deliverable:** React + TypeScript single-page application connecting to API endpoints.
* **Dependencies:** Task 1.5.
* **Acceptance Criteria:**
  * Built using vanilla CSS / CSS modules adhering to [DESIGN.md](file:///F:/SiteScale/DESIGN.md): Canvas `#FAF9F7`, Surface `#FFFFFF`, Border `#DFDAD1`, Black primary button `#1A1917`.
  * Amber `#C7953D` restricted strictly to recommendation highlight chip ($\le 3\%$ screen area).
  * Submission form: URL input, Category dropdown, Workload preset selector (Light, Moderate, Busy), Optional starting data size.
  * Polls `/api/v1/analyses/{id}` with exponential backoff and visual progress state.
  * Displays recommended tier, vCPU, RAM, storage breakdown, evidence level, and monitoring recommendations.
* **Rough Effort:** 4 hours.

> **Milestone 1 Verification Gate:** Submit a public URL (e.g. `https://example.com`), select `blog_cms` and `moderate`, witness background profiling, and see Ghost-backed baseline tier recommendation rendered in UI within 15 seconds.

---

## 3. Milestone 2: Dataset Expansion & Sizing Engine

*Goal: Populate the full reference benchmark matrix (6 apps across 3 categories at 3 workload levels), verify smallest passing tiers, and refine storage/queue reliability.*

### Task 2.1: Benchmarking Remaining 5 Reference Applications
* **Deliverable:** Docker Compose stacks, seed scripts, and k6 test definitions for Directus, MedusaJS, PrestaShop, Metabase, and Grafana per [BENCHMARK_SPEC.md](file:///F:/SiteScale/BENCHMARK_SPEC.md#L23-L165).
* **Dependencies:** Task 1.2.
* **Acceptance Criteria:**
  * Pinned image tags: `directus:10.10.4`, `medusa:1.20.7`, `prestashop:8.1.5-apache`, `metabase:v0.49.3`, `grafana-oss:10.4.1`.
  * Deterministic database seeding scripts verified for all 5 stacks.
  * Tested on `small`, `medium`, and `large` candidate tiers.
  * Metrics exported and validated against database constraints.
* **Rough Effort:** 8 hours.

### Task 2.2: 3 Workload Levels per App & Smallest Passing Tier Labeling
* **Deliverable:** Automated test matrix orchestration script running Light (5 req/s), Moderate (25 req/s), and Busy (75 req/s) workloads for all 6 apps.
* **Dependencies:** Task 2.1.
* **Acceptance Criteria:**
  * Executes $6 \text{ apps} \times 3 \text{ workloads} \times 3 \text{ candidate tiers} = 54$ planned test scenarios (with 3-run repetitions on boundary passing tiers).
  * Evaluates pass/fail against SLO ($p95 \le 500\text{ ms}$, error $< 1.0\%$, throughput $\ge 95\%$).
  * Records smallest tested passing tier in `reference_apps` and `benchmark_runs`.
  * Flags unsupported workloads where `large` tier fails SLO as `out_of_coverage`.
* **Rough Effort:** 6 hours.

### Task 2.3: Storage Footprint & Headroom Calibration
* **Deliverable:** Service-level storage calculation module and volume inspector.
* **Dependencies:** Task 2.2, Task 1.3.
* **Acceptance Criteria:**
  * Analyzes baseline volume sizes across all 6 applications.
  * Accurately factors in category starting data defaults (Blog: 1 GB, E-commerce: 5 GB, Dashboard: 2 GB) when omitted.
  * Computes 6-month growth at 15% monthly compounding plus 30% operational headroom.
  * Persists breakdown in `recommendation_json.storage_breakdown`.
* **Rough Effort:** 2 hours.

### Task 2.4: Queue Worker Reliability & Heartbeat Recovery
* **Deliverable:** Worker lease management and fault-tolerant retry handling.
* **Dependencies:** Task 1.4.
* **Acceptance Criteria:**
  * Worker periodically updates `leased_until` timestamp during active profiling jobs.
  * Background janitor query reclaims jobs with expired leases whose worker crashed.
  * Max 3 attempts with exponential backoff before permanent failure.
  * Idempotency check prevents duplicate profile writes for identical analysis jobs.
* **Rough Effort:** 3 hours.

> **Milestone 2 Verification Gate:** Database contains complete, reviewed benchmark runs for all 6 reference apps across light/moderate/busy workloads, with verified smallest passing tier labels.

---

## 4. Milestone 3: UI Polish, Security Hardening & Model Evaluation

*Goal: Complete the UI according to DESIGN.md, harden URL profiling against network attacks, run offline ML model evaluation, and implement client history.*

### Task 3.1: Full DESIGN.md Component Polish & Accessibility
* **Deliverable:** Refined UI components matching all [DESIGN.md](file:///F:/SiteScale/DESIGN.md) specifications.
* **Dependencies:** Task 1.6.
* **Acceptance Criteria:**
  * Exact typography: Inter for body/headings, JetBrains Mono for code/metrics.
  * Button specs: 44px minimum touch target, black primary `#1A1917`, full pill radius (`999px`).
  * Badges & chips pull strictly from semantic table: Success (`#E2F0E9`), Info (`#E6ECF5`), Warning (`#F7EACE`), Error (`#F7E5E2`).
  * Amber strictly $\le 3\%$ screen area.
  * CSS `prefers-reduced-motion` block present and tested.
  * Responsive layout tested on desktop ($1200\text{px}$) and mobile ($< 640\text{px}$).
* **Rough Effort:** 5 hours.

### Task 3.2: SSRF & URL Profiler Security Suite
* **Deliverable:** Security-hardened HTTP client adapter with comprehensive test suite.
* **Dependencies:** Task 1.4.
* **Acceptance Criteria:**
  * Blocks loopback (`127.0.0.1`), RFC 1918 private subnets, link-local (`169.254.169.254`), and IPv6 equivalents.
  * Re-resolves DNS and checks IP destination on every HTTP redirect.
  * Includes automated tests mocking DNS rebinding attacks and redirect loops.
  * Enforces request body size caps and socket read timeouts.
* **Rough Effort:** 4 hours.

### Task 3.3: Playwright Dynamic Profiling Adapter
* **Deliverable:** Headless Chromium profiler subagent for JavaScript-heavy sites.
* **Dependencies:** Task 1.4, Task 3.2.
* **Acceptance Criteria:**
  * Launches non-root, sandboxed Chromium instance with disabled network access to private IPs.
  * Intercepts network requests to count dynamic API calls and third-party script assets.
  * Caps total execution time at 15 seconds; cleanly terminates orphan browser processes.
  * If browser launch fails or times out, falls back to static BeautifulSoup parser.
* **Rough Effort:** 4 hours.

### Task 3.4: Offline Machine Learning Model & GroupKFold Evaluation
* **Deliverable:** Scikit-learn training script, GroupKFold cross-validation harness, and evaluation reporter.
* **Dependencies:** Task 2.2.
* **Acceptance Criteria:**
  * Uses `GroupKFold` or Leave-One-App-Out grouped strictly by `reference_app_id` (no data leakage).
  * Evaluates Random Forest / Gradient Boosted regressor predicting vCPU and RAM against baseline heuristic.
  * Measures Primary Metric: % of held-out app/workload cases assigned a passing tier.
  * Measures Secondary Metrics: Tier distance, overprovisioning rate, MAE.
  * Generates evaluation report artifact. Model artifact is committed and activated **only** if it beats baseline by $\ge 5\%$ without severe overprovisioning (per [DECISIONS.md Section 4](file:///F:/SiteScale/DECISIONS.md#L129-L141)).
* **Rough Effort:** 5 hours.

### Task 3.5: Browser LocalStorage Estimate History
* **Deliverable:** History drawer / list component storing past analysis UUIDs in browser `localStorage`.
* **Dependencies:** Task 1.6.
* **Acceptance Criteria:**
  * Stores up to 20 recent analyses (`id`, `url`, `category`, `tier`, `created_at`).
  * Clicking an entry fetches fresh data from `GET /api/v1/analyses/{id}`.
  * Allows individual deletion or clearing local history.
  * Labeled clearly: *"Recent Estimates on this Browser"*.
* **Rough Effort:** 2 hours.

> **Milestone 3 Verification Gate:** UI conforms to DESIGN.md, SSRF attack payloads are blocked, GroupKFold model evaluation is documented, and history reloads successfully from local storage.

---

## 5. Milestone 4: Verification, Demo Rehearsal & Release Readiness

*Goal: Execute end-to-end verification, test all edge cases, and prepare a presentation-ready demonstration.*

### Task 4.1: End-to-End Automated Testing & Quality Checks
* **Deliverable:** Complete test suite covering unit, API, integration, and UI workflows.
* **Dependencies:** All Milestone 1–3 tasks.
* **Acceptance Criteria:**
  * Backend: `pytest` passes with $> 85\%$ coverage across URL validator, baseline engine, and API routes.
  * Frontend: Type checks (`tsc --noEmit`) and lint pass without warnings.
  * Run `git diff --check` cleanly.
* **Rough Effort:** 3 hours.

### Task 4.2: Edge Cases & Inaccessible URL Fallback Verification
* **Deliverable:** Automated and manual validation of failure recovery paths.
* **Dependencies:** Task 4.1.
* **Acceptance Criteria:**
  * Test Case 1: Inaccessible/invalid URL (e.g. `https://nonexistent-domain-test.xyz`) produces clean category/workload fallback labeled `limited evidence`.
  * Test Case 2: Blocked private IP (`http://192.168.1.1`) returns immediate user-friendly validation error without queueing.
  * Test Case 3: High-traffic workload exceeding candidate tiers returns `out_of_coverage` with clear guidance.
* **Rough Effort:** 2 hours.

### Task 4.3: Demo Script & Rehearsal Playbook
* **Deliverable:** Markdown rehearsal guide with 3 scripted demonstration flows.
* **Dependencies:** Task 4.2.
* **Acceptance Criteria:**
  * Scripted Flow A (Standard Blog): Public blog URL + Light workload $\rightarrow$ `small` tier, explain signals.
  * Scripted Flow B (E-commerce Store): Store URL + Busy workload $\rightarrow$ `large` tier, explain storage and DB headroom.
  * Scripted Flow C (Internal Dashboard / Fallback): Firewalled or JS-heavy URL $\rightarrow$ graceful fallback, category assumptions.
  * Cold-start initialization time under 10 seconds via pre-seeded database.
* **Rough Effort:** 2 hours.

---

## 6. Milestone 5: Post-Hackathon Stretch Work (Separated)

The following items are strictly **outside the hackathon MVP scope** and will be pursued only after Milestone 4 is complete:

* **Task 5.1: Bring-Your-Own-App (BYOA) Benchmark Runner:**
  * Secure execution environment for user-supplied Docker Compose repositories.
  * Automated OAuth-based authorization check to verify ownership of target domains.
* **Task 5.2: Server-Side Multi-User Authentication & Teams:**
  * Integration with OAuth2/OIDC (GitHub/Google Login).
  * User account entities, team workspaces, and authenticated history sharing.
* **Task 5.3: Cloud Provider Pricing & Instance Mapping:**
  * Real-time mapping of vCPU/RAM tiers to AWS EC2 (e.g. t4g.small, c6i.large), DigitalOcean Droplets, and Hetzner Cloud instances with monthly dollar cost estimates.
* **Task 5.4: Autoscaling & Multi-Instance Architecture Recommender:**
  * Architecture guidance for workloads exceeding single-instance capacity (e.g. read replicas, Redis caching layers, load balancers).

---

## 7. Critical Path & Effort Summary

```text
[Task 1.1: Scaffolding & DB] (3h)
       │
       ├──> [Task 1.2: Ghost Benchmark] (4h) ──> [Task 2.1: 5 Ref Apps] (8h) ──> [Task 2.2: 54 Run Matrix] (6h) ──> [Task 3.4: ML Eval] (5h)
       │                                                      │
       ├──> [Task 1.4: URL Profiler] (4h) ──> [Task 3.2: SSRF Tests] (4h) ──> [Task 3.3: Playwright] (4h)
       │              │
       └──> [Task 1.3: Baseline Engine] (3h) ──> [Task 1.5: API Endpoints] (3h) ──> [Task 1.6: Minimal UI] (4h)
                                                                                            │
                                                                                 [Task 3.1: DESIGN.md Polish] (5h)
                                                                                            │
                                                                                 [Task 3.5: Local History] (2h)
                                                                                            │
                                                                                 [Milestone 4: Verification & Demo] (7h)
```

* **Milestone 1 (First Vertical Slice):** ~21 hours
* **Milestone 2 (Dataset Expansion):** ~19 hours
* **Milestone 3 (UI Polish, Security & ML):** ~20 hours
* **Milestone 4 (Verification & Demo):** ~7 hours
* **Total Estimated Hackathon MVP Effort:** **~67 person-hours**
