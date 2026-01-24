import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/sanity/lib/adapters";

interface RelatedPostsProps {
	posts: any[];
	currentSlug: string;
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
	const relatedPosts = posts
		.filter((post) => post.slug?.current !== currentSlug)
		.slice(0, 3);

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
								Related Articles
							</Tag>
							<div className="h-px w-20 bg-gradient-to-l from-transparent to-border" />
						</div>
						<h2 className="text-4xl md:text-5xl font-bold mb-4">
							Continue reading
						</h2>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
							Explore more insights and strategies to enhance your automation
							journey
						</p>
					</div>

					{/* Related posts grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{relatedPosts.map((post) => (
							<Card
								key={post._id}
								className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 bg-card h-full flex flex-col"
							>
								<Link
									href={`/blog/${post.slug.current}`}
									className="flex flex-col h-full"
								>
									<div className="relative h-48 overflow-hidden bg-muted">
										<Image
											src={
												getImageUrl(post.featuredImage as any) ||
												"/placeholder.svg"
											}
											alt={post.title}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute top-4 left-4">
											<Tag variant="category">
												{post.categories?.[0]?.name ?? "Article"}
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
												{post.publishedAt
													? new Date(post.publishedAt).toLocaleDateString()
													: ""}
											</Tag>
											<span className="text-muted-foreground">•</span>
											<Tag
												variant="published"
												size="sm"
												className="flex items-center gap-1"
											>
												<Clock className="w-3 h-3" />
												{"5 min read"}
											</Tag>
										</div>

										<h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300 text-balance">
											{post.title}
										</h3>

										<p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 text-pretty">
											{post.excerpt}
										</p>

										<Button
											variant="ghost"
											size="sm"
											className="w-fit group-hover:translate-x-2 transition-transform duration-300 text-primary px-0"
										>
											Read article
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</CardContent>
								</Link>
							</Card>
						))}
					</div>

					{/* View all link */}
					<div className="text-center mt-12">
						<Link href="/blog">
							<Button
								variant="outline"
								size="lg"
								className="border-border/50 hover:border-primary/50 hover:bg-primary/10 bg-transparent"
							>
								View all articles
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
