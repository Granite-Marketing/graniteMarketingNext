import { Nav } from "@/components/nav";
import { BlogPostHero } from "@/components/blog-post-hero";
import { PostContent } from "@/components/post-content";
import { ContentCtaBanner } from "@/components/content-cta-banner";
import { RelatedPosts } from "@/components/related-posts";
import { Footer } from "@/components/footer";
import { PageBuilder } from "@/components/page-builder";
import { notFound } from "next/navigation";
import {
	getBlogPost,
	getBlogPostSlugs,
	getBlogPosts,
	getBlogPostTemplatePublished,
	getBlogPostTemplate,
	getPageCtaDefaults,
} from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import type { PortableTextBlock } from "@portabletext/types";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Metadata } from "next";
import { siteConfig, pageMetadata } from "@/lib/seo";
import { stegaClean } from "next-sanity";
import { calculateReadTime } from "@/lib/utils/read-time";

// ISR with 1 hour revalidation for blog posts (disabled in development)
export const revalidate = 3600; // 1 hour

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
	relatedTemplates?: {
		_id: string;
		title: string;
		slug: { current: string };
		n8nUrl?: string;
		youtubeUrl?: string;
	}[];
	standaloneTemplateLink?: {
		n8nUrl?: string;
		youtubeUrl?: string;
	};
};

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	// stegaClean strips the invisible characters that power click-to-edit.
	// They are harmless in rendered copy but would corrupt <title>, meta tags
	// and canonical URLs — where they reach search engines.
	const post = stegaClean(
		await getBlogPost(slug)
	) as SanityBlogPostDetail | null;

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

	const [related, templatePublished, ctaDefaults] = await Promise.all([
		getBlogPosts(),
		getBlogPostTemplatePublished(),
		getPageCtaDefaults() as Promise<SiteSettingsCtaDefaults | null>,
	]);

	// blogPostTemplate (U19b of the Sanity page builder plan, Phase 6) exists
	// ONLY as a draft right now, and dev/production share one Sanity dataset
	// (see app/page.tsx's generateMetadata for the full rationale this
	// mirrors), so this must resolve to no extra sections around any post
	// until an editor PUBLISHES it — never at deploy time. getBlogPostTemplate
	// is only called once the check above has proved a published document
	// exists, exactly like getBlogListing following getBlogListingPublished
	// in app/blog/page.tsx (U21).
	const template = templatePublished ? await getBlogPostTemplate() : null;
	const sectionsAbove = template?.sectionsAbove ?? [];
	const sectionsBelow = template?.sectionsBelow ?? [];

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
		readTime: calculateReadTime((post.content ?? []) as PortableTextBlock[]),
		author: post.author?.name ?? "Granite Marketing",
		image: getImageUrl(post.featuredImage as any) || "",
	};

	const relatedTemplates = post.relatedTemplates?.map((t) => ({
		slug: t.slug.current,
		n8nUrl: t.n8nUrl,
		youtubeUrl: t.youtubeUrl,
	}));

	const stl = post.standaloneTemplateLink;
	const hasStandalone = stl && (stl.n8nUrl || stl.youtubeUrl);

	const templateLinks =
		relatedTemplates && relatedTemplates.length > 0
			? relatedTemplates
			: hasStandalone
				? [
						{
							slug: undefined as string | undefined,
							n8nUrl: stl!.n8nUrl,
							youtubeUrl: stl!.youtubeUrl,
						},
					]
				: undefined;

	return (
		<div className="min-h-screen bg-background">
			<Nav />
			{sectionsAbove.length > 0 && (
				<PageBuilder
					documentId={template!._id}
					documentType={template!._type}
					sections={sectionsAbove}
					sectionsPath="sectionsAbove"
					siteSettingsCtaDefaults={ctaDefaults}
				/>
			)}
			<BlogPostHero post={heroPost} slug={slug} relatedTemplates={templateLinks} />
			<PostContent content={(post.content ?? []) as PortableTextBlock[]} />
			<ContentCtaBanner />
			<RelatedPosts posts={related as any[]} currentSlug={post.slug.current} />
			{sectionsBelow.length > 0 && (
				<PageBuilder
					documentId={template!._id}
					documentType={template!._type}
					sections={sectionsBelow}
					sectionsPath="sectionsBelow"
					siteSettingsCtaDefaults={ctaDefaults}
				/>
			)}
			<Footer />
		</div>
	);
}
