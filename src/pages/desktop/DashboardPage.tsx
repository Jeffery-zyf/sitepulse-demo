import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Play, ExternalLink, Globe, Users, Search } from "lucide-react";
import { Navbar } from "@/components/desktop/Navbar";
import { StatusBadge } from "@/components/desktop/StatusBadge";
import { EmptyState } from "@/components/desktop/EmptyState";
import { ErrorBanner } from "@/components/desktop/ErrorBanner";
import { TableSkeleton } from "@/components/desktop/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  createProject,
  getProjects,
  runAudit,
} from "@/lib/api";
import type { Project } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type LoadingState = "loading" | "error" | "empty" | "success";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [runningAudits, setRunningAudits] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async (showLoading = true) => {
      if (showLoading) {
        setLoadingState("loading");
      }
      try {
        const projectsData = await getProjects();
        setProjectList(projectsData);
        setLoadingState(projectsData.length > 0 ? "success" : "empty");
      } catch (error) {
        toast.error("Failed to load projects", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
        setLoadingState("error");
      }
    };
    loadData();
  }, []);

  const filteredProjects = projectList.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectUrl) return;
    
    try {
      const createdProject = await createProject(
        newProjectName,
        newProjectUrl.startsWith("http")
          ? newProjectUrl
          : `https://${newProjectUrl}`
      );
      setProjectList([createdProject, ...projectList]);
      setLoadingState("success");
      setIsCreateDialogOpen(false);
      setNewProjectName("");
      setNewProjectUrl("");
      toast.success("Project created", {
        description: `${createdProject.name} has been added to your projects.`,
      });
    } catch (error) {
      toast.error("Unable to create project", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const handleRunAudit = async (projectId: string, projectName: string) => {
    setRunningAudits((prev) => new Set(prev).add(projectId));
    try {
      await runAudit(projectId);
      toast.success("Audit started", {
        description: `Running audit for ${projectName}...`,
      });
      const refreshed = await getProjects();
      setProjectList(refreshed);
    } catch (error) {
      toast.error("Audit failed to start", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setRunningAudits((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    }
  };

  const handleRetry = () => {
    setLoadingState("loading");
    getProjects()
      .then((projectsData) => {
        setProjectList(projectsData);
        setLoadingState(projectsData.length > 0 ? "success" : "empty");
      })
      .catch((error) => {
        toast.error("Failed to load projects", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
        setLoadingState("error");
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-[1440px] px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and audit your website projects
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new project</DialogTitle>
                <DialogDescription>
                  Add a new website to start running audits.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Website"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-url">Website URL</Label>
                  <Input
                    id="project-url"
                    placeholder="https://example.com"
                    value={newProjectUrl}
                    onChange={(e) => setNewProjectUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={!newProjectName || !newProjectUrl}>
                  Create project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        {loadingState === "success" && projectList.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {/* Content States */}
        {loadingState === "loading" && <TableSkeleton rows={5} columns={6} />}
        
        {loadingState === "error" && (
          <ErrorBanner
            message="Failed to load projects. Please try again."
            onRetry={handleRetry}
          />
        )}
        
        {(loadingState === "empty" || (loadingState === "success" && projectList.length === 0)) && (
          <EmptyState
            icon={Globe}
            title="No projects yet"
            description="Create your first project to start running website audits and tracking performance."
            actionLabel="Create your first project"
            onAction={() => setIsCreateDialogOpen(true)}
          />
        )}
        
        {loadingState === "success" && projectList.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {/* Table Header */}
            <div className="border-b border-border bg-muted/30 px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <div className="col-span-3">Name</div>
                <div className="col-span-3">URL</div>
                <div className="col-span-2">Last Audit</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Members</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-border">
              {filteredProjects.map((project) => {
                const latestAudit = project.latestAudit;
                const isRunning =
                  runningAudits.has(project.id) ||
                  latestAudit?.status === "running" ||
                  latestAudit?.status === "queued";
                const displayStatus = isRunning
                  ? "running"
                  : (latestAudit?.status || "queued");
                
                return (
                  <div
                    key={project.id}
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="col-span-3">
                      <p className="font-medium text-foreground truncate">
                        {project.name}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{project.url.replace(/^https?:\/\//, "")}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-muted-foreground">
                        {latestAudit
                          ? format(new Date(latestAudit.createdAt), "MMM d, yyyy")
                          : "Never"}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <StatusBadge status={displayStatus as any} />
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {project.memberCount ?? 1}
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunAudit(project.id, project.name);
                        }}
                        disabled={isRunning}
                        className={cn(isRunning && "animate-pulse-glow")}
                      >
                        <Play className="mr-1.5 h-3.5 w-3.5" />
                        {isRunning ? "Running..." : "Run Audit"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${project.id}`);
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {loadingState === "success" && projectList.length > 0 && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects match your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
