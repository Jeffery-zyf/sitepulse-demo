// Mock Data for SitePulse Demo

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  timezone?: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  url: string;
  createdAt: string;
}

export interface Membership {
  id: string;
  projectId: string;
  userId: string;
  role: "owner" | "member";
}

export interface AuditScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface AuditIssue {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  page: string;
  recommendation: string;
  category: "performance" | "seo" | "accessibility" | "best-practices";
}

export interface Audit {
  id: string;
  projectId: string;
  status: "queued" | "running" | "done" | "failed";
  createdAt: string;
  completedAt?: string;
  scores?: AuditScores;
  issues?: AuditIssue[];
}

// Current User
export const currentUser: User = {
  id: "usr_1",
  email: "alex@sitepulse.io",
  name: "Alex Chen",
  company: "TechForward Inc.",
  timezone: "America/Los_Angeles",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

// Users
export const users: User[] = [
  currentUser,
  {
    id: "usr_2",
    email: "sarah@sitepulse.io",
    name: "Sarah Miller",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "usr_3",
    email: "james@contractor.com",
    name: "James Wilson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
];

// Projects
export const projects: Project[] = [
  {
    id: "prj_1",
    ownerId: "usr_1",
    name: "TechForward Main",
    url: "https://techforward.io",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "prj_2",
    ownerId: "usr_1",
    name: "E-commerce Store",
    url: "https://shop.techforward.io",
    createdAt: "2024-02-20T14:45:00Z",
  },
  {
    id: "prj_3",
    ownerId: "usr_1",
    name: "Developer Portal",
    url: "https://developers.techforward.io",
    createdAt: "2024-03-10T09:15:00Z",
  },
  {
    id: "prj_4",
    ownerId: "usr_1",
    name: "Marketing Landing",
    url: "https://promo.techforward.io",
    createdAt: "2024-04-05T16:20:00Z",
  },
];

// Memberships
export const memberships: Membership[] = [
  { id: "mem_1", projectId: "prj_1", userId: "usr_1", role: "owner" },
  { id: "mem_2", projectId: "prj_1", userId: "usr_2", role: "member" },
  { id: "mem_3", projectId: "prj_1", userId: "usr_3", role: "member" },
  { id: "mem_4", projectId: "prj_2", userId: "usr_1", role: "owner" },
  { id: "mem_5", projectId: "prj_2", userId: "usr_2", role: "member" },
  { id: "mem_6", projectId: "prj_3", userId: "usr_1", role: "owner" },
  { id: "mem_7", projectId: "prj_4", userId: "usr_1", role: "owner" },
];

// Sample Issues
const sampleIssues: AuditIssue[] = [
  {
    id: "iss_1",
    severity: "critical",
    title: "Render-blocking resources detected",
    page: "/",
    recommendation: "Defer non-critical CSS and JavaScript to improve First Contentful Paint.",
    category: "performance",
  },
  {
    id: "iss_2",
    severity: "critical",
    title: "Images not optimized",
    page: "/products",
    recommendation: "Use WebP format and implement lazy loading for below-the-fold images.",
    category: "performance",
  },
  {
    id: "iss_3",
    severity: "warning",
    title: "Missing meta description",
    page: "/about",
    recommendation: "Add a unique meta description between 150-160 characters.",
    category: "seo",
  },
  {
    id: "iss_4",
    severity: "warning",
    title: "Low color contrast ratio",
    page: "/contact",
    recommendation: "Increase contrast ratio to at least 4.5:1 for normal text.",
    category: "accessibility",
  },
  {
    id: "iss_5",
    severity: "info",
    title: "No HTTPS redirect",
    page: "Global",
    recommendation: "Implement automatic HTTPS redirect for all HTTP requests.",
    category: "best-practices",
  },
  {
    id: "iss_6",
    severity: "warning",
    title: "Missing alt text on images",
    page: "/gallery",
    recommendation: "Add descriptive alt text to all images for screen readers.",
    category: "accessibility",
  },
  {
    id: "iss_7",
    severity: "critical",
    title: "Large DOM size",
    page: "/",
    recommendation: "Reduce DOM elements below 1,500 nodes for better performance.",
    category: "performance",
  },
  {
    id: "iss_8",
    severity: "info",
    title: "Missing Open Graph tags",
    page: "/blog",
    recommendation: "Add og:title, og:description, and og:image for social sharing.",
    category: "seo",
  },
];

// Audits
export const audits: Audit[] = [
  {
    id: "aud_1",
    projectId: "prj_1",
    status: "done",
    createdAt: "2024-06-01T09:00:00Z",
    completedAt: "2024-06-01T09:05:00Z",
    scores: { performance: 92, seo: 88, accessibility: 95, bestPractices: 90 },
    issues: sampleIssues.slice(2, 5),
  },
  {
    id: "aud_2",
    projectId: "prj_1",
    status: "done",
    createdAt: "2024-05-15T14:30:00Z",
    completedAt: "2024-05-15T14:35:00Z",
    scores: { performance: 78, seo: 82, accessibility: 90, bestPractices: 85 },
    issues: sampleIssues.slice(0, 4),
  },
  {
    id: "aud_3",
    projectId: "prj_1",
    status: "done",
    createdAt: "2024-05-01T11:00:00Z",
    completedAt: "2024-05-01T11:06:00Z",
    scores: { performance: 65, seo: 75, accessibility: 85, bestPractices: 80 },
    issues: sampleIssues,
  },
  {
    id: "aud_4",
    projectId: "prj_2",
    status: "running",
    createdAt: "2024-06-02T10:00:00Z",
  },
  {
    id: "aud_5",
    projectId: "prj_2",
    status: "done",
    createdAt: "2024-05-28T16:00:00Z",
    completedAt: "2024-05-28T16:04:00Z",
    scores: { performance: 45, seo: 72, accessibility: 68, bestPractices: 75 },
    issues: sampleIssues.slice(0, 6),
  },
  {
    id: "aud_6",
    projectId: "prj_3",
    status: "queued",
    createdAt: "2024-06-02T10:30:00Z",
  },
  {
    id: "aud_7",
    projectId: "prj_3",
    status: "done",
    createdAt: "2024-05-20T08:00:00Z",
    completedAt: "2024-05-20T08:03:00Z",
    scores: { performance: 98, seo: 95, accessibility: 100, bestPractices: 96 },
    issues: sampleIssues.slice(7, 8),
  },
  {
    id: "aud_8",
    projectId: "prj_4",
    status: "failed",
    createdAt: "2024-05-25T12:00:00Z",
    completedAt: "2024-05-25T12:01:00Z",
  },
];

// Helper functions
export function getProjectById(projectId: string): Project | undefined {
  return projects.find((p) => p.id === projectId);
}

export function getAuditsByProjectId(projectId: string): Audit[] {
  return audits.filter((a) => a.projectId === projectId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLatestAuditForProject(projectId: string): Audit | undefined {
  const projectAudits = getAuditsByProjectId(projectId);
  return projectAudits[0];
}

export function getMembersByProjectId(projectId: string): Array<{ user: User; role: "owner" | "member" }> {
  return memberships
    .filter((m) => m.projectId === projectId)
    .map((m) => ({
      user: users.find((u) => u.id === m.userId)!,
      role: m.role,
    }))
    .filter((m) => m.user);
}

export function getUserById(userId: string): User | undefined {
  return users.find((u) => u.id === userId);
}

// Plans
export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "1 project",
      "5 audits per month",
      "Basic performance metrics",
      "7-day history",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    features: [
      "10 projects",
      "Unlimited audits",
      "Advanced metrics & insights",
      "90-day history",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: 79,
    period: "month",
    features: [
      "Unlimited projects",
      "Unlimited audits",
      "All Pro features",
      "Unlimited history",
      "Team collaboration",
      "SSO authentication",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
];

export const currentPlan = "pro";