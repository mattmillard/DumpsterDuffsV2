import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Contractors | Dumpster Duff's",
  description:
    "Professional dumpster rental services for contractors and construction companies. Bulk pricing and flexible scheduling available.",
};

export default function Contractors() {
  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            For Contractors
          </h1>
          <p className="text-xl text-white/70 mb-12">
            Reliable, professional dumpster service for construction projects.
          </p>

          <div className="space-y-8">
            {/* Benefits */}
            <div className="card p-8 bg-bg-alt">
              <h2 className="text-2xl font-bold text-white mb-6">
                Contractor Benefits
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Competitive bulk pricing",
                  "Flexible scheduling & extended rentals",
                  "Multiple dumpsters on the same job",
                  "Account management for easy billing",
                  "Professional, reliable service",
                  "Same-day or next-day delivery",
                  "Large debris & construction waste",
                  "Job site management assistance",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
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
                    <span className="text-white/80">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="card p-8 bg-bg-alt">
              <h2 className="text-2xl font-bold text-white mb-6">
                Services for Your Project
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "15-Yard Dumpster",
                    desc: "Perfect for most residential and small commercial projects",
                  },
                  {
                    title: "Multiple Dumpsters",
                    desc: "Manage several dumpsters on one large job",
                  },
                  {
                    title: "Extended Rentals",
                    desc: "Keep dumpsters as long as your project needs",
                  },
                  {
                    title: "Loading Service",
                    desc: "Our team loads your debris for $149",
                  },
                ].map((service, idx) => (
                  <div key={idx} className="p-4 bg-secondary rounded-lg">
                    <h3 className="font-bold text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-white/70">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="card p-8 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/40 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Get contractor pricing today
              </h3>
              <p className="text-white/70 mb-6">
                Call us to discuss your project and get a custom quote.
              </p>
              <a href="tel:+15733564272" className="btn-primary inline-block">
                Call Us: (573) 356-4272
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
