"use client";

import { Hero, type ClientLogo } from "@/components/hero";
import { LIVE_LINK_PROJECTION } from "@/lib/sanity/lib/link-projection";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveLink, type ResolveLinkContext } from "@/lib/sanity/lib/resolve-link";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type HeroBlockValue = BlockOf<"heroBlock">;

// Built from `sectionsPath`, not a top-level `defineQuery` constant — this
// string is passed to `usePresentationQuery` (via `useLiveSection`), never
// to `defineQuery`, so it sits outside `sanity typegen`'s static analysis
// entirely (see components/page-builder.tsx's `sectionsPath` comment for
// why the field name varies per document type).
function buildLiveQuery(sectionsPath: string): string {
	return `*[_id == $id][0].${sectionsPath}[_key == $key][0]{
  eyebrow,
  heading,
  body,
  primaryCtaLabel,
  secondaryCta{
    label,
    link${LIVE_LINK_PROJECTION}
  },
  showTrustedBy,
  anchorId
}`;
}

export type HeroBlockAdapterProps = {
	value: HeroBlockValue;
	documentId: string;
	dataSanity: string;
	/** See components/page-builder.tsx's `sectionsPath` prop comment. */
	sectionsPath?: string;
	linkContext?: ResolveLinkContext;
	clientLogos?: ClientLogo[];
};

export function HeroBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
	sectionsPath = "sections",
	linkContext,
	clientLogos,
}: HeroBlockAdapterProps) {
	const value = useLiveSection(
		buildLiveQuery(sectionsPath),
		{ id: documentId, key: initial._key },
		initial
	);

	const secondary = value.secondaryCta?.label
		? resolveLink(value.secondaryCta.link, linkContext)
		: null;

	return (
		<Hero
			clientLogos={clientLogos}
			eyebrow={value.eyebrow ?? undefined}
			heading={value.heading ?? undefined}
			body={value.body ?? undefined}
			primaryCtaLabel={value.primaryCtaLabel ?? undefined}
			secondaryCta={
				secondary && value.secondaryCta?.label
					? { label: value.secondaryCta.label, ...secondary }
					: null
			}
			showTrustedBy={value.showTrustedBy ?? undefined}
			id={resolveAnchorId(value.anchorId, value.heading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
