"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { gsap, useGSAP } from "../gsap-config";

interface UseMobileNavReturn {
	isOpen: boolean;
	toggle: () => void;
	close: () => void;
	open: () => void;
	menuRef: React.RefObject<HTMLElement | null>;
}

/**
 * Hook for mobile navigation with GSAP animations
 * Uses useGSAP for automatic animation cleanup
 */
export function useMobileNav(): UseMobileNavReturn {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLElement>(null);
	const tlRef = useRef<gsap.core.Timeline | null>(null);

	// Setup animation timeline with useGSAP
	useGSAP(
		() => {
			// Create timeline for open/close animations
			tlRef.current = gsap.timeline({ paused: true });

			tlRef.current
				.fromTo(
					".nav-link",
					{ y: 8, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: 0.5,
						stagger: 0.05,
						ease: "power2.out",
					}
				)
				.fromTo(
					".nav-button-wrapper",
					{ y: 4, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: 0.5,
						ease: "power2.out",
					},
					"-=0.3"
				);

			return () => {
				tlRef.current?.kill();
			};
		},
		{ scope: menuRef }
	);

	// Play/reverse animation when isOpen changes
	useEffect(() => {
		if (tlRef.current) {
			if (isOpen) {
				tlRef.current.play();
			} else {
				tlRef.current.reverse();
			}
		}
	}, [isOpen]);

	const toggle = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	const open = useCallback(() => {
		setIsOpen(true);
	}, []);

	// Lock body scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	// Close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				close();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, close]);

	// Close on route change (for Next.js)
	useEffect(() => {
		const handleRouteChange = () => {
			if (isOpen) {
				close();
			}
		};

		window.addEventListener("popstate", handleRouteChange);
		return () => window.removeEventListener("popstate", handleRouteChange);
	}, [isOpen, close]);

	return { isOpen, toggle, close, open, menuRef };
}

export default useMobileNav;
