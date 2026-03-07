import { NextResponse } from "next/server";
import {
  getPricingConfig,
  setPricingConfig,
  type PricingItem,
} from "@/lib/admin/config";

export async function GET() {
  try {
    const pricing = await getPricingConfig();
    return NextResponse.json(pricing);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load pricing" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as PricingItem;
    const pricing = await getPricingConfig();

    const updated = pricing.map((item) =>
      item.id === body.id
        ? {
            ...item,
            name: body.name,
            size_yards: Number(body.size_yards),
            price_base: Number(body.price_base),
            price_per_day: Number(body.price_per_day),
            is_active: Boolean(body.is_active),
          }
        : item,
    );

    await setPricingConfig(updated);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update pricing" },
      { status: 500 },
    );
  }
}
