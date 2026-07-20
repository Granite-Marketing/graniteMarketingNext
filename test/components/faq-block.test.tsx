import { vercelStegaCombine } from "@vercel/stega";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Finding #6 (2026-07-19 code review) needs to see which `query` string the
// adapter hands `usePresentationQuery`, to prove `sectionsPath` actually
// reaches it — `useLiveSection` (lib/sanity/lib/use-live-section.ts) never
// exposes that string itself, it only returns `initial` when inactive (see
// that file's own test for why: no live Presentation comlink connection
// exists in jsdom). Mocking the hook here is the only way to inspect the
// argument it was called with.
const usePresentationQueryMock = vi.fn().mockReturnValue({ data: null });
vi.mock("next-sanity/hooks", () => ({
	usePresentationQuery: (args: { query: string }) =>
		usePresentationQueryMock(args),
}));

import { FaqBlockAdapter } from "@/components/blocks/faq-block";
import type { BlockOf } from "@/lib/sanity/lib/page-sections";

type FaqBlockValue = BlockOf<"faqBlock">;

afterEach(() => {
	usePresentationQueryMock.mockClear();
});

// `autoCategory`/`category` are schema list-enums typed as a narrow string
// literal union (FaqBlockValue["autoCategory"]). A genuinely stega-encoded
// value is a `string` at the type level — that mismatch is real Draft Mode
// behaviour (the Content Lake hands back the encoded string regardless of
// what the schema declares), not a test artefact, so it's cast here rather
// than loosened away.
function asCategory(value: string): FaqBlockValue["autoCategory"] {
	return value as FaqBlockValue["autoCategory"];
}

function autoFaqItem(overrides: Partial<FaqBlockValue["autoItems"][number]>) {
	return {
		_id: "faq-1",
		question: "Do you offer refunds?",
		slug: { current: "refunds", _type: "slug" as const },
		answer: [],
		order: 1,
		category: "general",
		...overrides,
	} as FaqBlockValue["autoItems"][number];
}

const BASE_VALUE: FaqBlockValue = {
	_key: "faq-1",
	_type: "faqBlock",
	anchorId: null,
	eyebrow: null,
	heading: null,
	intro: null,
	sourceMode: "auto",
	autoCategory: null,
	autoItems: [],
	manualItems: [],
};

describe("FaqBlockAdapter — Finding #3: stega-encoded category comparison", () => {
	it("resolves auto-mode items when category values are genuinely stega-encoded and share the same visible text", () => {
		// Two independent encodings of the literal text "general" — one
		// standing in for the block's own `autoCategory` field, the other for
		// a different FAQ document's `category` field. `@vercel/stega`
		// (the same encoder `@sanity/client/stega`'s cleaner strips —
		// see lib/sanity/lib/resolve-link.ts's header comment) embeds the
		// *source path* invisibly, so two different fields encoding the same
		// visible word are NOT byte-identical. This is the actual bug: two
		// documents' `"general"` never compared `===` equal in Draft Mode,
		// so the FAQ block rendered zero items — a plain string fixture
		// would never have caught it.
		const encodedAutoCategory = vercelStegaCombine("general", {
			origin: "sanity.io",
			href: "https://example.com/studio/desk/faqBlock",
			title: "autoCategory",
		});
		const encodedItemCategory = vercelStegaCombine("general", {
			origin: "sanity.io",
			href: "https://example.com/studio/desk/faq;faq-1",
			title: "category",
		});

		// Prove the fixtures are genuinely encoded and genuinely distinct
		// before they do any work in the assertion below.
		expect(encodedAutoCategory).not.toBe("general");
		expect(encodedItemCategory).not.toBe("general");
		expect(encodedAutoCategory).not.toBe(encodedItemCategory);
		expect(encodedAutoCategory.startsWith("general")).toBe(true);
		expect(encodedItemCategory.startsWith("general")).toBe(true);

		const value: FaqBlockValue = {
			...BASE_VALUE,
			autoCategory: asCategory(encodedAutoCategory),
			autoItems: [autoFaqItem({ category: asCategory(encodedItemCategory) })],
		};

		render(
			<FaqBlockAdapter value={value} documentId="page-1" dataSanity="x" />
		);

		// Without stegaClean on both operands, this item is filtered out and
		// nothing renders.
		expect(
			screen.getByText("Do you offer refunds?")
		).toBeInTheDocument();
	});

	it("still filters out items from a genuinely different category once cleaned", () => {
		const encodedAutoCategory = vercelStegaCombine("general", {
			origin: "sanity.io",
			href: "https://example.com/studio/desk/faqBlock",
			title: "autoCategory",
		});
		const encodedOtherCategory = vercelStegaCombine("support", {
			origin: "sanity.io",
			href: "https://example.com/studio/desk/faq;faq-2",
			title: "category",
		});

		const value: FaqBlockValue = {
			...BASE_VALUE,
			autoCategory: asCategory(encodedAutoCategory),
			autoItems: [
				autoFaqItem({
					_id: "faq-2",
					question: "How do I update my card?",
					category: asCategory(encodedOtherCategory),
				}),
			],
		};

		render(
			<FaqBlockAdapter value={value} documentId="page-1" dataSanity="x" />
		);

		expect(
			screen.queryByText("How do I update my card?")
		).not.toBeInTheDocument();
	});

	it("plain, non-stega category strings still match (no regression on the live site's uncleaned path)", () => {
		const value: FaqBlockValue = {
			...BASE_VALUE,
			autoCategory: "general",
			autoItems: [autoFaqItem({ category: "general" })],
		};

		render(
			<FaqBlockAdapter value={value} documentId="page-1" dataSanity="x" />
		);

		expect(
			screen.getByText("Do you offer refunds?")
		).toBeInTheDocument();
	});
});

describe("FaqBlockAdapter — Finding #6: sectionsPath reaches the live query", () => {
	it("builds the live query against sectionsAbove when sectionsPath=\"sectionsAbove\"", () => {
		render(
			<FaqBlockAdapter
				value={BASE_VALUE}
				documentId="page-1"
				dataSanity="x"
				sectionsPath="sectionsAbove"
			/>
		);

		expect(usePresentationQueryMock).toHaveBeenCalledTimes(1);
		const { query } = usePresentationQueryMock.mock.calls[0][0];
		expect(query).toContain("sectionsAbove");
		expect(query).not.toMatch(/\]\.sections\[/);
	});

	it("builds the live query against sectionsBelow when sectionsPath=\"sectionsBelow\"", () => {
		render(
			<FaqBlockAdapter
				value={BASE_VALUE}
				documentId="page-1"
				dataSanity="x"
				sectionsPath="sectionsBelow"
			/>
		);

		const { query } = usePresentationQueryMock.mock.calls[0][0];
		expect(query).toContain("sectionsBelow");
	});

	it("defaults to sections when sectionsPath is omitted (page documents unchanged)", () => {
		render(
			<FaqBlockAdapter value={BASE_VALUE} documentId="page-1" dataSanity="x" />
		);

		const { query } = usePresentationQueryMock.mock.calls[0][0];
		expect(query).toMatch(/\]\.sections\[/);
	});
});
