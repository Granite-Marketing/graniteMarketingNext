"use client";

import { useRef, RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "./gsap-config";

/**
 * Hook for basic scroll-triggered animations (slide-in, fade-in)
 * Uses useGSAP for automatic cleanup
 */
export function useScrollAnimation(
  animationType: "slide-in" | "fade-in" = "slide-in"
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      const element = ref.current;
      const isSlideIn = animationType === "slide-in";

      gsap.set(element, {
        y: isSlideIn ? 25 : 0,
        opacity: 0,
      });

      ScrollTrigger.create({
        trigger: element,
        start: "top bottom-=100px",
        onEnter: () => {
          gsap.to(element, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          });
        },
      });
    },
    { scope: ref, dependencies: [animationType] }
  );

  return ref;
}

/**
 * Hook for batch scroll animations (multiple elements)
 * Uses useGSAP for automatic cleanup
 */
export function useBatchAnimation(
  containerRef: RefObject<HTMLElement | null>,
  selector: string
) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll(selector);
      if (elements.length === 0) return;

      gsap.set(elements, { y: 25, opacity: 0 });

      ScrollTrigger.batch(elements, {
        start: "top bottom-=100px",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
          }),
      });
    },
    { scope: containerRef, dependencies: [selector] }
  );
}

/**
 * Hook for hero text reveal animation
 * Uses useGSAP for automatic cleanup
 */
export function useHeroAnimation(containerRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const heading = containerRef.current.querySelector("h1");
      const paragraph = containerRef.current.querySelector("p");
      const footer = containerRef.current.querySelector(".hero-footer");
      const icons = containerRef.current.querySelectorAll(".hero-icon");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Set initial states
      if (heading) gsap.set(heading, { y: 30, autoAlpha: 0 });
      if (paragraph) gsap.set(paragraph, { y: 20, autoAlpha: 0 });
      if (footer) gsap.set(footer, { opacity: 0 });
      if (icons.length) gsap.set(icons, { opacity: 0, scale: 0.7 });

      // Animate
      if (heading) {
        tl.to(heading, {
          y: 0,
          autoAlpha: 1,
          duration: 1,
        });
      }

      if (paragraph) {
        tl.to(
          paragraph,
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
          },
          "-=0.8"
        );
      }

      if (footer) {
        tl.to(
          footer,
          {
            opacity: 1,
            duration: 1.2,
            ease: "power2.inOut",
          },
          "-=0.9"
        );
      }

      if (icons.length) {
        tl.to(
          icons,
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.25,
            ease: "power2.inOut",
          },
          "-=0.9"
        );
      }
    },
    { scope: containerRef }
  );
}

/**
 * Hook for stats countup animation with GSAP
 * Uses useGSAP for automatic cleanup
 */
export function useCountUpAnimation(
  ref: RefObject<HTMLElement | null>,
  endValue: number,
  options?: {
    duration?: number;
    prefix?: string;
    suffix?: string;
  }
) {
  useGSAP(
    () => {
      if (!ref.current) return;

      const element = ref.current;
      const duration = options?.duration || 2;
      const prefix = options?.prefix || "";
      const suffix = options?.suffix || "";

      let hasAnimated = false;

      ScrollTrigger.create({
        trigger: element,
        start: "top center+=100",
        onEnter: () => {
          if (hasAnimated) return;
          hasAnimated = true;

          gsap.to(
            { value: 0 },
            {
              value: endValue,
              duration,
              ease: "power2.out",
              onUpdate: function () {
                element.textContent = `${prefix}${Math.round(this.targets()[0].value)}${suffix}`;
              },
            }
          );
        },
      });
    },
    { scope: ref, dependencies: [endValue, options?.duration, options?.prefix, options?.suffix] }
  );
}

/**
 * Hook for timeline section animation
 * Uses useGSAP for automatic cleanup
 */
export function useTimelineAnimation(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!ref.current) return;

      const rows = ref.current.querySelectorAll(".timeline-row");

      rows.forEach((row) => {
        const title = row.querySelector(".timeline-title");
        const text = row.querySelector(".timeline-text");
        const icon = row.querySelector(".timeline-icon-wrapper");

        if (title) gsap.set(title, { y: 20, opacity: 0 });
        if (text) gsap.set(text, { y: 20, opacity: 0 });
        if (icon) gsap.set(icon, { scale: 0.8, opacity: 0 });

        ScrollTrigger.create({
          trigger: row,
          start: "top center",
          onEnter: () => {
            const tl = gsap.timeline();

            if (icon) {
              tl.to(icon, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
              });
            }

            if (title) {
              tl.to(
                title,
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: "power2.out",
                },
                "-=0.3"
              );
            }

            if (text) {
              tl.to(
                text,
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: "power2.out",
                },
                "-=0.4"
              );
            }
          },
        });
      });
    },
    { scope: ref }
  );
}

/**
 * Hook for staggered children animation
 * Uses useGSAP for automatic cleanup
 */
export function useStaggerAnimation(
  ref: RefObject<HTMLElement | null>,
  childSelector: string,
  options?: {
    stagger?: number;
    duration?: number;
    y?: number;
  }
) {
  useGSAP(
    () => {
      if (!ref.current) return;

      const children = ref.current.querySelectorAll(childSelector);
      if (children.length === 0) return;

      const stagger = options?.stagger || 0.1;
      const duration = options?.duration || 0.8;
      const y = options?.y || 30;

      gsap.set(children, { y, opacity: 0 });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom-=100px",
        onEnter: () => {
          gsap.to(children, {
            y: 0,
            opacity: 1,
            duration,
            stagger,
            ease: "power2.out",
          });
        },
      });
    },
    { scope: ref, dependencies: [childSelector, options?.stagger, options?.duration, options?.y] }
  );
}

/**
 * Hook for text mask/reveal animation with SplitType
 * Uses useGSAP for automatic cleanup
 */
export function useTextRevealAnimation(
  ref: RefObject<HTMLElement | null>,
  options?: {
    stagger?: number;
    duration?: number;
    start?: string;
  }
) {
  useGSAP(
    () => {
      if (!ref.current) return;

      // Dynamic import SplitType to avoid SSR issues
      import("split-type").then(({ default: SplitType }) => {
        const element = ref.current;
        if (!element) return;

        const splitText = new SplitType(element, { types: "words" });
        const words = splitText.words;

        if (!words?.length) return;

        gsap.set(words, {
          yPercent: 80,
          opacity: 0,
        });

        ScrollTrigger.create({
          trigger: element,
          start: options?.start || "top 80%",
          onEnter: () => {
            gsap.to(words, {
              yPercent: 0,
              opacity: 1,
              duration: options?.duration || 1,
              stagger: options?.stagger || 0.02,
              ease: "power2.out",
            });
          },
        });
      });
    },
    { scope: ref, dependencies: [options?.stagger, options?.duration, options?.start] }
  );
}

/**
 * Hook for parallax scroll effect
 * Uses useGSAP for automatic cleanup
 */
export function useParallaxAnimation(
  ref: RefObject<HTMLElement | null>,
  options?: {
    speed?: number;
    direction?: "up" | "down";
  }
) {
  useGSAP(
    () => {
      if (!ref.current) return;

      const element = ref.current;
      const speed = options?.speed || 50;
      const direction = options?.direction === "down" ? 1 : -1;

      gsap.to(element, {
        y: speed * direction,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [options?.speed, options?.direction] }
  );
}
