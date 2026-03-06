"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: { value: number; isPositive: boolean };
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#1A1A1A] border border-[#404040] rounded-lg p-6 ${
        onClick
          ? "cursor-pointer hover:border-primary/50 transition-colors"
          : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-[#999999]">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      {trend && (
        <p
          className={`text-xs font-semibold ${trend.isPositive ? "text-success" : "text-red-500"}`}
        >
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last
          period
        </p>
      )}
    </div>
  );
}

interface DashboardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function DashboardGrid({ children, cols = 4 }: DashboardGridProps) {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[cols];

  return <div className={`grid gap-6 ${colClass}`}>{children}</div>;
}

interface AlertProps {
  type: "info" | "success" | "warning" | "error";
  message: string;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
}

export function Alert({ type, message, action, dismissible }: AlertProps) {
  const bgColor = {
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    success: "bg-success/10 border-success/30 text-success",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
  }[type];

  return (
    <div
      className={`border rounded-lg p-4 flex items-center justify-between ${bgColor}`}
    >
      <p className="text-sm font-medium">{message}</p>
      <div className="flex items-center gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-semibold underline hover:opacity-80 transition-opacity"
          >
            {action.label}
          </button>
        )}
        {dismissible && (
          <button className="text-lg opacity-60 hover:opacity-100 transition-opacity">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
