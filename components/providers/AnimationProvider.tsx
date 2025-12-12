"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useSmoothScroll } from "@/lib/animations";

// Paths where animations should be disabled
const DISABLED_ANIMATION_PATHS = [
  "/studio",      // Sanity Studio
  "/admin",       // Alternative admin path
  "/_sanity",     // Sanity internal routes
];

interface AnimationContextValue {
  lenis: React.RefObject<Lenis | null>;
  isAnimationsEnabled: boolean;
  isSmoothScrollEnabled: boolean;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

/**
 * Check if the current path should have animations disabled
 */
function shouldDisableAnimations(pathname: string): boolean {
  return DISABLED_ANIMATION_PATHS.some((path) => pathname.startsWith(path));
}

interface AnimationProviderProps {
  children: ReactNode;
}

/**
 * AnimationProvider
 * 
 * Provides global animation context including:
 * - Lenis smooth scrolling (disabled in Sanity Studio)
 * - Animation enabled state
 * 
 * Usage:
 * ```tsx
 * // In app/layout.tsx
 * <AnimationProvider>
 *   {children}
 * </AnimationProvider>
 * 
 * // In components
 * const { lenis, isAnimationsEnabled } = useAnimations();
 * ```
 */
export function AnimationProvider({ children }: AnimationProviderProps) {
  const pathname = usePathname();
  const isDisabled = shouldDisableAnimations(pathname);
  const { lenis, isEnabled: isSmoothScrollEnabled } = useSmoothScroll();

  const value: AnimationContextValue = {
    lenis,
    isAnimationsEnabled: !isDisabled,
    isSmoothScrollEnabled,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

/**
 * Hook to access animation context
 */
export function useAnimations(): AnimationContextValue {
  const context = useContext(AnimationContext);
  
  if (!context) {
    // Return safe defaults if used outside provider
    return {
      lenis: { current: null },
      isAnimationsEnabled: true,
      isSmoothScrollEnabled: false,
    };
  }
  
  return context;
}

export default AnimationProvider;

