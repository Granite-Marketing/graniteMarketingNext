// The single resolution point for every data block's auto/manual source
// toggle (R4 of the Sanity page builder plan) — testimonialsBlock,
// faqBlock, toolsStripBlock and resultsBlock's case studies all read
// through this one function rather than each re-implementing the switch.
//
// Order preservation is the trap this exists to avoid. GROQ dereferences
// an array of references element-by-element (`manualRefs[]->{...}`), so
// the query layer already hands this function `manualItems` in the
// editor's chosen order — the bug a naive implementation reaches for is a
// *second* lookup like `*[_id in $ids]`, which returns results in
// document/query order, not `$ids` order, silently discarding the
// editor's ordering. This function only *selects* between `autoItems` and
// `manualItems`; it must never re-sort, re-query or otherwise touch order.

export type SourceMode = "auto" | "manual";

export type DataBlockSource<T> = {
	sourceMode?: SourceMode | null;
	autoItems?: readonly (T | null | undefined)[] | null;
	manualItems?: readonly (T | null | undefined)[] | null;
};

function compact<T>(
	items: readonly (T | null | undefined)[] | null | undefined
): T[] {
	if (!items) return [];
	// Filters out dangling references — GROQ dereferences a deleted or
	// unpublished document to `null` in place, so the array's positions
	// are preserved right up until this filter, which only drops holes.
	return items.filter((item): item is T => item != null);
}

/**
 * Resolve a data block's items per its `sourceMode`.
 *
 * - `"manual"` returns `manualItems` in the stored order, with dangling
 *   references filtered out rather than left as holes.
 * - anything else (`"auto"`, unset, or an unrecognised value) returns
 *   `autoItems` — `"auto"` is every block's schema `initialValue`, so an
 *   unset `sourceMode` is treated the same as `"auto"` rather than as an
 *   empty state.
 * - An empty or missing array in either mode resolves to `[]` and never
 *   throws — manual mode with nothing picked is a valid, expected editor
 *   state (the block's empty state), not an error condition.
 */
export function resolveDataBlockItems<T>(source: DataBlockSource<T>): T[] {
	if (source.sourceMode === "manual") {
		return compact(source.manualItems);
	}
	return compact(source.autoItems);
}
