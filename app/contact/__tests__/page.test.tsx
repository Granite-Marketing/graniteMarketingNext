import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Section } from "@/lib/sanity/lib/page-sections";

// U21 of the Sanity page builder plan: /contact renders sectionsAbove/
// sectionsBelow (and, once filled in, a ContentHero) from contactPage once
// it is PUBLISHED, falling back to today's hardcoded chrome otherwise — the
// same zero-risk cutover shape app/page.tsx established for the homepage
// (U16). Contact (the form) is the fixed region: it has no field on
// contactPage and must render in BOTH branches unconditionally.
//
// Unlike blogListing/templateListing, /contact has NO ContentHero and must
// never grow one: its header lives inside the Contact component, so a
// ContentHero here would render the heading and subtitle twice (it briefly
// did). The hero fields are passed to Contact as prop overrides instead,
// and per-field, so an unset field falls back to the component's own copy
// rather than blanking it. That the component renders exactly one header is
// proven in components/__tests__/contact.test.tsx.
vi.mock("@/components/nav", () => ({
	Nav: () => <div data-testid="nav-stub" />,
}));
vi.mock("@/components/footer", () => ({
	Footer: () => <div data-testid="footer-stub" />,
}));
const contactSpy = vi.fn();
vi.mock("@/components/contact", () => ({
	Contact: (props: unknown) => {
		contactSpy(props);
		return <div data-testid="contact-form-stub" />;
	},
}));

// Deliberately still mocked, so that if this route ever renders one again
// the assertions below fail loudly rather than silently passing.
vi.mock("@/components/content-hero", () => ({
	ContentHero: () => <div data-testid="content-hero-stub" />,
}));

const pageBuilderSpy = vi.fn();
vi.mock("@/components/page-builder", () => ({
	PageBuilder: (props: unknown) => {
		pageBuilderSpy(props);
		return <div data-testid="page-builder-stub" />;
	},
}));

const getContactPagePublished = vi.fn();
const getContactPage = vi.fn();
const getPageCtaDefaults = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
	getContactPagePublished: (...args: unknown[]) =>
		getContactPagePublished(...args),
	getContactPage: (...args: unknown[]) => getContactPage(...args),
	getPageCtaDefaults: (...args: unknown[]) => getPageCtaDefaults(...args),
}));

import ContactPage, { generateMetadata } from "../page";

const HERO_SECTION: Extract<Section, { _type: "heroBlock" }> = {
	_key: "hero-1",
	_type: "heroBlock",
	anchorId: null,
	eyebrow: null,
	heading: "Sanity hero heading",
	body: null,
	primaryCtaLabel: null,
	secondaryCta: null,
	showTrustedBy: false,
};

const FALLBACK_TITLE = "Contact Us - Granite Marketing | Get in Touch";
const FALLBACK_DESCRIPTION =
	"Get in touch with Granite Marketing. Fill out our contact form to discuss your AI automation needs, workflow optimization, or general inquiries.";

function contactDoc(overrides: Record<string, unknown> = {}) {
	return {
		_id: "contactPage",
		_type: "contactPage",
		seo: null,
		tag: null,
		heading: null,
		subtitle: null,
		sectionsAbove: [],
		sectionsBelow: [],
		...overrides,
	};
}

beforeEach(() => {
	vi.clearAllMocks();
	getPageCtaDefaults.mockResolvedValue(null);
	// contactPage is a draft-only document today — the default here mirrors
	// that, exactly like app/page.tsx's getHomePageSlug default.
	getContactPagePublished.mockResolvedValue(false);
});

describe("app/contact — rendering", () => {
	it("renders the hardcoded chrome (no hero) when contactPage has no published version", async () => {
		getContactPagePublished.mockResolvedValue(false);

		const jsx = await ContactPage();
		render(jsx);

		expect(screen.queryByTestId("content-hero-stub")).not.toBeInTheDocument();
		expect(screen.queryByTestId("page-builder-stub")).not.toBeInTheDocument();
		expect(getContactPage).not.toHaveBeenCalled();
	});

	it("the fixed Contact form renders even when unpublished", async () => {
		getContactPagePublished.mockResolvedValue(false);

		const jsx = await ContactPage();
		render(jsx);

		expect(screen.getByTestId("contact-form-stub")).toBeInTheDocument();
	});

	it("renders sections when contactPage is published", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(
			contactDoc({ sectionsAbove: [HERO_SECTION], sectionsBelow: [] })
		);

		const jsx = await ContactPage();
		render(jsx);

		expect(pageBuilderSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				documentId: "contactPage",
				documentType: "contactPage",
				sections: [HERO_SECTION],
			})
		);
	});

	it("the fixed Contact form renders even when published — the region an editor cannot remove", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(contactDoc());

		const jsx = await ContactPage();
		render(jsx);

		expect(screen.getByTestId("contact-form-stub")).toBeInTheDocument();
	});

	it("passes the hero copy to Contact rather than rendering a second header", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(
			contactDoc({
				tag: "Get In Touch",
				heading: "Let's talk",
				subtitle: "We'd love to hear from you.",
			})
		);

		const jsx = await ContactPage();
		render(jsx);

		expect(contactSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				tag: "Get In Touch",
				heading: "Let's talk",
				subtitle: "We'd love to hear from you.",
			})
		);
		// The regression: a ContentHero here duplicates the header Contact
		// already renders.
		expect(screen.queryByTestId("content-hero-stub")).not.toBeInTheDocument();
	});

	it("omits unset hero fields so Contact keeps its own copy for them", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(
			contactDoc({ tag: null, heading: "Let's talk", subtitle: null })
		);

		const jsx = await ContactPage();
		render(jsx);

		// Passing `tag: null` through would blank the eyebrow instead of
		// leaving the component's default in place, so absent must mean
		// absent — not present-and-empty.
		const props = contactSpy.mock.calls.at(-1)?.[0] as Record<string, unknown>;
		expect(props).toEqual({ heading: "Let's talk" });
		expect(screen.queryByTestId("content-hero-stub")).not.toBeInTheDocument();
	});

	it("passes no hero props at all when published but every hero field is empty", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(contactDoc());

		const jsx = await ContactPage();
		render(jsx);

		expect(contactSpy.mock.calls.at(-1)?.[0]).toEqual({});
		expect(screen.queryByTestId("content-hero-stub")).not.toBeInTheDocument();
	});

	it("falls back to the hardcoded chrome if getContactPage returns null despite a published check", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(null);

		const jsx = await ContactPage();
		render(jsx);

		expect(screen.getByTestId("contact-form-stub")).toBeInTheDocument();
		expect(screen.queryByTestId("content-hero-stub")).not.toBeInTheDocument();
	});
});

describe("app/contact — generateMetadata", () => {
	it("falls back to the current hardcoded metadata when contactPage has no published version", async () => {
		getContactPagePublished.mockResolvedValue(false);

		const metadata = await generateMetadata();

		expect(metadata).toEqual({
			title: FALLBACK_TITLE,
			description: FALLBACK_DESCRIPTION,
		});
		expect(getContactPage).not.toHaveBeenCalled();
	});

	it("sources title/description from seo when contactPage is published", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(
			contactDoc({
				seo: {
					metaTitle: "Custom Contact Title",
					metaDescription: "Custom contact description",
				},
			})
		);

		const metadata = await generateMetadata();

		expect(metadata.title).toBe("Custom Contact Title");
		expect(metadata.description).toBe("Custom contact description");
	});

	it("falls back per-field to the hardcoded metadata when seo is unset", async () => {
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(contactDoc({ seo: null }));

		const metadata = await generateMetadata();

		expect(metadata.title).toBe(FALLBACK_TITLE);
		expect(metadata.description).toBe(FALLBACK_DESCRIPTION);
	});

	it("strips stega characters from the resolved metadata", async () => {
		const STEGA_MARKER = "​​​​";
		getContactPagePublished.mockResolvedValue(true);
		getContactPage.mockResolvedValue(
			contactDoc({
				seo: {
					metaTitle: `Stega${STEGA_MARKER}Title`,
					metaDescription: `Stega${STEGA_MARKER}Description`,
				},
			})
		);

		const metadata = await generateMetadata();

		expect(metadata.title).toBe("StegaTitle");
		expect(metadata.description).toBe("StegaDescription");
	});
});
