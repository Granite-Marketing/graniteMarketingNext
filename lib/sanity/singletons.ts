// The registry of singleton document types (U19 of the Sanity page builder
// plan) — types where exactly one document may ever exist.
//
// This file is the ROOT of the singleton dependency graph, deliberately.
// Schema files import their type name and document id FROM here rather than
// exporting them TO here. Inverting it that way would mean the registry
// imported fourteen schema modules just to read six strings, and would make
// the enforcement mechanisms in lib/sanity/structure.ts transitively depend
// on every schema in the repo.
//
// A singleton's `_id` is deliberately identical to its `_type`. Two ids to
// keep in sync per type buys nothing, and `*[_id == "blogListing"][0]` reads
// as obviously-one-document in a way `*[_type == ...][0]` does not.
//
// Adding a singleton means adding it here and nothing else — the desk pin,
// the "+"-menu exclusion, and the duplicate/delete strip all read this list.

export const SINGLETON_TYPES = {
	siteSettings: "siteSettings",
	blogListing: "blogListing",
	blogPostTemplate: "blogPostTemplate",
	templateListing: "templateListing",
	templateDetail: "templateDetail",
	contactPage: "contactPage",
} as const;

export type SingletonType =
	(typeof SINGLETON_TYPES)[keyof typeof SINGLETON_TYPES];

/**
 * Every singleton type name. Used by the desk to exclude these from the
 * generic type list, by `newDocumentOptions` to strip them from the "+"
 * menu, and by `document.actions` to remove duplicate/delete.
 */
export const SINGLETON_TYPE_LIST: readonly SingletonType[] =
	Object.values(SINGLETON_TYPES);

const SINGLETON_TYPE_SET = new Set<string>(SINGLETON_TYPE_LIST);

export function isSingletonType(type: string | undefined): boolean {
	return type !== undefined && SINGLETON_TYPE_SET.has(type);
}

/**
 * The fixed document id for a singleton type. Identical to the type name —
 * see the header comment for why. Exposed as a function rather than a second
 * map so the two can never drift.
 */
export function singletonDocumentId(type: SingletonType): string {
	return type;
}
