import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import { calculateReadTime } from "@/lib/utils/read-time";
import type { PortableTextBlock } from "@portabletext/types";

interface RelatedPostsProps {
	posts: any[];
	currentSlug: string;
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
	const relatedPosts = posts
		.filter((post) => post.slug?.current !== currentSlug)
		.slice(0, 3);

	if (relatedPosts.length === 0) return null;

	return (
		<section aria-labelledby="related-heading" className="border-t border-border">
			<div className="container mx-auto px-6 py-24">
				<header className="max-w-2xl">
					<p className="mb-4 font-mono text-[13px] text-primary">
						{"// keep reading"}
					</p>
					<h2
						id="related-heading"
						className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
					>
						Continue reading
					</h2>
				</header>

				<ul className="mt-13 grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
					{relatedPosts.map((post) => (
						<li key={post._id}>
							<article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50">
								<Link
									href={`/blog/${post.slug.current}`}
									className="flex h-full flex-col"
								>
									<div className="relative h-44 overflow-hidden border-b border-border bg-muted">
										<Image
											src={
												getImageUrl(post.featuredImage as any) ||
												"/placeholder.svg"
											}
											alt={post.title}
											fill
											className="object-cover"
										/>
									</div>

									<div className="flex grow flex-col p-6">
										<p className="mb-3 font-mono text-[11px] text-muted-foreground">
											<span className="text-primary">
												{"// "}
												{(post.categories?.[0]?.name ?? "article").toLowerCase()}
											</span>
											{post.publishedAt && (
												<>
													{" · "}
													{new Date(post.publishedAt).toLocaleDateString(
														undefined,
														{
															year: "numeric",
															month: "short",
															day: "numeric",
														}
													)}
												</>
											)}
											{" · "}
											{calculateReadTime(
												(post.content ?? []) as PortableTextBlock[]
											)}
										</p>

										<h3 className="text-balance text-xl font-semibold tracking-tight text-foreground">
											{post.title}
										</h3>

										<p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
											{post.excerpt}
										</p>

										<p className="mt-auto pt-6 font-mono text-[13px] text-primary">
											Read article <span aria-hidden="true">→</span>
										</p>
									</div>
								</Link>
							</article>
						</li>
					))}
				</ul>

				<div className="mt-10">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 rounded border border-border px-5 py-3 font-mono text-[13px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
					>
						View all articles <span aria-hidden="true">→</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
