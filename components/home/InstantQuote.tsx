"use client";

import Link from "next/link";

export default function InstantQuote() {
  // Simplified component - redirect users to booking flow

  return (
    <section className="section-padding bg-[#1A1A1A]">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Your Price in 30 Seconds
            </h2>
            <p className="text-lg text-[#999999]">
              No hidden fees. Price locked at booking. Simple and transparent.
            </p>
          </div>

          {/* Quote Form */}
          <div className="card p-6 md:p-8 bg-gradient-to-br from-bg-alt to-secondary">
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-[#999999] mb-4 text-lg">
                  Ready to get started? Our booking flow makes it easy:
                </p>
                <ul className="text-left inline-block space-y-2 mb-8 text-[#999999]">
                  <li className="flex items-center">
                    <span className="text-primary font-bold mr-3">✓</span>
                    Choose your dumpster size
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary font-bold mr-3">✓</span>
                    Pick your dates
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary font-bold mr-3">✓</span>
                    Enter your address
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary font-bold mr-3">✓</span>
                    See your price (locked, no surprises!)
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary font-bold mr-3">✓</span>
                    Complete checkout with Stripe
                  </li>
                </ul>
              </div>

              <Link
                href="/booking"
                className="btn-primary w-full text-lg flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start Booking Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
