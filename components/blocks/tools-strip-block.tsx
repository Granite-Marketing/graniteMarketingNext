"use client";

import { ToolsStrip } from "@/components/tools-strip";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveDataBlockItems } from "@/lib/sanity/lib/resolve-data-block";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type ToolsStripBlockValue = BlockOf<"toolsStripBlock">;

const LIVE_QUERY = `*[_id == $id][0].sections[_key == $key][0]{
  eyebrow,
  heading,
  intro,
  sourceMode,
  "autoItems": *[_type == "tool"] | order(name asc) { _id, name, logo{ asset, alt } },
  "manualItems": manualTools[]->{ _id, name, logo{ asset, alt } },
  anchorId
}`;

export type ToolsStripBlockAdapterProps = {
	value: ToolsStripBlockValue;
	documentId: string;
	dataSanity: string;
};

export function ToolsStripBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
}: ToolsStripBlockAdapterProps) {
	const value = useLiveSection(
		LIVE_QUERY,
		{ id: documentId, key: initial._key },
		initial
	);

	const tools = resolveDataBlockItems({
		sourceMode: value.sourceMode,
		autoItems: value.autoItems,
		manualItems: value.manualItems,
	}).map((tool) => ({
		_id: tool._id,
		name: tool.name ?? "",
		logo: tool.logo
			? { asset: tool.logo.asset, alt: tool.logo.alt ?? undefined }
			: undefined,
	}));

	return (
		<ToolsStrip
			tools={tools}
			eyebrow={value.eyebrow ?? undefined}
			heading={value.heading ?? undefined}
			intro={value.intro ?? undefined}
			id={resolveAnchorId(value.anchorId, value.heading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
