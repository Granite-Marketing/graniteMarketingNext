"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import Image from "next/image";

const steps = [
	{
		number: "01",
		title: "Map it out",
		description:
			"We listen to how your team moves through each day and find where time gets lost.",
	},
	{
		number: "02",
		title: "Design it",
		description:
			"Our automations take shape in n8n, built to fit your exact workflow without forcing change.",
	},
	{
		number: "03",
		title: "Deploy it",
		description:
			"The workflow goes live. Your systems talk. The work that mattered gets done in minutes.",
	},
];

export function Approach() {
	const [activeTab, setActiveTab] = useState("0");
	const [isPaused, setIsPaused] = useState(false);
	const [progress, setProgress] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const startAutoAdvance = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}

			// Reset progress
			setProgress(0);

			// Update progress every 40ms for smooth animation (4000ms / 100 steps)
			progressIntervalRef.current = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 100) return 0;
					return prev + 1;
				});
			}, 40);

			intervalRef.current = setInterval(() => {
				if (!isPaused) {
					setActiveTab((prev) => {
						const currentIndex = Number.parseInt(prev);
						const nextIndex = (currentIndex + 1) % steps.length;
						return nextIndex.toString();
					});
					setProgress(0);
				}
			}, 4000);
		};

		if (!isPaused) {
			startAutoAdvance();
		} else {
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (pauseTimeoutRef.current) {
				clearTimeout(pauseTimeoutRef.current);
			}
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, [isPaused]);

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		setIsPaused(true);
		setProgress(0);

		if (pauseTimeoutRef.current) {
			clearTimeout(pauseTimeoutRef.current);
		}

		pauseTimeoutRef.current = setTimeout(() => {
			setIsPaused(false);
		}, 10000);
	};

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (pauseTimeoutRef.current) {
				clearTimeout(pauseTimeoutRef.current);
			}
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, []);

	return (
		<section id="process" className="py-24 bg-background">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<Tag variant="sectionLabel" className="mb-4">
						Our Process
					</Tag>
					<h2 className="mb-6 text-balance">How we build your automations</h2>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full max-w-7xl mx-auto"
				>
					<div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
						{/* Left side - Visual panel with centered icon */}
						<div className="relative h-[600px] rounded-2xl overflow-hidden bg-muted/5 border border-border/50 order-2 lg:order-1 flex items-center justify-center group">
							{/* Background image with overlay */}
							<div className="absolute inset-0">
								<Image
									src="/images/abstract-workflow-automation.jpg"
									width={800}
									height={800}
									alt="Process visualization"
									className="w-full h-full object-cover opacity-40 absolute inset-0"
								/>
								<div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
							</div>

							{/* Centered analysis icon */}
							<div className="relative z-10 flex flex-col items-center gap-6">
								{/* Status indicator */}
								<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border/30">
									<div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
									<span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
										{steps[Number(activeTab)].title
											.toUpperCase()
											.replace(" ", "_")}
									</span>
								</div>
							</div>
						</div>

						{/* Right side - Step cards */}
						<div className="space-y-4 order-1 lg:order-2">
							{steps.map((step, index) => {
								const isActive = activeTab === index.toString();
								return (
									<button
										key={index}
										onClick={() => handleTabChange(index.toString())}
										className={`block w-full text-left transition-all duration-300 rounded-xl overflow-hidden border-2 ${
											isActive
												? "bg-card border-primary/50 shadow-lg shadow-primary/10"
												: "bg-muted/20 border border-border/30 hover:border-border/60 hover:bg-muted/30"
										}`}
									>
										<div className="p-6 relative">
											{/* Progress indicator for active card */}
											{isActive && !isPaused && (
												<div
													className="absolute left-0 top-0 w-1 bg-primary transition-all duration-100 ease-linear rounded-r"
													style={{ height: `${progress}%` }}
												/>
											)}

											{/* Step number badge */}
											<div
												className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 font-mono text-sm ${
													isActive
														? "bg-primary/20 text-primary border border-primary/30"
														: "bg-muted/50 text-muted-foreground border border-border/30"
												}`}
											>
												{step.number}
											</div>

											{/* Title and description */}
											<h3
												className={`mb-3 transition-colors ${isActive ? "text-foreground" : "text-foreground/70"}`}
											>
												{step.title}
											</h3>

											<p
												className={`text-sm leading-relaxed mb-3 transition-colors ${
													isActive
														? "text-muted-foreground"
														: "text-muted-foreground/60"
												}`}
											>
												{step.description}
											</p>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</Tabs>
			</div>
		</section>
	);
}
