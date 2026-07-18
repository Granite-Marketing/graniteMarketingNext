// Auto-generates a block's `anchorId` HTML id from its heading when the
// editor leaves the field blank, so every section is nav-linkable without
// forcing an editor to hand-type an id (R6 of the Sanity page builder
// plan). The manually-entered `anchorId` value always wins — this is the
// "override" half of "auto-generated with manual override": Studio just
// stores whatever the editor typed (or nothing), and this function fills
// the gap at render time.
//
// Deliberately a plain string, not Sanity's `slug` type: U11's anchor
// picker (lib/sanity/studio-schemas/objects/link/anchor-input.tsx, not yet
// built) already assumes a flat `sections[]{_key, anchorId}` GROQ
// projection. A `slug` field would nest the value under `.current` and
// break that query, so every block schema in this unit declares `anchorId`
// as `type: "string"` and this helper is the auto-generation half of the
// contract those schemas rely on.

const ANCHOR_MAX_LENGTH = 64;

function slugifyForAnchor(source: string): string {
	return source
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, ANCHOR_MAX_LENGTH);
}

/**
 * Resolve the id a rendered section should carry.
 *
 * - An explicit `anchorId` (trimmed) always wins over the heading.
 * - Otherwise falls back to a slugified `heading`.
 * - Both blank resolves to `undefined` — mirrors U13's own test scenario
 *   that a section without an anchor omits the `id` attribute rather than
 *   emitting `id=""`.
 */
export function resolveAnchorId(
	explicitAnchorId: string | null | undefined,
	heading: string | null | undefined
): string | undefined {
	const explicit = explicitAnchorId?.trim();
	if (explicit) return explicit;

	const fallback = heading ? slugifyForAnchor(heading) : "";
	return fallback || undefined;
}
