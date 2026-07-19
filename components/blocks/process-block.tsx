"use client";

import { RelayProcess } from "@/components/process";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type ProcessBlockValue = BlockOf<"processBlock">;

const LIVE_QUERY = `*[_id == $id][0].sections[_key == $key][0]{
  eyebrow,
  heading,
  body,
  steps[]{ _key, stepLabel, title, description, duration },
  footnote,
  anchorId
}`;

export type ProcessBlockAdapterProps = {
	value: ProcessBlockValue;
	documentId: string;
	dataSanity: string;
};

export function ProcessBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
}: ProcessBlockAdapterProps) {
	const value = useLiveSection(
		LIVE_QUERY,
		{ id: documentId, key: initial._key },
		initial
	);

	return (
		<RelayProcess
			eyebrow={value.eyebrow ?? undefined}
			heading={value.heading ?? undefined}
			body={value.body ?? undefined}
			steps={value.steps?.map((step) => ({
				_key: step._key,
				stepLabel: step.stepLabel ?? "",
				title: step.title ?? "",
				description: step.description ?? "",
				duration: step.duration ?? "",
			}))}
			footnote={value.footnote ?? undefined}
			id={resolveAnchorId(value.anchorId, value.heading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
