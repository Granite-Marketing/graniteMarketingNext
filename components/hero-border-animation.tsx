"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/animations/gsap-config";

export function HeroBorderAnimation() {
	const borderRef = useRef<SVGRectElement>(null);

	useGSAP(
		() => {
			if (!borderRef.current) return;

			const path = borderRef.current;

			// Safari Mobile fix: If getTotalLength() is 0 on mount,
			// we calculate it based on the bounding box.
			let pathLength = path.getTotalLength();
			if (!pathLength || pathLength === 0) {
				const bbox = path.getBBox();
				pathLength = (bbox.width + bbox.height) * 2;
			}

			// Define segments for the "torch" effect
			// sideDash is the visible highlight, sideGap is the space between them
			const sideDash = pathLength * 0.2;
			const sideGap = pathLength * 0.4;

			const tl = gsap.timeline({ repeat: -1 });

			// Phase 1: Top and Bottom sweep
			tl.set(path, {
				strokeDasharray: `${sideDash} ${sideGap} ${sideDash} ${sideGap}`,
				strokeDashoffset: 0,
				opacity: 0,
			})
				.to(path, {
					opacity: 0.2,
					duration: 0.5,
					ease: "power2.inOut",
				})
				.to(
					path,
					{
						strokeDashoffset: -pathLength * 0.15,
						duration: 2,
						ease: "power2.inOut",
					},
					"-=0.25",
				)
				.to(
					path,
					{
						opacity: 0,
						duration: 0.5,
						ease: "power2.inOut",
					},
					"-=0.25",
				)

				// Phase 2: Left and Right sweep
				.set(path, {
					strokeDashoffset: -pathLength * 0.25, // Shift to vertical sides
				})
				.to(path, {
					opacity: 0.2,
					duration: 0.5,
					ease: "power2.inOut",
				})
				.to(
					path,
					{
						strokeDashoffset: -pathLength * 0.4,
						duration: 2,
						ease: "power2.inOut",
					},
					"-=0.25",
				)
				.to(
					path,
					{
						opacity: 0,
						duration: 0.5,
						ease: "power2.inOut",
					},
					"-=0.25",
				);
		},
		{ scope: borderRef },
	);

	return (
		<svg
			className="absolute inset-0 w-full h-full pointer-events-none rounded-xl z-20"
			aria-hidden="true"
			style={{ overflow: "visible" }}
		>
			<rect
				ref={borderRef}
				x="0"
				y="0"
				width="100%"
				height="100%"
				rx="12"
				fill="none"
				stroke="currentColor"
				className="text-primary"
				strokeWidth="1.6"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				style={{ mixBlendMode: "screen", opacity: 0 }}
			/>
		</svg>
	);
}
