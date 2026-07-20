import { createDataAttribute } from "next-sanity";
import { dataset, projectId } from "../env";

// U13 of the Sanity page builder plan: there is NO `defineDataAttribute`
// helper — verified against node_modules, not assumed. `createDataAttribute`
// IS re-exported from `next-sanity` (itself re-exporting
// `@sanity/visual-editing-csm`'s implementation). Its signature, read from
// `@sanity/visual-editing-csm`'s `.d.ts`:
//
//   createDataAttribute(props: CreateDataAttributeProps): CreateDataAttribute<T>
//
// where `CreateDataAttributeProps` is `{ baseUrl?, dataset?, id?, path?,
// projectId?, tool?, type?, workspace?, perspective? }`. Once `id` and
// `type` are supplied (and `path` is not), the return value is itself
// callable — `attr(path)` — and returns the finished `data-sanity` string
// directly, no separate `.toString()` needed.
//
// This factory is the "small factory holding {projectId, dataset, baseUrl}"
// KTD/U13 calls for: every call site supplies only what's specific to it
// (the document being targeted, and the path within it), never the project
// config, so a project/dataset move is a one-line change here instead of a
// grep across every block adapter.

const STUDIO_BASE_URL = "/studio";

export type DataAttributeDocument = {
	/** The document's `_id` — the *published* id, e.g. from `page._id`. */
	id: string;
	/** The document's `_type`, e.g. `"page"` or `"legalPage"`. */
	type: string;
};

function forDocument(doc: DataAttributeDocument) {
	return createDataAttribute({
		projectId,
		dataset,
		baseUrl: STUDIO_BASE_URL,
		id: doc.id,
		type: doc.type,
	});
}

/**
 * Container-level attribute for the whole sections array. On its own this
 * gives no per-section selection — see `sectionDataAttribute` below, which
 * is what actually maps a click to one array item. Both are required (U13).
 *
 * `sectionsPath` defaults to `"sections"` — the field name on a `page`
 * document. The five page-type singletons (blogListing, blogPostTemplate,
 * templateListing, templateDetail, contactPage) store their blocks in
 * `sectionsAbove`/`sectionsBelow` instead, and their PageBuilder call sites
 * (app/blog/page.tsx etc.) pass the matching path explicitly — see
 * components/page-builder.tsx's `sectionsPath` prop, which is what actually
 * supplies this argument.
 */
export function sectionsDataAttribute(
	doc: DataAttributeDocument,
	sectionsPath: string = "sections"
): string {
	return forDocument(doc)(sectionsPath);
}

/**
 * Item-level attribute for exactly one section, targeted by `_key` — never
 * by array index (KTD5). Index-based paths silently point at the wrong item
 * the moment an editor reorders, which is the entire feature this unit
 * exists to ship.
 *
 * `sectionsPath` — see `sectionsDataAttribute`'s comment above.
 */
export function sectionDataAttribute(
	doc: DataAttributeDocument,
	sectionKey: string,
	sectionsPath: string = "sections"
): string {
	return forDocument(doc)(`${sectionsPath}[_key=="${sectionKey}"]`);
}
