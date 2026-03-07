"use client";

import { useEffect, useMemo, useState } from "react";
import {
  StatCard,
  DashboardGrid,
} from "@/components/admin/DashboardComponents";
import { AdminTable } from "@/components/admin/AdminTable";

type InventoryRow = {
  id: string;
  name: string;
  total_units: number;
  available_units: number;
  is_active: boolean;
};

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/inventory", {
        cache: "no-store",
      });
      const data = (await response.json()) as InventoryRow[];
      setInventory(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const metrics = useMemo(() => {
    const total = inventory.reduce(
      (sum, row) => sum + Number(row.total_units),
      0,
    );
    const available = inventory.reduce(
      (sum, row) => sum + Number(row.available_units),
      0,
    );
    const inUse = Math.max(0, total - available);
    return { total, available, inUse };
  }, [inventory]);

  const editInventory = async (row: InventoryRow) => {
    const total = prompt("Total units", String(row.total_units));
    if (!total) return;

    const available = prompt("Available units", String(row.available_units));
    if (!available) return;

    await fetch("/api/admin/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...row,
        total_units: Number(total),
        available_units: Number(available),
      }),
    });

    await loadInventory();
  };

  const rows = inventory.map((row) => ({
    ...row,
    total: row.total_units,
    available: row.available_units,
    status: row.is_active ? "active" : "inactive",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Inventory</h1>
        <p className="text-[#999999] mt-2">Live fleet availability</p>
      </div>

      <DashboardGrid cols={4}>
        <StatCard label="Total Units" value={String(metrics.total)} icon="📦" />
        <StatCard
          label="Available"
          value={String(metrics.available)}
          icon="✅"
        />
        <StatCard label="In Use" value={String(metrics.inUse)} icon="🚚" />
        <StatCard label="Maintenance" value="0" icon="🔧" />
      </DashboardGrid>

      <AdminTable
        loading={loading}
        headers={[
          { key: "name", label: "Size" },
          { key: "total", label: "Total Units" },
          { key: "available", label: "Available" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
        actions={(row) => (
          <button
            onClick={() => editInventory(row as InventoryRow)}
            className="text-primary hover:text-primary-light text-sm font-medium"
          >
            Manage
          </button>
        )}
      />
    </div>
  );
}
