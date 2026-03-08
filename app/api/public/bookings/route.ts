import { NextResponse } from "next/server";
import {
  evaluateBlacklist,
  getBookabilityForDate,
} from "@/lib/admin/bookingOperations";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CreateBookingPayload = {
  delivery_date: string;
  pickup_date: string;
  rental_duration_days: number;
  size_yards: number;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company?: string;
  delivery_address_line_1: string;
  delivery_address_line_2?: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zip: string;
  placement_notes?: string;
  total: number;
};

function formatBookingNumber(bookingId: string) {
  return `DD-${bookingId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

async function sendConfirmationEmail(params: {
  to: string;
  customerName: string;
  bookingNumber: string;
  deliveryDate: string;
  pickupDate: string;
  total: number;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return {
      sent: false,
      reason:
        "Email provider is not configured (set RESEND_API_KEY and BOOKING_FROM_EMAIL).",
    };
  }

  const subject = `Booking Confirmed: ${params.bookingNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2>Booking Confirmed</h2>
      <p>Hi ${params.customerName},</p>
      <p>Your dumpster booking has been confirmed.</p>
      <p><strong>Booking #:</strong> ${params.bookingNumber}<br/>
      <strong>Delivery Date:</strong> ${params.deliveryDate}<br/>
      <strong>Pickup Date:</strong> ${params.pickupDate}<br/>
      <strong>Total:</strong> $${Number(params.total).toFixed(2)}</p>
      <p>Thank you for choosing Dumpster Duff's.</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [params.to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email send failed: ${body}`);
  }

  return { sent: true };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateBookingPayload;

    if (
      !payload.delivery_date ||
      !payload.pickup_date ||
      !payload.size_yards ||
      !payload.customer_full_name ||
      !payload.customer_email ||
      !payload.customer_phone ||
      !payload.delivery_address_line_1 ||
      !payload.delivery_city ||
      !payload.delivery_state ||
      !payload.delivery_zip
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 },
      );
    }

    const blacklistResult = await evaluateBlacklist({
      phone: payload.customer_phone,
      email: payload.customer_email,
      name: payload.customer_full_name,
      address: payload.delivery_address_line_1,
    });

    if (blacklistResult.blocked) {
      return NextResponse.json(
        {
          error:
            blacklistResult.reason ||
            "We cannot accept bookings from this contact at this time.",
        },
        { status: 403 },
      );
    }

    const availability = await getBookabilityForDate(payload.delivery_date);
    if (availability.setupRequired) {
      return NextResponse.json(
        { error: "Booking system setup is incomplete" },
        { status: 503 },
      );
    }

    const sizeAvailability = availability.sizes.find(
      (size) => size.size_yards === Number(payload.size_yards),
    );

    if (!sizeAvailability || !sizeAvailability.isBookable) {
      return NextResponse.json(
        {
          error:
            availability.blockedReasons?.[0] ||
            "This date and size are no longer available.",
        },
        { status: 409 },
      );
    }

    const deliveryAddress = [
      payload.delivery_address_line_1,
      payload.delivery_address_line_2,
      `${payload.delivery_city}, ${payload.delivery_state} ${payload.delivery_zip}`,
    ]
      .filter(Boolean)
      .join(", ");

    const notesParts = [
      payload.customer_company?.trim()
        ? `Company: ${payload.customer_company.trim()}`
        : "",
      payload.placement_notes?.trim() || "",
    ].filter(Boolean);

    const notes = notesParts.join(" | ") || null;

    const { data: createdBooking, error: insertError } = await supabaseAdmin
      .from("bookings")
      .insert({
        customer_name: payload.customer_full_name,
        customer_email: payload.customer_email,
        customer_phone: payload.customer_phone,
        size_yards: Number(payload.size_yards),
        delivery_address: deliveryAddress,
        delivery_date: payload.delivery_date,
        return_date: payload.pickup_date,
        total_price: Number(payload.total || 0),
        status: "pending",
        payment_status: "unpaid",
        notes,
      })
      .select("id, customer_name, customer_email, delivery_date, return_date, total_price")
      .single();

    if (insertError || !createdBooking) {
      throw insertError || new Error("Booking was not created");
    }

    const bookingNumber = formatBookingNumber(createdBooking.id);

    let emailResult: { sent: boolean; reason?: string } = { sent: false };
    try {
      emailResult = await sendConfirmationEmail({
        to: createdBooking.customer_email,
        customerName: createdBooking.customer_name,
        bookingNumber,
        deliveryDate: createdBooking.delivery_date,
        pickupDate: createdBooking.return_date,
        total: Number(createdBooking.total_price || 0),
      });
    } catch (emailError) {
      console.error("Confirmation email error:", emailError);
      emailResult = { sent: false, reason: "Failed to send confirmation email" };
    }

    return NextResponse.json({
      bookingId: createdBooking.id,
      bookingNumber,
      emailSent: emailResult.sent,
      emailMessage: emailResult.reason,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
