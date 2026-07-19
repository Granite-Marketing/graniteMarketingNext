"use client";

import { CTA } from "@/components/cta";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveLink, type ResolveLinkContext } from "@/lib/sanity/lib/resolve-link";
import {
	resolveCta,
	type SiteSettingsCtaDefaults,
} from "@/lib/sanity/lib/resolve-cta";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type CtaBlockValue = BlockOf<"ctaBlock">;

const LIVE_QUERY = `*[_id == $id][0].sections[_key == $key][0]{
  ctaHeading,
  ctaSubtitle,
  ctaButton{
    label,
    link{
      linkType,
      internalRef->{ _type, _id, slug },
      anchorPage->{ _type, _id, slug },
      anchorId,
      href,
      openInNewTab,
      calLink
    }
  },
  ctaFootnote,
  secondaryCta{
    label,
    link{
      linkType,
      internalRef->{ _type, _id, slug },
      anchorPage->{ _type, _id, slug },
      anchorId,
      href,
      openInNewTab,
      calLink
    }
  },
  anchorId
}`;

export type CtaBlockAdapterProps = {
	value: CtaBlockValue;
	documentId: string;
	dataSanity: string;
	linkContext?: ResolveLinkContext;
	/**
	 * siteSettings' Global CTA defaults (PAGE_CTA_DEFAULTS_QUERY in
	 * lib/sanity/queries.ts) — every ctaBlock field falls back to these,
	 * per-field, via lib/sanity/lib/resolve-cta.ts. `secondaryCta` is
	 * DELIBERATELY excluded from this fallback: it has no siteSettings
	 * equivalent (recorded in the plan's "Open from execution" notes —
	 * `cta.tsx` renders two CTAs, but the Global CTA defaults only model
	 * the primary one), so it resolves from the block alone or not at all.
	 */
	siteSettingsCtaDefaults?: SiteSettingsCtaDefaults | null;
};

export function CtaBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
	linkContext,
	siteSettingsCtaDefaults,
}: CtaBlockAdapterProps) {
	const value = useLiveSection(
		LIVE_QUERY,
		{ id: documentId, key: initial._key },
		initial
	);

	const resolved = resolveCta(value, siteSettingsCtaDefaults, linkContext);

	const secondary =
		value.secondaryCta?.label && value.secondaryCta.link
			? resolveLink(value.secondaryCta.link, linkContext)
			: null;

	return (
		<CTA
			heading={resolved.heading ?? undefined}
			subtitle={resolved.subtitle ?? undefined}
			primaryCtaLabel={resolved.button?.label ?? undefined}
			secondaryCta={
				secondary && value.secondaryCta?.label
					? { label: value.secondaryCta.label, ...secondary }
					: null
			}
			footnote={resolved.footnote ?? undefined}
			id={resolveAnchorId(value.anchorId, value.ctaHeading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
