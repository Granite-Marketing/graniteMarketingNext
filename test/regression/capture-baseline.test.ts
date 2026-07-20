import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
	type BaselineRoute,
	diffNormalizedHtml,
	normalizeHtml,
	parseCliArgs,
	runCapture,
	runCheck,
	stripScriptBlocks,
	UnknownArgumentError,
} from "./capture-baseline";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Builds a minimal document shaped exactly like real `next build` output for
 * this app: a doctype build-id comment, a hashed chunk script tag, some
 * visible text, a React useId-shaped Radix id, and the escaped build id
 * inside the inlined RSC flight payload. Trimmed to the minimum needed to
 * exercise every normalisation rule in capture-baseline.ts — the full
 * documents are ~35-160KB each.
 */
function buildFixture(
	buildId: string,
	chunkHash: string,
	visibleText: string,
	options: { useId?: string; flightModuleId?: string } = {},
): string {
	const commentForm = buildId.replace(/-/g, "_");
	const useId = options.useId ?? "13ninnb";
	const flightModuleId = options.flightModuleId ?? "0";
	return (
		`<!DOCTYPE html><!--${commentForm}--><html lang="en"><head>` +
		`<script src="/_next/static/chunks/${chunkHash}.js" async=""></script>` +
		`</head><body><h1>${visibleText}</h1>` +
		`<div id="radix-_R_${useId}_" aria-controls="radix-_R_${useId}_"></div>` +
		`<script>self.__next_f.push([1,"${flightModuleId}:{\\"P\\":null,\\"b\\":\\"${buildId}\\",\\"c\\":[\\"\\",\\"\\"]}"]);</script>` +
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

	it("a changed React useId value alone is NOT reported as a diff (id reassignment from a tree-shape change, no rendered-output change)", () => {
		const before = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing", {
			useId: "13ninnb",
		});
		// Same build id, same chunk hash, same visible text — only the useId
		// value differs, as happens when a server/client boundary shifts every
		// id in the tree without changing anything a visitor sees.
		const after = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing", {
			useId: "9xz2qq",
		});

		expect(before).not.toBe(after);
		expect(normalizeHtml(before)).toBe(normalizeHtml(after));
	});
});

describe("stripScriptBlocks", () => {
	it("removes every <script>...</script> block, including self-closing-content chunk tags and inline flight payloads", () => {
		const html = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing");
		const stripped = stripScriptBlocks(html);

		expect(stripped).not.toContain("<script");
		expect(stripped).not.toContain("__next_f");
		// Non-script markup survives untouched.
		expect(stripped).toContain("<h1>Granite Marketing</h1>");
		expect(stripped).toContain("<!DOCTYPE html>");
	});
});

describe("strict vs markup-only comparison (script exclusion)", () => {
	it("a changed __next_f module id alone is not reported in markup-only mode, but IS visible in strict mode", () => {
		const before = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing", {
			flightModuleId: "0",
		});
		// Same build id, chunk hash, visible text, and useId — only the RSC
		// flight payload's module id (bundler bookkeeping) differs, as happens
		// when routes or modules are added/removed elsewhere in the app.
		const after = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing", {
			flightModuleId: "5",
		});

		const normalizedBefore = normalizeHtml(before);
		const normalizedAfter = normalizeHtml(after);

		// Strict: everything, including script contents, is compared verbatim.
		expect(diffNormalizedHtml(normalizedBefore, normalizedAfter)).not.toBeNull();

		// Markup-only: script blocks are excluded entirely, so bundler
		// bookkeeping churn inside them is invisible.
		expect(
			diffNormalizedHtml(stripScriptBlocks(normalizedBefore), stripScriptBlocks(normalizedAfter)),
		).toBeNull();
	});

	it("a genuinely different rendered element still shows as a diff in BOTH strict and markup-only modes", () => {
		const before = normalizeHtml(buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing"));
		const after = normalizeHtml(buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketink"));

		expect(diffNormalizedHtml(before, after)).not.toBeNull();
		expect(diffNormalizedHtml(stripScriptBlocks(before), stripScriptBlocks(after))).not.toBeNull();
	});
});

describe("parseCliArgs", () => {
	it("defaults to check mode (non-destructive) when no arguments are given", () => {
		expect(parseCliArgs([])).toEqual({ mode: "check" });
	});

	it("--check explicitly selects check mode", () => {
		expect(parseCliArgs(["--check"])).toEqual({ mode: "check" });
	});

	it("--write explicitly selects write mode (the destructive path)", () => {
		expect(parseCliArgs(["--write"])).toEqual({ mode: "write" });
	});

	it("an unknown argument throws, naming the argument, instead of being silently ignored", () => {
		expect(() => parseCliArgs(["--dry-run"])).toThrow(UnknownArgumentError);
		try {
			parseCliArgs(["--dry-run"]);
			expect.unreachable("parseCliArgs should have thrown");
		} catch (error) {
			expect(error).toBeInstanceOf(UnknownArgumentError);
			expect((error as Error).message).toContain("--dry-run");
		}
	});

	it("passing both --check and --write is a hard error, not a silent pick-one", () => {
		expect(() => parseCliArgs(["--check", "--write"])).toThrow();
	});
});

describe("runCheck / runCapture against temp directories (never the committed fixtures)", () => {
	const tempDirs: string[] = [];

	function makeTempDir(prefix: string): string {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
		tempDirs.push(dir);
		return dir;
	}

	afterEach(() => {
		while (tempDirs.length > 0) {
			const dir = tempDirs.pop();
			if (dir) fs.rmSync(dir, { recursive: true, force: true });
		}
	});

	const ROUTE: BaselineRoute = { path: "/", file: "index.html" };

	it("identical input compares equal: current build output normalises to exactly the committed fixture", () => {
		const appDir = makeTempDir("baseline-app-");
		const fixturesDir = makeTempDir("baseline-fixtures-");

		const raw = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing");
		fs.writeFileSync(path.join(appDir, ROUTE.file), raw, "utf8");
		fs.writeFileSync(path.join(fixturesDir, ROUTE.file), normalizeHtml(raw), "utf8");

		const results = runCheck({ appDir, fixturesDir, routes: [ROUTE] });

		expect(results).toHaveLength(1);
		expect(results[0].strictDiff).toBeNull();
		expect(results[0].markupDiff).toBeNull();
	});

	it("a single changed character in rendered markup is reported as a diff by runCheck", () => {
		const appDir = makeTempDir("baseline-app-");
		const fixturesDir = makeTempDir("baseline-fixtures-");

		const committed = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing");
		const current = buildFixture("7rAi5dtjlcNffsyxB4UMR", "ded6b6f3259492ae", "Granite Marketink");

		fs.writeFileSync(path.join(appDir, ROUTE.file), current, "utf8");
		fs.writeFileSync(path.join(fixturesDir, ROUTE.file), normalizeHtml(committed), "utf8");

		const results = runCheck({ appDir, fixturesDir, routes: [ROUTE] });

		expect(results[0].strictDiff).not.toBeNull();
		expect(results[0].markupDiff).not.toBeNull();
	});

	it("default (check) mode does not write: the fixtures directory is byte-identical before and after", () => {
		const appDir = makeTempDir("baseline-app-");
		const fixturesDir = makeTempDir("baseline-fixtures-");

		const raw = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing");
		fs.writeFileSync(path.join(appDir, ROUTE.file), raw, "utf8");
		fs.writeFileSync(path.join(fixturesDir, ROUTE.file), normalizeHtml(raw), "utf8");

		const before = fs.readFileSync(path.join(fixturesDir, ROUTE.file), "utf8");
		const beforeListing = fs.readdirSync(fixturesDir).sort();

		// Simulate exactly what main() does with no CLI arguments: parse, then
		// dispatch. This must never call runCapture / write anything.
		const args = parseCliArgs([]);
		expect(args.mode).toBe("check");
		runCheck({ appDir, fixturesDir, routes: [ROUTE] });

		const after = fs.readFileSync(path.join(fixturesDir, ROUTE.file), "utf8");
		const afterListing = fs.readdirSync(fixturesDir).sort();

		expect(after).toBe(before);
		expect(afterListing).toEqual(beforeListing);
	});

	it("runCapture (write mode) writes normalised output into the fixtures directory", () => {
		const appDir = makeTempDir("baseline-app-");
		const fixturesDir = makeTempDir("baseline-fixtures-");

		const raw = buildFixture("WBlDzFY5oNR-j7n7bwwfL", "7e8b9826b86d1168", "Granite Marketing");
		fs.writeFileSync(path.join(appDir, ROUTE.file), raw, "utf8");

		const summary = runCapture({ appDir, fixturesDir, routes: [ROUTE] });

		expect(summary).toHaveLength(1);
		const written = fs.readFileSync(path.join(fixturesDir, ROUTE.file), "utf8");
		expect(written).toBe(normalizeHtml(raw));
		expect(written).toContain("__BUILD_ID__");
		expect(written).toContain("__CHUNK_HASH__");
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
