import { Navigation } from "@/components/navigation";
import { BlogPostHero } from "@/components/blog-post-hero";
import { BlogPostContent } from "@/components/blog-post-content";
import { BlogCtaBanner } from "@/components/blog-cta-banner";
import { RelatedPosts } from "@/components/related-posts";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import {
	getBlogPost,
	getBlogPostSlugs,
	getBlogPosts,
} from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";
import { siteConfig, pageMetadata } from "@/lib/seo";

// ISR with 1 hour revalidation for blog posts
export const revalidate = 3600;

export async function generateStaticParams() {
	const slugs = await getBlogPostSlugs();
	return slugs;
}

type SanityBlogPostDetail = {
	_id: string;
	title: string;
	slug: { current: string };
	excerpt?: string;
	content?: PortableTextBlock[];
	publishedAt?: string;
	featuredImage?: unknown;
	categories?: { name?: string }[];
	author?: { name?: string };
	seo?: {
		metaTitle?: string;
		metaDescription?: string;
	};
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = (await getBlogPost(slug)) as SanityBlogPostDetail | null;

	if (!post) {
		// Fallback to generic blog metadata if post is missing
		const blogMeta = pageMetadata.blog;
		return {
			title: blogMeta.title,
			description: blogMeta.description,
		};
	}

	const metaTitle = post.seo?.metaTitle || post.title;
	const metaDescription =
		post.seo?.metaDescription || post.excerpt || pageMetadata.blog.description;

	const imageUrl =
		getImageUrl(post.featuredImage as any) || siteConfig.defaultImage;
	const canonicalUrl = `${siteConfig.url}/blog/${slug}`;

	return {
		title: metaTitle,
		description: metaDescription,
		openGraph: {
			title: metaTitle,
			description: metaDescription,
			url: canonicalUrl,
			type: "article",
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: metaTitle,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: metaTitle,
			description: metaDescription,
			images: [imageUrl],
		},
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = (await getBlogPost(slug)) as SanityBlogPostDetail | null;

	if (!post) {
		notFound();
	}

	const related = await getBlogPosts();

	const heroPost = {
		title: post.title,
		category: post.categories?.[0]?.name ?? "Article",
		date: post.publishedAt
			? new Date(post.publishedAt).toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
				})
			: "",
		readTime: "5 min read",
		author: post.author?.name ?? "Granite Marketing",
		image: getImageUrl(post.featuredImage as any) || "",
	};

	return (
		<div className="min-h-screen bg-background">
			<Navigation />
			<BlogPostHero post={heroPost} />
			<BlogPostContent content={(post.content ?? []) as PortableTextBlock[]} />
			<BlogCtaBanner />
			<RelatedPosts posts={related as any[]} currentSlug={post.slug.current} />
			<Footer />
		</div>
	);
}
