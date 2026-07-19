"use client";

import { Capabilities } from "@/components/capabilities";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveLink, type ResolveLinkContext } from "@/lib/sanity/lib/resolve-link";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type CapabilitiesBlockValue = BlockOf<"capabilitiesBlock">;

const LIVE_QUERY = `*[_id == $id][0].sections[_key == $key][0]{
  eyebrow,
  heading,
  body,
  items[]{ _key, tag, title, description, featured, snippet },
  link{
    label,
    link{
      linkType,
      internalRef->{ _type, _id, slug },
      anchorPage->{ _type, _id, slug },
      anchorId,
      href,
      openInNewTab
    }
  },
  anchorId
}`;

export type CapabilitiesBlockAdapterProps = {
	value: CapabilitiesBlockValue;
	documentId: string;
	dataSanity: string;
	linkContext?: ResolveLinkContext;
};

export function CapabilitiesBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
	linkContext,
}: CapabilitiesBlockAdapterProps) {
	const value = useLiveSection(
		LIVE_QUERY,
		{ id: documentId, key: initial._key },
		initial
	);

	const footerLink =
		value.link?.label && value.link.link
			? resolveLink(value.link.link, linkContext)
			: null;

	return (
		<Capabilities
			eyebrow={value.eyebrow ?? undefined}
			heading={value.heading ?? undefined}
			body={value.body ?? undefined}
			items={
				value.items?.map((item) => ({
					_key: item._key,
					tag: item.tag ?? "",
					title: item.title ?? "",
					description: item.description ?? "",
					featured: item.featured ?? undefined,
					snippet: item.snippet ?? undefined,
				})) ?? []
			}
			link={
				footerLink && value.link?.label
					? { label: value.link.label, href: footerLink.href }
					: null
			}
			id={resolveAnchorId(value.anchorId, value.heading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
