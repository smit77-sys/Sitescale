# SiteScale — Architecture & Design Decisions (DECISIONS.md)

**Status:** Approved for Hackathon MVP Implementation  
**Companion Documents:** [PRD.md](file:///F:/SiteScale/PRD.md), [TRD.md](file:///F:/SiteScale/TRD.md), [DESIGN.md](file:///F:/SiteScale/DESIGN.md)

---

## 1. Overview and Scope

This document records the architectural, technical, and product sizing decisions required to implement the SiteScale Hackathon MVP. It specifically resolves the four open technical questions identified in [TRD Section 14](file:///F:/SiteScale/TRD.md#L203-L209), standardizes baseline sizing rules, and identifies the remaining assumptions that require explicit team consensus.

---

## 2. Resolution of TRD Section 14 Open Questions

### 2.1 Decision 1: Representative Journeys and Seed Data by Category

* **Context:** [TRD Section 14.1](file:///F:/SiteScale/TRD.md#L205) asks: *"Which exact user journeys and seed-data volumes represent each category? Finalize before collecting labels."*
* **Choice:** Define standardized, deterministic seed-data volumes and scripted read/write journeys for the three MVP categories (`blog_cms`, `ecommerce`, `dashboard`):
  1. **Blog / CMS (`blog_cms`):**
     * **Seed Data:** 250 published posts, 20 static pages, 50 tags/categories, 1,000 user comments, 150 media uploads (images averaging 350 KB, ~52.5 MB total static assets), 5 author/editor accounts.
     * **Read/Write Ratio:** 95% Read / 5% Write.
     * **User Journey Script (k6):**
       * *Step 1 (60% weight):* Browse homepage, pagination, view category archive (cached/lightweight queries).
       * *Step 2 (30% weight):* Read individual post detail and fetch associated comments and media.
       * *Step 3 (5% weight):* Search query with keyword filter.
       * *Step 4 (5% weight — Write):* Submit a new reader comment or draft post via API/form handler.
       * *Think Time:* Log-normal distribution, median 2.5s (range 1.0s–5.0s).
  2. **E-Commerce (`ecommerce`):**
     * **Seed Data:** 500 product SKUs with variants, 25 collections/categories, 2,000 product images (~500 KB average, ~1 GB total media), 200 registered customer accounts, 100 historical orders with line items.
     * **Read/Write Ratio:** 85% Read / 15% Write.
     * **User Journey Script (k6):**
       * *Step 1 (45% weight):* Catalog browsing: home, collection filtering, product pagination.
       * *Step 2 (25% weight):* Product detail page view, querying price, stock, and high-res imagery.
       * *Step 3 (15% weight):* Search query with faceted filtering.
       * *Step 4 (10% weight — Write):* Add-to-cart and update cart quantities (session/cookie write).
       * *Step 5 (5% weight — Write):* Checkout flow simulation (cart validation, order creation transaction).
       * *Think Time:* Log-normal distribution, median 3.0s (range 1.5s–6.0s).
  3. **Dashboard / Internal Tool (`dashboard`):**
     * **Seed Data:** Relational analytics dataset with 100,000 rows across 5 tables (e.g. orders, events, customers, telemetry), 10 pre-configured dashboards, 40 distinct chart/query cards, 20 active user accounts.
     * **Read/Write Ratio:** 75% Read / 25% Write.
     * **User Journey Script (k6):**
       * *Step 1 (40% weight):* View primary overview dashboard (triggers 4–6 parallel aggregate analytical queries: `COUNT`, `SUM`, `GROUP BY`).
       * *Step 2 (20% weight):* Drill-down into filtered table view with pagination and sorting.
       * *Step 3 (15% weight):* Run ad-hoc query or filter dashboard by date range.
       * *Step 4 (20% weight — Write):* Update existing record, inline table edit, or toggle status flag.
       * *Step 5 (5% weight — Write):* Create a new analytical card, save view, or export CSV report.
       * *Think Time:* Log-normal distribution, median 4.0s (range 2.0s–8.0s).
* **Rationale:** Fixed seed sizes and journey weights prevent test variance between repeated runs. Synthetic loads reflect actual traffic patterns where blogs are read-heavy, dashboards trigger expensive database aggregations with moderate updates, and e-commerce balances catalog browsing with transactional cart state.
* **Trade-offs:** Synthetic journeys omit long-tail edge cases (e.g., bot crawlers, malicious traffic spikes, complex multi-step checkout webhooks).
* **When to Revisit:** Post-hackathon, when expanding reference datasets to specialized workloads (e.g., SaaS platforms, media streaming, heavy asynchronous worker sites).

---

### 2.2 Decision 2: Benchmark-Runner Isolation Strategy

* **Context:** [TRD Section 14.2](file:///F:/SiteScale/TRD.md#L206) asks: *"Will the demo host support a physically separate benchmark runner, or an isolated VM on the same machine? Record the choice in benchmark metadata."*
* **Choice:** For the Hackathon MVP, use a **single demo host running a segregated Docker environment**, with the following strict isolation boundaries:
  1. **Container Resource Cgroups:** Target reference applications run inside dedicated Docker Compose project namespaces with hard container limits (`cpus: "X"`, `mem_limit: "Yg"`), CPU pinning where feasible, and isolated Docker bridge networks (`sitescale-bench-net`).
  2. **External Load Generator:** k6 runs directly on the host OS or in a container connected to the host network without CPU/memory constraints, preventing the load generator from competing for the target application's cgroup allocations.
  3. **API Process Decoupling:** The serving FastAPI application, background job worker, and PostgreSQL database run in a separate Docker Compose stack (`sitescale-app-net`) and have **zero access to the Docker daemon socket** (`/var/run/docker.sock`).
  4. **Run Metadata Tagging:** Every `benchmark_run` record explicitly logs `runner_isolation: "single_host_cgroups"` alongside kernel version, CPU model, total host RAM, and Docker version.
* **Rationale:** A physically separate bare-metal or cloud runner introduces cloud network latency, requires multi-host credential orchestration, and risks network flakiness during hackathon demos. Single-host cgroup isolation provides immediate repeatability on the local developer workstation while preserving security boundaries between the user-facing web app and the benchmark runner.
* **Trade-offs:** Host-level kernel contention (I/O, context switching) can theoretically influence sub-millisecond latency measurements under heavy loads.
* **When to Revisit:** When moving to production benchmarking or accepting community-submitted reference applications, require a dedicated bare-metal runner host or ephemeral cloud instances (e.g., AWS EC2 c6i.xlarge).

---

### 2.3 Decision 3: Storage Defaults and Growth Horizon

* **Context:** [TRD Section 14.3](file:///F:/SiteScale/TRD.md#L207) asks: *"What category defaults and growth horizon should storage planning use when users omit data size?"*
* **Choice:** Adopt explicit category baseline defaults, a standard **6-month growth horizon** with a **15% monthly compound growth rate**, and a **30% operational headroom allowance**, mapped into published discrete disk tiers:
  1. **Category Starting Data Defaults (when omitted by user):**
     * `blog_cms`: **1.0 GB** (database + media/uploads)
     * `ecommerce`: **5.0 GB** (product catalog, media, transactions, customer records)
     * `dashboard`: **2.0 GB** (relational tables, user session logs, audit trails)
  2. **Runtime & OS Footprint Baseline:**
     * Base OS, Docker runtime, container image layers, and log rotation: **8.0 GB**.
  3. **Formula for Storage Recommendation:**
     $$\text{Projected Data} = \text{Starting Data} \times (1 + r)^n$$
     *(where monthly growth rate $r = 0.15$, horizon $n = 6 \text{ months}$, giving $(1.15)^6 \approx 2.313$)*
     $$\text{Raw Required Storage} = \text{OS Baseline (8 GB)} + \text{Measured Reference Persistent Volume} + \text{Projected Data}$$
     $$\text{Total Storage with Headroom} = \text{Raw Required Storage} \times 1.30 \text{ (30\% headroom)}$$
  4. **Published Discrete Storage Tiers:**
     * Recommended storage snaps to the smallest tier greater than or equal to `Total Storage with Headroom`:
       * `10 GB`
       * `25 GB`
       * `50 GB`
       * `100 GB`
       * `250 GB` (exceeding 250 GB flags `out_of_coverage` for single-instance MVP)
* **Rationale:** Developers rarely know their exact disk footprint at project inception. Breaking storage into OS baseline, starting data, projected 6-month growth, and operational headroom prevents database crash catastrophes due to full disks (e.g. WAL files, temp tables, updates) while remaining fully transparent in the UI breakdown.
* **Trade-offs:** Assumes geometric 15% monthly growth which may overprovision static blogs or underprovision rapid media-upload portals.
* **When to Revisit:** Revisit when adding user controls for custom growth horizons (e.g., 3, 12, 24 months) or cloud-specific block-storage increment options (e.g., AWS EBS 1 GB increments).

---

### 2.4 Decision 4: Demo History and Authentication Scope

* **Context:** [TRD Section 14.4](file:///F:/SiteScale/TRD.md#L208) asks: *"Is server-side multi-user history part of the demo? If yes, add authentication and ownership before enabling the history endpoint."*
* **Choice:** **Client-side history with unauthenticated immutable lookup by UUID**. Server-side multi-user authentication and user account models are strictly **out of scope** for the Hackathon MVP:
  1. **Browser LocalStorage History:** The React frontend maintains a local list of recent analysis submissions (`[ { id: "uuid", url: "...", category: "...", timestamp: "..." } ]`) in browser `localStorage` (capped at the 20 most recent entries).
  2. **Lookup Endpoint:** The UI reloads past results using the public `GET /api/v1/analyses/{id}` endpoint, which retrieves the immutable analysis record by its cryptographically random UUIDv4.
  3. **No Unauthenticated History Enumeration:** There is **no public listing endpoint** (`GET /api/v1/analyses` is forbidden/disabled for unauthenticated clients). An analysis can only be retrieved if the caller already possesses its specific UUID.
  4. **Labeling in UI:** The history drawer is explicitly labeled *"Recent Estimates on this Browser"*.
* **Rationale:** Implementing a secure auth system (passwords, JWTs, OAuth, email confirmation, CSRF tokens, session tables) consumes critical hackathon engineering time without demonstrating core sizing value. UUID lookups allow users to refresh or share links to their estimates without security leakage of other users' analyses.
* **Trade-offs:** Users lose their history if they switch browsers or clear local cache; anyone with the UUID link can view the public sizing estimate.
* **When to Revisit:** Post-hackathon before any public production deployment, add OAuth/OIDC authentication, user ownership foreign keys on the `analyses` table, and team workspaces.

---

## 3. Supplementary System & Design Decisions

### 3.1 Design System Alignment
* **Choice:** The frontend strictly implements [DESIGN.md](file:///F:/SiteScale/DESIGN.md).
  * Five core colors: Canvas `#FAF9F7`, Surface `#FFFFFF`, Surface Sunken `#F3F1ED`, Border `#DFDAD1`, Text Primary `#1A1917`.
  * Amber `#C7953D` is strictly capped at $\le 3\%$ of viewport (used only for AI/recommendation confidence chips, processing indicators, or hero metric emphasis; never for buttons, section backgrounds, or body text).
  * Primary CTAs are solid black `#1A1917` with full pill radius (`999px`).
  * Deep Blue `#2C4A7C` for links, tabs, and informational badges.
  * Green `#2F7D5C` for passing SLOs and success indicators.
  * Error Red `#B8503F` for failures and out-of-coverage notices.
  * System fonts: `Inter` (sans-serif) and `JetBrains Mono` (monospace).

### 3.2 Job Worker Implementation
* **Choice:** Use PostgreSQL as the job queue with `SELECT ... FOR UPDATE SKIP LOCKED` inside `jobs` table transactions.
* **Rationale:** Eliminates the operational overhead of running and monitoring Redis and Celery/RQ during the hackathon, while ensuring atomic leases and reliable recovery from worker crashes.

### 3.3 Public URL Profiler Security & Bounding
* **Choice:** Mandatory defense-in-depth against SSRF:
  * Restrict protocols strictly to `http://` and `https://`.
  * Pre-resolve hostnames and block private IPs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.169.254` cloud metadata, `::1`, and IPv6 link-local).
  * Re-validate target IP addresses on every HTTP redirect.
  * Hard execution budgets: max 3 same-origin pages, 5 redirects, 100 network requests, 10 MB total transfer, 30-second wall-clock timeout.
  * When profiling fails or is blocked, seamlessly fall back to category/workload baseline with `limited` evidence flag.

### 3.4 Recommendation Strategy: Baseline vs. ML
* **Choice:** The primary serving engine is an interpretable category-and-workload lookup baseline mapped to published candidate tiers (`small: 1 vCPU / 2 GB`, `medium: 2 vCPU / 4 GB`, `large: 4 vCPU / 8 GB`). A Random Forest regressor is developed and evaluated offline using strict GroupKFold / Leave-One-App-Out validation; it will only be activated if it proves higher SLO compliance on held-out reference apps without excessive overprovisioning.

---

## 4. Genuinely Unresolved Team Decisions (Assumptions Requiring Input)

The following items are explicitly recorded as pending team confirmation:

1. **[ASSUMPTION NEEDING TEAM INPUT] Local Demo vs. Cloud Deployment Target:**
   * *Current Assumption:* The live hackathon demonstration will run locally on the presenter's laptop using Docker Compose (`localhost:3000` UI, `localhost:8000` API).
   * *Required Decision:* If the team intends to deploy SiteScale to a public cloud instance (e.g. Render, Railway, or AWS EC2) for judge testing, firewall rules, public CORS origins, and outbound NAT egress policies must be finalized before Milestone 4.
2. **[ASSUMPTION NEEDING TEAM INPUT] Target Reference App Container Runtimes:**
   * *Current Assumption:* All 6 reference applications will run directly via Docker Compose on x86_64/AMD64 or ARM64 (Apple Silicon / Linux) using official Docker Hub images.
   * *Required Decision:* If the presenter machine is an Apple Silicon Mac (M1/M2/M3), any container images lacking multi-arch manifests (e.g. older MySQL or PHP images) will run via Rosetta emulation, which may alter CPU latency metrics. The team must confirm the primary benchmark runner host CPU architecture.
3. **[ASSUMPTION NEEDING TEAM INPUT] Minimum Model Improvement Threshold for Activation:**
   * *Current Assumption:* The ML challenger model will replace the baseline only if it improves the primary evaluation metric (passing tier prediction accuracy on held-out apps) by at least **5 percentage points** without increasing the average tier distance by more than 0.25.
   * *Required Decision:* The data science / engineering team must formally ratify this promotion threshold before releasing an `engine_version` artifact.
