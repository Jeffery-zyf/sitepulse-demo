import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeConfig = {
  sm: { dimension: 60, strokeWidth: 4, fontSize: "text-lg" },
  md: { dimension: 80, strokeWidth: 5, fontSize: "text-2xl" },
  lg: { dimension: 120, strokeWidth: 6, fontSize: "text-4xl" },
};

function getScoreColor(score: number): string {
  if (score >= 90) return "hsl(var(--success))";
  if (score >= 50) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

function getScoreGlow(score: number): string {
  if (score >= 90) return "drop-shadow(0 0 8px hsl(var(--success) / 0.5))";
  if (score >= 50) return "drop-shadow(0 0 8px hsl(var(--warning) / 0.5))";
  return "drop-shadow(0 0 8px hsl(var(--destructive) / 0.5))";
}

export function ScoreRing({ score, size = "md", label, className }: ScoreRingProps) {
  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const glow = getScoreGlow(score);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: config.dimension, height: config.dimension }}>
        <svg
          className="transform -rotate-90"
          width={config.dimension}
          height={config.dimension}
          style={{ filter: glow }}
        >
          {/* Background circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={config.strokeWidth}
          />
          {/* Score circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="animate-score-fill"
            style={{
              "--score-offset": strokeDashoffset,
            } as React.CSSProperties}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn("font-mono font-medium tabular-nums", config.fontSize)}
            style={{ color }}
          >
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
}