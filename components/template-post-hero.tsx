"use client";

import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	ExternalLink,
	Youtube,
	Video,
	Download,
	Copy,
	Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface TemplatePostHeroProps {
	post: {
		title: string;
		category: string;
		date: string;
		author: string;
		image: string;
		workflowJsonUrl?: string;
		n8nUrl?: string;
		youtubeUrl?: string;
		loomUrl?: string;
	};
}

export function TemplatePostHero({ post }: TemplatePostHeroProps) {
	const [copied, setCopied] = useState(false);

	const handleCopyJson = async () => {
		if (!post.workflowJsonUrl) return;
		try {
			const response = await fetch(post.workflowJsonUrl);
			const json = await response.text();
			await navigator.clipboard.writeText(json);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Silently fail if clipboard API is unavailable
		}
	};

	const hasLinks =
		post.n8nUrl || post.youtubeUrl || post.loomUrl || post.workflowJsonUrl;

	return (
		<section className="relative pt-24 md:pb-24 bg-gradient-to-b from-background via-background to-muted/10 overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-tertiary/5 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="max-w-7xl mx-auto">
					{/* Breadcrumb */}
					<nav
						className="flex items-center gap-2 text-sm mb-12"
						aria-label="Breadcrumb"
					>
						<Link
							href="/templates"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Templates
						</Link>
						<span className="text-muted-foreground">&rsaquo;</span>
						<span className="text-foreground">{post.category}</span>
					</nav>

					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left column - Content */}
						<div className="space-y-6">
							<Tag variant="category" size="lg">
								{post.category}
							</Tag>

							<h1 className="text-3xl md:text-5xl font-semibold leading-tight text-balance">
								{post.title}
							</h1>

							<div className="flex flex-wrap items-center gap-3">
								<span className="text-sm text-muted-foreground">
									By {post.author}
								</span>
								<span className="text-muted-foreground">&bull;</span>
								<Tag variant="published" className="flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									Published {post.date}
								</Tag>
							</div>

							{/* Platform links + workflow JSON buttons */}
							{hasLinks && (
								<div className="pt-6">
									<p className="text-sm text-muted-foreground mb-3">
										Available on
									</p>
									<div className="flex flex-wrap gap-3">
										{post.workflowJsonUrl && (
											<Button
												size="icon"
												variant="outline"
												className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
												aria-label="Download workflow JSON"
												asChild
											>
												<a href={post.workflowJsonUrl} download>
													<Download className="w-4 h-4" />
												</a>
											</Button>
										)}
										{post.workflowJsonUrl && (
											<Button
												size="icon"
												variant="outline"
												className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
												aria-label="Copy workflow JSON to clipboard"
												onClick={handleCopyJson}
											>
												{copied ? (
													<Check className="w-4 h-4 text-green-500" />
												) : (
													<Copy className="w-4 h-4" />
												)}
											</Button>
										)}
										{post.n8nUrl && (
											<Button
												size="icon"
												variant="outline"
												className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
												aria-label="View on n8n"
												asChild
											>
												<a
													href={post.n8nUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="w-4 h-4" />
												</a>
											</Button>
										)}
										{post.youtubeUrl && (
											<Button
												size="icon"
												variant="outline"
												className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
												aria-label="Watch on YouTube"
												asChild
											>
												<a
													href={post.youtubeUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Youtube className="w-4 h-4" />
												</a>
											</Button>
										)}
										{post.loomUrl && (
											<Button
												size="icon"
												variant="outline"
												className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
												aria-label="Watch on Loom"
												asChild
											>
												<a
													href={post.loomUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Video className="w-4 h-4" />
												</a>
											</Button>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Right column - Featured image */}
						<div className="relative">
							<div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5">
								<Image
									src={post.image || "/placeholder.svg"}
									alt={post.title}
									fill
									className="object-cover"
									priority
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
