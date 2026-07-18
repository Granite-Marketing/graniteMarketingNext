import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { diffNormalizedHtml, normalizeHtml } from "./capture-baseline";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds a minimal document shaped exactly like real `next build` output for
 * this app: a doctype build-id comment, a hashed chunk script tag, some
 * visible text, and the escaped build id inside the inlined RSC flight
 * payload. Trimmed to the minimum needed to exercise every normalisation
 * rule in capture-baseline.ts — the full documents are ~35-160KB each.
 */
function buildFixture(buildId: string, chunkHash: string, visibleText: string): string {
	const commentForm = buildId.replace(/-/g, "_");
	return (
		`<!DOCTYPE html><!--${commentForm}--><html lang="en"><head>` +
		`<script src="/_next/static/chunks/${chunkHash}.js" async=""></script>` +
		`</head><body><h1>${visibleText}</h1>` +
		`<script>self.__next_f.push([1,"0:{\\"P\\":null,\\"b\\":\\"${buildId}\\",\\"c\\":[\\"\\",\\"\\"]}"]);</script>` +
		`</body></html>`
	);
}

// Real values pulled from two independent, clean `next build` runs on an
// unchanged tree (2026-07-18) — see test/fixtures/baseline/README.md for the
// full method. Using real observed values, not invented ones, keeps this
// test honest about what actually varies between builds.
const BUILD_A = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing");
const BUILD_B = buildFixture("7rAi5dtjlcNffsyxB4UMR", "ded6b6f3259492ae", "Granite Marketing");

describe("normalizeHtml", () => {
	it("the two synthetic builds really do differ before normalisation (sanity check on the fixture)", () => {
		expect(BUILD_A).not.toBe(BUILD_B);
	});

	it("capture is deterministic: two independent builds with different build ids and chunk hashes normalise to identical output", () => {
		expect(normalizeHtml(BUILD_A)).toBe(normalizeHtml(BUILD_B));
	});

	it("fails loudly on a single-character content change (proves the normaliser does not eat real content)", () => {
		const original = normalizeHtml(BUILD_A);
		const mutated = normalizeHtml(
			// One visible character changed: "Marketing" -> "Marketink".
			buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketink"),
		);

		expect(mutated).not.toBe(original);

		const diff = diffNormalizedHtml(original, mutated);
		expect(diff).not.toBeNull();
		expect(diff).toContain("Marketing");
		expect(diff).toContain("Marketink");
	});

	it("diffNormalizedHtml returns null for identical normalised output", () => {
		expect(diffNormalizedHtml(normalizeHtml(BUILD_A), normalizeHtml(BUILD_B))).toBeNull();
	});
});

describe("committed baseline fixtures", () => {
	const fixturesDir = path.resolve(dirname, "..", "fixtures", "baseline");
	const files = fs.existsSync(fixturesDir)
		? fs.readdirSync(fixturesDir).filter((name) => name.endsWith(".html"))
		: [];

	it("captured one fixture per target route", () => {
		expect(files.sort()).toEqual(
			[
				"index.html",
				"blog.html",
				"templates.html",
				"contact.html",
				"privacy.html",
				"terms.html",
				"cookies.html",
				"refund-policy.html",
				"delivery-policy.html",
			].sort(),
		);
	});

	it.each(files)("%s was normalised (placeholders present, no raw build id leaked through)", (file) => {
		const content = fs.readFileSync(path.join(fixturesDir, file), "utf8");

		expect(content).toContain("__BUILD_ID__");
		expect(content).toContain("__CHUNK_HASH__");

		// A real (un-normalised) Next.js build id is a 15-32 char id sitting
		// directly inside the doctype comment. If normalisation silently broke,
		// this pattern would reappear instead of the placeholder.
		expect(content.slice(0, 200)).not.toMatch(/^<!DOCTYPE html><!--(?!__BUILD_ID__)[A-Za-z0-9_-]{15,32}-->/);
	});
});
