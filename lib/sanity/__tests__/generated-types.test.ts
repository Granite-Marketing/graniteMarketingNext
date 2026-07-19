import { describe, expect, it } from "vitest";
import type {
	PageBuilder,
	Page,
	BLOG_POST_QUERYResult,
	BLOG_LISTING_QUERYResult,
	TEMPLATE_LISTING_QUERYResult,
	CONTACT_PAGE_QUERYResult,
	BLOG_POST_TEMPLATE_SECTIONS_QUERYResult,
	TEMPLATE_DETAIL_SECTIONS_QUERYResult,
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

// Guards against the silent zero-query failure typegen has produced twice:
// a helper function or an imported constant in queries.ts makes typegen
// parse nothing for that file, and every `*_QUERYResult` export it would
// have emitted simply disappears from sanity.types.ts. A missing export is
// already a compile error on the `import type` above, but that alone proved
// too weak in practice — `T extends unknown` is true for every T, including
// `any` and `never`, so a vacuous version of this test kept passing through
// two real regressions.
//
// `Equal<>` (defined above) is the fix: unlike a plain `extends` check, it
// is provably false when compared against `any`, `unknown`, or `never` —
// verified directly (not assumed) against this project's `tsc`:
//   Equal<any, {foo: string}>     -> false
//   Equal<unknown, {foo: string}> -> false
//   Equal<never, {foo: string}>   -> false
//   Equal<{foo: string}, {foo: string}> -> true
// So pinning a real field's exact type with Equal<> — rather than merely
// checking a key is present with Has<> (which `any`'s `keyof` satisfies for
// any string) — is what makes these assertions fail to compile the moment
// typegen degrades a result type, rather than staying vacuously green.
//
// Each of the five *_QUERYResult types below corresponds 1:1 to the queries
// that triggered the silent failure both times (see queries.ts's
// PAGE_TYPE_CHROME_FIELDS / PageTypeSectionsResult comments): they filter
// solely on `_id` with no `_type` guard, so typegen unions in every schema
// document type. `BranchOf<>` pulls out the one branch that corresponds to
// the document actually returned at that id, mirroring `BlockOf<>` above.
type BranchOf<Result, DocType extends string> = Extract<Result, { _type: DocType }>;

// --- BLOG_POST_QUERYResult (blog post detail: /blog/[slug]) ---
type _BlogPost = NonNullable<BLOG_POST_QUERYResult>;
type _BlogPostTitleTyped = Expect<Equal<_BlogPost["title"], string | null>>;
type _BlogPostPublishedAtTyped = Expect<Equal<_BlogPost["publishedAt"], string | null>>;
type _BlogPostAuthorNameTyped = Expect<
	Equal<NonNullable<_BlogPost["author"]>["name"], string | null>
>;
type _BlogPostSeoTitleTyped = Expect<
	Equal<NonNullable<_BlogPost["seo"]>["metaTitle"], string | null>
>;
type _BlogPostRelatedTemplateUrlTyped = Expect<
	Equal<_BlogPost["relatedTemplates"][number]["n8nUrl"], string | null>
>;
type _BlogPostStandaloneLinkTyped = Expect<
	Equal<NonNullable<_BlogPost["standaloneTemplateLink"]>["youtubeUrl"], string | null>
>;

// --- BLOG_LISTING_QUERYResult (/blog chrome) ---
type _BlogListingBranch = BranchOf<BLOG_LISTING_QUERYResult, "blogListing">;
type _BlogListingHeadingTyped = Expect<Equal<_BlogListingBranch["heading"], string | null>>;
type _BlogListingSeoTitleTyped = Expect<
	Equal<NonNullable<_BlogListingBranch["seo"]>["metaTitle"], string | undefined>
>;
type _BlogListingSectionKeyTyped = Expect<
	Equal<NonNullable<_BlogListingBranch["sectionsAbove"]>[number]["_key"], string>
>;

// --- TEMPLATE_LISTING_QUERYResult (/templates chrome) ---
type _TemplateListingBranch = BranchOf<TEMPLATE_LISTING_QUERYResult, "templateListing">;
type _TemplateListingHeadingTyped = Expect<Equal<_TemplateListingBranch["heading"], string | null>>;
type _TemplateListingSeoTitleTyped = Expect<
	Equal<NonNullable<_TemplateListingBranch["seo"]>["metaTitle"], string | undefined>
>;
type _TemplateListingSectionKeyTyped = Expect<
	Equal<NonNullable<_TemplateListingBranch["sectionsAbove"]>[number]["_key"], string>
>;

// --- CONTACT_PAGE_QUERYResult (/contact chrome) ---
type _ContactPageBranch = BranchOf<CONTACT_PAGE_QUERYResult, "contactPage">;
type _ContactPageHeadingTyped = Expect<Equal<_ContactPageBranch["heading"], string | null>>;
type _ContactPageSeoTitleTyped = Expect<
	Equal<NonNullable<_ContactPageBranch["seo"]>["metaTitle"], string | undefined>
>;
type _ContactPageSectionKeyTyped = Expect<
	Equal<NonNullable<_ContactPageBranch["sectionsAbove"]>[number]["_key"], string>
>;

// --- BLOG_POST_TEMPLATE_SECTIONS_QUERYResult (wraps every /blog/[slug]) ---
type _BlogPostTemplateBranch = BranchOf<
	BLOG_POST_TEMPLATE_SECTIONS_QUERYResult,
	"blogPostTemplate"
>;
type _BlogPostTemplateSectionsAboveKeyTyped = Expect<
	Equal<NonNullable<_BlogPostTemplateBranch["sectionsAbove"]>[number]["_key"], string>
>;
type _BlogPostTemplateSectionsBelowKeyTyped = Expect<
	Equal<NonNullable<_BlogPostTemplateBranch["sectionsBelow"]>[number]["_key"], string>
>;

// --- TEMPLATE_DETAIL_SECTIONS_QUERYResult (wraps every /templates/[slug]) ---
type _TemplateDetailBranch = BranchOf<TEMPLATE_DETAIL_SECTIONS_QUERYResult, "templateDetail">;
type _TemplateDetailSectionsAboveKeyTyped = Expect<
	Equal<NonNullable<_TemplateDetailBranch["sectionsAbove"]>[number]["_key"], string>
>;
type _TemplateDetailSectionsBelowKeyTyped = Expect<
	Equal<NonNullable<_TemplateDetailBranch["sectionsBelow"]>[number]["_key"], string>
>;

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
