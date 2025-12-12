import Link from "next/link";
import { PlusIcon } from "@/components/icons";

export default function CTA() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="px-6 padding-section-large">
        <div className="container max-w-4xl text-center relative z-10">
          <h2 id="cta-heading" className="heading-style-h2 mb-6">
            Ready to automate your business?
          </h2>
          <p className="text-size-medium text-brand-off-white mb-8 max-w-2xl mx-auto">
            Stop wasting time on repetitive tasks. Let us build custom automations 
            that free up your team to focus on what really matters.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#contact-form"
              className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-light text-black font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <PlusIcon size={20} />
              <span>Get Started</span>
            </Link>
            <Link
              href="/about-us"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-off-white text-brand-off-white hover:bg-brand-off-white hover:text-black font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Background Effect - decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(37, 153, 91, 0.4) 0%, transparent 70%)"
          }}
        />
      </div>
    </section>
  );
}
