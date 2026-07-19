import { describe, expect, it } from "vitest";
import type { DocumentActionComponent } from "sanity";
import {
	structure,
	filterSingletonDocumentActions,
	filterSingletonsFromNewDocumentMenu,
} from "../structure";
import { SINGLETON_TYPE_LIST } from "../singletons";

// structure.ts carries mechanisms (1) and (2) of the singleton pin — see
// lib/sanity/singletons.ts's header comment for why the registry lives
// there rather than in a schema file — plus the two document-level
// resolvers wired on `document.actions` / `document.newDocumentOptions` in
// sanity.config.ts for mechanism (3). There is no `singleton: true` option
// and no `__experimental_actions` in sanity@4.21.1.
//
// All six registered singletons now have desk entries. Four are pinned
// straight to their document; blogListing and templateListing instead expand
// to a nested list holding both the listing document and its record type
// (U20), which is why the stub below has to model more than one `S.list()`.
//
// `structure` is exercised against a minimal recorder stub of the desk
// StructureBuilder API (`S`), the same stubbing approach
// objects/__tests__/link.test.ts uses for `Rule` — `S.list/listItem/
// document/divider/documentTypeListItems` are the only five methods
// structure.ts calls, so the stub only needs to record what was chained,
// not reimplement Sanity's real builder classes.

function createDocumentBuilderStub() {
	const state: { schemaType?: string; documentId?: string } = {};
	const builder = {
		schemaType(type: string) {
			state.schemaType = type;
			return builder;
		},
		documentId(id: string) {
			state.documentId = id;
			return builder;
		},
		getSchemaType: () => state.schemaType,
		getDocumentId: () => state.documentId,
	};
	return builder;
}

function createListItemStub(id: string) {
	const state: { title?: string; id: string; child?: unknown } = { id };
	const item = {
		title(t: string) {
			state.title = t;
			return item;
		},
		id(newId: string) {
			state.id = newId;
			return item;
		},
		child(c: unknown) {
			state.child = c;
			return item;
		},
		getId: () => state.id,
		getTitle: () => state.title,
		getChild: () => state.child,
	};
	return item;
}

// `S.list()` is called more than once once U20 nests a record list under its
// listing singleton (the nested container passed to `.child()` is itself an
// `S.list()`), so the stub can no longer funnel every call through one
// shared `list` object — the nested call's `.items()` would clobber the
// outer one before `getList()` is ever read. Each call now gets its own
// independent state with its own `getTitle()`/`getItems()`, and `getList()`
// keeps returning the *outermost* list — the first one `structure()`
// constructs, since `S.list()` at the top of the resolver is evaluated
// before any nested list built while its `.items([...])` argument array is
// assembled.
function createStubS(documentTypeListItems: ReturnType<typeof createListItemStub>[]) {
	let outerList: { title?: string; items?: unknown[] } | undefined;

	function makeListBuilder() {
		const state: { title?: string; items?: unknown[] } = {};
		const builder = {
			title(t: string) {
				state.title = t;
				return builder;
			},
			items(i: unknown[]) {
				state.items = i;
				return builder;
			},
			getTitle: () => state.title,
			getItems: () => state.items,
		};
		if (!outerList) outerList = state;
		return builder;
	}

	const S = {
		list: makeListBuilder,
		listItem: (id?: string) => createListItemStub(id ?? ""),
		document: () => createDocumentBuilderStub(),
		divider: () => ({ __type: "divider" as const }),
		documentTypeListItems: () => documentTypeListItems,
		// Real API, confirmed at sanity/lib/structure.d.ts:7622 —
		// `documentTypeListItem: (typeName: string) => ListItemBuilder`.
		documentTypeListItem: (typeName: string) => createListItemStub(typeName),
	};

	return { S, getList: () => outerList as { title?: string; items?: unknown[] } };
}

describe("lib/sanity/structure — mechanisms (1) and (2)", () => {
	it("mechanism (1): pins the Site Settings item's child to schemaType + documentId 'siteSettings'", () => {
		const { S, getList } = createStubS([
			createListItemStub("page"),
			createListItemStub("blogPost"),
		]);

		structure(S as never, {} as never);

		const items = getList().items as ReturnType<typeof createListItemStub>[];
		const siteSettingsItem = items[0];
		expect(siteSettingsItem.getTitle()).toBe("Site Settings");
		expect(siteSettingsItem.getId()).toBe("siteSettings");

		const child = siteSettingsItem.getChild() as ReturnType<
			typeof createDocumentBuilderStub
		>;
		expect(child.getSchemaType()).toBe("siteSettings");
		expect(child.getDocumentId()).toBe("siteSettings");
	});

	it("mechanism (2): never lists siteSettings alongside the pinned item", () => {
		const { S, getList } = createStubS([createListItemStub("siteSettings")]);

		structure(S as never, {} as never);

		const items = getList().items as ReturnType<typeof createListItemStub>[];
		const ids = items.slice(1).map((item) => item.getId?.());

		expect(ids.filter((id) => id === "siteSettings")).toEqual([]);
	});

	// Every singleton now has a pinned desk entry, so the invariant is not
	// "absent from the desk" but "present exactly once". A second row is the
	// actual failure mode: the pinned entry opens the fixed document id while
	// the passthrough row opens an uncapped list of every document of that
	// type, and the two look identical in the sidebar. An editor who picks
	// the wrong one creates a second Blog Listing that nothing ever reads.
	it("mechanism (2): lists every registered singleton exactly once, never alongside a generic list", () => {
		const { S, getList } = createStubS(
			SINGLETON_TYPE_LIST.map((type) => createListItemStub(type))
		);

		structure(S as never, {} as never);

		const items = getList().items as ReturnType<typeof createListItemStub>[];
		const ids = items.map((item) => item.getId?.());

		for (const type of SINGLETON_TYPE_LIST) {
			expect(ids.filter((id) => id === type)).toEqual([type]);
		}
	});

	it("places a divider between the pinned item and the grouped lists", () => {
		const { S, getList } = createStubS([]);

		structure(S as never, {} as never);

		const items = getList().items as unknown[];
		expect(items[1]).toEqual({ __type: "divider" });
	});

	// Ordering is the point of the explicit structure: the auto-generated list
	// sorted by registration order, which buried `page` among the taxonomy
	// types even though it is the most-reached-for type.
	//
	// blogPost and workflowTemplate no longer appear in this top-level list
	// (U20): they moved to become children of blogListing/templateListing.
	// Their absence here is the point, not an oversight — see the nesting
	// tests below for where they now live.
	it("orders groups from most-edited to least, with page types directly after Site Settings", () => {
		const { S, getList } = createStubS([]);

		structure(S as never, {} as never);

		const ids = (getList().items as ReturnType<typeof createListItemStub>[])
			.map((item) => item.getId?.())
			.filter((id): id is string => typeof id === "string" && id !== "");

		expect(ids).toEqual([
			"siteSettings",
			// Fixed-route page types: always exist, edit-only. Listing and
			// detail pairs sit together so the relationship reads off the desk.
			// blogListing/templateListing are nested containers now (U20), but
			// keep the same desk id and position — nesting only changes what's
			// inside their `.child()`.
			"blogListing",
			"blogPostTemplate",
			"templateListing",
			"templateDetail",
			"contactPage",
			// Creatable page lists, below the fixed ones.
			"page",
			"legalPage",
			// caseStudy has no listing page type to nest under (Phase 6's desk
			// shape), so it stays here rather than moving under a singleton.
			"caseStudy",
			"client",
			"faq",
			"logoList",
			"tool",
			"author",
			"category",
			"location",
			"workflowCategory",
		]);

		expect(ids.indexOf("page")).toBeLessThan(ids.indexOf("author"));
	});

	// U20 — Blog Listing's desk entry is a container, not a document pin: it
	// must expose both the blogListing document itself (so its chrome/SEO
	// fields stay reachable) and the blogPost record list (so creating a post
	// from the desk still goes through the real create flow). Nesting is
	// presentation only — no schema change, no URL change, no migration —
	// so this is checking desk shape, not data.
	it("blogListing's desk entry nests both the singleton document and a blogPost list under one child", () => {
		const { S, getList } = createStubS([]);

		structure(S as never, {} as never);

		const items = getList().items as ReturnType<typeof createListItemStub>[];
		const blogListingItem = items.find((item) => item.getId?.() === "blogListing");
		expect(blogListingItem).toBeDefined();

		const child = blogListingItem!.getChild() as {
			getItems: () => unknown[];
		};
		const childItems = child.getItems() as Array<{
			getId?: () => string;
			getChild?: () => unknown;
		}>;

		// One entry opens the singleton document itself...
		const documentEntry = childItems.find((item) =>
			(item.getChild?.() as ReturnType<typeof createDocumentBuilderStub> | undefined)
				?.getSchemaType?.() === "blogListing"
		);
		expect(documentEntry).toBeDefined();
		expect(
			(documentEntry!.getChild?.() as ReturnType<typeof createDocumentBuilderStub>).getDocumentId()
		).toBe("blogListing");

		// ...and the other is the real document type list for blogPost, not a
		// hand-rolled stand-in — so creating a post from here still lands with
		// the right `_type`.
		const recordListEntry = childItems.find((item) => item.getId?.() === "blogPost");
		expect(recordListEntry).toBeDefined();
	});

	// Same shape, mirrored for Template Listing / Workflow Templates.
	it("templateListing's desk entry nests both the singleton document and a workflowTemplate list under one child", () => {
		const { S, getList } = createStubS([]);

		structure(S as never, {} as never);

		const items = getList().items as ReturnType<typeof createListItemStub>[];
		const templateListingItem = items.find(
			(item) => item.getId?.() === "templateListing"
		);
		expect(templateListingItem).toBeDefined();

		const child = templateListingItem!.getChild() as {
			getItems: () => unknown[];
		};
		const childItems = child.getItems() as Array<{
			getId?: () => string;
			getChild?: () => unknown;
		}>;

		const documentEntry = childItems.find((item) =>
			(item.getChild?.() as ReturnType<typeof createDocumentBuilderStub> | undefined)
				?.getSchemaType?.() === "templateListing"
		);
		expect(documentEntry).toBeDefined();
		expect(
			(documentEntry!.getChild?.() as ReturnType<typeof createDocumentBuilderStub>).getDocumentId()
		).toBe("templateListing");

		const recordListEntry = childItems.find(
			(item) => item.getId?.() === "workflowTemplate"
		);
		expect(recordListEntry).toBeDefined();
	});

	// The trap this guards against: blogPost/workflowTemplate used to feed
	// EDITORIAL_TYPES, which fed the `grouped` exclusion Set. Moving them out
	// of that array without keeping them excluded some other way means they'd
	// pass the auto-generated passthrough filter at the bottom of the
	// resolver and appear a second time as an ordinary top-level document
	// list — identical-looking to, but not the same as, the nested one. An
	// editor who picks the wrong row creates a post that the nested list
	// (and its "how many posts" context) never shows.
	it("blogPost and workflowTemplate each appear exactly once across the whole desk", () => {
		const { S, getList } = createStubS([
			createListItemStub("blogPost"),
			createListItemStub("workflowTemplate"),
		]);

		structure(S as never, {} as never);

		const topLevelIds = (getList().items as ReturnType<typeof createListItemStub>[]).map(
			(item) => item.getId?.()
		);

		// Neither type sits directly in the top-level list...
		expect(topLevelIds).not.toContain("blogPost");
		expect(topLevelIds).not.toContain("workflowTemplate");

		// ...each appears exactly once, nested under its listing.
		const blogListingItem = (
			getList().items as ReturnType<typeof createListItemStub>[]
		).find((item) => item.getId?.() === "blogListing")!;
		const templateListingItem = (
			getList().items as ReturnType<typeof createListItemStub>[]
		).find((item) => item.getId?.() === "templateListing")!;

		const blogListingChildItems = (
			blogListingItem.getChild() as { getItems: () => Array<{ getId?: () => string }> }
		).getItems();
		const templateListingChildItems = (
			templateListingItem.getChild() as {
				getItems: () => Array<{ getId?: () => string }>;
			}
		).getItems();

		expect(
			blogListingChildItems.filter((item) => item.getId?.() === "blogPost")
		).toHaveLength(1);
		expect(
			templateListingChildItems.filter(
				(item) => item.getId?.() === "workflowTemplate"
			)
		).toHaveLength(1);
	});

	// caseStudy has no listing page type in this codebase — it stays a plain
	// top-level entry rather than getting nested under anything.
	it("caseStudy remains a top-level entry, not nested under any listing", () => {
		const { S, getList } = createStubS([]);

		structure(S as never, {} as never);

		const topLevelIds = (getList().items as ReturnType<typeof createListItemStub>[]).map(
			(item) => item.getId?.()
		);

		expect(topLevelIds).toContain("caseStudy");
	});

	// A new document type must never be silently missing from the desk just
	// because nobody remembered to add it to a group.
	it("still lists any registered type that was not placed in a group", () => {
		const { S, getList } = createStubS([
			createListItemStub("page"),
			createListItemStub("somethingNew"),
		]);

		structure(S as never, {} as never);

		const ids = (getList().items as ReturnType<typeof createListItemStub>[])
			.map((item) => item.getId?.())
			.filter(Boolean);

		expect(ids).toContain("somethingNew");
		// ...and not twice, despite `page` appearing in both the group list
		// and the auto-generated passthrough.
		expect(ids.filter((id) => id === "page")).toHaveLength(1);
	});
});

function createFakeAction(action: string): DocumentActionComponent {
	const component = () => null;
	component.action = action;
	return component as unknown as DocumentActionComponent;
}

describe("filterSingletonDocumentActions — mechanism (3a)", () => {
	const allActions = [
		createFakeAction("publish"),
		createFakeAction("discardChanges"),
		createFakeAction("duplicate"),
		createFakeAction("unpublish"),
		createFakeAction("delete"),
		createFakeAction("restore"),
	];

	it("strips duplicate and delete when editing the siteSettings document", () => {
		const result = filterSingletonDocumentActions(allActions, {
			schemaType: "siteSettings",
		} as never);

		expect(result.map((a) => a.action)).toEqual([
			"publish",
			"discardChanges",
			"unpublish",
			"restore",
		]);
	});

	// The filter is generalised — it strips duplicate/delete for ANY
	// registered singleton, not just siteSettings. "blogListing" doesn't
	// have a schema yet, but this function tests type-name logic only, not
	// the schema itself.
	it("strips duplicate and delete for a non-siteSettings singleton type (blogListing)", () => {
		const result = filterSingletonDocumentActions(allActions, {
			schemaType: "blogListing",
		} as never);

		expect(result.map((a) => a.action)).toEqual([
			"publish",
			"discardChanges",
			"unpublish",
			"restore",
		]);
	});

	it("leaves every other document type's actions completely untouched", () => {
		const result = filterSingletonDocumentActions(allActions, {
			schemaType: "page",
		} as never);

		expect(result).toBe(allActions);
		expect(result.map((a) => a.action)).toContain("duplicate");
		expect(result.map((a) => a.action)).toContain("delete");
	});
});

describe("filterSingletonsFromNewDocumentMenu — mechanism (3b)", () => {
	it("removes siteSettings from the '+' menu's template items", () => {
		const templates = [
			{ templateId: "page" },
			{ templateId: "siteSettings" },
			{ templateId: "blogPost" },
		];

		const result = filterSingletonsFromNewDocumentMenu(
			templates as never,
			{} as never
		);

		expect(result.map((t) => t.templateId)).toEqual(["page", "blogPost"]);
	});

	// Every registered singleton is a "+"-menu entry point that must never
	// exist — not only siteSettings. The desk pin (mechanism 1) is the only
	// entry point that should ever open one of these documents.
	it("removes every registered singleton type from the '+' menu, not only siteSettings", () => {
		const templates = [
			{ templateId: "page" },
			...SINGLETON_TYPE_LIST.map((type) => ({ templateId: type })),
			{ templateId: "blogPost" },
		];

		const result = filterSingletonsFromNewDocumentMenu(
			templates as never,
			{} as never
		);

		expect(result.map((t) => t.templateId)).toEqual(["page", "blogPost"]);
	});

	it("is a no-op when no singleton type is present", () => {
		const templates = [{ templateId: "page" }, { templateId: "blogPost" }];

		const result = filterSingletonsFromNewDocumentMenu(
			templates as never,
			{} as never
		);

		expect(result.map((t) => t.templateId)).toEqual(["page", "blogPost"]);
	});
});
