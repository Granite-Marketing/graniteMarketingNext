"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "../gsap-config";

/**
 * Check if we're in an environment where smooth scroll should be disabled
 * - Sanity Studio (typically at /studio or /admin)
 * - Any CMS preview mode
 */
function shouldDisableSmoothScroll(pathname: string): boolean {
	// Disable for Sanity Studio routes
	const disabledPaths = ["/studio", "/admin", "/_sanity"];

	return disabledPaths.some((path) => pathname.startsWith(path));
}

/**
 * Hook for smooth scrolling with Lenis
 * Uses useGSAP for GSAP integration, useEffect for non-GSAP setup
 * Should be used in the root layout
 *
 * Automatically disables itself in Sanity Studio to prevent editor issues
 */
export function useSmoothScroll() {
	const lenisRef = useRef<Lenis | null>(null);
	const pathname = usePathname();
	const [isEnabled, setIsEnabled] = useState(true);

	// Check if smooth scroll should be enabled based on current path
	useEffect(() => {
		const shouldDisable = shouldDisableSmoothScroll(pathname);
		setIsEnabled(!shouldDisable);

		// If we're disabling, destroy any existing Lenis instance
		if (shouldDisable && lenisRef.current) {
			lenisRef.current.destroy();
			lenisRef.current = null;
		}
	}, [pathname]);

	// Initialize Lenis and connect to GSAP (only if enabled)
	useGSAP(() => {
		// Don't initialize if disabled or already exists
		if (!isEnabled) return;

		const lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
		});

		lenisRef.current = lenis;

		// Connect Lenis to GSAP ScrollTrigger
		lenis.on("scroll", ScrollTrigger.update);

		// Add Lenis to GSAP ticker for smooth updates
		const tickerCallback = (time: number) => {
			lenis.raf(time * 1000);
		};

		gsap.ticker.add(tickerCallback);
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(tickerCallback);
			lenis.destroy();
			lenisRef.current = null;
		};
	}, [isEnabled]);

	// Handle anchor links (non-GSAP functionality)
	useEffect(() => {
		// Don't add listener if smooth scroll is disabled
		if (!isEnabled) return;

		const handleAnchorClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const anchor = target.closest('a[href^="#"]');

			if (anchor && lenisRef.current) {
				const href = anchor.getAttribute("href");
				if (href && href !== "#") {
					e.preventDefault();
					const targetElement = document.querySelector(href);
					if (targetElement) {
						lenisRef.current.scrollTo(targetElement as HTMLElement, {
							offset: -100,
							duration: 1.2,
						});
					}
				}
			}
		};

		document.addEventListener("click", handleAnchorClick);

		return () => {
			document.removeEventListener("click", handleAnchorClick);
		};
	}, [isEnabled]);

	return {
		lenis: lenisRef,
		isEnabled,
	};
}

export default useSmoothScroll;
