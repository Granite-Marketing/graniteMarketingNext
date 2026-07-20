/**
 * Resolve a section's `id` into spreadable JSX props.
 *
 * Three states, and the distinction matters:
 * - `undefined` — the prop was not passed at all, so use the component's own
 *   legacy anchor (the still-hardcoded homepage relies on this)
 * - `null` — explicitly anchor-less: a page-builder section whose editor left
 *   `anchorId` empty
 * - a string — use it
 *
 * Returned as props to spread rather than as a value, because
 * `id={undefined}` is not the same as omitting the attribute. React serialises
 * an explicitly-passed undefined prop into the RSC flight payload as
 * `"id":"$undefined"`, which both bloats every page and diverges from the
 * pre-page-builder markup. Spreading an empty object omits it properly.
 */
export function sectionIdProps(
	id: string | null | undefined,
	fallback?: string,
): { id?: string } {
	const resolved = id === undefined ? fallback : id;
	return resolved ? { id: resolved } : {};
}
