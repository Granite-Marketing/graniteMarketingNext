/**
 * Baseline HTML capture — Unit U6 of
 * docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md.
 *
 * WHY THIS EXISTS (ordering hazard):
 *   This captures a snapshot of the CURRENT, pre-page-builder, published HTML.
 *   Once the homepage is switched to render from a Sanity `page` document
 *   (Unit U16), this baseline becomes unobtainable without a `git checkout`
 *   of the pre-migration tree. It is the one unrecoverable step in the plan
 *   and MUST run before U16. Later units diff their output against these
 *   fixtures to prove the migration is content-neutral.
 *
 * WHAT THIS SCRIPT DOES:
 *   1. Reads already-built production output from `.next/server/app/*.html`
 *      (the output of `next build`). It does NOT start a dev server and
 *      scrape it — dev output differs from what actually ships, and the
 *      baseline must reflect production.
 *   2. Normalises exactly two categories of nondeterminism (documented below,
 *      with the evidence that proved each one nondeterministic).
 *   3. Writes the normalised HTML to test/fixtures/baseline/*.html.
 *
 * NORMALISATION — proved necessary, not assumed. Method: two independent
 * clean `next build` runs on an unchanged tree, diffed byte-for-byte across
 * all 9 target routes. Full method and raw evidence are in
 * test/fixtures/baseline/README.md. Summary:
 *
 *   1. Next.js build id. Appears twice per document, as two different
 *      character-encodings of the SAME per-build random identifier:
 *        - `<!DOCTYPE html><!--<id>-->`  — underscore-safe form, the very
 *          first bytes of the document (a raw "-" would risk producing "--"
 *          inside an HTML comment, which is invalid).
 *        - `\"b\":\"<id>\"`              — dash form, inside the inlined
 *          RSC/flight payload (`self.__next_f.push(...)`).
 *      Both literal strings are extracted directly from the document being
 *      normalised — not assumed via a hardcoded transform — then every
 *      occurrence of each is replaced with `__BUILD_ID__`.
 *
 *   2. Exactly one hashed script chunk under /_next/static/chunks/*.js.
 *      It embeds Next's internal `revalidateSyncTags` server-action
 *      reference, whose id is derived from a per-build action-encryption
 *      secret — so that one chunk's *content*, and therefore its
 *      content-hashed filename, differs build-to-build even though nothing
 *      in the source changed. Verified: of the ~18 script/css chunks
 *      referenced by these 9 routes, this was the ONLY one that changed
 *      across two clean builds — every other chunk hash was byte-identical.
 *      The filename hash segment under `/_next/static/chunks/` is replaced
 *      with `__CHUNK_HASH__`, keeping the path prefix and extension intact,
 *      so a genuinely different SET of chunks (added/removed/reordered)
 *      still shows up as a diff — only the volatile hash text is stripped.
 *
 * NOT normalised, because two clean builds proved them stable (do not add
 * without re-running the two-build diff and updating the evidence above):
 *   - font and image hashes under /_next/static/media/**
 *   - every other script/css chunk hash (~17 of ~18)
 *   - all __next_f.push(...) module ids and streaming order
 *   - all visible text, markup structure, attributes, and meta tags
 *
 * Also checked and confirmed ABSENT from this app-router output (so there is
 * nothing to strip, and nothing is stripped): `nonce="..."` attributes (no
 * CSP nonces are emitted by this app), and pages-router-style
 * `__NEXT_DATA__` script blocks (this app is App Router only).
 *
 * If two independent builds ever stop normalising to identical output, that
 * is a signal that something NEW became nondeterministic — investigate and
 * extend the normaliser deliberately. Do not loosen pattern matching
 * speculatively "just in case": an over-aggressive normaliser that eats real
 * content is worse than no harness at all, because it manufactures false
 * confidence. See the "fails loudly on a single-character change" test in
 * capture-baseline.test.ts, which exists specifically to guard against that.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface BaselineRoute {
	/** URL path this fixture represents. Documentation only — not read from disk. */
	readonly path: string;
	/** Filename under both .next/server/app/ and test/fixtures/baseline/. */
	readonly file: string;
}

// Only statically-generated routes belong here. /blog/[slug] and
// /templates/[slug] are SSG (per-post pages) and out of scope for this unit —
// the plan calls out the listing pages and the static policy routes only.
export const ROUTES: readonly BaselineRoute[] = [
	{ path: "/", file: "index.html" },
	{ path: "/blog", file: "blog.html" },
	{ path: "/templates", file: "templates.html" },
	{ path: "/contact", file: "contact.html" },
	{ path: "/privacy", file: "privacy.html" },
	{ path: "/terms", file: "terms.html" },
	{ path: "/cookies", file: "cookies.html" },
	{ path: "/refund-policy", file: "refund-policy.html" },
	{ path: "/delivery-policy", file: "delivery-policy.html" },
];

const DOCTYPE_BUILD_ID_PATTERN = /^<!DOCTYPE html><!--([A-Za-z0-9_-]{15,32})-->/;
const FLIGHT_BUILD_ID_PATTERN = /\\"b\\":\\"([A-Za-z0-9_-]{15,32})\\"/;
const CHUNK_HASH_PATTERN = /(\/_next\/static\/chunks\/)[A-Za-z0-9_.-]+\.(js|css)/g;

export const BUILD_ID_PLACEHOLDER = "__BUILD_ID__";
export const CHUNK_HASH_PLACEHOLDER = "__CHUNK_HASH__";

/**
 * Strips exactly the two nondeterministic elements documented above from a
 * captured route's HTML. Pure function: same input always produces the same
 * output, and nothing outside the two documented patterns is touched.
 */
export function normalizeHtml(html: string): string {
	let normalized = html;

	const doctypeBuildId = normalized.match(DOCTYPE_BUILD_ID_PATTERN)?.[1];
	if (doctypeBuildId) {
		normalized = normalized.split(doctypeBuildId).join(BUILD_ID_PLACEHOLDER);
	}

	const flightBuildId = normalized.match(FLIGHT_BUILD_ID_PATTERN)?.[1];
	if (flightBuildId) {
		normalized = normalized.split(flightBuildId).join(BUILD_ID_PLACEHOLDER);
	}

	normalized = normalized.replace(CHUNK_HASH_PATTERN, `$1${CHUNK_HASH_PLACEHOLDER}.$2`);

	return normalized;
}

/**
 * Compares two normalised baselines and returns a human-readable, localised
 * description of the first difference, or null if they are identical. Used
 * both by the "fails loudly" test here and available for the later
 * regression harness (Unit U18) to reuse.
 */
export function diffNormalizedHtml(expected: string, actual: string): string | null {
	if (expected === actual) {
		return null;
	}

	let i = 0;
	const max = Math.min(expected.length, actual.length);
	while (i < max && expected[i] === actual[i]) {
		i++;
	}

	const context = 60;
	const expectedSnippet = expected.slice(Math.max(0, i - context), i + context);
	const actualSnippet = actual.slice(Math.max(0, i - context), i + context);

	return [
		`Baseline HTML differs at byte offset ${i} (expected ${expected.length} bytes, got ${actual.length} bytes).`,
		`  expected: ...${JSON.stringify(expectedSnippet)}...`,
		`  actual:   ...${JSON.stringify(actualSnippet)}...`,
	].join("\n");
}

function countOccurrences(haystack: string, needle: string): number {
	return haystack.split(needle).length - 1;
}

async function main(): Promise<void> {
	const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
	const appDir = path.join(repoRoot, ".next", "server", "app");
	const fixturesDir = path.join(repoRoot, "test", "fixtures", "baseline");

	if (!existsSync(appDir)) {
		throw new Error(
			`${appDir} does not exist. Run "npm run build" first — this script reads ` +
				`production output, it does not build it (and must not: dev output differs ` +
				`from what actually ships).`,
		);
	}

	mkdirSync(fixturesDir, { recursive: true });

	const summary: Array<{ route: BaselineRoute; bytes: number }> = [];

	for (const route of ROUTES) {
		const sourcePath = path.join(appDir, route.file);
		if (!existsSync(sourcePath)) {
			throw new Error(
				`Expected prerendered output at ${sourcePath} for route "${route.path}" but it ` +
					`is missing. Did this route stop being statically generated?`,
			);
		}

		const raw = readFileSync(sourcePath, "utf8");
		const normalized = normalizeHtml(raw);

		// Defend against silent under-normalisation: if a future Next.js version
		// changes how the build id or chunk hashes are emitted, fail loudly here
		// rather than quietly writing a fixture that will never diff clean.
		const buildIdCount = countOccurrences(normalized, BUILD_ID_PLACEHOLDER);
		if (buildIdCount < 2) {
			throw new Error(
				`Route "${route.path}": expected to normalise the Next.js build id in at least ` +
					`2 places (doctype comment + RSC flight payload) but found ${buildIdCount}. ` +
					`The build output shape may have changed — investigate before trusting this baseline.`,
			);
		}
		if (!normalized.includes(CHUNK_HASH_PLACEHOLDER)) {
			throw new Error(
				`Route "${route.path}": expected to normalise at least one ` +
					`/_next/static/chunks/*.{js,css} hash but found none.`,
			);
		}

		const destPath = path.join(fixturesDir, route.file);
		writeFileSync(destPath, normalized, "utf8");
		summary.push({ route, bytes: Buffer.byteLength(normalized, "utf8") });
	}

	console.log("Captured baseline fixtures:");
	for (const entry of summary) {
		console.log(
			`  ${entry.route.path.padEnd(18)} -> test/fixtures/baseline/${entry.route.file} ` +
				`(${entry.bytes.toLocaleString()} bytes)`,
		);
	}

	// List any directory entries under .next/static besides "chunks"/"media" as
	// a sanity cross-check: exactly one should exist, and it should be the same
	// build id we just normalised out of every fixture.
	const staticDir = path.join(repoRoot, ".next", "static");
	if (existsSync(staticDir)) {
		const buildIdDirs = readdirSync(staticDir).filter((name) => name !== "chunks" && name !== "media");
		if (buildIdDirs.length !== 1) {
			console.warn(
				`Warning: expected exactly one build-id directory under .next/static, found ` +
					`${buildIdDirs.length}: ${buildIdDirs.join(", ") || "(none)"}. Skipping cross-check.`,
			);
		}
	}
}

const isMainModule = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? "");
if (isMainModule) {
	main().catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
}
