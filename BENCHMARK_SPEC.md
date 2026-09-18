# SiteScale — Reference Application Benchmark Specification (BENCHMARK_SPEC.md)

**Status:** Approved for Hackathon MVP Implementation  
**Companion Documents:** [PRD.md](file:///F:/SiteScale/PRD.md), [TRD.md](file:///F:/SiteScale/TRD.md), [DECISIONS.md](file:///F:/SiteScale/DECISIONS.md)

---

## 1. Executive Summary & Benchmark Policy

This specification outlines the executable benchmarking methodology used to generate the ground-truth sizing dataset for SiteScale. The dataset underpins both the baseline heuristic engine and any offline-evaluated machine learning regressors.

> [!CAUTION]
> **Strict Operational Boundary:** Load generation tools (k6) are executed **exclusively** against curated, containerized reference applications running inside an isolated, controlled benchmark network. The public URL profiling pipeline **never** sends load, stress, or synthetic high-frequency traffic to external, third-party sites.

---

## 2. Reference Applications Catalog

The Hackathon MVP mandates **six self-hostable reference applications** spanning three categories (at least two per category). All applications are configured via deterministic Docker Compose manifests with pinned image tags or commit revisions.

```text
Categories:
├── blog_cms
│   ├── Ref-1: Ghost CMS (v5.82.4-alpine)
│   └── Ref-2: Directus Headless CMS (v10.10.4)
├── ecommerce
│   ├── Ref-3: MedusaJS Store Engine (v1.20.7)
│   └── Ref-4: PrestaShop (v8.1.5-apache)
└── dashboard
    ├── Ref-5: Metabase Analytics (v0.49.3)
    └── Ref-6: Grafana Operational Dashboard (v10.4.1)
```

---

### 2.1 Category 1: Blog & CMS (`blog_cms`)

#### Ref-1: Ghost CMS
* **Primary Source & Documentation:** [Ghost Docker Hub](https://hub.docker.com/_/ghost) | [Ghost GitHub](https://github.com/TryGhost/Ghost)
* **Pinned Version:** `ghost:5.82.4-alpine`
* **Required Services & Topology:**
  * `app`: `ghost:5.82.4-alpine` (Node.js runtime)
  * `db`: `mysql:8.0.36`
* **Seed Data Volume:**
  * 250 published blog articles (average 1,200 words each).
  * 20 static pages (About, Terms, Privacy, FAQ).
  * 50 tags and categories.
  * 1,000 user comments across posts.
  * 150 optimized JPEG/WebP images (~350 KB each, ~52.5 MB total static assets).
  * 5 author and editor accounts.
* **Representative Journeys (95% Read / 5% Write):**
  * *Journey A (60%):* Homepage browse, page navigation, tag filtering.
  * *Journey B (30%):* Post detail retrieval, fetching comments and post author metadata.
  * *Journey C (5%):* Full-text search queries.
  * *Journey D (5% - Write):* Submit a new reader comment via public API.
* **Verification Status:** **Verified** against official Ghost Docker Hub image and standard MySQL 8.0 Compose stack.
* **Fallback Candidate:** WordPress (`wordpress:6.4.3-fpm-alpine` + `nginx:1.25.4-alpine` + `mariadb:10.11.7`) using official Docker Library manifests.

#### Ref-2: Directus Headless CMS
* **Primary Source & Documentation:** [Directus Docker Hub](https://hub.docker.com/r/directus/directus) | [Directus GitHub](https://github.com/directus/directus)
* **Pinned Version:** `directus/directus:10.10.4`
* **Required Services & Topology:**
  * `directus`: `directus/directus:10.10.4`
  * `db`: `postgres:16.2-alpine`
  * `cache`: `redis:7.2.4-alpine`
* **Seed Data Volume:**
  * 250 relational articles in custom collection with nested relational author and tags.
  * 150 uploaded media assets managed in Directus storage.
  * 25 administrative and editor users.
* **Representative Journeys (95% Read / 5% Write):**
  * *Journey A (65%):* Public REST API query `/items/articles?fields=*.*&limit=15&page=1` (with relational joins).
  * *Journey B (25%):* Item detail query `/items/articles/:id?fields=*.*`.
  * *Journey C (5%):* Filtered full-text search on article title and content.
  * *Journey D (5% - Write):* Authenticated draft creation `/items/articles` (simulating author activity).
* **Verification Status:** **Verified** against Directus official Docker deployment guidelines.
* **Fallback Candidate:** Strapi (`strapi/strapi:4.19.1-alpine` + `postgres:16.2-alpine`).

---

### 2.2 Category 2: E-Commerce (`ecommerce`)

#### Ref-3: MedusaJS Store Engine
* **Primary Source & Documentation:** [Medusa GitHub](https://github.com/medusajs/medusa) | [Medusa Documentation](https://docs.medusajs.com/)
* **Pinned Version:** Release `medusajs/medusa:1.20.7`
* **Required Services & Topology:**
  * `medusa-backend`: Built from official `v1.20.7` Node.js base container
  * `postgres`: `postgres:16.2-alpine`
  * `redis`: `redis:7.2.4-alpine`
* **Seed Data Volume:**
  * 500 product items with multi-option variants (size, color) and stock inventories.
  * 25 collections/categories.
  * 2,000 product images (~500 KB each, ~1.0 GB total storage).
  * 200 registered customer accounts.
  * 100 historical order records with line items.
* **Representative Journeys (85% Read / 15% Write):**
  * *Journey A (45%):* Product catalog query `/store/products?limit=20&offset=0` with category filtering.
  * *Journey B (25%):* Product detail lookup `/store/products/:id` with inventory validation.
  * *Journey C (15%):* Search query with faceted tags.
  * *Journey D (10% - Write):* Create cart `/store/carts` and append line items `/store/carts/:id/line-items`.
  * *Journey E (5% - Write):* Checkout flow step: calculate totals and initialize payment session `/store/carts/:id/payment-sessions`.
* **Verification Status:** **Verified** with standard Medusa v1 Docker Compose deployment (Node.js + Postgres + Redis).
* **Fallback Candidate:** OpenCart (`bitnami/opencart:4.0.2-3` + `bitnami/mariadb:10.11.7`), official Bitnami containerized catalog.

#### Ref-4: PrestaShop
* **Primary Source & Documentation:** [PrestaShop Docker Hub](https://hub.docker.com/r/prestashop/prestashop) | [PrestaShop GitHub](https://github.com/PrestaShop/PrestaShop)
* **Pinned Version:** `prestashop/prestashop:8.1.5-apache`
* **Required Services & Topology:**
  * `prestashop`: `prestashop/prestashop:8.1.5-apache` (PHP-Apache stack)
  * `db`: `mysql:8.0.36`
* **Seed Data Volume:**
  * 500 product listings across 20 hierarchical categories.
  * 1,500 catalog images.
  * 250 registered test customer records.
  * 150 historical cart and order rows.
* **Representative Journeys (85% Read / 15% Write):**
  * *Journey A (45%):* Storefront catalog page, faceted navigation by attribute.
  * *Journey B (25%):* Product view with price computation and related items.
  * *Journey C (15%):* Keyword search query.
  * *Journey D (10% - Write):* Add product to cart (session update in database).
  * *Journey E (5% - Write):* Guest checkout initiation and shipping selection.
* **Verification Status:** **Verified** against official PrestaShop Docker Hub distributions.
* **Fallback Candidate:** Bagisto E-Commerce (`bagisto/bagisto:v2.1.2` + `mysql:8.0.36`).

---

### 2.3 Category 3: Dashboard & Internal Tools (`dashboard`)

#### Ref-5: Metabase Analytics
* **Primary Source & Documentation:** [Metabase Docker Hub](https://hub.docker.com/r/metabase/metabase) | [Metabase GitHub](https://github.com/metabase/metabase)
* **Pinned Version:** `metabase/metabase:v0.49.3`
* **Required Services & Topology:**
  * `metabase`: `metabase/metabase:v0.49.3` (JVM-based application)
  * `metabase-db`: `postgres:16.2-alpine` (internal application state)
  * `analytics-db`: `postgres:16.2-alpine` (target analytics warehouse)
* **Seed Data Volume:**
  * Analytics database populated with 100,000 relational event and transaction records across 5 tables (`orders`, `line_items`, `customers`, `events`, `telemetry`).
  * 10 configured operational dashboards in Metabase.
  * 40 distinct SQL and GUI aggregation questions/cards.
  * 20 registered team member accounts.
* **Representative Journeys (75% Read / 25% Write):**
  * *Journey A (40%):* Load main KPI dashboard (triggers 4–6 parallel aggregate analytical queries: `COUNT`, `SUM`, `AVG`, `GROUP BY`).
  * *Journey B (20%):* Tabular drill-down query with pagination and column filtering.
  * *Journey C (15%):* Ad-hoc parameterized query execution via API.
  * *Journey D (20% - Write):* Update card definition, toggle bookmark, or save user dashboard preference.
  * *Journey E (5% - Write):* Export report query results to CSV.
* **Verification Status:** **Verified** against official Metabase container distribution with external PostgreSQL storage.
* **Fallback Candidate:** Redash (`redash/redash:10.1.0.b50633` + `postgres:13-alpine` + `redis:7-alpine`).

#### Ref-6: Grafana Operational Dashboard
* **Primary Source & Documentation:** [Grafana Docker Hub](https://hub.docker.com/r/grafana/grafana-oss) | [Grafana GitHub](https://github.com/grafana/grafana)
* **Pinned Version:** `grafana/grafana-oss:10.4.1`
* **Required Services & Topology:**
  * `grafana`: `grafana/grafana-oss:10.4.1`
  * `db`: `postgres:16.2-alpine` (backend database for dashboards and users)
  * `datasource`: Synthetic PostgreSQL database pre-loaded with metrics and time-series tables
* **Seed Data Volume:**
  * 100,000 time-series metrics records across multiple hosts and device sensors.
  * 10 provisioned operational dashboards.
  * 40 visualization panels (time series, gauges, bar charts, status history).
  * 25 registered team user profiles.
* **Representative Journeys (75% Read / 25% Write):**
  * *Journey A (40%):* Dashboard overview load (executing 6–8 concurrent metric queries).
  * *Journey B (20%):* Time-range pan and zoom query (dynamic timestamp bounds).
  * *Journey C (15%):* Panel drill-down and log stream inspection.
  * *Journey D (20% - Write):* Add dashboard annotation or acknowledge triggered alert.
  * *Journey E (5% - Write):* Save updated panel configuration or create dashboard view.
* **Verification Status:** **Verified** against official Grafana OSS Docker Hub repository.
* **Fallback Candidate:** ToolJet (`tooljet/tooljet-ce:v2.24.0` + `postgres:16-alpine` + `redis:7-alpine`).

---

## 3. Workload Profiles & Traffic Model

Three standardized workload levels are evaluated for every reference application.

### 3.1 Workload Definitions

| Parameter | Light Workload | Moderate Workload | Busy Workload |
|---|---|---|---|
| **Target Throughput** | 5 requests/sec | 25 requests/sec | 75 requests/sec |
| **Virtual Users (VUs)** | 10 concurrent VUs | 50 concurrent VUs | 150 concurrent VUs |
| **Think Time Model** | Log-normal, median 2.5s (1.0s–5.0s) | Log-normal, median 2.5s (1.0s–5.0s) | Log-normal, median 2.0s (0.5s–4.0s) |
| **Warm-Up Duration** | 2 minutes | 2 minutes | 2 minutes |
| **Measurement Window** | **10 minutes steady-state** | **10 minutes steady-state** | **10 minutes steady-state** |
| **Ramp-Down Duration** | 1 minute | 1 minute | 1 minute |
| **Total Run Time** | 13 minutes | 13 minutes | 13 minutes |

### 3.2 Traffic Model Execution
* **Tool:** k6 (load generator executed from host, outside the application container cgroup).
* **Execution Style:** Closed model with virtual users pacing through the weighted journey steps with randomized think times, maintaining constant arrival pressure.
* **Data Independence:** Requests incorporate unique session tokens and random query parameters to prevent unrealistic upstream reverse-proxy caching from skewing backend load.

---

## 4. Candidate Sizing Tiers

Reference applications are evaluated against three published candidate resource tiers. Resource limits represent the **aggregate cap** assigned to the application and its co-located backing services (app + db + cache) via Docker Compose cgroup limits:

| Tier ID | vCPU Limit (Docker `cpus`) | Memory Limit (Docker `mem_limit`) | Allocation Split (App / DB / Cache) |
|---|---|---|---|
| `small` | **1.0 vCPU** | **2048 MB (2 GB)** | App: 0.6 vCPU / 1280 MB; DB: 0.4 vCPU / 768 MB (Cache: shared) |
| `medium` | **2.0 vCPU** | **4096 MB (4 GB)** | App: 1.2 vCPU / 2560 MB; DB: 0.8 vCPU / 1536 MB |
| `large` | **4.0 vCPU** | **8192 MB (8 GB)** | App: 2.5 vCPU / 5120 MB; DB: 1.5 vCPU / 3072 MB |

> [!NOTE]
> If a reference application fails to satisfy the SLO even on the `large` tier for a given workload, that workload is formally labeled as `out_of_coverage` rather than arbitrarily assuming a larger instance.

---

## 5. Metrics, Service Level Objectives (SLO), & Smallest Passing Tier

### 5.1 Metrics Captured During the 10-Minute Steady-State Window

1. **Achieved Throughput:** Average requests per second (req/s).
2. **Latency Distribution:** p50, p90, **p95**, p99 latency in milliseconds (ms).
3. **Error Rate:** Percentage of HTTP non-2xx/3xx responses or connection timeouts (%).
4. **Host & Container CPU:** p95 and peak CPU cores utilized (derived via Docker stats / cgroup CPU accounting).
5. **Host & Container Memory:** p95 and peak memory working set in bytes (excluding inactive file caches).
6. **Storage Footprint:**
   * Baseline persistent volume size before load test (bytes).
   * Post-test persistent volume size (bytes).
   * Delta storage growth during steady state (bytes).

### 5.2 SLO Pass/Fail Criteria

A benchmark run passes the Service Level Objective if and only if **all three** of the following conditions hold throughout the 10-minute steady-state window:
1. **p95 Latency:** $\le \mathbf{500\text{ ms}}$.
2. **Error Rate:** $< \mathbf{1.0\%}$ of total HTTP requests.
3. **Throughput Fidelity:** Achieved throughput is $\ge \mathbf{95\%}$ of target throughput.

### 5.3 Smallest Tested Passing Tier Identification Rule

For each reference application and workload level:
1. Candidate tiers are ordered strictly by resource capacity: `small` $\rightarrow$ `medium` $\rightarrow$ `large`.
2. Tiers are tested sequentially starting from `small`.
3. The **recommended baseline label** for an `(app, workload)` combination is the **smallest tier that passes the SLO**.
4. **Provisional Labeling:** If a tier passes (e.g. `medium`) but smaller tiers were omitted or skipped in the testing matrix, the record is flagged with `provisional: true`.
5. **Out of Coverage:** If `large` fails the SLO, the result is recorded as `passed_slo: false`, and the workload is flagged as `out_of_coverage`.

### 5.4 Repetition & Boundary Verification

* Any tier that represents the transition point (i.e. smallest passing tier) must be executed **3 times** under identical conditions.
* The median value of p95 latency and peak memory across the 3 runs determines the final record.
* If any 1 of the 3 runs violates the SLO, the tier fails and the next larger tier is tested.

---

## 6. Invalid Run Criteria

A benchmark run is declared **invalid** (`validity_status: "invalid"`) and discarded from training/baseline labeling if any of the following occur:
1. **Load Generator Saturation:** The host running k6 experiences $> 80\%$ sustained CPU utilization or reports dropped iterations due to resource exhaustion.
2. **Telemetry Loss:** Fewer than $90\%$ of expected 5-second container metric samples are captured.
3. **Premature Target Crash:** Any container in the reference application stack crashes (non-zero exit code), triggers an Out-Of-Memory (OOM) kill, or fails its HTTP health-check endpoint during the 2-minute warm-up window.
4. **Runner Network Anomaly:** Local socket exhaustion or connection resets initiated by the host operating system.

---

## 7. Execution Protocol & Teardown Lifecycle

Each benchmark execution follows a strictly scripted lifecycle:

```text
[Provision] ──> [Seed Data] ──> [Health Check] ──> [Warm-Up (2 min)] ──> [Measure (10 min)] ──> [Record Metrics] ──> [Teardown & Prune]
```

1. **Step 1: Environment Provisioning:**
   * Generate temporary Docker Compose override enforcing target cgroup limits (`cpus`, `mem_limit`).
   * Start containers on dedicated isolated bridge network (`sitescale-bench-net`).
2. **Step 2: Seed Data Loading:**
   * Load deterministic SQL dumps or execute database seeding scripts.
   * Record pre-run persistent volume size on disk.
3. **Step 3: Readiness Verification:**
   * Poll application HTTP `/healthz` or homepage until 200 OK is returned for 3 consecutive checks (timeout: 90s).
4. **Step 4: Warm-up Period (2 Minutes):**
   * Execute 20% of target workload to warm JVM/JIT compilers, OS disk page caches, and database connection pools. Metrics during warm-up are logged but excluded from SLO scoring.
5. **Step 5: Steady-State Measurement (10 Minutes):**
   * Ramp to 100% target workload. Continuously stream k6 metrics and poll Docker container stats at 5-second intervals.
6. **Step 6: Metrics Aggregation & Storage Delta:**
   * Measure post-test persistent volume bytes. Calculate p95 latency, error rate, and peak memory.
7. **Step 7: Teardown & Environment Cleanup:**
   * Stop containers (`docker compose down -v`).
   * Prune anonymous and named volumes used for the run.
   * Verify no orphan processes remain on host.

---

## 8. Output Record Schema

Every valid benchmark run exports a structured JSON record stored in the `benchmark_runs` database table:

```json
{
  "run_id": "b7e2a6d4-89c1-4ef3-9214-7d52f9011831",
  "reference_app_id": "ghost-cms",
  "reference_app_name": "Ghost CMS",
  "category": "blog_cms",
  "app_version": "5.82.4-alpine",
  "environment_metadata": {
    "runner_isolation": "single_host_cgroups",
    "cpu_architecture": "x86_64",
    "host_cpu_model": "AMD Ryzen 9 5900X 12-Core Processor",
    "host_total_ram_bytes": 34272186368,
    "os_kernel": "Linux 6.5.0-generic",
    "docker_version": "26.0.1",
    "cgroup_version": "v2"
  },
  "tier_id": "small",
  "tier_limits": {
    "vcpu": 1.0,
    "ram_bytes": 2147483648
  },
  "workload": {
    "level": "moderate",
    "target_requests_per_sec": 25.0,
    "virtual_users": 50,
    "think_time_median_sec": 2.5,
    "journey_mix": {
      "homepage_browse": 0.60,
      "post_detail": 0.30,
      "search": 0.05,
      "comment_submit": 0.05
    },
    "read_ratio": 0.95,
    "write_ratio": 0.05,
    "duration_seconds": 600
  },
  "repetition_index": 1,
  "metrics": {
    "achieved_requests_per_sec": 24.96,
    "latency_ms": {
      "p50": 84.2,
      "p90": 210.5,
      "p95": 312.4,
      "p99": 489.1
    },
    "error_rate_pct": 0.08,
    "cpu_cores": {
      "p95": 0.72,
      "peak": 0.89
    },
    "memory_bytes": {
      "p95": 1420107776,
      "peak": 1589452800
    },
    "storage": {
      "baseline_volume_bytes": 384829440,
      "post_run_volume_bytes": 387975168,
      "delta_growth_bytes": 3145728
    },
    "per_service_breakdown": {
      "app": {
        "p95_cpu_cores": 0.48,
        "peak_memory_bytes": 943718400
      },
      "db": {
        "p95_cpu_cores": 0.24,
        "peak_memory_bytes": 645734400
      }
    }
  },
  "passed_slo": true,
  "validity_status": "valid",
  "run_at": "2026-09-18T13:30:00Z"
}
```
