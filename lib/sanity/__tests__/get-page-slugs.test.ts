import { beforeEach, describe, expect, it, vi } from "vitest";

// U14 of the Sanity page builder plan: getPageSlugs is what /[slug]'s
// generateStaticParams calls. Combined with lib/sanity/lib/__tests__/
// fetch.test.ts (which proves forcePublished forces the published,
// stega:false path), this closes the loop on the unit's non-negotiable —
// that the static build output can never include a draft-only page or a
// stega-encoded slug.

const fetchQueryMock = vi.fn();
vi.mock("../lib/fetch", () => ({
	fetchQuery: (...args: unknown[]) => fetchQueryMock(...args),
}));

import { getPageSlugs, PAGE_SLUGS_QUERY } from "../queries";

beforeEach(() => {
	vi.clearAllMocks();
	fetchQueryMock.mockResolvedValue(["services", "about"]);
});

describe("getPageSlugs", () => {
	it("fetches with forcePublished: true", async () => {
		await getPageSlugs();

		expect(fetchQueryMock).toHaveBeenCalledWith(PAGE_SLUGS_QUERY, {}, {
			forcePublished: true,
		});
	});

	it("queries every page's slug, unfiltered by perspective at the GROQ level", () => {
		expect(PAGE_SLUGS_QUERY).toContain('_type == "page"');
		expect(PAGE_SLUGS_QUERY).toContain(".slug.current");
		// No $slug param — this is the listing query, not the single-document one.
		expect(PAGE_SLUGS_QUERY).not.toContain("$slug");
	});

	it("returns the fetched slugs unchanged", async () => {
		const slugs = await getPageSlugs();
		expect(slugs).toEqual(["services", "about"]);
	});
});
