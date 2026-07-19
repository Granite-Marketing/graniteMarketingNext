import { Nav } from "@/components/nav";
import { ContentHero } from "@/components/content-hero";
import { BlogGrid } from "@/components/blog-grid";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { PageBuilder } from "@/components/page-builder";
import {
	getBlogPosts,
	getBlogListingPublished,
	getBlogListing,
	getPageCtaDefaults,
} from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/lib/adapters";
import { calculateReadTime } from "@/lib/utils/read-time";
import type { PortableTextBlock } from "@portabletext/types";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

// U21 of the Sanity page builder plan: today's hardcoded ContentHero copy
// and metadata, named so both the fallback branch and generateMetadata's
// per-field fallback read from one place instead of two copies of the same
// strings drifting apart.
const FALLBACK_TAG = "Blog & Insights";
const FALLBACK_HEADING = "Automation insights that matter";
const FALLBACK_SUBTITLE =
	"Stay ahead with the latest strategies, case studies, and best practices in AI-powered workflow automation.";
const FALLBACK_METADATA = {
	title: "Blog - Granite Marketing | AI Automation Insights",
	description:
		"Discover the latest insights, tutorials, and best practices in AI automation, workflow optimization, and business process improvement.",
};

// ISR with 1 hour revalidation for blog listing (disabled in development)
export const revalidate = 3600; // 1 hour

// blogListing exists ONLY as a draft right now, and dev/production share
// one Sanity dataset (see app/page.tsx's generateMetadata for the full
// rationale this mirrors), so this must resolve today's hardcoded metadata
// until an editor PUBLISHES the document — never at deploy time.
// stegaClean runs once on the whole document before any field is read, and
// only ever feeds this metadata computation — never rendered copy.
export async function generateMetadata(): Promise<Metadata> {
	const published = await getBlogListingPublished();

	if (!published) {
		return FALLBACK_METADATA;
	}

	const listing = stegaClean(await getBlogListing());

	if (!listing) {
		return FALLBACK_METADATA;
	}

	return {
		title: listing.seo?.metaTitle || FALLBACK_METADATA.title,
		description:
			listing.seo?.metaDescription || FALLBACK_METADATA.description,
	};
}

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
	// PUBLISHED-only gate (U21) — mirrors app/page.tsx's homePageSlug check.
	// Reused for the fixed grid data below too, since that must render in
	// BOTH branches regardless of which one wins.
	const published = await getBlogListingPublished();

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

	if (published) {
		const [listing, ctaDefaults] = await Promise.all([
			getBlogListing(),
			getPageCtaDefaults() as Promise<SiteSettingsCtaDefaults | null>,
		]);

		// getBlogListingPublished already proved a PUBLISHED document exists,
		// but getBlogListing itself is draft-mode-aware, so re-check here
		// rather than assume: a null result would only happen from a race
		// between the two calls, and the fallback below is the correct thing
		// to render if it ever does.
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
							patternId="blog-grid"
						/>
						<BlogGrid posts={posts} />
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

	// Fallback: today's hardcoded /blog chrome. Reached whenever blogListing
	// has no published version yet — the zero-risk cutover path: the live
	// site must never change because a page-type singleton was seeded as a
	// draft.
	return (
		<>
			<Nav />
			<main className="min-h-screen">
				<ContentHero
					tag={FALLBACK_TAG}
					heading={FALLBACK_HEADING}
					subtitle={FALLBACK_SUBTITLE}
					patternId="blog-grid"
				/>
				<BlogGrid posts={posts} />
				<CTA />
			</main>
			<Footer />
		</>
	);
}
