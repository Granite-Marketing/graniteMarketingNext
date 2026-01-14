"use client";

import Image from "next/image";
import {
	ArrowRightCircle,
	BarChart3,
	CircuitBoard,
	Code2,
	Database,
	Globe2,
	Layers,
	PlayCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import type { CaseStudyCard } from "@/lib/sanity/lib/adapters";

type CaseStudySectionProps = {
	caseStudies: CaseStudyCard[];
};

export function CaseStudySection({ caseStudies }: CaseStudySectionProps) {
	if (!caseStudies || caseStudies.length === 0) return null;

	return (
		<section
			id="results"
			className="py-24 bg-gradient-to-b from-background to-muted/20"
		>
			<div className="container mx-auto px-4">
				<div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<Tag variant="sectionLabel" className="mb-2">
							Automation in Action
						</Tag>
						<h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
							Case studies from real teams
						</h2>
						<p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
							A snapshot of the systems we&apos;ve shipped - what we automated,
							the stack behind it, and the lift it created. No fluff, just
							outcomes.
						</p>
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{caseStudies.map((study) => (
						<CaseStudyCardItem key={study.id} study={study} />
					))}
				</div>
			</div>
		</section>
	);
}

type CaseStudyCardItemProps = {
	study: CaseStudyCard;
};

function CaseStudyCardItem({ study }: CaseStudyCardItemProps) {
	const Wrapper = study.walkthroughUrl ? "a" : "div";
	const wrapperProps = study.walkthroughUrl
		? {
				href: study.walkthroughUrl,
				target: "_blank",
				rel: "noreferrer",
			}
		: {};

	const techStack = study.techStack;
	const results = study.results || [];

	return (
		<Card className="group flex h-full flex-col overflow-hidden border-border/50 bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
			<Wrapper className="flex h-full flex-col" {...(wrapperProps as any)}>
				<div className="relative h-32 overflow-hidden bg-muted">
					{/* {study.mainImageUrl ? (
						<Image
							src={study.mainImageUrl}
							alt={study.title}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-110"
						/>
					) : ( */}
					<div className="relative flex h-full items-center justify-center overflow-hidden bg-emerald-950/20">
						{/* Geometric Texture Background */}
						<div className="absolute inset-0 opacity-10">
							<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
								<defs>
									<pattern
										id={`pattern-${study.id}`}
										x="0"
										y="0"
										width="40"
										height="40"
										patternUnits="userSpaceOnUse"
									>
										<path
											d="M0 40L40 0M-10 10L10 -10M30 50L50 30"
											stroke="currentColor"
											strokeWidth="1"
											fill="none"
										/>
									</pattern>
								</defs>
								<rect
									width="100%"
									height="100%"
									fill={`url(#pattern-${study.id})`}
								/>
							</svg>
						</div>

						{results.length > 0 ? (
							<div className="relative z-10 flex flex-col items-center text-center">
								<span className="text-5xl font-bold tracking-tight text-emerald-400">
									{results[0].value}
								</span>
								<span className="font-mono text-[10px] font-medium uppercase tracking-widest text-emerald-500/80">
									{results[0].label}
								</span>
							</div>
						) : (
							<div className="relative z-10 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
								Case Study
							</div>
						)}
					</div>
					{/* )} */}
					<div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
						{study.industryName && (
							<Tag variant="interactive">{study.industryName}</Tag>
						)}
						{study.client && (
							<Tag variant="published" size="sm">
								{study.client}
							</Tag>
						)}
					</div>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
				</div>

				<CardContent className="flex flex-1 flex-col px-6 pt-6">
					<h3 className="mb-3 text-balance text-xl font-semibold transition-colors duration-300 group-hover:text-primary">
						{study.title}
					</h3>

					{study.excerpt && (
						<p className="mb-6 text-sm leading-relaxed text-muted-foreground text-pretty">
							{study.excerpt}
						</p>
					)}

					{/* Success Metrics Grid */}
					{results.length > 0 && (
						<div className="mb-6 grid grid-cols-2 gap-4 border-y border-border/50 py-4">
							{results.slice(0, 4).map((result, idx) => (
								<div key={idx} className="flex flex-col gap-0.5">
									<span className="text-3xl font-semibold text-emerald-400">
										{result.value}
									</span>
									<span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
										{result.label}
									</span>
								</div>
							))}
						</div>
					)}

					{techStack.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{techStack.map((tool) => (
								<Tag
									key={tool.title}
									variant="interactive"
									size="sm"
									className="border border-border/90 bg-background/40 text-xs"
								>
									<span className="mr-1 inline-flex items-center">
										<IntegrationIcon
											type={tool.integrationType}
											className="h-3 w-3"
										/>
									</span>
									{tool.title}
								</Tag>
							))}
						</div>
					)}

					{study.walkthroughUrl && (
						<div className="mt-auto flex items-center justify-between pt-5">
							<Button
								variant="ghost"
								size="sm"
								className="group/button inline-flex items-center gap-1 px-0 text-primary"
							>
								<>
									<span className="mr-1 text-xs uppercase tracking-wide">
										Watch walkthrough
									</span>
									<PlayCircle className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
								</>
							</Button>
						</div>
					)}
				</CardContent>
			</Wrapper>
		</Card>
	);
}

type IntegrationIconProps = {
	type?: string;
	className?: string;
};

function IntegrationIcon({ type, className }: IntegrationIconProps) {
	switch (type) {
		case "api":
			return <Code2 className={className} />;
		case "cms":
			return <Globe2 className={className} />;
		case "crm":
			return <Layers className={className} />;
		case "analytics":
			return <BarChart3 className={className} />;
		case "ads":
			return <CircuitBoard className={className} />;
		case "database":
			return <Database className={className} />;
		case "internal":
			return <Layers className={className} />;
		default:
			return <Code2 className={className} />;
	}
}
