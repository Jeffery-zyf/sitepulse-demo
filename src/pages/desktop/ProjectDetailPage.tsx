import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Play, 
  ExternalLink, 
  Calendar,
  Zap,
  Search as SearchIcon,
  Eye,
  Shield,
  ChevronDown,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/desktop/Navbar";
import { StatusBadge } from "@/components/desktop/StatusBadge";
import { ScoreRing } from "@/components/desktop/ScoreRing";
import { SeverityBadge } from "@/components/desktop/SeverityBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getProjectById,
  getAuditsByProjectId,
  type Audit,
  type AuditIssue,
} from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  // Demo fallback: try exact ID first, then prefixed version, then default to prj_1
  const resolvedId = id || "";
  const project = getProjectById(resolvedId) 
    || getProjectById(`prj_${resolvedId}`) 
    || getProjectById("prj_1"); // Default fallback for demo
  
  const projectId = project?.id || "";
  const audits = getAuditsByProjectId(projectId);
  const selectedAudit = audits.find((a) => a.id === selectedAuditId) || audits[0];
  const latestAuditStatus = selectedAudit?.status || "queued";

  useEffect(() => {
    if (audits.length > 0 && !selectedAuditId) {
      setSelectedAuditId(audits[0].id);
    }
  }, [audits, selectedAuditId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-[1440px] px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Project not found.</p>
            <Link to="/dashboard" className="text-primary hover:underline mt-2 inline-block">
              Return to dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    toast.success("Audit started", {
      description: `Running audit for ${project.name}...`,
    });
    
    setTimeout(() => {
      setIsRunningAudit(false);
      toast.success("Audit completed", {
        description: "Results are now available.",
      });
    }, 5000);
  };

  const toggleIssue = (issueId: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }
      return next;
    });
  };

  const getIssuesByCategory = (issues: AuditIssue[], category: string) => {
    return issues.filter((issue) => issue.category === category);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-[1440px] px-6 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl font-semibold text-foreground">
                  {project.name}
                </h1>
                <StatusBadge status={isRunningAudit ? "running" : latestAuditStatus} />
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {project.url}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <Button
              onClick={handleRunAudit}
              disabled={isRunningAudit}
              className={cn(isRunningAudit && "animate-pulse-glow")}
            >
              <Play className="mr-2 h-4 w-4" />
              {isRunningAudit ? "Running Audit..." : "Run New Audit"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Audit History */}
          <div className="col-span-12 lg:col-span-3">
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-foreground">Audit History</h2>
              </div>
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {audits.map((audit) => (
                  <button
                    key={audit.id}
                    onClick={() => setSelectedAuditId(audit.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors",
                      selectedAudit?.id === audit.id && "bg-accent"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {format(new Date(audit.createdAt), "MMM d, yyyy")}
                      </span>
                      <StatusBadge status={audit.status} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(audit.createdAt), "h:mm a")}
                    </div>
                    {audit.status === "done" && audit.scores && (
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Avg: <span className="font-mono text-foreground">
                            {Math.round(
                              (audit.scores.performance +
                                audit.scores.seo +
                                audit.scores.accessibility +
                                audit.scores.bestPractices) /
                                4
                            )}
                          </span>
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Audit Details */}
          <div className="col-span-12 lg:col-span-9">
            {!selectedAudit ? (
              <div className="rounded-lg border border-border bg-card px-8 py-16 text-center">
                <p className="text-muted-foreground">No audits available for this project.</p>
                <Button onClick={handleRunAudit} className="mt-4">
                  Run your first audit
                </Button>
              </div>
            ) : selectedAudit.status === "running" || isRunningAudit ? (
              <div className="rounded-lg border border-border bg-card px-8 py-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent animate-scan pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Zap className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Audit in Progress
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Analyzing {project.url}...
                  </p>
                  <div className="mt-6 max-w-xs mx-auto">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedAudit.status === "failed" ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-8 py-16 text-center">
                <h3 className="font-display text-lg font-semibold text-destructive">
                  Audit Failed
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Unable to complete the audit. The website may be unreachable or blocking requests.
                </p>
                <Button onClick={handleRunAudit} className="mt-6">
                  Retry Audit
                </Button>
              </div>
            ) : selectedAudit.status === "queued" ? (
              <div className="rounded-lg border border-border bg-card px-8 py-16 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Audit Queued
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This audit is waiting to be processed...
                </p>
              </div>
            ) : (
              <>
                {/* Score Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <ScoreCard
                    icon={Zap}
                    label="Performance"
                    score={selectedAudit.scores!.performance}
                  />
                  <ScoreCard
                    icon={SearchIcon}
                    label="SEO"
                    score={selectedAudit.scores!.seo}
                  />
                  <ScoreCard
                    icon={Eye}
                    label="Accessibility"
                    score={selectedAudit.scores!.accessibility}
                  />
                  <ScoreCard
                    icon={Shield}
                    label="Best Practices"
                    score={selectedAudit.scores!.bestPractices}
                  />
                </div>

                {/* Tabbed Content */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="issues"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      Issues ({selectedAudit.issues?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger
                      value="performance"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      Performance
                    </TabsTrigger>
                    <TabsTrigger
                      value="seo"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      SEO
                    </TabsTrigger>
                    <TabsTrigger
                      value="accessibility"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                    >
                      Accessibility
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6">
                      {/* Summary */}
                      <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="font-display text-base font-semibold text-foreground mb-4">
                          Audit Summary
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                          <ScoreRing
                            score={selectedAudit.scores!.performance}
                            size="lg"
                            label="Performance"
                          />
                          <ScoreRing
                            score={selectedAudit.scores!.seo}
                            size="lg"
                            label="SEO"
                          />
                          <ScoreRing
                            score={selectedAudit.scores!.accessibility}
                            size="lg"
                            label="Accessibility"
                          />
                          <ScoreRing
                            score={selectedAudit.scores!.bestPractices}
                            size="lg"
                            label="Best Practices"
                          />
                        </div>
                      </div>

                      {/* Chart Placeholder */}
                      <div className="rounded-lg border border-border bg-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-display text-base font-semibold text-foreground">
                            Score Trends
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                            +12% from last audit
                          </div>
                        </div>
                        <div className="h-48 flex items-center justify-center border border-dashed border-border rounded-lg bg-muted/30">
                          <div className="text-center">
                            <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Score trend chart</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="issues" className="mt-6">
                    <IssuesTable
                      issues={selectedAudit.issues || []}
                      expandedIssues={expandedIssues}
                      onToggleIssue={toggleIssue}
                    />
                  </TabsContent>

                  <TabsContent value="performance" className="mt-6">
                    <CategorySection
                      title="Performance Issues"
                      issues={getIssuesByCategory(selectedAudit.issues || [], "performance")}
                      expandedIssues={expandedIssues}
                      onToggleIssue={toggleIssue}
                      emptyMessage="No performance issues detected."
                    />
                  </TabsContent>

                  <TabsContent value="seo" className="mt-6">
                    <CategorySection
                      title="SEO Issues"
                      issues={getIssuesByCategory(selectedAudit.issues || [], "seo")}
                      expandedIssues={expandedIssues}
                      onToggleIssue={toggleIssue}
                      emptyMessage="No SEO issues detected."
                    />
                  </TabsContent>

                  <TabsContent value="accessibility" className="mt-6">
                    <CategorySection
                      title="Accessibility Issues"
                      issues={getIssuesByCategory(selectedAudit.issues || [], "accessibility")}
                      expandedIssues={expandedIssues}
                      onToggleIssue={toggleIssue}
                      emptyMessage="No accessibility issues detected."
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Score Card Component
function ScoreCard({
  icon: Icon,
  label,
  score,
}: {
  icon: typeof Zap;
  label: string;
  score: number;
}) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-[hsl(var(--success))]";
    if (s >= 50) return "text-[hsl(var(--warning))]";
    return "text-destructive";
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className={cn("font-mono text-3xl font-semibold tabular-nums", getScoreColor(score))}>
        {score}
      </div>
    </div>
  );
}

// Issues Table Component
function IssuesTable({
  issues,
  expandedIssues,
  onToggleIssue,
}: {
  issues: AuditIssue[];
  expandedIssues: Set<string>;
  onToggleIssue: (id: string) => void;
}) {
  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
        <p className="text-muted-foreground">No issues found. Great job!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-3">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div className="col-span-1"></div>
          <div className="col-span-2">Severity</div>
          <div className="col-span-5">Issue</div>
          <div className="col-span-2">Page</div>
          <div className="col-span-2">Category</div>
        </div>
      </div>
      <div className="divide-y divide-border">
        {issues.map((issue) => (
          <Collapsible
            key={issue.id}
            open={expandedIssues.has(issue.id)}
            onOpenChange={() => onToggleIssue(issue.id)}
          >
            <CollapsibleTrigger asChild>
              <button className="w-full grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-accent/50 transition-colors text-left">
                <div className="col-span-1">
                  {expandedIssues.has(issue.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="col-span-2">
                  <SeverityBadge severity={issue.severity} />
                </div>
                <div className="col-span-5 text-sm text-foreground truncate">
                  {issue.title}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground font-mono">
                  {issue.page}
                </div>
                <div className="col-span-2 text-xs text-muted-foreground capitalize">
                  {issue.category.replace("-", " ")}
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-4 pl-16">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Recommendation
                  </h4>
                  <p className="text-sm text-foreground">{issue.recommendation}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

// Category Section Component
function CategorySection({
  title,
  issues,
  expandedIssues,
  onToggleIssue,
  emptyMessage,
}: {
  title: string;
  issues: AuditIssue[];
  expandedIssues: Set<string>;
  onToggleIssue: (id: string) => void;
  emptyMessage: string;
}) {
  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 px-6 py-8 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--success))]/10 mb-3">
          <Shield className="h-5 w-5 text-[hsl(var(--success))]" />
        </div>
        <p className="text-sm text-[hsl(var(--success))]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground mb-4">
        {title} ({issues.length})
      </h3>
      <IssuesTable
        issues={issues}
        expandedIssues={expandedIssues}
        onToggleIssue={onToggleIssue}
      />
    </div>
  );
}