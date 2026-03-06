import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Dumpster | Dumpster Duff's",
  description:
    "Easy and transparent dumpster rental booking. Choose your size, dates, and address. Locked prices, no hidden fees.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
