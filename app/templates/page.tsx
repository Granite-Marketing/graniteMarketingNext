import { Nav } from "@/components/nav";
import { ContentHero } from "@/components/content-hero";
import { TemplateGrid } from "@/components/template-grid";
import { ContentCtaBanner } from "@/components/content-cta-banner";
import { Footer } from "@/components/footer";
import { PageBuilder } from "@/components/page-builder";
import {
	getWorkflowTemplates,
	getTemplateListingPublished,
	getTemplateListing,
	getPageCtaDefaults,
} from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

// U21 of the Sanity page builder plan: today's hardcoded ContentHero copy
// and metadata, named so both the fallback branch and generateMetadata's
// per-field fallback read from one place instead of two copies of the same
// strings drifting apart.
const FALLBACK_TAG = "Workflow Templates";
const FALLBACK_HEADING = "Ready-to-use workflow templates";
const FALLBACK_SUBTITLE =
	"Browse our collection of pre-built n8n workflow templates. Download, customize, and start automating your business processes today.";
const FALLBACK_METADATA = {
	title:
		"Workflow Templates - Granite Marketing | Ready-to-Use n8n Automations",
	description:
		"Browse our library of ready-to-use n8n workflow templates. Download, customize, and automate your business processes in minutes.",
};

export const revalidate = 3600;

// templateListing exists ONLY as a draft right now, and dev/production
// share one Sanity dataset (see app/page.tsx's generateMetadata for the
// full rationale this mirrors), so this must resolve today's hardcoded
// metadata until an editor PUBLISHES the document — never at deploy time.
// stegaClean runs once on the whole document before any field is read, and
// only ever feeds this metadata computation — never rendered copy.
export async function generateMetadata(): Promise<Metadata> {
	const published = await getTemplateListingPublished();

	if (!published) {
		return FALLBACK_METADATA;
	}

	const listing = stegaClean(await getTemplateListing());

	if (!listing) {
		return FALLBACK_METADATA;
	}

	return {
		title: listing.seo?.metaTitle || FALLBACK_METADATA.title,
		description:
			listing.seo?.metaDescription || FALLBACK_METADATA.description,
	};
}

type SanityWorkflowTemplate = {
	_id: string;
	slug?: { current?: string };
	title: string;
	excerpt?: string;
	publishedAt?: string;
	featuredImage?: unknown;
	categories?: { name?: string }[];
	featured?: boolean;
	n8nUrl?: string;
	youtubeUrl?: string;
	loomUrl?: string;
};

export default async function TemplatesPage() {
	// PUBLISHED-only gate (U21) — mirrors app/page.tsx's homePageSlug check.
	// Reused for the fixed grid data below too, since that must render in
	// BOTH branches regardless of which one wins.
	const published = await getTemplateListingPublished();

	const templatesFromSanity =
		(await getWorkflowTemplates()) as SanityWorkflowTemplate[];

	const posts =
		templatesFromSanity?.map((template) => ({
			id: template._id,
			slug: template.slug?.current ?? "",
			title: template.title,
			description: template.excerpt ?? "",
			// Cleaned because this value is used as a filter identifier and
			// compared with === downstream. Stega characters break equality.
			category: stegaClean(template.categories?.[0]?.name) ?? "Template",
			date: template.publishedAt
				? new Date(template.publishedAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})
				: "",
			image: getImageUrl(template.featuredImage as any) ?? "",
			featured: template.featured ?? false,
			n8nUrl: template.n8nUrl,
			youtubeUrl: template.youtubeUrl,
			loomUrl: template.loomUrl,
		})) ?? [];

	if (published) {
		const [listing, ctaDefaults] = await Promise.all([
			getTemplateListing(),
			getPageCtaDefaults() as Promise<SiteSettingsCtaDefaults | null>,
		]);

		// getTemplateListingPublished already proved a PUBLISHED document
		// exists, but getTemplateListing itself is draft-mode-aware, so
		// re-check here rather than assume: a null result would only happen
		// from a race between the two calls, and the fallback below is the
		// correct thing to render if it ever does.
		if (listing) {
			const sectionsAbove = listing.sectionsAbove ?? [];
			const sectionsBelow = listing.sectionsBelow ?? [];

			return (
				<>
					<Nav />
					<main className="min-h-screen">
						{sectionsAbove.length > 0 && (
							<PageBuilder
								documentId={listing._id}
								documentType={listing._type}
								sections={sectionsAbove}
								siteSettingsCtaDefaults={ctaDefaults}
							/>
						)}
						<ContentHero
							tag={listing.tag || FALLBACK_TAG}
							heading={listing.heading || FALLBACK_HEADING}
							subtitle={listing.subtitle || FALLBACK_SUBTITLE}
							patternId="templates-grid"
						/>
						<TemplateGrid posts={posts} />
						{sectionsBelow.length > 0 && (
							<PageBuilder
								documentId={listing._id}
								documentType={listing._type}
								sections={sectionsBelow}
								siteSettingsCtaDefaults={ctaDefaults}
							/>
						)}
					</main>
					<Footer />
				</>
			);
		}
	}

	// Fallback: today's hardcoded /templates chrome. Reached whenever
	// templateListing has no published version yet — the zero-risk cutover
	// path: the live site must never change because a page-type singleton
	// was seeded as a draft.
	return (
		<>
			<Nav />
			<main className="min-h-screen">
				<ContentHero
					tag={FALLBACK_TAG}
					heading={FALLBACK_HEADING}
					subtitle={FALLBACK_SUBTITLE}
					patternId="templates-grid"
				/>
				<TemplateGrid posts={posts} />
				<ContentCtaBanner />
			</main>
			<Footer />
		</>
	);
}
