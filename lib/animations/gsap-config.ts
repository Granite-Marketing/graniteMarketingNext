"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Default animation settings
export const defaultEase = "power2.out";
export const defaultDuration = 1;

// Animation presets
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 1 },
  },
  slideIn: {
    from: { y: 25, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 1 },
  },
  slideInLeft: {
    from: { x: -50, opacity: 0 },
    to: { x: 0, opacity: 1, duration: 1 },
  },
  slideInRight: {
    from: { x: 50, opacity: 0 },
    to: { x: 0, opacity: 1, duration: 1 },
  },
  scaleIn: {
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: 1 },
  },
};

// ScrollTrigger defaults
export const scrollTriggerDefaults = {
  start: "top bottom-=100px",
  toggleActions: "play none none none",
};

// Responsive breakpoints matching Tailwind
export const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
  // Max-width variants for mobile-first
  mobile: "(max-width: 639px)",
  tablet: "(max-width: 1023px)",
};

export { gsap, ScrollTrigger, useGSAP };
