"use client";

// Core GSAP exports
export {
  gsap,
  ScrollTrigger,
  useGSAP,
  defaultEase,
  defaultDuration,
  animations,
  scrollTriggerDefaults,
  breakpoints,
} from "./gsap-config";

// Animation hooks
export {
  useScrollAnimation,
  useBatchAnimation,
  useHeroAnimation,
  useCountUpAnimation,
  useTimelineAnimation,
  useStaggerAnimation,
  useTextRevealAnimation,
  useParallaxAnimation,
} from "./useGsapAnimations";

// Utility hooks
export { useSmoothScroll } from "./hooks/useSmoothScroll";
export {
  useAccordion,
  useAccordionHeight,
  useAnimatedAccordion,
} from "./hooks/useAccordion";
export { useMobileNav } from "./hooks/useMobileNav";

