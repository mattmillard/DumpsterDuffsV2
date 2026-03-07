"use client";

import { useEffect, useState } from "react";
import { AdminTable, AdminButton } from "@/components/admin/AdminTable";

type Zone = {
  id: string;
  name: string;
  zone_type: string;
  delivery_fee: number;
  is_active: boolean;
};

export default function AdminZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const loadZones = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/zones", { cache: "no-store" });
      const data = (await response.json()) as Zone[];
      setZones(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const createZone = async () => {
    const name = prompt("Zone name", "New Zone");
    if (!name) return;

    const zoneType = prompt("Type (Zipcode or Radius)", "Zipcode") || "Zipcode";
    const fee = prompt("Delivery fee", "49.99");
    if (!fee) return;

    await fetch("/api/admin/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        zone_type: zoneType,
        delivery_fee: Number(fee),
        is_active: true,
      }),
    });

    await loadZones();
  };

  const editZone = async (zone: Zone) => {
    const name = prompt("Zone name", zone.name);
    if (!name) return;

    const fee = prompt("Delivery fee", String(zone.delivery_fee));
    if (!fee) return;

    await fetch("/api/admin/zones", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...zone,
        name,
        delivery_fee: Number(fee),
      }),
    });

    await loadZones();
  };

  const toggleZone = async (zone: Zone) => {
    await fetch("/api/admin/zones", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...zone, is_active: !zone.is_active }),
    });

    await loadZones();
  };

  const deleteZone = async (zone: Zone) => {
    const confirmed = confirm(`Delete ${zone.name}?`);
    if (!confirmed) return;

    await fetch("/api/admin/zones", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: zone.id }),
    });

    await loadZones();
  };

  const rows = zones.map((zone) => ({
    ...zone,
    type: zone.zone_type,
    fee: `$${Number(zone.delivery_fee).toFixed(2)}`,
    status: zone.is_active ? "active" : "inactive",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Service Zones</h1>
          <p className="text-[#999999] mt-2">Live delivery zones and fees</p>
        </div>
        <AdminButton variant="primary" onClick={createZone}>
          + New Zone
        </AdminButton>
      </div>

      <AdminTable
        loading={loading}
        headers={[
          { key: "name", label: "Zone Name" },
          { key: "type", label: "Type" },
          { key: "fee", label: "Delivery Fee" },
          { key: "status", label: "Status" },
        ]}
        rows={rows}
        actions={(row) => (
          <div className="flex gap-3">
            <button
              onClick={() => editZone(row as Zone)}
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => toggleZone(row as Zone)}
              className="text-[#999999] hover:text-white text-sm font-medium"
            >
              {row.is_active ? "Disable" : "Enable"}
            </button>
            <button
              onClick={() => deleteZone(row as Zone)}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}
