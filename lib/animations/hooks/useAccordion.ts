"use client";

import { useState, useCallback, RefObject, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../gsap-config";

interface UseAccordionOptions {
  allowMultiple?: boolean;
  defaultOpen?: number[];
}

interface UseAccordionReturn {
  openItems: number[];
  toggleItem: (index: number) => void;
  isOpen: (index: number) => boolean;
  openAll: () => void;
  closeAll: () => void;
}

/**
 * Hook for accessible accordion functionality with GSAP animations
 */
export function useAccordion(
  itemCount: number,
  options: UseAccordionOptions = {}
): UseAccordionReturn {
  const { allowMultiple = false, defaultOpen = [0] } = options;
  const [openItems, setOpenItems] = useState<number[]>(defaultOpen);

  const toggleItem = useCallback(
    (index: number) => {
      setOpenItems((prev) => {
        if (prev.includes(index)) {
          // Close the item
          return prev.filter((i) => i !== index);
        } else if (allowMultiple) {
          // Add to open items
          return [...prev, index];
        } else {
          // Replace with new item
          return [index];
        }
      });

      // Refresh ScrollTrigger after DOM updates
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 350);
    },
    [allowMultiple]
  );

  const isOpen = useCallback(
    (index: number) => openItems.includes(index),
    [openItems]
  );

  const openAll = useCallback(() => {
    setOpenItems(Array.from({ length: itemCount }, (_, i) => i));
    setTimeout(() => ScrollTrigger.refresh(), 350);
  }, [itemCount]);

  const closeAll = useCallback(() => {
    setOpenItems([]);
    setTimeout(() => ScrollTrigger.refresh(), 350);
  }, []);

  return {
    openItems,
    toggleItem,
    isOpen,
    openAll,
    closeAll,
  };
}

/**
 * Hook for calculating accordion content height
 */
export function useAccordionHeight(
  contentRef: RefObject<HTMLElement | null>,
  isOpen: boolean
): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    };

    updateHeight();

    // Observe content changes
    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [contentRef, isOpen]);

  return height;
}

/**
 * Hook for animated accordion with GSAP
 * Uses useGSAP for automatic cleanup
 */
export function useAnimatedAccordion(
  containerRef: RefObject<HTMLElement | null>,
  options?: {
    duration?: number;
    ease?: string;
  }
) {
  const tweensRef = useRef<Map<HTMLElement, gsap.core.Tween>>(new Map());

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const headers = containerRef.current.querySelectorAll(".accordion-header");

      headers.forEach((header) => {
        const content = header.nextElementSibling as HTMLElement;
        if (!content) return;

        // Set initial state
        gsap.set(content, { height: 0, overflow: "hidden" });
      });

      return () => {
        tweensRef.current.forEach((tween) => tween.kill());
        tweensRef.current.clear();
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  const toggle = useCallback(
    (header: HTMLElement) => {
      const content = header.nextElementSibling as HTMLElement;
      if (!content) return;

      const isOpen = header.getAttribute("aria-expanded") === "true";
      const duration = options?.duration || 0.3;
      const ease = options?.ease || "power2.inOut";

      // Kill any existing animation
      const existingTween = tweensRef.current.get(content);
      if (existingTween) {
        existingTween.kill();
      }

      if (isOpen) {
        // Close
        const tween = gsap.to(content, {
          height: 0,
          duration,
          ease,
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
        tweensRef.current.set(content, tween);
      } else {
        // Open
        const fullHeight = content.scrollHeight;
        const tween = gsap.to(content, {
          height: fullHeight,
          duration,
          ease,
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
        tweensRef.current.set(content, tween);
      }
    },
    [options?.duration, options?.ease]
  );

  return { toggle };
}

export default useAccordion;
