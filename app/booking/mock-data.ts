// Mock data for booking flow - will be replaced with database queries

import { DumpsterSizeOption } from "@/types/booking";

export const MOCK_SIZES: DumpsterSizeOption[] = [
  {
    id: "size-10",
    size_yards: 10,
    name: "10 Yard",
    description: "Perfect for small home cleanups and minor renovations",
    price_base: 299.99,
    price_per_day: 25,
    dimensions: { length: 14, width: 8, height: 4 },
    ideal_for: [
      "Small home cleanups",
      "Garage/attic cleanouts",
      "Minor renovations",
      "Yard debris",
    ],
  },
  {
    id: "size-15",
    size_yards: 15,
    name: "15 Yard",
    description: "Our most popular size for medium projects",
    price_base: 349.99,
    price_per_day: 30,
    dimensions: { length: 17, width: 8, height: 4 },
    ideal_for: [
      "Kitchen/bathroom remodels",
      "Garage cleanouts",
      "Roofing projects",
      "Estate cleanouts",
    ],
  },
  {
    id: "size-20",
    size_yards: 20,
    name: "20 Yard",
    description: "Great for large renovations and construction",
    price_base: 449.99,
    price_per_day: 40,
    dimensions: { length: 22, width: 8, height: 4 },
    ideal_for: [
      "Large renovation projects",
      "Construction debris",
      "Commercial cleanouts",
      "Demolition projects",
    ],
  },
  {
    id: "size-30",
    size_yards: 30,
    name: "30 Yard",
    description: "Best for major projects and commercial use",
    price_base: 599.99,
    price_per_day: 50,
    dimensions: { length: 30, width: 8, height: 4 },
    ideal_for: [
      "Major projects",
      "Commercial use",
      "Large demolition",
      "Bulk waste disposal",
    ],
  },
];
