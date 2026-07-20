import { resolveAnchorId } from "../lib/anchor-id";

// Pure option-deriving logic for the anchor picker on `link.anchorId` (U11
// of the Sanity page builder plan). Split out from anchor-id-input.tsx so it
// can be tested directly, without rendering React or touching Sanity's
// `useClient`/`useFormValue` hooks — see that file's own comment for why
// `@sanity/ui` is unavailable here and the input is built from plain
// elements instead.
//
// The GROQ projection every fetch in anchor-id-input.tsx sends. `heading`
// is coalesced across block schemas: every block except `ctaBlock` names
// its heading field `heading`; `ctaBlock` names it `ctaHeading` (see
// blocks/ctaBlock.ts). `coalesce` picks whichever one the section's `_type`
// actually has — it degrades to a no-op for the seven block types that use
// `heading` directly, and picks up the eighth without this file (or the
// query) needing to branch on `_type`.
export const ANCHOR_SECTIONS_QUERY = `*[_id == $id][0]{
	"sections": sections[]{
		_key,
		anchorId,
		"heading": coalesce(heading, ctaHeading)
	}
}`;

export type AnchorSectionDoc = {
	_key: string;
	anchorId?: string | null;
	heading?: string | null;
};

export type AnchorOption = {
	value: string;
	title: string;
};

/**
 * Turns a page's raw `sections[]` into the list of anchor ids an editor can
 * actually link to.
 *
 * Runs every section through the same `resolveAnchorId` its renderer uses
 * (U13), so a section that never got an explicit `anchorId` still appears
 * here under the id it will actually render with — the
 * auto-generated-from-heading half of R6's anchor integrity guarantee.
 * Leaving those out would make the dropdown miss exactly the entries an
 * editor is most likely to want: most sections rely on the auto-derived id
 * and never set one explicitly.
 *
 * `title` marks which is which, so an editor doesn't mistake a
 * heading-derived id (liable to change the moment someone edits the
 * heading) for one that was deliberately pinned.
 *
 * A section that resolves to no id at all (blank `anchorId` AND blank
 * heading) is silently excluded — there is nothing to link to. Duplicate
 * resolved ids (two sections landing on the same auto-derived id, or an
 * explicit id colliding with another section's) collapse to their first
 * occurrence rather than appearing twice.
 *
 * `sections` defaulting to `[]` covers both "no `sections` array on the
 * fetched document" (e.g. the query failed, or found nothing) and an
 * explicit `sections: []` without a separate branch — either way this
 * returns `[]` rather than throwing.
 */
export function deriveAnchorOptions(
	sections: AnchorSectionDoc[] | null | undefined
): AnchorOption[] {
	const seen = new Set<string>();
	const options: AnchorOption[] = [];

	for (const section of sections ?? []) {
		const resolved = resolveAnchorId(section.anchorId, section.heading);
		if (!resolved || seen.has(resolved)) continue;
		seen.add(resolved);

		const isExplicit = Boolean(section.anchorId?.trim());
		options.push({
			value: resolved,
			title: isExplicit ? resolved : `${resolved} (auto, from heading)`,
		});
	}

	return options;
}

/**
 * The escape hatch. A stored `anchorId` that doesn't match anything the
 * referenced page currently has — the page is a draft the query can't see,
 * the fetch failed, the editor is linking ahead of creating the section, or
 * the page simply changed since — must stay visible and stay IN the field,
 * never get silently dropped from the list or cleared out from under the
 * editor. A dropdown that can only show what it already knows about is
 * worse than the free text it replaced.
 *
 * Appending the stored value (when it isn't already present) keeps the
 * select showing the true stored value even when that value isn't, or
 * isn't yet, one of the page's real anchors.
 */
export function withStoredValue(
	options: AnchorOption[],
	storedValue: string | undefined
): AnchorOption[] {
	const trimmed = storedValue?.trim();
	if (!trimmed) return options;
	if (options.some((option) => option.value === trimmed)) return options;

	return [
		...options,
		{ value: trimmed, title: `${trimmed} (not found on this page)` },
	];
}
