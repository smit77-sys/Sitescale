# SiteScale — Technical Requirements Document

**Status:** Draft for hackathon build  
**Companion:** [Product Requirements Document](PRD.md)

## 1. Purpose and decisions

This document specifies the hackathon MVP described in the PRD: a public-URL planning estimate, a controlled reference-app benchmark dataset, and an evaluated recommendation engine. The MVP supports one host running an application's required containers, including its database and cache where used. It does not infer an existing site's actual infrastructure from its URL.

| Decision | MVP choice |
| --- | --- |
| Public URL | Profile a bounded set of pages; never load-test the third-party site. |
| Recommendation | Category/workload benchmark baseline first; optional ML challenger only if held-out-app evaluation improves the primary metric. |
| Capacity unit | Published host tiers; sum app, database, and cache usage on that host. Exclude the load generator. |
| Storage | Persistent-volume baseline plus user-supplied starting data and a stated growth/headroom allowance; show assumptions separately. |
| Background work | PostgreSQL-backed jobs with leases and `FOR UPDATE SKIP LOCKED`; one worker process initially. |
| Benchmark execution | Curated apps only, on a dedicated benchmark host/runner. Bring-your-own-app execution is stretch scope. |

## 2. Architecture and trust boundaries

```text
Browser → React UI → FastAPI → PostgreSQL
                         │          ↑
                         ├→ profile job → restricted HTTP/Playwright worker
                         │                       ↓
                         └→ recommendation engine ← feature snapshots
                                      ↑
                         versioned benchmark data/artifacts
                                      ↑
                    isolated benchmark runner (curated Docker apps + k6)
```

- The API validates requests, creates analysis records, and returns results. It does not launch Docker containers.
- The profiler is a separate worker with restricted outbound access. Its browser subrequests are subject to the same network restrictions as its initial URL.
- The benchmark runner is operated internally, isolated from the API host where possible. It may access only curated app containers and required package/image sources during setup. Load generation targets only its own benchmark network.
- Training runs offline against reviewed benchmark records. The serving API loads one approved, versioned artifact at startup or uses the baseline. Public requests cannot trigger retraining or load tests.

## 3. Technology choices

| Component | Choice | Notes |
| --- | --- | --- |
| API | FastAPI + Pydantic | OpenAPI schema and input validation. |
| Persistence | PostgreSQL + SQLAlchemy 2.x + Alembic | Use migrations from the first schema. Async database access is optional; choose one style consistently. |
| UI | React + TypeScript | Poll analysis status; save recent analysis IDs locally for the demo. |
| Profiling | HTTP client + BeautifulSoup; Playwright only when needed | Make tech detection a best-effort adapter; no mandatory Wappalyzer dependency. |
| Jobs | PostgreSQL queue | Avoid adding Redis/Celery for the MVP. |
| Benchmarks | Docker Compose + k6 + container metrics | Pin image versions and load scripts. |
| Modeling | scikit-learn | Baseline is mandatory; tree model and joblib artifact are optional. Do not load untrusted artifacts. |

The choice of k6 over Locust is only a concrete default; the load-tool adapter can be replaced without changing the benchmark record format.

## 4. Workload and sizing contract

### 4.1 Inputs

Each analysis requires:

- Public `http` or `https` URL.
- Category: `blog_cms`, `ecommerce`, or `dashboard`. A user who selects “unsure” must choose a category before recommendation.
- Either a named workload preset or custom traffic. Presets have versioned, visible values. Custom traffic specifies requests/second **or** concurrent users plus think time, journey mix, and read/write ratio.
- Optional starting persistent data size in GB and growth horizon. If absent, use a published category default and flag it as assumed.

`concurrent_users` and `requests_per_second` are stored as separate fields. Do not convert one into the other without a stated journey-duration/think-time model. Reject invalid ranges and unsupported combinations with field-level errors.

### 4.2 Output

The response contains:

- Recommended tier ID and its vCPU/RAM limits.
- Planning range for vCPU and RAM, derived from comparable benchmark variation, not described as a calibrated confidence interval.
- Storage breakdown: measured reference persistent footprint, assumed starting data, growth allowance, and headroom; total rounded to a published disk tier.
- Workload snapshot, category, evidence level (`benchmark_supported`, `limited`, or `out_of_coverage`), comparable reference app IDs, engine version, and short explanation.
- A clear `estimate` label for URL mode. Only controlled benchmark results may use `measured`.

Define tiers in versioned configuration (initial proposal: `small = 1 vCPU/2 GB`, `medium = 2 vCPU/4 GB`, `large = 4 vCPU/8 GB`). These are candidate test limits, not claims that every app will fit. If no tested tier passes, return `out_of_coverage` rather than silently choosing `large`.

## 5. Data model

Use UUID primary keys and UTC `timestamptz` fields. Store exact input and configuration snapshots so historical results remain interpretable after preset or model changes.

| Table | Required fields | Purpose |
| --- | --- | --- |
| `analyses` | `id`, `submitted_url`, `normalized_url`, `category`, `workload_json`, `starting_data_gb`, `status`, `profile_id` nullable, `recommendation_json` nullable, `engine_version` nullable, `error_code` nullable, `created_at`, `updated_at` | User request and immutable result snapshot. |
| `site_profiles` | `id`, `normalized_url`, `features_json`, `missing_fields_json`, `provenance_json`, `profile_status`, `profiled_at`, `profiler_version` | Observable URL features. No full scraped HTML by default. |
| `jobs` | `id`, `kind`, `entity_id`, `state`, `attempts`, `run_after`, `leased_until` nullable, `worker_id` nullable, `error_code` nullable, `created_at`, `updated_at` | Durable asynchronous work. |
| `reference_apps` | `id`, `name`, `category`, `source_revision`, `compose_revision`, `journey_revision`, `seed_data_revision`, `profile_id` nullable | Independent app identity for evaluation grouping. |
| `benchmark_runs` | `id`, `reference_app_id`, `environment_version`, `tier_id`, `workload_json`, `repetition`, `metrics_json`, `passed_slo`, `validity_status`, `run_at` | Raw run and its measured metrics. |
| `engine_versions` | `id`, `version_label`, `kind`, `artifact_path` nullable, `artifact_sha256` nullable, `training_app_ids_json`, `evaluation_json`, `approved_at` nullable | Reproducible baseline/model release. |

Required `features_json` keys: `page_count_sampled`, `transfer_bytes`, `image_count`, `image_bytes`, `script_count`, `script_bytes`, `form_count`, `network_request_count`, `api_request_count`, `detected_tech`, and `has_login_form`. Record absent values as missing rather than zero. Keep units in names. All JSON shapes are versioned and validated with Pydantic schemas before database writes.

Required `metrics_json` keys: achieved requests/second, p95 latency in ms, error rate, p95/peak CPU cores, p95/peak memory bytes, baseline persistent-volume bytes, measured data growth bytes, and per-service measurements where available. Record warm-up and steady-state windows. `validity_status` distinguishes successful measurement from infrastructure failure, script failure, and SLO failure.

Indexes: `jobs(state, run_after)`, `analyses(created_at)`, `site_profiles(normalized_url, profiled_at)`, and `benchmark_runs(reference_app_id, tier_id)`. Never delete or overwrite benchmark runs used by an approved engine version.

## 6. URL profiling

1. Normalize the URL and allow only `http`/`https`; reject embedded credentials and unsupported ports by default.
2. Resolve each hostname and reject private, loopback, link-local, multicast, and cloud metadata destinations. Recheck every redirect and all browser subrequests. Enforce egress blocking at the network layer as the final boundary, including DNS rebinding cases.
3. Respect robots/site access rules. Cap redirects, pages, requests, response bytes, and total wall time. Initial limits: at most 3 same-origin pages, 5 redirects, 100 network requests, 10 MB total transfer, and 30 seconds per analysis. Make limits configurable.
4. Fetch HTML and parse static features. Run Playwright for network/dynamic features when the page is publicly accessible; do not bypass login or anti-bot controls.
5. Save feature values with source (`html`, `browser`, `header`, or `user`) and missing reasons. Never infer backend CPU, RAM, or disk from frontend asset size alone.

If profiling fails, mark the profile failure and calculate a category/workload fallback with `limited` evidence, provided valid workload and category inputs exist. Return a safe error code to the UI; keep detailed diagnostics in internal logs.

## 7. Benchmark protocol and labels

### 7.1 Reproducible run

For the MVP, curate at least 6 apps, at least 2 per category, and at least 3 workload levels per app. For each app, record the source and image digests, seed data, service list, host CPU architecture, Docker version, limits, journey script, and target traffic. Test each candidate tier separately using the same environment. Include application, database, and cache containers within the tier's aggregate CPU/RAM budget; the load generator stays outside it.

Run setup → warm-up → 10-minute steady-state load → metrics capture → teardown. Stop and mark the run invalid if the load generator fails to achieve the target, metrics are missing, or the app is unhealthy before the measured window. Repeat boundary cases where feasible. Do not use invalid runs for labels.

For the demo, a tier passes when p95 latency is at most 500 ms and error rate is below 1% during steady state. Record the achieved throughput and both performance values. The label for an app/workload pair is the smallest **tested passing tier**. If a smaller tier was not tested, mark the label provisional; if none passes, mark unsupported. Avoid fitting a continuous CPU/RAM target to raw consumption alone when the product promises a deployable tier.

Measure CPU and memory at container/service and host levels. Track persistent-volume bytes before and after the run; exclude load-generator files and temporary benchmark artifacts. Storage recommendations add explicit OS/image allowance and data-growth assumptions in a separate calculation, because the benchmark's persistent footprint is only one component of a host disk requirement.

### 7.2 Isolation

The runner accepts only reviewed, pinned reference definitions. Use a dedicated host or VM, a private Docker network, nonprivileged containers, resource limits, read-only mounts where possible, and timeouts/cleanup. The API process has no Docker socket access. Do not run user-supplied Compose files in the MVP. A future bring-your-own-app mode needs owner verification, secret handling, stronger isolation, and an explicit test target allowlist before implementation.

## 8. Recommendation and evaluation

### 8.1 Baseline

Select comparable benchmarks by category and workload proximity. Use passing-tier distributions to choose a conservative initial tier and a planning range; publish the rule and handle sparse or missing category coverage explicitly. Set an evidence threshold based on distinct reference apps, not the number of repeated runs. Storage is calculated with the separate formula in Section 4.2.

### 8.2 Optional learned model

Train only on valid, reviewed benchmark labels. Features include category, workload, and available URL signals with missing-value indicators. Use an explicit preprocessing pipeline; fit encoders/imputers only on training folds. A model may predict a tier or resource requirement, but its output must map to tested published tiers and cannot override `out_of_coverage` checks.

Use leave-one-app-out or grouped cross-validation keyed by `reference_app_id`. Never put different load levels, repetitions, or versions of the same app in both training and evaluation folds. Compare model and baseline on identical folds. The primary metric is the percentage of held-out app/workload cases whose recommended tier passes the SLO. Also report tier distance, overprovisioning, CPU/RAM error where meaningful, sample counts, and results by category. Approve a model only if it improves the primary metric without a material increase in overprovisioning; document the threshold before evaluation. Otherwise ship the baseline.

Train offline, save metrics and app IDs with the artifact hash, and require an explicit approval step to activate a version. Repeated benchmark rows do not count as independent apps. Planning ranges from observed variation are not statistical confidence intervals unless later calibrated on independent apps.

## 9. API contract

All endpoints use JSON, stable error codes, and an `/api/v1` prefix. Validate inputs before enqueueing work.

| Endpoint | Behavior |
| --- | --- |
| `POST /api/v1/analyses` | Accept URL, category, workload, optional data assumptions. Return `202` with analysis ID and status URL; reuse a recent safe profile when available. |
| `GET /api/v1/analyses/{id}` | Return status, profile summary when ready, recommendation when complete, or a safe failure code. Demo history reloads IDs saved in the browser through this endpoint; require authentication and ownership checks before public multi-user use. |
| `GET /api/v1/config` | Return category choices, versioned workload presets, tiers, and service-objective text. |
| `POST /api/v1/internal/benchmarks/runs` | Internal/admin only; enqueue a curated reference run by ID and approved configuration. |
| `POST /api/v1/internal/engines/train` | Internal/admin only; run evaluation and create an inactive engine version. Activation is a separate reviewed operation. |

Example create request:

```json
{
  "url": "https://example.org",
  "category": "blog_cms",
  "workload": {"preset": "moderate", "preset_version": "1"},
  "starting_data_gb": 2
}
```

The analysis status progresses through `queued`, `profiling`, `recommending`, and `completed`; `failed` is reserved for cases where no safe fallback can be produced. The UI polls with backoff and shows profiler failure as a limited-evidence completed result when the fallback succeeds.

## 10. Job behavior and operations

- Workers claim due jobs in a short transaction using `FOR UPDATE SKIP LOCKED`, set `leased_until`, and commit before doing long work.
- A worker heartbeats its lease. Expired leases can be reclaimed; every job handler is idempotent and writes outputs with an idempotency key or unique constraint.
- Retry transient failures with bounded exponential backoff and a maximum attempt count. Permanent validation and policy failures do not retry.
- Log `job_id`, `analysis_id`/`reference_app_id`, stage, duration, and error code. Do not log credentials or full page bodies.
- Track queue depth, job age, profiling success/fallback rate, recommendation latency, and benchmark failures. Alert or surface a clear admin status if the worker is unavailable.

## 11. Security and data handling

- Defend against SSRF at URL validation, redirect resolution, browser subrequests, and network egress. DNS checks alone are insufficient.
- Rate-limit public submissions and cap per-job CPU, memory, network, browser time, and stored data. No arbitrary public load-test endpoint.
- Restrict internal benchmark/training endpoints to an authenticated administrator or to a private deployment network for the local demo; do not expose them publicly by accident.
- Keep database credentials and any future benchmark secrets in environment/secret storage, never in URLs, logs, or model features.
- Store profile metadata rather than raw page content; define a retention period for analysis history before a public deployment. If history is shared across users, add user ownership and authorization checks first.
- Pin and verify model artifacts. Only the internal training pipeline may produce files that the API deserializes.

## 12. Verification and delivery

### Required tests

- URL safety tests for private IPs, redirects to private addresses, DNS rebinding simulation, and browser subrequests; test caps and timeouts.
- Feature parser tests for static HTML, dynamic-page missing values, and failed profiling fallback.
- Job tests for duplicate delivery, worker crash/lease expiry, retries, and idempotent writes.
- Benchmark integration test for one curated app: deploy, warm up, load, capture metrics, label, and tear down.
- Evaluation test proving no reference-app identity appears in both training and validation folds.
- API/UI smoke test from URL submission through completed estimate and history.

### Release gates

1. At least 6 curated apps across the 3 categories and 3 workload levels per app have valid records.
2. Every recommendation records its workload snapshot, evidence level, tier table version, and engine version.
3. Baseline and any candidate model are evaluated on held-out apps; an unapproved model cannot serve requests.
4. Public URL profiling passes network-boundary tests before any public deployment.
5. The demo recovers from an inaccessible URL with a limited-evidence result or clear actionable error.

## 13. Deployment and configuration

Use Docker Compose for local development with UI, API, worker, and PostgreSQL. Run the curated benchmark runner separately; the application Compose stack must not mount the Docker socket. Provide migrations, health checks, and a one-command seed for preset/tier configuration. Keep model artifacts in a versioned local directory or object store with a checksum.

Required configuration includes database URL, allowed origins, profile budgets/timeouts, worker lease/retry settings, approved engine version, artifact directory, tier/preset config versions, and benchmark-runner connection details (internal only). Provide example non-secret values in `.env.example`; fail startup on missing required production settings.

## 14. Open technical questions

1. Which exact user journeys and seed-data volumes represent each category? Finalize before collecting labels.
2. Will the demo host support a physically separate benchmark runner, or an isolated VM on the same machine? Record the choice in benchmark metadata.
3. What category defaults and growth horizon should storage planning use when users omit data size?
4. Is server-side multi-user history part of the demo? If yes, add authentication and ownership before enabling the history endpoint.
