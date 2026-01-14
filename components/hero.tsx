"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import type { LogoItem } from "@/lib/sanity/lib/adapters";
import { LogoList } from "@/components/logo-list";
import { useGSAP, gsap } from "@/lib/animations/gsap-config";

type HeroProps = {
	logos?: LogoItem[];
};

export function Hero({ logos }: HeroProps) {
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
					"-=0.25"
				)
				.to(
					path,
					{
						opacity: 0,
						duration: 0.5,
						ease: "power2.inOut",
					},
					"-=0.25"
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
					"-=0.25"
				)
				.to(
					path,
					{
						opacity: 0,
						duration: 0.5,
						ease: "power2.inOut",
					},
					"-=0.25"
				);
		},
		{ scope: borderRef }
	);

	return (
		<section
			id="hero"
			className="relative py-32 md:px-8 bg-muted/30 border-b border-border/40 overflow-hidden"
		>
			<div className="absolute inset-0 z-0">
				{/* Base gradient layer */}
				<div className="absolute inset-0 bg-gradient-to-br from-background via-muted/8 to-background" />

				{/* Diagonal accent gradient */}
				<div className="absolute inset-0 bg-gradient-to-tr from-primary/3 via-transparent to-tertiary/3" />

				{/* Animated subtle glow with slow pulse */}
				<div
					className="absolute inset-0 opacity-50 animate-pulse"
					style={{
						background:
							"radial-gradient(circle at 50% 50%, oklch(0.25 0.03 180 / 0.06) 0%, transparent 60%)",
						animationDuration: "8s",
					}}
				/>
			</div>
			{/* </CHANGE> */}

			<div className="container mx-auto z-10 relative md:px-4">
				<div className="max-w-4xl mx-auto text-center py-12 md:py-20 relative border border-border/50 rounded-xl md:p-8">
					{/* Reflective border animation overlay */}
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
							strokeWidth="1.2"
							vectorEffect="non-scaling-stroke"
							strokeLinecap="round"
							style={{ mixBlendMode: "screen", opacity: 0 }}
						/>
					</svg>
					<article className="relative z-10">
						<Tag variant="sectionLabel" className="mb-6">
							AI-Powered Automation
						</Tag>

						<h1 className="mb-8 text-balance leading-tight">
							Automate your workflows with AI
						</h1>

						<p className="text-lg md:text-xl mb-10 text-muted-foreground leading-relaxed max-w-3xl mx-auto text-balance">
							Automate the grind and focus on the growth. Building custom
							automations that work the way you do.
						</p>

						<footer className="flex flex-col items-center gap-8">
							<div className="flex flex-wrap gap-4 justify-center items-center">
								<Button
									size="lg"
									className="group relative rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
									asChild
								>
									<Link href="#contact">
										<span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer transition-all group-hover:animate-shimmer" />
										<span className="relative z-10">Get Started</span>
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="rounded-full px-8 bg-transparent hover:bg-primary/5 border-border/50 hover:border-primary/50 hover:text-primary transition-all duration-300 hover:scale-105"
									asChild
								>
									<Link href="#services">Services</Link>
								</Button>
							</div>

							{logos && logos.length > 0 && (
								<LogoList
									logos={logos}
									label="Trusted By"
									className="w-full max-w-3xl md:mt-6"
								/>
							)}
						</footer>
					</article>
				</div>
			</div>
		</section>
	);
}
