"use client";

import { Hero, type ClientLogo } from "@/components/hero";
import { LIVE_LINK_PROJECTION } from "@/lib/sanity/lib/link-projection";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveLink, type ResolveLinkContext } from "@/lib/sanity/lib/resolve-link";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type HeroBlockValue = BlockOf<"heroBlock">;

const LIVE_QUERY = `*[_id == $id][0].sections[_key == $key][0]{
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

export type HeroBlockAdapterProps = {
	value: HeroBlockValue;
	documentId: string;
	dataSanity: string;
	linkContext?: ResolveLinkContext;
	clientLogos?: ClientLogo[];
};

export function HeroBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
	linkContext,
	clientLogos,
}: HeroBlockAdapterProps) {
	const value = useLiveSection(
		LIVE_QUERY,
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
