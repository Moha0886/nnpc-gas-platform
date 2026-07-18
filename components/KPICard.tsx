import { LucideIcon, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "accent" | "flare" | "alert" | "success";
  className?: string;
  status?: "loading" | "error" | "stale" | "live";
  lastUpdated?: string;
  threshold?: {
    target: number;
    tolerance: number;
  };
  contextText?: string;
  onClick?: () => void;
}

export default function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color = "primary",
  className,
  status = "live",
  lastUpdated,
  threshold,
  contextText,
  onClick,
}: KPICardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    flare: "bg-flare/10 text-flare",
    alert: "bg-alert/10 text-alert",
    success: "bg-success/10 text-success",
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className={cn("kpi-card animate-fade-in", className)}>
        <div className="flex items-start gap-4">
          <div className="skeleton w-12 h-12 rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-8 w-24"></div>
            <div className="skeleton h-3 w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className={cn("kpi-card border-alert/30 bg-alert/5", className)}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-alert/10 text-alert">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink/60 mb-2">{title}</p>
            <p className="text-sm text-alert">Failed to load data</p>
            <button className="text-xs text-primary hover:underline mt-2">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine threshold status color
  let thresholdColor = color;
  if (threshold && typeof value === 'number') {
    const numValue = parseFloat(value.toString());
    if (numValue <= threshold.target) {
      thresholdColor = "success";
    } else if (numValue <= threshold.target + threshold.tolerance) {
      thresholdColor = "flare";
    } else {
      thresholdColor = "alert";
    }
  }

  return (
    <div
      className={cn(
        "kpi-card group animate-fade-in",
        onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
        status === "stale" && "border-flare/30 bg-flare/5",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon - moved to left for better scannability */}
        <div className={cn(
          "p-3 rounded-lg transition-all",
          colorClasses[thresholdColor],
          onClick && "group-hover:scale-110"
        )}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with status indicator */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-ink/60">{title}</p>
            {status === "live" && (
              <span className="flex items-center gap-1 text-xs text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                Live
              </span>
            )}
            {status === "stale" && (
              <span className="flex items-center gap-1 text-xs text-flare">
                <RefreshCw className="w-3 h-3" />
                Stale
              </span>
            )}
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-3xl font-bold text-ink tabular-nums truncate">
              {value}
            </h3>
            {unit && <span className="text-lg text-ink/60">{unit}</span>}
          </div>

          {/* Trend */}
          {trend && (
            <div className="flex items-center gap-1.5 mb-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-alert" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-alert"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-ink/60">vs last gas day</span>
            </div>
          )}

          {/* Context text */}
          {contextText && (
            <p className="text-xs text-ink/60 mt-1">{contextText}</p>
          )}

          {/* Last updated */}
          {lastUpdated && (
            <p className="text-xs text-ink/50 mt-2">
              Updated {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
