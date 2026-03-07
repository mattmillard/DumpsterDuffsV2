"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface MobileBottomNavProps {
  items: NavItem[];
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A1A] border-t border-[#404040] md:hidden safe-bottom">
      <div className="flex justify-around items-stretch">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const activeClass = isActive
            ? "text-[#FF8C00] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#FF8C00]"
            : "text-[#999999] hover:text-white";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 relative transition-colors active:bg-[#262626] ${activeClass}`}
              aria-label={item.label}
            >
              <span className="w-6 h-6 flex items-center justify-center text-lg">
                {item.icon}
              </span>
              <span className="text-xs font-medium text-center truncate">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
