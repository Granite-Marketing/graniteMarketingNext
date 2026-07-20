import { describe, expect, it } from "vitest";
import type { BlockOf, Section } from "../page-sections";

// Type-level assertions for the U13 renderer's shared `Section`/`BlockOf<T>`
// types — same pattern as lib/sanity/__tests__/generated-types.test.ts:
// compile-time checks that fail `tsc --noEmit`, not the test runner. The
// `it()` blocks exist so this file reports in the suite; the real work is
// the types above them.

/** Fails to compile unless T is exactly true. */
type Expect<T extends true> = T;
type Has<Union, Member> = Member extends Union ? true : false;

// Every block type must be reachable from the query-result union — this is
// the same reachability guarantee generated-types.test.ts checks over the
// bare schema union, re-checked here over the richer union the renderer
// actually switches on (see page-sections.ts's own comment for why they
// differ).
type _HeroReachable = Expect<Has<Section["_type"], "heroBlock">>;
type _CapabilitiesReachable = Expect<Has<Section["_type"], "capabilitiesBlock">>;
type _ToolsReachable = Expect<Has<Section["_type"], "toolsStripBlock">>;
type _ProcessReachable = Expect<Has<Section["_type"], "processBlock">>;
type _ResultsReachable = Expect<Has<Section["_type"], "resultsBlock">>;
type _TestimonialsReachable = Expect<Has<Section["_type"], "testimonialsBlock">>;
type _FaqReachable = Expect<Has<Section["_type"], "faqBlock">>;
type _CtaReachable = Expect<Has<Section["_type"], "ctaBlock">>;

// `BlockOf<T>` must actually narrow to the resolved data blocks carry
// (autoItems/manualItems), not just the bare block fields.
type _ResultsHasAutoItems = Expect<Has<keyof BlockOf<"resultsBlock">, "autoItems">>;
type _ResultsHasManualItems = Expect<Has<keyof BlockOf<"resultsBlock">, "manualItems">>;
type _TestimonialsHasAutoItems = Expect<
	Has<keyof BlockOf<"testimonialsBlock">, "autoItems">
>;

// _key is what data-attribute targeting keys off (KTD5).
type _SectionsCarryKey = Expect<Has<keyof Section, "_key">>;

describe("page-sections types", () => {
	it("compiles the block-union assertions above", () => {
		expect(true).toBe(true);
	});

	it("documents how to regenerate when these fail", () => {
		// If tsc fails in this file after a schema/query change, the fix is
		// `npm run typegen` — not editing the assertions to match whatever was
		// generated.
		expect("npm run typegen").toBeTruthy();
	});
});
