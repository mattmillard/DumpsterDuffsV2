"use client";

import {
  StatCard,
  DashboardGrid,
} from "@/components/admin/DashboardComponents";
import { AdminTable, AdminButton } from "@/components/admin/AdminTable";

export default function AdminInventoryPage() {
  const sizes = [
    { name: "10 Yard", total: 8, available: 6, status: "active" },
    { name: "15 Yard", total: 12, available: 9, status: "active" },
    { name: "20 Yard", total: 6, available: 4, status: "active" },
    { name: "30 Yard", total: 4, available: 3, status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Inventory</h1>
          <p className="text-[#999999] mt-2">
            Track dumpster units and availability
          </p>
        </div>
        <AdminButton variant="primary">+ Add Unit</AdminButton>
      </div>

      <DashboardGrid cols={4}>
        <StatCard label="Total Units" value="30" icon="📦" />
        <StatCard label="Available" value="22" icon="✅" />
        <StatCard label="In Use" value="8" icon="🚚" />
        <StatCard label="Maintenance" value="0" icon="🔧" />
      </DashboardGrid>

      <AdminTable
        headers={[
          { key: "name", label: "Size" },
          { key: "total", label: "Total Units" },
          { key: "available", label: "Available" },
          { key: "status", label: "Status" },
        ]}
        rows={sizes}
        actions={() => (
          <div className="flex gap-2">
            <a
              href="#"
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              Manage
            </a>
          </div>
        )}
      />
    </div>
  );
}
