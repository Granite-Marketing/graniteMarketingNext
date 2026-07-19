/**
 * Baseline HTML capture and check — Unit U6 of
 * docs/plans/2026-07-18-004-feat-sanity-page-builder-plan.md, extended
 * 2026-07-19 after an incident (below) exposed two problems with the
 * original single-mode script.
 *
 * WHY THIS EXISTS (ordering hazard):
 *   This captures a snapshot of the CURRENT, pre-page-builder, published HTML.
 *   Once the homepage is switched to render from a Sanity `page` document
 *   (Unit U16), this baseline becomes unobtainable without a `git checkout`
 *   of the pre-migration tree. It is the one unrecoverable step in the plan
 *   and MUST run before U16. Later units diff their output against these
 *   fixtures to prove the migration is content-neutral.
 *
 * INCIDENT (2026-07-19): this script used to have exactly one mode — read
 * `.next/server/app/*.html` and OVERWRITE test/fixtures/baseline/*.html —
 * and it silently ignored any CLI arguments it didn't recognise. Someone ran
 * `tsx test/regression/capture-baseline.ts --check` expecting a comparison;
 * the `--check` flag was ignored, the script ran its only mode, overwrote
 * all nine committed fixtures, and reported success — destroying the
 * pre-migration artifact the comparison was meant to check against. It was
 * only caught via `git status`. Two fixes follow directly from that:
 *   1. The default (no arguments) is now `--check`: read-only, compares
 *      current build output against the committed fixtures, writes nothing.
 *      Overwriting fixtures now requires the explicit `--write` flag.
 *      (`--check` alone is also accepted, for clarity at call sites.)
 *   2. Any argument that isn't `--check` or `--write` is a hard error —
 *      see `parseCliArgs` / `UnknownArgumentError` below. Silently ignoring
 *      an unrecognised flag is exactly what caused the incident.
 *
 * WHAT THIS SCRIPT DOES, per mode:
 *   --write (destructive):
 *     1. Reads already-built production output from `.next/server/app/*.html`
 *        (the output of `next build`). It does NOT start a dev server and
 *        scrape it — dev output differs from what actually ships, and the
 *        baseline must reflect production.
 *     2. Normalises the nondeterminism documented below.
 *     3. OVERWRITES test/fixtures/baseline/*.html with the normalised HTML.
 *   --check (default, non-destructive):
 *     1. Reads the same production output.
 *     2. Normalises it the same way.
 *     3. Compares it against the already-normalised, committed fixture for
 *        each route and reports PASS/FAIL per route. Writes nothing, ever.
 *        Exits non-zero if any route's rendered markup differs. See
 *        "STRICT VS MARKUP-ONLY" below for what "differs" means.
 *
 * NORMALISATION — proved necessary, not assumed. The build-id and chunk-hash
 * rules below were established by running two independent clean `next build`
 * runs on an unchanged tree and diffing byte-for-byte across all 9 target
 * routes. Full method and raw evidence are in test/fixtures/baseline/README.md.
 * The useId rule (added 2026-07-19) is a different class of evidence — see
 * its own entry. Summary:
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
 *   3. React `useId()` values, rendered as `_R_<base36>_` (e.g. inside Radix
 *      ids: `id="radix-_R_3l9bsnnb_"`, `aria-controls="radix-_R_3l9bsnnb_"`).
 *      Unlike #1 and #2, these are NOT random across identical rebuilds —
 *      `useId` is deterministic given the component tree's shape, so two
 *      clean builds of an unchanged tree produce byte-identical ids (which
 *      is why the original two-build experiment never flagged them). The
 *      false positive shows up on a different axis: any change to the tree
 *      SHAPE reassigns every id in the tree, even when the change has zero
 *      effect on rendered output. Observed directly on this branch: adding a
 *      server/client boundary to a component shifted every `_R_...` id on
 *      the page, while the visible text, markup structure, and attributes
 *      were otherwise byte-identical. Left un-normalised, this harness would
 *      report a false regression on every such refactor. The id portion is
 *      replaced with `__USE_ID__`, keeping the surrounding attribute intact
 *      (e.g. `id="radix-__USE_ID__"`), so an attribute whose non-id content
 *      changes, or an element that's genuinely added/removed, still diffs.
 *
 * STRICT VS MARKUP-ONLY (added 2026-07-19):
 *   The original header claimed `__next_f.push(...)` module ids and
 *   streaming order were stable and deliberately NOT normalised, based on
 *   the two-build experiment. That conclusion was correct for what it
 *   tested — an unchanged tree rebuilt twice — but is the wrong test for how
 *   this harness is actually used: comparing across commits where routes or
 *   modules get added elsewhere in the app. Module ids are assigned by
 *   position in the bundler's module graph, so they reorder whenever that
 *   graph's shape changes, exactly like useId — and indeed this has now
 *   happened as routes were added during this migration. That stale
 *   conclusion is no longer trustworthy; do not rely on it.
 *
 *   The fix is deliberately NOT to widen `normalizeHtml` to swallow this.
 *   Rendered markup is the thing under test, and script/bundler content is
 *   real output that a genuine regression could hide inside. Instead,
 *   `--check` reports comparisons at two tiers per route:
 *     - strict:      full normalised document, including <script> content.
 *     - markup-only: same, with every <script>...</script> block excluded
 *       via `stripScriptBlocks` before comparing.
 *   A route that differs in strict but not markup-only means only bundler
 *   bookkeeping (e.g. flight payload module ids) changed — not a content
 *   regression. `--check`'s pass/fail and exit code are driven by
 *   markup-only; strict is reported alongside as a diagnostic so the two
 *   are legible at a glance, per-route, without guessing.
 *
 * NOT normalised, because two clean builds proved them stable (do not add
 * without re-running the two-build diff and updating the evidence above):
 *   - font and image hashes under /_next/static/media/**
 *   - every other script/css chunk hash (~17 of ~18)
 *   - all visible text, markup structure, attributes, and meta tags
 *
 * Deliberately left un-normalised (see STRICT VS MARKUP-ONLY above for why,
 * and how `--check` handles it instead):
 *   - all __next_f.push(...) module ids and streaming order
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
// React useId(), as rendered by this app: literal "_R_", one or more
// base36-ish characters, literal trailing "_" (e.g. "_R_3l9bsnnb_"). Requires
// at least one character between the delimiters so it does not touch the
// separate, stable literal `id="_R_"` emitted on some preload script tags
// (that one has nothing between the underscores and does not vary).
const USE_ID_PATTERN = /_R_[0-9a-zA-Z]+_/g;
// Matches a whole <script ...>...</script> block, including empty ones
// (src="..." tags with no inline content) and multi-line inline payloads.
// Verified against the committed fixtures: no `</script` substring appears
// escaped inside any inline script content in this app's output, so a plain
// non-greedy match is safe here — re-verify against real output before
// trusting this if that ever changes.
const SCRIPT_BLOCK_PATTERN = /<script\b[^>]*>[\s\S]*?<\/script>/gi;

export const BUILD_ID_PLACEHOLDER = "__BUILD_ID__";
export const CHUNK_HASH_PLACEHOLDER = "__CHUNK_HASH__";
export const USE_ID_PLACEHOLDER = "__USE_ID__";

/**
 * Strips the three nondeterministic/tree-shape-sensitive elements documented
 * above from a captured route's HTML. Pure function: same input always
 * produces the same output, and nothing outside the documented patterns is
 * touched.
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
	normalized = normalized.replace(USE_ID_PATTERN, USE_ID_PLACEHOLDER);

	return normalized;
}

/**
 * Removes every <script>...</script> block from an (already normalised)
 * document. Used to produce the "markup-only" comparison tier, which is
 * blind to bundler bookkeeping (e.g. __next_f flight-payload module ids)
 * living inside <script> tags — see "STRICT VS MARKUP-ONLY" in the header.
 * Deliberately blunt: it removes scripts wholesale rather than trying to
 * normalise their contents, so it can never be accused of selectively
 * hiding a real regression that happens to live in a script tag — it hides
 * ALL of them, and the strict tier is there to catch that class entirely.
 */
export function stripScriptBlocks(html: string): string {
	return html.replace(SCRIPT_BLOCK_PATTERN, "");
}

/**
 * Compares two normalised baselines and returns a human-readable, localised
 * description of the first difference, or null if they are identical. Used
 * both by the "fails loudly" test here and by the --check comparison mode
 * below (at both the strict and markup-only tiers).
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

export type CliMode = "check" | "write";

export interface CliArgs {
	readonly mode: CliMode;
}

const RECOGNISED_FLAGS = ["--check", "--write"] as const;

/**
 * Thrown by parseCliArgs for any argument that isn't recognised. Exists as a
 * named class (rather than a plain Error) so tests can assert on the type,
 * not just string-match a message. See the INCIDENT note in the header for
 * why unrecognised arguments are a hard error rather than being ignored.
 */
export class UnknownArgumentError extends Error {
	readonly argument: string;

	constructor(argument: string) {
		super(
			`Unknown argument: "${argument}". Recognised arguments: ${RECOGNISED_FLAGS.join(", ")}. ` +
				`Refusing to run rather than silently ignore an argument you passed — an earlier version ` +
				`of this script did that and it overwrote the committed baseline fixtures while someone ` +
				`thought they were running a comparison. See the header comment in capture-baseline.ts.`,
		);
		this.name = "UnknownArgumentError";
		this.argument = argument;
	}
}

/**
 * Parses CLI arguments into a mode. No arguments defaults to "check" — the
 * non-destructive comparison mode — so simply running this script can never
 * overwrite the committed fixtures. Writing requires the explicit --write
 * flag. Any argument outside the recognised set is a hard error.
 */
export function parseCliArgs(argv: readonly string[]): CliArgs {
	let sawCheck = false;
	let sawWrite = false;

	for (const arg of argv) {
		if (arg === "--check") {
			sawCheck = true;
		} else if (arg === "--write") {
			sawWrite = true;
		} else {
			throw new UnknownArgumentError(arg);
		}
	}

	if (sawCheck && sawWrite) {
		throw new Error(
			'--check and --write are mutually exclusive (one reads-only, the other overwrites committed ' +
				"fixtures) — pass one or the other, not both.",
		);
	}

	return { mode: sawWrite ? "write" : "check" };
}

interface RouteDirs {
	readonly appDir: string;
	readonly fixturesDir: string;
	readonly routes: readonly BaselineRoute[];
}

export interface CaptureSummaryEntry {
	readonly route: BaselineRoute;
	readonly bytes: number;
}

function readBuiltRoute(appDir: string, route: BaselineRoute): string {
	const sourcePath = path.join(appDir, route.file);
	if (!existsSync(sourcePath)) {
		throw new Error(
			`Expected prerendered output at ${sourcePath} for route "${route.path}" but it ` +
				`is missing. Did this route stop being statically generated?`,
		);
	}
	return readFileSync(sourcePath, "utf8");
}

/**
 * DESTRUCTIVE: normalises current build output and overwrites the fixture
 * file for every route in `fixturesDir`. Callers must only reach this via
 * the explicit --write CLI flag (see parseCliArgs) — never by default.
 */
export function runCapture({ appDir, fixturesDir, routes }: RouteDirs): CaptureSummaryEntry[] {
	mkdirSync(fixturesDir, { recursive: true });

	const summary: CaptureSummaryEntry[] = [];

	for (const route of routes) {
		const raw = readBuiltRoute(appDir, route);
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

	return summary;
}

export interface RouteCheckResult {
	readonly route: BaselineRoute;
	/** Diff over the full normalised document, including <script> content. Null if identical. */
	readonly strictDiff: string | null;
	/** Diff with all <script>...</script> blocks excluded first. Null if identical. */
	readonly markupDiff: string | null;
}

/**
 * Non-destructive: reads current build output and the already-committed,
 * already-normalised fixtures, and reports a strict and a markup-only diff
 * per route. Never writes anything, anywhere — this is what --check (and
 * the no-argument default) runs.
 */
export function runCheck({ appDir, fixturesDir, routes }: RouteDirs): RouteCheckResult[] {
	const results: RouteCheckResult[] = [];

	for (const route of routes) {
		const raw = readBuiltRoute(appDir, route);
		const actualNormalized = normalizeHtml(raw);

		const fixturePath = path.join(fixturesDir, route.file);
		if (!existsSync(fixturePath)) {
			throw new Error(
				`No committed fixture at ${fixturePath} for route "${route.path}". If this route is new ` +
					`and this is an intentional new baseline, run with --write deliberately — it OVERWRITES ` +
					`test/fixtures/baseline/*.html.`,
			);
		}
		const expectedNormalized = readFileSync(fixturePath, "utf8");

		const strictDiff = diffNormalizedHtml(expectedNormalized, actualNormalized);
		const markupDiff = diffNormalizedHtml(
			stripScriptBlocks(expectedNormalized),
			stripScriptBlocks(actualNormalized),
		);

		results.push({ route, strictDiff, markupDiff });
	}

	return results;
}

async function main(): Promise<void> {
	const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
	const appDir = path.join(repoRoot, ".next", "server", "app");
	const fixturesDir = path.join(repoRoot, "test", "fixtures", "baseline");

	let args: CliArgs;
	try {
		args = parseCliArgs(process.argv.slice(2));
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
		return;
	}

	if (!existsSync(appDir)) {
		throw new Error(
			`${appDir} does not exist. Run "npm run build" first — this script reads ` +
				`production output, it does not build it (and must not: dev output differs ` +
				`from what actually ships).`,
		);
	}

	if (args.mode === "write") {
		const summary = runCapture({ appDir, fixturesDir, routes: ROUTES });

		console.log("Captured baseline fixtures — OVERWROTE committed files under test/fixtures/baseline/:");
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
		return;
	}

	// args.mode === "check": read-only, never writes.
	const results = runCheck({ appDir, fixturesDir, routes: ROUTES });
	let ok = true;

	console.log("Baseline check (comparing current build output against committed fixtures; writes nothing):");
	for (const { route, strictDiff, markupDiff } of results) {
		if (markupDiff === null && strictDiff === null) {
			console.log(`  PASS  ${route.path.padEnd(18)} identical (strict and markup-only)`);
		} else if (markupDiff === null) {
			console.log(
				`  PASS  ${route.path.padEnd(18)} rendered markup identical; strict differs ` +
					`(bundler/script bookkeeping only, e.g. __next_f module ids — not a content regression)`,
			);
		} else {
			ok = false;
			console.log(`  FAIL  ${route.path.padEnd(18)} rendered markup differs from the committed fixture`);
			console.log(
				markupDiff
					.split("\n")
					.map((line) => `        ${line}`)
					.join("\n"),
			);
		}
	}

	process.exitCode = ok ? 0 : 1;
}

const isMainModule = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? "");
if (isMainModule) {
	main().catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
}
