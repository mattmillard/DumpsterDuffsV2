"use client";

import {
  AdminTable,
  StatusBadge,
  AdminButton,
} from "@/components/admin/AdminTable";

export default function AdminBookingsPage() {
  const bookings = [
    {
      booking_number: "#20240305-001",
      customer: "John Smith",
      phone: "(555) 123-4567",
      size: "15 Yard",
      delivery: "2024-03-06",
      pickup: "2024-03-13",
      total: "$349.99",
      status: "scheduled",
    },
    {
      booking_number: "#20240305-002",
      customer: "Jane Johnson",
      phone: "(555) 234-5678",
      size: "20 Yard",
      delivery: "2024-03-07",
      pickup: "2024-03-14",
      total: "$449.99",
      status: "pending",
    },
    {
      booking_number: "#20240305-003",
      customer: "Bob Wilson",
      phone: "(555) 345-6789",
      size: "10 Yard",
      delivery: "2024-03-06",
      pickup: "2024-03-13",
      total: "$299.99",
      status: "delivered",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Bookings</h1>
          <p className="text-[#999999] mt-2">
            Manage and track all customer dumpster rental bookings
          </p>
        </div>
        <AdminButton variant="primary">+ New Booking</AdminButton>
      </div>

      {/* Filters */}
      <div className="bg-[#1A1A1A] border border-[#404040] rounded-lg p-4 flex flex-col md:flex-row gap-4">
        <input
          type="search"
          placeholder="Search by booking #, customer, or phone..."
          className="input-field flex-1"
        />
        <select className="input-field w-full md:w-48">
          <option>All Status</option>
          <option>Pending</option>
          <option>Scheduled</option>
          <option>Delivered</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Table */}
      <AdminTable
        headers={[
          { key: "booking_number", label: "Booking #" },
          { key: "customer", label: "Customer" },
          { key: "size", label: "Size" },
          { key: "delivery", label: "Delivery Date" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
        ]}
        rows={bookings}
        actions={(row) => (
          <div className="flex gap-2">
            <a
              href={`#`}
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              View
            </a>
            <a
              href={`#`}
              className="text-[#999999] hover:text-white text-sm font-medium"
            >
              Edit
            </a>
          </div>
        )}
      />
    </div>
  );
}
