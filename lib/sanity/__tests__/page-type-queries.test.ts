import { describe, expect, it, vi } from "vitest";

// `../lib/fetch` reaches `server-only` transitively, which throws on import
// outside a Server Component. Mocked the same way get-page-slugs.test.ts
// does — these tests only read query strings, never execute them.
vi.mock("../lib/fetch", () => ({
	fetchQuery: vi.fn(),
}));

import {
	BLOG_LISTING_QUERY,
	BLOG_LISTING_PUBLISHED_QUERY,
	TEMPLATE_LISTING_QUERY,
	TEMPLATE_LISTING_PUBLISHED_QUERY,
	CONTACT_PAGE_QUERY,
	CONTACT_PAGE_PUBLISHED_QUERY,
} from "../queries";
import { SINGLETON_TYPES, singletonDocumentId } from "../singletons";

// These six queries are the ONE place a singleton document id is written out
// as a hard-coded string instead of coming from lib/sanity/singletons.ts.
//
// That is forced, not sloppy: `sanity typegen` can only statically analyse a
// literal passed to `defineQuery`. Interpolating the registry constant
// (`${SINGLETON_TYPES.blogListing}`) is a member expression it cannot
// resolve, and handing it a helper function fails with "Unsupported
// expression type: BlockStatement". Either way typegen emits ZERO queries
// for the whole file and every `*QueryResult` type disappears.
//
// The failure is quiet in the worst way: `npm run build`, `tsc --noEmit` and
// the entire test suite keep passing afterwards, because they all read the
// checked-in sanity.types.ts. Only re-running typegen surfaces it — which is
// how it got committed in the first place.
//
// So these tests do the job the registry would otherwise do: if a singleton
// id ever changes, the copy baked into a query string is caught here rather
// than at runtime as a query that silently matches no document and renders
// the hardcoded fallback forever.
describe("page type queries pin their document ids to the registry", () => {
	it.each([
		["blogListing", BLOG_LISTING_QUERY, BLOG_LISTING_PUBLISHED_QUERY],
		["templateListing", TEMPLATE_LISTING_QUERY, TEMPLATE_LISTING_PUBLISHED_QUERY],
		["contactPage", CONTACT_PAGE_QUERY, CONTACT_PAGE_PUBLISHED_QUERY],
	] as const)("%s", (type, chromeQuery, publishedQuery) => {
		const id = singletonDocumentId(SINGLETON_TYPES[type]);

		expect(chromeQuery).toContain(`_id == "${id}"`);
		expect(publishedQuery).toContain(`_id == "${id}"`);
	});

	it.each([
		["blogListing", BLOG_LISTING_QUERY],
		["templateListing", TEMPLATE_LISTING_QUERY],
		["contactPage", CONTACT_PAGE_QUERY],
	] as const)("%s filters by _id rather than _type", (type, query) => {
		// Same contract as SITE_SETTINGS_QUERY: a singleton is identified by
		// its fixed id, which is the only thing the three pin mechanisms
		// actually keep unique. `*[_type == "..."][0]` would happily return a
		// second, orphaned document if one ever existed.
		//
		// Asserted on the opening filter specifically, not on the whole
		// string: `_type ==` appears legitimately further down, inside the
		// block-union conditionals of the sections projection.
		expect(query.trimStart().startsWith(`*[_id == "${type}"][0]`)).toBe(true);
	});

	it("projects _id and _type, which PageBuilder requires as props", () => {
		// Omitting either breaks Presentation's data attributes and
		// optimistic-update matching, and does so at runtime rather than at
		// compile time.
		for (const query of [
			BLOG_LISTING_QUERY,
			TEMPLATE_LISTING_QUERY,
			CONTACT_PAGE_QUERY,
		]) {
			expect(query).toContain("_id,");
			expect(query).toContain("_type,");
		}
	});
});
