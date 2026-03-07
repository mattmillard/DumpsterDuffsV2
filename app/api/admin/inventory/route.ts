import { NextResponse } from "next/server";
import {
  getInventoryConfig,
  setInventoryConfig,
  type InventoryItem,
} from "@/lib/admin/config";

export async function GET() {
  try {
    const inventory = await getInventoryConfig();
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load inventory" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as InventoryItem;
    const inventory = await getInventoryConfig();

    const updated = inventory.map((item) =>
      item.id === body.id
        ? {
            ...item,
            name: body.name,
            total_units: Number(body.total_units),
            available_units: Number(body.available_units),
            is_active: Boolean(body.is_active),
          }
        : item,
    );

    await setInventoryConfig(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const inventory = await getInventoryConfig();
    const filtered = inventory.filter((item) => item.id !== id);

    await setInventoryConfig(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete inventory" },
      { status: 500 },
    );
  }
}
