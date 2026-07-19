import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageBuilder } from "@/components/page-builder";
import { notFound } from "next/navigation";
import {
	getPage,
	getPageSlugs,
	getPageCtaDefaults,
	getFeaturedLogos,
} from "@/lib/sanity/queries";
import { RESERVED_PAGE_SLUGS } from "@/lib/sanity/studio-schemas/documents/page";
import type { PageQueryResult } from "@/lib/sanity/lib/page-sections";
import type { ClientLogo } from "@/components/hero";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import { stegaClean } from "next-sanity";

// U14 of the Sanity page builder plan: a `page` document publishes at its
// slug with no deploy. ISR mirrors the other document routes (blog post,
// workflow template) rather than the homepage's shorter 30m window — a
// generic page-builder page doesn't have the homepage's update cadence.
export const revalidate = 3600;

// Defence in depth (C5): the Studio-side validator on `page.slug`
// (lib/sanity/studio-schemas/documents/page.ts) is what stops an editor
// from ever publishing one of these slugs, but it is browser-side only — a
// migration script or a direct Content Lake write bypasses it entirely.
// What ACTUALLY stops `/blog`, `/templates`, `/contact` and the five policy
// routes from ever being shadowed is Next's own route resolution: static
// segments are matched before a dynamic `/[slug]` catch-all, unconditionally,
// regardless of what `generateStaticParams` returns or what this file does.
// The filtering below is a second, redundant guard on top of that — it
// keeps a reserved slug that slipped past validation out of the static
// build output and out of any dynamic (non-static) render, so it 404s here
// even in the hypothetical case where Next's own precedence were somehow
// bypassed (e.g. the static route file were ever deleted).
const RESERVED_SLUG_SET = new Set<string>(RESERVED_PAGE_SLUGS);

export async function generateStaticParams() {
	const slugs = await getPageSlugs();

	return slugs
		.filter(
			(slug): slug is string => Boolean(slug) && !RESERVED_SLUG_SET.has(slug)
		)
		.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	if (RESERVED_SLUG_SET.has(slug)) {
		return {};
	}

	// stegaClean strips the invisible characters that power click-to-edit.
	// They are harmless in rendered copy but would corrupt <title>, meta tags
	// and canonical URLs — where they reach search engines. Mirrors the
	// blog/[slug] and templates/[slug] routes exactly.
	const page = stegaClean(await getPage(slug)) as PageQueryResult | null;

	if (!page) {
		return {
			title: "Granite Marketing",
		};
	}

	const metaTitle = page.seo?.metaTitle || page.title || "Granite Marketing";
	const metaDescription = page.seo?.metaDescription || undefined;
	const canonicalUrl = `${siteConfig.url}/${slug}`;

	return {
		title: metaTitle,
		description: metaDescription,
		openGraph: {
			title: metaTitle,
			description: metaDescription,
			url: canonicalUrl,
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
	};
}

export default async function CatchAllPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	// See the comment on RESERVED_SLUG_SET above — this must never render
	// even if a document exists with a reserved slug.
	if (RESERVED_SLUG_SET.has(slug)) {
		notFound();
	}

	const [page, ctaDefaults, clientLogos] = await Promise.all([
		getPage(slug) as Promise<PageQueryResult | null>,
		getPageCtaDefaults() as Promise<SiteSettingsCtaDefaults | null>,
		getFeaturedLogos(10),
	]);

	if (!page) {
		notFound();
	}

	return (
		<div className="bg-relay-bg text-relay-ink selection:bg-relay-cyan selection:text-relay-bg">
			<Nav />
			<main className="min-h-screen">
				<PageBuilder
					documentId={page._id}
					documentType={page._type}
					sections={page.sections ?? []}
					currentSlug={slug}
					clientLogos={clientLogos as unknown as ClientLogo[]}
					siteSettingsCtaDefaults={ctaDefaults}
				/>
			</main>
			<Footer />
		</div>
	);
}
