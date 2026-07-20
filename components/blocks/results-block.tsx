"use client";

import { Results } from "@/components/results";
import { resolveAnchorId } from "@/lib/sanity/lib/anchor-id";
import { resolveDataBlockItems } from "@/lib/sanity/lib/resolve-data-block";
import { adaptCaseStudyToCard } from "@/lib/sanity/lib/adapters";
import { useLiveSection } from "@/lib/sanity/lib/use-live-section";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type ResultsBlockValue = BlockOf<"resultsBlock">;

const CASE_STUDY_FIELDS = `{
    _id,
    title,
    slug,
    client->{ _id, name, company },
    industry->{ _id, name, slug, country, region },
    excerpt,
    featuredImage{ asset, alt },
    loomUrl,
    techStack[]->{ _id, name, slug, integrationType },
    results[]{ metric, value, description }
  }`;

// See components/blocks/hero-block.tsx's `buildLiveQuery` comment: built
// from `sectionsPath`, never handed to `defineQuery`, so it is outside
// typegen's static analysis.
function buildLiveQuery(sectionsPath: string): string {
	return `*[_id == $id][0].${sectionsPath}[_key == $key][0]{
  eyebrow,
  heading,
  stats[]{ _key, value, suffix, label },
  sourceMode,
  "autoItems": *[_type == "caseStudy" && showOnHome == true]
    | order(sortOrder asc, _createdAt desc) ${CASE_STUDY_FIELDS},
  "manualItems": manualCaseStudies[]-> ${CASE_STUDY_FIELDS},
  anchorId
}`;
}

export type ResultsBlockAdapterProps = {
	value: ResultsBlockValue;
	documentId: string;
	dataSanity: string;
	/** See components/page-builder.tsx's `sectionsPath` prop comment. */
	sectionsPath?: string;
};

export function ResultsBlockAdapter({
	value: initial,
	documentId,
	dataSanity,
	sectionsPath = "sections",
}: ResultsBlockAdapterProps) {
	const value = useLiveSection(
		buildLiveQuery(sectionsPath),
		{ id: documentId, key: initial._key },
		initial
	);

	const caseStudies = resolveDataBlockItems({
		sourceMode: value.sourceMode,
		autoItems: value.autoItems,
		manualItems: value.manualItems,
	}).map((doc) => adaptCaseStudyToCard(doc));

	return (
		<Results
			caseStudies={caseStudies}
			eyebrow={value.eyebrow ?? undefined}
			heading={value.heading ?? undefined}
			stats={value.stats?.map((stat) => ({
				_key: stat._key,
				value: stat.value ?? "",
				suffix: stat.suffix ?? undefined,
				label: stat.label ?? "",
			}))}
			id={resolveAnchorId(value.anchorId, value.heading) ?? null}
			dataSanity={dataSanity}
		/>
	);
}
