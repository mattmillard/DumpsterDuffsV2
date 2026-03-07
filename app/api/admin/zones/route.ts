import { NextResponse } from "next/server";
import {
  getZonesConfig,
  setZonesConfig,
  type ServiceZone,
} from "@/lib/admin/config";

export async function GET() {
  try {
    const zones = await getZonesConfig();
    return NextResponse.json(zones);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load zones" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ServiceZone>;
    const zones = await getZonesConfig();

    const newZone: ServiceZone = {
      id: crypto.randomUUID(),
      name: body.name || "New Zone",
      zone_type: body.zone_type || "Zipcode",
      delivery_fee: Number(body.delivery_fee || 0),
      is_active: body.is_active ?? true,
    };

    const updated = [newZone, ...zones];
    await setZonesConfig(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create zone" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as ServiceZone;
    const zones = await getZonesConfig();

    const updated = zones.map((zone) =>
      zone.id === body.id
        ? {
            ...zone,
            name: body.name,
            zone_type: body.zone_type,
            delivery_fee: Number(body.delivery_fee),
            is_active: Boolean(body.is_active),
          }
        : zone,
    );

    await setZonesConfig(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update zone" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = (await request.json()) as { id: string };
    const zones = await getZonesConfig();
    const updated = zones.filter((zone) => zone.id !== id);

    await setZonesConfig(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete zone" },
      { status: 500 },
    );
  }
}
