import { LucideIcon } from "lucide-react";
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
  color?: "pine" | "gasblue" | "flare" | "alert";
  className?: string;
}

export default function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color = "pine",
  className,
}: KPICardProps) {
  const colorClasses = {
    pine: "bg-pine/10 text-pine",
    gasblue: "bg-gasblue/10 text-gasblue",
    flare: "bg-flare/10 text-flare",
    alert: "bg-alert/10 text-alert",
  };

  return (
    <div className={cn("kpi-card", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-ink/60 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-ink tabular-nums">{value}</h3>
            {unit && <span className="text-lg text-ink/60">{unit}</span>}
          </div>

          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-pine" : "text-alert"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-sm text-ink/60">vs last gas day</span>
            </div>
          )}
        </div>

        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
