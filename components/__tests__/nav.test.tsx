import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CAL_LINK, navLinks as hardcodedNavLinks } from "../data";

// Nav is a server component (see nav.tsx's comment on why it isn't
// "use client" despite the mobile-menu interactivity living in NavClient) —
// exercised the same way app/__tests__/page.test.tsx exercises Home:
// `await Nav()` then render the resolved JSX.
const getSiteSettings = vi.fn();
vi.mock("@/lib/sanity/queries", () => ({
	getSiteSettings: (...args: unknown[]) => getSiteSettings(...args),
}));

import { Nav } from "../nav";

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(cleanup);

describe("Nav", () => {
	it("renders the inline SVG wordmark when siteSettings has no logo — today's behaviour", async () => {
		getSiteSettings.mockResolvedValue({ logo: null });

		const jsx = await Nav();
		const { container } = render(jsx);

		expect(screen.getByText("granite")).toBeDefined();
		expect(container.querySelector("img")).toBeNull();
	});

	it("renders the uploaded logo image when siteSettings.logo is set", async () => {
		getSiteSettings.mockResolvedValue({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "Acme Corp",
			},
		});

		const jsx = await Nav();
		render(jsx);

		expect(screen.getByAltText("Acme Corp")).toBeDefined();
		expect(screen.queryByText("granite")).toBeNull();
	});

	it("falls back to a non-empty alt when altText is empty", async () => {
		getSiteSettings.mockResolvedValue({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "",
			},
		});

		const jsx = await Nav();
		render(jsx);

		const img = screen.getByRole("img");
		expect(img.getAttribute("alt")).not.toBe("");
		expect(img.getAttribute("alt")?.length).toBeGreaterThan(0);
	});

	it("hides the wordmark on mobile in the SVG path, matching today's nav", async () => {
		getSiteSettings.mockResolvedValue({ logo: null });

		const jsx = await Nav();
		render(jsx);

		const wordmark = screen.getByText("granite");
		expect(wordmark.className).toContain("hidden");
		expect(wordmark.className).toContain("md:inline");
	});
});

// U22 — nav links and the header CTA render from siteSettings when it has
// them, and from today's hardcoded components/data.ts when it does not.
// Fallback is per-collection: navLinks and headerCta are independent fields
// on the same document, so a document with one configured and the other
// blank must not blank out the half that IS configured — each describe
// block below proves its own field falls back on its own.
describe("Nav — navLinks fallback", () => {
	it("renders today's hardcoded nav links, unchanged, when siteSettings has none", async () => {
		getSiteSettings.mockResolvedValue({ logo: null, navLinks: null, headerCta: null });

		const jsx = await Nav();
		render(jsx);

		for (const link of hardcodedNavLinks) {
			const rendered = screen.getAllByText(link.label);
			expect(rendered.length).toBeGreaterThan(0);
			expect(rendered[0].closest("a")?.getAttribute("href")).toBe(link.href);
		}
	});

	it("renders navLinks from siteSettings when present, and drops the hardcoded ones", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			navLinks: [
				{
					label: "Custom Page",
					link: {
						linkType: "external",
						href: "https://example.com",
						openInNewTab: false,
					},
				},
			],
			headerCta: null,
		});

		const jsx = await Nav();
		render(jsx);

		const customLinks = screen.getAllByText("Custom Page");
		expect(customLinks.length).toBeGreaterThan(0);
		expect(customLinks[0].closest("a")?.getAttribute("href")).toBe(
			"https://example.com"
		);

		expect(screen.queryByText(hardcodedNavLinks[0].label)).toBeNull();
	});

	it("skips a navLink whose link fails to resolve, without rendering a dead anchor", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			navLinks: [
				{ label: "Ghost", link: { linkType: "internal", internalRef: null } },
				{
					label: "Real",
					link: { linkType: "external", href: "/somewhere" },
				},
			],
			headerCta: null,
		});

		const jsx = await Nav();
		render(jsx);

		expect(screen.queryByText("Ghost")).toBeNull();
		expect(screen.getAllByText("Real").length).toBeGreaterThan(0);
	});

	it("renders a calBooking navLink as the Cal button, never an <a href>", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			navLinks: [
				{
					label: "Book now",
					link: { linkType: "calBooking", calLink: "team/intro" },
				},
			],
			headerCta: null,
		});

		const jsx = await Nav();
		render(jsx);

		const buttons = screen.getAllByRole("button", { name: "Book now" });
		expect(buttons.length).toBeGreaterThan(0);
		expect(buttons[0].getAttribute("data-cal-link")).toBe("team/intro");
		expect(screen.getAllByText("Book now").every((el) => el.closest("a") === null)).toBe(
			true
		);
	});
});

// P1 finding #4 — siteSettings.logoLink was schema'd, seeded and projected,
// with resolve-site-settings.ts's resolveLogoLink fully implemented, but
// nav.tsx hardcoded the brand-mark Link to "/" instead of resolving it. Nav
// now threads resolveLogoLink's result into NavClient, same as navLinks and
// headerCta above.
describe("Nav — logoLink fallback", () => {
	it("falls back to / when siteSettings has no logoLink", async () => {
		getSiteSettings.mockResolvedValue({ logo: null, logoLink: null });

		const jsx = await Nav();
		render(jsx);

		expect(
			screen.getByText("Granite Marketing home").closest("a")?.getAttribute("href")
		).toBe("/");
	});

	it("falls back to / when logoLink is set but fails to resolve", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			logoLink: { linkType: "internal", internalRef: null },
		});

		const jsx = await Nav();
		render(jsx);

		expect(
			screen.getByText("Granite Marketing home").closest("a")?.getAttribute("href")
		).toBe("/");
	});

	it("reflects a configured logoLink's href, not the / fallback", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			logoLink: { linkType: "external", href: "https://example.com/custom-home" },
		});

		const jsx = await Nav();
		render(jsx);

		expect(
			screen.getByText("Granite Marketing home").closest("a")?.getAttribute("href")
		).toBe("https://example.com/custom-home");
	});

	it("renders a calBooking logoLink as the Cal button, never an <a href>", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			logoLink: { linkType: "calBooking", calLink: "team/logo-booking" },
		});

		const jsx = await Nav();
		render(jsx);

		const brandMarkText = screen.getByText("Granite Marketing home");
		expect(brandMarkText.closest("a")).toBeNull();
		const button = brandMarkText.closest("button");
		expect(button?.getAttribute("data-cal-link")).toBe("team/logo-booking");
	});
});

describe("Nav — headerCta fallback", () => {
	it("renders today's hardcoded CTA button, unchanged, when siteSettings has none", async () => {
		getSiteSettings.mockResolvedValue({ logo: null, navLinks: null, headerCta: null });

		const jsx = await Nav();
		render(jsx);

		const buttons = screen.getAllByRole("button", {
			name: /book an intro call/i,
		});
		expect(buttons.length).toBeGreaterThan(0);
		expect(buttons[0].getAttribute("data-cal-link")).toBe(CAL_LINK);
	});

	it("renders a custom headerCta independently of navLinks staying hardcoded", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			navLinks: null,
			headerCta: {
				label: "Talk to us",
				link: { linkType: "calBooking", calLink: "custom/handle" },
			},
		});

		const jsx = await Nav();
		render(jsx);

		// navLinks still hardcoded — independent fallback.
		expect(
			screen.getAllByText(hardcodedNavLinks[0].label).length
		).toBeGreaterThan(0);

		const buttons = screen.getAllByRole("button", { name: "Talk to us" });
		expect(buttons.length).toBeGreaterThan(0);
		expect(buttons[0].getAttribute("data-cal-link")).toBe("custom/handle");
	});

	it("skips a headerCta whose link fails to resolve, falling back to the hardcoded button", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			navLinks: null,
			headerCta: {
				label: "Talk to us",
				link: { linkType: "internal", internalRef: null },
			},
		});

		const jsx = await Nav();
		render(jsx);

		expect(screen.queryByText("Talk to us")).toBeNull();
		const buttons = screen.getAllByRole("button", {
			name: /book an intro call/i,
		});
		expect(buttons.length).toBeGreaterThan(0);
	});
});
