"use client";
import { Tag } from "@/components/ui/tag";
import { Calendar, Clock, Users } from "lucide-react";
import { NeuralBackground } from "@/components/ui/neutral-background";

export function CTASection() {
	return (
		<section
			id="contact"
			className="py-32 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden"
		>
			<div className="absolute inset-0 z-0">
				<NeuralBackground preset="accent" className="opacity-80" />
			</div>

			<div className="absolute inset-0 opacity-[0.02]">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id="booking-grid"
							x="0"
							y="0"
							width="60"
							height="60"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 60 0 L 0 0 0 60"
								fill="none"
								stroke="currentColor"
								strokeWidth="1"
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#booking-grid)" />
				</svg>
			</div>

			<div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl animate-pulse" />

			<div className="container mx-auto px-4 relative">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<Tag variant="sectionLabel" className="mb-6">
							Let's Talk
						</Tag>
						<h2 className="mb-6 text-balance">
							Ready to transform your workflow?
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
							Book a free consultation call to discuss your automation needs.
							We'll explore how we can streamline your operations and boost
							efficiency.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6 mb-16">
						<div className="group p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
								<Calendar className="w-6 h-6 text-primary" />
							</div>
							<h3 className="mb-2">Flexible Scheduling</h3>
							<p className="text-muted-foreground">
								Choose a time that works best for you from our available slots
							</p>
						</div>

						<div className="group p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
								<Clock className="w-6 h-6 text-primary" />
							</div>
							<h3 className="mb-2">30-Minute Session</h3>
							<p className="text-muted-foreground">
								Enough time to understand your needs and explore solutions
							</p>
						</div>

						<div className="group p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
								<Users className="w-6 h-6 text-primary" />
							</div>
							<h3 className="mb-2">Expert Guidance</h3>
							<p className="text-muted-foreground">
								Connect directly with our automation specialists
							</p>
						</div>
					</div>

					<div className="relative">
						{/* Glass morphism container */}
						<div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-tertiary/5 to-primary/10 rounded-3xl blur-2xl" />

						<div className="relative backdrop-blur-sm bg-card/50 border-2 border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
							{/* Placeholder for Cal.com iframe */}
							<div className="relative aspect-video md:aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 border border-border/30">
								{/* Placeholder content */}
								<div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
									<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
										<Calendar className="w-10 h-10 text-primary" />
									</div>
									<h3 className="mb-3">Calendar Booking Widget</h3>
									<p className="text-muted-foreground mb-6 max-w-md">
										Cal.com iframe embed will be placed here for seamless
										appointment scheduling
									</p>
									<div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/30">
										<div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
										Integration Ready
									</div>
								</div>

								{/* Decorative grid overlay */}
								<div className="absolute inset-0 opacity-[0.03]">
									<svg
										className="w-full h-full"
										xmlns="http://www.w3.org/2000/svg"
									>
										<defs>
											<pattern
												id="cal-grid"
												x="0"
												y="0"
												width="40"
												height="40"
												patternUnits="userSpaceOnUse"
											>
												<path
													d="M 40 0 L 0 0 0 40"
													fill="none"
													stroke="currentColor"
													strokeWidth="1"
												/>
											</pattern>
										</defs>
										<rect width="100%" height="100%" fill="url(#cal-grid)" />
									</svg>
								</div>
							</div>

							{/* Additional CTA text below booking widget */}
							<div className="mt-8 text-center">
								<p className="text-sm text-muted-foreground mb-4">
									Prefer to reach out directly? Email us at{" "}
									<a
										href="mailto:hello@granitemarketing.co.uk"
										className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
									>
										hello@granitemarketing.co.uk
									</a>
								</p>
								<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
									<div className="w-1.5 h-1.5 rounded-full bg-primary" />
									<span>Usually responds within 24 hours</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
