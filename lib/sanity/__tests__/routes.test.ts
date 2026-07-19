import { describe, expect, it } from "vitest";
import { ROUTE_BY_TYPE } from "../routes";
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
