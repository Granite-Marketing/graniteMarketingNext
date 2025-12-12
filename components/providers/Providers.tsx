"use client";

import { ReactNode } from "react";
import { AnimationProvider } from "./AnimationProvider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper
 * 
 * Combines all client-side providers in one component
 * to be used in the root layout.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AnimationProvider>
      {children}
    </AnimationProvider>
  );
}

export default Providers;

