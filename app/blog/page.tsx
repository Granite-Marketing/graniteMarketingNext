import { RelayNav } from "@/components/nav";
import { ContentHero } from "@/components/content-hero";
import { BlogGrid } from "@/components/blog-grid";
import { RelayCTA } from "@/components/cta";
import { RelayFooter } from "@/components/footer";
import { getBlogPosts } from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import { calculateReadTime } from "@/lib/utils/read-time";
import type { PortableTextBlock } from "@portabletext/types";
import { stegaClean } from "next-sanity";

export const metadata = {
	title: "Blog - Granite Marketing | AI Automation Insights",
	description:
		"Discover the latest insights, tutorials, and best practices in AI automation, workflow optimization, and business process improvement.",
};

// ISR with 1 hour revalidation for blog listing (disabled in development)
export const revalidate = 3600; // 1 hour

type SanityBlogPost = {
	_id: string;
	slug?: { current?: string };
	title: string;
	excerpt?: string;
	content?: PortableTextBlock[];
	publishedAt?: string;
	featuredImage?: unknown;
	categories?: { name?: string }[];
	featured?: boolean;
};

export default async function BlogPage() {
	const postsFromSanity = (await getBlogPosts()) as SanityBlogPost[];

	const posts =
		postsFromSanity?.map((post) => ({
			id: post._id,
			slug: post.slug?.current ?? "",
			title: post.title,
			description: post.excerpt ?? "",
			// Cleaned because this value is used as a filter identifier and
			// compared with === downstream. Stega characters break equality.
			category: stegaClean(post.categories?.[0]?.name) ?? "Article",
			date: post.publishedAt
				? new Date(post.publishedAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})
				: "",
			readTime: calculateReadTime((post.content ?? []) as PortableTextBlock[]),
			image: getImageUrl(post.featuredImage as any) ?? "",
			featured: post.featured ?? false,
		})) ?? [];

	return (
		<>
			<RelayNav />
			<main className="min-h-screen">
				<ContentHero
					tag="Blog & Insights"
					heading="Automation insights that matter"
					subtitle="Stay ahead with the latest strategies, case studies, and best practices in AI-powered workflow automation."
					patternId="blog-grid"
				/>
				<BlogGrid posts={posts} />
				<RelayCTA />
			</main>
			<RelayFooter />
		</>
	);
}
