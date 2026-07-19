import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Capabilities } from "@/components/capabilities";
import { ToolsStrip } from "@/components/tools-strip";
import { Process } from "@/components/process";
import { Results } from "@/components/results";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { PageBuilder } from "@/components/page-builder";
import {
	getHomeContent,
	getTools,
	getHomePageSlug,
	getPage,
	getPageCtaDefaults,
	getFeaturedLogos,
} from "@/lib/sanity/queries";
import {
	adaptClientTestimonial,
	adaptFAQItem,
} from "@/lib/sanity/lib/adapters";
import type { PageQueryResult } from "@/lib/sanity/lib/page-sections";
import type { ClientLogo } from "@/components/hero";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Metadata } from "next";
import { siteConfig, defaultMetadata } from "@/lib/seo";
import { stegaClean } from "next-sanity";

// ISR with 30 minute revalidation for homepage content
export const revalidate = 1800; // 30 minutes

// U16 of the Sanity page builder plan: siteSettings.homePage is the single
// source of truth for which `page` document renders at `/`. getHomePageSlug
// (lib/sanity/queries.ts) always resolves against the PUBLISHED perspective,
// regardless of Draft Mode — the same safety gate app/[slug]/page.tsx
// already relies on for its own homepage redirect/exclusion logic. Reusing
// it here collapses "no homePage assigned" and "homePage assigned but its
// page has never been published" into the exact same null result, so one
// check covers both without duplicating the published-only guard.
//
// This is deliberately NOT unconditional. Dev and production share one
// Sanity dataset, and a seeded page can sit as a draft indefinitely before
// anyone means to cut traffic over to it. The switch to Sanity-driven
// rendering happens the moment an editor PUBLISHES the page document —
// never at deploy time — so both branches below must keep rendering
// today's hardcoded homepage until that publish happens.
export async function generateMetadata(): Promise<Metadata> {
	const homePageSlug = await getHomePageSlug();

	if (!homePageSlug) {
		// Nothing to override. app/page.tsx has never exported generateMetadata
		// before this unit, so today's title/description/OpenGraph/Twitter/
		// canonical all come straight from the root layout's `defaultMetadata`
		// (lib/seo/config.ts). Returning {} keeps that inheritance intact
		// rather than duplicating those values here, where they could drift.
		return {};
	}

	// stegaClean strips the invisible characters that power click-to-edit —
	// harmless in rendered copy, but must never reach <title> or meta tags.
	// Mirrors app/[slug]/page.tsx, app/blog/[slug]/page.tsx and
	// app/templates/[slug]/page.tsx exactly.
	const page = stegaClean(
		await getPage(homePageSlug)
	) as PageQueryResult | null;

	if (!page) {
		return {};
	}

	// Deliberately NOT falling back to `page.title`. That is the document's
	// name in the Studio's document list — "Home" — which is a useful label
	// for an editor and a terrible <title> for the site's most important
	// search result.
	//
	// This was caught by the HTML baseline: the seeded page had no `seo`
	// object, so the homepage title silently went from
	// "Granite Marketing | Custom AI Automations for Business Productivity"
	// to "Home". Returning {} instead inherits the root layout's
	// defaultMetadata (lib/seo/config.ts), so an unfilled SEO tab degrades to
	// the correct site defaults rather than to the document's internal name.
	if (!page.seo?.metaTitle && !page.seo?.metaDescription) {
		return {};
	}

	// Each field falls back independently to the site default, so filling in
	// only one of the two cannot drop the other from the page.
	const defaultTitle =
		typeof defaultMetadata.title === "object" &&
		defaultMetadata.title !== null &&
		"default" in defaultMetadata.title
			? (defaultMetadata.title.default as string)
			: undefined;

	const metaTitle = page.seo?.metaTitle || defaultTitle;
	const metaDescription =
		page.seo?.metaDescription || (defaultMetadata.description as string);

	return {
		title: metaTitle,
		description: metaDescription,
		openGraph: {
			title: metaTitle,
			description: metaDescription,
			url: siteConfig.url,
			type: "website",
			images: [
				{
					url: siteConfig.defaultImage,
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
			images: [siteConfig.defaultImage],
		},
		alternates: {
			canonical: siteConfig.url,
		},
	};
}

export default async function Home() {
	const homePageSlug = await getHomePageSlug();

	if (homePageSlug) {
		const [page, ctaDefaults, clientLogos] = await Promise.all([
			getPage(homePageSlug) as Promise<PageQueryResult | null>,
			getPageCtaDefaults() as Promise<SiteSettingsCtaDefaults | null>,
			getFeaturedLogos(10),
		]);

		// getHomePageSlug already proved a PUBLISHED page exists at this slug,
		// but getPage itself is draft-mode-aware (lib/sanity/lib/fetch.ts), so
		// re-check here rather than assuming: a null result would only happen
		// from a race between the two calls, and the fallback below is the
		// correct thing to render if it ever does.
		if (page) {
			return (
				<div className="bg-relay-bg text-relay-ink selection:bg-relay-cyan selection:text-relay-bg">
					<Nav />
					<main className="min-h-screen">
						<PageBuilder
							documentId={page._id}
							documentType={page._type}
							sections={page.sections ?? []}
							currentSlug={homePageSlug}
							clientLogos={clientLogos as unknown as ClientLogo[]}
							siteSettingsCtaDefaults={ctaDefaults}
						/>
					</main>
					<Footer />
				</div>
			);
		}
	}

	// Fallback: today's hardcoded homepage. Reached whenever
	// siteSettings.homePage is unset, OR set but its referenced page has no
	// published version yet — this is the zero-risk cutover path: the live
	// site must never blank because a page document was seeded as a draft.
	const [homeContent, tools] = (await Promise.all([
		getHomeContent(),
		getTools(),
	])) as [any, any];

	const testimonials =
		homeContent.testimonials?.map((client: any) =>
			adaptClientTestimonial(client, client.location?.name),
		) ?? [];

	const faqs = homeContent.faqs?.map((faq: any) => adaptFAQItem(faq)) ?? [];

	return (
		<div className="bg-relay-bg text-relay-ink selection:bg-relay-cyan selection:text-relay-bg">
			<Nav />
			<main className="min-h-screen">
				<Hero clientLogos={homeContent.featuredLogos ?? []} />
				<Capabilities />
				<ToolsStrip tools={tools ?? []} />
				<Process />
				<Results caseStudies={homeContent.caseStudies ?? []} />
				{testimonials.length > 0 && (
					<Testimonials testimonials={testimonials} />
				)}
				{faqs.length > 0 && <FAQ faqs={faqs} />}
				<CTA />
			</main>
			<Footer />
		</div>
	);
}
