"use client";

import {
  StatCard,
  DashboardGrid,
} from "@/components/admin/DashboardComponents";

export default function AdminCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Calendar</h1>
        <p className="text-[#999999] mt-2">
          View deliveries and pickups for your fleet
        </p>
      </div>

      <div className="bg-[#1A1A1A] border border-[#404040] rounded-lg p-12 text-center">
        <p className="text-[#999999] mb-4">Calendar view coming soon</p>
        <p className="text-sm text-[#999999]">
          Integration with calendar libraries in progress. For now, use the
          Bookings section to manage schedules.
        </p>
      </div>
    </div>
  );
}
