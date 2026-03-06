"use client";

import { AdminUser } from "@/types/admin";

interface AdminHeaderProps {
  user?: AdminUser;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AdminHeader({ user, title, breadcrumbs }: AdminHeaderProps) {
  return (
    <header className="bg-[#1A1A1A] border-b border-[#404040] px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex gap-2 text-xs text-[#999999] mb-2">
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {idx > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {title || "Dashboard"}
          </h1>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user.full_name}</p>
              <p className="text-xs text-[#999999]">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
