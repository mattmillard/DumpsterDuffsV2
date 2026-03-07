"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MobileCard,
  StatBar,
  ActionButton,
  StatusBadge,
} from "@/components/admin-mobile/MobileComponents";
import { DashboardMetrics, DashboardAlert } from "@/types/admin";

type RecentBooking = {
  booking_number: string;
  customer: string;
  size: string;
  delivery_date: string;
  status: string;
  total: number;
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    async function loadDashboard() {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });
      const data = await response.json();
      setMetrics(data.metrics || null);
      setAlerts(data.alerts || []);
      setRecentBookings(data.recentBookings || []);
    }

    loadDashboard();
  }, []);

  const visibleAlerts = useMemo(
    () => alerts.filter((alert) => !dismissedAlerts.has(alert.id)),
    [alerts, dismissedAlerts],
  );

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  if (!metrics) {
    return <div className="text-[#999999]">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4">
      {visibleAlerts.length > 0 && (
        <div className="space-y-2">
          {visibleAlerts.map((alert) => (
            <MobileCard key={alert.id} className="overflow-hidden">
              <div
                className={`p-3 border-l-4 flex items-start justify-between gap-3 ${
                  alert.type === "warning"
                    ? "bg-red-500/10 border-red-500"
                    : "bg-blue-500/10 border-blue-500"
                }`}
              >
                <p className="text-sm font-medium text-white">
                  {alert.message}
                </p>
                {alert.dismissable && (
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="text-[#999999] active:text-white flex-shrink-0"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                )}
              </div>
              {alert.action_link && (
                <div className="px-3 py-2 bg-[#0F0F0F] border-t border-[#404040]">
                  <Link
                    href={alert.action_link}
                    className="text-[#FF8C00] text-sm font-medium hover:text-[#FFA800]"
                  >
                    {alert.action} →
                  </Link>
                </div>
              )}
            </MobileCard>
          ))}
        </div>
      )}

      <StatBar
        stats={[
          {
            label: "Today's Orders",
            value: metrics.total_bookings_today,
            icon: "📋",
            color: "default",
          },
          {
            label: "Revenue",
            value: `$${Math.round(metrics.revenue_today)}`,
            icon: "💰",
            color: "success",
          },
          {
            label: "In Delivery",
            value: metrics.pending_deliveries,
            icon: "🚚",
            color: "warning",
          },
          {
            label: "Available",
            value: metrics.available_dumpsters,
            icon: "📦",
            color: "default",
          },
        ]}
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          <Link
            href="/admin/bookings"
            className="text-[#FF8C00] text-sm font-medium"
          >
            All →
          </Link>
        </div>

        <div className="space-y-2">
          {recentBookings.map((booking) => (
            <MobileCard key={booking.booking_number}>
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {booking.customer}
                    </p>
                    <p className="text-xs text-[#999999]">
                      {booking.size} • {booking.booking_number}
                    </p>
                  </div>
                  <StatusBadge
                    status={
                      booking.status === "completed"
                        ? "completed"
                        : ("scheduled" as any)
                    }
                  >
                    {booking.status}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#404040]">
                  <span className="text-xs text-[#999999]">
                    {booking.delivery_date}
                  </span>
                  <span className="text-sm font-bold text-[#FF8C00]">
                    ${Number(booking.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      <StatBar
        stats={[
          {
            label: "This Month Orders",
            value: metrics.total_bookings_this_month,
            icon: "📊",
            color: "default",
          },
          {
            label: "Monthly Revenue",
            value: `$${Math.round(metrics.revenue_this_month / 1000)}k`,
            icon: "💵",
            color: "success",
          },
          {
            label: "Pending Payments",
            value: metrics.pending_payments,
            icon: "⏳",
            color: "warning",
          },
          {
            label: "Completed",
            value: metrics.completed_pickups,
            icon: "✓",
            color: "success",
          },
        ]}
      />

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[#999999] uppercase tracking-wide px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/admin/bookings">
            <ActionButton variant="primary" fullWidth>
              Bookings
            </ActionButton>
          </Link>
          <Link href="/admin/calendar">
            <ActionButton variant="secondary" fullWidth>
              Schedule
            </ActionButton>
          </Link>
          <Link href="/admin/inventory">
            <ActionButton variant="secondary" fullWidth>
              Inventory
            </ActionButton>
          </Link>
          <Link href="/admin/zones">
            <ActionButton variant="secondary" fullWidth>
              Service Areas
            </ActionButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
