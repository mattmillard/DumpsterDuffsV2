import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Junk Removal | Dumpster Duff's",
  description:
    "Full-service junk removal in central Missouri. We load, haul, and dispose so you don't lift a finger.",
};

export default function JunkRemovalPage() {
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Professional Junk Removal
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We do the lifting, loading, hauling, and disposal. If you want
              junk gone fast without the work, this is the service for you.
            </p>
          </div>

          <div className="card p-8 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/40">
            <h2 className="text-2xl font-bold text-white mb-3">
              Why homeowners choose junk removal
            </h2>
            <p className="text-white/80 mb-6">
              Skip renting equipment, organizing labor, and making dump runs.
              Our licensed, insured crew handles it all from start to finish.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "No heavy lifting required",
                "Fast same-day and next-day options",
                "Upfront quotes before work starts",
                "Responsible disposal and sorting",
                "Great for urgent cleanouts",
                "Perfect for customers who want it done-for-you",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-white/85">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Home Cleanouts",
                items: ["Garage cleanouts", "Basement junk", "Attic debris"],
              },
              {
                title: "Property & Estate",
                items: [
                  "Estate cleanouts",
                  "Rental turnover debris",
                  "Foreclosure cleanups",
                ],
              },
              {
                title: "Outdoor & Bulk",
                items: [
                  "Yard waste piles",
                  "Old furniture removal",
                  "Appliance haul-away",
                ],
              },
            ].map((group) => (
              <div key={group.title} className="card p-6 bg-bg-alt">
                <h3 className="text-xl font-bold text-white mb-4">{group.title}</h3>
                <ul className="space-y-2 text-white/75">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="card p-8 bg-bg-alt">
            <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                "Call or message us with what you need removed",
                "Get a clear quote",
                "We arrive and do all the loading",
                "We haul it away and clean up",
              ].map((step, idx) => (
                <div key={step} className="p-4 bg-secondary rounded-lg">
                  <p className="text-primary font-bold mb-2">Step {idx + 1}</p>
                  <p className="text-white/80 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/40 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to clear it out?
            </h3>
            <p className="text-white/70 mb-6">
              Tell us what needs to go and we&apos;ll handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+15733564272" className="btn-primary">
                Call Now: (573) 356-4272
              </a>
              <a href="/contact" className="btn-secondary">
                Request a Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
