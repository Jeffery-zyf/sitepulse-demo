import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

type Status = "queued" | "running" | "done" | "failed";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; icon: typeof Clock; className: string }> = {
  queued: {
    label: "Queued",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
  running: {
    label: "Running",
    icon: Loader2,
    className: "bg-primary/10 text-primary border-primary/30 animate-pulse-glow",
  },
  done: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        config.className,
        className
      )}
    >
      <Icon className={cn("h-3 w-3", status === "running" && "animate-spin")} />
      {config.label}
    </span>
  );
}