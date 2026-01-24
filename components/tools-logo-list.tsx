"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Tag } from "@/components/ui/tag";
import { urlForImage } from "@/lib/sanity/client";

interface Tool {
	_id: string;
	name: string;
	slug: {
		current: string;
	};
	logo?: {
		asset: any;
		alt?: string;
	};
	integrationType?: string;
	description?: string;
	website?: string;
}

interface ToolsLogoListProps {
	tools: Tool[];
}

export function ToolsLogoList({ tools }: ToolsLogoListProps) {
	// Don't render if no tools
	if (!tools || tools.length === 0) {
		return null;
	}

	const sectionRef = useRef<HTMLElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.2 },
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	// Duplicate tools for seamless infinite scroll
	const duplicatedTools = [...tools, ...tools];

	return (
		<section
			ref={sectionRef}
			className="py-24 bg-gradient-to-b from-muted/20 via-muted/10 to-background relative overflow-hidden"
			aria-label="Tools we use"
		>
			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes strokePulse {
					0% { opacity: 1; }
					50% { opacity: 0.5; }
					100% { opacity: 1; }
				}
			`,
				}}
			/>
			{/* Background pattern */}
			<div className="absolute inset-0 opacity-[0.02]">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id="tools-dots"
							x="0"
							y="0"
							width="32"
							height="32"
							patternUnits="userSpaceOnUse"
						>
							<circle cx="16" cy="16" r="1" fill="currentColor" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#tools-dots)" />
				</svg>
			</div>

			<div className="container mx-auto px-4 relative">
				<div className="text-center mb-12">
					<Tag variant="sectionLabel" className="mb-4">
						Our Toolkit
					</Tag>
					<h2 className="text-4xl md:text-5xl font-medium mb-6 text-balance">
						Built with industry-leading tools
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
						We leverage the best automation and development platforms to deliver
						powerful solutions
					</p>
				</div>

				{/* Horizontal scrolling rows */}
				<div className="space-y-6 md:space-y-8">
					{/* Row 1: Scroll Left to Right */}
					<div className="relative overflow-hidden">
						<div
							className="flex gap-6 md:gap-8"
							style={{
								animation: "scroll-left 40s linear infinite",
								width: "max-content",
							}}
						>
							{duplicatedTools.map((tool, index) => (
								<ToolLogoItem
									key={`row1-${tool._id}-${index}`}
									tool={tool}
									isVisible={isVisible}
									delay={(index % tools.length) * 0.15}
								/>
							))}
						</div>
					</div>

					{/* Row 2: Scroll Right to Left */}
					<div className="relative overflow-hidden">
						<div
							className="flex gap-6 md:gap-8"
							style={{
								animation: "scroll-right 40s linear infinite",
								width: "max-content",
							}}
						>
							{duplicatedTools.map((tool, index) => (
								<ToolLogoItem
									key={`row2-${tool._id}-${index}`}
									tool={tool}
									isVisible={isVisible}
									delay={(index % tools.length) * 0.15}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

type ToolLogoItemProps = {
	tool: Tool;
	isVisible: boolean;
	delay: number;
};

function ToolLogoItem({ tool, isVisible, delay }: ToolLogoItemProps) {
	// Get the logo URL from Sanity
	const logoUrl = tool.logo?.asset
		? urlForImage(tool.logo.asset).width(100).height(100).url()
		: null;

	// Perimeter for rounded square: approximately 2*(w+h) - 8*r + 2*π*r
	// For 96x96 rect with rx=12: ~364
	const rectPerimeter = 364;

	// Animation states: idle -> drawing (orange) -> success (green)
	const [animState, setAnimState] = useState<"idle" | "drawing" | "success">(
		"idle",
	);

	useEffect(() => {
		if (!isVisible) return;

		// Start drawing after delay
		const drawTimer = setTimeout(() => {
			setAnimState("drawing");
		}, delay * 1000);

		// Transition to success after drawing completes
		const successTimer = setTimeout(
			() => {
				setAnimState("success");
			},
			(delay + 2) * 1000,
		); // 2s after drawing starts

		return () => {
			clearTimeout(drawTimer);
			clearTimeout(successTimer);
		};
	}, [isVisible, delay]);

	// Determine stroke color based on animation state
	const getStrokeColor = () => {
		switch (animState) {
			case "drawing":
				return "#ff4f1a"; // n8n orange
			case "success":
				return "#22c55e"; // n8n green
			default:
				return "hsl(var(--border))";
		}
	};

	// Determine stroke offset based on animation state
	const getStrokeOffset = () => {
		return animState === "idle" ? rectPerimeter : 0;
	};

	// Don't render if no logo
	if (!logoUrl) {
		return null;
	}

	return (
		<div className="relative flex items-center justify-center aspect-square w-[70px] md:w-[80px] flex-shrink-0">
			{/* Logo container with rounded square background */}
			<div className="relative w-full h-full flex items-center justify-center p-2 z-10 bg-muted/40 rounded-xl">
				<Image
					src={logoUrl}
					alt={tool.logo?.alt || tool.name}
					width={40}
					height={40}
					className="w-8 h-8 md:w-10 md:h-10 object-contain"
					loading="lazy"
				/>
			</div>

			{/* SVG Rounded Square Border */}
			<svg
				className="absolute inset-0 w-full h-full pointer-events-none z-0"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid meet"
				aria-hidden="true"
			>
				<rect
					x="2"
					y="2"
					width="96"
					height="96"
					rx="12"
					ry="12"
					fill="none"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{
						strokeDasharray: rectPerimeter,
						strokeDashoffset: getStrokeOffset(),
						stroke: getStrokeColor(),
						transition:
							animState === "drawing"
								? "stroke-dashoffset 2s ease-out, stroke 0.3s ease-in"
								: "stroke-dashoffset 1s ease-out, stroke 0.5s ease-in",
						animation:
							animState === "drawing"
								? "strokePulse 0.8s infinite ease-in-out"
								: "none",
					}}
				/>
			</svg>
		</div>
	);
}
