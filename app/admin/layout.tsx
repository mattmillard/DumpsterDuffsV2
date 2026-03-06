"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileHeader } from "@/components/admin-mobile/MobileHeader";
import { MobileBottomNav } from "@/components/admin-mobile/MobileBottomNav";
import { getCurrentAdminUser } from "@/lib/auth/admin";
import { AdminUser } from "@/types/admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const adminUser = await getCurrentAdminUser();

        if (!adminUser) {
          router.push("/admin/login");
          return;
        }

        setUser(adminUser);
      } catch (err) {
        console.error("Auth error:", err);
        setError("Authentication failed");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#404040] border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#999999]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/" className="text-primary hover:text-primary-light">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/bookings", label: "Orders", icon: "📋" },
    { href: "/admin/calendar", label: "Schedule", icon: "📅" },
    { href: "/admin/inventory", label: "Inventory", icon: "📦" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col md:flex-row">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile Header */}
        <MobileHeader
          title="Operations"
          userName={user.full_name || user.email}
          userRole={user.role}
        />

        {/* Page content - with safe padding for bottom nav */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileBottomNav items={navItems} />
    </div>
  );
}
