import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import Image from "next/image";

export function StatsSection() {
	return (
		<section id="results" className="py-24 bg-background">
			<div className="container mx-auto px-4">
				<div className="mb-16">
					<Tag variant="sectionLabel" className="mb-4">
						Track record
					</Tag>
					<h2 className="text-4xl md:text-5xl font-medium mb-6 text-balance">
						Built and proven across industries
					</h2>
					<div className="flex justify-between items-start">
						<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
							We've delivered automations that stick. Real workflows for real
							teams. The numbers speak to what happens when you build something
							that actually solves the problem.
						</p>
						<div className="hidden lg:flex gap-4">
							<Button
								variant="outline"
								className="rounded-full bg-transparent"
								asChild
							>
								<Link href="#contact">Contact us</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Bento Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
					{/* Large stat card */}
					<Card className="p-8 bg-card border-border hover:shadow-lg transition-shadow md:row-span-2">
						<div className="h-full flex flex-col">
							<div className="text-7xl font-bold mb-4">20+</div>
							<div className="mt-auto">
								<h3 className="text-xl font-semibold mb-2">
									Automations deployed
								</h3>
								<p className="text-muted-foreground leading-relaxed">
									Custom workflows built across industries and tools.
								</p>
							</div>
						</div>
					</Card>

					{/* Image card */}
					<Card className="overflow-hidden bg-muted border-border">
						<div className="h-full min-h-[200px]">
							<Image
								src="/images/n8n-shots-workflow-16-9.png"
								alt="N8N workflow"
								className="w-full h-full object-cover"
								width={400}
								height={240}
							/>
						</div>
					</Card>

					{/* Satisfaction card */}
					<Card className="p-8 bg-card border-border hover:shadow-lg transition-shadow">
						<div className="text-7xl font-bold mb-4">100%</div>
						<h3 className="text-xl font-semibold mb-2">
							Customer satisfaction rate
						</h3>
						<p className="text-muted-foreground leading-relaxed">
							We solve problems. We don't leave them half-finished.
						</p>
					</Card>

					{/* Years card */}
					<Card className="p-8 bg-card border-border hover:shadow-lg transition-shadow">
						<div className="text-7xl font-bold mb-4">6+</div>
						<h3 className="text-xl font-semibold mb-2">Years in the field</h3>
						<p className="text-muted-foreground leading-relaxed">
							From websites to automations, we've delivered.
						</p>
					</Card>

					{/* Image card 2 */}
					<Card className="overflow-hidden bg-muted border-border">
						<div className="h-full min-h-[200px]">
							<Image
								src="/images/creatopy-E3LsanLgkLM-unsplash copy.avif"
								alt="Group of people working together"
								className="w-full h-full object-cover"
								width={400}
								height={240}
							/>
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}
