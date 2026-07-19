import type {
	DocumentActionComponent,
	DocumentActionsContext,
	NewDocumentOptionsContext,
	TemplateItem,
} from "sanity";
import type { StructureResolver } from "sanity/structure";
import { SITE_SETTINGS_ID, SITE_SETTINGS_TYPE } from "./studio-schemas/documents/siteSettings";

// The Studio's desk structure (U9 of the Sanity page builder plan) — the
// first structure customisation in this repo; `structureTool()` was
// previously called bare. Its whole job here is mechanism (1) and (2) of the
// siteSettings singleton pin (see siteSettings.ts's header comment for all
// three). Mechanism (3) — stripping `duplicate`/`delete` and the "+" menu
// entry — lives below and is wired on `document`, not on this structure, in
// sanity.config.ts. There is no `singleton: true` schema option and
// `__experimental_actions` was removed in sanity 4.x; neither is reached for
// here.

// Desk ordering is explicit rather than auto-generated. The generated list
// sorts by registration order, which buried `page` among the taxonomy types
// even though it is the thing an editor reaches for most. Emoji prefixes in
// schema titles had been doing this job by hand; grouping does it properly.
//
// Order runs from "what you edit most" to "what you edit rarely": the
// singleton, then composed pages, then editorial content, then the records
// that feed content blocks, then taxonomy.
const PAGE_TYPES = ["page", "legalPage"];
const EDITORIAL_TYPES = ["blogPost", "workflowTemplate", "caseStudy"];
const RECORD_TYPES = ["client", "faq", "logoList", "tool"];
const TAXONOMY_TYPES = ["author", "category", "location", "workflowCategory"];

// Mechanism (1) — pin the desk list item's child to the fixed document id,
// so opening "Site Settings" always edits the same document regardless of
// what (if anything) exists in the dataset yet.
export const structure: StructureResolver = (S) => {
	// Mechanism (2) — siteSettings is excluded here as well as pinned above.
	// Without this it would ALSO appear as an ordinary (uncapped) document
	// list, defeating the pin.
	const grouped = new Set([
		SITE_SETTINGS_TYPE,
		...PAGE_TYPES,
		...EDITORIAL_TYPES,
		...RECORD_TYPES,
		...TAXONOMY_TYPES,
	]);

	const listFor = (types: string[]) =>
		types.map((type) => S.documentTypeListItem(type));

	return S.list()
		.title("Content")
		.items([
			S.listItem()
				.title("Site Settings")
				.id(SITE_SETTINGS_TYPE)
				.child(
					S.document()
						.schemaType(SITE_SETTINGS_TYPE)
						.documentId(SITE_SETTINGS_ID)
				),
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

const HIDDEN_SITE_SETTINGS_ACTIONS = new Set(["duplicate", "delete"]);

/**
 * Mechanism (3a) — strip `duplicate` and `delete` from the singleton's
 * action menu. A duplicate would produce a second siteSettings-shaped
 * document (orphaned, since the desk pin only ever opens the fixed id) and a
 * delete would leave the pinned id unable to render a form. Every other
 * default action (publish, discard changes, unpublish, restore) is left
 * alone. Every other document type passes through completely untouched.
 *
 * Wired on `document.actions` in sanity.config.ts, NOT on the structure tool
 * — `document.actions` is unrelated to `structureTool()`'s own `structure`
 * or (deprecated) `defaultDocumentNode` options.
 */
export function filterSiteSettingsDocumentActions(
	prev: DocumentActionComponent[],
	context: DocumentActionsContext
): DocumentActionComponent[] {
	if (context.schemaType !== SITE_SETTINGS_TYPE) return prev;
	return prev.filter(
		(action) => !HIDDEN_SITE_SETTINGS_ACTIONS.has(action.action ?? "")
	);
}

/**
 * Mechanism (3b) — remove siteSettings from the global "+" / new-document
 * menu. The desk pin (mechanism 1) is the only entry point that should ever
 * open it; a second document created via the "+" menu would not be the
 * pinned one and would be invisible to every reader that queries
 * `_id == "siteSettings"`.
 *
 * Wired on `document.newDocumentOptions` in sanity.config.ts.
 */
export function filterSiteSettingsFromNewDocumentMenu(
	prev: TemplateItem[],
	_context: NewDocumentOptionsContext
): TemplateItem[] {
	return prev.filter((item) => item.templateId !== SITE_SETTINGS_TYPE);
}
