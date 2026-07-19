import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { complianceLinks, footerColumns as hardcodedFooterColumns } from "../data";

// Footer is a server component (unchanged in that respect) — exercised the
// same way app/__tests__/page.test.tsx exercises Home: `await Footer()` then
// render the resolved JSX.
const getSiteSettings = vi.fn();
vi.mock("@/lib/sanity/queries", () => ({
	getSiteSettings: (...args: unknown[]) => getSiteSettings(...args),
}));

import { Footer } from "../footer";

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(cleanup);

describe("Footer", () => {
	it("renders the inline SVG wordmark when siteSettings has no logo — today's behaviour", async () => {
		getSiteSettings.mockResolvedValue({ logo: null });

		const jsx = await Footer();
		const { container } = render(jsx);

		expect(screen.getByText("granite")).toBeDefined();
		// The compliance bar's Visa/Mastercard <img>s always render — only the
		// brand-mark slot (no accessible name matching either card scheme)
		// must stay logo-free.
		const brandImage = screen
			.getAllByRole("img")
			.find(
				(img) =>
					!["Visa accepted", "Mastercard accepted"].includes(
						img.getAttribute("alt") ?? ""
					)
			);
		expect(brandImage).toBeUndefined();
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders the uploaded logo image when siteSettings.logo is set", async () => {
		getSiteSettings.mockResolvedValue({
			logo: {
				asset: { _ref: "image-abc123-800x200-png", _type: "reference" },
				altText: "Acme Corp",
			},
		});

		const jsx = await Footer();
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

		const jsx = await Footer();
		render(jsx);

		// Two <img> elements always render in the footer (Visa/Mastercard in
		// the compliance bar) — find the brand-mark one specifically rather
		// than assuming it's the only image on the page.
		const images = screen.getAllByRole("img");
		const brandImage = images.find(
			(img) => !["Visa accepted", "Mastercard accepted"].includes(
				img.getAttribute("alt") ?? ""
			)
		);
		expect(brandImage).toBeDefined();
		expect(brandImage?.getAttribute("alt")).not.toBe("");
		expect(brandImage?.getAttribute("alt")?.length).toBeGreaterThan(0);
	});
});

// U22 — footerColumns render from siteSettings when it has them, and from
// today's hardcoded components/data.ts when it does not. Independent of
// Nav's navLinks/headerCta fallback (there is no cross-collection coupling
// on the siteSettings document) and independent of the compliance strip,
// which is covered separately below because it must NEVER come from Sanity.
describe("Footer — footerColumns fallback", () => {
	it("renders today's hardcoded footer columns, unchanged, when siteSettings has none", async () => {
		getSiteSettings.mockResolvedValue({ logo: null, footerColumns: null });

		const jsx = await Footer();
		render(jsx);

		for (const column of hardcodedFooterColumns) {
			expect(screen.getByText(column.heading)).toBeDefined();
			for (const link of column.links) {
				expect(screen.getByText(link.label).closest("a")?.getAttribute("href")).toBe(
					link.href
				);
			}
		}
	});

	it("renders footerColumns from siteSettings when present, and drops the hardcoded ones", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			footerColumns: [
				{
					heading: "Company",
					links: [
						{
							label: "About",
							link: {
								linkType: "external",
								href: "https://example.com/about",
							},
						},
					],
				},
			],
		});

		const jsx = await Footer();
		render(jsx);

		expect(screen.getByText("Company")).toBeDefined();
		expect(screen.getByText("About").closest("a")?.getAttribute("href")).toBe(
			"https://example.com/about"
		);
		expect(screen.queryByText(hardcodedFooterColumns[0].heading)).toBeNull();
	});

	it("skips a footer link whose link fails to resolve, without rendering a dead anchor", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			footerColumns: [
				{
					heading: "Company",
					links: [
						{ label: "Ghost", link: { linkType: "internal", internalRef: null } },
						{ label: "Real", link: { linkType: "external", href: "/real" } },
					],
				},
			],
		});

		const jsx = await Footer();
		render(jsx);

		expect(screen.queryByText("Ghost")).toBeNull();
		expect(screen.getByText("Real")).toBeDefined();
	});

	it("renders a calBooking footer link as the Cal button, never an <a href>", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			footerColumns: [
				{
					heading: "Company",
					links: [
						{
							label: "Book a call",
							link: { linkType: "calBooking", calLink: "team/intro" },
						},
					],
				},
			],
		});

		const jsx = await Footer();
		render(jsx);

		const button = screen.getByRole("button", { name: "Book a call" });
		expect(button.getAttribute("data-cal-link")).toBe("team/intro");
		expect(screen.getByText("Book a call").closest("a")).toBeNull();
	});
});

describe("Footer — compliance strip stays hardcoded", () => {
	it("renders the five compliance links from code when siteSettings has no footerColumns", async () => {
		getSiteSettings.mockResolvedValue({ logo: null, footerColumns: null });

		const jsx = await Footer();
		render(jsx);

		expect(complianceLinks).toHaveLength(5);
		for (const link of complianceLinks) {
			expect(
				screen.getByText(link.label).closest("a")?.getAttribute("href")
			).toBe(link.href);
		}
	});

	it("still renders the five compliance links from code when footerColumns IS set", async () => {
		getSiteSettings.mockResolvedValue({
			logo: null,
			footerColumns: [
				{
					heading: "Company",
					links: [
						{ label: "About", link: { linkType: "external", href: "/about" } },
					],
				},
			],
		});

		const jsx = await Footer();
		render(jsx);

		for (const link of complianceLinks) {
			expect(
				screen.getByText(link.label).closest("a")?.getAttribute("href")
			).toBe(link.href);
		}
	});
});
