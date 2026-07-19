"use client";

import { Process } from "@/components/process";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type ProcessBlockValue = BlockOf<"processBlock">;

// See components/blocks/hero-block.tsx's `buildLiveQuery` comment: built
// from `sectionsPath`, never handed to `defineQuery`, so it is outside
// typegen's static analysis.
function buildLiveQuery(sectionsPath: string): string {
	return `*[_id == $id][0].${sectionsPath}[_key == $key][0]{
  eyebrow,
  heading,
  body,
  steps[]{ _key, stepLabel, title, description, duration },
  footnote,
  anchorId
}`;
}

export type ProcessBlockAdapterProps = {
	value: ProcessBlockValue;
	documentId: string;
	dataSanity: string;
	/** See components/page-builder.tsx's `sectionsPath` prop comment. */
	sectionsPath?: string;
};

export function ProcessBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
	sectionsPath = "sections",
}: ProcessBlockAdapterProps) {
	const value = useLiveSection(
		buildLiveQuery(sectionsPath),
		{ id: documentId, key: initial._key },
		initial
	);

	return (
		<Process
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
