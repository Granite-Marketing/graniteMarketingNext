import { describe, expect, it } from "vitest";
import type { DocumentActionComponent } from "sanity";
import {
	structure,
	filterSiteSettingsDocumentActions,
	filterSiteSettingsFromNewDocumentMenu,
} from "../structure";

// structure.ts carries mechanisms (1) and (2) of the siteSettings singleton
// pin, plus the two document-level resolvers wired on `document.actions` /
// `document.newDocumentOptions` in sanity.config.ts for mechanism (3). See
// siteSettings.ts's header comment for the full three-mechanism rundown —
// there is no `singleton: true` option and no `__experimental_actions` in
// sanity@4.21.1.
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

function createStubS(documentTypeListItems: ReturnType<typeof createListItemStub>[]) {
	const list = {
		title: undefined as string | undefined,
		items: undefined as unknown[] | undefined,
	};

	const S = {
		list() {
			return {
				title(t: string) {
					list.title = t;
					return this;
				},
				items(i: unknown[]) {
					list.items = i;
					return this;
				},
			};
		},
		listItem: (id?: string) => createListItemStub(id ?? ""),
		document: () => createDocumentBuilderStub(),
		divider: () => ({ __type: "divider" as const }),
		documentTypeListItems: () => documentTypeListItems,
		// Real API, confirmed at sanity/lib/structure.d.ts:7622 —
		// `documentTypeListItem: (typeName: string) => ListItemBuilder`.
		documentTypeListItem: (typeName: string) => createListItemStub(typeName),
	};

	return { S, getList: () => list };
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

	it("places a divider between the pinned item and the grouped lists", () => {
		const { S, getList } = createStubS([]);

		structure(S as never, {} as never);

		const items = getList().items as unknown[];
		expect(items[1]).toEqual({ __type: "divider" });
	});

	// Ordering is the point of the explicit structure: the auto-generated list
	// sorted by registration order, which buried `page` among the taxonomy
	// types even though it is the most-reached-for type.
	it("orders groups from most-edited to least, with page types directly after Site Settings", () => {
		const { S, getList } = createStubS([]);

		structure(S as never, {} as never);

		const ids = (getList().items as ReturnType<typeof createListItemStub>[])
			.map((item) => item.getId?.())
			.filter((id): id is string => typeof id === "string" && id !== "");

		expect(ids).toEqual([
			"siteSettings",
			"page",
			"legalPage",
			"blogPost",
			"workflowTemplate",
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

describe("filterSiteSettingsDocumentActions — mechanism (3a)", () => {
	const allActions = [
		createFakeAction("publish"),
		createFakeAction("discardChanges"),
		createFakeAction("duplicate"),
		createFakeAction("unpublish"),
		createFakeAction("delete"),
		createFakeAction("restore"),
	];

	it("strips duplicate and delete when editing the siteSettings document", () => {
		const result = filterSiteSettingsDocumentActions(allActions, {
			schemaType: "siteSettings",
		} as never);

		expect(result.map((a) => a.action)).toEqual([
			"publish",
			"discardChanges",
			"unpublish",
			"restore",
		]);
	});

	it("leaves every other document type's actions completely untouched", () => {
		const result = filterSiteSettingsDocumentActions(allActions, {
			schemaType: "page",
		} as never);

		expect(result).toBe(allActions);
		expect(result.map((a) => a.action)).toContain("duplicate");
		expect(result.map((a) => a.action)).toContain("delete");
	});
});

describe("filterSiteSettingsFromNewDocumentMenu — mechanism (3b)", () => {
	it("removes siteSettings from the '+' menu's template items", () => {
		const templates = [
			{ templateId: "page" },
			{ templateId: "siteSettings" },
			{ templateId: "blogPost" },
		];

		const result = filterSiteSettingsFromNewDocumentMenu(
			templates as never,
			{} as never
		);

		expect(result.map((t) => t.templateId)).toEqual(["page", "blogPost"]);
	});

	it("is a no-op when siteSettings isn't present", () => {
		const templates = [{ templateId: "page" }, { templateId: "blogPost" }];

		const result = filterSiteSettingsFromNewDocumentMenu(
			templates as never,
			{} as never
		);

		expect(result.map((t) => t.templateId)).toEqual(["page", "blogPost"]);
	});
});
