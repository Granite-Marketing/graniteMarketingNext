"use client";

import Image from "next/image";

// Placeholder logos - these would come from Sanity in production
const logos = [
  { name: "Client 1", src: "/images/logo.avif" },
  { name: "Client 2", src: "/images/logo.avif" },
  { name: "Client 3", src: "/images/logo.avif" },
  { name: "Client 4", src: "/images/logo.avif" },
  { name: "Client 5", src: "/images/logo.avif" },
];

export default function LogoMarquee() {
  return (
    <section className="py-8 border-y border-neutral-dark" aria-label="Trusted by companies">
      <div className="flex flex-col items-center gap-6">
        {/* Marquee */}
        <div className="overflow-hidden w-full" aria-hidden="true">
          <ul className="flex animate-marquee">
            {/* First set */}
            {logos.map((logo, index) => (
              <li key={`logo-1-${index}`} className="flex-shrink-0 px-8">
                <Image
                  src={logo.src}
                  alt=""
                  width={64}
                  height={48}
                  className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
              </li>
            ))}
            {/* Duplicate for seamless loop */}
            {logos.map((logo, index) => (
              <li key={`logo-2-${index}`} className="flex-shrink-0 px-8">
                <Image
                  src={logo.src}
                  alt=""
                  width={64}
                  height={48}
                  className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Caption */}
        <p className="text-sm text-brand-white/60">
          Trusted by fast-growing companies worldwide
        </p>
      </div>
    </section>
  );
}
