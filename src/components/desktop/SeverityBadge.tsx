import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

type Severity = "critical" | "warning" | "info";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<Severity, { label: string; icon: typeof AlertCircle; className: string }> = {
  critical: {
    label: "Critical",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    className: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30",
  },
  info: {
    label: "Info",
    icon: Info,
    className: "bg-primary/10 text-primary border-primary/30",
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}