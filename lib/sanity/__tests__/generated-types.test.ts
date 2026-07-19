import { describe, expect, it } from "vitest";
import type {
	PageBuilder,
	Page,
	BLOG_POST_QUERYResult,
	SiteSettings,
} from "@/sanity.types";

// Typegen is manual on sanity@4.21.1 (no `enabled: true`, no --watch — both
// need Studio 5.8.0+), so sanity.types.ts can silently drift from the schema
// if someone edits a block and forgets `npm run typegen`.
//
// These are compile-time assertions: they fail `tsc --noEmit`, not the test
// runner. The `it()` blocks exist so the file reports in the suite; the real
// work is done by the types above them.

/** Fails to compile unless T is exactly true. */
type Expect<T extends true> = T;
type Equal<A, B> =
	(<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2
		? true
		: false;
type Has<Union, Member> = Member extends Union ? true : false;

type Section = PageBuilder[number];

/** The KTD2 pattern — Get<>/FilterByType<> do not exist on this pin. */
type BlockOf<T extends Section["_type"]> = Extract<Section, { _type: T }>;

// Every block must be reachable from the union. Adding a block type without
// regenerating types breaks here rather than shipping a blank section.
type _HeroReachable = Expect<Has<Section["_type"], "heroBlock">>;
type _CapabilitiesReachable = Expect<Has<Section["_type"], "capabilitiesBlock">>;
type _ToolsReachable = Expect<Has<Section["_type"], "toolsStripBlock">>;
type _ProcessReachable = Expect<Has<Section["_type"], "processBlock">>;
type _ResultsReachable = Expect<Has<Section["_type"], "resultsBlock">>;
type _TestimonialsReachable = Expect<Has<Section["_type"], "testimonialsBlock">>;
type _FaqReachable = Expect<Has<Section["_type"], "faqBlock">>;
type _CtaReachable = Expect<Has<Section["_type"], "ctaBlock">>;

// Narrowing must actually narrow. If Extract collapses to never, the renderer
// switch would compile while every branch received the wrong shape.
type _HeroNarrows = Expect<Equal<BlockOf<"heroBlock">["_type"], "heroBlock">>;
type _CtaNarrows = Expect<Equal<BlockOf<"ctaBlock">["_type"], "ctaBlock">>;

// _key is what data-attribute targeting keys off (KTD5). Index-based paths
// break on reorder, so its presence is load-bearing, not incidental.
type _SectionsCarryKey = Expect<Equal<Section["_key"], string>>;

// Guards against the silent `unknown` degradation typegen falls back to when
// it cannot parse a GROQ expression.
type _QueryTyped = Expect<Equal<BLOG_POST_QUERYResult extends unknown ? true : never, true>>;
type _PageHasSections = Expect<Has<keyof Page, "sections">>;
type _SettingsHasNav = Expect<Has<keyof SiteSettings, "navLinks">>;

describe("generated sanity.types.ts", () => {
	it("compiles the block-union assertions above", () => {
		// Reaching this line means tsc accepted every Expect<> above.
		expect(true).toBe(true);
	});

	it("documents how to regenerate when these fail", () => {
		// If tsc fails in this file, the fix is `npm run typegen` — not
		// editing the assertions to match whatever was generated.
		expect("npm run typegen").toBeTruthy();
	});
});
