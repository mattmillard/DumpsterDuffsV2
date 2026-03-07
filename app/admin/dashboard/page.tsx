"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MobileCard,
  StatBar,
  ActionButton,
  StatusBadge,
} from "@/components/admin-mobile/MobileComponents";
import { DashboardMetrics, DashboardAlert } from "@/types/admin";

// Mock data - will be replaced with real Supabase queries
const MOCK_METRICS: DashboardMetrics = {
  total_bookings_today: 12,
  total_bookings_this_month: 287,
  pending_payments: 3,
  pending_deliveries: 8,
  completed_pickups: 24,
  revenue_today: 2850.0,
  revenue_this_month: 54320.0,
  available_dumpsters: 18,
};

const MOCK_ALERTS: DashboardAlert[] = [
  {
    id: "1",
    type: "warning",
    message: "Booking #20240305-001 pending payment",
    action: "View Booking",
    action_link: "/admin/bookings/1",
    dismissable: true,
  },
  {
    id: "2",
    type: "info",
    message: "Unit #D-015 maintenance due soon",
    action: "Schedule",
    action_link: "/admin/inventory",
    dismissable: true,
  },
];

const MOCK_RECENT_BOOKINGS = [
  {
    booking_number: "#001",
    customer: "John Smith",
    size: "15 Yard",
    delivery_date: "Today",
    status: "active",
    total: "$349.99",
  },
  {
    booking_number: "#002",
    customer: "Jane Johnson",
    size: "20 Yard",
    delivery_date: "Tomorrow",
    status: "scheduled",
    total: "$449.99",
  },
  {
    booking_number: "#003",
    customer: "Bob Wilson",
    size: "10 Yard",
    delivery_date: "Today",
    status: "active",
    total: "$299.99",
  },
];

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(MOCK_METRICS);
  const [alerts, setAlerts] = useState<DashboardAlert[]>(MOCK_ALERTS);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(),
  );

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));

  return (
    <div className="space-y-4">
      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-2">
          {visibleAlerts.map((alert) => (
            <MobileCard key={alert.id} className="overflow-hidden">
              <div
                className={`p-3 border-l-4 flex items-start justify-between gap-3 ${
                  alert.type === "warning"
                    ? "bg-red-500/10 border-red-500"
                    : alert.type === "error"
                      ? "bg-red-500/10 border-red-500"
                      : "bg-blue-500/10 border-blue-500"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      alert.type === "warning"
                        ? "text-red-400"
                        : alert.type === "error"
                          ? "text-red-400"
                          : "text-blue-400"
                    }`}
                  >
                    {alert.message}
                  </p>
                </div>
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

      {/* Today's Quick Stats */}
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
            value: `$${Math.round(metrics.revenue_today / 100)}`,
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

      {/* Recent Bookings Card */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Active Orders</h2>
          <Link
            href="/admin/bookings"
            className="text-[#FF8C00] text-sm font-medium"
          >
            All →
          </Link>
        </div>

        <div className="space-y-2">
          {MOCK_RECENT_BOOKINGS.map((booking) => (
            <MobileCard
              key={booking.booking_number}
              pressable
              onClick={() => {}}
            >
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
                  <StatusBadge status={booking.status as any}>
                    {booking.status === "active"
                      ? "Active"
                      : booking.status === "scheduled"
                        ? "Scheduled"
                        : "Completed"}
                  </StatusBadge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#404040]">
                  <span className="text-xs text-[#999999]">
                    {booking.delivery_date}
                  </span>
                  <span className="text-sm font-bold text-[#FF8C00]">
                    {booking.total}
                  </span>
                </div>
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Monthly Summary Card */}
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

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[#999999] uppercase tracking-wide px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/admin/bookings">
            <ActionButton variant="primary" fullWidth>
              + New Order
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

      {/* Help Section */}
      <MobileCard className="bg-[#262626]/50">
        <div className="p-4 space-y-3">
          <div>
            <p className="text-sm font-bold text-white">Documentation</p>
            <p className="text-xs text-[#999999] mt-1">View guides and FAQs</p>
          </div>
          <ActionButton variant="ghost" size="sm" fullWidth>
            Learn More →
          </ActionButton>
        </div>
      </MobileCard>
    </div>
  );
}
