import { Navigation } from "@/components/navigation";
import { TemplatePostHero } from "@/components/template-post-hero";
import { PostContent } from "@/components/post-content";
import { ContentCtaBanner } from "@/components/content-cta-banner";
import { RelatedBlogPosts } from "@/components/related-blog-posts";
import { RelatedTemplates } from "@/components/related-templates";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import {
	getWorkflowTemplate,
	getWorkflowTemplateSlugs,
	getWorkflowTemplates,
} from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
	const slugs = await getWorkflowTemplateSlugs();
	return slugs;
}

type SanityWorkflowTemplateDetail = {
	_id: string;
	title: string;
	slug: { current: string };
	excerpt?: string;
	content?: PortableTextBlock[];
	publishedAt?: string;
	featuredImage?: unknown;
	categories?: { name?: string }[];
	author?: { name?: string };
	workflowJsonUrl?: string;
	n8nUrl?: string;
	youtubeUrl?: string;
	loomUrl?: string;
	railwayTemplates?: {
		label?: string;
		deployUrl?: string;
	}[];
	relatedBlogPosts?: {
		_id: string;
		title: string;
		slug: { current: string };
		excerpt?: string;
		featuredImage?: unknown;
		publishedAt?: string;
		content?: PortableTextBlock[];
		categories?: { name?: string }[];
	}[];
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
	const template = (await getWorkflowTemplate(slug)) as SanityWorkflowTemplateDetail | null;

	if (!template) {
		return {
			title: "Workflow Templates - Granite Marketing",
			description: "Browse our library of ready-to-use workflow templates.",
		};
	}

	const metaTitle = template.seo?.metaTitle || template.title;
	const metaDescription =
		template.seo?.metaDescription || template.excerpt || "Ready-to-use workflow template for business automation.";

	const imageUrl =
		getImageUrl(template.featuredImage as any) || siteConfig.defaultImage;
	const canonicalUrl = `${siteConfig.url}/templates/${slug}`;

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

export default async function TemplateDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const template = (await getWorkflowTemplate(slug)) as SanityWorkflowTemplateDetail | null;

	if (!template) {
		notFound();
	}

	const related = await getWorkflowTemplates();

	const heroPost = {
		title: template.title,
		category: template.categories?.[0]?.name ?? "Template",
		date: template.publishedAt
			? new Date(template.publishedAt).toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
				})
			: "",
		author: template.author?.name ?? "Granite Marketing",
		image: getImageUrl(template.featuredImage as any) || "",
		workflowJsonUrl: template.workflowJsonUrl,
		n8nUrl: template.n8nUrl,
		youtubeUrl: template.youtubeUrl,
		loomUrl: template.loomUrl,
		railwayTemplates:
			template.railwayTemplates?.filter(
				(rt) => rt?.deployUrl && rt?.label
			) as { label: string; deployUrl: string }[] | undefined,
		relatedBlogPosts: template.relatedBlogPosts?.map((p) => ({
			title: p.title,
			slug: p.slug.current,
		})),
	};

	return (
		<div className="min-h-screen bg-background">
			<Navigation />
			<TemplatePostHero post={heroPost} />
			<PostContent content={(template.content ?? []) as PortableTextBlock[]} />
			{template.relatedBlogPosts && template.relatedBlogPosts.length > 0 && (
				<RelatedBlogPosts posts={template.relatedBlogPosts as any[]} />
			)}
			<ContentCtaBanner />
			<RelatedTemplates templates={related as any[]} currentSlug={template.slug.current} />
			<Footer />
		</div>
	);
}
