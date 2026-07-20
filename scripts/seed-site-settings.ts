import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SINGLETON_TYPES, singletonDocumentId } from "../lib/sanity/singletons";
import { HOME_PAGE_DOC_ID } from "./seed-pages";

// Seeds the `siteSettings` singleton (U22 of
// docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md, Phase 6) from
// today's hardcoded chrome: logo/nav/footer (components/data.ts,
// components/nav.tsx, components/footer.tsx), the Global CTA defaults
// (components/cta.tsx), and site-wide SEO/social defaults
// (lib/seo/config.ts). Same deterministic-`_id` / `createOrReplace` /
// drafts-by-default posture as scripts/seed-pages.ts and
// scripts/seed-page-types.ts — see those files for the full rationale; this
// header only covers what's specific to this seed.
//
// This is also the LAST seed in the plan's ordering (U22 runs after U19–U21):
// navLinks/footerColumns/logoLink/ctaButton all resolve through the `link`
// union's "internal"/"anchor" variants rather than raw href strings, and
// every one of those variants needs a real document to point at —
// `templateListing`, `blogListing` and `contactPage` (U19b/U21) and the
// homepage `page` document (U16). Wiring nav before those types existed
// would have meant wiring it twice, which is why the plan orders it last.
//
// CONTENT SOURCE:
//   - Brand: components/nav.tsx, components/footer.tsx (which asset the
//     logo actually is — see the CONTRADICTION note below), plus the
//     homepage `page` document for `logoLink`/`homePage`.
//   - Navigation: components/data.ts's `navLinks`, components/nav.tsx's
//     header CTA copy ("book an intro call").
//   - Footer: components/data.ts's `footerColumns`. `complianceLinks` is
//     DELIBERATELY NOT read from here — see R7 below.
//   - Global CTA defaults: components/cta.tsx's own hardcoded prop defaults
//     (heading, subtitle, footnote; the button's `.label` only — see the
//     ctaButton.link note below).
//   - SEO & Social: lib/seo/config.ts's `defaultMetadata.title.default`,
//     `.description`, and `siteConfig`/`openGraph.images[0].alt`. Duplicated
//     as literals rather than imported, same reasoning as
//     HOME_META_TITLE/HOME_META_DESCRIPTION in scripts/seed-pages.ts: this
//     script writes a snapshot of what the site said at migration time, and
//     it must not silently change if lib/seo/config.ts is edited later.
//
// CONTRADICTION — the `logo` field is left UNSET, against the unit brief's
// instruction to "upload the asset the nav actually renders." Reading
// components/nav.tsx and components/footer.tsx: both render `<BrandMark />`
// (components/brand-mark.tsx), which is an inline SVG (`RouteGlyph`) plus a
// literal "granite" text node — there is no `<Image>`/`<img>` anywhere in
// either component, and no raster or SVG *file* the logo renders from. The
// several logo-shaped files under public/images/ (DT_Logo.svg, gm-logo.*,
// granite-logo.png, granite-marketing-new-logo.png, pale-blue-dot-logo.svg,
// …) are unused by nav/footer today — grepped across components/, app/ and
// lib/, none of them is referenced anywhere except granite-logo.png, which
// lib/seo/structured-data.ts uses for JSON-LD Organization schema, a
// completely different concern from what renders in the header. Uploading
// any of these as "the logo" would be inventing a value the unit brief
// itself forbids (hard requirement 5: "If a value cannot be migrated
// faithfully, leave it unset and report it. Never invent copy."). `logoLink`
// is still seeded (it has a real, faithful value independent of the image),
// and `logo.altText` is left unset alongside it.
//
// R7 — the Wise compliance strip (copyright line, card scheme logos, the
// five `complianceLinks` policy links) is DELIBERATELY NOT seeded anywhere
// in this document. It is a payment-provider requirement that stays
// hardcoded in components/footer.tsx and is intentionally absent from the
// `siteSettings` schema — see siteSettings.ts's own R7 comment. This script
// never imports `complianceLinks` from components/data.ts for exactly that
// reason.
//
// ANCHOR IDS reference the homepage `page` document's own section anchor
// ids, confirmed against scripts/seed-pages.ts's section builders (the
// single source of truth for what the live homepage's anchors are):
// services (capabilitiesBlock), process (processBlock), results
// (resultsBlock), testimonials (testimonialsBlock), faq (faqBlock), contact
// (ctaBlock). `/#services`, `/#process`, `/#results` (nav) and
// `/#testimonials`, `/#faq` (footer) all become `linkType: "anchor"` with
// `anchorPage` referencing the homepage document and `anchorId` set to the
// matching id above — never left to lib/sanity/lib/anchor-id.ts's
// slugify-the-heading fallback, which would not reproduce these ids (same
// R6 concern seed-pages.ts's header comment documents).
//
// `/templates` and `/blog` (nav + footer) become `linkType: "internal"`
// pointing at the `templateListing`/`blogListing` singletons (U19b).
// `/contact` (footer only — there is no header nav link to it today) becomes
// `linkType: "internal"` pointing at the `contactPage` singleton (U21).
//
// The header CTA ("book an intro call" — components/nav.tsx's desktop
// button, `hidden md:inline-flex`, the one always visible in the header) is
// `linkType: "calBooking"` with `calLink` left UNSET so it inherits the
// site's standard handle — components/cal-button.tsx's own `calLink =
// CAL_LINK` default, which nav.tsx never overrides. NOTE: the mobile menu
// drawer (components/nav.tsx line ~82) renders the *same* button with the
// label capitalised ("Book an intro call") — the schema models one header
// CTA, not two, so the desktop instance (the one actually described as "the
// header CTA" — persistent, not tucked behind the hamburger) is what's
// transcribed here, verbatim including its lowercase "b".
//
// The Global CTA defaults' `ctaButton.link` is NEVER READ for rendering —
// components/blocks/cta-block.tsx's `CtaBlockAdapter` passes only
// `resolved.button?.label` to `<CTA primaryCtaLabel=… />`, and
// components/cta.tsx's primary button is unconditionally a `<CalButton>`
// regardless of what `.link` says (confirmed by reading both files). A
// value is still required by the schema (`labeledLinkFields()`'s `link` is
// `Rule.required()`). scripts/seed-pages.ts and scripts/seed-page-types.ts
// hit this identical situation for their own page-level `ctaBlock.ctaButton`
// and picked `anchorLink("contact")` — but that worked there because each of
// those documents (page-home, blogListing, templateListing) owns its own
// "contact"-anchored CTA section to point at. `siteSettings` is not a page
// and has no anchor of its own, so `anchorId: "contact"` here would be a
// syntactically-valid but semantically empty reference to nothing. Since the
// field is genuinely dead code today but the button's REAL behaviour is
// "open the Cal.com modal" (identical to the header CTA), `calBooking` is
// used instead — the only variant that describes what actually happens
// without inventing a destination that doesn't exist on this document.
//
// IMAGE UPLOADS — `ogImage` (public/images/og-image.png, already 1200x630,
// the standard OG ratio) and `favicon` (public/images/favicon.png, 512x512
// — see the favicon-choice note below). Both are uploaded via
// `migrationClient.assets.upload()`, matching the existing convention in
// scripts/migrate-tools.ts's `uploadSvgAsset()`. Re-running this seed does
// NOT create duplicate assets: verified against Sanity's own docs (not
// assumed) via the Sanity MCP's `read_docs` tool, "Upload, query, and delete
// assets" (sanity.io/docs/content-lake/manage-assets) — "The path of an
// asset is in part determined by the result of hashing the content of the
// asset. If the same asset is uploaded multiple times, but with different
// filenames, only one asset will be created." The asset `_id` is
// content-addressed, so uploading identical bytes on every run resolves to
// the same asset document rather than a growing pile of duplicates — no
// extra dedup bookkeeping needed on this script's side.
//
// FAVICON CHOICE — public/images/favicon.png (512x512, confirmed via
// `sips -g pixelWidth -g pixelHeight`), not one of the higher-resolution
// square candidates that also exist under public/images/ (granite-logo.png,
// also 512x512, or the "granite-marketing-new-*" files). Reasoning: the
// schema field replaces lib/seo/config.ts's CURRENT four-entry `icons` block
// (see siteSettings.ts's own comment on the `favicon` field), and
// favicon.png is the only 512px-or-larger SQUARE file that is actually
// *part of that current set* — it's the unsized entry in
// `defaultMetadata.icons.icon`. granite-logo.png is the same 512x512 size
// but is used exclusively for JSON-LD structured data
// (lib/seo/structured-data.ts), a different concern, and the
// "granite-marketing-new-*" files (top out at 130x130) are unreferenced
// anywhere in the codebase — grepped and confirmed unused, likely leftovers
// from an earlier rebrand exploration. Migrating the CURRENT live favicon
// forward, at its largest current form, is the faithful choice; adopting an
// unused file would be a content change dressed as a migration.
//
// `homePage` is READ FIRST and PRESERVED, never overwritten — see
// `fetchExistingHomePage()` below. There is no hardcoded value to seed it
// from (it's an editorial choice, not something app/page.tsx's rendering
// pins), and overwriting it would change what renders at `/` (siteSettings
// schema's own field comment). If no existing siteSettings document has it
// set, it is left unset here too and the run logs a note — never guessed.

export const SITE_SETTINGS_DOC_ID = singletonDocumentId(
	SINGLETON_TYPES.siteSettings
);

const BLOG_LISTING_ID = singletonDocumentId(SINGLETON_TYPES.blogListing);
const TEMPLATE_LISTING_ID = singletonDocumentId(SINGLETON_TYPES.templateListing);
const CONTACT_PAGE_ID = singletonDocumentId(SINGLETON_TYPES.contactPage);

// Mirrors lib/seo/config.ts's `defaultMetadata`/`siteConfig`. Duplicated
// rather than imported — see the header comment.
export const SITE_TITLE =
	"Granite Marketing | Custom AI Automations for Business Productivity";
export const SITE_DESCRIPTION =
	"Automate workflows with n8n and no-code tools to boost team efficiency and output. Discover what you can build—get started today.";
export const OG_IMAGE_ALT = "Granite Marketing - AI Automation Services";

// Mirrors components/cta.tsx's own hardcoded prop defaults.
export const CTA_HEADING = "Stop doing work a workflow could do.";
export const CTA_SUBTITLE =
	"Thirty minutes, no slides. We map one of your real workflows live on the call. You keep the map either way.";
export const CTA_FOOTNOTE =
	"avg. response time: same day · first build live in ~3 weeks";

// Mirrors components/nav.tsx's desktop header CTA button (the persistent
// one, not the mobile-drawer duplicate — see the header comment).
export const HEADER_CTA_LABEL = "book an intro call";

const OG_IMAGE_FILENAME = "og-image.png";
const FAVICON_FILENAME = "favicon.png";

// ---------------------------------------------------------------------------
// Minimal write-side types. Hand-rolled rather than imported from
// sanity.types.ts, for the same reason scripts/seed-pages.ts's and
// scripts/seed-page-types.ts's are: that file describes dereferenced,
// nullable, stega-shaped QUERY RESULTS, the wrong shape for a document this
// script authors from scratch.
// ---------------------------------------------------------------------------

interface ReferenceValue {
	_type: "reference";
	_ref: string;
}

interface SanityLinkInternal {
	_type: "link";
	linkType: "internal";
	internalRef: ReferenceValue;
}

interface SanityLinkAnchor {
	_type: "link";
	linkType: "anchor";
	anchorPage: ReferenceValue;
	anchorId: string;
}

interface SanityLinkCalBooking {
	_type: "link";
	linkType: "calBooking";
}

type SanityLink = SanityLinkInternal | SanityLinkAnchor | SanityLinkCalBooking;

interface LabeledLink {
	label: string;
	link: SanityLink;
}

interface NavLinkItem extends LabeledLink {
	_key: string;
	_type: "navLink";
}

interface FooterColumn {
	_key: string;
	_type: "footerColumn";
	heading: string;
	links: NavLinkItem[];
}

interface ImageValue {
	_type: "image";
	asset: ReferenceValue;
}

interface ImageWithAltValue extends ImageValue {
	altText: string;
}

export interface SiteSettingsDocument {
	_type: "siteSettings";
	// `logo` is DELIBERATELY absent — see the CONTRADICTION note above.
	logoLink: SanityLinkInternal;
	homePage?: ReferenceValue;
	navLinks: NavLinkItem[];
	headerCta: LabeledLink;
	footerColumns: FooterColumn[];
	ctaHeading: string;
	ctaSubtitle: string;
	ctaButton: LabeledLink;
	ctaFootnote: string;
	siteTitle: string;
	siteDescription: string;
	ogImage: ImageWithAltValue;
	favicon: ImageValue;
}

// ---------------------------------------------------------------------------
// Link helpers
// ---------------------------------------------------------------------------

function internalLink(refId: string): SanityLinkInternal {
	return {
		_type: "link",
		linkType: "internal",
		internalRef: { _type: "reference", _ref: refId },
	};
}

// Every anchor in this document lives on the homepage — there is no other
// page with sections today — so `anchorPage` is always set explicitly
// rather than left to the "current page" fallback (which would be wrong
// the moment this link renders anywhere other than `/`, e.g. the footer,
// which appears on every page).
function homeAnchorLink(anchorId: string): SanityLinkAnchor {
	return {
		_type: "link",
		linkType: "anchor",
		anchorPage: { _type: "reference", _ref: HOME_PAGE_DOC_ID },
		anchorId,
	};
}

function calBookingLink(): SanityLinkCalBooking {
	return { _type: "link", linkType: "calBooking" };
}

// ---------------------------------------------------------------------------
// Section builders — one per siteSettings schema group.
// ---------------------------------------------------------------------------

/**
 * Mirrors components/data.ts's `navLinks` order and labels exactly:
 * services, process, results, templates, blog.
 */
export function buildNavLinks(): NavLinkItem[] {
	return [
		{
			_key: "services",
			_type: "navLink",
			label: "services",
			link: homeAnchorLink("services"),
		},
		{
			_key: "process",
			_type: "navLink",
			label: "process",
			link: homeAnchorLink("process"),
		},
		{
			_key: "results",
			_type: "navLink",
			label: "results",
			link: homeAnchorLink("results"),
		},
		{
			_key: "templates",
			_type: "navLink",
			label: "templates",
			link: internalLink(TEMPLATE_LISTING_ID),
		},
		{
			_key: "blog",
			_type: "navLink",
			label: "blog",
			link: internalLink(BLOG_LISTING_ID),
		},
	];
}

export function buildHeaderCta(): LabeledLink {
	return {
		label: HEADER_CTA_LABEL,
		link: calBookingLink(),
	};
}

/**
 * Mirrors components/data.ts's `footerColumns` exactly: "Site" (anchors into
 * the homepage) and "Resources" (real document links). `complianceLinks`
 * is never read here — see the R7 header note.
 */
export function buildFooterColumns(): FooterColumn[] {
	return [
		{
			_key: "site",
			_type: "footerColumn",
			heading: "Site",
			links: [
				{
					_key: "services",
					_type: "navLink",
					label: "Services",
					link: homeAnchorLink("services"),
				},
				{
					_key: "process",
					_type: "navLink",
					label: "Process",
					link: homeAnchorLink("process"),
				},
				{
					_key: "results",
					_type: "navLink",
					label: "Results",
					link: homeAnchorLink("results"),
				},
				{
					_key: "testimonials",
					_type: "navLink",
					label: "Testimonials",
					link: homeAnchorLink("testimonials"),
				},
				{
					_key: "faqs",
					_type: "navLink",
					label: "FAQs",
					link: homeAnchorLink("faq"),
				},
			],
		},
		{
			_key: "resources",
			_type: "footerColumn",
			heading: "Resources",
			links: [
				{
					_key: "blog",
					_type: "navLink",
					label: "Blog",
					link: internalLink(BLOG_LISTING_ID),
				},
				{
					_key: "templates",
					_type: "navLink",
					label: "Templates",
					link: internalLink(TEMPLATE_LISTING_ID),
				},
				{
					_key: "contact",
					_type: "navLink",
					label: "Contact",
					link: internalLink(CONTACT_PAGE_ID),
				},
			],
		},
	];
}

/**
 * The Global CTA defaults' button. See the header comment for why
 * `calBooking` is used despite the field never being read for rendering
 * today.
 */
export function buildCtaButton(): LabeledLink {
	return {
		label: "Book an intro call",
		link: calBookingLink(),
	};
}

// ---------------------------------------------------------------------------
// Document builder
// ---------------------------------------------------------------------------

export interface SiteSettingsSeedInputs {
	/** The uploaded ogImage asset's `_id`. */
	ogImageAssetId: string;
	/** The uploaded favicon asset's `_id`. */
	faviconAssetId: string;
	/**
	 * The existing document's `homePage` reference, if any —
	 * `fetchExistingHomePage()` reads this at runtime. Omitted (not merely
	 * `undefined`) from the returned document when there is nothing to
	 * preserve, so an empty homePage never gets written as an explicit
	 * `null`/empty reference.
	 */
	homePage?: ReferenceValue;
}

/**
 * The full `siteSettings` document body (everything except `_id`, which the
 * caller decides). Pure given its inputs — no network, no Sanity client —
 * so it is testable on its own (see test/scripts/seed-site-settings.test.ts).
 * The two asset ids and the preserved `homePage` are the only pieces that
 * can't be known ahead of a network round-trip; everything else is a
 * migrated literal.
 */
export function buildSiteSettingsDocument(
	inputs: SiteSettingsSeedInputs
): SiteSettingsDocument {
	const doc: SiteSettingsDocument = {
		_type: "siteSettings",
		logoLink: internalLink(HOME_PAGE_DOC_ID),
		navLinks: buildNavLinks(),
		headerCta: buildHeaderCta(),
		footerColumns: buildFooterColumns(),
		ctaHeading: CTA_HEADING,
		ctaSubtitle: CTA_SUBTITLE,
		ctaButton: buildCtaButton(),
		ctaFootnote: CTA_FOOTNOTE,
		siteTitle: SITE_TITLE,
		siteDescription: SITE_DESCRIPTION,
		ogImage: {
			_type: "image",
			asset: { _type: "reference", _ref: inputs.ogImageAssetId },
			altText: OG_IMAGE_ALT,
		},
		favicon: {
			_type: "image",
			asset: { _type: "reference", _ref: inputs.faviconAssetId },
		},
	};

	if (inputs.homePage) {
		doc.homePage = inputs.homePage;
	}

	return doc;
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

// Minimal shape of the two migrationClient methods this script's network
// path needs, beyond `.transaction()` (already used by seed-pages.ts /
// seed-page-types.ts). Declared narrowly rather than importing
// `SanityClient` from `@sanity/client` so the mocked client in tests only
// has to implement what's actually called.
interface SiteSettingsMigrationClient {
	transaction: () => {
		createOrReplace: (doc: { _id: string } & Record<string, unknown>) => unknown;
		commit: () => Promise<{ transactionId?: string }>;
	};
	getDocument: (id: string) => Promise<Record<string, unknown> | undefined>;
	assets: {
		upload: (
			type: "image",
			body: Buffer,
			options: { filename: string }
		) => Promise<{ _id: string }>;
	};
}

/**
 * Reads whichever of the draft/published `siteSettings` documents already
 * exists and returns its `homePage` reference, if set. Checks the id this
 * run is ABOUT to write first (so a repeated draft run keeps seeing its own
 * prior draft's value), then falls back to the other perspective — a draft
 * run should still see a `homePage` an editor already published, and a
 * `--publish` run should still see one only set on an as-yet-unpublished
 * draft. Returns `undefined` (not `null`) when neither exists or neither
 * has it set, matching `SiteSettingsSeedInputs.homePage`'s "omit, don't
 * invent" contract.
 */
export async function fetchExistingHomePage(
	client: SiteSettingsMigrationClient,
	documentId: string,
	publish: boolean
): Promise<ReferenceValue | undefined> {
	const fallbackId = publish
		? `drafts.${SITE_SETTINGS_DOC_ID}`
		: SITE_SETTINGS_DOC_ID;

	const primary = await client.getDocument(documentId);
	if (primary?.homePage) return primary.homePage as ReferenceValue;

	const fallback = await client.getDocument(fallbackId);
	if (fallback?.homePage) return fallback.homePage as ReferenceValue;

	return undefined;
}

async function uploadImage(
	client: SiteSettingsMigrationClient,
	filePath: string
): Promise<string> {
	const fileBuffer = fs.readFileSync(filePath);
	const asset = await client.assets.upload("image", fileBuffer, {
		filename: path.basename(filePath),
	});
	return asset._id;
}

/**
 * Runs the seed against the Content Lake. Draft by default (`publish:
 * false`) — same reasoning as scripts/seed-pages.ts's seedPages(): one
 * Sanity dataset serves both dev and production (C1 of the plan), so a
 * draft stays invisible to anonymous visitors while still reviewable in
 * Presentation. `publish: true` is an explicit opt-in, never the default.
 *
 * Deterministic `_id` (`siteSettings`, or `drafts.siteSettings`) +
 * `createOrReplace` is what makes this re-runnable — a second run replaces
 * the same document rather than creating a duplicate, and the image
 * uploads are separately idempotent by content hash (see the header
 * comment's IMAGE UPLOADS note).
 */
export async function seedSiteSettings(
	options: { publish?: boolean } = {}
): Promise<{
	documentId: string;
	transactionId?: string;
	ogImageAssetId: string;
	faviconAssetId: string;
	homePagePreserved: boolean;
}> {
	const publish = options.publish ?? false;

	// Imported dynamically, not at module top level: scripts/sanityClient.ts
	// throws at import time when SANITY_TOKEN is unset, and this module's
	// pure builder functions above must stay importable from tests with zero
	// side effects and no token required.
	const { migrationClient } = await import("./sanityClient");
	const client = migrationClient as unknown as SiteSettingsMigrationClient;

	const documentId = publish
		? SITE_SETTINGS_DOC_ID
		: `drafts.${SITE_SETTINGS_DOC_ID}`;

	console.log(`\n=== Seeding site settings singleton (${documentId}) ===`);

	console.log(`Uploading ${OG_IMAGE_FILENAME}...`);
	const ogImagePath = path.join(process.cwd(), "public/images", OG_IMAGE_FILENAME);
	const ogImageAssetId = await uploadImage(client, ogImagePath);
	console.log(`  -> ${ogImageAssetId}`);

	console.log(`Uploading ${FAVICON_FILENAME}...`);
	const faviconPath = path.join(process.cwd(), "public/images", FAVICON_FILENAME);
	const faviconAssetId = await uploadImage(client, faviconPath);
	console.log(`  -> ${faviconAssetId}`);

	const homePage = await fetchExistingHomePage(client, documentId, publish);

	const doc = buildSiteSettingsDocument({
		ogImageAssetId,
		faviconAssetId,
		homePage,
	});

	const transaction = client.transaction();
	transaction.createOrReplace({ _id: documentId, ...doc });

	const result = await transaction.commit();

	console.log(
		`\n✅ Seeded ${documentId} in transaction ${result.transactionId ?? "(no id returned)"}`
	);

	if (!publish) {
		console.log(
			"\nThis is a DRAFT — invisible to anonymous visitors. Review it in " +
				"Presentation, then either publish from Studio or re-run this " +
				"script with --publish."
		);
	}

	if (homePage) {
		console.log(`homePage preserved: ${homePage._ref}`);
	} else {
		console.log(
			"\n⚠️  homePage left UNSET — no existing siteSettings document " +
				"(draft or published) had it configured. Set it in Studio, or seed " +
				"the homepage page document first and re-run."
		);
	}

	console.log(
		"\n⚠️  logo left UNSET — components/nav.tsx and components/footer.tsx " +
			"render an inline SVG mark (BrandMark), not an uploaded image asset. " +
			"See this file's CONTRADICTION comment for the full evidence."
	);

	return {
		documentId,
		transactionId: result.transactionId,
		ogImageAssetId,
		faviconAssetId,
		homePagePreserved: Boolean(homePage),
	};
}

const isMainModule =
	process.argv[1] !== undefined &&
	fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMainModule) {
	const publish = process.argv.includes("--publish");
	seedSiteSettings({ publish }).catch((error) => {
		console.error("\n❌ Failed to seed site settings document:", error);
		process.exitCode = 1;
	});
}
