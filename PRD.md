# SiteScale — Hackathon Product Requirements Document

**Status:** Draft for hackathon build  
**Product:** Single-instance resource sizing for small web applications

## 1. Product summary

SiteScale helps a developer choose an initial hosting size for a small web application. The user supplies a public URL, an application category, and an expected workload. SiteScale inspects observable site characteristics, compares them with load-tested reference applications, and returns a **starting recommendation** for vCPU, memory, and storage, with a range, assumptions, and an explanation.

A public URL cannot reveal the application's database size, background jobs, server code, or actual traffic. SiteScale must present URL-only results as estimates for planning, not as measured capacity or a guarantee. When a user supplies a deployable app for a controlled benchmark, SiteScale can report measured resource usage separately.

## 2. Problem and target users

Students, solo developers, and small teams often choose hosting plans using generic tiers or guesswork. Too little capacity causes slow responses or errors; too much wastes money. They need a quick, understandable recommendation tied to an explicit workload, plus a way to see how uncertain it is.

**Primary users:** developers deploying a first blog/CMS, small store, or dashboard.  
**Core job:** “Given my app type and expected load, what single-instance size should I start with, and what should I measure after launch?”

## 3. Goals and non-goals

### Hackathon goals

1. Turn a URL and workload estimate into a resource recommendation through a working UI and API.
2. Build a reproducible benchmark dataset from self-hosted reference apps.
3. Compare a simple, transparent sizing baseline with a learned model and use the model only where evaluation supports it.
4. Show assumptions, uncertainty, and the main signals behind each recommendation.

### Outside the hackathon MVP

- Guaranteed sizing for arbitrary production sites or undisclosed backend workloads.
- Automatically deploying or load-testing an arbitrary URL.
- Multi-instance architecture, autoscaling, multi-region hosting, or cloud price comparison.
- Automatic model retraining from unverified user submissions.

## 4. Supported use cases

| Mode | Input | Output | Evidence level |
| --- | --- | --- | --- |
| **URL estimate (MVP)** | Public URL, category, expected concurrent users or requests/second, workload preset | Suggested vCPU, RAM, storage planning range, assumptions, comparable references | Approximate; inferred from limited visible signals |
| **Reference benchmark (MVP, internal)** | Curated Docker app and scripted user journeys | Observed usage and smallest tested configuration meeting the performance target | Measured in the controlled test environment |
| **Bring-your-own-app benchmark (stretch)** | Owner-authorized deployable app, test credentials and scripted journeys | Measured recommendation for the supplied workload | Measured for that deployment and test only |

The initial categories are blog/CMS, e-commerce, and dashboard/internal tool. Users may choose “unsure”; SiteScale then asks them to select the closest category before calculating a recommendation.

## 5. User journey

1. User enters a URL and selects an application category.
2. User chooses a workload preset (light, moderate, or busy) or supplies expected requests/second, concurrent users, and read/write mix. Each preset displays its exact assumptions.
3. SiteScale validates the URL and profiles a small, bounded set of public pages. The user can correct the detected category or technology.
4. SiteScale returns an initial instance size, a plausible range, and a summary of the workload, reference apps, and uncertainty.
5. The result tells the user what to monitor after deployment: CPU, memory, p95 latency, error rate, and disk growth. A history page lets the user revisit an estimate.

If the URL cannot be analyzed, the user can still get a category-and-workload estimate with a clear “limited evidence” label.

## 6. Functional requirements

### 6.1 URL profiling

- Fetch only public `http`/`https` pages, with timeouts, redirect limits, response-size limits, and a small page/request budget.
- Collect observable features: transfer size, image and script counts and bytes, page count sampled, network/API request count, and detectable framework/CMS signals.
- Record feature provenance and missing values. Do not interpret frontend asset weight as a direct measurement of backend CPU or RAM.
- Block private, loopback, link-local, and metadata-service addresses, including after redirects and DNS resolution. Apply rate limits and respect site access rules.

### 6.2 Workload definition

- Require a workload preset or explicit traffic input. A URL alone is insufficient for a capacity estimate.
- Define each test profile by requests/second or concurrent users **and** think time, journey mix, test duration, data size, and read/write ratio. Do not treat concurrency as equivalent to requests/second.
- Make the selected profile visible in the result and persist it with the prediction.

### 6.3 Reference benchmarks and labels

- Curate **6–9 reference apps for the hackathon MVP**, with at least two per category and three workload levels per app. Expand to 15–20 apps after the demo if time permits.
- Run each app in a repeatable Docker environment with documented CPU architecture, container limits, backing services, seed data, and user journeys.
- Use k6 or Locust to generate representative browsing and write actions. Warm up before measurement; repeat runs where practical.
- Record p95 response time, error rate, throughput, p95/peak CPU and memory, and disk footprint. Separate app, database, cache, and uploaded-data usage where possible.
- Label the **smallest tested single-instance tier** that meets the target workload and service objective. For the demo, use p95 latency ≤ 500 ms and error rate < 1% during a 10-minute steady-state run; these thresholds are configurable and shown to users.
- Define storage as the measured baseline footprint plus an explicit data-growth allowance. URL analysis cannot infer future uploads or database growth, so storage output must show the assumed starting data size and growth horizon.

### 6.4 Recommendation engine

- Start with a category/workload lookup baseline using benchmark medians or nearest comparable apps. Map results to a small published tier table (for example, 1/2/4 vCPU and 2/4/8 GB RAM).
- Optionally train Random Forest or gradient-boosted regression models for CPU and memory. Compare them against the baseline before using them in results. With a small dataset, a simple baseline may be more reliable.
- Treat all load levels of the same reference app as one group when splitting train and test data. Hold out entire apps to measure generalization; never split rows from one app across train and test.
- Produce a recommendation range based on variation across comparable apps and repeated runs. Label it a **planning range**, not a statistical confidence interval unless calibrated as one.
- When the input falls outside benchmark coverage, fall back to a conservative category tier and flag low evidence. Never claim precision beyond the available data.
- Explain the result using workload, category, comparable apps, and observable features. Keep measured and inferred information visibly distinct.

### 6.5 UI and history

- Input form: URL, category, workload preset or custom traffic, and optional expected stored-data size.
- Result: recommended tier, vCPU, RAM, storage range, workload assumptions, evidence level, comparable benchmarks, and next-step monitoring advice.
- History: saved estimates with timestamp, input parameters, model/baseline version, and result. Avoid storing scraped page content unless needed for debugging.
- Jobs that require browser profiling run asynchronously with progress and clear failure messages.

## 7. System design

**Frontend:** React + TypeScript  
**API:** FastAPI  
**Database:** PostgreSQL for profiles, benchmark runs, model versions, and estimates  
**Workers:** background queue for browser profiling and benchmark processing  
**Profiling:** bounded HTTP fetch and Playwright for selected pages  
**Benchmarking:** Docker, k6 or Locust, and container/host metrics  
**Modeling:** scikit-learn baseline and optional tree-based regressor

```text
User input → API validation → profiling job → feature record
                                      ↓
Benchmark records → baseline/model → recommendation + evidence → UI/history
```

Reference-app deployment and load generation run in an isolated benchmark environment. The public URL estimate path never sends load-test traffic to a third-party site.

## 8. Data model (minimum)

- **SiteProfile:** URL/domain, category, observable features, missing-feature flags, profiling timestamp.
- **Workload:** traffic level, journey mix, read/write ratio, duration, data-size assumption.
- **BenchmarkRun:** app and version, environment, workload, measured metrics, pass/fail against the service objective.
- **Recommendation:** inputs, tier/range, evidence level, comparable app IDs, engine version, timestamp.

Exclude credentials and secrets from stored profiles. For any later bring-your-own-app feature, require verified authorization and isolate deployment and test execution.

## 9. Success criteria and evaluation

### Demo acceptance criteria

- A user can submit a supported URL and workload and see a result with explicit assumptions and evidence level.
- The complete URL-to-result flow works in the demo environment; cached or already-profiled sites return within 5 seconds, while new profiling runs show progress.
- The benchmark dataset includes at least 6 apps across all 3 categories and at least 3 load levels per app.
- Every recommendation traces to a baseline or evaluated model version and displays the reference coverage used.
- A failed or inaccessible URL yields a usable workload/category estimate or a clear actionable error.

### Model evaluation

- Primary metric: fraction of **held-out apps** assigned a tier that meets the performance target at the chosen workload.
- Secondary metrics: tier distance from the smallest passing tier, overprovisioning rate, CPU/RAM MAE, and storage error where measured.
- Report results by category and workload, alongside the number of held-out apps. Compare against the simple baseline. Avoid advertising a fixed accuracy target until enough independent apps are tested.

## 10. Delivery plan

1. **Benchmark foundation:** choose tiers and service objective; automate deployment, load scripts, metric capture, and repeatable data export.
2. **Recommendation MVP:** create baseline, API, workload presets, and result explanation.
3. **URL profiler and UI:** add bounded profiling, asynchronous status, result view, and history.
4. **Evaluation and polish:** hold out apps, compare the learned model, document limitations, and rehearse a reproducible demo.

**Stretch:** more reference apps, owner-authorized app benchmarking, calibrated uncertainty, and periodic retraining after dataset review.

## 11. Key risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Public-page features poorly predict server demand | Require workload and category; use comparable benchmarks; disclose evidence level and planning range. |
| Too few independent apps for a robust ML model | Use an interpretable baseline; evaluate by held-out app; deploy ML only if it improves results. |
| Reference tests do not resemble the user's workload | Publish journey, traffic, and data assumptions; allow workload selection and corrections. |
| Storage depends on private data and growth | Ask for starting data size; present baseline footprint and growth allowance separately. |
| Unsafe or excessive URL fetching | Restrict targets and budgets; validate redirects and resolved IPs; rate-limit jobs. |
| Benchmark measurements vary by host and services | Pin the environment, record service boundaries, and repeat representative runs. |

## 12. Future scope

After validating the MVP, expand reference categories and dataset coverage; add owner-authorized app benchmarks; calibrate prediction ranges; estimate provider-specific monthly cost; and recommend multi-instance or autoscaling setups for workloads that exceed single-instance tiers.
