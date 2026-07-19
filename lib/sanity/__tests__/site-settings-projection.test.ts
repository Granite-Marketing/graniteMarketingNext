import { describe, expect, it, vi } from "vitest";

// `../queries` reaches `server-only` transitively via `../lib/fetch`, which
// throws on import outside a Server Component. Mocked the same way
// get-page-slugs.test.ts and page-type-queries.test.ts do — this test only
// reads query strings, never executes them.
vi.mock("../lib/fetch", () => ({
	fetchQuery: vi.fn(),
}));

import { SITE_SETTINGS_QUERY as QUERIES_SITE_SETTINGS_QUERY } from "../queries";
import { SITE_SETTINGS_QUERY as SCHEMA_SITE_SETTINGS_QUERY } from "../studio-schemas/documents/siteSettings";

// queries.ts's SITE_SETTINGS_QUERY is a LITERAL duplicate of siteSettings.ts's
// own SITE_SETTINGS_QUERY — not an import of it, and not built by calling a
// helper. `sanity typegen` only statically analyses a literal (or a
// same-file constant it can inline) passed to `defineQuery`; handing it an
// imported constant or a function call makes it emit ZERO queries for the
// whole file, SILENTLY — build, tsc and the test suite all keep passing
// because they read the already-checked-in sanity.types.ts. That exact
// failure has already happened twice in this repo (see queries.ts's comment
// on this constant, and PAGE_TYPE_CHROME_FIELDS's comment above it).
//
// So the duplication is forced, the same way PAGE_BUILDER_LINK_FIELDS forces
// a second copy of siteSettings.ts's LINK_PROJECTION — and this test plays
// the same role lib/sanity/lib/__tests__/link-projection.test.ts plays for
// that pair, just for the singleton's full field list instead of one link
// shape.
const TOP_LEVEL_FIELDS = [
	"logoLink",
	"navLinks[]",
	"headerCta",
	"footerColumns[]",
	"ctaHeading",
	"ctaSubtitle",
	"ctaButton",
	"ctaFootnote",
	"siteTitle",
	"siteDescription",
	"ogImage{",
	"favicon{",
];

describe("SITE_SETTINGS_QUERY stays in sync between siteSettings.ts and queries.ts", () => {
	it.each(TOP_LEVEL_FIELDS)("both copies project %s", (field) => {
		expect(SCHEMA_SITE_SETTINGS_QUERY).toContain(field);
		expect(QUERIES_SITE_SETTINGS_QUERY).toContain(field);
	});

	// The specific field this whole unit exists for. Both copies must project
	// the asset AND altText — a copy that only projects `asset` is the exact
	// bug this unit fixes (a logo that saves in the Studio and renders
	// nothing on the site, because there's no alt text to prove the field
	// round-tripped).
	it("both copies project the logo's asset and altText", () => {
		expect(SCHEMA_SITE_SETTINGS_QUERY).toMatch(/logo\{\s*asset,\s*altText/);
		expect(QUERIES_SITE_SETTINGS_QUERY).toMatch(/logo\{\s*asset,\s*altText/);
	});

	it("both copies filter by the singleton's fixed _id, not _type", () => {
		expect(
			SCHEMA_SITE_SETTINGS_QUERY.trimStart().startsWith(
				'*[_id == "siteSettings"][0]'
			)
		).toBe(true);
		expect(
			QUERIES_SITE_SETTINGS_QUERY.trimStart().startsWith(
				'*[_id == "siteSettings"][0]'
			)
		).toBe(true);
	});
});
