import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ExternalLink, Youtube, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/sanity/lib/adapters";

interface RelatedTemplatesProps {
	templates: any[];
	currentSlug: string;
}

export function RelatedTemplates({ templates, currentSlug }: RelatedTemplatesProps) {
	const relatedTemplates = templates
		.filter((t) => t.slug?.current !== currentSlug)
		.slice(0, 3);

	if (relatedTemplates.length === 0) return null;

	return (
		<section className="py-24 bg-gradient-to-b from-background to-muted/10">
			<div className="container mx-auto px-4">
				<div className="max-w-7xl mx-auto">
					{/* Section header */}
					<div className="text-center mb-16">
						<div className="flex items-center gap-2 justify-center mb-6">
							<div className="h-px w-20 bg-gradient-to-r from-transparent to-border" />
							<Tag
								variant="sectionLabel"
								size="sm"
								className="uppercase tracking-wider"
							>
								More Templates
							</Tag>
							<div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
						</div>
						<h2 className="text-4xl md:text-5xl font-bold mb-4">
							Explore more templates
						</h2>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
							Discover more ready-to-use workflow templates for your automation needs
						</p>
					</div>

					{/* Related templates grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{relatedTemplates.map((template) => (
							<Card
								key={template._id}
								className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 bg-card h-full flex flex-col"
							>
								<Link
									href={`/templates/${template.slug.current}`}
									className="flex flex-col h-full"
								>
									<div className="relative h-48 overflow-hidden bg-muted">
										<Image
											src={
												getImageUrl(template.featuredImage as any) ||
												"/placeholder.svg"
											}
											alt={template.title}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute top-4 left-4">
											<Tag variant="category">
												{template.categories?.[0]?.name ?? "Template"}
											</Tag>
										</div>
									</div>

									<CardContent className="p-6 flex flex-col flex-1">
										<div className="flex items-center gap-3 mb-3">
											<Tag
												variant="published"
												size="sm"
												className="flex items-center gap-1"
											>
												<Calendar className="w-3 h-3" />
												{template.publishedAt
													? new Date(template.publishedAt).toLocaleDateString(
															undefined,
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															}
													  )
													: ""}
											</Tag>
										</div>

										<h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 text-balance">
											{template.title}
										</h3>

										<p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 text-pretty">
											{template.excerpt}
										</p>

										<div className="flex items-center justify-between mt-auto">
											<div className="flex items-center gap-2">
												{template.n8nUrl && (
													<Tag variant="published" size="sm" className="flex items-center gap-1">
														<ExternalLink className="w-3 h-3" />
														n8n
													</Tag>
												)}
												{template.youtubeUrl && (
													<Tag variant="published" size="sm" className="flex items-center gap-1">
														<Youtube className="w-3 h-3" />
														YouTube
													</Tag>
												)}
												{template.loomUrl && (
													<Tag variant="published" size="sm" className="flex items-center gap-1">
														<Video className="w-3 h-3" />
														Loom
													</Tag>
												)}
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="w-fit group-hover:translate-x-2 transition-transform duration-300 text-primary px-0"
											>
												View template
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Link>
							</Card>
						))}
					</div>

					{/* View all link */}
					<div className="text-center mt-12">
						<Link href="/templates">
							<Button
								variant="outline"
								size="lg"
								className="border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
							>
								View all templates
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
