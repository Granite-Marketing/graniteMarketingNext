import type {
	DocumentActionComponent,
	DocumentActionsContext,
	NewDocumentOptionsContext,
	TemplateItem,
} from "sanity";
import type { ListItemBuilder, StructureResolver } from "sanity/structure";
import {
	SINGLETON_TYPE_LIST,
	isSingletonType,
	singletonDocumentId,
	type SingletonType,
} from "./singletons";

// The Studio's desk structure (U9 of the Sanity page builder plan, singleton
// enforcement generalised in U19a) — the first structure customisation in
// this repo; `structureTool()` was previously called bare. Its whole job
// here is mechanism (1) and (2) of the singleton pin (see
// lib/sanity/singletons.ts's header comment for why the registry lives
// there, and for all three mechanisms). Mechanism (3) — stripping
// `duplicate`/`delete` and the "+" menu entry — lives below and is wired on
// `document`, not on this structure, in sanity.config.ts. There is no
// `singleton: true` schema option and `__experimental_actions` was removed
// in sanity 4.x; neither is reached for here.

// Desk ordering is explicit rather than auto-generated. The generated list
// sorts by registration order, which buried `page` among the taxonomy types
// even though it is the thing an editor reaches for most. Emoji prefixes in
// schema titles had been doing this job by hand; grouping does it properly.
//
// Order runs from "what you edit most" to "what you edit rarely": the
// singleton, then composed pages, then editorial content, then the records
// that feed content blocks, then taxonomy.
const PAGE_TYPES = ["page", "legalPage"];
// caseStudy is the only editorial type left here (U20) — blogPost and
// workflowTemplate moved out to become children of their listing singleton
// below. caseStudy stays because it has no listing page type to nest under:
// Phase 6's desk shape gives Blog and Templates a chrome singleton
// (blogListing/templateListing) to own their record list, but there is no
// equivalent "case study listing" document, so caseStudy keeps a plain
// top-level row.
const EDITORIAL_TYPES = ["caseStudy"];
const RECORD_TYPES = ["client", "faq", "logoList", "tool"];
const TAXONOMY_TYPES = ["author", "category", "location", "workflowCategory"];
// The two record types nested under a listing singleton (U20). Not derived
// from EDITORIAL_TYPES/PAGE_TYPES because neither list means "nested" —
// this is its own axis (top-level vs. nested), and blogPost/workflowTemplate
// no longer belong to any of the grouped arrays above. They still need to
// land in the `grouped` exclusion Set below, or they would ALSO pass the
// auto-generated passthrough filter at the bottom of the resolver and
// appear a second time as an ordinary top-level document list — see that
// comment for why the Set exists at all.
const NESTED_RECORD_TYPES = ["blogPost", "workflowTemplate"];

// Mechanism (1) — pin a singleton's desk list item to the fixed document
// id, so opening it always edits the same document regardless of what (if
// anything) exists in the dataset yet. A small helper rather than one-off
// chains because every singleton needs the identical three-call shape;
// `singletonDocumentId` guarantees the id matches the type per
// singletons.ts's header comment.
//
// Pinning a schema type that isn't registered throws at runtime, so a
// singleton earns its desk entry only once its schema is in the barrel.
function pinnedSingletonListItem(
	S: Parameters<StructureResolver>[0],
	type: SingletonType,
	title: string
): ListItemBuilder {
	return S.listItem()
		.title(title)
		.id(type)
		.child(S.document().schemaType(type).documentId(singletonDocumentId(type)));
}

// U20 — nests a record type's document list under its listing singleton,
// rather than pinning the singleton straight to its document (what
// `pinnedSingletonListItem` does for the other four page-type singletons).
// Presentation only: no schema change, no URL change, no document
// migration, so getting this wrong costs a re-render, not a URL — see
// Phase 6's "Model, and what was deliberately rejected" for why hierarchy
// lives in desk structure rather than in a `parent` field.
//
// The child is a two-item list, not a hand-rolled record list:
//   1. an entry that reopens the singleton document itself (identical
//      shape to `pinnedSingletonListItem`'s child), so the listing page's
//      own chrome/SEO fields stay reachable from inside the nest — nesting
//      must not make the listing document itself harder to find;
//   2. `S.documentTypeListItem(nestedType)`, the real builder Sanity ships
//      for "every document of this type", not a substitute. Creating a
//      blog post from inside this nested list goes through the ordinary
//      create flow and lands with the right `_type`, exactly as it would
//      from a top-level list — only where the entry point lives changed.
// A topic section: one sidebar row holding everything for that topic — the
// listing page's own settings, the layout applied to every record, and the
// records themselves.
//
// `title` names the SECTION; each entry inside carries its own title, and
// they must differ from it. Passing one title into every position produced a
// "Blog Listing" row that opened a panel headed "Blog Listing" whose first
// row was also "Blog Listing", which reads as a rendering bug rather than a
// hierarchy. The section is the topic ("Blogs"); the entries are the
// specific documents inside it.
//
// The section keeps the listing singleton's own type as its desk id so the
// /studio/structure/<id> URL stays stable, even though the row is now a
// container rather than a direct pin.
//
// `S.documentTypeListItem(nestedType)` is the real builder Sanity ships for
// "every document of this type", not a substitute — creating a blog post
// from inside this section goes through the ordinary create flow and lands
// with the right `_type`, exactly as it would from a top-level list. Only
// where the entry point lives changed.
function pageSection(
	S: Parameters<StructureResolver>[0],
	sectionId: SingletonType,
	title: string,
	singletonEntries: readonly { type: SingletonType; title: string }[],
	nestedType: string,
	nestedTitle: string
): ListItemBuilder {
	return S.listItem()
		.title(title)
		.id(sectionId)
		.child(
			S.list()
				.title(title)
				.items([
					...singletonEntries.map((entry) =>
						S.listItem()
							.title(entry.title)
							.id(`${entry.type}-document`)
							.child(
								S.document()
									.schemaType(entry.type)
									.documentId(singletonDocumentId(entry.type))
							)
					),
					S.documentTypeListItem(nestedType).title(nestedTitle),
				])
		);
}

export const structure: StructureResolver = (S) => {
	// Mechanism (2) — every registered singleton type is excluded here, not
	// only the ones with a desk entry above. Without this any of them would
	// ALSO appear as an ordinary (uncapped) document list the moment its
	// schema is registered, defeating the pin before anyone remembers to add
	// the exclusion. blogPost and workflowTemplate are added on top of the
	// four grouped arrays for the same reason (U20): they're nested rather
	// than grouped, but still need keeping out of the bottom passthrough.
	const grouped = new Set([
		...SINGLETON_TYPE_LIST,
		...PAGE_TYPES,
		...EDITORIAL_TYPES,
		...RECORD_TYPES,
		...TAXONOMY_TYPES,
		...NESTED_RECORD_TYPES,
	]);

	const listFor = (types: string[]) =>
		types.map((type) => S.documentTypeListItem(type));

	return S.list()
		.title("Content")
		.items([
			pinnedSingletonListItem(S, "siteSettings", "Site Settings"),
			S.divider(),

			// The fixed-route page types, grouped above the creatable page
			// lists. These are the pages that always exist and can only be
			// edited, never created or deleted; `page`/`legalPage` below are
			// the ad-hoc ones an editor adds. Listing/detail pairs sit
			// together so the relationship reads off the desk.
			//
			// blogListing and templateListing use `nestedListingListItem`
			// rather than `pinnedSingletonListItem` (U20): each expands to the
			// listing document AND its record list, so Blog Posts lives under
			// Blog Listing and Workflow Templates under Template Listing
			// instead of both sitting as unrelated top-level rows.
			// Everything for a topic lives inside that topic's section: the
			// listing page's settings, the layout wrapped around every record,
			// and the records. Two rows instead of five, and nothing
			// blog-shaped sits outside "Blogs".
			//
			// Emoji prefixes match the convention the record types already use
			// (📊 Case Study, 👤 Client, …) so these rows don't read as a
			// different class of thing sitting above them.
			// Entries inside a section are named for the CONCEPT, not the topic:
			// "Blogs > Listing" reads better than "Blogs > Blog Listing", and
			// the pair Listing/Detail is the vocabulary editors are taught
			// once and then recognise in every section. "Blog Posts Detail"
			// would also have been quietly wrong — the detail page is not the
			// posts, it is the frame around each one.
			//
			// The gear marks a page-settings document; the records below it
			// carry no gear. That is the second thing the desk teaches: gear
			// means how a page is built, plain means your content.
			//
			// Each document's OWN title stays contextual ("Blog Post Detail",
			// see its preview.prepare) — a bare "Detail" is fine nested under
			// "Blogs" but ambiguous in search, a browser tab, or Presentation,
			// where the tree isn't there to supply the topic.
			pageSection(
				S,
				"blogListing",
				"📝 Blogs",
				[
					{ type: "blogListing", title: "⚙️ Listing" },
					{ type: "blogPostTemplate", title: "⚙️ Detail" },
				],
				"blogPost",
				"Blog Posts"
			),
			pageSection(
				S,
				"templateListing",
				"⚡ Templates",
				[
					{ type: "templateListing", title: "⚙️ Listing" },
					{ type: "templateDetail", title: "⚙️ Detail" },
				],
				"workflowTemplate",
				"Workflow Templates"
			),
			pinnedSingletonListItem(S, "contactPage", "✉️ Contact"),
			S.divider(),
			...listFor(PAGE_TYPES),
			S.divider(),
			...listFor(EDITORIAL_TYPES),
			S.divider(),
			...listFor(RECORD_TYPES),
			S.divider(),
			...listFor(TAXONOMY_TYPES),

			// Anything registered but not placed above still shows up, so a
			// new document type is never silently missing from the desk.
			...S.documentTypeListItems().filter(
				(listItem) => !grouped.has(listItem.getId() ?? "")
			),
		]);
};

const HIDDEN_SINGLETON_ACTIONS = new Set(["duplicate", "delete"]);

/**
 * Mechanism (3a) — strip `duplicate` and `delete` from every registered
 * singleton's action menu, not only siteSettings. A duplicate would produce
 * a second singleton-shaped document (orphaned, since the desk pin only
 * ever opens the fixed id) and a delete would leave the pinned id unable to
 * render a form. Every other default action (publish, discard changes,
 * unpublish, restore) is left alone. Every non-singleton document type
 * passes through completely untouched.
 *
 * Wired on `document.actions` in sanity.config.ts, NOT on the structure tool
 * — `document.actions` is unrelated to `structureTool()`'s own `structure`
 * or (deprecated) `defaultDocumentNode` options.
 */
export function filterSingletonDocumentActions(
	prev: DocumentActionComponent[],
	context: DocumentActionsContext
): DocumentActionComponent[] {
	if (!isSingletonType(context.schemaType)) return prev;
	return prev.filter(
		(action) => !HIDDEN_SINGLETON_ACTIONS.has(action.action ?? "")
	);
}

/**
 * Mechanism (3b) — remove every registered singleton type from the global
 * "+" / new-document menu. The desk pin (mechanism 1) is the only entry
 * point that should ever open one of these documents; a second document
 * created via the "+" menu would not be the pinned one and would be
 * invisible to every reader that queries `_id == "<type>"`.
 *
 * Wired on `document.newDocumentOptions` in sanity.config.ts.
 */
export function filterSingletonsFromNewDocumentMenu(
	prev: TemplateItem[],
	_context: NewDocumentOptionsContext
): TemplateItem[] {
	return prev.filter((item) => !isSingletonType(item.templateId));
}
