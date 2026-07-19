import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LIVE_LINK_PROJECTION } from "../link-projection";

// There are three separate GROQ projections in this repo that all produce a
// `LinkValue` for resolve-link.ts:
//
//   1. siteSettings.ts's LINK_PROJECTION      (nav, footer, header CTA)
//   2. queries.ts's PAGE_BUILDER_LINK_FIELDS  (blocks, server render)
//   3. link-projection.ts's LIVE_LINK_PROJECTION (blocks, live preview)
//
// They cannot be collapsed into one: 1 and 2 are read by `sanity typegen`,
// which only statically analyses literals and same-file constants — an
// imported constant makes it emit ZERO queries for the entire file, and it
// does so silently (build, tsc and the test suite all keep passing, because
// they read the checked-in sanity.types.ts).
//
// So the duplication is forced, and this file is what stops it drifting.
// `isHomePage` is the field that proved the risk: it was added to 1 and 2
// and missed on 3, which would have rendered "/home#services" in the Studio
// preview and "/#services" in production.
//
// Read from source rather than imported, because 1 and 2 are not exported
// and importing queries.ts pulls in `server-only`.
const SOURCES: Record<string, string> = {
	"siteSettings.ts LINK_PROJECTION": readFileSync(
		"lib/sanity/studio-schemas/documents/siteSettings.ts",
		"utf8"
	),
	"queries.ts PAGE_BUILDER_LINK_FIELDS": readFileSync(
		"lib/sanity/queries.ts",
		"utf8"
	),
};

const BLOCK_FILES = [
	"components/blocks/hero-block.tsx",
	"components/blocks/capabilities-block.tsx",
	"components/blocks/cta-block.tsx",
];

/** Every field resolve-link.ts reads off a projected link value. */
const REQUIRED_FIELDS = [
	"linkType",
	"internalRef",
	"anchorPage",
	"anchorId",
	"href",
	"openInNewTab",
	"calLink",
];

describe("link projections stay in sync", () => {
	it.each(Object.keys(SOURCES))("%s projects every field", (name) => {
		for (const field of REQUIRED_FIELDS) {
			expect(SOURCES[name]).toContain(field);
		}
	});

	it("the live-preview projection projects every field", () => {
		for (const field of REQUIRED_FIELDS) {
			expect(LIVE_LINK_PROJECTION).toContain(field);
		}
	});

	// The specific regression. A dereferenced doc without this flag resolves
	// the homepage to "/home" — a permanent redirect behind every nav click.
	it.each(Object.keys(SOURCES))("%s projects isHomePage", (name) => {
		expect(SOURCES[name]).toContain('"isHomePage"');
	});

	it("the live-preview projection projects isHomePage", () => {
		expect(LIVE_LINK_PROJECTION).toContain('"isHomePage"');
	});

	it("resolves isHomePage against siteSettings.homePage, not a hardcoded slug", () => {
		// Which page is the homepage is data an editor can repoint at any
		// time. Comparing against a literal slug would be correct until the
		// day someone changes it, and silently wrong after.
		expect(LIVE_LINK_PROJECTION).toContain(
			'_id == *[_id == "siteSettings"][0].homePage._ref'
		);
		expect(LIVE_LINK_PROJECTION).not.toContain('"home"');
	});

	// Blocks must CONSUME the shared constant rather than inlining a fourth
	// copy — the mistake this file exists to catch.
	it.each(BLOCK_FILES)("%s uses the shared projection", (file) => {
		const source = readFileSync(file, "utf8");
		expect(source).toContain("LIVE_LINK_PROJECTION");
		expect(source).not.toContain("internalRef->{ _type, _id, slug }");
	});
});
