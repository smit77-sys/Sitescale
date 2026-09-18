export const CATEGORIES = [
  {
    id: 'cms',
    name: 'CMS / Blog',
    description: 'Content-heavy sites, headless CMS, documentation portals',
    examples: ['Ghost', 'WordPress', 'Strapi', 'Sanity'],
    icon: 'FileText',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online stores, product catalogs, cart & checkout flows',
    examples: ['Medusa', 'PrestaShop', 'WooCommerce', 'Custom Store'],
    icon: 'ShoppingCart',
  },
  {
    id: 'dashboard',
    name: 'Dashboard / SaaS',
    description: 'Data visualization, internal tools, admin portals',
    examples: ['Grafana', 'Metabase', 'Retool', 'Custom React App'],
    icon: 'LayoutDashboard',
  },
  {
    id: 'custom',
    name: 'Custom Web API',
    description: 'Node.js, Python FastAPI, Go, or Ruby backend applications',
    examples: ['REST APIs', 'GraphQL', 'Microservices'],
    icon: 'Code2',
  },
];

export const WORKLOADS = [
  {
    id: 'light',
    name: 'Light Workload',
    subhead: '< 10 req/sec',
    description: 'Personal projects, dev/staging sites, low traffic blogs.',
    badge: '1 - 10 req/s',
    p95Target: '< 200 ms',
  },
  {
    id: 'moderate',
    name: 'Moderate Workload',
    subhead: '10 - 50 req/sec',
    description: 'Growing applications, active SaaS users, small business traffic.',
    badge: '10 - 50 req/s',
    p95Target: '< 350 ms',
  },
  {
    id: 'busy',
    name: 'Busy Workload',
    subhead: '50 - 200+ req/sec',
    description: 'High traffic production sites, frequent spikes, marketing campaigns.',
    badge: '50 - 200+ req/s',
    p95Target: '< 500 ms',
  },
];

export const BENCHMARKS = [
  {
    id: 'ghost',
    name: 'Ghost CMS',
    category: 'CMS / Blog',
    description: 'Node.js blogging & newsletter platform under synthetic load.',
    metrics: {
      light: { reqPerSec: 5, p95Latency: 180, errorRate: 0.0, cpu: 15, ram: 220 },
      moderate: { reqPerSec: 25, p95Latency: 310, errorRate: 0.2, cpu: 58, ram: 410 },
      busy: { reqPerSec: 75, p95Latency: 490, errorRate: 0.8, cpu: 88, ram: 780 },
    },
    recommendedTier: { light: 'Small', moderate: 'Medium', busy: 'Large' },
    chartData: [
      { rps: 5, p50: 90, p90: 140, p95: 180, p99: 250, cpu: 15, ram: 22 },
      { rps: 15, p50: 120, p90: 210, p95: 250, p99: 330, cpu: 34, ram: 35 },
      { rps: 25, p50: 160, p90: 270, p95: 310, p99: 410, cpu: 58, ram: 52 },
      { rps: 50, p50: 240, p90: 380, p95: 420, p99: 580, cpu: 76, ram: 68 },
      { rps: 75, p50: 310, p90: 440, p95: 490, p99: 720, cpu: 88, ram: 84 },
    ]
  },
  {
    id: 'medusa',
    name: 'Medusa E-Commerce',
    category: 'E-commerce',
    description: 'Headless Node.js e-commerce engine processing catalog & cart requests.',
    metrics: {
      light: { reqPerSec: 8, p95Latency: 220, errorRate: 0.1, cpu: 22, ram: 380 },
      moderate: { reqPerSec: 35, p95Latency: 380, errorRate: 0.4, cpu: 65, ram: 640 },
      busy: { reqPerSec: 90, p95Latency: 580, errorRate: 1.2, cpu: 92, ram: 1100 },
    },
    recommendedTier: { light: 'Medium', moderate: 'Large', busy: 'XL' },
    chartData: [
      { rps: 10, p50: 110, p90: 190, p95: 230, p99: 310, cpu: 24, ram: 32 },
      { rps: 25, p50: 180, p90: 290, p95: 340, p99: 450, cpu: 48, ram: 46 },
      { rps: 35, p50: 210, p90: 330, p95: 380, p99: 510, cpu: 65, ram: 58 },
      { rps: 60, p50: 290, p90: 440, p95: 500, p99: 680, cpu: 81, ram: 74 },
      { rps: 90, p50: 380, p90: 520, p95: 580, p99: 890, cpu: 92, ram: 89 },
    ]
  },
  {
    id: 'grafana',
    name: 'Grafana Dashboard',
    category: 'Dashboard',
    description: 'Time-series query dashboard rendering high-cardinality charts.',
    metrics: {
      light: { reqPerSec: 3, p95Latency: 140, errorRate: 0.0, cpu: 12, ram: 180 },
      moderate: { reqPerSec: 18, p95Latency: 260, errorRate: 0.1, cpu: 44, ram: 320 },
      busy: { reqPerSec: 55, p95Latency: 410, errorRate: 0.5, cpu: 82, ram: 620 },
    },
    recommendedTier: { light: 'Small', moderate: 'Medium', busy: 'Large' },
    chartData: [
      { rps: 5, p50: 70, p90: 110, p95: 140, p99: 200, cpu: 15, ram: 20 },
      { rps: 18, p50: 130, p90: 210, p95: 260, p99: 340, cpu: 44, ram: 38 },
      { rps: 35, p50: 190, p90: 300, p95: 350, p99: 460, cpu: 66, ram: 54 },
      { rps: 55, p50: 260, p90: 370, p95: 410, p99: 590, cpu: 82, ram: 72 },
    ]
  },
  {
    id: 'prestashop',
    name: 'PrestaShop',
    category: 'E-commerce',
    description: 'PHP e-commerce framework with MySQL database load.',
    metrics: {
      light: { reqPerSec: 6, p95Latency: 240, errorRate: 0.2, cpu: 28, ram: 420 },
      moderate: { reqPerSec: 28, p95Latency: 420, errorRate: 0.6, cpu: 72, ram: 850 },
      busy: { reqPerSec: 70, p95Latency: 640, errorRate: 1.8, cpu: 94, ram: 1450 },
    },
    recommendedTier: { light: 'Medium', moderate: 'Large', busy: 'XL' },
    chartData: [
      { rps: 5, p50: 130, p90: 200, p95: 240, p99: 340, cpu: 26, ram: 38 },
      { rps: 15, p50: 200, p90: 310, p95: 360, p99: 490, cpu: 50, ram: 56 },
      { rps: 28, p50: 260, p90: 370, p95: 420, p99: 580, cpu: 72, ram: 69 },
      { rps: 50, p50: 340, p90: 480, p95: 540, p99: 750, cpu: 86, ram: 82 },
    ]
  }
];

export const MOCK_HISTORY_PRESETS = [
  {
    id: 'hist-1',
    url: 'https://blog.techcrunch.com',
    domain: 'blog.techcrunch.com',
    category: 'CMS / Blog',
    workload: 'Moderate',
    timestamp: '2 hours ago',
    dateIso: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    recommendation: {
      tier: 'Medium',
      cpu: 2,
      ram: 4,
      storage: 40,
      confidence: 87,
    },
    performance: {
      p50: 180,
      p90: 270,
      p95: 310,
      p99: 420,
      throughput: 24.8,
      errorRate: 0.2,
    }
  },
  {
    id: 'hist-2',
    url: 'https://store.acme.io',
    domain: 'store.acme.io',
    category: 'E-commerce',
    workload: 'Busy',
    timestamp: 'Yesterday',
    dateIso: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    recommendation: {
      tier: 'Large',
      cpu: 4,
      ram: 8,
      storage: 80,
      confidence: 91,
    },
    performance: {
      p50: 210,
      p90: 340,
      p95: 380,
      p99: 520,
      throughput: 88.4,
      errorRate: 0.4,
    }
  },
  {
    id: 'hist-3',
    url: 'https://analytics.internal-dev.net',
    domain: 'analytics.internal-dev.net',
    category: 'Dashboard / SaaS',
    workload: 'Light',
    timestamp: '3 days ago',
    dateIso: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    recommendation: {
      tier: 'Small',
      cpu: 1,
      ram: 2,
      storage: 20,
      confidence: 94,
    },
    performance: {
      p50: 95,
      p90: 140,
      p95: 165,
      p99: 220,
      throughput: 4.2,
      errorRate: 0.0,
    }
  }
];

export function generateMockResult(url, category, workload) {
  // Normalize domain
  let cleanDomain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] || 'example.com';
  
  let tier = 'Medium';
  let cpu = 2;
  let ram = 4;
  let storage = 40;
  let confidence = 87;
  let p50 = 180;
  let p90 = 270;
  let p95 = 310;
  let p99 = 420;
  let throughput = 24.8;
  let errorRate = 0.2;
  let cpuUsage = 64;
  let memoryUsage = 72;

  if (workload.toLowerCase().includes('light')) {
    tier = 'Small';
    cpu = 1;
    ram = 2;
    storage = 20;
    confidence = 91;
    p50 = 110;
    p90 = 160;
    p95 = 195;
    p99 = 260;
    throughput = 6.4;
    errorRate = 0.0;
    cpuUsage = 35;
    memoryUsage = 48;
  } else if (workload.toLowerCase().includes('busy')) {
    tier = 'Large';
    cpu = 4;
    ram = 8;
    storage = 80;
    confidence = 85;
    p50 = 240;
    p90 = 360;
    p95 = 430;
    p99 = 580;
    throughput = 112.5;
    errorRate = 0.5;
    cpuUsage = 82;
    memoryUsage = 86;
  }

  return {
    id: 'res-' + Date.now(),
    website: url,
    domain: cleanDomain,
    category: category || 'CMS / Blog',
    workload: workload || 'Moderate',
    timestamp: 'Just now',
    dateIso: new Date().toISOString(),

    recommendation: {
      tier,
      cpu,
      ram,
      storage,
      confidence,
      reasoningSummary: `Balanced starting point for ${cleanDomain} with a ${workload} pattern. Includes +25% capacity headroom for traffic bursts.`
    },

    performance: {
      p50,
      p90,
      p95,
      p99,
      throughput,
      errorRate,
    },

    resources: {
      cpuUsage,
      memoryUsage,
    },

    assumptions: [
      "Public URL analysis observes externally visible HTTP headers, DOM structure, & script footprints.",
      "Workload profile assumes standard CDN caching for static assets.",
      "Target p95 response SLA is set to sub-500ms for optimal user experience.",
      "Database and background job requirements assume co-located container or managed RDS headroom.",
    ],

    tierComparison: [
      { name: 'Small', cpu: '1 vCPU', ram: '2 GB', storage: '20 GB', result: 'Not sufficient', status: 'warning', detail: 'Elevated p99 latency under spikes' },
      { name: 'Medium', cpu: '2 vCPU', ram: '4 GB', storage: '40 GB', result: 'Recommended', status: 'recommended', detail: 'Optimal cost to performance ratio' },
      { name: 'Large', cpu: '4 vCPU', ram: '8 GB', storage: '80 GB', result: 'Additional headroom', status: 'success', detail: '2x safety buffer for sudden spikes' },
    ],

    chartData: [
      { time: '00:00', cpu: cpuUsage - 12, memory: memoryUsage - 8, latency: p95 - 40 },
      { time: '04:00', cpu: cpuUsage - 22, memory: memoryUsage - 12, latency: p95 - 65 },
      { time: '08:00', cpu: cpuUsage + 5, memory: memoryUsage + 4, latency: p95 + 15 },
      { time: '12:00', cpu: cpuUsage + 14, memory: memoryUsage + 9, latency: p95 + 45 },
      { time: '16:00', cpu: cpuUsage + 8, memory: memoryUsage + 6, latency: p95 + 20 },
      { time: '20:00', cpu: cpuUsage - 4, memory: memoryUsage - 2, latency: p95 - 10 },
      { time: '24:00', cpu: cpuUsage - 10, memory: memoryUsage - 6, latency: p95 - 35 },
    ]
  };
}
