import type { Audit, Project, User } from "@/lib/types";
import { clearAuth, getToken, setStoredUser, setToken } from "@/lib/auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth();
    }
    const message = payload?.message || "Request failed";
    throw new ApiError(message, response.status);
  }

  return payload as T;
};

export const login = async (email: string, password: string): Promise<User> => {
  const data = await request<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data.user;
};

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const data = await request<{ token: string; user: User }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data.user;
};

export const getProjects = async (): Promise<Project[]> => {
  const data = await request<{ projects: Project[] }>("/api/projects");
  return data.projects;
};

export const createProject = async (
  name: string,
  url: string
): Promise<Project> => {
  const data = await request<{ project: Project }>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name, url }),
  });
  return data.project;
};

export const getProjectDetail = async (
  id: string
): Promise<{ project: Project; audits: Audit[] }> => {
  return request<{ project: Project; audits: Audit[] }>(`/api/projects/${id}`);
};

export const runAudit = async (projectId: string): Promise<Audit> => {
  const data = await request<{ audit: Audit }>(
    `/api/projects/${projectId}/audits`,
    {
      method: "POST",
    }
  );
  return data.audit;
};

export const getAudit = async (auditId: string): Promise<Audit> => {
  const data = await request<{ audit: Audit }>(`/api/audits/${auditId}`);
  return data.audit;
};
