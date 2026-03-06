"use client";

import { AdminTable, AdminButton } from "@/components/admin/AdminTable";

export default function AdminZonesPage() {
  const zones = [
    {
      name: "Columbia Metro",
      type: "Zipcode",
      fee: "$49.99",
      status: "active",
    },
    {
      name: "Jefferson City Area",
      type: "Zipcode",
      fee: "$59.99",
      status: "active",
    },
    {
      name: "Extended Service",
      type: "Radius",
      fee: "$89.99",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Service Zones</h1>
          <p className="text-[#999999] mt-2">
            Configure delivery zones and pricing
          </p>
        </div>
        <AdminButton variant="primary">+ New Zone</AdminButton>
      </div>

      <AdminTable
        headers={[
          { key: "name", label: "Zone Name" },
          { key: "type", label: "Type" },
          { key: "fee", label: "Delivery Fee" },
          { key: "status", label: "Status" },
        ]}
        rows={zones}
        actions={() => (
          <div className="flex gap-2">
            <a
              href="#"
              className="text-primary hover:text-primary-light text-sm font-medium"
            >
              Edit
            </a>
          </div>
        )}
      />
    </div>
  );
}
