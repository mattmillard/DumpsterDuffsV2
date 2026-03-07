"use client";

import { useEffect, useState } from "react";
import { AdminTable, AdminButton } from "@/components/admin/AdminTable";

type PricingItem = {
  id: string;
  name: string;
  size_yards: number;
  price_base: number;
  price_per_day: number;
  is_active: boolean;
};

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPricing = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/pricing", { cache: "no-store" });
      const data = (await response.json()) as PricingItem[];
      setPricing(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const updatePrice = async (item: PricingItem) => {
    const base = prompt("Base price", String(item.price_base));
    if (base === null) return;

    const extra = prompt("Extra day price", String(item.price_per_day));
    if (extra === null) return;

    await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        price_base: Number(base),
        price_per_day: Number(extra),
      }),
    });

    await loadPricing();
  };

  const toggleActive = async (item: PricingItem) => {
    await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, is_active: !item.is_active }),
    });

    await loadPricing();
  };

  const rows = pricing.map((item) => ({
    ...item,
    size: item.name,
    base: `$${Number(item.price_base).toFixed(2)}`,
    extra_day: `$${Number(item.price_per_day).toFixed(2)}`,
    status: item.is_active ? "active" : "inactive",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Pricing</h1>
          <p className="text-[#999999] mt-2">Live rates used sitewide</p>
        </div>
        <AdminButton variant="secondary" onClick={loadPricing}>
          Refresh
        </AdminButton>
      </div>

      <AdminTable
        loading={loading}
        headers={[
          { key: "size", label: "Dumpster Size" },
          { key: "base", label: "Base Rental (3 days)" },
          { key: "extra_day", label: "Extra Day" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
        actions={(row) => (
          <div className="flex gap-3">
            <button
              onClick={() => updatePrice(row as PricingItem)}
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => toggleActive(row as PricingItem)}
              className="text-[#999999] hover:text-white text-sm font-medium"
            >
              {row.is_active ? "Disable" : "Enable"}
            </button>
          </div>
        )}
      />
    </div>
  );
}
