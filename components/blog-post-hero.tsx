"use client";

import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	Clock,
	LinkIcon,
	Linkedin,
	Facebook,
	Check,
	Download,
	ExternalLink,
} from "lucide-react";
import { XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface RelatedTemplate {
	title: string;
	slug: string;
	workflowJsonUrl?: string;
	n8nUrl?: string;
}

interface BlogPostHeroProps {
	post: {
		title: string;
		category: string;
		date: string;
		readTime: string;
		author: string;
		image: string;
	};
	slug: string;
	relatedTemplates?: RelatedTemplate[];
}

export function BlogPostHero({
	post,
	slug,
	relatedTemplates,
}: BlogPostHeroProps) {
	const [copied, setCopied] = useState(false);

	// Construct the full URL for sharing
	const postUrl =
		typeof window !== "undefined"
			? `${window.location.origin}/blog/${slug}`
			: `https://granitemarketing.co.uk/blog/${slug}`;

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(postUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Silently fail if clipboard API is unavailable
		}
	};

	const handleShareLinkedIn = () => {
		const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
		window.open(linkedInUrl, "_blank", "noopener,noreferrer");
	};

	const handleShareX = () => {
		const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`;
		window.open(xUrl, "_blank", "noopener,noreferrer");
	};

	const handleShareFacebook = () => {
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
		window.open(facebookUrl, "_blank", "noopener,noreferrer");
	};

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
							href="/blog"
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Blog
						</Link>
						<span className="text-muted-foreground">›</span>
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
								<span className="text-muted-foreground">•</span>
								<Tag variant="published" className="flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									Published {post.date}
								</Tag>
								<span className="text-muted-foreground">•</span>
								<Tag variant="published" className="flex items-center gap-1">
									<Clock className="w-4 h-4" />
									{post.readTime}
								</Tag>
							</div>

							{/* Social share */}
							<div className="pt-6">
								<p className="text-sm text-muted-foreground mb-3">
									Share this post
								</p>
								<div className="flex gap-3">
									<Button
										size="icon"
										variant="outline"
										className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
										aria-label="Copy link"
										onClick={handleCopyLink}
									>
										{copied ? (
											<Check className="w-4 h-4 text-green-500" />
										) : (
											<LinkIcon className="w-4 h-4" />
										)}
									</Button>
									<Button
										size="icon"
										variant="outline"
										className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
										aria-label="Share on LinkedIn"
										onClick={handleShareLinkedIn}
									>
										<Linkedin className="w-4 h-4" />
									</Button>
									<Button
										size="icon"
										variant="outline"
										className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
										aria-label="Share on X"
										onClick={handleShareX}
									>
										<XIcon className="w-4 h-4" />
									</Button>
									<Button
										size="icon"
										variant="outline"
										className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
										aria-label="Share on Facebook"
										onClick={handleShareFacebook}
									>
										<Facebook className="w-4 h-4" />
									</Button>
								</div>
							</div>

							{/* Template download */}
							{relatedTemplates && relatedTemplates.length > 0 && (
								<div className="pt-2">
									<p className="text-sm text-muted-foreground mb-3">
										{relatedTemplates.length === 1
											? "Get the template"
											: "Get the templates"}
									</p>
									<div className="flex flex-col gap-3">
										{relatedTemplates.map((template) => (
											<div
												key={template.slug}
												className="flex items-center gap-3"
											>
												{relatedTemplates.length > 1 && (
													<span className="text-sm text-foreground truncate max-w-[180px]">
														{template.title}
													</span>
												)}
												{template.workflowJsonUrl && (
													<Button
														size="icon"
														variant="outline"
														className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
														aria-label={`Download ${template.title}`}
														asChild
													>
														<a href={template.workflowJsonUrl} download>
															<Download className="w-4 h-4" />
														</a>
													</Button>
												)}
												<Button
													size="icon"
													variant="outline"
													className="hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors bg-transparent"
													aria-label={`View ${template.title} template`}
													asChild
												>
													<Link href={`/templates/${template.slug}`}>
														<ExternalLink className="w-4 h-4" />
													</Link>
												</Button>
											</div>
										))}
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
