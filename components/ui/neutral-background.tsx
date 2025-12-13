"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface NeuralBackgroundProps {
	// Preset configurations
	preset?: "hero" | "section" | "card" | "accent" | "footer";

	// Density controls
	pathCount?: number;
	nodeCount?: number;

	// Styling
	opacity?: number;
	strokeWidth?: number;
	variant?: "primary" | "muted" | "accent";

	// Animation
	animated?: boolean;
	animatedNodes?: number;
	animationSpeed?: "slow" | "medium" | "fast";

	// Layout
	safeZone?: { x: number; y: number; width: number; height: number };
	orientation?: "mixed" | "horizontal" | "vertical";
	asymmetric?: boolean;

	// Performance
	lazy?: boolean;
	mobileSimplified?: boolean;
	staticFallback?: boolean;

	// Additional props
	className?: string;
	viewBox?: string;
}

// Preset configurations
const PRESETS = {
	hero: {
		pathCount: 12,
		nodeCount: 16,
		opacity: 0.2,
		animated: true,
		animatedNodes: 4,
		animationSpeed: "medium" as const,
		asymmetric: true,
	},
	section: {
		pathCount: 6,
		nodeCount: 10,
		opacity: 0.12,
		animated: true,
		animatedNodes: 2,
		animationSpeed: "slow" as const,
		asymmetric: true,
	},
	card: {
		pathCount: 3,
		nodeCount: 6,
		opacity: 0.08,
		animated: true,
		animatedNodes: 1,
		animationSpeed: "medium" as const,
		asymmetric: true,
	},
	accent: {
		pathCount: 10,
		nodeCount: 14,
		opacity: 0.18,
		animated: true,
		animatedNodes: 3,
		animationSpeed: "medium" as const,
		asymmetric: true,
	},
	footer: {
		pathCount: 8,
		nodeCount: 12,
		opacity: 0.08,
		animated: false,
		animatedNodes: 0,
		animationSpeed: "slow" as const,
		asymmetric: true,
	},
};

// Animation speed to duration mapping
const SPEED_TO_DURATION = {
	slow: { base: 8, variance: 1.5 },
	medium: { base: 7, variance: 1 },
	fast: { base: 5, variance: 0.5 },
};

export function NeuralBackground({
	preset = "hero",
	pathCount: customPathCount,
	nodeCount: customNodeCount,
	opacity: customOpacity,
	strokeWidth = 1.5,
	variant = "primary",
	animated: customAnimated,
	animatedNodes: customAnimatedNodes,
	animationSpeed: customAnimationSpeed,
	safeZone,
	mobileSimplified = true,
	className,
	viewBox = "0 0 1400 800",
}: NeuralBackgroundProps) {
	const [isMobile, setIsMobile] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		const checkMotion = () =>
			setPrefersReducedMotion(
				window.matchMedia("(prefers-reduced-motion: reduce)").matches
			);

		checkMobile();
		checkMotion();

		window.addEventListener("resize", checkMobile);
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		motionQuery.addEventListener("change", checkMotion);

		return () => {
			window.removeEventListener("resize", checkMobile);
			motionQuery.removeEventListener("change", checkMotion);
		};
	}, []);

	// Merge preset with custom props
	const config = {
		...PRESETS[preset],
		...(customPathCount !== undefined && { pathCount: customPathCount }),
		...(customNodeCount !== undefined && { nodeCount: customNodeCount }),
		...(customOpacity !== undefined && { opacity: customOpacity }),
		...(customAnimated !== undefined && { animated: customAnimated }),
		...(customAnimatedNodes !== undefined && {
			animatedNodes: customAnimatedNodes,
		}),
		...(customAnimationSpeed !== undefined && {
			animationSpeed: customAnimationSpeed,
		}),
	};

	// Simplify for mobile if enabled
	const effectivePathCount =
		isMobile && mobileSimplified
			? Math.ceil(config.pathCount * 0.5)
			: config.pathCount;
	const effectiveAnimatedNodes =
		isMobile && mobileSimplified
			? Math.min(config.animatedNodes, 2)
			: config.animatedNodes;

	// Disable animations if user prefers reduced motion
	const shouldAnimate = config.animated && !prefersReducedMotion;

	// Color variant mapping
	const colorMap = {
		primary: {
			line: "oklch(0.4 0.02 200)",
			lineHighlight: "oklch(0.45 0.03 180)",
			node: "oklch(0.5 0.04 180)",
			animatedNode: "oklch(0.55 0.06 170)",
		},
		muted: {
			line: "oklch(0.35 0.01 200)",
			lineHighlight: "oklch(0.4 0.02 180)",
			node: "oklch(0.45 0.03 180)",
			animatedNode: "oklch(0.5 0.04 170)",
		},
		accent: {
			line: "oklch(0.4 0.02 250)",
			lineHighlight: "oklch(0.45 0.03 220)",
			node: "oklch(0.5 0.04 220)",
			animatedNode: "oklch(0.55 0.06 210)",
		},
	};

	const colors = colorMap[variant];
	const speedConfig = SPEED_TO_DURATION[config.animationSpeed];

	// Generate neural paths based on preset and safe zone
	const paths =
		preset === "hero"
			? [
					{
						d: "M 520 310 L 440 310 L 440 260 L 360 260 L 320 220 L 240 180",
						opacity: 0.3,
					},
					{
						d: "M 500 330 L 420 350 L 360 340 L 300 310 L 220 280",
						opacity: 0.25,
					},
					{
						d: "M 880 300 L 960 300 L 1020 270 L 1080 240 L 1160 220",
						opacity: 0.3,
					},
					{
						d: "M 900 335 L 980 360 L 1040 340 L 1100 310 L 1180 290",
						opacity: 0.25,
					},
					{
						d: "M 920 315 L 1000 315 L 1000 280 L 1070 280 L 1130 250",
						opacity: 0.2,
					},
					{
						d: "M 510 490 L 450 490 L 410 520 L 340 540 L 280 570 L 200 600",
						opacity: 0.3,
					},
					{
						d: "M 490 470 L 410 450 L 350 460 L 290 490 L 210 520",
						opacity: 0.25,
					},
					{
						d: "M 890 500 L 950 500 L 1010 530 L 1070 560 L 1150 590",
						opacity: 0.3,
					},
					{
						d: "M 910 475 L 990 460 L 1050 480 L 1110 510 L 1190 540",
						opacity: 0.25,
					},
					{
						d: "M 530 395 L 470 395 L 410 410 L 340 420 L 260 440",
						opacity: 0.2,
					},
					{
						d: "M 870 405 L 930 405 L 990 390 L 1060 380 L 1140 360",
						opacity: 0.2,
					},
					{ d: "M 460 300 L 430 280 L 400 250 L 370 210", opacity: 0.2 },
				].slice(0, effectivePathCount)
			: preset === "accent"
				? [
						{ d: "M 300 200 L 250 200 L 220 230 L 180 250", opacity: 0.25 },
						{ d: "M 1100 200 L 1150 200 L 1180 230 L 1220 250", opacity: 0.25 },
						{ d: "M 320 600 L 270 600 L 240 570 L 200 550", opacity: 0.25 },
						{ d: "M 1080 600 L 1130 600 L 1160 570 L 1200 550", opacity: 0.25 },
						{ d: "M 450 250 L 400 280 L 360 310", opacity: 0.2 },
						{ d: "M 950 250 L 1000 280 L 1040 310", opacity: 0.2 },
						{ d: "M 430 550 L 380 520 L 340 490", opacity: 0.2 },
						{ d: "M 970 550 L 1020 520 L 1060 490", opacity: 0.2 },
						{ d: "M 500 300 L 480 330 L 460 360", opacity: 0.18 },
						{ d: "M 900 300 L 920 330 L 940 360", opacity: 0.18 },
					].slice(0, effectivePathCount)
				: [];

	// Generate node positions
	const nodes =
		preset === "hero"
			? [
					{ cx: 520, cy: 310, r: 3, opacity: 0.4 },
					{ cx: 880, cy: 300, r: 3, opacity: 0.4 },
					{ cx: 510, cy: 490, r: 3, opacity: 0.4 },
					{ cx: 890, cy: 500, r: 3, opacity: 0.4 },
					{ cx: 440, cy: 310, r: 2.5, opacity: 0.35 },
					{ cx: 960, cy: 300, r: 2.5, opacity: 0.35 },
					{ cx: 450, cy: 490, r: 2.5, opacity: 0.35 },
					{ cx: 950, cy: 500, r: 2.5, opacity: 0.35 },
					{ cx: 240, cy: 180, r: 3, opacity: 0.3 },
					{ cx: 1160, cy: 220, r: 3, opacity: 0.3 },
					{ cx: 200, cy: 600, r: 3, opacity: 0.3 },
					{ cx: 1150, cy: 590, r: 3, opacity: 0.3 },
					{ cx: 260, cy: 440, r: 2.5, opacity: 0.25 },
					{ cx: 1140, cy: 360, r: 2.5, opacity: 0.25 },
				]
			: preset === "accent"
				? [
						{ cx: 300, cy: 200, r: 2.5, opacity: 0.3 },
						{ cx: 1100, cy: 200, r: 2.5, opacity: 0.3 },
						{ cx: 320, cy: 600, r: 2.5, opacity: 0.3 },
						{ cx: 1080, cy: 600, r: 2.5, opacity: 0.3 },
						{ cx: 450, cy: 250, r: 2, opacity: 0.25 },
						{ cx: 950, cy: 250, r: 2, opacity: 0.25 },
						{ cx: 430, cy: 550, r: 2, opacity: 0.25 },
						{ cx: 970, cy: 550, r: 2, opacity: 0.25 },
					]
				: [];

	// Animated nodes with paths
	const animatedNodePaths =
		preset === "hero"
			? [
					{
						path: "M 520 310 L 440 310 L 440 260 L 360 260 L 320 220 L 240 180",
						start: { cx: 520, cy: 310 },
					},
					{
						path: "M 890 500 L 950 500 L 1010 530 L 1070 560 L 1150 590",
						start: { cx: 890, cy: 500 },
					},
					{
						path: "M 880 300 L 960 300 L 1020 270 L 1080 240 L 1160 220",
						start: { cx: 880, cy: 300 },
					},
					{
						path: "M 510 490 L 450 490 L 410 520 L 340 540 L 280 570 L 200 600",
						start: { cx: 510, cy: 490 },
					},
				].slice(0, effectiveAnimatedNodes)
			: preset === "accent"
				? [
						{
							path: "M 300 200 L 250 200 L 220 230 L 180 250",
							start: { cx: 300, cy: 200 },
						},
						{
							path: "M 1100 200 L 1150 200 L 1180 230 L 1220 250",
							start: { cx: 1100, cy: 200 },
						},
						{
							path: "M 320 600 L 270 600 L 240 570 L 200 550",
							start: { cx: 320, cy: 600 },
						},
					].slice(0, effectiveAnimatedNodes)
				: [];

	return (
		<svg
			className={cn(
				"absolute inset-0 w-full h-full pointer-events-none",
				className
			)}
			xmlns="http://www.w3.org/2000/svg"
			viewBox={viewBox}
			preserveAspectRatio="xMidYMid slice"
			aria-hidden="true"
		>
			<defs>
				<linearGradient
					id={`neural-line-${preset}`}
					x1="0%"
					y1="0%"
					x2="100%"
					y2="0%"
				>
					<stop
						offset="0%"
						stopColor={colors.line}
						stopOpacity={config.opacity * 0.75}
					/>
					<stop
						offset="50%"
						stopColor={colors.lineHighlight}
						stopOpacity={config.opacity * 1.25}
					/>
					<stop
						offset="100%"
						stopColor={colors.line}
						stopOpacity={config.opacity * 0.75}
					/>
				</linearGradient>
			</defs>

			{/* Static paths */}
			<g
				stroke={`url(#neural-line-${preset})`}
				strokeWidth={strokeWidth}
				fill="none"
				strokeLinecap="square"
			>
				{paths.map((path, i) => (
					<path key={i} d={path.d} opacity={path.opacity} />
				))}
			</g>

			{/* Static nodes */}
			<g fill={colors.node}>
				{nodes.map((node, i) => (
					<circle
						key={i}
						cx={node.cx}
						cy={node.cy}
						r={node.r}
						opacity={node.opacity}
					/>
				))}
			</g>

			{/* Animated nodes */}
			{shouldAnimate && (
				<g fill={colors.animatedNode}>
					{animatedNodePaths.map((animNode, i) => {
						const duration = speedConfig.base + i * speedConfig.variance;
						const pulseDelay = i * 0.5;
						return (
							<circle
								key={i}
								cx={animNode.start.cx}
								cy={animNode.start.cy}
								r="3"
							>
								<animateMotion
									path={animNode.path}
									dur={`${duration}s`}
									repeatCount="indefinite"
								/>
								<animate
									attributeName="r"
									values="3;5;3"
									dur="2.5s"
									repeatCount="indefinite"
								/>
								<animate
									attributeName="opacity"
									values="0.4;0.7;0.4"
									dur="2.5s"
									begin={`${pulseDelay}s`}
									repeatCount="indefinite"
								/>
							</circle>
						);
					})}
				</g>
			)}
		</svg>
	);
}
