import { Navigation } from "@/components/navigation";
import { BlogHero } from "@/components/blog-hero";
import { BlogGrid } from "@/components/blog-grid";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { getBlogPosts } from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";

export const metadata = {
	title: "Blog - Granite Marketing | AI Automation Insights",
	description:
		"Discover the latest insights, tutorials, and best practices in AI automation, workflow optimization, and business process improvement.",
};

type SanityBlogPost = {
	_id: string;
	slug?: { current?: string };
	title: string;
	excerpt?: string;
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
			category: post.categories?.[0]?.name ?? "Article",
			date: post.publishedAt
				? new Date(post.publishedAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})
				: "",
			readTime: "5 min read",
			image: getImageUrl(post.featuredImage as any) ?? "",
			featured: post.featured ?? false,
		})) ?? [];

	return (
		<>
			<Navigation />
			<main className="min-h-screen">
				<BlogHero />
				<BlogGrid posts={posts} />
				<CTASection />
				<Footer />
			</main>
			<Footer />
		</>
	);
}
