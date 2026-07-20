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
//
// SOURCES used to hold the ENTIRE file content, and the assertions below
// used to `.toContain()` against it. That made every assertion true if the
// field name appeared ANYWHERE in the file — including in an unrelated
// query, a comment, or a type. Verified failure mode: `anchorId` occurs
// three times in queries.ts outside PAGE_BUILDER_LINK_FIELDS, so deleting
// it from the projection left the whole-file version of this test green.
// `extractProjection` below pulls out just the `const NAME = \`{ ... }\`;`
// template literal body so the assertions are scoped to the projection
// itself, not the file it lives in.
function extractProjection(
	source: string,
	constName: string,
	fileLabel: string
): string {
	const pattern = new RegExp(`const ${constName}\\s*=\\s*\`([\\s\\S]*?)\`;`);
	const match = source.match(pattern);
	if (!match) {
		// Fail loudly rather than falling back to "" — an empty string would
		// make every `.toContain()` below vacuously true, which is the exact
		// blindness this file exists to catch, just relocated.
		throw new Error(
			`Could not find "const ${constName} = \`...\`;" in ${fileLabel}. ` +
				"The constant was likely renamed or restructured — update the " +
				"extraction regex in link-projection.test.ts rather than letting " +
				"this silently match nothing."
		);
	}
	const block = match[1].trim();
	if (!block.startsWith("{") || !block.endsWith("}") || block.length < 20) {
		throw new Error(
			`Extracted "${constName}" from ${fileLabel} doesn't look like a GROQ ` +
				`projection block (got ${JSON.stringify(block.slice(0, 60))}...). ` +
				"Refusing to run field assertions against it."
		);
	}
	return block;
}

const SOURCES: Record<string, string> = {
	"siteSettings.ts LINK_PROJECTION": extractProjection(
		readFileSync(
			"lib/sanity/studio-schemas/documents/siteSettings.ts",
			"utf8"
		),
		"LINK_PROJECTION",
		"siteSettings.ts"
	),
	"queries.ts PAGE_BUILDER_LINK_FIELDS": extractProjection(
		readFileSync("lib/sanity/queries.ts", "utf8"),
		"PAGE_BUILDER_LINK_FIELDS",
		"queries.ts"
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
