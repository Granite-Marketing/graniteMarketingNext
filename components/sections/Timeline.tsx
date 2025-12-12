"use client";

interface TimelineItem {
  step: string;
  title: string;
  description: string;
}

const timelineItems: TimelineItem[] = [
  {
    step: "01",
    title: "Discovery Call",
    description: "We start with a deep-dive into your current workflows, tools, and pain points. No sales pitch — just understanding what you need.",
  },
  {
    step: "02",
    title: "Solution Design",
    description: "We map out your automation architecture, selecting the right tools and designing integrations that work with your existing stack.",
  },
  {
    step: "03",
    title: "Build & Test",
    description: "Our team builds your custom automation, testing it thoroughly to ensure it performs reliably under real-world conditions.",
  },
  {
    step: "04",
    title: "Deploy & Support",
    description: "We deploy your automation and provide ongoing support, monitoring, and optimization to keep everything running smoothly.",
  },
];

export default function Timeline() {
  return (
    <section aria-labelledby="timeline-heading">
      <div className="px-6 padding-section-large">
        <div className="container">
          <header className="text-center mb-16 max-w-3xl mx-auto">
            <h2 id="timeline-heading" className="heading-style-h2 mb-4">How we work</h2>
            <p className="text-size-medium text-brand-off-white">
              From first call to finished product, here&apos;s what working with us looks like.
            </p>
          </header>

          {/* Timeline as ordered list - semantically correct for sequential steps */}
          <ol className="relative space-y-12 md:space-y-16">
            {/* Vertical Line - decorative */}
            <div 
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-green via-brand-green/50 to-transparent md:-translate-x-1/2" 
              aria-hidden="true" 
            />

            {timelineItems.map((item, index) => (
              <li
                key={index}
                className={`relative flex flex-col md:flex-row items-start ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step indicator */}
                <span 
                  className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full border-2 border-brand-green bg-black flex items-center justify-center z-10 text-brand-green font-mono text-xs font-bold"
                  aria-hidden="true"
                >
                  {item.step}
                </span>

                {/* Content */}
                <div
                  className={`pl-12 md:pl-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                  }`}
                >
                  <h3 className="text-xl font-bold text-brand-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-brand-off-white">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
