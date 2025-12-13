import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import {
	FolderKanban,
	Users,
	FileText,
	Bot,
	Search,
	GraduationCap,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const capabilities = [
	{
		icon: <FolderKanban className="w-10 h-10 text-primary" />,
		title: "Project management",
		description: "Keep your systems in sync and your team aligned.",
		gradient: "from-primary/10 to-transparent",
	},
	{
		icon: <Users className="w-10 h-10 text-primary" />,
		title: "Lead generation",
		description: "Automated, multi-channel outreach that scales.",
		gradient: "from-tertiary/10 to-transparent",
	},
	{
		icon: <FileText className="w-10 h-10 text-primary" />,
		title: "Content generation",
		description: "Produce blogs, research, and social posts—on autopilot.",
		gradient: "from-accent/10 to-transparent",
	},
	{
		icon: <Bot className="w-10 h-10 text-primary" />,
		title: "AI Agents",
		description: "Autonomous agents that handle the heavy lifting.",
		gradient: "from-primary/10 to-transparent",
	},
	{
		icon: <Search className="w-10 h-10 text-primary" />,
		title: "Research assistant",
		description: "AI support to help you make smarter decisions.",
		gradient: "from-tertiary/10 to-transparent",
	},
	{
		icon: <GraduationCap className="w-10 h-10 text-primary" />,
		title: "Educational tools",
		description: "Turn raw data into actionable learning content.",
		gradient: "from-accent/10 to-transparent",
	},
];

export function Capabilities() {
	return (
		<section
			id="services"
			className="py-24 bg-gradient-to-b from-muted/20 via-muted/10 to-background relative overflow-hidden"
		>
			<div className="absolute inset-0 opacity-[0.02]">
				<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id="cap-dots"
							x="0"
							y="0"
							width="32"
							height="32"
							patternUnits="userSpaceOnUse"
						>
							<circle cx="16" cy="16" r="1" fill="currentColor" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#cap-dots)" />
				</svg>
			</div>

			<div className="container mx-auto px-4 relative">
				<div className="text-center mb-6">
					<Tag variant="sectionLabel" className="mb-4">
						Services
					</Tag>
					<h2 className="text-4xl md:text-5xl font-medium mb-6 text-balance">
						Six ways we build your advantage
					</h2>
					<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty mb-16">
						Connect everything you use. Granite Marketing links your tools
						seamlessly, creating workflows that speak the same language your
						business does.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{capabilities.map((capability, index) => (
						<Card
							key={index}
							className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 bg-card border-border/50 hover:border-primary/30 relative overflow-hidden"
						>
							<div
								className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
							/>

							<CardContent className="p-8 relative z-10">
								<div className="mb-6 p-3 bg-primary/10 rounded-xl w-fit group-hover:bg-primary/15 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-110 transform">
									{capability.icon}
								</div>
								<h3 className="text-xl mb-4 group-hover:text-primary transition-colors duration-300">
									{capability.title}
								</h3>
								<p className="text-muted-foreground leading-relaxed">
									{capability.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
				<footer className="flex justify-center mt-10">
					<Button size="lg" variant="default" className="rounded-full" asChild>
						<Link href="#contact">Get Started</Link>
					</Button>
				</footer>
			</div>
		</section>
	);
}
