import { describe, expect, it } from "vitest";
import {
	ROUTE_BY_TYPE,
	LINKABLE_ROUTE_BY_TYPE,
	isLinkableFixedRouteType,
} from "../routes";
import { SINGLETON_TYPE_LIST } from "../singletons";

// PART 1 of the fixed-route-visibility unit (2026-07-19) — the one map from
// fixed-route page type to the URL it serves. Consumed by
// studio-components/route-field.tsx's `routeField()`, which every one of
// the five page-type singleton schemas calls. This file only pins the map
// itself: exhaustive over the five types, and holding exactly the strings
// from the plan's route table — not the Studio-rendering mechanism, which
// studio-components/__tests__/route-field.test.tsx covers.
describe("routes — fixed-route map (PART 1)", () => {
	it("covers exactly the five fixed-route singleton types, excluding siteSettings", () => {
		// siteSettings is the sixth registered singleton but has no route of
		// its own — it configures every page, not one — so it must be absent
		// here rather than mapped to a placeholder nobody would trust.
		const routeKeys = Object.keys(ROUTE_BY_TYPE).sort();
		const expectedKeys = SINGLETON_TYPE_LIST.filter(
			(type) => type !== "siteSettings"
		).sort();

		expect(routeKeys).toEqual(expectedKeys);
	});

	it("maps every type to exactly the route from the plan's table", () => {
		expect(ROUTE_BY_TYPE).toEqual({
			blogListing: "/blog",
			templateListing: "/templates",
			contactPage: "/contact",
			blogPostTemplate: "/blog/… (applies to every blog post)",
			templateDetail: "/templates/… (applies to every template)",
		});
	});
});

// PART 2 (2026-07-19, U21/U22 prep) — the route/label split. ROUTE_BY_TYPE
// above must keep holding exactly the same five display strings (pinned by
// the test immediately above this block — a regression guard for the
// Studio's read-only Route field, which must render identically to before).
// LINKABLE_ROUTE_BY_TYPE is the new, narrower map: only the three types a
// `link` union can actually target.
describe("routes — linkable-route map (PART 2)", () => {
	it("covers exactly the three types with a real, navigable route", () => {
		expect(Object.keys(LINKABLE_ROUTE_BY_TYPE).sort()).toEqual(
			["blogListing", "contactPage", "templateListing"].sort()
		);
	});

	it("maps each linkable type to the same route string ROUTE_BY_TYPE holds for it — sourced from one map, not a second hand-typed copy", () => {
		expect(LINKABLE_ROUTE_BY_TYPE).toEqual({
			blogListing: ROUTE_BY_TYPE.blogListing,
			templateListing: ROUTE_BY_TYPE.templateListing,
			contactPage: ROUTE_BY_TYPE.contactPage,
		});
		expect(LINKABLE_ROUTE_BY_TYPE).toEqual({
			blogListing: "/blog",
			templateListing: "/templates",
			contactPage: "/contact",
		});
	});

	it("blogPostTemplate and templateDetail are absent from the linkable map — not merely undefined, structurally not a key", () => {
		expect(
			Object.prototype.hasOwnProperty.call(
				LINKABLE_ROUTE_BY_TYPE,
				"blogPostTemplate"
			)
		).toBe(false);
		expect(
			Object.prototype.hasOwnProperty.call(
				LINKABLE_ROUTE_BY_TYPE,
				"templateDetail"
			)
		).toBe(false);
	});

	it("isLinkableFixedRouteType is true for the three linkable types and false for the two pattern types and junk", () => {
		expect(isLinkableFixedRouteType("blogListing")).toBe(true);
		expect(isLinkableFixedRouteType("templateListing")).toBe(true);
		expect(isLinkableFixedRouteType("contactPage")).toBe(true);

		expect(isLinkableFixedRouteType("blogPostTemplate")).toBe(false);
		expect(isLinkableFixedRouteType("templateDetail")).toBe(false);

		expect(isLinkableFixedRouteType("blogPost")).toBe(false);
		expect(isLinkableFixedRouteType(undefined)).toBe(false);
	});
});
