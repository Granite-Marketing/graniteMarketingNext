"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";

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
	{
		number: "04",
		title: "Review. Refine. Repeat.",
		description:
			"We use live feedback to improve, iterate, and scale so your automations keep delivering as your business evolves.",
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
		// Clean up any existing intervals
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
		}

		if (isPaused) {
			// If paused, stop progress animation
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
				progressIntervalRef.current = null;
			}
			return;
		}

		// Reset progress when starting
		setProgress(0);

		// Update progress every 40ms for smooth animation (4000ms / 100 steps)
		progressIntervalRef.current = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) return 0;
				return prev + 1;
			});
		}, 40);

		// Auto-advance to next tab every 4000ms
		intervalRef.current = setInterval(() => {
			setActiveTab((prev) => {
				const currentIndex = Number.parseInt(prev);
				const nextIndex = (currentIndex + 1) % steps.length;
				return nextIndex.toString();
			});
			setProgress(0);
		}, 4000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, [isPaused]);

	const handleTabChange = (value: string) => {
		// Clear any existing pause timeout
		if (pauseTimeoutRef.current) {
			clearTimeout(pauseTimeoutRef.current);
		}

		// Update the active tab
		setActiveTab(value);

		// Reset progress
		setProgress(0);

		// Pause auto-advance
		setIsPaused(true);

		// Resume auto-advance after 10 seconds
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
		<section id="process" className="py-24 bg-muted/10">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<Tag variant="sectionLabel" className="mb-4">
						Our Process
					</Tag>
					<h2 className="text-4xl md:text-5xl font-medium mb-6 text-balance">
						How we build your automations
					</h2>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full max-w-6xl mx-auto"
				>
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left side - Image placeholder */}
						<div className="relative h-[500px] rounded-2xl overflow-hidden bg-muted order-2 lg:order-1">
							<img
								src="/placeholder.svg?height=500&width=600"
								alt="Process visualization"
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Right side - Steps */}
						<div className="space-y-8 order-1 lg:order-2">
							{steps.map((step, index) => (
								<TabsContent
									key={index}
									value={index.toString()}
									className="mt-0"
								>
									<div className="space-y-6">
										<div className="border-l-2 border-foreground pl-6 py-2">
											<div className="text-sm text-primary font-mono mb-2">
												{step.number}
											</div>
											<h3 className="text-2xl md:text-3xl font-medium mb-3">
												{step.title}
											</h3>
											<p className="text-base text-muted-foreground leading-relaxed">
												{step.description}
											</p>
										</div>
									</div>
								</TabsContent>
							))}

							<div className="space-y-4 mt-8">
								{steps.map((step, index) => (
									<button
										key={index}
										onClick={() => handleTabChange(index.toString())}
										className={`block w-full text-left transition-all relative ${
											activeTab === index.toString()
												? "opacity-100"
												: "opacity-40"
										}`}
									>
										<div className="pl-6 py-2 relative">
											{activeTab === index.toString() && !isPaused && (
												<div
													className="absolute left-0 top-0 w-0.5 bg-primary transition-all duration-100 ease-linear"
													style={{ height: `${progress}%` }}
												/>
											)}
											{activeTab !== index.toString() && (
												<div className="absolute left-0 top-0 w-0.5 h-full bg-border/30" />
											)}
											<div className="text-xs text-primary/60 font-mono mb-1">
												{step.number}
											</div>
											<h4 className="text-xl md:text-2xl font-normal">
												{step.title}
											</h4>
										</div>
									</button>
								))}
							</div>
						</div>
					</div>
				</Tabs>
			</div>
		</section>
	);
}
