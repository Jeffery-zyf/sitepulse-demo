import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const JWT_SECRET = process.env.JWT_SECRET || "sitepulse-dev-secret";
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "data", "sitepulse.db");

const app = express();
app.use(cors());
app.use(express.json());

await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
const schemaPath = path.join(__dirname, "..", "db.sql");
const schemaSql = await fs.readFile(schemaPath, "utf-8");
await db.exec(schemaSql);

const mapAuditRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    scores: row.scores_json ? JSON.parse(row.scores_json) : null,
    issues: row.issues_json ? JSON.parse(row.issues_json) : [],
  };
};

const mapProjectRow = (row) => ({
  id: row.id,
  ownerId: row.owner_id,
  name: row.name,
  url: row.url,
  createdAt: row.created_at,
});

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const ensureProjectAccess = async (projectId, userId) => {
  const membership = await db.get(
    "SELECT id FROM memberships WHERE project_id = ? AND user_id = ?",
    projectId,
    userId
  );
  return Boolean(membership);
};

const generateScores = () => ({
  performance: Math.floor(60 + Math.random() * 40),
  seo: Math.floor(55 + Math.random() * 45),
  accessibility: Math.floor(50 + Math.random() * 45),
  bestPractices: Math.floor(55 + Math.random() * 40),
});

const issueTemplates = [
  {
    title: "Optimize images",
    category: "performance",
    severity: "medium",
    recommendation: "Compress and serve images in next-gen formats.",
  },
  {
    title: "Missing meta description",
    category: "seo",
    severity: "low",
    recommendation: "Add a unique meta description to improve search snippets.",
  },
  {
    title: "Insufficient color contrast",
    category: "accessibility",
    severity: "high",
    recommendation: "Adjust text colors to meet WCAG contrast ratios.",
  },
  {
    title: "Use HTTPS",
    category: "best-practices",
    severity: "critical",
    recommendation: "Ensure all requests are served over HTTPS.",
  },
  {
    title: "Reduce unused JavaScript",
    category: "performance",
    severity: "medium",
    recommendation: "Remove unused bundles and split code for faster loads.",
  },
  {
    title: "Add alt text",
    category: "accessibility",
    severity: "medium",
    recommendation: "Add descriptive alt text to all informative images.",
  },
];

const generateIssues = () => {
  const issueCount = Math.floor(3 + Math.random() * 4);
  const shuffled = [...issueTemplates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, issueCount).map((issue) => ({
    id: `iss_${uuidv4()}`,
    ...issue,
    page: "/",
  }));
};

const scheduleAuditProgress = async (auditId) => {
  setTimeout(async () => {
    await db.run("UPDATE audits SET status = ? WHERE id = ?", "running", auditId);
  }, 1000);

  setTimeout(async () => {
    const scores = generateScores();
    const issues = generateIssues();
    await db.run(
      "UPDATE audits SET status = ?, completed_at = ?, scores_json = ?, issues_json = ? WHERE id = ?",
      "completed",
      new Date().toISOString(),
      JSON.stringify(scores),
      JSON.stringify(issues),
      auditId
    );
  }, 3000);
};

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body ?? {};
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const existing = await db.get("SELECT id FROM users WHERE email = ?", email);
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = `usr_${uuidv4()}`;
  const createdAt = new Date().toISOString();
  await db.run(
    "INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)",
    userId,
    email,
    passwordHash,
    name,
    createdAt
  );
  const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
  return res.status(201).json({
    token,
    user: { id: userId, email, name, createdAt },
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  const user = await db.get("SELECT * FROM users WHERE email = ?", email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    },
  });
});

app.get("/api/projects", authenticate, async (req, res) => {
  const projects = await db.all(
    `SELECT p.*
     FROM projects p
     JOIN memberships m ON m.project_id = p.id
     WHERE m.user_id = ?
     ORDER BY p.created_at DESC`,
    req.user.userId
  );

  const enriched = await Promise.all(
    projects.map(async (project) => {
      const latestAudit = await db.get(
        "SELECT * FROM audits WHERE project_id = ? ORDER BY created_at DESC LIMIT 1",
        project.id
      );
      const memberCountRow = await db.get(
        "SELECT COUNT(*) as count FROM memberships WHERE project_id = ?",
        project.id
      );
      return {
        ...mapProjectRow(project),
        latestAudit: mapAuditRow(latestAudit),
        memberCount: memberCountRow?.count ?? 0,
      };
    })
  );

  return res.json({ projects: enriched });
});

app.post("/api/projects", authenticate, async (req, res) => {
  const { name, url } = req.body ?? {};
  if (!name || !url) {
    return res.status(400).json({ message: "Missing project fields" });
  }
  const projectId = `prj_${uuidv4()}`;
  const createdAt = new Date().toISOString();
  await db.run(
    "INSERT INTO projects (id, owner_id, name, url, created_at) VALUES (?, ?, ?, ?, ?)",
    projectId,
    req.user.userId,
    name,
    url,
    createdAt
  );
  await db.run(
    "INSERT INTO memberships (id, project_id, user_id, role) VALUES (?, ?, ?, ?)",
    `mem_${uuidv4()}`,
    projectId,
    req.user.userId,
    "owner"
  );
  return res.status(201).json({
    project: {
      id: projectId,
      ownerId: req.user.userId,
      name,
      url,
      createdAt,
    },
  });
});

app.get("/api/projects/:id", authenticate, async (req, res) => {
  const projectId = req.params.id;
  const hasAccess = await ensureProjectAccess(projectId, req.user.userId);
  if (!hasAccess) {
    return res.status(404).json({ message: "Project not found" });
  }
  const project = await db.get("SELECT * FROM projects WHERE id = ?", projectId);
  const audits = await db.all(
    "SELECT * FROM audits WHERE project_id = ? ORDER BY created_at DESC",
    projectId
  );

  return res.json({
    project: mapProjectRow(project),
    audits: audits.map(mapAuditRow),
  });
});

app.post("/api/projects/:id/audits", authenticate, async (req, res) => {
  const projectId = req.params.id;
  const hasAccess = await ensureProjectAccess(projectId, req.user.userId);
  if (!hasAccess) {
    return res.status(404).json({ message: "Project not found" });
  }
  const auditId = `aud_${uuidv4()}`;
  const createdAt = new Date().toISOString();
  await db.run(
    "INSERT INTO audits (id, project_id, status, created_at) VALUES (?, ?, ?, ?)",
    auditId,
    projectId,
    "queued",
    createdAt
  );
  scheduleAuditProgress(auditId);
  const audit = await db.get("SELECT * FROM audits WHERE id = ?", auditId);
  return res.status(201).json({ audit: mapAuditRow(audit) });
});

app.get("/api/audits/:id", authenticate, async (req, res) => {
  const audit = await db.get("SELECT * FROM audits WHERE id = ?", req.params.id);
  if (!audit) {
    return res.status(404).json({ message: "Audit not found" });
  }
  const hasAccess = await ensureProjectAccess(
    audit.project_id,
    req.user.userId
  );
  if (!hasAccess) {
    return res.status(404).json({ message: "Audit not found" });
  }
  return res.json({ audit: mapAuditRow(audit) });
});

app.listen(PORT, () => {
  console.log(`SitePulse backend running on http://localhost:${PORT}`);
});
