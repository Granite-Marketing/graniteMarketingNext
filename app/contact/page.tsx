import { Nav } from "@/components/nav";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { PageBuilder } from "@/components/page-builder";
import {
	getContactPagePublished,
	getContactPage,
	getPageCtaDefaults,
} from "@/lib/sanity/queries";
import type { SiteSettingsCtaDefaults } from "@/lib/sanity/lib/resolve-cta";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

// U21 of the Sanity page builder plan: today's hardcoded /contact metadata.
// Unlike /blog and /templates, the hero fields here do not feed a
// ContentHero — /contact has never had one. They override the header that
// lives inside the Contact component itself.
const FALLBACK_METADATA = {
	title: "Contact Us - Granite Marketing | Get in Touch",
	description:
		"Get in touch with Granite Marketing. Fill out our contact form to discuss your AI automation needs, workflow optimization, or general inquiries.",
};

// ISR with 1 hour revalidation, matching /blog and /templates now that this
// route fetches from Sanity. The old "force-static" setting predates any
// data dependency here and would never pick up a publish without a full
// redeploy.
export const revalidate = 3600;

// contactPage exists ONLY as a draft right now, and dev/production share
// one Sanity dataset (see app/page.tsx's generateMetadata for the full
// rationale this mirrors), so this must resolve today's hardcoded metadata
// until an editor PUBLISHES the document — never at deploy time.
// stegaClean runs once on the whole document before any field is read, and
// only ever feeds this metadata computation — never rendered copy.
export async function generateMetadata(): Promise<Metadata> {
	const published = await getContactPagePublished();

	if (!published) {
		return FALLBACK_METADATA;
	}

	const contactPage = stegaClean(await getContactPage());

	if (!contactPage) {
		return FALLBACK_METADATA;
	}

	return {
		title: contactPage.seo?.metaTitle || FALLBACK_METADATA.title,
		description:
			contactPage.seo?.metaDescription || FALLBACK_METADATA.description,
	};
}

export default async function ContactPage() {
	// PUBLISHED-only gate (U21) — mirrors app/page.tsx's homePageSlug check.
	const published = await getContactPagePublished();

	if (published) {
		const [contactPage, ctaDefaults] = await Promise.all([
			getContactPage(),
			getPageCtaDefaults() as Promise<SiteSettingsCtaDefaults | null>,
		]);

		// getContactPagePublished already proved a PUBLISHED document exists,
		// but getContactPage itself is draft-mode-aware, so re-check here
		// rather than assume: a null result would only happen from a race
		// between the two calls, and the fallback below is the correct thing
		// to render if it ever does.
		if (contactPage) {
			const sectionsAbove = contactPage.sectionsAbove ?? [];
			const sectionsBelow = contactPage.sectionsBelow ?? [];

			// The hero fields drive <Contact />'s own header, NOT a separate
			// ContentHero above it. /contact has never had a ContentHero —
			// its header has always lived inside the Contact component — so
			// rendering one here put the heading and subtitle on the page
			// twice. Each field is passed only when set, so an unfilled one
			// falls back to the component's own default rather than blanking.

			return (
				<>
					<Nav />
					<main className="min-h-screen">
						{sectionsAbove.length > 0 && (
							<PageBuilder
								documentId={contactPage._id}
								documentType={contactPage._type}
								sections={sectionsAbove}
								sectionsPath="sectionsAbove"
								siteSettingsCtaDefaults={ctaDefaults}
							/>
						)}
						<Contact
							{...(contactPage.tag ? { tag: contactPage.tag } : {})}
							{...(contactPage.heading
								? { heading: contactPage.heading }
								: {})}
							{...(contactPage.subtitle
								? { subtitle: contactPage.subtitle }
								: {})}
						/>
						{sectionsBelow.length > 0 && (
							<PageBuilder
								documentId={contactPage._id}
								documentType={contactPage._type}
								sections={sectionsBelow}
								sectionsPath="sectionsBelow"
								siteSettingsCtaDefaults={ctaDefaults}
							/>
						)}
					</main>
					<Footer />
				</>
			);
		}
	}

	// Fallback: today's hardcoded /contact, with the Contact component using
	// its own default header copy.
	// Reached whenever contactPage has no published version yet — the
	// zero-risk cutover path: the live site must never change because a
	// page-type singleton was seeded as a draft.
	return (
		<>
			<Nav />
			<main className="min-h-screen">
				<Contact />
			</main>
			<Footer />
		</>
	);
}
