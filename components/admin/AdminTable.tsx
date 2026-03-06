"use client";

import { ReactNode } from "react";

interface TableProps {
  headers: Array<{
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
  }>;
  rows: Array<Record<string, any>>;
  actions?: (row: Record<string, any>) => ReactNode;
  selectable?: boolean;
  loading?: boolean;
}

export function AdminTable({
  headers,
  rows,
  actions,
  selectable = false,
  loading = false,
}: TableProps) {
  if (loading) {
    return (
      <div className="bg-[#1A1A1A] border border-[#404040] rounded-lg p-8 text-center">
        <p className="text-[#999999]">Loading...</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="bg-[#1A1A1A] border border-[#404040] rounded-lg p-8 text-center">
        <p className="text-[#999999]">No data to display</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#404040] rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#404040] bg-[#262626]">
            {selectable && (
              <th className="px-4 py-3 text-left">
                <input type="checkbox" />
              </th>
            )}
            {headers.map((header) => (
              <th
                key={header.key}
                className="px-4 py-3 text-left text-xs font-bold text-[#999999] uppercase tracking-wider"
                style={{ width: header.width }}
              >
                {header.label}
                {header.sortable && <span className="ml-2">↕️</span>}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-left text-xs font-bold text-[#999999] uppercase">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-[#404040] hover:bg-[#262626] transition-colors"
            >
              {selectable && (
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
              )}
              {headers.map((header) => (
                <td
                  key={header.key}
                  className="px-4 py-3 text-sm text-white font-medium"
                  style={{ width: header.width }}
                >
                  {row[header.key] || "—"}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-sm">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface BadgeProps {
  status: "active" | "inactive" | "pending" | "delivered" | "warning";
  label: string;
}

export function StatusBadge({ status, label }: BadgeProps) {
  const colors = {
    active: "bg-success/10 border border-success/30 text-success",
    inactive: "bg-[#999999]/10 border border-[#999999]/30 text-[#999999]",
    pending: "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",
    delivered: "bg-blue-500/10 border border-blue-500/30 text-blue-400",
    warning: "bg-red-500/10 border border-red-500/30 text-red-400",
  }[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors}`}
    >
      {label}
    </span>
  );
}

interface ButtonGroupProps {
  children: ReactNode;
  vertical?: boolean;
}

export function ButtonGroup({ children, vertical = false }: ButtonGroupProps) {
  return (
    <div className={`flex gap-2 ${vertical ? "flex-col" : "flex-row"}`}>
      {children}
    </div>
  );
}

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function AdminButton({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: AdminButtonProps) {
  const baseClass = "font-medium rounded transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary:
      "bg-[#262626] text-white border border-[#404040] hover:bg-[#404040]",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-[#999999] hover:text-white hover:bg-[#262626]",
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
