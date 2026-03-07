"use client";

import { ReactNode } from "react";

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  pressable?: boolean;
}

export function MobileCard({
  children,
  className = "",
  onClick,
  pressable = false,
}: MobileCardProps) {
  const baseStyles =
    "rounded-lg bg-[#1A1A1A] border border-[#404040] overflow-hidden";
  const pressableStyles = pressable
    ? "active:bg-[#262626] active:border-[#FF8C00] transition-all"
    : "";

  return (
    <div
      className={`${baseStyles} ${pressableStyles} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface StatBarProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: ReactNode;
    color?: "default" | "success" | "warning" | "danger";
  }>;
}

export function StatBar({ stats }: StatBarProps) {
  const colorMap = {
    default: "text-[#FF8C00]",
    success: "text-[#4ADE80]",
    warning: "text-yellow-500",
    danger: "text-red-500",
  };

  return (
    <MobileCard>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#404040]">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#1A1A1A] p-3 flex flex-col gap-1">
            <span className="text-xs text-[#999999] font-medium">
              {stat.label}
            </span>
            <div className="flex items-baseline gap-1">
              {stat.icon && <span className="text-lg">{stat.icon}</span>}
              <span
                className={`text-lg font-bold ${colorMap[stat.color || "default"]}`}
              >
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </MobileCard>
  );
}

interface ActionButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ActionButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  className = "",
}: ActionButtonProps) {
  const variantStyles = {
    primary: "bg-[#FF8C00] text-white active:bg-[#FF8C00]/80",
    secondary: "bg-[#262626] text-white active:bg-[#404040]",
    danger: "bg-red-600 text-white active:bg-red-700",
    ghost:
      "bg-transparent text-[#FF8C00] border border-[#FF8C00] active:bg-[#FF8C00]/10",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base min-h-[44px]",
    lg: "px-4 py-4 text-base min-h-[52px]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg font-medium transition-all active:scale-95
        flex items-center justify-center gap-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

interface StatusBadgeProps {
  status:
    | "pending"
    | "scheduled"
    | "active"
    | "completed"
    | "cancelled"
    | "warning";
  children: ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const styleMap = {
    pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    scheduled: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    active: "bg-green-500/20 text-[#4ADE80] border border-green-500/30",
    completed: "bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30",
    cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
    warning: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${styleMap[status]}`}
    >
      {children}
    </span>
  );
}
