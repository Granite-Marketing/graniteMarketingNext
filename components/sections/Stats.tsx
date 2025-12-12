"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  number: number;
  suffix: string;
  prefix?: string;
  title: string;
  description: string;
}

const stats: StatItem[] = [
  {
    number: 20,
    suffix: "+",
    title: "Automations Deployed",
    description: "We've delivered over 20 custom automations across a wide range of tools, workflows, and industries.",
  },
  {
    number: 100,
    suffix: "%",
    title: "Customer Satisfaction",
    description: "We build long-term relationships by solving real problems — and we haven't hit one we couldn't crack.",
  },
  {
    number: 500,
    suffix: "+",
    title: "Hours Saved Monthly",
    description: "Our automations free up teams to focus on what matters — strategy, creativity, and growth.",
  },
  {
    number: 10,
    suffix: "x",
    title: "Productivity Boost",
    description: "Clients see measurable gains in output without adding headcount or complexity.",
  },
];

function CountUp({ 
  end, 
  prefix = "", 
  suffix = "",
  duration = 2000 
}: { 
  end: number; 
  prefix?: string; 
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-bold text-brand-white font-heading block">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section aria-labelledby="stats-heading">
      <div className="px-6 padding-section-large">
        <div className="container">
          <header className="mb-12 max-w-2xl">
            <h2 id="stats-heading" className="heading-style-h2 mb-4">Our results in numbers</h2>
            <p className="text-size-medium text-brand-off-white">
              We help businesses increase productivity and control through smart, 
              scalable automation — and here&apos;s how it&apos;s going so far:
            </p>
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <li key={index} className="gradient-border p-6 h-full flex flex-col">
                <CountUp 
                  end={stat.number} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                />
                <h3 className="text-lg font-semibold text-brand-white mt-4 mb-2">
                  {stat.title}
                </h3>
                <p className="text-sm text-brand-off-white mt-auto">
                  {stat.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
