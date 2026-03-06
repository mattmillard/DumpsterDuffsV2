"use client";

import { AdminTable, AdminButton } from "@/components/admin/AdminTable";

export default function AdminPricingPage() {
  const pricing = [
    { size: "10 Yard", base: "$299.99", extra_day: "$25.00", status: "active" },
    { size: "15 Yard", base: "$349.99", extra_day: "$30.00", status: "active" },
    { size: "20 Yard", base: "$449.99", extra_day: "$40.00", status: "active" },
    { size: "30 Yard", base: "$599.99", extra_day: "$50.00", status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Pricing</h1>
          <p className="text-[#999999] mt-2">Manage rates for dumpster sizes</p>
        </div>
        <AdminButton variant="primary">Update Pricing</AdminButton>
      </div>

      <AdminTable
        headers={[
          { key: "size", label: "Dumpster Size" },
          { key: "base", label: "Base Rental (7 days)" },
          { key: "extra_day", label: "Extra Day" },
          { key: "status", label: "Status" },
        ]}
        rows={pricing}
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
