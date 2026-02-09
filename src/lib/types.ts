export type AuditStatus = "queued" | "running" | "completed" | "failed";

export interface AuditScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface AuditIssue {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  page: string;
  category: string;
  recommendation: string;
}

export interface Audit {
  id: string;
  projectId: string;
  status: AuditStatus;
  createdAt: string;
  completedAt?: string | null;
  scores?: AuditScores | null;
  issues?: AuditIssue[];
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  url: string;
  createdAt: string;
  latestAudit?: Audit | null;
  memberCount?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
