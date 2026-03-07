"use client";

import { useEffect, useMemo, useState } from "react";

type Booking = {
  id: string;
  customer_name: string;
  size_yards: number;
  delivery_date: string;
  return_date: string;
  status: string;
};

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function loadBookings() {
      const response = await fetch("/api/admin/bookings", {
        cache: "no-store",
      });
      const data = (await response.json()) as Booking[];
      setBookings(data || []);
    }

    loadBookings();
  }, []);

  const upcoming = useMemo(
    () =>
      bookings
        .filter((booking) =>
          ["pending", "scheduled", "in_progress"].includes(booking.status),
        )
        .sort((a, b) => a.delivery_date.localeCompare(b.delivery_date)),
    [bookings],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Calendar</h1>
        <p className="text-[#999999] mt-2">Live delivery and pickup schedule</p>
      </div>

      <div className="bg-[#1A1A1A] border border-[#404040] rounded-lg divide-y divide-[#404040]">
        {upcoming.length === 0 ? (
          <div className="p-8 text-center text-[#999999]">
            No upcoming deliveries or pickups.
          </div>
        ) : (
          upcoming.map((booking) => (
            <div
              key={booking.id}
              className="p-4 flex items-start justify-between gap-4"
            >
              <div>
                <p className="text-white font-semibold">
                  {booking.customer_name}
                </p>
                <p className="text-sm text-[#999999]">
                  {booking.size_yards} Yard • #{booking.id.slice(0, 8)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white">
                  Delivery: {booking.delivery_date}
                </p>
                <p className="text-sm text-[#999999]">
                  Pickup: {booking.return_date}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
