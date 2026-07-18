import { resolveLink } from "./resolve-link";
import type { LinkValue, ResolveLinkContext, ResolvedLink } from "./resolve-link";

// The fallback resolver for the Global CTA (U9 of the Sanity page builder
// plan). `ctaBlock` itself does not exist yet — it lands in U12 — but the
// behaviour it depends on is independent of that schema, so it is locked
// down here with plain objects standing in for the query results of both
// sides.
//
// "Global CTA is a default, not a fixed value": the contact CTA repeats
// across pages, so its copy lives once on the siteSettings singleton
// (ctaHeading / ctaSubtitle / ctaButton / ctaFootnote — see siteSettings.ts)
// and `ctaBlock` will declare every one of those fields OPTIONAL, resolving
// through this function. A block dropped on a new page with no
// configuration renders the house CTA; a landing page needing a different
// ask overrides just the fields it cares about.
//
// The trap this guards against: resolving `ctaButton` (and the CTA as a
// whole) as one atomic unit — `block.cta ?? siteSettings.cta` — instead of
// per top-level field. That breaks the moment an editor overrides only the
// heading: the naive version either keeps the WHOLE block object (losing
// the singleton's subtitle/button/footnote, since the block's own
// ctaSubtitle etc. are `undefined`, not absent) or keeps the WHOLE singleton
// object (silently discarding the one field the editor did set). Each field
// below falls back independently instead.

type LabeledLinkValue =
	| {
			label?: string | null;
			link?: LinkValue;
	  }
	| null
	| undefined;

export type SiteSettingsCtaDefaults = {
	ctaHeading?: string | null;
	ctaSubtitle?: string | null;
	ctaButton?: LabeledLinkValue;
	ctaFootnote?: string | null;
};

export type CtaBlockOverrides = {
	ctaHeading?: string | null;
	ctaSubtitle?: string | null;
	ctaButton?: LabeledLinkValue;
	ctaFootnote?: string | null;
};

export type ResolvedCtaButton = ResolvedLink & { label: string };

export type ResolvedCta = {
	heading: string | null;
	subtitle: string | null;
	button: ResolvedCtaButton | null;
	footnote: string | null;
};

/**
 * `ctaButton` is resolved as one atomic unit per SOURCE (the block's own
 * button either fully replaces the singleton's, or is absent and the
 * singleton's is used whole) — unlike the top-level string fields, a label
 * and a link can't be sensibly recombined from two different sources.
 */
function resolveCtaButton(
	source: LabeledLinkValue,
	context: ResolveLinkContext
): ResolvedCtaButton | null {
	if (!source?.label) return null;
	const resolved = resolveLink(source.link, context);
	if (!resolved) return null;
	return { label: source.label, ...resolved };
}

export function resolveCta(
	block: CtaBlockOverrides | null | undefined,
	siteSettings: SiteSettingsCtaDefaults | null | undefined,
	context: ResolveLinkContext = {}
): ResolvedCta {
	const heading = block?.ctaHeading ?? siteSettings?.ctaHeading ?? null;
	const subtitle = block?.ctaSubtitle ?? siteSettings?.ctaSubtitle ?? null;
	const footnote = block?.ctaFootnote ?? siteSettings?.ctaFootnote ?? null;

	const buttonSource = block?.ctaButton ?? siteSettings?.ctaButton ?? null;
	const button = resolveCtaButton(buttonSource, context);

	return { heading, subtitle, button, footnote };
}
