import { Nav } from "@/components/nav";
import { TemplatePostHero } from "@/components/template-post-hero";
import { PostContent } from "@/components/post-content";
import { ContentCtaBanner } from "@/components/content-cta-banner";
import { RelatedBlogPosts } from "@/components/related-blog-posts";
import { RelatedTemplates } from "@/components/related-templates";
import { Footer } from "@/components/footer";
import { PageBuilder } from "@/components/page-builder";
import { notFound } from "next/navigation";
import {
	getWorkflowTemplate,
	getWorkflowTemplateSlugs,
	getWorkflowTemplates,
	getTemplateDetailPublished,
	getTemplateDetail,
	getPageCtaDefaults,
} from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import type { PortableTextBlock } from "@portabletext/types";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import { stegaClean } from "next-sanity";

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
	// stegaClean strips the invisible characters that power click-to-edit.
	// They are harmless in rendered copy but would corrupt <title>, meta tags
	// and canonical URLs — where they reach search engines.
	const template = stegaClean(
		await getWorkflowTemplate(slug)
	) as SanityWorkflowTemplateDetail | null;

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

	const [related, templateDetailPublished, ctaDefaults] = await Promise.all([
		getWorkflowTemplates(),
		getTemplateDetailPublished(),
		getPageCtaDefaults() as Promise<SiteSettingsCtaDefaults | null>,
	]);

	// templateDetail (U19b of the Sanity page builder plan, Phase 6) exists
	// ONLY as a draft right now, and dev/production share one Sanity dataset
	// (see app/page.tsx's generateMetadata for the full rationale this
	// mirrors), so this must resolve to no extra sections around any
	// template until an editor PUBLISHES it — never at deploy time.
	// getTemplateDetail is only called once the check above has proved a
	// published document exists, exactly like getTemplateListing following
	// getTemplateListingPublished in app/templates/page.tsx (U21).
	const templateDetailDoc = templateDetailPublished
		? await getTemplateDetail()
		: null;
	const sectionsAbove = templateDetailDoc?.sectionsAbove ?? [];
	const sectionsBelow = templateDetailDoc?.sectionsBelow ?? [];

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
			<Nav />
			{sectionsAbove.length > 0 && (
				<PageBuilder
					documentId={templateDetailDoc!._id}
					documentType={templateDetailDoc!._type}
					sections={sectionsAbove}
					sectionsPath="sectionsAbove"
					siteSettingsCtaDefaults={ctaDefaults}
				/>
			)}
			<TemplatePostHero post={heroPost} />
			<PostContent content={(template.content ?? []) as PortableTextBlock[]} />
			{template.relatedBlogPosts && template.relatedBlogPosts.length > 0 && (
				<RelatedBlogPosts posts={template.relatedBlogPosts as any[]} />
			)}
			<ContentCtaBanner />
			<RelatedTemplates templates={related as any[]} currentSlug={template.slug.current} />
			{sectionsBelow.length > 0 && (
				<PageBuilder
					documentId={templateDetailDoc!._id}
					documentType={templateDetailDoc!._type}
					sections={sectionsBelow}
					sectionsPath="sectionsBelow"
					siteSettingsCtaDefaults={ctaDefaults}
				/>
			)}
			<Footer />
		</div>
	);
}
