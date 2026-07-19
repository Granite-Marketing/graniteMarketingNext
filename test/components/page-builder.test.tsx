import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageBuilder } from "@/components/page-builder";
import type { Section } from "@/lib/sanity/lib/page-sections";

// U13 of the Sanity page builder plan. `useOptimistic` (next-sanity, via
// @sanity/visual-editing/react) only actually rebases when a real
// Presentation comlink connection sends a mutation event — there is none in
// jsdom, so it stays "pristine" and simply passes the `sections` prop
// through unchanged on every render (verified against next-sanity's
// source: `return pristine ? passthrough : optimistic`). That is exactly
// the behaviour the "reordering reorders the output" test below exercises:
// re-rendering with a differently-ordered `sections` array is what a real
// rebase event would also produce as its end state.

const HERO_SECTION: Extract<Section, { _type: "heroBlock" }> = {
	_key: "hero-1",
	_type: "heroBlock",
	anchorId: null,
	eyebrow: null,
	heading: "Hero heading",
	body: null,
	primaryCtaLabel: null,
	secondaryCta: null,
	showTrustedBy: false,
};

const CTA_SECTION: Extract<Section, { _type: "ctaBlock" }> = {
	_key: "cta-1",
	_type: "ctaBlock",
	anchorId: null,
	ctaHeading: "CTA heading",
	ctaSubtitle: null,
	ctaButton: null,
	ctaFootnote: null,
	secondaryCta: null,
};

const ANCHORED_CTA_SECTION: Extract<Section, { _type: "ctaBlock" }> = {
	...CTA_SECTION,
	_key: "cta-anchored",
	anchorId: "custom-anchor",
};

// Genuinely outside the compile-time union — this is the one place a cast
// is warranted: the runtime-resilience test needs data the type system
// would never let a real caller construct, since that is exactly the gap
// between "the schema promises 8 block types" and "the Content Lake will
// actually hand back whatever's in it".
const UNKNOWN_SECTION = {
	_key: "unknown-1",
	_type: "someFutureBlock",
	anchorId: null,
} as unknown as Section;

function renderPage(sections: Section[]) {
	return render(
		<PageBuilder documentId="page-1" documentType="page" sections={sections} />
	);
}

/** Order of the two fixtures' headings as they actually appear in the DOM. */
function headingOrder(container: HTMLElement): string[] {
	return Array.from(container.querySelectorAll("h1, h2"))
		.map((el) => el.textContent)
		.filter(
			(text): text is string =>
				text === "Hero heading" || text === "CTA heading"
		);
}

describe("PageBuilder", () => {
	it("renders blocks in array order", () => {
		const { container } = renderPage([HERO_SECTION, CTA_SECTION]);
		expect(headingOrder(container)).toEqual(["Hero heading", "CTA heading"]);
	});

	it("reordering the sections array reorders the rendered output", () => {
		const { container } = renderPage([CTA_SECTION, HERO_SECTION]);
		expect(headingOrder(container)).toEqual(["CTA heading", "Hero heading"]);
	});

	it("each rendered section carries a data-sanity attribute containing its own _key", () => {
		const { container } = renderPage([HERO_SECTION, CTA_SECTION]);

		const heroSection = container.querySelector('[aria-labelledby="hero-heading"]');
		const ctaSection = container.querySelector('[aria-labelledby="cta-heading"]');

		expect(heroSection?.getAttribute("data-sanity")).toContain("hero-1");
		expect(ctaSection?.getAttribute("data-sanity")).toContain("cta-1");
		// And not each other's key — proves this is per-item, not a shared value.
		expect(heroSection?.getAttribute("data-sanity")).not.toContain("cta-1");
	});

	it("the container carries the sections path attribute", () => {
		const { container } = renderPage([HERO_SECTION]);
		const root = container.firstElementChild;

		expect(root?.getAttribute("data-sanity")).toContain("sections");
		// Container-level: no _key in its own path.
		expect(root?.getAttribute("data-sanity")).not.toContain("hero-1");
	});

	it("an unknown _type renders nothing and does not throw", () => {
		expect(() => renderPage([UNKNOWN_SECTION])).not.toThrow();

		const { container } = renderPage([UNKNOWN_SECTION]);
		// The container itself still renders (with its own data-sanity attr);
		// it just has no section content inside it.
		expect(container.querySelector("section")).toBeNull();
	});

	it("blocks alongside an unknown _type still render (resilience is per-item, not page-wide)", () => {
		renderPage([HERO_SECTION, UNKNOWN_SECTION, CTA_SECTION]);

		expect(screen.getByText("Hero heading")).toBeInTheDocument();
		expect(screen.getByText("CTA heading")).toBeInTheDocument();
	});

	it("anchorId renders as the section's id", () => {
		const { container } = renderPage([ANCHORED_CTA_SECTION]);
		expect(container.querySelector("#custom-anchor")).toBeInTheDocument();
	});

	it("a section without anchorId falls back to a slugified heading rather than omitting id entirely", () => {
		// ctaHeading is set and anchorId is not, so resolveAnchorId slugifies
		// the heading (lib/sanity/lib/anchor-id.ts) — this is NOT the "omit
		// id" case, which requires both to be blank (see the next test).
		const { container } = renderPage([CTA_SECTION]);
		expect(container.querySelector("#cta-heading")).toBeInTheDocument();
	});

	it("a section with neither anchorId nor heading omits id rather than emitting id=\"\"", () => {
		const blankSection: Extract<Section, { _type: "ctaBlock" }> = {
			...CTA_SECTION,
			_key: "cta-blank",
			ctaHeading: null,
		};
		const { container } = renderPage([blankSection]);

		const section = container.querySelector('[aria-labelledby="cta-heading"]');
		expect(section).not.toBeNull();
		expect(section?.hasAttribute("id")).toBe(false);
	});
});
