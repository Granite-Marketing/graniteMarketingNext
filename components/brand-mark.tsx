import Image from "next/image";
import { urlForImage } from "@/lib/sanity/client";

export function RouteGlyph({ className }: { className?: string }) {
	return (
		<svg viewBox="17 5 78 90" aria-hidden="true" className={className}>
			<path
				d="M86 14 L26 14 L26 86 L86 86 L86 50 L70 50"
				fill="none"
				strokeWidth="13"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="stroke-relay-ink"
			/>
			<circle cx="48" cy="50" r="6.5" className="fill-relay-cyan" />
		</svg>
	);
}

/** The small, presentational shape BrandMark needs — not the full Sanity
 * `logo` field. Built by `resolveBrandMarkLogo` below so callers never hand
 * BrandMark a raw Sanity asset reference. */
export type BrandMarkLogo = {
	url: string;
	alt: string;
	width: number;
	height: number;
};

/** The Sanity `logo` field's shape, structural rather than imported from
 * `sanity.types` — this file only needs `asset` and `altText`, and typing
 * against the exact generated `SITE_SETTINGS_QUERYResult["logo"]` would
 * couple a presentation helper to the full generated query shape for no
 * benefit. */
type SiteSettingsLogoField = {
	logo?: {
		asset?: unknown;
		altText?: string | null;
	} | null;
} | null;

// Fixed render box for the uploaded logo, matching next/image's requirement
// for explicit dimensions (no `fill`) — a logo that reflows the header in
// while it loads is worse than the SVG it replaces. Deliberately NOT derived
// from the uploaded asset's own pixel dimensions (Sanity exposes those via
// `asset->metadata.dimensions`, but fetching that would mean dereferencing
// the asset in every consumer of SITE_SETTINGS_QUERY, including the U22 nav/
// footer/CTA fields that have nothing to do with the logo). A fixed box is
// exactly what the SVG wordmark already does — it also renders at a fixed
// height regardless of "granite"'s actual text metrics.
const LOGO_WIDTH = 160;
const LOGO_HEIGHT = 40;

/**
 * Turn `siteSettings.logo` into the shape BrandMark renders, or `null` when
 * no logo has been uploaded. Lives next to BrandMark (not in queries.ts)
 * because it's presentation logic — picking the rendered pixel box and the
 * alt-text fallback — not data-fetching. Nav and Footer both call this right
 * after fetching the same `getSiteSettings()` singleton, so the mapping
 * isn't duplicated at both call sites.
 */
export function resolveBrandMarkLogo(
	siteSettings: SiteSettingsLogoField
): BrandMarkLogo | null {
	const asset = siteSettings?.logo?.asset;
	if (!asset) return null;

	return {
		url: urlForImage(asset as never)
			.width(LOGO_WIDTH)
			.height(LOGO_HEIGHT)
			.url(),
		// The logo sits inside the site's primary "home" link (Nav/Footer both
		// wrap it in `<Link href="/">`). altText is an optional schema field —
		// an editor may not have filled it in yet — but an empty `alt` on a
		// linked image is invisible to a screen reader, which would make that
		// link unusable rather than merely under-labelled. Falling back to a
		// fixed, sensible string keeps the link accessible either way.
		alt: siteSettings?.logo?.altText || "Granite Marketing home",
		width: LOGO_WIDTH,
		height: LOGO_HEIGHT,
	};
}

export function BrandMark({
	logo = null,
	hideWordmarkOnMobile = false,
}: {
	/** From `resolveBrandMarkLogo`. `null`/`undefined` (the default — no logo
	 * uploaded in siteSettings, which is the case today) keeps rendering the
	 * inline SVG wordmark below rather than an empty/broken `<img>`. The SVG
	 * stays in the codebase rather than being deleted: it's the permanent
	 * fallback, not a placeholder awaiting the CMS field, since an editor can
	 * always clear the logo field and expect the site to keep a working
	 * brand mark rather than rendering nothing. */
	logo?: BrandMarkLogo | null;
	hideWordmarkOnMobile?: boolean;
}) {
	if (logo) {
		return (
			<Image
				src={logo.url}
				alt={logo.alt}
				width={logo.width}
				height={logo.height}
				className="h-8 w-auto"
				priority
			/>
		);
	}

	return (
		<span className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-relay-ink">
			<RouteGlyph className="h-6 w-auto shrink-0 md:h-4" />
			<span className={hideWordmarkOnMobile ? "hidden md:inline" : undefined}>
				granite
			</span>
		</span>
	);
}
